'use client';

import React from 'react';
import { ShieldAlert, Scan, ArrowDown, Activity, Sparkles, CheckCircle } from 'lucide-react';

interface HeroProps {
  onAnalyzeClick: () => void;
  onTryDemoClick: () => void;
}

export default function Hero({ onAnalyzeClick, onTryDemoClick }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background Cyber Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <Scan className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>GENAI FORENSIC VERIFICATION ENGINE</span>
          <span className="text-cyan-600">•</span>
          <span className="text-slate-300">MIL-STD METADATA AUDIT</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 text-3xl sm:text-5xl md:text-6xl tracking-wider">
            TRUELENS AI
          </span>
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
            Don&apos;t just see it. Verify it.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          AI-powered media authenticity intelligence for a world where seeing is no longer believing.
          Detect synthetic diffusion artifacts, composite splices, and manipulated pixels in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onAnalyzeClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Scan className="w-4 h-4 text-slate-950" />
            <span>Analyze Media</span>
          </button>

          <button
            onClick={onTryDemoClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 text-slate-200 font-semibold text-sm hover:text-white hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Try Demo</span>
          </button>
        </div>

        {/* Live Forensic Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-slate-800/60 font-mono text-left">
          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>LATENCY</span>
            </div>
            <div className="text-base font-bold text-white">&lt; 1.2s avg</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Accelerated Vision</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>CLASSIFICATION</span>
            </div>
            <div className="text-base font-bold text-white">Probabilistic</div>
            <div className="text-[10px] text-purple-400 mt-0.5">Zero false certainty</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Scan className="w-3.5 h-3.5 text-emerald-400" />
              <span>FORENSIC SIGNALS</span>
            </div>
            <div className="text-base font-bold text-white">Multi-Layer</div>
            <div className="text-[10px] text-slate-400 mt-0.5">FFT, ELA, EXIF</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPLAINABILITY</span>
            </div>
            <div className="text-base font-bold text-white">100% Audited</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">5-Point Reasoning</div>
          </div>
        </div>
      </div>
    </section>
  );
}
