import React from 'react';
import { motion } from 'framer-motion';

const SectionWrapper = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative w-full border border-border-subtle/50 bg-bg-panel/20 backdrop-blur-md rounded-xl p-4 md:p-8 ${className}`}
    >
      {/* Cybersecurity L-bracket Corner Decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-red/40 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-red/40 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-red/40 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-red/40 rounded-br-xl pointer-events-none" />

      {/* Sci-Fi Scanner Grid Lines */}
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent pointer-events-none" />
      <div className="absolute top-10 bottom-10 left-0 w-[1px] bg-gradient-to-b from-transparent via-accent-red/20 to-transparent pointer-events-none" />
      <div className="absolute top-10 bottom-10 right-0 w-[1px] bg-gradient-to-b from-transparent via-accent-red/20 to-transparent pointer-events-none" />

      {/* Decorative Technical Status Tags */}
      <div className="absolute top-2 left-6 text-[8px] font-mono text-text-dim tracking-widest pointer-events-none select-none">
        SYS_SEC_SEC_L1 // ENABLED
      </div>
      <div className="absolute top-2 right-6 text-[8px] font-mono text-text-dim tracking-widest pointer-events-none select-none">
        GRID_POS_A4 // LOCK
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default SectionWrapper;