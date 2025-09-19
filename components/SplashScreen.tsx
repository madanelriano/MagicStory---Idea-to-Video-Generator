
import React from 'react';
import { FilmIcon } from './icons/FilmIcon';
import { APP_NAME } from '../constants';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 animate-pulse">
      <div className="text-purple-500">
        <FilmIcon className="w-24 h-24 mb-4" />
      </div>
      <h1 className="text-4xl font-bold tracking-wider text-white">
        {APP_NAME}
      </h1>
      <p className="text-gray-400 mt-2">Idea to Video Generator</p>
    </div>
  );
};

export default SplashScreen;
