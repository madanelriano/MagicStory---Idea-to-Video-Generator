import React from 'react';
import { Scene, TransitionType } from '../../types';
import { XIcon } from '../icons/XIcon';
import { CutIcon } from '../icons/CutIcon';
import { FadeIcon } from '../icons/FadeIcon';
import { SlideLeftIcon } from '../icons/SlideLeftIcon';
import { WipeRightIcon } from '../icons/WipeRightIcon';

interface TransitionSelectorModalProps {
  scene: Scene;
  onClose: () => void;
  onSelect: (sceneId: string, type: TransitionType) => void;
}

const transitions: { type: TransitionType; label: string; description: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { type: 'cut', label: 'Cut', description: 'An instant switch from one scene to the next.', icon: CutIcon },
  { type: 'fade', label: 'Fade', description: 'Gradually fades out the current scene to black, then fades in the next.', icon: FadeIcon },
  { type: 'slide-left', label: 'Slide Left', description: 'The next scene slides in from the right, covering the current one.', icon: SlideLeftIcon },
  { type: 'wipe-right', label: 'Wipe Right', description: 'The next scene is revealed with a line moving from left to right.', icon: WipeRightIcon },
];

const TransitionSelectorModal: React.FC<TransitionSelectorModalProps> = ({ scene, onClose, onSelect }) => {
  const currentTransition = scene.transition || 'cut';
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Select Transition</h2>
            <p className="text-gray-400 mt-1">Choose how this scene transitions to the next one.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {transitions.map((t) => (
                <button
                    key={t.type}
                    onClick={() => onSelect(scene.id, t.type)}
                    className={`text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 ${currentTransition === t.type ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:bg-gray-700/50'}`}
                >
                    <div className="flex-shrink-0 bg-gray-900 p-2 rounded-md mt-1">
                      <t.icon className="w-6 h-6 text-purple-400"/>
                    </div>
                    <div>
                        <span className="font-bold text-lg">{t.label}</span>
                        <p className="text-sm text-gray-400">{t.description}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TransitionSelectorModal;
