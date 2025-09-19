import React from 'react';
import { Project } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { SCRIPT_GENERATION_COST } from '../../constants';

interface ScriptToVideoFlowProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  onGenerate: (script: string) => Promise<void>;
}

const ScriptToVideoFlow: React.FC<ScriptToVideoFlowProps> = ({ project, setProject, onGenerate }) => {

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProject(prev => ({ ...prev, script: e.target.value }));
  };
  
  const handleGenerateClick = () => {
    onGenerate(project.script);
  };
  
  return (
    <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl h-full flex flex-col bg-gray-900 p-8 rounded-lg shadow-lg">
            <div className="text-center flex-shrink-0">
                <PencilIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Input Your Script</h2>
                <p className="text-gray-400 mb-6">Paste your script below. We'll analyze it to find matching video clips for each scene.</p>
            </div>
            
            <textarea
              value={project.script}
              onChange={handleScriptChange}
              placeholder="Your generated or pasted script will appear here..."
              className="w-full flex-grow p-4 bg-gray-800 border-2 border-gray-700 rounded-md focus:border-purple-500 focus:ring-purple-500 transition"
            />
             <button
              onClick={handleGenerateClick}
              disabled={!project.script}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-500"
            >
              <SparklesIcon className="w-5 h-5" />
              Generate Scenes ({SCRIPT_GENERATION_COST} Credit)
            </button>
        </div>
    </div>
  );
};

export default ScriptToVideoFlow;
