from typing import Any


def parse_dns_records(raw_dns: Any) -> dict[str, list[str]]:
    """Convert raw DNS lookup results into a normalized mapping."""
    if not isinstance(raw_dns, dict):
        return {}
    parsed: dict[str, list[str]] = {}
    for key, val in raw_dns.items():
        if isinstance(val, list):
            parsed[key] = [str(item).strip() for item in val]
        else:
            parsed[key] = []
    return parsed


def build_recon_summary(data: dict[str, Any]) -> str:
    """Build a high-level reconnaissance summary string."""
    domain = data.get("targetDomain") or data.get("target_domain") or "Target domain"
    dns = data.get("dnsRecords") or data.get("dns_records") or {}
    ssl = data.get("sslCertificate") or data.get("ssl_certificate") or {}
    
    parts = [f"Reconnaissance completed for {domain}."]
    if dns:
        a_records = dns.get("A", [])
        if a_records:
            parts.append(f"DNS A records: {', '.join(a_records)}.")
            
    if ssl and "error" not in ssl and ssl.get("issuer"):
        issuer = ssl.get("issuer")
        if isinstance(issuer, tuple) or isinstance(issuer, list):
            # Parse tuple of tuples format from getpeercert()
            issuer_parts = []
            try:
                for rdn in issuer:
                    for attr in rdn:
                        if (isinstance(attr, tuple) or isinstance(attr, list)) and len(attr) == 2:
                            issuer_parts.append(f"{attr[0]}={attr[1]}")
            except Exception:
                pass
            issuer_str = ", ".join(issuer_parts) if issuer_parts else str(issuer)
        else:
            issuer_str = str(issuer)
        parts.append(f"Valid SSL certificate found, issued by {issuer_str}.")
    elif ssl and "error" in ssl:
        parts.append("SSL configuration weaknesses or errors were detected.")
    
    return " ".join(parts)
