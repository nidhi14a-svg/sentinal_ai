import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard, sections } from './context/DashboardContext';
import { Shield, Home, Activity, Brain, Wrench, CheckCircle, FileText, Cpu, Menu, X } from 'lucide-react';

// Import Entry Screen
import EntryScreen from './components/EntryScreen';

// Import all sections
import Landing from './sections/Landing/Landing';
import ScanInit from './sections/ScanInit/ScanInit';
import ThreatDashboard from './sections/ThreatDashboard/ThreatDashboard';
import AIAnalysis from './sections/AIAnalysis/AIAnalysis';
import Remediation from './sections/Remediation/Remediation';
import ForensicReport from './sections/ForensicReport/ForensicReport';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1],
};

function App() {
  const [showEntry, setShowEntry] = useState(true);
  const {
    currentSection,
    resolvedCount,
    goToSection,
    selectVulnerability,
    markRemediationComplete,
    resetApp,
  } = useDashboard();

  // Handle entry screen exit - only when user clicks the button
  const handleEntryExit = () => {
    setShowEntry(false);
    // Small delay to ensure entry screen exit animation completes
    setTimeout(() => {
      goToSection(sections.LANDING);
    }, 200);
  };

  // Navigation callbacks
  const handleLandingBegin = () => {
    goToSection(sections.SCAN_INIT);
  };

  const handleScanComplete = () => {
    goToSection(sections.THREAT_DASHBOARD);
  };

  const handleThreatProceed = () => {
    goToSection(sections.AI_ANALYSIS);
  };

  const handleSelectVulnerability = (id) => {
    selectVulnerability(id);
  };

  const handleAIAnalysisProceed = () => {
    goToSection(sections.REMEDIATION);
  };

  const handleRemediationProceed = () => {
    markRemediationComplete();
    goToSection(sections.FORENSIC_REPORT);
  };

  // Render current section
  const renderSection = () => {
    switch (currentSection) {
      case sections.LANDING:
        return <Landing onBegin={handleLandingBegin} />;
      case sections.SCAN_INIT:
        return <ScanInit onComplete={handleScanComplete} />;
      case sections.THREAT_DASHBOARD:
        return (
          <ThreatDashboard
            resolvedCount={resolvedCount}
            onSelectVulnerability={handleSelectVulnerability}
            onProceed={handleThreatProceed}
          />
        );
      case sections.AI_ANALYSIS:
        return <AIAnalysis onProceed={handleAIAnalysisProceed} />;
      case sections.REMEDIATION:
        return <Remediation onProceed={handleRemediationProceed} />;
      case sections.FORENSIC_REPORT:
        return <ForensicReport />;
      default:
        return <Landing onBegin={handleLandingBegin} />;
    }
  };

  // Dev Navigation Component (only visible in development)
  const DevNav = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
      { name: 'Landing', section: sections.LANDING, icon: Home },
      { name: 'Scan', section: sections.SCAN_INIT, icon: Activity },
      { name: 'Threats', section: sections.THREAT_DASHBOARD, icon: Shield },
      { name: 'AI', section: sections.AI_ANALYSIS, icon: Brain },
      { name: 'Remediation', section: sections.REMEDIATION, icon: Wrench },
      { name: 'Report', section: sections.FORENSIC_REPORT, icon: FileText },
    ];

    return (
      <div className="fixed top-4 left-4 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-xl border transition-all duration-300 shadow-glowCyan backdrop-blur-md flex items-center justify-center
            ${isOpen 
              ? 'bg-accent-cyan/20 border-accent-cyan text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
              : 'bg-bg-panel/90 border-accent-cyan/50 text-accent-cyan hover:bg-accent-cyan/20 hover:border-accent-cyan hover:text-white'}
          `}
          aria-label="Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 w-56 p-3 rounded-xl border border-accent-cyan/50 bg-bg-panel/95 backdrop-blur-xl shadow-[0_0_25px_rgba(0,229,255,0.2)] flex flex-col gap-2"
            >
              <div className="text-[11px] font-mono text-accent-cyan mb-2 font-bold uppercase tracking-wider border-b border-accent-cyan/20 pb-2">
                System Navigation
              </div>
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    goToSection(item.section);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2.5 rounded-lg text-sm font-mono transition-all duration-200
                    flex items-center gap-3 border
                    ${currentSection === item.section
                      ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                      : 'bg-transparent text-text-primary border-transparent hover:bg-bg-secondary hover:text-accent-cyan hover:border-accent-cyan/30'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => {
                  resetApp();
                  setIsOpen(false);
                }}
                className="w-full mt-2 px-3 py-2.5 rounded-lg text-sm font-mono bg-accent-red/10 text-accent-red border border-accent-red/30 hover:bg-accent-red/20 hover:shadow-[0_0_10px_rgba(255,26,60,0.2)] transition-all duration-200 flex items-center justify-center gap-2"
              >
                Reset Application
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-bg-primary overflow-x-hidden font-sans text-text-primary">
      {/* Entry Screen - Shows first, only closes when user clicks button */}
      <AnimatePresence mode="wait">
        {showEntry && <EntryScreen onEnter={handleEntryExit} />}
      </AnimatePresence>

      {/* Main App Content - Only shown after entry screen closes */}
      {!showEntry && (
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Main Content */}
          <main className="flex-1 w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="w-full"
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Dev Navigation */}
          <DevNav />
        </div>
      )}
    </div>
  );
}

export default App;