const BACKEND_URL = "http://localhost:8000";

export const applyFix = async (taskId, action = "fix", recommendationId = null) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/scan/${taskId}/fix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, recommendationId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to apply fix: ${response.statusText}`);
    }

    const data = await response.json();
    return mapRemediationResponse(data);
  } catch (error) {
    console.error("Remediation Error:", error);
    throw error;
  }
};

export const getRemediationStatus = async (taskId) => {
  const response = await fetch(`${BACKEND_URL}/api/scan/${taskId}/remediation-status`);
  if (!response.ok) {
    throw new Error(`Failed to fetch remediation status: ${response.statusText}`);
  }
  return response.json();
};

export const applyFixAll = async (taskId) => {
  return applyFix(taskId, "fix-all", null);
};

export const mapRemediationResponse = (data) => {
  return {
    taskId: data.taskId,
    remediationStatus: data.remediationStatus,
    remediationActions: (data.remediationActions || []).map(action => ({
      recommendationId: action.recommendationId,
      status: action.status,
      details: action.details || ""
    })),
    auditTrail: (data.auditTrail || []).map(entry => ({
      timestamp: entry.timestamp,
      action: entry.action,
      recommendationId: entry.recommendationId,
      status: entry.status
    })),
    completedAt: data.completedAt
  };
};
