'use client';

import React from 'react';
import { Eye, ShieldCheck, Cpu, Layers } from 'lucide-react';

export default function WhySookshmadarshini() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
      <div className="text-center mb-12">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/60">
          INTELLIGENCE BRIEFING
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          WHY SOOKSHMADARSHINI?
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          AI-generated content is becoming increasingly difficult to distinguish from authentic media.
          Sookshmadarshini combines AI-assisted multimodal analysis, manipulation indicators, metadata and source context into one explainable verification workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card-interactive rounded-2xl p-6 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Multimodal AI Forensics
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Examines spectral Fourier residuals, latent diffusion checkerboards, and localized compression matrices beyond human perceptual limits.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card-interactive rounded-2xl p-6 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Explainable &quot;Why?&quot; Evidence
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            No black-box guesses. We deconstruct results across 5 forensic pillars: visual consistency, texture patterns, lighting, facial geometry, and metadata.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card-interactive rounded-2xl p-6 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Probabilistic Honesty
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We follow rigorous forensic ethics: no false certainty claims, clear separation of observations from conclusions, and realistic metadata interpretation.
          </p>
        </div>
      </div>
    </section>
  );
}
