export const reportDataData = {
  scanDetails: {
    scanId: "SEC-9081-ALPHA-2026",
    startTime: "2026-06-13 20:46:09",
    endTime: "2026-06-13 20:55:40",
    operator: "Sentinel Automated AI-Supervisor (v4.2)",
    targetCluster: "Sentinel-Production-East-04",
    totalFilesAudited: 8493,
    totalEndpointsAudited: 247
  },
  complianceStatus: [
    { standard: "SOC 2 Type II", before: "NON-COMPLIANT", after: "COMPLIANT", detail: "Tenant isolation & input escaping fail requirements." },
    { standard: "PCI-DSS v4.0", before: "FAILING", after: "PASSING", detail: "Buffer overflow & SQL injection expose credit transaction gateways." },
    { standard: "HIPAA Security", before: "CRITICAL RISK", after: "SECURED", detail: "SSRF exposes internal medical records repository interfaces." },
    { standard: "ISO 27001", before: "PARTIAL FAILING", after: "COMPLIANT", detail: "BOLA allowed router alteration of security profiles." }
  ],
  securityMetrics: {
    threatScoreBefore: 32,
    threatScoreAfter: 98,
    remediationRate: "100%",
    criticalPatchesApplied: 1,
    highPatchesApplied: 2,
    mediumPatchesApplied: 1,
    lowPatchesApplied: 1
  }
};
