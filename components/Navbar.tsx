'use client';

import React from 'react';
import { Shield, Eye, Sparkles, Mic, Video, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  onSelectPreset: (presetKey: string) => void;
}

export default function Navbar({ onSelectPreset }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-900/30 bg-[#070a12]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Shield className="w-5 h-5 text-cyan-400" />
            <Eye className="w-3 h-3 text-white absolute" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-wider text-white">
                SOOKSHMA<span className="text-cyan-400">DARSHINI</span>
                <span className="text-xs ml-1.5 px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                  AI
                </span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase font-mono hidden sm:block">
              Don&apos;t just see it. Verify it.
            </p>
          </div>
        </div>

        {/* Engine Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Engine v2.4</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">Multimodal Active (Image • Audio • Video)</span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Buttons */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/70 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <span className="px-2 text-slate-400 text-[11px] font-mono">Demos:</span>
            <button
              onClick={() => onSelectPreset('authentic')}
              className="px-2 py-1 rounded text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 transition-colors flex items-center gap-1"
              title="Load Authentic Photography preset"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Nature</span>
            </button>
            <button
              onClick={() => onSelectPreset('aiGenerated')}
              className="px-2 py-1 rounded text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors flex items-center gap-1"
              title="Load AI Generated Image preset"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Midjourney</span>
            </button>
            <button
              onClick={() => onSelectPreset('audioVoiceClone')}
              className="px-2 py-1 rounded text-purple-400 hover:bg-purple-950/40 hover:text-purple-300 transition-colors flex items-center gap-1"
              title="Load Audio Voice Clone preset"
            >
              <Mic className="w-3 h-3" />
              <span>Voice Clone</span>
            </button>
            <button
              onClick={() => onSelectPreset('videoDeepfake')}
              className="px-2 py-1 rounded text-blue-400 hover:bg-blue-950/40 hover:text-blue-300 transition-colors flex items-center gap-1"
              title="Load Video Deepfake preset"
            >
              <Video className="w-3 h-3" />
              <span>Deepfake Video</span>
            </button>
          </div>

          <a
            href="#analyzer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Media</span>
          </a>
        </div>
      </div>
    </header>
  );
}
