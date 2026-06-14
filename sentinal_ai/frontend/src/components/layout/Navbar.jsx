import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles } from 'lucide-react';

const stages = [
  { key: 'landing', label: 'Landing' },
  { key: 'scanInit', label: 'Scan' },
  { key: 'threatDashboard', label: 'Threats' },
  { key: 'aiAnalysis', label: 'AI Analysis' },
  { key: 'remediation', label: 'Remediation' },
  { key: 'verification', label: 'Verification' },
  { key: 'forensicReport', label: 'Report' },
];

const Navbar = ({ currentSection, onNavigate, completedSections = ['landing'] }) => {
  const currentIdx = stages.findIndex((s) => s.key === currentSection);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;
  const progressPercent = (activeIdx / (stages.length - 1)) * 100;

  // Determine if the indicator should be dimmed (e.g. on landing or futureVision)
  const isOffFlow = currentSection === 'landing' || currentSection === 'futureVision';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 h-16 z-50 bg-bg-primary/75 backdrop-blur-md border-b border-accent-red/20 shadow-[0_1px_15px_rgba(255,26,60,0.08)] font-sans"
    >
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        
        {/* Left Side: Logo & Icon */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent-red/20 rounded-lg blur group-hover:bg-accent-red/40 transition duration-300" />
            <div className="relative p-1.5 rounded-lg bg-bg-panel border border-accent-red/30 group-hover:border-accent-red transition duration-300">
              <Cpu className="w-4 h-4 text-accent-red" />
            </div>
          </div>
          <div>
            <span className="font-mono font-black text-sm tracking-wider text-text-primary group-hover:text-white transition duration-300">
              SENTINEL<span className="text-accent-red text-glow-red">AI</span>
            </span>
          </div>
        </div>

        {/* Center: Mission Progress Step Indicator */}
        <div 
          className={`relative hidden sm:flex items-center justify-between w-[240px] md:w-[380px] transition-opacity duration-300 ${
            isOffFlow ? 'opacity-40' : 'opacity-100'
          }`}
        >
          {/* Base connector line */}
          <div className="absolute left-1 right-1 top-1/2 h-[1px] bg-text-dim/20 -translate-y-1/2 z-0" />
          
          {/* Progress fill line */}
          <div 
            className="absolute left-1 top-1/2 h-[1px] bg-accent-cyan -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `calc(${progressPercent}% - 8px)` }}
          />

          {stages.map((stage, idx) => {
            const isActive = currentSection === stage.key;
            const isCompleted = completedSections.includes(stage.key);
            const isClickable = isCompleted && !isActive;

            return (
              <div key={stage.key} className="relative group flex flex-col items-center">
                {/* Active Highlight Ring (Framer Motion layoutId) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -inset-1.5 rounded-full border border-accent-red/60 bg-accent-red/5 shadow-glowRed"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </AnimatePresence>

                {/* Dot Button */}
                <button
                  disabled={!isClickable}
                  onClick={() => onNavigate(stage.key)}
                  className={`
                    relative z-10 w-2.5 h-2.5 rounded-full border transition-all duration-300
                    ${isActive 
                      ? 'bg-accent-red border-accent-red shadow-glowRed scale-125' 
                      : isCompleted
                        ? 'bg-accent-cyan border-accent-cyan hover:bg-accent-cyan/80 cursor-pointer shadow-glowCyan'
                        : 'bg-bg-panel border-text-dim/40 cursor-not-allowed'
                    }
                  `}
                />

                {/* Tooltip */}
                <div className="absolute top-8 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-30">
                  <div className="bg-bg-secondary border border-border-subtle text-text-primary text-[9px] font-mono py-1 px-2 rounded shadow-glowRedStrong whitespace-nowrap">
                    {stage.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Future Vision & Status */}
        <div className="flex items-center gap-3">
          
          {/* System Online Status */}
          <div className="hidden md:flex items-center gap-1.5 bg-bg-panel/40 px-2 py-1 rounded border border-border-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            <span className="text-[9px] font-mono text-text-dim tracking-wider select-none">SYSTEM ONLINE</span>
          </div>

          {/* Future Vision Button */}
          <button
            onClick={() => onNavigate('futureVision')}
            className={`
              relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-2xs tracking-wider font-bold transition-all duration-300 cursor-pointer
              ${currentSection === 'futureVision'
                ? 'bg-accent-purple text-white border-accent-purple shadow-glowPurple'
                : 'bg-bg-panel border-accent-purple/30 text-accent-purple hover:bg-accent-purple/10 hover:border-accent-purple'
              }
            `}
          >
            <Sparkles className="w-3 h-3" />
            <span>FUTURE VISION</span>
          </button>
        </div>

      </div>
    </motion.header>
  );
};

export default Navbar;