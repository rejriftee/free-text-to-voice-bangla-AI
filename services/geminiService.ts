import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, int16ToFloat32, pcmToWav, SAMPLE_RATE } from "./audioUtils";

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSpeech = async (text: string, voiceName: string): Promise<Blob> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    const base64Audio = candidates[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received from Gemini API");
    }

    // Decode Base64 to bytes
    const audioBytes = decodeBase64(base64Audio);
    
    // Interpret bytes as Int16 PCM (assuming Gemini output format)
    // The API returns raw PCM. Usually 16-bit LE.
    const int16Data = new Int16Array(audioBytes.buffer);
    
    // Convert to Float32 for processing/checking (optional, but good for consistency)
    const float32Data = int16ToFloat32(int16Data);

    // Convert to WAV Blob
    const wavBlob = pcmToWav(float32Data, SAMPLE_RATE, 1);
    
    return wavBlob;

  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};
