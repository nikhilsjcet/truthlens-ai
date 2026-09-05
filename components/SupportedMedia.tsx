'use client';

import React from 'react';
import { Image as ImageIcon, Mic, Video, CheckCircle } from 'lucide-react';

export default function SupportedMedia() {
  const mediaModules = [
    {
      id: 'image',
      title: 'IMAGE FORENSICS',
      status: 'Fully supported',
      isActive: true,
      icon: ImageIcon,
      accent: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      features: [
        'Multimodal Vision Analysis',
        'Spectral Fourier (FFT) Artifacts',
        'EXIF Header & Hardware Audits',
        'Error Level Analysis (ELA) Splice Probe'
      ]
    },
    {
      id: 'audio',
      title: 'AUDIO FORENSICS',
      status: 'Fully supported',
      isActive: true,
      icon: Mic,
      accent: 'border-purple-500/50 bg-purple-950/20 text-purple-400',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      features: [
        'Voice clone biometrics detection',
        'Spectral phase anomaly scanning',
        'Synthetic breath pattern checks',
        'Fundamental Frequency (F0) quantization'
      ]
    },
    {
      id: 'video',
      title: 'VIDEO FORENSICS',
      status: 'Fully supported',
      isActive: true,
      icon: Video,
      accent: 'border-blue-500/50 bg-blue-950/20 text-blue-400',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      features: [
        'Temporal frame-by-frame coherence',
        'Lip-sync phoneme divergence audit',
        'Facial boundary jitter tracking',
        'Deepfake face-swap boundary probe'
      ]
    }
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
      <div className="text-center mb-12">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/60">
          MULTIMODAL CAPABILITIES
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          SUPPORTED MEDIA MODALITIES
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 mt-3">
          Comprehensive synthetic media detection engineered to scale across images, spoken audio, and video footage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mediaModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="glass-card rounded-2xl p-6 border border-cyan-500/30 flex flex-col justify-between relative shadow-[0_0_30px_rgba(6,182,212,0.12)]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl border ${mod.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${mod.badge}`}>
                    {mod.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {mod.title}
                </h3>

                <ul className="space-y-2 mt-4 text-xs font-mono text-slate-300">
                  {mod.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-200">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Active in TRUELENS AI
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
