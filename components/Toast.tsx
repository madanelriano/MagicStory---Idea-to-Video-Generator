import React, { useEffect } from 'react';
import { ToastState } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const bgColor = isSuccess ? 'bg-green-500/90' : 'bg-red-500/90';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div 
      className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bgColor} animate-slide-in`}
    >
      <Icon className="w-6 h-6" />
      <span className="font-semibold">{toast.message}</span>
      <button onClick={onClose} className="ml-4 text-xl font-bold leading-none text-white/70 hover:text-white">&times;</button>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;