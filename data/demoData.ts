import { ForensicAnalysisResult } from '@/types/forensic';

export const DEMO_PRESETS: Record<string, ForensicAnalysisResult> = {
  authentic: {
    id: 'demo-authentic-01',
    timestamp: '2026-09-05T09:15:22Z',
    mediaType: 'image',
    trustScore: 91,
    classification: 'LIKELY AUTHENTIC',
    confidence: 94,
    summary:
      'Multi-spectral and structural forensic evaluation indicates this image displays natural sensor noise distributions, coherent optical physics, and authentic EXIF camera tags consistent with raw hardware capture.',
    aiIndicators: [
      {
        title: 'Diffusion Noise Signature',
        severity: 'LOW',
        explanation: 'No high-frequency spectral spikes or latent diffusion fingerprint patterns detected across color channels.'
      },
      {
        title: 'Anatomical / Structural Micro-Coherence',
        severity: 'LOW',
        explanation: 'Edge gradients and micro-geometry follow expected physical contours with zero hallucinated merges or smoothing.'
      }
    ],
    manipulationIndicators: [
      {
        title: 'Splice & Clone Detection',
        severity: 'LOW',
        explanation: 'Error Level Analysis (ELA) exhibits uniform compression artifacts across background and foreground without localized re-compression.'
      },
      {
        title: 'Copy-Move Inpainting',
        severity: 'LOW',
        explanation: 'Spatial correlation analysis found no duplicated keypoint clusters or content-aware fill patches.'
      }
    ],
    visualAnalysis:
      'Natural optical depth-of-field falloff matches the physical aperture (f/2.8). Chromatic aberration is organically distributed around high-contrast edges in accordance with optical lens physics.',
    explanation:
      'The image exhibits organic Poisson sensor grain across all luminance bands. Lighting vectors and specular catchlights align with a single solar azimuth. There is no evidence of diffusion grid artifacts or splice re-compression boundaries.',
    whyEvidence: [
      {
        category: '01 Visual consistency',
        title: 'Optical Depth and Focus Falloff',
        finding: 'Natural focal plane gradient with physically consistent circle-of-confusion bokeh matching hardware optics.',
        isAnomaly: false
      },
      {
        category: '02 Texture patterns',
        title: 'Bayer Matrix Sensor Noise',
        finding: 'Poisson-Gaussian noise profile is uniform across luminance levels, typical of physical CMOS sensors.',
        isAnomaly: false
      },
      {
        category: '03 Lighting',
        title: 'Single-Source Specular Highlights',
        finding: 'Catchlights and shadow projection vectors converge at a single solar azimuth without directional conflict.',
        isAnomaly: false
      },
      {
        category: '04 Object/facial consistency',
        title: 'Structural Geometry Integrity',
        finding: 'Biological textures (skin pores, hair follicles, iris striations) exhibit authentic non-repeating organic variance.',
        isAnomaly: false
      },
      {
        category: '05 Metadata/context',
        title: 'Valid Hardware EXIF Capsule',
        finding: 'Embedded camera firmware (Nikon D850), lens serials, shutter speed (1/500s), and timestamp records are structurally congruent.',
        isAnomaly: false
      }
    ],
    sourceVerification: {
      webSearchQuery: '"nikon_d850_dsc_8492" wildlife nature',
      reverseImageSearchUrl: 'https://images.google.com/',
      guidance: 'Cross-reference with primary photographer repositories and raw image EXIF catalogs.'
    },
    recommendation:
      'High probability of authentic camera capture. Suitable for publishing and archiving. Continuous source provenance remains good operational practice.',
    metadata: {
      filename: 'nikon_d850_dsc_8492.jpg',
      format: 'image/jpeg',
      mediaType: 'image',
      fileSizeBytes: 4280192,
      fileSizeFormatted: '4.08 MB',
      dimensions: {
        width: 4128,
        height: 2752
      },
      hasExif: true,
      exifDetails: {
        make: 'NIKON CORPORATION',
        model: 'NIKON D850',
        software: 'Ver.1.20',
        dateTime: '2026:08:14 14:32:09',
        exposureTime: '1/500 sec',
        fNumber: 'f/2.8',
        iso: 'ISO 200',
        focalLength: '70.0 mm',
        lensModel: 'AF-S NIKKOR 70-200mm f/2.8E FL ED VR',
        colorSpace: 'sRGB'
      }
    },
    analyzedMediaUrl: '/samples/authentic-nature.svg',
    analyzedImageUrl: '/samples/authentic-nature.svg',
    isDemo: true
  },

  aiGenerated: {
    id: 'demo-ai-generated-02',
    timestamp: '2026-09-05T09:22:40Z',
    mediaType: 'image',
    trustScore: 18,
    classification: 'LIKELY AI GENERATED',
    confidence: 97,
    summary:
      'Deep forensic analysis reveals pervasive synthetic diffusion signatures: characteristic high-frequency Fourier checkerboard artifacts, asymmetric iris reflections, and hyper-smoothed subsurface scattering without natural micro-pores.',
    aiIndicators: [
      {
        title: 'Fourier Frequency Artifacts (FFT)',
        severity: 'HIGH',
        explanation: 'Prominent periodic checkerboard grids observed in high-frequency spectrum, an indelible signature of convolutional de-quantization and latent upsampling.'
      },
      {
        title: 'Synthetic Biological Smoothing',
        severity: 'HIGH',
        explanation: 'Skin and cloth micro-textures lack authentic dermic pores and fibrous noise; instead displays Gaussian-smoothed procedural interpolations.'
      },
      {
        title: 'Corneal Reflection Asymmetry',
        severity: 'MEDIUM',
        explanation: 'Pupil reflections exhibit divergent illumination angles between left and right eyes, physically impossible under a unified lighting environment.'
      }
    ],
    manipulationIndicators: [
      {
        title: 'Full Latent Synthesis',
        severity: 'HIGH',
        explanation: 'Entire pixel field exhibits probabilistic synthesis rather than localized manipulation over a base camera image.'
      }
    ],
    visualAnalysis:
      'Background elements display characteristic semantic disintegration (melting architecture, non-Euclidean jewelry lines, blending strands of hair that merge into fabric).',
    explanation:
      'Observations show strong indicators consistent with generative diffusion models (e.g. Midjourney / Stable Diffusion). Asymmetric corneal specular points and missing physical sensor shot noise strongly suggest synthetic generation rather than photographic capture.',
    whyEvidence: [
      {
        category: '01 Visual consistency',
        title: 'Structural & Geometric Disintegration',
        finding: 'Background structural lines lose parallel alignment; necklace chain links dissolve into ambiguous metallic gradients.',
        isAnomaly: true
      },
      {
        category: '02 Texture patterns',
        title: 'Absence of Physical Sensor Grain',
        finding: 'Zero Poisson shot noise detected. High-frequency bands contain latent diffusion interpolation artifacts.',
        isAnomaly: true
      },
      {
        category: '03 Lighting',
        title: 'Incoherent Multi-Angle Illumination',
        finding: 'Jawline shadow angle contradicts nose specular highlight vector by approximately 38 degrees.',
        isAnomaly: true
      },
      {
        category: '04 Object/facial consistency',
        title: 'Pupillary & Dental Irregularities',
        finding: 'Non-circular pupil boundaries and continuous dental enamel bridge lacking discrete interdental gaps.',
        isAnomaly: true
      },
      {
        category: '05 Metadata/context',
        title: 'Complete Absence of Camera Telemetry',
        finding: 'Image lacks standard EXIF headers (no camera body, lens, exposure, or sensor serial records detected).',
        isAnomaly: true
      }
    ],
    sourceVerification: {
      webSearchQuery: '"ai portrait" prompt midjourney',
      reverseImageSearchUrl: 'https://images.google.com/',
      guidance: 'Search generative AI prompt libraries (Civitai, Midjourney archive, Lexica).'
    },
    recommendation:
      'Extremely high confidence of generative AI synthesis (e.g. Midjourney / Stable Diffusion). Do not cite or present as authentic documentary evidence.',
    metadata: {
      filename: 'midjourney_v6_portrait_render.webp',
      format: 'image/webp',
      mediaType: 'image',
      fileSizeBytes: 1845210,
      fileSizeFormatted: '1.76 MB',
      dimensions: {
        width: 2048,
        height: 2048
      },
      hasExif: false,
      note: 'Metadata unavailable. This does not by itself indicate manipulation.'
    },
    analyzedMediaUrl: '/samples/ai-portrait.svg',
    analyzedImageUrl: '/samples/ai-portrait.svg',
    isDemo: true
  },

  manipulated: {
    id: 'demo-manipulated-03',
    timestamp: '2026-09-05T09:31:18Z',
    mediaType: 'image',
    trustScore: 48,
    classification: 'SUSPICIOUS',
    confidence: 86,
    summary:
      'Localized image manipulation detected. While the base background appears authentic, significant digital splicing, inpainting, and edge gradient inconsistencies were identified in the central subject area.',
    aiIndicators: [
      {
        title: 'Inpainted Content Patching',
        severity: 'MEDIUM',
        explanation: 'Generative fill / diffusion inpainting detected in the hand and sign region with mismatched localized grain.'
      }
    ],
    manipulationIndicators: [
      {
        title: 'Error Level Analysis (ELA) Discontinuity',
        severity: 'HIGH',
        explanation: 'Severe re-compression error differentials around the perimeter of the inserted figure compared to surrounding landscape.'
      },
      {
        title: 'Edge Feathering & Boundary Halo',
        severity: 'HIGH',
        explanation: 'Alpha-matting fringe and anti-aliasing artifacts detected along silhouette boundary indicating composite pasting.'
      },
      {
        title: 'Shadow Gradient Inconsistency',
        severity: 'MEDIUM',
        explanation: 'Cast shadow of foreground subject exhibits hard falloff while surrounding ambient shadows are diffuse and soft.'
      }
    ],
    visualAnalysis:
      'Dual-compression quantization matrices detected. The background shows signs of multiple re-saves at JPEG Q=85 while the inserted subject exhibits single-pass compression at Q=98.',
    explanation:
      'Localized digital manipulation is suspected. The central subject shows evidence of composite splicing and localized inpainting, with mismatched noise variance and contradictory shadow vectors relative to the background scene.',
    whyEvidence: [
      {
        category: '01 Visual consistency',
        title: 'Boundary Artifacts & Color Bleed',
        finding: 'Sharpening halo and chromatic fringe around the modified subject boundary indicates manual or AI-assisted compositing.',
        isAnomaly: true
      },
      {
        category: '02 Texture patterns',
        title: 'Localized Noise Mismatch',
        finding: 'Central region exhibits lower noise variance (variance: 0.0018) compared to ambient background (variance: 0.0074).',
        isAnomaly: true
      },
      {
        category: '03 Lighting',
        title: 'Opposing Shadow Projection Angles',
        finding: 'Foreground object shadow points at 145 degrees; background lamppost shadow points at 210 degrees.',
        isAnomaly: true
      },
      {
        category: '04 Object/facial consistency',
        title: 'Scale & Perspective Divergence',
        finding: 'Horizon vanishing point for the subject sits 12% lower than the scene geometric perspective baseline.',
        isAnomaly: true
      },
      {
        category: '05 Metadata/context',
        title: 'Editing Suite Signature Detected',
        finding: 'XMP headers contain modification history timestamps from digital photo editing software.',
        isAnomaly: true
      }
    ],
    sourceVerification: {
      webSearchQuery: '"press briefing" original unaltered photo',
      reverseImageSearchUrl: 'https://images.google.com/',
      guidance: 'Reverse search across wire services (AP, Reuters, Getty) for the unedited parent photograph.'
    },
    recommendation:
      'Substantial evidence of digital tampering and composite splicing. Verify original raw source or search public registries for unaltered parent image.',
    metadata: {
      filename: 'press_briefing_composite_final.jpg',
      format: 'image/jpeg',
      mediaType: 'image',
      fileSizeBytes: 2940120,
      fileSizeFormatted: '2.80 MB',
      dimensions: {
        width: 3000,
        height: 2000
      },
      hasExif: true,
      exifDetails: {
        software: 'Adobe Photoshop 25.4 (Macintosh)',
        dateTime: '2026:08:29 18:04:12',
        colorSpace: 'sRGB'
      }
    },
    analyzedMediaUrl: '/samples/manipulated-press.svg',
    analyzedImageUrl: '/samples/manipulated-press.svg',
    isDemo: true
  },

  audioVoiceClone: {
    id: 'demo-audio-clone-04',
    timestamp: '2026-09-05T10:12:30Z',
    mediaType: 'audio',
    trustScore: 14,
    classification: 'LIKELY AI GENERATED',
    confidence: 96,
    summary:
      'Acoustic biometrics and spectral analysis indicate neural voice synthesis (e.g. ElevenLabs / VALL-E). Characteristic pitch quantization, absent subglottic breath turbulence, and unnatural phase continuity were detected.',
    aiIndicators: [
      {
        title: 'Neural Pitch Quantization',
        severity: 'HIGH',
        explanation: 'Fundamental frequency (F0) contour exhibits stepwise discrete quantization with zero organic micro-tremor in sustained vowels.'
      },
      {
        title: 'Synthetic Formant Smoothing',
        severity: 'HIGH',
        explanation: 'Linear Predictive Coding (LPC) shows unnatural spectral bandwidth smoothing, characteristic of vocoder synthesis (HiFi-GAN).'
      },
      {
        title: 'Absence of Biological Breath Dynamics',
        severity: 'MEDIUM',
        explanation: 'Phoneme transitions lack pre-phonatory inhalation noise and natural glottal pulse dampening.'
      }
    ],
    manipulationIndicators: [
      {
        title: 'Full Neural Speech Synthesis',
        severity: 'HIGH',
        explanation: 'The entire acoustic timeline is synthetically generated from text-to-speech tokens.'
      }
    ],
    visualAnalysis:
      'Spectrogram analysis shows abrupt frequency cutoff at 22.05 kHz and artificial harmonics lacking physical acoustic scattering from a physical room.',
    explanation:
      'Acoustic evaluation shows multiple signatures consistent with zero-shot neural voice cloning. Glottal airflow transients and room reverberation tail dynamics are artificially flat, indicating synthetic generation rather than a physical microphone recording.',
    whyEvidence: [
      {
        category: '01 Acoustic consistency & reverberation',
        title: 'Room Impulse Response Absence',
        finding: 'Zero ambient room reflection or diffuse acoustic reverberation detected across early reflections.',
        isAnomaly: true
      },
      {
        category: '02 Spectral & pitch patterns',
        title: 'Vocoder High-Frequency Phase Artifacts',
        finding: 'Phase dispersion in the 8kHz–16kHz range exhibits neural vocoder reconstruction signatures.',
        isAnomaly: true
      },
      {
        category: '03 Vocal tract & breath dynamics',
        title: 'Subglottic Pressure Incoherence',
        finding: 'Inhalation sounds are synthetically spliced and do not match vocal fold tension on adjacent phonemes.',
        isAnomaly: true
      },
      {
        category: '04 Background ambient coherence',
        title: 'Synthetic Noise Floor Isolation',
        finding: 'Background noise abruptly cuts to absolute digital silence during inter-word pauses.',
        isAnomaly: true
      },
      {
        category: '05 Metadata/context',
        title: 'Audio Container Encoding',
        finding: 'Metadata unavailable. This does not by itself indicate manipulation.',
        isAnomaly: false
      }
    ],
    sourceVerification: {
      webSearchQuery: '"voice clone" political speech audio verification',
      reverseImageSearchUrl: 'https://images.google.com/',
      guidance: 'Search audio fact-checking archives and verified press conference broadcasts.'
    },
    recommendation:
      'Extremely high confidence of synthetic voice cloning. Do not air, broadcast, or treat as authentic human speech.',
    metadata: {
      filename: 'leaked_executive_call_clone.mp3',
      format: 'audio/mp3',
      mediaType: 'audio',
      fileSizeBytes: 742010,
      fileSizeFormatted: '724 KB',
      durationSeconds: 18.4,
      hasExif: false,
      note: 'Metadata unavailable. This does not by itself indicate manipulation.'
    },
    analyzedMediaUrl: '/samples/audio-visualizer.svg',
    analyzedImageUrl: '/samples/audio-visualizer.svg',
    isDemo: true
  },

  videoDeepfake: {
    id: 'demo-video-deepfake-05',
    timestamp: '2026-09-05T10:18:45Z',
    mediaType: 'video',
    trustScore: 22,
    classification: 'LIKELY AI GENERATED',
    confidence: 93,
    summary:
      'Temporal forensic frame analysis identified deepfake face-swap splicing and generative frame diffusion. High-frequency temporal jitter was observed along the facial silhouette boundary, accompanied by lip-sync phoneme divergence.',
    aiIndicators: [
      {
        title: 'Facial Boundary Temporal Jitter',
        severity: 'HIGH',
        explanation: 'Bounding box tracking along the jawline shows 120ms frame warping and edge-blending feathering inconsistent with natural head rotation.'
      },
      {
        title: 'Lip-Sync Phoneme Desynchronization',
        severity: 'HIGH',
        explanation: 'Mouth visemes diverge from bilabial plosive audio transients (B, P, M) by over 140 milliseconds.'
      },
      {
        title: 'Blink Rate & Corneal Glint Anomaly',
        severity: 'MEDIUM',
        explanation: 'Spontaneous eye blink frequency is unnaturally suppressed (0 blinks in 15 seconds) with static non-moving corneal highlights.'
      }
    ],
    manipulationIndicators: [
      {
        title: 'Frame-by-Frame Neural Swap',
        severity: 'HIGH',
        explanation: 'Deepfake autoencoder blending boundary detected between central facial mask and source neck/ears.'
      }
    ],
    visualAnalysis:
      'Optical flow vector fields reveal micro-motion discontinuity between facial landmarks and background scene parallax.',
    explanation:
      'Video forensic timeline analysis demonstrates clear indicators consistent with generative deepfake face-swapping. Central facial landmark motion vectors conflict with skeletal head orientation, and mouth opening motions lag speech audio by noticeable intervals.',
    whyEvidence: [
      {
        category: '01 Temporal frame consistency',
        title: 'Inter-Frame Pixel Morphing',
        finding: 'Pixel interpolation between consecutive keyframes exhibits neural warping artifacts rather than physical shutter motion blur.',
        isAnomaly: true
      },
      {
        category: '02 Lip-sync & phoneme alignment',
        title: 'Phoneme-Viseme Timing Mismatch',
        finding: 'Vocal tract acoustic bursts precede facial mouth shapes by 140ms.',
        isAnomaly: true
      },
      {
        category: '03 Facial boundary & warping cues',
        title: 'Jawline Blending Mask Discontinuity',
        finding: 'Localized blur halo visible along chin and cheek contour during rapid head turns.',
        isAnomaly: true
      },
      {
        category: '04 Motion blur & optical flow',
        title: 'Contradictory Shutter Velocity',
        finding: 'Background features show 1/60s natural motion blur while facial features remain unnaturally razor sharp.',
        isAnomaly: true
      },
      {
        category: '05 Metadata/context',
        title: 'Container Stream Metadata',
        finding: 'Metadata unavailable. This does not by itself indicate manipulation.',
        isAnomaly: false
      }
    ],
    sourceVerification: {
      webSearchQuery: '"deepfake video" press briefing original broadcast',
      reverseImageSearchUrl: 'https://images.google.com/',
      guidance: 'Compare video keyframes against official C-SPAN, Reuters, or verified newsroom broadcast feeds.'
    },
    recommendation:
      'Substantial evidence of temporal facial manipulation and AI deepfake synthesis. Refrain from publishing without verified primary footage.',
    metadata: {
      filename: 'official_statement_deepfake_clip.mp4',
      format: 'video/mp4',
      mediaType: 'video',
      fileSizeBytes: 5820400,
      fileSizeFormatted: '5.55 MB',
      durationSeconds: 12.0,
      dimensions: {
        width: 1920,
        height: 1080
      },
      hasExif: false,
      note: 'Metadata unavailable. This does not by itself indicate manipulation.'
    },
    analyzedMediaUrl: '/samples/video-visualizer.svg',
    analyzedImageUrl: '/samples/video-visualizer.svg',
    isDemo: true
  }
};
