import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "TRUELENS AI — Don't just see it. Verify it.",
  description:
    'AI-powered multimodal media authenticity intelligence. Detect synthetic diffusion artifacts, voice clones, deepfakes, and manipulated pixels with explainable forensic evidence.',
  keywords: [
    'TRUELENS',
    'AI media verification',
    'deepfake detector',
    'audio voice clone detector',
    'forensic analysis',
    'synthetic media detector',
    'EXIF analysis'
  ],
  authors: [{ name: 'TRUELENS AI Forensics' }],
  icons: {
    icon: '/favicon.ico'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070a12'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#070a12]">
      <body className="min-h-screen bg-[#070a12] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
