import React, { createContext, useState, useContext, useCallback } from 'react';

// Vulnerability data shared across the app
export const vulnerabilitiesData = [
  {
    id: 'SEC-001',
    title: 'Missing Content-Security-Policy Header',
    severity: 'HIGH',
    description: 'No CSP header detected, allowing arbitrary script execution',
    cvss: '7.2',
    location: 'HTTP Headers',
    impact: 'Attackers can inject malicious scripts',
    fix: 'Add CSP header: default-src \'self\'; script-src \'self\' cdnjs.cloudflare.com',
  },
  {
    id: 'SEC-002',
    title: 'Missing Strict-Transport-Security Header',
    severity: 'MEDIUM',
    description: 'HSTS not enforced, allowing protocol downgrade',
    cvss: '5.8',
    location: 'HTTP Headers',
    impact: 'Man-in-the-middle attacks possible',
    fix: 'Add HSTS header: max-age=31536000; includeSubDomains',
  },
  {
    id: 'SEC-003',
    title: 'Directory Listing Enabled',
    severity: 'HIGH',
    description: '/backup/ directory exposes file listing to any visitor',
    cvss: '7.5',
    location: 'Web Server Config',
    impact: 'Sensitive file exposure',
    fix: 'Disable directory listing in web server config',
  },
  {
    id: 'SEC-004',
    title: 'Outdated TLS Configuration',
    severity: 'CRITICAL',
    description: 'TLS 1.0 still enabled — vulnerable to known protocol attacks',
    cvss: '8.1',
    location: 'SSL/TLS Config',
    impact: 'Connection decryption possible',
    fix: 'Disable TLS 1.0/1.1, enable TLS 1.2/1.3',
  },
];

// Available sections for navigation
export const sections = {
  LANDING: 'landing',
  SCAN_INIT: 'scanInit',
  THREAT_DASHBOARD: 'threatDashboard',
  AI_ANALYSIS: 'aiAnalysis',
  REMEDIATION: 'remediation',
  FORENSIC_REPORT: 'forensicReport',
};

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  // Navigation state
  const [currentSection, setCurrentSection] = useState(sections.LANDING);

  // Security data
  const [securityScore, setSecurityScore] = useState({ before: 58, after: 94 });
  const [vulnerabilities, setVulnerabilities] = useState(vulnerabilitiesData);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [selectedVulnerabilityId, setSelectedVulnerabilityId] = useState(null);

  // Scan data
  const [scanData, setScanData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [remediationStatus, setRemediationStatus] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [taskId, setTaskId] = useState(null);

  // Scan progress
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Mission Setup Data
  const [targetDomain, setTargetDomain] = useState('');
  const [deploymentLink, setDeploymentLink] = useState('');
  const [scanProfile, setScanProfile] = useState('standard');

  // Navigation functions
  const goToSection = useCallback((sectionName) => {
    if (Object.values(sections).includes(sectionName)) {
      setCurrentSection(sectionName);
    } else {
      console.error(`Invalid section: ${sectionName}`);
    }
  }, []);

  const selectVulnerability = useCallback((id) => {
    setSelectedVulnerabilityId(id);
  }, []);

  const markRemediationComplete = useCallback(() => {
    setResolvedCount(4);
  }, []);

  const resetApp = useCallback(() => {
    setCurrentSection(sections.LANDING);
    setResolvedCount(0);
    setSelectedVulnerabilityId(null);
    setScanData(null);
    setAiAnalysis(null);
    setRemediationStatus(null);
    setVerificationData(null);
    setReportData(null);
    setTaskId(null);
    setIsScanning(false);
    setScanProgress(0);
    setTargetDomain('');
    setDeploymentLink('');
    setScanProfile('standard');
  }, []);

  const value = {
    // Navigation
    currentSection,
    goToSection,

    // Security Data
    securityScore,
    setSecurityScore,
    vulnerabilities,
    setVulnerabilities,
    resolvedCount,
    setResolvedCount,
    selectedVulnerabilityId,
    setSelectedVulnerabilityId,
    selectVulnerability,

    // Scan Data
    scanData,
    setScanData,
    aiAnalysis,
    setAiAnalysis,
    remediationStatus,
    setRemediationStatus,
    verificationData,
    setVerificationData,
    reportData,
    setReportData,
    taskId,
    setTaskId,

    // Progress
    isScanning,
    setIsScanning,
    scanProgress,
    setScanProgress,

    // Mission Setup
    targetDomain,
    setTargetDomain,
    deploymentLink,
    setDeploymentLink,
    scanProfile,
    setScanProfile,

    // Actions
    markRemediationComplete,
    resetApp,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};