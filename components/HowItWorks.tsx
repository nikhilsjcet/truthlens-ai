'use client';

import React from 'react';
import { UploadCloud, Cpu, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Upload',
      desc: 'Ingest image, audio, or video files with full binary telemetry and metadata preservation.',
      icon: UploadCloud,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30'
    },
    {
      step: '02',
      title: 'Analyze',
      desc: 'Multimodal vision models probe micro-textures, Fourier frequencies, and lighting vectors.',
      icon: Cpu,
      color: 'text-purple-400',
      border: 'border-purple-500/30'
    },
    {
      step: '03',
      title: 'Understand',
      desc: 'Review explainable forensic indicators, severity tiers, and clear visual breakdown reasons.',
      icon: Compass,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    {
      step: '04',
      title: 'Verify',
      desc: 'Access actionable recommendations and launch reverse image searches for source confirmation.',
      icon: CheckCircle2,
      color: 'text-blue-400',
      border: 'border-blue-500/30'
    }
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
      <div className="text-center mb-12">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/60">
          OPERATIONAL WORKFLOW
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          HOW IT WORKS
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 mt-3">
          A standardized, forensic-grade verification pipeline engineered for transparency and speed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card-interactive rounded-2xl p-6 border border-slate-800 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {item.step}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-slate-900 border ${item.border} ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-[11px] font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                <span>Phase {item.step} Protocol</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
