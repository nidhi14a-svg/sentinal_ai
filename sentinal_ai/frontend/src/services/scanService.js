const BACKEND_URL = "http://localhost:8000";

export const initiateScan = async (domain, scanProfile = "full-scan") => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/scan/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain, scanProfile }),
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate scan: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return task metadata (taskId, status, progress)
  } catch (error) {
    console.error("Scan Error:", error);
    throw error;
  }
};

export const getScanStatus = async (taskId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/scan/${taskId}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch scan status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Scan Status Error:", error);
    throw error;
  }
};

export const getScanResults = async (taskId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/scan/${taskId}/results`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch scan results: ${response.statusText}`);
    }

    const data = await response.json();
    return mapScanResults(data);
  } catch (error) {
    console.error("Scan Results Error:", error);
    throw error;
  }
};

export const mapScanResults = (data) => {
  // Map backend findings to UI format
  const mappedFindings = (data.findings || []).map((finding) => {
    let score = 5.0;
    switch (finding.severity?.toUpperCase()) {
      case 'CRITICAL': score = 9.5; break;
      case 'HIGH': score = 8.0; break;
      case 'MEDIUM': score = 5.5; break;
      case 'LOW': score = 3.0; break;
      default: score = 5.0;
    }

    return {
      id: finding.findingId || finding.id,
      name: finding.title,
      severity: finding.severity?.toUpperCase() || "UNKNOWN",
      score: score,
      component: finding.source || "Scanner",
      status: "vulnerable",
      description: finding.description,
      evidence: finding.evidence || ""
    };
  });

  // Map AI analysis recommendations
  const recommendations = (data.aiAnalysis?.recommendations || []).map((rec) => ({
    id: rec.id,
    findingId: rec.findingId,
    title: rec.title,
    severity: rec.severity,
    description: rec.description,
    remediation: rec.remediation,
    estimatedEffort: rec.estimatedEffort
  }));

  return {
    taskId: data.taskId,
    domain: data.domain,
    reconData: data.reconData || {},
    findings: mappedFindings,
    aiAnalysis: {
      summary: data.aiAnalysis?.analysisSummary || "",
      confidenceNotes: data.aiAnalysis?.confidenceNotes || "",
      recommendations: recommendations
    },
    reportReady: data.reportReady || false
  };
};
