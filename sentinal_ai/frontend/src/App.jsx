import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard, sections } from './context/DashboardContext';
import { Shield, Home, Activity, Brain, Wrench, CheckCircle, FileText, Cpu } from 'lucide-react';

// Import Entry Screen
import EntryScreen from './components/EntryScreen';

// Import all sections
import Landing from './sections/Landing/Landing';
import ScanInit from './sections/ScanInit/ScanInit';
import ThreatDashboard from './sections/ThreatDashboard/ThreatDashboard';
import AIAnalysis from './sections/AIAnalysis/AIAnalysis';
import Remediation from './sections/Remediation/Remediation';
import Verification from './sections/Verification/Verification';
import ForensicReport from './sections/ForensicReport/ForensicReport';
import FutureVision from './sections/FutureVision/FutureVision';

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
    goToSection(sections.VERIFICATION);
  };

  const handleVerificationProceed = () => {
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
      case sections.VERIFICATION:
        return <Verification onProceed={handleVerificationProceed} />;
      case sections.FORENSIC_REPORT:
        return <ForensicReport />;
      case sections.FUTURE_VISION:
        return <FutureVision />;
      default:
        return <Landing onBegin={handleLandingBegin} />;
    }
  };

  // Dev Navigation Component (only visible in development)
  const DevNav = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    const navItems = [
      { name: 'Landing', section: sections.LANDING, icon: Home },
      { name: 'Scan', section: sections.SCAN_INIT, icon: Activity },
      { name: 'Threats', section: sections.THREAT_DASHBOARD, icon: Shield },
      { name: 'AI', section: sections.AI_ANALYSIS, icon: Brain },
      { name: 'Remediation', section: sections.REMEDIATION, icon: Wrench },
      { name: 'Verify', section: sections.VERIFICATION, icon: CheckCircle },
      { name: 'Report', section: sections.FORENSIC_REPORT, icon: FileText },
      { name: 'Future', section: sections.FUTURE_VISION, icon: Cpu },
    ];

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="glass-panel p-2 rounded-xl border border-accent-red/30 backdrop-blur-lg opacity-40 hover:opacity-100 transition-all duration-300">
          <div className="text-[8px] font-mono text-accent-red mb-1 text-center">DEV_NAV</div>
          <div className="flex flex-wrap gap-1 justify-end">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => goToSection(item.section)}
                className={`
                  px-1.5 py-0.5 rounded text-[8px] font-mono transition-all duration-200
                  flex items-center gap-0.5
                  ${currentSection === item.section
                    ? 'bg-accent-red text-white shadow-glowRed'
                    : 'bg-bg-secondary/50 text-text-dim hover:bg-accent-red/20 hover:text-accent-red'
                  }
                `}
              >
                <item.icon className="w-2 h-2" />
                {item.name}
              </button>
            ))}
            <button
              onClick={resetApp}
              className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/40 transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </div>
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