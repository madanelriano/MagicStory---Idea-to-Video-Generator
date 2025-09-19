import React from 'react';
import { CreationStep } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { FilmIcon } from '../icons/FilmIcon';

interface ChooseModeProps {
  onSelect: (step: CreationStep) => void;
}

const options = [
  {
    step: CreationStep.IDEA_TO_VIDEO,
    icon: SparklesIcon,
    title: "Idea to Video",
    description: "Start with just a concept and let AI generate a script and scenes for you.",
  },
  {
    step: CreationStep.SCRIPT_TO_VIDEO,
    icon: PencilIcon,
    title: "Script to Video",
    description: "Already have a script? Paste it in and we'll find matching video clips.",
  },
  {
    step: CreationStep.TIMELINE,
    icon: FilmIcon,
    title: "Manual Editor",
    description: "Jump straight into the timeline to build your video from scratch.",
  },
];

const ChooseMode: React.FC<ChooseModeProps> = ({ onSelect }) => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">How would you like to start?</h2>
            <p className="mt-2 text-gray-300">Choose a creation method that best suits your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <button
              key={option.step}
              onClick={() => onSelect(option.step)}
              className="bg-gray-900 p-8 rounded-lg shadow-lg text-center transition-all duration-300 hover:bg-gray-700/80 hover:shadow-purple-500/20 hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                <option.icon className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
              <p className="text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseMode;
