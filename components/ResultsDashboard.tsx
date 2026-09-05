'use client';

import React from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  RotateCcw,
  Download,
  Info,
  Layers,
  Cpu,
  Camera,
  Compass,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Mic,
  Video,
  Volume2,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import { ForensicAnalysisResult, SeverityType } from '@/types/forensic';

interface ResultsDashboardProps {
  result: ForensicAnalysisResult;
  onReset: () => void;
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const {
    trustScore,
    classification,
    confidence,
    summary,
    aiIndicators,
    manipulationIndicators,
    explanation,
    whyEvidence,
    metadata,
    sourceVerification,
    recommendation,
    analyzedImageUrl,
    analyzedMediaUrl,
    isDemo,
    mediaType = 'image'
  } = result;

  const displayMediaUrl = analyzedMediaUrl || analyzedImageUrl || '';

  // Determine color scheme based on Trust Score
  const isHighTrust = trustScore >= 75;
  const isSuspicious = trustScore >= 40 && trustScore < 75;
  const isLowTrust = trustScore < 40;

  const scoreTheme = isHighTrust
    ? {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)]',
        stroke: '#10b981',
        badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
      }
    : isSuspicious
    ? {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)]',
        stroke: '#f59e0b',
        badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-700/60'
      }
    : {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/40',
        glow: 'shadow-[0_0_35px_rgba(244,63,94,0.25)]',
        stroke: '#f43f5e',
        badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-700/60'
      };

  // Circular gauge math (radius = 70)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (trustScore / 100) * circumference;

  const getSeverityBadge = (severity: SeverityType) => {
    switch (severity) {
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 text-rose-400 border border-rose-800">
            HIGH SEVERITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
            MEDIUM SEVERITY
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            LOW SEVERITY
          </span>
        );
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TRUELENS-forensic-${result.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSearchWeb = () => {
    const query = encodeURIComponent(
      sourceVerification?.webSearchQuery || `${mediaType} verification ${metadata.filename}`
    );
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const handleReverseSearch = () => {
    const url = sourceVerification?.reverseImageSearchUrl || 'https://images.google.com/';
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-24 animate-in fade-in duration-500">
      {/* Top Completion Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {mediaType.toUpperCase()} ANALYSIS COMPLETE
            </span>
            {isDemo && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60">
                BENCHMARK DATASET
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Forensic Intelligence Dossier
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportJson}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onReset}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze Another</span>
          </button>
        </div>
      </div>

      {/* Hero Score Showcase Card */}
      <div className={`glass-card rounded-2xl p-6 sm:p-8 border ${scoreTheme.border} ${scoreTheme.glow} mb-10 relative overflow-hidden`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Circular Trust Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">
              AUTHENTICITY INDEX
            </span>

            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Score meter fill */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={scoreTheme.stroke}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${scoreTheme.text} tracking-tight`}>
                  {trustScore}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase">
                  / 100
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  TRUST SCORE
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${scoreTheme.badgeBg}`}>
                {classification}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Confidence: <strong className="text-white">{confidence}%</strong>
              </span>
            </div>
          </div>

          {/* Right: Evaluated Media & Executive Summary */}
          <div className="md:col-span-8 flex flex-col justify-between h-full space-y-4">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Media Preview Thumbnail / Player */}
              <div className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-slate-700 bg-black shadow-md flex items-center justify-center">
                {mediaType === 'audio' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-b from-purple-950/50 to-black text-purple-300">
                    <Volume2 className="w-8 h-8 text-purple-400 animate-pulse mb-1" />
                    <span className="text-[10px] font-mono text-purple-300 font-bold">AUDIO TRACK</span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {metadata.durationSeconds ? `${metadata.durationSeconds}s` : 'PCM Stream'}
                    </span>
                  </div>
                ) : mediaType === 'video' ? (
                  <div className="w-full h-full relative">
                    {displayMediaUrl.startsWith('data:video') ? (
                      <video src={displayMediaUrl} controls className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={displayMediaUrl} alt="Video frame" className="w-full h-full object-cover" />
                    )}
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-blue-300">
                      VIDEO
                    </span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayMediaUrl}
                    alt="Analyzed subject"
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-cyan-300">
                  AUDITED
                </span>
              </div>

              {/* Section 1: OVERALL ASSESSMENT */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold">
                    1. OVERALL ASSESSMENT
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  {summary}
                </p>
                {result.visualAnalysis && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed border-t border-slate-800 pt-2">
                    <strong className="text-slate-300">
                      {mediaType === 'audio'
                        ? 'Acoustic Biometrics Analysis:'
                        : mediaType === 'video'
                        ? 'Temporal Video Dynamics:'
                        : 'Optical Analysis:'}
                    </strong>{' '}
                    {result.visualAnalysis}
                  </p>
                )}

                {/* Embedded Audio Player if media is audio */}
                {mediaType === 'audio' && displayMediaUrl && displayMediaUrl.startsWith('data:audio') && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-purple-800/40">
                    <audio controls src={displayMediaUrl} className="w-full h-8" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics Capsule tailored by media type */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">
                  {mediaType === 'audio'
                    ? 'VOICE CLONE RISK'
                    : mediaType === 'video'
                    ? 'DEEPFAKE RISK'
                    : 'AI GENERATION RISK'}
                </span>
                <span className={`font-bold ${isLowTrust ? 'text-rose-400' : 'text-slate-200'}`}>
                  {isLowTrust ? 'HIGH' : isSuspicious ? 'MODERATE' : 'MINIMAL'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">
                  {mediaType === 'audio'
                    ? 'VOCODER RESIDUALS'
                    : mediaType === 'video'
                    ? 'TEMPORAL JITTER'
                    : 'COMPOSITE SPLICING'}
                </span>
                <span className={`font-bold ${isSuspicious || isLowTrust ? 'text-amber-400' : 'text-slate-200'}`}>
                  {isSuspicious || isLowTrust ? 'DETECTED' : 'UNLIKELY'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">
                  {mediaType === 'image' ? 'METADATA STATUS' : 'STREAM TELEMETRY'}
                </span>
                <span className={`font-bold ${metadata.hasExif ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {metadata.hasExif ? 'HARDWARE EXIF' : 'UNMODIFIED STREAM'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Sections: AI Indicators & Manipulation Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Section 2: AI GENERATION INDICATORS */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-mono uppercase tracking-wider text-slate-200 font-bold">
                  2. {mediaType.toUpperCase()} SYNTHESIS INDICATORS
                </h3>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                {aiIndicators.length} Found
              </span>
            </div>

            <div className="space-y-3">
              {aiIndicators.map((ind, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {ind.title}
                    </h4>
                    {getSeverityBadge(ind.severity)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ind.explanation}
                  </p>
                </div>
              ))}

              {aiIndicators.length === 0 && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
                  No synthetic generative patterns or neural vocoder anomalies detected.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: MANIPULATION ANALYSIS */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-mono uppercase tracking-wider text-slate-200 font-bold">
                  3. MANIPULATION ANALYSIS
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                {manipulationIndicators.length} Signals
              </span>
            </div>

            <div className="space-y-3">
              {manipulationIndicators.map((man, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {man.title}
                    </h4>
                    {getSeverityBadge(man.severity)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {man.explanation}
                  </p>
                </div>
              ))}

              {manipulationIndicators.length === 0 && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
                  No post-capture splicing, inpainting, or composite boundaries found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: WHY DID TRUELENS REACH THIS RESULT? (Explainability) */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-900/40 mb-10">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                4. WHY DID TRUELENS REACH THIS RESULT?
              </h3>
              <p className="text-xs text-slate-400">
                Transparent 5-pillar forensic reasoning chain based strictly on observed {mediaType} signals
              </p>
            </div>
          </div>

          <span className="hidden sm:block text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/60">
            Explainable AI Verified
          </span>
        </div>

        {/* Explainability Synthesis Text */}
        {explanation && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-cyan-300 font-mono block mb-1">FORENSIC RATIONALE:</strong>
            {explanation}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {whyEvidence.map((ev, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                ev.isAnomaly
                  ? 'bg-rose-950/20 border-rose-600/30 text-rose-100'
                  : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider">
                    {ev.category}
                  </span>
                  {ev.isAnomaly ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-white mb-2 leading-snug">
                  {ev.title}
                </h4>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {ev.finding}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono flex items-center gap-1">
                <span className={ev.isAnomaly ? 'text-rose-400' : 'text-emerald-400'}>
                  {ev.isAnomaly ? '● Anomaly Flagged' : '✓ Coherent'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Sections: 5. Source & Metadata & 6. Source Verification */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
        {/* Section 5: SOURCE & METADATA */}
        <div className="md:col-span-7 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-200 font-bold">
                5. SOURCE &amp; METADATA
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Binary Header Audit
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono mb-4">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">FILE</span>
              <span className="font-semibold text-white truncate block">{metadata.filename}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">FORMAT</span>
              <span className="font-semibold text-white">{metadata.format}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">SIZE</span>
              <span className="font-semibold text-white">{metadata.fileSizeFormatted}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">
                {metadata.durationSeconds ? 'DURATION' : 'RESOLUTION'}
              </span>
              <span className="font-semibold text-white">
                {metadata.durationSeconds
                  ? `${metadata.durationSeconds}s`
                  : metadata.dimensions
                  ? `${metadata.dimensions.width}×${metadata.dimensions.height}`
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* EXIF Details Table if available */}
          {metadata.hasExif && metadata.exifDetails ? (
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 font-mono text-xs">
              <div className="text-[11px] text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Hardware EXIF Telemetry Extracted</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                {metadata.exifDetails.make && (
                  <div>
                    <span className="text-slate-400">Make:</span>{' '}
                    <span className="text-slate-200">{metadata.exifDetails.make}</span>
                  </div>
                )}
                {metadata.exifDetails.model && (
                  <div>
                    <span className="text-slate-400">Model:</span>{' '}
                    <span className="text-slate-200">{metadata.exifDetails.model}</span>
                  </div>
                )}
                {metadata.exifDetails.software && (
                  <div>
                    <span className="text-slate-400">Software:</span>{' '}
                    <span className="text-slate-200">{metadata.exifDetails.software}</span>
                  </div>
                )}
                {metadata.exifDetails.dateTime && (
                  <div>
                    <span className="text-slate-400">Timestamp:</span>{' '}
                    <span className="text-slate-200">{metadata.exifDetails.dateTime}</span>
                  </div>
                )}
                {metadata.exifDetails.lensModel && (
                  <div className="col-span-2 truncate">
                    <span className="text-slate-400">Lens:</span>{' '}
                    <span className="text-slate-200">{metadata.exifDetails.lensModel}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">
                  Metadata unavailable. This does not by itself indicate manipulation.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Most messaging apps, social networks (X, Instagram, Telegram), and web platforms strip container metadata to protect user privacy.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: SOURCE VERIFICATION */}
        <div className="md:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-mono uppercase tracking-wider text-slate-200 font-bold">
                  6. SOURCE VERIFICATION
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                External Pivot
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {sourceVerification?.guidance ||
                'Verify provenance by cross-referencing features against public registries, fact-checking archives, and web indexes.'}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleSearchWeb}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Search Web Provenance</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={handleReverseSearch}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{mediaType === 'image' ? 'Reverse Image Search' : 'Fact-Check Search'}</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Audit record created: {result.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Section 7: FINAL RECOMMENDATION & DISCLAIMER */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-300 font-bold mb-1">
              7. FINAL RECOMMENDATION
            </h3>
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>

        {/* Mandatory Forensic Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Forensic Disclaimer:</strong> TRUELENS provides AI-assisted assessment, not definitive forensic proof. Verify important claims using independent sources.
          </p>
        </div>
      </div>
    </div>
  );
}
