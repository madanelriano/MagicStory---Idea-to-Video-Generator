import React, { useState, useEffect } from 'react';
import { Project, User, Scene, CreationStep } from '../types';
import { SCRIPT_GENERATION_COST, VIDEO_RENDER_COST, SCENE_DURATION } from '../constants';
import { generateScriptFromIdea, extractKeywordsFromScript } from '../services/geminiService';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlayIcon } from './icons/PlayIcon';
import LoadingSpinner from './LoadingSpinner';

import ChooseMode from './editor/ChooseMode';
import IdeaToVideoFlow from './editor/IdeaToVideoFlow';
import ScriptToVideoFlow from './editor/ScriptToVideoFlow';
import TimelineEditor from './editor/TimelineEditor';


interface EditorProps {
  project: Project;
  user: User;
  onExit: () => void;
  updateUserCredits: (amount: number, successMessage?: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const Editor: React.FC<EditorProps> = ({ project, user, onExit, updateUserCredits, showToast }) => {
  const [localProject, setLocalProject] = useState<Project>(project);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');
  const [renderProgress, setRenderProgress] = useState(0);
  const [creationStep, setCreationStep] = useState<CreationStep>(CreationStep.CHOOSE_MODE);

  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  // Save project to localStorage whenever it changes
  useEffect(() => {
    if (localProject) {
      localStorage.setItem('magiStory_currentProject', JSON.stringify(localProject));
    }
  }, [localProject]);

  const handleGenerateScript = async (idea: string, duration: number) => {
    if (user.credits < SCRIPT_GENERATION_COST) {
      showToast('Not enough credits to generate a script.', 'error');
      return;
    }
    setLoadingText('Generating Script...');
    setIsLoading(true);
    try {
      const script = await generateScriptFromIdea(idea, duration);
      const projectWithScript = { ...localProject, idea, script };
      setLocalProject(projectWithScript);
      updateUserCredits(-SCRIPT_GENERATION_COST, `Script generated for ${SCRIPT_GENERATION_COST} credit.`);
      await handleGenerateScenes(projectWithScript.script, true); // Auto-generate scenes
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'An unknown error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateScenes = async (script: string, isAuto?: boolean) => {
    if (user.credits < SCRIPT_GENERATION_COST) {
      showToast('Not enough credits to generate scenes.', 'error');
      return;
    }
    if (!script.trim()) {
      showToast('Script is empty. Please write a script first.', 'error');
      return;
    }

    setLoadingText('Analyzing Script for Scenes...');
    setIsLoading(true);
    try {
      const extractedScenes = await extractKeywordsFromScript(script);
      const newScenes: Scene[] = extractedScenes.map((scene, index) => ({
        id: `${new Date().getTime()}-${index}`,
        description: scene.scene_description,
        keywords: scene.keywords,
        videoUrl: `https://picsum.photos/seed/${Math.random()}/320/180`,
        volume: 1,
        transition: 'cut',
        duration: SCENE_DURATION,
      }));
      setLocalProject(prev => ({ ...prev, script, scenes: newScenes }));
      if (!isAuto) {
         updateUserCredits(-SCRIPT_GENERATION_COST, `Scenes generated for ${SCRIPT_GENERATION_COST} credit.`);
      }
      setCreationStep(CreationStep.TIMELINE);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'An unknown error occurred.', 'error');
      setIsLoading(false); // only stop loading on error here
    } finally {
        // In the success case, we are moving to the timeline, so loading should naturally stop
        if (!isAuto) {
            setIsLoading(false);
        }
    }
  };
  
  const handleRenderVideo = () => {
    if (localProject.scenes.length === 0) {
        showToast('No scenes to render. Please generate scenes first.', 'error');
        return;
    }
    if (user.credits < VIDEO_RENDER_COST) {
      showToast(`Not enough credits. Rendering costs ${VIDEO_RENDER_COST} credits.`, 'error');
      return;
    }
    
    setLoadingText(`Rendering Video...`);
    setIsLoading(true);
    setRenderProgress(0);

    const duration = 4000;
    const intervalTime = 50;
    const increments = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
        setRenderProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setIsLoading(false);
                updateUserCredits(-VIDEO_RENDER_COST, `Video rendered for ${VIDEO_RENDER_COST} credits.`);
                showToast('Video successfully rendered and saved to gallery!', 'success');
                return 100;
            }
            return prev + increments;
        });
    }, intervalTime);
  };
  
  const renderHeader = () => {
    const isTimeline = creationStep === CreationStep.TIMELINE;
    const showBackButton = creationStep !== CreationStep.CHOOSE_MODE;

    return (
      <header className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={onExit} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
              <span className="font-semibold hidden sm:inline">Dashboard</span>
            </button>
            {showBackButton && (
                <button onClick={() => setCreationStep(CreationStep.CHOOSE_MODE)} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm pl-4 border-l border-gray-600">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="font-semibold">Back to Setup</span>
                </button>
            )}
        </div>
       
        <h1 className="text-xl sm:text-2xl font-bold text-white absolute left-1/2 -translate-x-1/2">
            {isTimeline ? "Video Editor" : "Project Setup"}
        </h1>

        {isTimeline ? (
            <button 
                onClick={handleRenderVideo}
                disabled={isLoading || localProject.scenes.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed">
              <PlayIcon className="w-5 h-5" />
              Render Video
            </button>
        ) : (
            <div className="w-24"></div> // Placeholder for spacing
        )}
      </header>
    );
  };

  const renderContent = () => {
    switch (creationStep) {
        case CreationStep.CHOOSE_MODE:
            return <ChooseMode onSelect={setCreationStep} />;
        case CreationStep.IDEA_TO_VIDEO:
            return <IdeaToVideoFlow onGenerate={handleGenerateScript} project={localProject} setProject={setLocalProject} />;
        case CreationStep.SCRIPT_TO_VIDEO:
            return <ScriptToVideoFlow onGenerate={handleGenerateScenes} project={localProject} setProject={setLocalProject} />;
        case CreationStep.TIMELINE:
            return <TimelineEditor project={localProject} setProject={setLocalProject} showToast={showToast} />;
        default:
            return <ChooseMode onSelect={setCreationStep} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col p-4 sm:p-6 lg:p-8 relative">
       {isLoading && <LoadingSpinner text={loadingText} progress={renderProgress} />}
      {renderHeader()}
      <main className="flex-grow flex flex-col">
        {renderContent()}
      </main>
    </div>
  );
};

export default Editor;