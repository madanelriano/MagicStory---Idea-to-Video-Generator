import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Project, Scene } from '../../types';
import { SCENE_DURATION, TRANSITION_DURATION } from '../../constants';
import { PlayIcon } from '../icons/PlayIcon';
import { PauseIcon } from '../icons/PauseIcon';
import { ReplayIcon } from '../icons/ReplayIcon';

interface VideoPreviewProps {
  project: Project;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ project }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  // FIX: Initialize useRef with null. The overload for useRef() with no arguments is not being resolved correctly, leading to a "Expected 1 arguments, but got 0" error.
  const requestRef = useRef<number | null>(null);
  // FIX: Initialize useRef with null for the same reason as above.
  const lastTimeRef = useRef<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const totalDuration = useMemo(() => {
    return project.scenes.reduce((acc, scene) => acc + (scene.duration || SCENE_DURATION), 0);
  }, [project.scenes]);

  const { currentScene, nextScene, isTransitioning } = useMemo(() => {
    let time = 0;
    for (let i = 0; i < project.scenes.length; i++) {
      const scene = project.scenes[i];
      const duration = scene.duration || SCENE_DURATION;
      if (currentTime < time + duration) {
        const timeInto = currentTime - time;
        return {
          currentScene: scene,
          nextScene: project.scenes[i + 1] || null,
          isTransitioning: duration - timeInto <= TRANSITION_DURATION && project.scenes[i+1] != null,
        };
      }
      time += duration;
    }
    return { currentScene: null, nextScene: null, isTransitioning: false };
  }, [currentTime, project.scenes]);

  const animate = (time: number) => {
    if (lastTimeRef.current != null) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      setCurrentTime(prevTime => {
        const newTime = prevTime + deltaTime;
        if (newTime >= totalDuration) {
          setIsPlaying(false);
          setIsFinished(true);
          return totalDuration;
        }
        return newTime;
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
      audioRef.current?.play();
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      audioRef.current?.pause();
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  useEffect(() => {
    if (audioRef.current && project.backgroundMusic) {
      audioRef.current.volume = project.backgroundMusicVolume;
    }
  }, [project.backgroundMusicVolume, project.backgroundMusic]);
  
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 0.5) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTogglePlay = () => {
    if (isFinished) {
      setCurrentTime(0);
      setIsFinished(false);
      if(audioRef.current) audioRef.current.currentTime = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (newTime < totalDuration) {
      setIsFinished(false);
    }
  };
  
  const getTransitionClass = (position: 'current' | 'next'): string => {
    if (!isTransitioning || !nextScene) return position === 'current' ? 'opacity-100' : 'opacity-0';
    
    const transition = currentScene?.transition || 'cut';
    
    switch (transition) {
      case 'fade':
        return position === 'current' ? 'transition-opacity duration-500 ease-in-out opacity-0' : 'transition-opacity duration-500 ease-in-out opacity-100';
      case 'slide-left':
        return position === 'current' ? 'transition-transform duration-500 ease-in-out -translate-x-full' : 'transition-transform duration-500 ease-in-out translate-x-0';
      case 'wipe-right':
         return position === 'current' ? 'transition-all duration-500 ease-in-out [clip-path:inset(0_100%_0_0)]' : 'opacity-100';
      case 'cut':
      default:
        return position === 'current' ? 'opacity-0' : 'opacity-100';
    }
  };

  const renderPreviewContent = () => {
    if (!currentScene) {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center">
            <p className="text-gray-400">No scenes to preview</p>
        </div>
      );
    }
    
    return (
      <div className="w-full h-full relative overflow-hidden bg-black">
        <img 
            src={currentScene.videoUrl} 
            alt={currentScene.description} 
            className={`w-full h-full object-cover absolute inset-0 ${getTransitionClass('current')}`} 
        />
        {nextScene && (
           <img 
                src={nextScene.videoUrl} 
                alt={nextScene.description} 
                className={`w-full h-full object-cover absolute inset-0 ${getTransitionClass('next')}`} 
                style={{
                    transform: (currentScene?.transition === 'slide-left' && !isTransitioning) ? 'translateX(100%)' : 'translateX(0)',
                }}
           />
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg flex flex-col w-full h-full">
      {project.backgroundMusic && <audio ref={audioRef} src={project.backgroundMusic.url} loop />}
      
      <div className="aspect-video bg-black relative rounded-t-lg overflow-hidden group">
        {renderPreviewContent()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 flex items-center justify-center">
          <button
            onClick={handleTogglePlay}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon className="w-8 h-8"/> : isFinished ? <ReplayIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8"/>}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400">{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
            <input
              type="range"
              min="0"
              max={totalDuration > 0 ? totalDuration : 1}
              step="0.01"
              value={currentTime}
              onChange={handleScrubberChange}
              className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-xs font-mono text-gray-400">{new Date(totalDuration * 1000).toISOString().substr(14, 5)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
