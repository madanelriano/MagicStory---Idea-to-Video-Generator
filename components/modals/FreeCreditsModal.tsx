import React, { useState } from 'react';
import { GiftIcon } from '../icons/GiftIcon';
import { XIcon } from '../icons/XIcon';
import { AD_REWARD_CREDITS } from '../../constants';

interface FreeCreditsModalProps {
  onClose: () => void;
  onReward: (amount: number) => void;
}

const FreeCreditsModal: React.FC<FreeCreditsModalProps> = ({ onClose, onReward }) => {
  const [isWatching, setIsWatching] = useState(false);

  const handleWatchAd = () => {
    setIsWatching(true);
    // Simulate ad watching duration
    setTimeout(() => {
      onReward(AD_REWARD_CREDITS);
    }, 3000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
            <GiftIcon className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Get Free Credits</h2>
            <p className="text-gray-400 mt-2">
                {isWatching
                    ? "Watching ad... please wait."
                    : `Watch a short ad to earn ${AD_REWARD_CREDITS} credit.`
                }
            </p>
        </div>
        <div className="mt-8">
            {isWatching ? (
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full animate-[progress_3s_linear_forwards]" style={{'--final-width': '100%'} as React.CSSProperties}></div>
                </div>
            ) : (
                <button
                    onClick={handleWatchAd}
                    className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-md font-bold"
                >
                    Watch Ad
                </button>
            )}
        </div>
        <style>
          {`
            @keyframes progress {
              from { width: 0% }
              to { width: var(--final-width); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default FreeCreditsModal;