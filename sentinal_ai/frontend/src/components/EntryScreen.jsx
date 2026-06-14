import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Zap, ArrowRight, Cpu, Fingerprint, Terminal, Code, Wifi, Radar, Sparkles, Shield, Eye, Activity } from 'lucide-react';

const EntryScreen = ({ onEnter }) => {
  const [glitchText, setGlitchText] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [showParticleBurst, setShowParticleBurst] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  const fullText = 'SENTINEL AI';
  
  // Typing effect for title
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setGlitchText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);
  
  // Scanning progress animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 20);
    return () => clearInterval(progressInterval);
  }, []);
  
  // Pulsing effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseIntensity(prev => (prev + 0.08) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(pulseInterval);
  }, []);
  
  // Dramatic glitch effect
  const [glitchActive, setGlitchActive] = useState(false);
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);
  
  const pulseScale = 1 + Math.sin(pulseIntensity * 4) * 0.08;
  const glowOpacity = 0.3 + Math.sin(pulseIntensity * 3) * 0.2;
  
  const handleEnter = () => {
    setAccessGranted(true);
    setShowParticleBurst(true);
    
    // Dramatic flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = '#ff1a3c';
    flash.style.zIndex = '1000';
    flash.style.opacity = '0';
    flash.style.transition = 'opacity 0.3s ease';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);
    
    setTimeout(() => { flash.style.opacity = '0.6'; }, 10);
    setTimeout(() => { flash.style.opacity = '0'; }, 300);
    setTimeout(() => { document.body.removeChild(flash); }, 600);
    
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-bg-primary"
    >
      {/* Particle Burst Effect */}
      {showParticleBurst && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(250)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: '50%', 
                y: '50%', 
                scale: 0,
                opacity: 1
              }}
              animate={{ 
                x: `${50 + (Math.random() - 0.5) * 200}%`, 
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                scale: Math.random() * 2 + 0.5,
                opacity: 0
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: i % 3 === 0 ? '#ff1a3c' : i % 3 === 1 ? '#00e5ff' : '#9d4dff',
                boxShadow: `0 0 10px ${i % 3 === 0 ? '#ff1a3c' : i % 3 === 1 ? '#00e5ff' : '#9d4dff'}`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Animated Cyber Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-primary to-bg-secondary" />
        
        {/* Animated Hex Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexGridAnimated" x="0" y="0" width="80" height="138.564" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 23.094 L80 69.282 L40 92.376 L0 69.282 L0 23.094 Z" fill="none" stroke="#ff1a3c" strokeWidth="0.8">
                <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M40 138.564 L80 115.47 L80 69.282 L40 46.188 L0 69.282 L0 115.47 Z" fill="none" stroke="#ff1a3c" strokeWidth="0.8">
                <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexGridAnimated)" />
        </svg>
        
        {/* Moving Diagonal Scan Lines */}
        <motion.div
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[200%] h-full"
        >
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-accent-red to-transparent"
              style={{
                top: `${i * 50}px`,
                width: '100%',
                opacity: 0.15,
                transform: `rotate(${15 + i * 2}deg)`,
                transformOrigin: 'left'
              }}
            />
          ))}
        </motion.div>
        
        {/* Glowing Orbs with Dramatic Movement */}
        <motion.div
          animate={{ 
            x: [0, 80, 0, -80, 0],
            y: [0, -50, 0, 50, 0],
            scale: [1, 1.2, 1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-red/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -60, 0, 60, 0],
            y: [0, 40, 0, -40, 0],
            scale: [1, 1.15, 1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, 50, 0, -50, 0],
            y: [0, -60, 0, 60, 0],
            scale: [1, 1.1, 1, 1.15, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/8 rounded-full blur-3xl"
        />
        
        {/* Matrix Rain Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100 }}
              animate={{ y: '100vh' }}
              transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: i * 0.1, ease: "linear" }}
              className="absolute text-xs font-mono text-accent-red"
              style={{ left: `${Math.random() * 100}%` }}
            >
              {[...Array(20)].map((_, j) => (
                <div key={j}>{Math.random() > 0.6 ? '1' : '0'}</div>
              ))}
            </motion.div>
          ))}
        </div>
        
        {/* Dramatic Scanning Line */}
        <motion.div
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-48 bg-gradient-to-b from-transparent via-accent-red/30 to-transparent blur-xl"
        />
        
        {/* Pulsing Red Ring at Center */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-accent-red/30"
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Dramatic Lock Icon with Pulse */}
        <motion.div
          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
          animate={{ scale: pulseScale, rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            {/* Rotating outer rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-40px] border-2 border-accent-red/40 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-60px] border border-accent-cyan/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-80px] border border-accent-purple/20 rounded-full"
            />
            
            {/* Pulsing glow ring */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-[-30px] bg-accent-red/40 rounded-full blur-2xl"
            />
            
            {/* Main lock */}
            <motion.div 
              animate={{ 
                boxShadow: [
                  `0 0 20px rgba(255,26,60,${glowOpacity})`, 
                  `0 0 60px rgba(255,26,60,${glowOpacity + 0.3})`, 
                  `0 0 20px rgba(255,26,60,${glowOpacity})`
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="relative w-28 h-28 rounded-full bg-gradient-to-br from-accent-red/20 to-transparent border-4 border-accent-red/70 flex items-center justify-center backdrop-blur-sm"
            >
              {accessGranted ? (
                <Shield className="w-14 h-14 text-status-success" strokeWidth={1.5} />
              ) : (
                <Lock className="w-14 h-14 text-accent-red" strokeWidth={1.5} />
              )}
            </motion.div>
            
            {/* Radar sweep effect */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-100px] flex items-center justify-center pointer-events-none"
            >
              <Radar className="w-48 h-48 text-accent-cyan/20" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Glitch Title - FIXED: No double AI */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 relative ${glitchActive ? 'animate-glitch' : ''}`}
        >
          <span className="text-white drop-shadow-2xl">{glitchText}</span>
          
          {/* Glitch overlays - FIXED: No extra "AI" here */}
          {glitchActive && (
            <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none">
              <div className="absolute top-0 left-0 w-full text-7xl md:text-8xl lg:text-9xl font-black text-accent-red blur-sm translate-x-1">
                {fullText}
              </div>
              <div className="absolute top-0 left-0 w-full text-7xl md:text-8xl lg:text-9xl font-black text-accent-cyan blur-sm -translate-x-1">
                {fullText}
              </div>
            </div>
          )}
        </motion.h1>
        
        {/* Dramatic Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <Terminal className="w-4 h-4 text-accent-red animate-pulse" />
          <span className="text-gray-400 font-mono text-sm tracking-wider">AUTONOMOUS SECURITY CO-PILOT</span>
          <Code className="w-4 h-4 text-accent-cyan animate-pulse" />
        </motion.div>
        
        {/* Animated Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-32 h-px bg-gradient-to-r from-transparent via-accent-red to-transparent mx-auto mb-8"
        />
        
        {/* Dramatic Scan Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="flex justify-between text-[10px] font-mono text-text-dim mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 text-accent-red animate-pulse" />
              <span>INITIALIZING SENTINEL CORE</span>
            </div>
            <span className="text-accent-cyan font-bold">{scanProgress}%</span>
          </div>
          <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${scanProgress}%` }}
              transition={{ duration: 0.05 }}
              className="h-full bg-gradient-to-r from-accent-red via-accent-cyan to-accent-purple rounded-full shadow-glowRed"
            />
          </div>
        </motion.div>
        
        {/* Dramatic Status Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          {[
            { label: 'SECURE SHELL', status: 'ACTIVE', color: 'status-success', active: true },
            { label: 'ENCRYPTION', status: 'AES-256', color: 'accent-cyan', active: true },
            { label: 'AI ENGINE', status: accessGranted ? 'READY' : 'INITIALIZING', color: 'accent-purple', active: true }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.3 }}
              className="text-center"
            >
              <div className={`text-[8px] font-mono text-${item.color}`}>{item.label}</div>
              <div className={`text-[10px] font-mono font-bold text-${item.color} ${item.active ? 'animate-pulse' : ''}`}>{item.status}</div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* ENTER BUTTON - Dramatic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={handleEnter}
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(255,26,60,0.5)',
                '0 0 50px rgba(255,26,60,0.9)',
                '0 0 20px rgba(255,26,60,0.5)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="group relative px-14 py-5 rounded-2xl bg-gradient-to-r from-accent-red to-red-700 text-white font-bold text-xl font-mono tracking-wider overflow-hidden cursor-pointer"
          >
            {/* Animated border pulse */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-2xl animate-pulse" />
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            {/* Button content */}
            <div className="relative flex items-center gap-3">
              <Sparkles className="w-5 h-5 animate-pulse" />
              ACCESS SECURE TERMINAL
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>
        </motion.div>
        
        {/* Dramatic Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-0 right-0 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-[8px] font-mono">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
              <span className="text-gray-500">SECURE CONNECTION</span>
            </div>
            <div className="w-px h-3 bg-gray-700" />
            <div className="flex items-center gap-2">
              <Fingerprint className="w-3 h-3 text-gray-500" />
              <span className="text-gray-500">BIOMETRIC READY</span>
            </div>
            <div className="w-px h-3 bg-gray-700" />
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-gray-500 animate-pulse" />
              <span className="text-gray-500">AI CORE v2.4.1</span>
            </div>
            <div className="w-px h-3 bg-gray-700" />
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-status-success animate-pulse" />
              <span className="text-gray-500">SYSTEM READY</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EntryScreen;