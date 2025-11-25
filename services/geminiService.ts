import { GoogleGenAI, Modality } from "@google/genai";

let audioContext: AudioContext | null = null;
const audioCache = new Map<string, AudioBuffer>();
const pendingRequests = new Map<string, Promise<AudioBuffer | null>>();

const ENCOURAGEMENT_PHRASES = [
  "Awesome Job!",
  "Super Star!",
  "You're Amazing!",
  "Fantastic!",
  "Keep it up!",
  "Brilliant!",
  "Good Job!",
  "Way to go!"
];

// Helper to decode Base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode audio data to buffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function getAudioContext(): AudioContext {
    if (!audioContext) {
        // Fix: Cast window to any to access webkitAudioContext property which is not in standard Window interface
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }
    return audioContext;
}

async function fetchAndCacheAudio(text: string): Promise<AudioBuffer | null> {
    // 1. Check Cache
    if (audioCache.has(text)) {
        return audioCache.get(text)!;
    }

    // 2. Check Pending Requests (Dedup) to avoid double fetching
    if (pendingRequests.has(text)) {
        return pendingRequests.get(text)!;
    }

    if (!process.env.API_KEY) {
        console.error("API Key missing");
        return null;
    }

    const fetchPromise = (async () => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash-preview-tts",
              contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
              config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
              },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            
            if (!base64Audio) {
              throw new Error("No audio data returned");
            }

            const ctx = getAudioContext();
            const audioBuffer = await decodeAudioData(
              decode(base64Audio),
              ctx,
              24000,
              1,
            );

            // Save to Cache
            audioCache.set(text, audioBuffer);
            return audioBuffer;
        } catch (e) {
            console.error("TTS Error", e);
            return null;
        } finally {
            pendingRequests.delete(text);
        }
    })();

    pendingRequests.set(text, fetchPromise);
    return fetchPromise;
}

export const preloadWord = (text: string): void => {
    // Fire and forget - populates cache/pending
    fetchAndCacheAudio(text).catch(e => console.debug("Preload ignored:", e));
}

export const speakWord = async (text: string): Promise<void> => {
  try {
    const ctx = getAudioContext();

    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }

    const buffer = await fetchAndCacheAudio(text);
    
    if (buffer) {
        const outputNode = ctx.createGain();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(outputNode);
        outputNode.connect(ctx.destination);
        source.start();
    }

  } catch (error) {
    console.error("Error generating speech:", error);
    // Fallback to browser TTS if Gemini fails
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

export const getEncouragement = async (): Promise<string> => {
   // Return local random phrase immediately for speed
   return ENCOURAGEMENT_PHRASES[Math.floor(Math.random() * ENCOURAGEMENT_PHRASES.length)];
}