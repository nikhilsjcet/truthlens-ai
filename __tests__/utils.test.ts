import { formatFileSize, detectMediaType } from '../utils/imageAnalyzer';

describe('imageAnalyzer utils', () => {
  it('formats file sizes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
  });

  it('detects media types correctly', () => {
    expect(detectMediaType('image/png', 'file.png')).toBe('image');
    expect(detectMediaType('audio/mp3', 'file.mp3')).toBe('audio');
    expect(detectMediaType('video/mp4', 'file.mp4')).toBe('video');
  });
});
