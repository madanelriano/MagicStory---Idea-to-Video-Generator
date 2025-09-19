import React from 'react';
import { VolumeUpIcon } from './icons/VolumeUpIcon';
import { VolumeOffIcon } from './icons/VolumeOffIcon';

interface VolumeSliderProps {
  volume: number;
  onChange: (volume: number) => void;
  className?: string;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, onChange, className = '' }) => {
  const VolumeIcon = volume > 0 ? VolumeUpIcon : VolumeOffIcon;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <VolumeIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  );
};

export default VolumeSlider;
