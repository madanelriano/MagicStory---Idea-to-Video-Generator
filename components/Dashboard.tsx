import React, { useState, useRef } from 'react';
import { User } from '../types';
import Sidebar from './Sidebar';
import { PlusIcon } from './icons/PlusIcon';
import BuyCreditsModal from './modals/BuyCreditsModal';
import FreeCreditsModal from './modals/FreeCreditsModal';
import { MenuIcon } from './icons/MenuIcon';

interface DashboardProps {
  user: User;
  onNewProject: () => void;
  onLogout: () => void;
  updateUserCredits: (amount: number, successMessage?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNewProject, onLogout, updateUserCredits }) => {
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [isFreeModalOpen, setFreeModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const touchStartRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchEnd - touchStartRef.current;
    
    // Swipe right to open
    if (swipeDistance > 50 && touchStartRef.current < 50) {
      setIsSidebarOpen(true);
    }
    
    // Swipe left to close (can be done on the overlay)
    if (swipeDistance < -50) {
      setIsSidebarOpen(false);
    }

    touchStartRef.current = null;
  };

  return (
    <div 
      className="min-h-screen bg-gray-800 relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        onBuyCredits={() => setBuyModalOpen(true)}
        onFreeCredits={() => setFreeModalOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen">
         <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="absolute top-5 left-5 text-gray-300 hover:text-white transition-colors z-20"
            aria-label="Open sidebar"
          >
            <MenuIcon className="w-8 h-8"/>
         </button>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="mt-4 text-lg text-gray-300">Ready to create something magical?</p>
          <button
            onClick={onNewProject}
            className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 duration-300"
          >
            <PlusIcon className="w-6 h-6" />
            New Project
          </button>
        </div>
      </main>
      
      {isBuyModalOpen && (
        <BuyCreditsModal 
          onClose={() => setBuyModalOpen(false)} 
          onPurchase={(amount) => {
            updateUserCredits(amount, `${amount} credits purchased`);
            setBuyModalOpen(false);
          }} 
        />
      )}
      
      {isFreeModalOpen && (
        <FreeCreditsModal 
          onClose={() => setFreeModalOpen(false)}
          onReward={(amount) => {
            updateUserCredits(amount, `You earned ${amount} credit`);
            setFreeModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;