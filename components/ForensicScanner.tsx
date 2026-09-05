'use client';

import React, { useEffect, useState } from 'react';
import { Check, Loader2, Cpu, Terminal, Mic, Video, Image as ImageIcon } from 'lucide-react';
import { MediaType, ScanStage } from '@/types/forensic';

interface ForensicScannerProps {
  currentStage: ScanStage;
  previewUrl: string;
  mediaType?: MediaType;
}

interface StageStep {
  id: ScanStage;
  label: string;
  description: string;
}

export default function ForensicScanner({ currentStage, previewUrl, mediaType = 'image' }: ForensicScannerProps) {
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);

  const isAudio = mediaType === 'audio';
  const isVideo = mediaType === 'video';

  // Context-aware stage descriptions
  const stages: StageStep[] = isAudio
    ? [
        { id: 'media_received', label: 'Audio stream received', description: 'Raw audio binary ingested & container verified' },
        { id: 'image_decoded', label: 'PCM waveform decoded', description: 'Spectrogram generated; 44.1kHz channel separation complete' },
        { id: 'visual_patterns', label: 'Analyzing acoustic acoustics', description: 'Computing room impulse response & pitch contour' },
        { id: 'synthetic_indicators', label: 'Checking neural voice clone', description: 'Scanning HiFi-GAN vocoder phase dispersion & F0 quantization' },
        { id: 'manipulation_signals', label: 'Evaluating noise floor cuts', description: 'Inter-word room tone & acoustic friction continuity probe' },
        { id: 'explainable_assessment', label: 'Generating acoustic dossier', description: 'Synthesizing voice biometrics & trust index' }
      ]
    : isVideo
    ? [
        { id: 'media_received', label: 'Video stream received', description: 'Container parsed and frame rate clock synced' },
        { id: 'image_decoded', label: 'Keyframes demuxed', description: 'Temporal frame sequence extracted; H.264/AV1 decoded' },
        { id: 'visual_patterns', label: 'Tracking optical flow vectors', description: 'Computing parallax and shutter motion velocity' },
        { id: 'synthetic_indicators', label: 'Checking deepfake synthesis', description: 'Scanning facial boundary jitter, warp halos & eye glints' },
        { id: 'manipulation_signals', label: 'Evaluating lip-sync alignment', description: 'Phoneme-to-viseme temporal lag synchronization audit' },
        { id: 'explainable_assessment', label: 'Generating temporal dossier', description: 'Synthesizing frame consistency & deepfake index' }
      ]
    : [
        { id: 'media_received', label: 'Media received', description: 'Raw binary stream ingested and validated' },
        { id: 'image_decoded', label: 'Image decoded', description: 'Color matrix extracted; channel separation complete' },
        { id: 'visual_patterns', label: 'Examining visual patterns', description: 'Computing optical depth and illumination vectors' },
        { id: 'synthetic_indicators', label: 'Checking synthetic indicators', description: 'Scanning Fourier spectrum and latent diffusion noise' },
        { id: 'manipulation_signals', label: 'Evaluating manipulation signals', description: 'Error level analysis (ELA) & splice boundary probe' },
        { id: 'explainable_assessment', label: 'Generating explainable assessment', description: 'Synthesizing multimodal evidence and trust index' }
      ];

  // Dynamic telemetry logs depending on media type
  useEffect(() => {
    const logs = isAudio
      ? [
          '[INIT] Neural acoustic forensic engine v2.4 initialized',
          '[STREAM] Ingesting PCM audio stream: 44.1kHz / 16-bit float',
          '[FFT] Executing Fast Fourier Transform spectrogram decomposition',
          '[PITCH] Fundamental Frequency (F0) stepwise quantization scan',
          '[VOCODER] Neural vocoder phase dispersion test (8kHz-16kHz)',
          '[FORMANT] Linear Predictive Coding (LPC) spectral bandwidth audit',
          '[BREATH] Subglottic airflow & pre-phonatory inhalation check',
          '[NOISE] Inter-word room tone floor continuity test',
          '[SYNTHESIS] Multimodal acoustic correlation and explainability'
        ]
      : isVideo
      ? [
          '[INIT] Neural temporal forensic engine v2.4 initialized',
          '[DEMUX] Demuxing stream: 29.97 FPS H.264 / 1080p stream',
          '[OPTICAL] Calculating Lucas-Kanade optical flow vector field',
          '[LANDMARK] 68-point facial landmark mesh tracking initialized',
          '[WARP] Facial mask perimeter alpha-feathering discontinuity probe',
          '[BLINK] Spontaneous eye blink rate & corneal glint drift audit',
          '[LIP-SYNC] Labial viseme vs acoustic phoneme burst alignment',
          '[RESIDUAL] Inter-frame pixel interpolation vs physical shutter blur',
          '[SYNTHESIS] Temporal deepfake synthesis reasoning finalized'
        ]
      : [
          '[INIT] Neural forensic pipeline v2.4 initialized',
          '[INGEST] Image byte-length verified, headers parsed',
          '[COLOR] Extracting sRGB color profile & luminance matrices',
          '[OPTICAL] Evaluating depth-of-field falloff gradient',
          '[SPECTRAL] Fast Fourier Transform (FFT) high-freq pass...',
          '[DIFFUSION] Checking for periodic latent de-quantization grid...',
          '[RESIDUAL] Poisson-Gaussian shot noise variance test',
          '[ELA] Error Level Analysis Q-matrix variance calculation',
          '[BOUNDARY] Alpha-feathering & edge gradient discontinuity scan',
          '[SYNTHESIS] Multimodal LLM correlation and explainability synthesis'
        ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logs.length) {
        setTelemetryLogs((prev) => [...prev.slice(-5), logs[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isAudio, isVideo]);

  const getStageStatus = (stageId: ScanStage) => {
    const stageOrder: ScanStage[] = [
      'media_received',
      'image_decoded',
      'visual_patterns',
      'synthetic_indicators',
      'manipulation_signals',
      'explainable_assessment',
      'complete'
    ];

    const currentIndex = stageOrder.indexOf(currentStage);
    const stepIndex = stageOrder.indexOf(stageId);

    if (currentStage === 'complete' || stepIndex < currentIndex) {
      return 'done';
    } else if (stepIndex === currentIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        {/* Glow corner decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                DEEP {mediaType.toUpperCase()} FORENSICS IN PROGRESS
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {isAudio
                  ? 'Acoustic Biometrics, Spectral Vocoder & Phase Audit'
                  : isVideo
                  ? 'Temporal Frame Coherence & Deepfake Face-Swap Audit'
                  : 'Multimodal Optical, Structural & Frequency Audit'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Scanning Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Holographic Laser Scanner Window */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[280px] rounded-xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              {isAudio ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#091026] to-[#020512]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/samples/audio-visualizer.svg"
                    alt="Audio Spectrogram"
                    className="w-full h-full object-contain filter contrast-125"
                  />
                </div>
              ) : isVideo ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/samples/video-visualizer.svg"
                    alt="Video Tracking"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Scanning target"
                  className="w-full h-full object-cover filter contrast-105 brightness-95"
                />
              )}

              {/* Holographic HUD Grid */}
              <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

              {/* Sweeping Laser Line */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scanner-laser pointer-events-none" />

              {/* Target Reticle Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-24 h-24 border border-cyan-400/60 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 border border-cyan-400/40 rounded-full" />
                </div>
              </div>

              {/* Corner HUD markers */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 border border-cyan-800 text-[10px] font-mono text-cyan-300">
                {isAudio ? 'ACOUSTIC PASS' : isVideo ? 'TEMPORAL FLOW' : 'SPECTRAL SCAN'}
              </div>
            </div>

            {/* Simulated Live Telemetry Log Box */}
            <div className="w-full max-w-[280px] mt-4 p-2.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1 border-b border-slate-900 pb-1">
                <Terminal className="w-3 h-3" />
                <span>FORENSIC TELEMETRY</span>
              </div>
              <div className="space-y-0.5 overflow-hidden">
                {telemetryLogs.map((log, i) => (
                  <div key={i} className="truncate text-slate-300">
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stage Progression Checklist */}
          <div className="md:col-span-7 space-y-3.5">
            {stages.map((stage) => {
              const status = getStageStatus(stage.id);

              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3.5 ${
                    status === 'done'
                      ? 'bg-slate-900/80 border-cyan-900/50 text-slate-200'
                      : status === 'active'
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.01]'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="mt-0.5 shrink-0">
                    {status === 'done' ? (
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : status === 'active' ? (
                      <div className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 font-mono text-[10px]">
                        ○
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold tracking-wide ${
                          status === 'done'
                            ? 'text-cyan-300'
                            : status === 'active'
                            ? 'text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        {status === 'done' ? `✓ ${stage.label}` : status === 'active' ? `⟳ ${stage.label}` : stage.label}
                      </span>
                      {status === 'active' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 animate-pulse border border-cyan-700">
                          PROCESSING
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${
                        status === 'done'
                          ? 'text-slate-400'
                          : status === 'active'
                          ? 'text-cyan-200/80'
                          : 'text-slate-600'
                      }`}
                    >
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
