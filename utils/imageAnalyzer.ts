import { MediaMetadata, MediaType } from '@/types/forensic';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function detectMediaType(mimeType: string, filename: string): MediaType {
  const lowerMime = (mimeType || '').toLowerCase();
  const lowerExt = (filename || '').toLowerCase().split('.').pop() || '';

  if (
    lowerMime.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(lowerExt)
  ) {
    return 'audio';
  }

  if (
    lowerMime.startsWith('video/') ||
    ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(lowerExt)
  ) {
    return 'video';
  }

  return 'image';
}

export async function extractClientMediaMetadata(file: File): Promise<MediaMetadata> {
  const mediaType = detectMediaType(file.type, file.name);

  const metadata: MediaMetadata = {
    filename: file.name,
    format: file.type || (mediaType === 'audio' ? 'audio/mp3' : mediaType === 'video' ? 'video/mp4' : 'image/jpeg'),
    mediaType,
    fileSizeBytes: file.size,
    fileSizeFormatted: formatFileSize(file.size),
    hasExif: false
  };

  if (mediaType === 'image') {
    // Get image dimensions via HTMLImageElement
    try {
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image for dimensions'));
        };
        img.src = url;
      });
      metadata.dimensions = dimensions;
    } catch (err) {
      console.warn('Could not extract image dimensions:', err);
    }

    // Parse EXIF from ArrayBuffer for JPEG files
    try {
      const buffer = await file.arrayBuffer();
      const exif = parseSimpleExif(buffer);
      if (exif && Object.keys(exif).length > 0) {
        metadata.hasExif = true;
        metadata.exifDetails = exif;
      }
    } catch (err) {
      console.warn('Could not extract EXIF data:', err);
    }
  } else if (mediaType === 'audio') {
    // Extract audio duration
    try {
      const duration = await new Promise<number>((resolve) => {
        const audio = document.createElement('audio');
        const url = URL.createObjectURL(file);
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          resolve(audio.duration);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(0);
        };
        audio.src = url;
      });
      if (duration && !isNaN(duration) && duration > 0) {
        metadata.durationSeconds = parseFloat(duration.toFixed(1));
      }
    } catch (err) {
      console.warn('Could not extract audio metadata:', err);
    }
  } else if (mediaType === 'video') {
    // Extract video dimensions and duration
    try {
      const vidInfo = await new Promise<{ width: number; height: number; duration: number }>((resolve) => {
        const video = document.createElement('video');
        const url = URL.createObjectURL(file);
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          resolve({
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration
          });
        };
        video.onerror = () => {
          URL.revokeObjectURL(url);
          resolve({ width: 0, height: 0, duration: 0 });
        };
        video.src = url;
      });

      if (vidInfo.width > 0 && vidInfo.height > 0) {
        metadata.dimensions = { width: vidInfo.width, height: vidInfo.height };
      }
      if (vidInfo.duration && !isNaN(vidInfo.duration) && vidInfo.duration > 0) {
        metadata.durationSeconds = parseFloat(vidInfo.duration.toFixed(1));
      }
    } catch (err) {
      console.warn('Could not extract video metadata:', err);
    }
  }

  return metadata;
}

// Backward compatibility alias
export async function extractClientImageMetadata(file: File): Promise<MediaMetadata> {
  return extractClientMediaMetadata(file);
}

/**
 * Lightweight pure-TS EXIF parser for JPEG APP1 markers
 */
function parseSimpleExif(buffer: ArrayBuffer): Record<string, string> | null {
  const view = new DataView(buffer);
  if (buffer.byteLength < 4) return null;

  // Check JPEG SOI (0xFFD8)
  if (view.getUint16(0, false) !== 0xffd8) {
    return null;
  }

  let offset = 2;
  const length = buffer.byteLength;

  while (offset < length - 4) {
    const marker = view.getUint16(offset, false);
    offset += 2;

    // APP1 marker (0xFFE1)
    if (marker === 0xffe1) {
      const app1Length = view.getUint16(offset, false);
      offset += 2;

      // Check "Exif\0\0" (0x457869660000)
      if (
        view.getUint32(offset, false) === 0x45786966 &&
        view.getUint16(offset + 4, false) === 0x0000
      ) {
        return parseTiffHeader(view, offset + 6, app1Length - 8);
      }
      offset += app1Length - 2;
    } else if ((marker & 0xff00) === 0xff00 && marker !== 0xff00) {
      // Skip other JPEG markers
      if (marker === 0xffda || marker === 0xffd9) break; // Start of Scan or EOI
      const segLength = view.getUint16(offset, false);
      offset += segLength;
    } else {
      break;
    }
  }

  return null;
}

function parseTiffHeader(view: DataView, tiffStart: number, maxBytes: number): Record<string, string> {
  const details: Record<string, string> = {};

  try {
    const byteOrder = view.getUint16(tiffStart, false);
    const littleEndian = byteOrder === 0x4949; // 'II' = Intel / Little-endian, 'MM' = Motorola / Big-endian

    const firstIfdOffset = view.getUint32(tiffStart + 4, littleEndian);
    if (firstIfdOffset < 8 || firstIfdOffset > maxBytes) return details;

    let ifdOffset = tiffStart + firstIfdOffset;
    const numEntries = view.getUint16(ifdOffset, littleEndian);
    ifdOffset += 2;

    for (let i = 0; i < Math.min(numEntries, 40); i++) {
      const entryOffset = ifdOffset + i * 12;
      if (entryOffset + 12 > view.byteLength) break;

      const tag = view.getUint16(entryOffset, littleEndian);
      const type = view.getUint16(entryOffset + 2, littleEndian);
      const count = view.getUint32(entryOffset + 4, littleEndian);

      // ASCII string values
      if (type === 2 && count > 0 && count < 256) {
        let valueOffset = entryOffset + 8;
        if (count > 4) {
          const valRel = view.getUint32(entryOffset + 8, littleEndian);
          valueOffset = tiffStart + valRel;
        }

        let str = '';
        for (let j = 0; j < count - 1; j++) {
          if (valueOffset + j < view.byteLength) {
            const charCode = view.getUint8(valueOffset + j);
            if (charCode === 0) break;
            str += String.fromCharCode(charCode);
          }
        }
        str = str.trim();

        if (tag === 0x010f) details.make = str; // Make
        else if (tag === 0x0110) details.model = str; // Model
        else if (tag === 0x0131) details.software = str; // Software
        else if (tag === 0x0132) details.dateTime = str; // DateTime
        else if (tag === 0xa434) details.lensModel = str; // LensModel
      }
    }
  } catch (e) {
    console.warn('TIFF parse partial:', e);
  }

  return details;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's an image, compress it first to avoid Vercel 4.5MB payload limits (Error 413)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        const MAX_DIMENSION = 1600; // Resize to max 1600px width/height
        
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 85% quality
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          readFallback(file, resolve, reject);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        readFallback(file, resolve, reject);
      };
      img.src = url;
    } else {
      readFallback(file, resolve, reject);
    }
  });
}

function readFallback(file: File, resolve: (val: string) => void, reject: (err: any) => void) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = (error) => reject(error);
}
