const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const generateReport = async (taskId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/report/${taskId}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to generate report: ${response.statusText}`);
    }

    const data = await response.json();
    return mapReportResponse(data);
  } catch (error) {
    console.error("Report Error:", error);
    throw error;
  }
};

export const mapReportResponse = (data) => {
  return {
    taskId: data.taskId,
    reportId: data.taskId, // Use taskId as reportId
    reportUrl: data.reportUrl,
    artifactPath: data.artifactPath,
    generatedAt: data.generatedAt,
    reportSummary: data.reportSummary
  };
};
