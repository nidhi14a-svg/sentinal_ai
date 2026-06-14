const ORCHESTRATOR_URL = "http://localhost:8002";

export const generateReport = async (payload) => {
  try {
    const response = await fetch(`${ORCHESTRATOR_URL}/report/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
    reportId: data.report_id,
    domain: data.domain,
    generatedAt: data.generated_at,
    pdfUrl: data.pdf_url,
    summary: data.summary
  };
};
