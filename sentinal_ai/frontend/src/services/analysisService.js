// DEPRECATED: Analysis is now integrated into the scan workflow
// AI analysis happens on the backend and is returned as part of scan results
// Use getScanResults from scanService.js instead

export const extractAnalysisFromScanResults = (scanResults) => {
  // Extract AI analysis from scan results
  const recommendations = scanResults.aiAnalysis?.recommendations || [];
  const analysisMap = {};

  recommendations.forEach((rec) => {
    analysisMap[rec.id] = {
      findingId: rec.findingId,
      title: rec.title,
      severity: rec.severity,
      description: rec.description,
      remediation: rec.remediation,
      estimatedEffort: rec.estimatedEffort,
      explanation: rec.description,
      confidence: "high"
    };
  });

  return {
    domain: scanResults.domain,
    summary: scanResults.aiAnalysis?.summary || "",
    confidenceNotes: scanResults.aiAnalysis?.confidenceNotes || "",
    analysisMap: analysisMap,
    recommendations: recommendations
  };
};
