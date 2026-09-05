'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Mic,
  Video,
  Sparkles,
  X,
  FileCheck,
  AlertCircle,
  Info,
  Play,
  Volume2,
  Film
} from 'lucide-react';
import { MediaMetadata, MediaType } from '@/types/forensic';
import { extractClientMediaMetadata, fileToBase64 } from '@/utils/imageAnalyzer';

interface ImageUploaderProps {
  onAnalyze: (fileData: { base64: string; metadata: MediaMetadata; previewUrl: string }) => void;
  onSelectPreset: (presetKey: string) => void;
  isAnalyzing: boolean;
}

export default function ImageUploader({ onAnalyze, onSelectPreset, isAnalyzing }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeMediaFilter, setActiveMediaFilter] = useState<'all' | 'image' | 'audio' | 'video'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    // Image
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    // Audio
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/x-m4a',
    'audio/m4a',
    'audio/aac',
    'audio/flac',
    'audio/webm',
    // Video
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska'
  ];

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);

    const fileType = file.type.toLowerCase();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    const isKnownExt = [
      'jpg', 'jpeg', 'png', 'webp',
      'mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac',
      'mp4', 'webm', 'mov', 'mkv'
    ].includes(fileExt);

    if (!supportedFormats.includes(fileType) && !isKnownExt) {
      setErrorMsg('Unsupported format. Please upload JPG, PNG, WEBP, MP3, WAV, AAC, MP4, or WEBM.');
      return;
    }

    // Check size limit: 30MB for video/audio, 15MB for images
    const maxLimit = fileType.startsWith('video/') ? 40 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxLimit) {
      setErrorMsg(`File exceeds ${Math.round(maxLimit / (1024 * 1024))}MB limit. Please select a smaller media file.`);
      return;
    }

    try {
      const meta = await extractClientMediaMetadata(file);
      const base64 = await fileToBase64(file);
      setSelectedFile(file);
      setMetadata(meta);
      setPreviewUrl(base64);
    } catch (err) {
      console.error('File parsing error:', err);
      setErrorMsg('Failed to process media file. Please try again.');
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMetadata(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = () => {
    if (!previewUrl || !metadata) return;
    onAnalyze({
      base64: previewUrl,
      metadata,
      previewUrl
    });
  };

  return (
    <div id="analyzer" className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 scroll-mt-24">
      {/* Upload Box Container */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-900/40 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Multimodal Authenticity Scanner</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload images, audio tracks, or video footage for deep forensic intelligence
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-300">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>IMAGE</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-purple-300">
              <Mic className="w-3.5 h-3.5 text-purple-400" />
              <span>AUDIO</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-blue-300">
              <Video className="w-3.5 h-3.5 text-blue-400" />
              <span>VIDEO</span>
            </span>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upload Dropzone OR Preview Card */}
        {!previewUrl ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed transition-all p-8 sm:p-12 text-center flex flex-col items-center justify-center relative group ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
                : 'border-slate-700/80 hover:border-cyan-500/60 hover:bg-slate-900/50 bg-slate-900/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.mp3,.wav,.ogg,.m4a,.aac,.flac,.mp4,.webm,.mov"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-purple-950/50 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-115 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all">
                <UploadCloud className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7" />
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Drag &amp; drop your image, audio, or video here, or{' '}
              <span className="text-cyan-400 underline underline-offset-4">browse files</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-6">
              Supports JPG, PNG, WEBP, MP3, WAV, AAC, MP4, and WEBM. All forensic telemetry is processed securely on the server.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-4 py-2 rounded-full border border-slate-800">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Metadata Preservation • Acoustic FFT • Temporal Tracking</span>
            </div>
          </div>
        ) : (
          /* Preview State */
          <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Media Preview Window */}
              <div className="md:col-span-5 relative group">
                {metadata?.mediaType === 'audio' ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-purple-500/40 bg-gradient-to-b from-slate-900 to-black p-4 flex flex-col justify-between shadow-lg relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-950/80 text-[10px] font-mono text-purple-300 border border-purple-800/60 flex items-center gap-1.5">
                        <Volume2 className="w-3 h-3 text-purple-400" />
                        AUDIO BUFFER
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {metadata.durationSeconds ? `${metadata.durationSeconds}s` : 'PCM Audio'}
                      </span>
                    </div>

                    {/* Waveform Graphic */}
                    <div className="flex items-center justify-center gap-1.5 h-16 my-auto">
                      {[35, 60, 90, 45, 80, 100, 70, 40, 85, 95, 60, 30, 75, 90, 50, 65, 80, 45, 30].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 via-purple-500 to-pink-500 animate-pulse"
                        />
                      ))}
                    </div>

                    <audio controls src={previewUrl} className="w-full h-8 mt-2" />
                  </div>
                ) : metadata?.mediaType === 'video' ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-blue-500/40 bg-black shadow-lg relative">
                    <video
                      controls
                      src={previewUrl}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-blue-300 border border-blue-800/60 flex items-center gap-1.5 pointer-events-none">
                      <Film className="w-3 h-3 text-blue-400" />
                      VIDEO BUFFER
                    </span>
                  </div>
                ) : (
                  <div className="relative aspect-video sm:aspect-square w-full rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-cyan-400" />
                      IMAGE BUFFER
                    </span>
                  </div>
                )}
              </div>

              {/* File Details & Actions */}
              <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      Target {metadata?.mediaType?.toUpperCase()} Metadata
                    </span>
                    <button
                      onClick={handleClear}
                      disabled={isAnalyzing}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                      title="Remove media"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-lg font-bold text-white truncate mb-1">
                    {metadata?.filename}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 my-4">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">FILE SIZE</span>
                      <span className="font-semibold text-white">{metadata?.fileSizeFormatted}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">
                        {metadata?.mediaType === 'audio' ? 'DURATION' : 'DIMENSIONS / DURATION'}
                      </span>
                      <span className="font-semibold text-white">
                        {metadata?.durationSeconds
                          ? `${metadata.durationSeconds}s`
                          : metadata?.dimensions
                          ? `${metadata.dimensions.width} × ${metadata.dimensions.height} px`
                          : 'Probing stream...'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">CONTAINER ENCODING</span>
                      <span className="font-semibold text-white">{metadata?.format}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">TELEMETRY TAGS</span>
                      <span className={metadata?.hasExif ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                        {metadata?.hasExif ? 'Hardware EXIF' : 'Standard Stream'}
                      </span>
                    </div>
                  </div>

                  {metadata?.hasExif && metadata.exifDetails?.make && (
                    <div className="text-[11px] font-mono text-cyan-300/80 bg-cyan-950/30 p-2 rounded border border-cyan-900/40 mb-4">
                      Captured with: {metadata.exifDetails.make} {metadata.exifDetails.model || ''}
                    </div>
                  )}

                  {!metadata?.hasExif && (
                    <div className="text-[11px] text-slate-400 flex items-start gap-1.5 mb-4">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>Missing metadata is common across web uploads and does not by itself indicate manipulation.</span>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleStartAnalysis}
                    disabled={isAnalyzing}
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 text-slate-950 font-bold text-sm hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{isAnalyzing ? `Analyzing ${metadata?.mediaType}...` : `Analyze ${metadata?.mediaType || 'Media'}`}</span>
                  </button>

                  <button
                    onClick={handleClear}
                    disabled={isAnalyzing}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Preset Selector Bar across Image, Audio, and Video */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">VERIFIED BENCHMARK MULTIMODAL SAMPLES:</span>
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">100% Reliable Offline Demos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Preset 1: Authentic Nature (Image) */}
            <button
              onClick={() => onSelectPreset('authentic')}
              disabled={isAnalyzing}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-emerald-400" />
                  Nature Raw
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  91/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Nikon D850 raw capture with authentic CMOS sensor grain.
              </p>
            </button>

            {/* Preset 2: AI Generated Image */}
            <button
              onClick={() => onSelectPreset('aiGenerated')}
              disabled={isAnalyzing}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/50 text-left transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 group-hover:text-rose-300 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-rose-400" />
                  Midjourney v6
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 text-rose-400 border border-rose-800/50">
                  18/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Diffusion portrait with Fourier frequency artifacts.
              </p>
            </button>

            {/* Preset 3: Manipulated Image */}
            <button
              onClick={() => onSelectPreset('manipulated')}
              disabled={isAnalyzing}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-amber-400" />
                  Spliced Press
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-amber-400 border border-amber-800/50">
                  48/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Inpainted central subject with ELA compression boundary error.
              </p>
            </button>

            {/* Preset 4: Audio Voice Clone */}
            <button
              onClick={() => onSelectPreset('audioVoiceClone')}
              disabled={isAnalyzing}
              className="p-3 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-800/50 hover:border-purple-400 text-left transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-purple-200 group-hover:text-purple-300 flex items-center gap-1">
                  <Mic className="w-3 h-3 text-purple-400" />
                  Voice Clone
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 text-rose-400 border border-rose-800/50">
                  14/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Neural TTS voice clone with vocoder phase dispersion.
              </p>
            </button>

            {/* Preset 5: Deepfake Video */}
            <button
              onClick={() => onSelectPreset('videoDeepfake')}
              disabled={isAnalyzing}
              className="p-3 rounded-xl bg-blue-950/20 hover:bg-blue-900/30 border border-blue-800/50 hover:border-blue-400 text-left transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-blue-200 group-hover:text-blue-300 flex items-center gap-1">
                  <Video className="w-3 h-3 text-blue-400" />
                  Deepfake Video
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 text-rose-400 border border-rose-800/50">
                  22/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Face-swap deepfake with temporal jitter &amp; lip-sync lag.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
