import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../../types';
import { XIcon } from '../icons/XIcon';
import { MusicNoteIcon } from '../icons/MusicNoteIcon';
import { UploadIcon } from '../icons/UploadIcon';
import { PlayIcon } from '../icons/PlayIcon';
import { PauseIcon } from '../icons/PauseIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

type MusicTrack = { name: string, url: string };

interface BackgroundMusicModalProps {
  currentMusic?: MusicTrack;
  onClose: () => void;
  onSetMusic: (music: MusicTrack | null) => void;
}

const royaltyFreeTracks: MusicTrack[] = [
  { name: "Cinematic Adventure", url: "https://www.bensound.com/bensound-music/bensound-adventure.mp3" },
  { name: "Inspiring Dreams", url: "https://www.bensound.com/bensound-music/bensound-dreams.mp3" },
  { name: "Happy Journey", url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3" },
  { name: "Electronic Pulse", url: "https://www.bensound.com/bensound-music/bensound-scifi.mp3" },
  { name: "Acoustic Breeze", url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3" },
  { name: "Epic Drama", url: "https://www.bensound.com/bensound-music/bensound-epic.mp3" },
];

const BackgroundMusicModal: React.FC<BackgroundMusicModalProps> = ({ currentMusic, onClose, onSetMusic }) => {
  const [activeTab, setActiveTab] = useState<'select' | 'upload'>('select');
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(currentMusic || null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string | null>(null);

  const handlePreview = (track: MusicTrack) => {
    if (audioRef.current) {
      if (isPlaying && currentPreviewUrl === track.url) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = track.url;
        audioRef.current.play();
        setCurrentPreviewUrl(track.url);
        setIsPlaying(true);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const track: MusicTrack = {
        name: file.name,
        url: URL.createObjectURL(file),
      };
      setSelectedTrack(track);
      setActiveTab('upload'); // Switch tab to show the uploaded file
    }
  };
  
  const handleRemoveMusic = () => {
    setSelectedTrack(null);
  }

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);
    audio?.addEventListener('ended', handleEnded);
    return () => {
      audio?.pause();
      audio?.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <audio ref={audioRef} />
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        <header className="p-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-xl font-bold">Choose Background Music</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 border-b border-gray-700">
          <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
            <button onClick={() => setActiveTab('select')} className={`w-full p-2 rounded-md font-semibold transition-colors ${activeTab === 'select' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}>Select a Track</button>
            <button onClick={() => setActiveTab('upload')} className={`w-full p-2 rounded-md font-semibold transition-colors ${activeTab === 'upload' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}>Upload Audio</button>
          </div>
        </div>

        <main className="flex-grow p-4 overflow-y-auto">
          {activeTab === 'select' ? (
            <ul className="space-y-2">
              {royaltyFreeTracks.map((track) => (
                <li key={track.name} className={`p-3 bg-gray-700/50 rounded-lg flex items-center gap-4 transition-all ${selectedTrack?.url === track.url ? 'ring-2 ring-purple-500' : ''}`}>
                  <button onClick={() => handlePreview(track)} className="p-2 bg-gray-600 rounded-full hover:bg-gray-500">
                    {isPlaying && currentPreviewUrl === track.url ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
                  </button>
                  <span className="flex-grow font-semibold">{track.name}</span>
                  <button onClick={() => setSelectedTrack(track)} className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold text-sm disabled:bg-gray-500 disabled:opacity-50" disabled={selectedTrack?.url === track.url}>
                    {selectedTrack?.url === track.url ? 'Selected' : 'Select'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <UploadIcon className="w-16 h-16 text-gray-500 mb-4"/>
                <h3 className="text-xl font-semibold">Upload your audio file</h3>
                <p className="text-gray-400 mb-6">MP3, WAV, or M4A files are supported.</p>
                <label htmlFor="audio-upload" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 cursor-pointer transition-colors">
                    Browse Files
                </label>
                <input id="audio-upload" type="file" accept="audio/mp3,audio/wav,audio/x-m4a" className="hidden" onChange={handleFileChange} />
                {selectedTrack && activeTab === 'upload' && (
                    <div className="mt-8 w-full max-w-sm p-3 bg-gray-700 rounded-lg flex items-center gap-4 ring-2 ring-purple-500">
                        <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <p className="flex-grow font-semibold truncate" title={selectedTrack.name}>{selectedTrack.name}</p>
                    </div>
                )}
            </div>
          )}
        </main>
        
        <footer className="p-4 border-t border-gray-700 flex justify-between items-center">
            <div>
              {selectedTrack && (
                <button onClick={handleRemoveMusic} className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md font-semibold">
                  Remove Music
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold">Cancel</button>
              <button onClick={() => onSetMusic(selectedTrack)} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold">
                Set Music
              </button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default BackgroundMusicModal;