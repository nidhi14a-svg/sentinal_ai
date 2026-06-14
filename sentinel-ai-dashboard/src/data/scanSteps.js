export const scanStepsData = [
  {
    id: "scan-step-01",
    label: "Analyzing API Gateway routing rules and security endpoints...",
    targetComponent: "Core API Gateway",
    duration: 1800, // ms
    logs: [
      "SENTINEL-SCAN [INIT]: Loading gateway interface maps...",
      "SYSTEM: Checking routing tables for open redirects...",
      "WARNING: Found unchecked packet stream handler in Core API Gateway. Tagged CVE-2026-1184."
    ]
  },
  {
    id: "scan-step-02",
    label: "Scanning Database Proxy transactions and injection hazards...",
    targetComponent: "Database Proxy",
    duration: 2200,
    logs: [
      "SENTINEL-SCAN [INIT]: Connecting to database proxy driver cluster...",
      "SYSTEM: Executing injection patterns against select statements...",
      "ALERT: Raw query query-string concatenation identified. Tagged CVE-2026-3042."
    ]
  },
  {
    id: "scan-step-03",
    label: "Validating Tenant access controls and SSRF filters...",
    targetComponent: "Auth Microservice",
    duration: 2000,
    logs: [
      "SENTINEL-SCAN [INIT]: Testing network gateway isolation boundaries...",
      "SYSTEM: Sending local RFC-1918 resolve requests...",
      "ALERT: Outgoing resolver ignores private host masks. SSRF detected. Tagged CVE-2026-4491.",
      "WARNING: Missing DOM escaping script tags in login auditing log. Tagged CVE-2026-9021."
    ]
  },
  {
    id: "scan-step-04",
    label: "Verifying Kubernetes cluster config maps and RBAC profiles...",
    targetComponent: "Kubernetes Ingress",
    duration: 2500,
    logs: [
      "SENTINEL-SCAN [INIT]: Downloading ingress resource mappings...",
      "SYSTEM: Auditing policy templates for multi-tenant isolation...",
      "ALERT: BOLA vulnerability detected on routing tables update request. Tagged CVE-2026-5591."
    ]
  }
];
