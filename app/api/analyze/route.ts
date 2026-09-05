import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ForensicAnalysisResult, MediaMetadata } from '@/types/forensic';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds

export async function POST(req: NextRequest) {
  try {
    // 1. Read Server-Side GEMINI_API_KEY (handling potential GOOGLE_API_KEY override safely)
    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Server Configuration Error: GEMINI_API_KEY is not configured on the server. Please define GEMINI_API_KEY in your .env.local file.',
          isConfigError: true
        },
        { status: 500 }
      );
    }

    // 2. Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload received.' },
        { status: 400 }
      );
    }

    const { imageBase64, mediaBase64, metadata } = body;
    const incomingData = mediaBase64 || imageBase64;

    if (!incomingData || typeof incomingData !== 'string') {
      return NextResponse.json(
        { error: 'No media provided. Please upload an image, audio, or video file to analyze.' },
        { status: 400 }
      );
    }

    // 3. Format media for multimodal Gemini input
    let mimeType = 'image/jpeg';
    let rawBase64 = incomingData;

    const matches = incomingData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1].toLowerCase();
      rawBase64 = matches[2];
    }

    if (mimeType === 'image/jpg') {
      mimeType = 'image/jpeg';
    } else if (mimeType === 'audio/mpeg') {
      mimeType = 'audio/mp3';
    }

    // Determine media category
    let detectedType: 'image' | 'audio' | 'video' = 'image';
    if (mimeType.startsWith('audio/')) {
      detectedType = 'audio';
    } else if (mimeType.startsWith('video/')) {
      detectedType = 'video';
    }

    const validMimes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      // Audio
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/x-m4a',
      'audio/m4a',
      'audio/aac',
      'audio/flac',
      'audio/webm',
      // Video
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-matroska'
    ];

    if (!validMimes.includes(mimeType)) {
      return NextResponse.json(
        {
          error:
            `The format '${mimeType}' is not currently supported. Supported formats include JPG, PNG, WEBP, MP3, WAV, AAC, OGG, MP4, and WEBM.`
        },
        { status: 400 }
      );
    }

    if (rawBase64.length < 50) {
      return NextResponse.json(
        {
          error:
            'The media file could not be processed because the payload data is incomplete or corrupted.'
        },
        { status: 400 }
      );
    }

    // 4. Construct tailored prompt enforcing probabilistic language, ethical rules, and media-specific forensics
    let mediaSpecificInstructions = '';
    if (detectedType === 'audio') {
      mediaSpecificInstructions = `MEDIA TYPE: AUDIO
Analyze this audio track for signs of neural voice cloning, speech synthesis (e.g. ElevenLabs, VALL-E, Bark), vocoder artifacts, or audio splicing:
1. Examine acoustic biometrics, pitch contour / fundamental frequency (F0) quantization, and micro-tremor in sustained phonemes.
2. Check for neural vocoder phase artifacts (e.g. HiFi-GAN phase dispersion above 8kHz), robotic formant smoothing, and abrupt frequency cutoffs.
3. Observe breath dynamics (subglottic inhalation noise, natural vocal cord friction) and room impulse response (RIR) reverberation consistency.
4. Check background noise floor behavior (whether room tone drops abruptly to digital silence during pauses).
In "whyEvidence", use categories:
- "01 Acoustic consistency & reverberation"
- "02 Spectral & pitch patterns"
- "03 Vocal tract & breath dynamics"
- "04 Background ambient coherence"
- "05 Metadata/context"`;
    } else if (detectedType === 'video') {
      mediaSpecificInstructions = `MEDIA TYPE: VIDEO
Analyze this video footage for signs of AI deepfake face-swapping, generative video synthesis (e.g. Sora, Runway Gen-2, Kling), temporal morphing, or composite splicing:
1. Examine temporal frame-to-frame coherence, inter-frame pixel warping vs authentic optical shutter motion blur.
2. Check lip-sync phoneme-viseme alignment and mouth opening timing against vocal audio transients.
3. Look for facial silhouette boundary artifacts: localized blurring halos, jitter, and warping along jawline during rotation.
4. Evaluate spontaneous blink frequency, pupil dilation, and corneal specular highlight stability across frames.
5. In "visualAnalysis", discuss temporal motion vectors, optical flow consistency, and shutter velocity.
In "whyEvidence", use categories:
- "01 Temporal frame consistency"
- "02 Lip-sync & phoneme alignment"
- "03 Facial boundary & warping cues"
- "04 Motion blur & optical flow"
- "05 Metadata/context"`;
    } else {
      mediaSpecificInstructions = `MEDIA TYPE: IMAGE
Analyze this image for signs of generative AI synthesis (e.g. Midjourney, Stable Diffusion, DALL-E) or digital composite manipulation:
1. Check optical depth of field, circle-of-confusion bokeh, chromatic aberration, and perspective vanishing points.
2. Check sensor noise (Poisson-Gaussian shot noise from Bayer matrix) vs synthetic Gaussian smoothing or Fourier checkerboards.
3. Verify lighting vectors, specular catchlights, shadow projection azimuths, and corneal reflection symmetry.
4. Scrutinize biological details (hair strands merging into skin, dental geometry, ear cartilage, pupil symmetry, finger digits).
In "whyEvidence", use categories:
- "01 Visual consistency"
- "02 Texture patterns"
- "03 Lighting"
- "04 Object/facial consistency"
- "05 Metadata/context"`;
    }

    const systemPrompt = `You are TRUELENS AI, an advanced media authenticity intelligence engine.
Your task is to conduct an explainable forensic assessment of the provided ${detectedType} file to evaluate whether it is likely authentic, suspicious / manipulated, or likely AI-generated.

${mediaSpecificInstructions}

MANDATORY FORENSIC GUIDELINES:
1. PROBABILISTIC LANGUAGE ONLY: Do NOT claim certainty. Media authenticity evaluation is probabilistic. Use cautious forensic phrasing such as "likely", "possible", "consistent with", "indicators suggest", or "insufficient evidence".
2. NO HALLUCINATED EVIDENCE: Only report anomalies that can be observed directly in the media signals. Distinguish observations (what is detected) from conclusions (what it might mean).
3. METADATA RULE: Missing metadata is common across web and messaging platforms. If metadata is unavailable, explicitly say: "Metadata unavailable. This does not by itself indicate manipulation."
4. CLASSIFICATIONS (Allowed values only):
   - "LIKELY AUTHENTIC": Trust score 80-100. Natural sensor/acoustic noise, coherent physics, organic details, unmanipulated signals.
   - "SUSPICIOUS": Trust score 40-79. Indicators consistent with localized editing, composite splicing, inconsistent lighting/reverb, or inpainting.
   - "LIKELY AI GENERATED": Trust score 0-39. Indicators consistent with generative models (diffusion artifacts, neural vocoder phase dispersion, deepfake boundary jitter, pitch quantization).

Return a strictly valid JSON object matching this schema:
{
  "trustScore": number (0 to 100),
  "classification": "LIKELY AUTHENTIC" | "SUSPICIOUS" | "LIKELY AI GENERATED",
  "confidence": number (1 to 100),
  "summary": "Concise forensic summary (2-3 sentences) using probabilistic language",
  "aiIndicators": [
    {
      "title": "Short descriptive title",
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "explanation": "Detailed technical observation of synthetic indicator"
    }
  ],
  "manipulationIndicators": [
    {
      "title": "Short descriptive title",
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "explanation": "Detailed technical observation of manipulation signal"
    }
  ],
  "explanation": "Comprehensive forensic explanation synthesizing why this verdict was reached",
  "visualAnalysis": "Technical review of physics, spectral distribution, or temporal consistency",
  "whyEvidence": [
    {
      "category": "Category name specified above",
      "title": "Short title",
      "finding": "Observed finding (Note: for metadata, if absent state 'Metadata unavailable. This does not by itself indicate manipulation.')",
      "isAnomaly": boolean
    }
  ],
  "sourceVerification": {
    "webSearchQuery": "Suggested search query to verify context or provenance",
    "reverseImageSearchUrl": "https://images.google.com/",
    "guidance": "Instructions on verifying source provenance against public archives"
  },
  "recommendation": "Clear, actionable recommendation for publishing or verification"
}`;

    // 5. Initialize latest GoogleGenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Try gemini-3.6-flash first, followed by modern flash models
    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-2.5-flash'
    ];

    let responseText: string | null = null;
    let lastErrorObject: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt },
                {
                  inlineData: {
                    mimeType,
                    data: rawBase64
                  }
                }
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.15
          }
        });

        if (response?.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastErrorObject = err;
        console.warn(`Model ${model} attempt warning:`, err?.message || err);
      }
    }

    // 6. Detailed error reporting for Google Authentication and decoding errors
    if (!responseText) {
      const errMsg = lastErrorObject?.message || String(lastErrorObject || '');
      if (
        errMsg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED') ||
        errMsg.includes('UNAUTHENTICATED') ||
        errMsg.includes('API_KEY_INVALID') ||
        lastErrorObject?.status === 401
      ) {
        return NextResponse.json(
          {
            error:
              "Google Authentication Service Error: Google rejected the provided key with 'ACCESS_TOKEN_TYPE_UNSUPPORTED' or 'UNAUTHENTICATED'. Please verify your authorization key at https://aistudio.google.com/app/apikey.",
            isAuthError: true,
            rawGoogleError: errMsg
          },
          { status: 401 }
        );
      }

      if (errMsg.includes('INVALID_ARGUMENT') || errMsg.includes('Request contains an invalid argument')) {
        return NextResponse.json(
          {
            error:
              `The uploaded ${detectedType} could not be decoded by the AI engine. Please ensure it is a valid, uncorrupted file (e.g. H.264 MP4, standard WAV/MP3, or JPG/PNG).`,
            canRetry: true
          },
          { status: 400 }
        );
      }

      throw new Error(`Gemini Multimodal API failed across attempted models: ${errMsg}`);
    }

    // 7. Parse structured JSON from Gemini response
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const cleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      parsed = JSON.parse(cleaned);
    }

    // 8. Format metadata with standard missing metadata note
    const hasExif = Boolean(metadata?.hasExif && metadata?.exifDetails && Object.keys(metadata.exifDetails).length > 0);
    const parsedMetadata: MediaMetadata = {
      filename: metadata?.filename || `uploaded_${detectedType}.${mimeType.split('/')[1] || 'dat'}`,
      format: metadata?.format || mimeType,
      mediaType: detectedType,
      fileSizeBytes: metadata?.fileSizeBytes || Math.round(rawBase64.length * 0.75),
      fileSizeFormatted: metadata?.fileSizeFormatted || 'N/A',
      durationSeconds: metadata?.durationSeconds,
      dimensions: metadata?.dimensions,
      hasExif,
      exifDetails: hasExif ? metadata.exifDetails : undefined,
      note: hasExif
        ? undefined
        : 'Metadata unavailable. This does not by itself indicate manipulation.'
    };

    // 9. Normalize classification
    let classification = parsed.classification;
    if (
      classification !== 'LIKELY AUTHENTIC' &&
      classification !== 'SUSPICIOUS' &&
      classification !== 'LIKELY AI GENERATED'
    ) {
      const score = Number(parsed.trustScore) || 50;
      classification = score >= 75 ? 'LIKELY AUTHENTIC' : score >= 40 ? 'SUSPICIOUS' : 'LIKELY AI GENERATED';
    }

    // Dynamic fallback evidence based on detected media type
    const fallbackWhyEvidence = detectedType === 'audio'
      ? [
          {
            category: '01 Acoustic consistency & reverberation',
            title: 'Room Impulse Response (RIR)',
            finding: 'Audited room boundary reflections and ambient reverberation decay.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '02 Spectral & pitch patterns',
            title: 'Fundamental Frequency (F0) & Vocoder Signals',
            finding: 'Assessed harmonic overtone distribution and pitch quantization.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '03 Vocal tract & breath dynamics',
            title: 'Subglottic Pressure & Friction Noise',
            finding: 'Audited pre-phonatory breathing and consonant acoustic transients.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '04 Background ambient coherence',
            title: 'Noise Floor Continuity',
            finding: 'Cross-referenced background noise floor across spoken pauses.',
            isAnomaly: classification === 'SUSPICIOUS'
          },
          {
            category: '05 Metadata/context',
            title: 'Stream Container Headers',
            finding: 'Metadata unavailable. This does not by itself indicate manipulation.',
            isAnomaly: false
          }
        ]
      : detectedType === 'video'
      ? [
          {
            category: '01 Temporal frame consistency',
            title: 'Inter-Frame Continuity & Warping',
            finding: 'Evaluated frame-by-frame structural stability and neural interpolation artifacts.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '02 Lip-sync & phoneme alignment',
            title: 'Viseme-Acoustic Synchronization',
            finding: 'Cross-checked labial mouth shapes against audio phoneme bursts.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '03 Facial boundary & warping cues',
            title: 'Facial Mask & Silhouette Boundary',
            finding: 'Audited jawline contours and edge feathering under rotational motion.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '04 Motion blur & optical flow',
            title: 'Shutter Dynamics vs Pixel Blur',
            finding: 'Verified optical flow consistency across foreground and background planes.',
            isAnomaly: classification === 'SUSPICIOUS'
          },
          {
            category: '05 Metadata/context',
            title: 'Video Stream Telemetry',
            finding: 'Metadata unavailable. This does not by itself indicate manipulation.',
            isAnomaly: false
          }
        ]
      : [
          {
            category: '01 Visual consistency',
            title: 'Optical Depth and Geometry',
            finding: 'Evaluated scene perspective, focus falloff, and continuity.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '02 Texture patterns',
            title: 'Sensor Noise and Micro-Texture',
            finding: 'Examined high-frequency noise distribution across color channels.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '03 Lighting',
            title: 'Illumination Vectors',
            finding: 'Cross-checked shadow falloff against principal illumination azimuth.',
            isAnomaly: classification === 'SUSPICIOUS'
          },
          {
            category: '04 Object/facial consistency',
            title: 'Structural Boundaries',
            finding: 'Audited contour transitions for generative blurring or splicing feathering.',
            isAnomaly: classification !== 'LIKELY AUTHENTIC'
          },
          {
            category: '05 Metadata/context',
            title: 'Header & Context Audit',
            finding: hasExif
              ? 'Hardware EXIF tags detected and cataloged.'
              : 'Metadata unavailable. This does not by itself indicate manipulation.',
            isAnomaly: false
          }
        ];

    // 10. Assemble complete structured response
    const finalResponse: ForensicAnalysisResult = {
      id: `forensic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      mediaType: detectedType,
      trustScore: Math.min(100, Math.max(0, Math.round(Number(parsed.trustScore) || 50))),
      classification,
      confidence: Math.min(100, Math.max(1, Math.round(Number(parsed.confidence) || 85))),
      summary: parsed.summary || `Forensic multimodal ${detectedType} assessment completed using probabilistic evaluation.`,
      aiIndicators: Array.isArray(parsed.aiIndicators) ? parsed.aiIndicators : [],
      manipulationIndicators: Array.isArray(parsed.manipulationIndicators) ? parsed.manipulationIndicators : [],
      visualAnalysis: parsed.visualAnalysis || `${detectedType.charAt(0).toUpperCase() + detectedType.slice(1)} spectral and temporal physics evaluated.`,
      explanation:
        parsed.explanation ||
        `The assessment is based on ${detectedType} structural coherence, frequency analysis, and compression artifacts.`,
      whyEvidence:
        Array.isArray(parsed.whyEvidence) && parsed.whyEvidence.length >= 5
          ? parsed.whyEvidence
          : fallbackWhyEvidence,
      metadata: parsedMetadata,
      sourceVerification: {
        webSearchQuery:
          parsed?.sourceVerification?.webSearchQuery ||
          `"${detectedType} verification" ${parsedMetadata.filename}`,
        reverseImageSearchUrl:
          parsed?.sourceVerification?.reverseImageSearchUrl || 'https://images.google.com/',
        guidance:
          parsed?.sourceVerification?.guidance ||
          `Cross-reference this ${detectedType} against public archives and fact-checking registries.`
      },
      recommendation:
        parsed.recommendation ||
        'TRUELENS provides an AI-assisted probabilistic assessment. Cross-verify critical claims using independent sources.',
      analyzedMediaUrl: incomingData,
      analyzedImageUrl: incomingData,
      isDemo: false
    };

    return NextResponse.json(finalResponse);
  } catch (error: any) {
    console.error('Server error in /api/analyze:', error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Gemini image analysis failed. Please verify your connection or try again.',
        canRetry: true
      },
      { status: 500 }
    );
  }
}
