const ORCHESTRATOR_URL = "http://localhost:8002";

export const runRemediation = async (findings, domain) => {
  try {
    const response = await fetch(`${ORCHESTRATOR_URL}/remediate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ findings, domain }),
    });

    if (!response.ok) {
      throw new Error(`Failed to run remediation: ${response.statusText}`);
    }

    const data = await response.json();
    return mapRemediationResponse(data);
  } catch (error) {
    console.error("Remediation Error:", error);
    throw error;
  }
};

export const mapRemediationResponse = (data) => {
  return {
    domain: data.domain,
    logs: (data.logs || []).map(log => ({
      time: log.time,
      action: log.action,
      status: log.status,
      details: log.details || ""
    })),
    successCount: data.success_count,
    securityScoreAfter: data.security_score_after
  };
};
