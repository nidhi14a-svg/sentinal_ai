import requests
from typing import Any
from .interfaces import ScannerAdapterInterface
from .exceptions import ZapApiError


class ZAPAdapter(ScannerAdapterInterface):
    """Adapter for OWASP ZAP API integration."""

    def __init__(self, zap_api_url: str = "http://localhost:8080", scan_timeout_seconds: int = 120) -> None:
        self.zap_api_url = zap_api_url
        self.scan_timeout_seconds = scan_timeout_seconds

    def run(self, target: str) -> dict[str, Any]:
        raw: dict[str, Any] = {"source": "zap", "alerts": []}
        try:
            # Note: target might contain schema, if not we default to http
            url = target if (target.startswith("http://") or target.startswith("https://")) else f"http://{target}"
            scan_url = f"{self.zap_api_url}/JSON/ascan/action/scan/?url={url}&recurse=true"
            
            response = requests.get(scan_url, timeout=20)
            response.raise_for_status()
            
            resp_data = response.json()
            scan_id = resp_data.get("scan")
            if scan_id is None:
                raise ZapApiError("ZAP did not return a scan ID", retryable=True)
                
            raw["scan_id"] = scan_id
            status_url = f"{self.zap_api_url}/JSON/ascan/view/status/?scanId={scan_id}"
            elapsed = 0
            
            while elapsed < self.scan_timeout_seconds:
                status_resp = requests.get(status_url, timeout=20)
                status_resp.raise_for_status()
                status = int(status_resp.json().get("status", 0))
                if status >= 100:
                    break
                import time
                time.sleep(1)
                elapsed += 1
                
            alerts_url = f"{self.zap_api_url}/JSON/core/view/alerts/?baseurl={url}"
            alerts_resp = requests.get(alerts_url, timeout=20)
            alerts_resp.raise_for_status()
            raw["alerts"] = alerts_resp.json().get("alerts", [])
        except requests.RequestException as exc:
            raise ZapApiError(f"ZAP API request failed: {exc}", retryable=True) from exc
        except Exception as exc:
            if isinstance(exc, ZapApiError):
                raise exc
            raise ZapApiError(f"ZAP scan failed: {exc}", retryable=False) from exc
            
        return raw
