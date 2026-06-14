export const remediationStepsData = {
  "vuln-01": [
    { text: "Scanning buffer sizes in Gateway kernel header hooks...", delay: 600 },
    { text: "Analyzing stack allocation vectors for overflow vulnerability...", delay: 800 },
    { text: "Inserting security boundaries and validating payload length (len > 1024 checks)...", delay: 900 },
    { text: "Re-compiling Gateway router module in isolated staging docker shell...", delay: 1000 },
    { text: "Executing gateway unit tests: Packet Length Audit (SUCCESS)...", delay: 700 },
    { text: "Hot-patching live API Gateway loadbalancer nodes... (100% DEPLOYED)", delay: 800 }
  ],
  "vuln-02": [
    { text: "Auditing database entry files for dynamic query composition...", delay: 500 },
    { text: "Replacing SQL query concatenations with parameterized SQL bindings...", delay: 800 },
    { text: "Running SQL Injection regression test suite (14 test cases: SUCCESS)...", delay: 600 },
    { text: "Pushing patched query driver to database proxy cluster...", delay: 700 }
  ],
  "vuln-03": [
    { text: "Extracting SSRF vectors from avatar image endpoint...", delay: 600 },
    { text: "Injecting DNS proxy validation wrapper: filtering out private ranges...", delay: 900 },
    { text: "Running intranet address bypass tests (SSRF Blocked: SUCCESS)...", delay: 700 },
    { text: "Deploying secure avatar microservice version 1.4.9 patch 2...", delay: 600 }
  ],
  "vuln-04": [
    { text: "Auditing Kubernetes Ingress routing request authorization rules...", delay: 500 },
    { text: "Inserting authorization check interceptor matching tenant token to object ID...", delay: 900 },
    { text: "Simulating cross-tenant editing requests (BOLA Check: Access Denied, SUCCESS)...", delay: 800 },
    { text: "Applying dynamic configurations to Ingress controllers...", delay: 600 }
  ],
  "vuln-05": [
    { text: "Inspecting logs DOM render elements...", delay: 400 },
    { text: "Applying custom sanitization filter to replace innerHTML with text escaping...", delay: 600 },
    { text: "Verifying client browser output security profiles (SUCCESS)...", delay: 500 },
    { text: "Releasing dashboard minor update patch...", delay: 400 }
  ]
};
