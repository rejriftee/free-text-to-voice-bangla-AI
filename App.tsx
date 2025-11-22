import React, { useState, useRef, useEffect } from 'react';
import VoiceSelector from './components/VoiceSelector';
import NeonButton from './components/NeonButton';
import { VOICES, EXAMPLE_TEXT_BENGALI } from './constants';
import { VoiceProfile, AudioState } from './types';
import { generateSpeech } from './services/geminiService';

export default function App() {
  const [text, setText] = useState<string>(EXAMPLE_TEXT_BENGALI);
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile>(VOICES[0]);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    blob: null,
    url: null,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cleanup object URL on unmount or new generation
  useEffect(() => {
    return () => {
      if (audioState.url) {
        URL.revokeObjectURL(audioState.url);
      }
    };
  }, [audioState.url]);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setAudioState(prev => ({ ...prev, isLoading: true, error: null, isPlaying: false }));

    try {
      const wavBlob = await generateSpeech(text, selectedVoice.geminiVoiceName);
      const url = URL.createObjectURL(wavBlob);
      
      setAudioState({
        isLoading: false,
        isPlaying: false,
        blob: wavBlob,
        url,
        error: null
      });
    } catch (err) {
      console.error(err);
      setAudioState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to generate audio. Please check your API key or try again."
      }));
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioState.url) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => console.error("Playback error", e));
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    } else {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const handleDownload = () => {
    if (!audioState.url) return;
    const a = document.createElement('a');
    a.href = audioState.url;
    a.download = `neon_tts_${selectedVoice.name}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Auto-resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#121212] to-[#000000] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            BANGLA <span className="text-white font-thin">NEON</span> TTS
          </h1>
          <p className="text-gray-400 uppercase tracking-[0.3em] text-xs md:text-sm">
            Next-Gen AI Speech Synthesis
          </p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[100px] opacity-20 bg-gradient-to-r from-cyan-600 to-fuchsia-600 -z-10 rounded-full pointer-events-none"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Voices */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Text Input Area */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-black rounded-2xl p-1">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Input Text (Bangla)</label>
                    <span className={`text-xs font-bold ${text.length > 30000 ? 'text-red-500' : 'text-gray-500'}`}>
                      {text.length} / 30,000 Chars
                    </span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextChange}
                    placeholder="এখানে আপনার বাংলা লেখা লিখুন..."
                    className="w-full bg-transparent border-none focus:ring-0 text-gray-100 text-lg md:text-xl font-bengali leading-relaxed min-h-[150px] resize-none placeholder-gray-700"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>

            {/* Voice Selector */}
            <div>
               <div className="flex items-center justify-between mb-4">
                 <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Select Voice Profile</label>
               </div>
               <VoiceSelector selectedVoice={selectedVoice} onSelect={setSelectedVoice} />
            </div>

          </div>

          {/* Right Column: Controls & Visualizer Placeholder */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Status/Visualizer Card */}
            <div className="flex-grow relative rounded-3xl overflow-hidden border border-gray-800 bg-black/40 flex flex-col items-center justify-center p-8 min-h-[300px]">
              {/* Simulated Audio Visualizer Bars */}
              <div className="flex items-end gap-1 h-32 mb-8">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 rounded-t-sm transition-all duration-75 ${audioState.isPlaying ? 'bg-gradient-to-t from-cyan-500 to-fuchsia-500 animate-pulse' : 'bg-gray-800'}`}
                    style={{ 
                      height: audioState.isPlaying ? `${Math.random() * 100}%` : '10%',
                      animationDelay: `${i * 0.05}s`
                    }}
                  ></div>
                ))}
              </div>

              {audioState.error && (
                <div className="text-red-400 text-center mb-4 p-2 bg-red-900/20 border border-red-800 rounded">
                  {audioState.error}
                </div>
              )}

              <div className="w-full space-y-4">
                <NeonButton 
                  onClick={handleGenerate} 
                  isLoading={audioState.isLoading}
                  className="w-full"
                  disabled={text.length > 30000}
                >
                  {audioState.isLoading ? 'Synthesizing...' : 'Generate Speech'}
                </NeonButton>

                {audioState.url && (
                  <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    <button 
                      onClick={handlePlayPause}
                      className="border border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-cyan-400 rounded-xl py-3 font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      {audioState.isPlaying ? (
                         <>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                           Pause
                         </>
                      ) : (
                         <>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                           Play
                         </>
                      )}
                    </button>
                    
                    <button 
                      onClick={handleDownload}
                      className="border border-gray-600 hover:border-fuchsia-400 text-gray-300 hover:text-fuchsia-400 rounded-xl py-3 font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                       Download
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-600 text-center">
               Uses <span className="text-cyan-600">gemini-2.5-flash-preview-tts</span>. Max 30k chars recommended.
            </div>

          </div>
        </div>

        <footer className="mt-24 mb-12 text-center relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h2 className="relative text-3xl md:text-4xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-300">
            CREATED BY REJ
          </h2>
        </footer>

      </div>

      {/* Hidden Audio Element for Logic */}
      <audio 
        ref={audioRef} 
        src={audioState.url || ''} 
        onEnded={() => setAudioState(prev => ({ ...prev, isPlaying: false }))}
        onError={() => setAudioState(prev => ({ ...prev, isPlaying: false, error: "Playback error" }))}
      />
    </div>
  );
}