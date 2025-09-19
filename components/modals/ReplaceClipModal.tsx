import React, { useState, useEffect } from 'react';
import { Scene } from '../../types';
import { XIcon } from '../icons/XIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import LoadingSpinner from '../LoadingSpinner';

interface ReplaceClipModalProps {
  scene: Scene;
  onClose: () => void;
  onReplace: (newVideoUrl: string) => void;
}

const ReplaceClipModal: React.FC<ReplaceClipModalProps> = ({ scene, onClose, onReplace }) => {
  const [searchTerm, setSearchTerm] = useState(scene.keywords.join(' '));
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    // Simulate API call to Pexels/etc.
    setTimeout(() => {
      const results = Array.from({ length: 12 }, (_, i) => 
        `https://picsum.photos/seed/${searchTerm.replace(/\s/g, '-')}-${i}/320/180`
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1500);
  };

  // Perform initial search on mount
  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleReplace = () => {
    if (selectedClip) {
      onReplace(selectedClip);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
        <header className="p-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-xl font-bold">Replace Clip</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 flex-shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for videos..."
              className="flex-grow p-2 bg-gray-700 border-2 border-gray-600 rounded-md focus:border-purple-500 focus:ring-purple-500 transition"
            />
            <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold flex items-center gap-2">
              <SearchIcon className="w-5 h-5"/>
              Search
            </button>
          </form>
        </div>

        <main className="flex-grow p-4 overflow-y-auto relative">
          {isSearching && <LoadingSpinner text="Searching for clips..." />}
          {!isSearching && searchResults.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No results found.</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {searchResults.map((url) => (
              <button 
                key={url}
                onClick={() => setSelectedClip(url)}
                className={`aspect-video rounded-md overflow-hidden relative transition-all duration-200 ${selectedClip === url ? 'ring-4 ring-purple-500' : 'ring-2 ring-transparent hover:ring-purple-400'}`}
              >
                <img src={url} alt="Search result" className="w-full h-full object-cover" />
                {selectedClip === url && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </main>
        
        <footer className="p-4 border-t border-gray-700 flex justify-end gap-3">
            <div className="flex-grow flex items-center gap-4">
                <p className="text-gray-400">Current Clip:</p>
                <img src={scene.videoUrl} alt="Current scene" className="w-24 h-14 rounded-md object-cover bg-black" />
            </div>
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold">Cancel</button>
            <button 
                onClick={handleReplace}
                disabled={!selectedClip}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                Replace Clip
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ReplaceClipModal;
