const ORCHESTRATOR_URL = "http://localhost:8002";

export const initiateScan = async (domain) => {
  try {
    const response = await fetch(`${ORCHESTRATOR_URL}/scan/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain, scan_profile: "standard" }),
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate scan: ${response.statusText}`);
    }

    const data = await response.json();
    return mapScanResponse(data);
  } catch (error) {
    console.error("Scan Error:", error);
    throw error;
  }
};

export const mapScanResponse = (data) => {
  const mappedVulnerabilities = data.findings.map((finding) => {
    let score = 5.0;
    switch (finding.severity.toUpperCase()) {
      case 'CRITICAL': score = 9.5; break;
      case 'HIGH': score = 8.0; break;
      case 'MEDIUM': score = 5.5; break;
      case 'LOW': score = 3.0; break;
      default: score = 5.0;
    }

    return {
      id: finding.id,
      name: finding.title,
      severity: finding.severity.toUpperCase(),
      score: score,
      component: finding.location || "Server Configuration",
      status: "vulnerable",
      description: finding.description,
      aiRemediation: "Pending AI Analysis...", // Will be updated by analysisService
      codeSnippetBefore: "",
      codeSnippetAfter: "",
      evidence: finding.evidence
    };
  });

  return {
    domain: data.domain,
    scanTime: data.scan_time,
    totalFindings: data.total_findings,
    securityScore: data.security_score,
    vulnerabilities: mappedVulnerabilities,
    originalFindings: data.findings // keep original for remediation/analysis payload
  };
};
