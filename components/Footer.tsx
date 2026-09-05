'use client';

import React from 'react';
import { Shield, Eye, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-[#05070d] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40">
              <Shield className="w-4 h-4 text-cyan-400" />
              <Eye className="w-2.5 h-2.5 text-white absolute" />
            </div>
            <div>
              <span className="font-bold text-white tracking-wider">
                TRUELENS <span className="text-cyan-400">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">
                &quot;Don&apos;t just see it. Verify it.&quot;
              </p>
            </div>
          </div>

          {/* Ethics statement */}
          <div className="text-center md:text-left max-w-md text-[11px] text-slate-400 leading-relaxed">
            TRUELENS AI operates under open, explainable, and probabilistic verification standards.
            No false certainty. Built for transparency in the GenAI era.
          </div>

          {/* Hackathon metadata */}
          <div className="flex flex-col items-center md:items-end gap-1 font-mono text-[11px]">
            <div className="flex items-center gap-1 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>4-Hour Hackathon Production MVP</span>
            </div>
            <div className="text-slate-400">
              Powered by Google Gemini Multimodal Vision
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-mono">
          <div>
            &copy; {new Date().getFullYear()} TRUELENS AI. All media processed securely client &amp; server side.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-cyan-400 cursor-pointer">Privacy Protocol</span>
            <span>•</span>
            <span className="hover:text-cyan-400 cursor-pointer">Forensic Methodologies</span>
            <span>•</span>
            <span className="hover:text-cyan-400 cursor-pointer">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
