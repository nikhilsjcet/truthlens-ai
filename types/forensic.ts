export type MediaType = 'image' | 'audio' | 'video';

export type ClassificationType = 'LIKELY AUTHENTIC' | 'SUSPICIOUS' | 'LIKELY AI GENERATED';

export type SeverityType = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ForensicIndicator {
  title: string;
  severity: SeverityType;
  explanation: string;
}

export interface WhyEvidenceItem {
  category: string;
  title: string;
  finding: string;
  isAnomaly: boolean;
}

export interface MediaMetadata {
  filename: string;
  format: string;
  mediaType: MediaType;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  durationSeconds?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  hasExif: boolean;
  note?: string;
  exifDetails?: {
    make?: string;
    model?: string;
    software?: string;
    dateTime?: string;
    exposureTime?: string;
    fNumber?: string;
    iso?: string;
    focalLength?: string;
    lensModel?: string;
    gps?: string;
    colorSpace?: string;
    audioCodec?: string;
    sampleRate?: string;
    channels?: string;
    videoCodec?: string;
    fps?: string;
  };
}

// Backward compatibility alias
export type ImageMetadata = MediaMetadata;

export interface SourceVerificationInfo {
  webSearchQuery: string;
  reverseImageSearchUrl: string;
  guidance: string;
}

export interface ForensicAnalysisResult {
  id: string;
  timestamp: string;
  mediaType: MediaType;
  trustScore: number; // 0 to 100
  classification: ClassificationType;
  confidence: number; // 0 to 100
  summary: string;
  aiIndicators: ForensicIndicator[];
  manipulationIndicators: ForensicIndicator[];
  visualAnalysis: string; // Used for optical/audio/temporal analysis
  explanation: string;
  whyEvidence: WhyEvidenceItem[];
  metadata: MediaMetadata;
  sourceVerification: SourceVerificationInfo;
  recommendation: string;
  analyzedMediaUrl: string;
  analyzedImageUrl?: string; // Backward compatibility
  isDemo?: boolean;
}

export type ScanStage =
  | 'idle'
  | 'media_received'
  | 'image_decoded'
  | 'visual_patterns'
  | 'synthetic_indicators'
  | 'manipulation_signals'
  | 'explainable_assessment'
  | 'complete';
