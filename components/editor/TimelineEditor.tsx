import React, { useState } from 'react';
import { Project, Scene, TransitionType } from '../../types';
import { PencilIcon } from '../icons/PencilIcon';
import { FilmIcon } from '../icons/FilmIcon';
import { MusicNoteIcon } from '../icons/MusicNoteIcon';
import ReplaceClipModal from '../modals/ReplaceClipModal';
import BackgroundMusicModal from '../modals/BackgroundMusicModal';
import TransitionSelectorModal from '../modals/TransitionSelectorModal';
import VolumeSlider from '../VolumeSlider';
import { CutIcon } from '../icons/CutIcon';
import { FadeIcon } from '../icons/FadeIcon';
import { SlideLeftIcon } from '../icons/SlideLeftIcon';
import { WipeRightIcon } from '../icons/WipeRightIcon';
import VideoPreview from './VideoPreview';

interface TimelineEditorProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const transitionIcons: Record<TransitionType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  cut: CutIcon,
  fade: FadeIcon,
  'slide-left': SlideLeftIcon,
  'wipe-right': WipeRightIcon,
};

const transitionLabels: Record<TransitionType, string> = {
    cut: 'Cut',
    fade: 'Fade',
    'slide-left': 'Slide',
    'wipe-right': 'Wipe',
};

const TimelineEditor: React.FC<TimelineEditorProps> = ({ project, setProject, showToast }) => {
  const [sceneToReplace, setSceneToReplace] = useState<Scene | null>(null);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [editingTransitionForScene, setEditingTransitionForScene] = useState<Scene | null>(null);
  
  const handleOpenReplaceModal = (scene: Scene) => {
    setSceneToReplace(scene);
  };
  
  const handleCloseReplaceModal = () => {
    setSceneToReplace(null);
  };
  
  const handleReplaceClip = (newVideoUrl: string) => {
    if (!sceneToReplace) return;
    
    setProject(prev => ({
        ...prev,
        scenes: prev.scenes.map(s => 
            s.id === sceneToReplace.id ? { ...s, videoUrl: newVideoUrl } : s
        )
    }));
    showToast('Clip replaced successfully!', 'success');
    handleCloseReplaceModal();
  };
  
  const handleSetMusic = (music: { name: string; url: string } | null) => {
    setProject(prev => ({ ...prev, backgroundMusic: music || undefined }));
    setIsMusicModalOpen(false);
    showToast(music ? `Background music set to "${music.name}".` : 'Background music removed.', 'success');
  };

  const handleSceneVolumeChange = (sceneId: string, volume: number) => {
    setProject(prev => ({
      ...prev,
      scenes: prev.scenes.map(s =>
        s.id === sceneId ? { ...s, volume } : s
      )
    }));
  };

  const handleBackgroundMusicVolumeChange = (volume: number) => {
    setProject(prev => ({ ...prev, backgroundMusicVolume: volume }));
  };
  
  const handleTransitionChange = (sceneId: string, type: TransitionType) => {
    setProject(prev => ({
        ...prev,
        scenes: prev.scenes.map(s =>
            s.id === sceneId ? { ...s, transition: type } : s
        )
    }));
    setEditingTransitionForScene(null);
  };

  const getTransitionIcon = (type: TransitionType | undefined) => {
    const Icon = transitionIcons[type || 'cut'];
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row gap-6 min-h-0">
      {/* Video Preview Column */}
      <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col">
        <VideoPreview project={project} />
      </div>

      {/* Controls and Timeline Column */}
      <div className="w-full md:w-2/5 lg:w-1/3 bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg flex flex-col min-h-0">
        <div className="flex-shrink-0">
          <h2 className="text-xl font-semibold mb-4">Timeline &amp; Controls</h2>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          {project.scenes.length > 0 ? (
            <ul className="space-y-0">
              {project.scenes.map((scene, index) => (
                <li key={scene.id} className="relative pb-8">
                  {/* Dotted line connector */}
                  {index < project.scenes.length - 1 && (
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-600 border-l-2 border-dashed border-gray-600" aria-hidden="true" />
                  )}

                  <div className="relative flex items-start space-x-3">
                      <>
                          <div className="relative">
                              <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center ring-4 ring-gray-900">
                                  <span className="font-bold text-gray-300">{index + 1}</span>
                              </div>
                          </div>
                          <div className="min-w-0 flex-1 py-1.5">
                              <div className="flex flex-col gap-3 bg-gray-800 p-3 rounded-md">
                                <div className="flex items-start gap-4">
                                  <div className="flex-grow">
                                    <p className="font-semibold text-white">{scene.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {scene.keywords.map(kw => (
                                        <span key={kw} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{kw}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="w-32 h-20 bg-black rounded-md overflow-hidden flex-shrink-0 relative group">
                                      <img src={scene.videoUrl} alt="Scene thumbnail" className="w-full h-full object-cover" />
                                      <button 
                                          onClick={() => handleOpenReplaceModal(scene)}
                                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                          aria-label={`Replace clip for scene ${index + 1}`}
                                      >
                                          <PencilIcon className="w-6 h-6 text-white"/>
                                      </button>
                                  </div>
                                </div>
                                <div>
                                  <VolumeSlider
                                    volume={scene.volume}
                                    onChange={(volume) => handleSceneVolumeChange(scene.id, volume)}
                                  />
                                </div>
                              </div>
                          </div>
                      </>
                  </div>

                  {index < project.scenes.length - 1 && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10">
                      <button
                        onClick={() => setEditingTransitionForScene(scene)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 text-xs font-semibold rounded-full transition-colors"
                        title="Change Transition"
                      >
                        {getTransitionIcon(scene.transition)}
                        {transitionLabels[scene.transition || 'cut']}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 rounded-lg border-2 border-dashed border-gray-700">
              <FilmIcon className="w-16 h-16 mb-4" />
              <p className="text-lg font-semibold">Your video timeline is empty.</p>
              <p>Go back to setup to generate scenes from an idea or script.</p>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Background Music</h3>
          <div className="bg-gray-800 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <MusicNoteIcon className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <p className="truncate text-gray-300" title={project.backgroundMusic?.name}>
                  {project.backgroundMusic?.name || 'No music selected'}
                </p>
              </div>
              <button
                onClick={() => setIsMusicModalOpen(true)}
                className="flex-shrink-0 px-4 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold text-sm"
              >
                Change
              </button>
            </div>
            {project.backgroundMusic && (
              <div className="mt-3">
                <VolumeSlider
                  volume={project.backgroundMusicVolume}
                  onChange={handleBackgroundMusicVolumeChange}
                />
              </div>
            )}
          </div>
        </div>
        {sceneToReplace && (
          <ReplaceClipModal 
            scene={sceneToReplace}
            onClose={handleCloseReplaceModal}
            onReplace={handleReplaceClip}
          />
        )}
        {isMusicModalOpen && (
          <BackgroundMusicModal
            currentMusic={project.backgroundMusic}
            onClose={() => setIsMusicModalOpen(false)}
            onSetMusic={handleSetMusic}
          />
        )}
        {editingTransitionForScene && (
          <TransitionSelectorModal
            scene={editingTransitionForScene}
            onClose={() => setEditingTransitionForScene(null)}
            onSelect={handleTransitionChange}
          />
        )}
      </div>
    </div>
  );
};

export default TimelineEditor;