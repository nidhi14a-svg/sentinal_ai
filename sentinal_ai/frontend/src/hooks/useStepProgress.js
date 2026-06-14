import { useState, useEffect } from 'react';

export function useStepProgress(steps, onComplete, isActive = false) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentStepIndex(-1);
      setProgress(0);
      return;
    }

    if (currentStepIndex === -1) {
      setCurrentStepIndex(0);
      return;
    }

    if (currentStepIndex >= steps.length) {
      if (onComplete) onComplete();
      return;
    }

    const currentStep = steps[currentStepIndex];
    const duration = currentStep.duration || 1000;
    const intervalTime = 50;
    const increment = (intervalTime / duration) * 100;
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress((prev) => {
          const baseProgress = ((currentStepIndex + 1) / steps.length) * 100;
          return baseProgress;
        });
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setProgress(() => {
          const stepWeight = 100 / steps.length;
          const baseProgress = (currentStepIndex / steps.length) * 100;
          const addedProgress = (currentProgress / 100) * stepWeight;
          return Math.min(baseProgress + addedProgress, 99.9);
        });
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentStepIndex, steps, isActive, onComplete]);

  return {
    currentStepIndex: Math.min(currentStepIndex, steps.length - 1),
    progress: Math.min(progress, 100),
    isFinished: currentStepIndex >= steps.length
  };
}
