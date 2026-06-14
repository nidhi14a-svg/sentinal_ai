export const vulnerabilitiesData = [
  {
    id: "vuln-01",
    name: "CVE-2026-1184: Kernel Buffer Overflow in Socket Handling",
    severity: "CRITICAL",
    score: 9.8,
    component: "Core API Gateway",
    status: "vulnerable",
    description: "An unsafe memory copy operation in the kernel packet socket handling code allows a remote, unauthenticated attacker to execute arbitrary code or trigger a system crash via a crafted TCP payload.",
    aiRemediation: "Enforce strict boundary validation on incoming socket stream headers and replace raw memory copies with checked bounds copy functions.",
    codeSnippetBefore: `void handle_packet(char *raw_data, int len) {
    char buffer[1024];
    // VULNERABLE: No length check before copying
    memcpy(buffer, raw_data, len);
    process_buffer(buffer);
}`,
    codeSnippetAfter: `void handle_packet(char *raw_data, int len) {
    char buffer[1024];
    // PATCHED: Bound verification applied
    if (len > 1024 || len < 0) {
        log_security_alert("Buffer overflow attempt blocked", len);
        return;
    }
    memcpy(buffer, raw_data, len);
    process_buffer(buffer);
}`
  },
  {
    id: "vuln-02",
    name: "CVE-2026-3042: SQL Injection in User Directory Listing",
    severity: "HIGH",
    score: 8.7,
    component: "Database Proxy",
    status: "vulnerable",
    description: "Improper sanitization of the 'search_query' request parameter allows authenticated users to bypass query constraints and dump database schema tables, including user password hashes.",
    aiRemediation: "Migrate standard concatenated query requests to parameterized prepared statements using bound database placeholders.",
    codeSnippetBefore: `const getAccountDetails = async (userId) => {
    // VULNERABLE: Direct concatenation
    const query = "SELECT * FROM accounts WHERE id = '" + userId + "'";
    return await db.raw(query);
}`,
    codeSnippetAfter: `const getAccountDetails = async (userId) => {
    // PATCHED: Using parameterized query
    const query = "SELECT * FROM accounts WHERE id = ?";
    return await db.execute(query, [userId]);
}`
  },
  {
    id: "vuln-03",
    name: "CVE-2026-4491: SSRF via Image Metadata Extraction Service",
    severity: "HIGH",
    score: 8.2,
    component: "Auth Microservice",
    status: "vulnerable",
    description: "The authentication avatar upload service fetches remote images without resolving internal network addresses, allowing attackers to access internal API server metrics (SSRF).",
    aiRemediation: "Implement an IP address blocklist resolver that intercepts outgoing requests and throws exceptions if resolving to private RFC 1918 addresses.",
    codeSnippetBefore: `async function fetchAvatar(url) {
    // VULNERABLE: Fetches absolute URLs directly
    const response = await fetch(url);
    return response.blob();
}`,
    codeSnippetAfter: `async function fetchAvatar(url) {
    const parsedUrl = new URL(url);
    // PATCHED: Intercept private network ranges
    if (isPrivateIP(parsedUrl.hostname)) {
        throw new Error("Access to internal network addresses is restricted.");
    }
    const response = await fetch(url);
    return response.blob();
}`
  },
  {
    id: "vuln-04",
    name: "CVE-2026-5591: Broken Object Level Authorization (BOLA)",
    severity: "MEDIUM",
    score: 6.5,
    component: "Kubernetes Ingress",
    status: "vulnerable",
    description: "Tenant isolation verification is omitted when modifying routing configurations. Multi-tenant endpoints can modify sibling router configurations by supplying adjacent UUIDs.",
    aiRemediation: "Insert an isolation checks middleware verifying that the logged-in tenant claims match the ownership ID of the resource being updated.",
    codeSnippetBefore: `router.put('/config/:configId', async (req, res) => {
    // VULNERABLE: Direct access without ownership check
    const updated = await Config.update(req.params.configId, req.body);
    res.json(updated);
});`,
    codeSnippetAfter: `router.put('/config/:configId', async (req, res) => {
    // PATCHED: Check configuration ownership
    const config = await Config.findById(req.params.configId);
    if (config.ownerId !== req.user.tenantId) {
        return res.status(403).send("Unauthorized resource modification.");
    }
    const updated = await Config.update(req.params.configId, req.body);
    res.json(updated);
});`
  },
  {
    id: "vuln-05",
    name: "CVE-2026-9021: Cross-Site Scripting via Dynamic Admin Logging",
    severity: "LOW",
    score: 3.4,
    component: "Auth Microservice",
    status: "vulnerable",
    description: "Failing to escape query parameters rendered in the security supervisor log allows an attacker with elevated access to inject script tags into the audit panel.",
    aiRemediation: "Apply a DOM sanitizer wrapper before appending server error traces to administrative logs.",
    codeSnippetBefore: `function appendErrorLog(logElement, trace) {
    // VULNERABLE: Direct assignment to innerHTML
    logElement.innerHTML = \`<div class="error">\${trace}</div>\`;
}`,
    codeSnippetAfter: `function appendErrorLog(logElement, trace) {
    // PATCHED: Escape HTML characters
    const safeTrace = escapeHTML(trace);
    logElement.innerHTML = \`<div class="error">\${safeTrace}</div>\`;
}`
  }
];
