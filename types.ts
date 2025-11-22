export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  geminiVoiceName: string;
  description: string;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  blob: Blob | null;
  url: string | null;
  error: string | null;
}
