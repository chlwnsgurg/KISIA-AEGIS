'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ProgressLoading } from '@/components/ui/loading';

interface LoadingState {
  isLoading: boolean;
  message: string;
  progress?: number;
}

interface LoadingContextType {
  isLoading: boolean;
  message: string;
  progress?: number;
  showLoading: (message: string, progress?: number) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: '',
    progress: undefined,
  });

  const showLoading = useCallback((message: string, progress?: number) => {
    setLoadingState({
      isLoading: true,
      message,
      progress,
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: '',
      progress: undefined,
    });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress,
    }));
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message,
    }));
  }, []);

  const value: LoadingContextType = {
    isLoading: loadingState.isLoading,
    message: loadingState.message,
    progress: loadingState.progress,
    showLoading,
    hideLoading,
    updateProgress,
    updateMessage,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loadingState.isLoading && (
        <ProgressLoading 
          message={loadingState.message} 
          progress={loadingState.progress}
          fullScreen={true}
        />
      )}
    </LoadingContext.Provider>
  );
};