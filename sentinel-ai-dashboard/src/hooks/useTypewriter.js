import { useState, useEffect } from 'react';

export function useTypewriter(text, speed = 20, startTrigger = true) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!startTrigger || !text) return;
    setDisplayText('');
    let index = 0;
    
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, startTrigger]);

  return displayText;
}
