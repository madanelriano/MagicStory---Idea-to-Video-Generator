import React, { useState, useEffect, useCallback } from 'react';
import { User, AppState, Project, ToastState } from './types';
import { INITIAL_CREDITS, SCENE_DURATION } from './constants';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
  const [user, setUser] = useState<User | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState(AppState.LOGIN);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const handleLogin = useCallback(() => {
    // Mock Google Sign-In
    const newUser = {
      name: 'Alex Rider',
      avatarUrl: `https://i.pravatar.cc/150?u=alexrider`,
      credits: INITIAL_CREDITS,
    };
    setUser(newUser);

    // Check for a saved project in localStorage
    const savedProjectJson = localStorage.getItem('magiStory_currentProject');
    if (savedProjectJson) {
      try {
        const savedProject = JSON.parse(savedProjectJson) as Project;
        if (savedProject && savedProject.id) { // Basic validation
          // Add defaults for new properties if they don't exist
          const projectToResume: Project = {
            ...savedProject,
            backgroundMusicVolume: savedProject.backgroundMusicVolume ?? 0.5,
            scenes: savedProject.scenes.map(scene => ({
                ...scene,
                volume: scene.volume ?? 1,
                transition: scene.transition ?? 'cut',
                duration: scene.duration ?? SCENE_DURATION,
            }))
          };
          setCurrentProject(projectToResume);
          setAppState(AppState.EDITOR);
          showToast('Resuming your previous project.', 'success');
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved project:", e);
        localStorage.removeItem('magiStory_currentProject');
      }
    }
    
    // Default flow if no project is resumed
    showToast(`Welcome! You've received ${INITIAL_CREDITS} free credits.`, 'success');
    setAppState(AppState.DASHBOARD);
  }, [showToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentProject(null);
    localStorage.removeItem('magiStory_currentProject');
    setAppState(AppState.LOGIN);
  }, []);

  const handleNewProject = useCallback(() => {
    localStorage.removeItem('magiStory_currentProject');
    setCurrentProject({
      id: new Date().toISOString(),
      idea: '',
      script: '',
      scenes: [],
      backgroundMusic: undefined,
      backgroundMusicVolume: 0.5,
    });
    setAppState(AppState.EDITOR);
  }, []);

  const handleExitEditor = useCallback(() => {
    setCurrentProject(null);
    setAppState(AppState.DASHBOARD);
  }, []);

  const updateUserCredits = (amount: number, successMessage?: string) => {
    if (user) {
      setUser(prevUser => {
        if (!prevUser) return null;
        const newCredits = prevUser.credits + amount;
        if (successMessage) {
            const messageWithBalance = `${successMessage} You have ${newCredits} credits remaining.`;
            showToast(messageWithBalance, 'success');
        }
        return { ...prevUser, credits: newCredits };
      });
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.SPLASH:
        return <SplashScreen />;
      case AppState.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      case AppState.DASHBOARD:
        if (user) {
            return <Dashboard user={user} onNewProject={handleNewProject} onLogout={handleLogout} updateUserCredits={updateUserCredits} />;
        }
        return <LoginScreen onLogin={handleLogin} />;
      case AppState.EDITOR:
        if (user && currentProject) {
            return <Editor project={currentProject} user={user} onExit={handleExitEditor} updateUserCredits={updateUserCredits} showToast={showToast} />;
        }
        return <LoginScreen onLogin={handleLogin} />; // Fallback to login
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Toast toast={toast} onClose={() => setToast(null)} />
      {renderContent()}
    </div>
  );
};

export default App;