import React from 'react';
import { FilmIcon } from './icons/FilmIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { APP_NAME } from '../constants';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8 overflow-y-auto">
      <div className="text-center max-w-md w-full">
        <div className="flex justify-center text-purple-500 mb-6">
          <FilmIcon className="w-20 h-20" />
        </div>
        <h1 className="text-5xl font-extrabold text-white">{APP_NAME}</h1>
        <p className="mt-3 text-lg text-gray-300">
          Turn your brightest ideas into stunning videos effortlessly.
        </p>
        <div className="mt-12">
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
          >
            <GoogleIcon className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;