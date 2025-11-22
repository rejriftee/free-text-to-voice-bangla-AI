import { VoiceProfile } from "./types";

export const VOICES: VoiceProfile[] = [
  // Males
  {
    id: 'm1',
    name: 'Rahul',
    gender: 'Male',
    geminiVoiceName: 'Fenrir',
    description: 'Deep & Authoritative'
  },
  {
    id: 'm2',
    name: 'Amit',
    gender: 'Male',
    geminiVoiceName: 'Charon',
    description: 'Steady & Professional'
  },
  {
    id: 'm3',
    name: 'Sujay',
    gender: 'Male',
    geminiVoiceName: 'Puck',
    description: 'Energetic & Crisp'
  },
  // Females
  {
    id: 'f1',
    name: 'Priya',
    gender: 'Female',
    geminiVoiceName: 'Kore',
    description: 'Soothing & Calm'
  },
  {
    id: 'f2',
    name: 'Anjali',
    gender: 'Female',
    geminiVoiceName: 'Zephyr',
    description: 'Bright & Clear'
  },
  {
    id: 'f3',
    name: 'Sneha',
    gender: 'Female',
    geminiVoiceName: 'Kore', // Re-using Kore as Gemini currently has limited distinct voices, simulated as a different persona in UI
    description: 'Soft & Narrator'
  }
];

export const EXAMPLE_TEXT_BENGALI = `আমার নাম জেমিনি। আমি আপনাকে সাহায্য করতে পারি। এটি একটি পরীক্ষা মূলক বাক্য যা বাংলা টেক্সট টু স্পিচ এর ক্ষমতা প্রদর্শন করছে।`;
