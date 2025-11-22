import React from 'react';
import { VoiceProfile } from '../types';
import { VOICES } from '../constants';

interface VoiceSelectorProps {
  selectedVoice: VoiceProfile;
  onSelect: (voice: VoiceProfile) => void;
}

interface VoiceCardProps {
  voice: VoiceProfile;
  selectedVoice: VoiceProfile;
  onSelect: (voice: VoiceProfile) => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, selectedVoice, onSelect }) => {
  const isSelected = selectedVoice.id === voice.id;
  const isMale = voice.gender === 'Male';
  const borderColor = isSelected 
    ? isMale ? 'border-cyan-400' : 'border-fuchsia-400'
    : 'border-gray-700';
  const glow = isSelected 
    ? isMale ? 'shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'shadow-[0_0_15px_rgba(232,121,249,0.6)]'
    : 'hover:border-gray-500';

  return (
    <button
      onClick={() => onSelect(voice)}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300 w-full text-left group
        ${borderColor} ${glow} bg-gray-900/50 backdrop-blur-sm
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-xl font-bold font-bengali ${isMale ? 'text-cyan-400' : 'text-fuchsia-400'}`}>
          {voice.name}
        </h3>
        {isSelected && (
          <div className={`h-3 w-3 rounded-full ${isMale ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-fuchsia-400 shadow-[0_0_8px_fuchsia]'}`}></div>
        )}
      </div>
      <p className="text-gray-400 text-xs uppercase tracking-wider">{voice.description}</p>
    </button>
  );
};

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onSelect }) => {
  const males = VOICES.filter(v => v.gender === 'Male');
  const females = VOICES.filter(v => v.gender === 'Female');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Males */}
      <div className="space-y-4">
        <h2 className="text-cyan-300 text-sm uppercase tracking-[0.2em] font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-500 rounded-full inline-block shadow-[0_0_5px_cyan]"></span>
          Male Voices (ছেলেদের গলা)
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {males.map(v => <VoiceCard key={v.id} voice={v} selectedVoice={selectedVoice} onSelect={onSelect} />)}
        </div>
      </div>

      {/* Females */}
      <div className="space-y-4">
        <h2 className="text-fuchsia-300 text-sm uppercase tracking-[0.2em] font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-fuchsia-500 rounded-full inline-block shadow-[0_0_5px_fuchsia]"></span>
          Female Voices (মেয়েদের গলা)
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {females.map(v => <VoiceCard key={v.id} voice={v} selectedVoice={selectedVoice} onSelect={onSelect} />)}
        </div>
      </div>
    </div>
  );
};

export default VoiceSelector;