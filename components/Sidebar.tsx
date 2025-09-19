import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { APP_NAME } from '../constants';
import { FilmIcon } from './icons/FilmIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { GiftIcon } from './icons/GiftIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { CoinIcon } from './icons/CoinIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { XIcon } from './icons/XIcon';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  onBuyCredits: () => void;
  onFreeCredits: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, onBuyCredits, onFreeCredits, isOpen, onClose }) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Close user menu when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setUserMenuOpen(false);
    }
  }, [isOpen]);

  // Handle swipe to close
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    let touchStart: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.targetTouches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart === null) return;
      const touchEnd = e.changedTouches[0].clientX;
      if (touchStart - touchEnd > 50) { // Swiped left
        onClose();
      }
      touchStart = null;
    };

    sidebar.addEventListener('touchstart', handleTouchStart);
    sidebar.addEventListener('touchend', handleTouchEnd);

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchend', handleTouchEnd);
    }
  }, [onClose]);

  return (
    <aside 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col p-4 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
            <FilmIcon className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">{APP_NAME}</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close sidebar">
            <XIcon className="w-6 h-6"/>
        </button>
      </div>
      
      <div ref={userMenuRef} className="relative mb-6">
        <button
            onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors text-left"
            aria-expanded={isUserMenuOpen}
            aria-controls="user-menu"
        >
            <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full"/>
                <span className="font-semibold">{user.name}</span>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        <div
            id="user-menu"
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isUserMenuOpen ? 'max-h-40 mt-2' : 'max-h-0'}`}
        >
            <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400 mb-2 text-center">Current Balance</p>
                <div className="flex items-center justify-center gap-2 px-3 py-1 bg-gray-700 rounded-full w-fit mx-auto">
                    <CoinIcon className="w-5 h-5 text-yellow-400"/>
                    <span className="font-bold">{user.credits} Credits</span>
                </div>
            </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <button onClick={onBuyCredits} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <CreditCardIcon className="w-6 h-6 text-green-400" />
          <span>Buy Credits</span>
        </button>
        <button onClick={onFreeCredits} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <GiftIcon className="w-6 h-6 text-blue-400" />
          <span>Free Credits</span>
        </button>
        <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400" />
          <span>About / Help</span>
        </a>
      </nav>

      <div>
        <button onClick={onLogout} className="flex items-center w-full gap-3 p-3 rounded-lg hover:bg-red-800/50 text-red-400 transition-colors">
          <LogoutIcon className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;