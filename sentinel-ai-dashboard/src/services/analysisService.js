const ORCHESTRATOR_URL = "http://localhost:8002";

export const analyzeFindings = async (findings, domain) => {
  try {
    const response = await fetch(`${ORCHESTRATOR_URL}/analyze/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ findings, domain }),
    });

    if (!response.ok) {
      throw new Error(`Failed to analyze findings: ${response.statusText}`);
    }

    const data = await response.json();
    return mapAnalysisResponse(data);
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const mapAnalysisResponse = (data) => {
  const analysisMap = {};
  
  if (data.analysis && Array.isArray(data.analysis)) {
    data.analysis.forEach((item) => {
      // Split the code snippet if it has "VULNERABLE" and "PATCHED" parts, 
      // otherwise just use it as the before snippet.
      let before = item.code_snippet || "";
      let after = "";
      
      if (before.includes("// PATCHED")) {
        const parts = before.split("// PATCHED");
        before = parts[0];
        after = "// PATCHED" + parts[1];
      }

      analysisMap[item.id] = {
        explanation: item.explanation,
        impact: item.impact,
        recommendedFix: item.recommended_fix,
        codeSnippetBefore: before,
        codeSnippetAfter: after,
        confidence: item.confidence
      };
    });
  }

  return {
    domain: data.domain,
    analysisMap
  };
};
