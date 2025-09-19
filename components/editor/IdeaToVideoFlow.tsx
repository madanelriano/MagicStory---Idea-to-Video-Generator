import React, { useState } from 'react';
import { Project } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { SCRIPT_GENERATION_COST } from '../../constants';

interface IdeaToVideoFlowProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  onGenerate: (idea: string, duration: number) => Promise<void>;
}

const IdeaToVideoFlow: React.FC<IdeaToVideoFlowProps> = ({ project, setProject, onGenerate }) => {
  const [scriptDuration, setScriptDuration] = useState(1);

  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProject(prev => ({ ...prev, idea: e.target.value }));
  };

  const handleGenerateClick = () => {
    onGenerate(project.idea, scriptDuration);
  };
  
  return (
    <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg">
            <div className="text-center">
                <SparklesIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Describe Your Video Idea</h2>
                <p className="text-gray-400 mb-6">We'll generate a script and find relevant scenes based on your concept.</p>
            </div>
            
            <textarea
              value={project.idea}
              onChange={handleIdeaChange}
              placeholder="e.g., A brief history of ancient Rome, focusing on the Colosseum and Julius Caesar."
              className="w-full h-32 p-3 bg-gray-800 border-2 border-gray-700 rounded-md focus:border-purple-500 focus:ring-purple-500 transition"
            />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-1">
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                        Duration (mins)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        value={scriptDuration}
                        onChange={(e) => setScriptDuration(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        min="1"
                        className="w-full p-2 bg-gray-800 border-2 border-gray-700 rounded-md focus:border-purple-500 focus:ring-purple-500 transition"
                    />
                </div>
                <button
                    onClick={handleGenerateClick}
                    disabled={!project.idea.trim()}
                    className="sm:col-span-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Generate Script & Scenes ({SCRIPT_GENERATION_COST * 2} Credits)
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center sm:text-right">Note: This action includes both script generation and scene analysis.</p>
        </div>
    </div>
  );
};

export default IdeaToVideoFlow;
