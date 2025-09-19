import React from 'react';

export interface User {
  name: string;
  avatarUrl: string;
  credits: number;
}

export type TransitionType = 'cut' | 'fade' | 'slide-left' | 'wipe-right';

export interface Scene {
  id: string;
  description: string;
  keywords: string[];
  videoUrl?: string; // a placeholder URL
  volume: number;
  transition?: TransitionType;
  duration: number;
}

export interface Project {
  id: string;
  idea: string;
  script: string;
  scenes: Scene[];
  backgroundMusic?: {
    name: string;
    url: string;
  };
  backgroundMusicVolume: number;
}

export enum AppState {
  SPLASH,
  LOGIN,
  DASHBOARD,
  EDITOR,
}

export enum CreationStep {
  CHOOSE_MODE,
  IDEA_TO_VIDEO,
  SCRIPT_TO_VIDEO,
  TIMELINE,
}


export interface ToastState {
  message: string;
  type: 'success' | 'error';
}