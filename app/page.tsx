'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ImageUploader from '@/components/ImageUploader';
import ForensicScanner from '@/components/ForensicScanner';
import ResultsDashboard from '@/components/ResultsDashboard';
import WhySookshmadarshini from '@/components/WhySookshmadarshini';
import HowItWorks from '@/components/HowItWorks';
import SupportedMedia from '@/components/SupportedMedia';
import Footer from '@/components/Footer';
import { ForensicAnalysisResult, MediaMetadata, MediaType, ScanStage } from '@/types/forensic';
import { DEMO_PRESETS } from '@/data/demoData';
import { AlertCircle, RotateCcw, Sparkles, RefreshCw } from 'lucide-react';

export default function Home() {
  // Scanning and analysis state
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [activePreviewUrl, setActivePreviewUrl] = useState<string>('');
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('image');
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState<boolean>(false);
  const [lastUploadedData, setLastUploadedData] = useState<{
    base64: string;
    metadata: MediaMetadata;
    previewUrl: string;
  } | null>(null);

  // Helper to step through the requested forensic scan animation stages
  const runForensicAnimation = async (previewUrl: string, mediaType: MediaType = 'image'): Promise<void> => {
    setActivePreviewUrl(previewUrl);
    setActiveMediaType(mediaType);
    setAnalysisResult(null);
    setErrorMsg(null);
    setIsConfigError(false);

    setScanStage('media_received');
    await new Promise((r) => setTimeout(r, 450));

    setScanStage('image_decoded');
    await new Promise((r) => setTimeout(r, 550));

    setScanStage('visual_patterns');
    await new Promise((r) => setTimeout(r, 600));

    setScanStage('synthetic_indicators');
    await new Promise((r) => setTimeout(r, 650));

    setScanStage('manipulation_signals');
    await new Promise((r) => setTimeout(r, 600));

    setScanStage('explainable_assessment');
    await new Promise((r) => setTimeout(r, 600));
  };

  // 1. Handle Real File Analysis via /api/analyze (Server-side GEMINI_API_KEY)
  const handleAnalyzeUpload = async (fileData: {
    base64: string;
    metadata: MediaMetadata;
    previewUrl: string;
  }) => {
    setErrorMsg(null);
    setIsConfigError(false);
    setLastUploadedData(fileData);

    try {
      const type = fileData.metadata.mediaType || 'image';

      // Start the forensic scan animation
      const animationPromise = runForensicAnimation(fileData.previewUrl, type);

      // Perform server-side Gemini API call in parallel
      const apiPromise = fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mediaBase64: fileData.base64,
          imageBase64: fileData.base64,
          metadata: fileData.metadata,
          mediaType: type
        })
      });

      // Wait for both animation sequence and API response
      const [, res] = await Promise.all([animationPromise, apiPromise]);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.isConfigError || (res.status === 500 && errData.error?.includes('GEMINI_API_KEY'))) {
          setIsConfigError(true);
        }
        throw new Error(errData.error || `Analysis request failed with status ${res.status}`);
      }

      const data: ForensicAnalysisResult = await res.json();
      setScanStage('complete');
      setAnalysisResult(data);

      // Transition smoothly to verdict screen
      setTimeout(() => {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Forensic Analysis failed:', err);
      setScanStage('idle');
      setErrorMsg(
        err.message ||
          'Failed to complete forensic media analysis. You can retry or inspect using the built-in benchmark demos.'
      );
    }
  };

  // Retry the last uploaded media
  const handleRetry = () => {
    if (lastUploadedData) {
      handleAnalyzeUpload(lastUploadedData);
    }
  };

  // 2. Handle Zero-Latency Hackathon Demo Preset Selection
  const handleSelectDemoPreset = async (presetKey: string) => {
    const preset = DEMO_PRESETS[presetKey];
    if (!preset) return;

    setErrorMsg(null);
    setIsConfigError(false);

    const type = preset.mediaType || 'image';
    const preview = preset.analyzedMediaUrl || preset.analyzedImageUrl || '';

    // Run animation smoothly
    await runForensicAnimation(preview, type);

    setScanStage('complete');
    setAnalysisResult(preset);

    setTimeout(() => {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setScanStage('idle');
    setActivePreviewUrl('');
    setActiveMediaType('image');
    setErrorMsg(null);
    setIsConfigError(false);
    const analyzerElem = document.getElementById('analyzer');
    if (analyzerElem) {
      analyzerElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isScanning = scanStage !== 'idle' && scanStage !== 'complete';

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 relative overflow-x-hidden">
      {/* Background Sookshmadarshini Movie Image */}
      <div className="fixed inset-0 pointer-events-none -z-30">
        <Image
          src="/user-bg.png"
          alt="Sookshmadarshini Background"
          fill
          className="object-cover opacity-100"
          priority
        />
      </div>

      {/* Cyber Grid Lines & Glow Radials */}
      <div className="cyber-grid fixed inset-0 pointer-events-none -z-10 opacity-20" />
      <div className="cyber-grid-radial fixed inset-0 pointer-events-none -z-10 opacity-50" />

      {/* Navigation */}
      <Navbar onSelectPreset={handleSelectDemoPreset} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onAnalyzeClick={() => {
            const el = document.getElementById('analyzer');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onTryDemoClick={() => handleSelectDemoPreset('authentic')}
        />

        {/* Global Error Banner with Actionable Retry and Demo Fallback */}
        {errorMsg && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
            <div className="p-5 rounded-2xl bg-rose-950/50 border border-rose-600/50 text-rose-200 text-sm shadow-[0_0_30px_rgba(244,63,94,0.18)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-0.5">
                    {isConfigError ? 'Server Configuration Error' : 'Forensic Analysis Notice'}
                  </p>
                  <p className="text-xs text-rose-200 leading-relaxed">{errorMsg}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                {lastUploadedData && !isConfigError && (
                  <button
                    onClick={handleRetry}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-xs font-semibold text-white transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                )}
                <button
                  onClick={() => handleSelectDemoPreset('authentic')}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 transition-colors"
                >
                  Run Demo Preset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Workspace: Upload / Scanner / Results */}
        {!analysisResult && !isScanning && (
          <ImageUploader
            onAnalyze={handleAnalyzeUpload}
            onSelectPreset={handleSelectDemoPreset}
            isAnalyzing={isScanning}
          />
        )}

        {/* Active Forensic Scanning Animation Screen */}
        {isScanning && (
          <ForensicScanner
            currentStage={scanStage}
            previewUrl={activePreviewUrl}
            mediaType={activeMediaType}
          />
        )}

        {/* Results Verdict Screen */}
        {analysisResult && (
          <ResultsDashboard result={analysisResult} onReset={handleReset} />
        )}

        {/* Content & Information Pillars */}
        <WhySookshmadarshini />
        <HowItWorks />
        <SupportedMedia />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
