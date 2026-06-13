import shutil
import subprocess
from typing import Any
from .interfaces import ScannerAdapterInterface
from .exceptions import SslYzeError


class SslYzeAdapter(ScannerAdapterInterface):
    """Adapter for SSLyze integration."""

    def __init__(self, scan_timeout_seconds: int = 120) -> None:
        self.scan_timeout_seconds = scan_timeout_seconds

    def run(self, target: str) -> dict[str, Any]:
        raw: dict[str, Any] = {"source": "ssl"}
        
        # Clean host (remove protocol and paths)
        host = target
        if "://" in host:
            host = host.split("://")[1]
        if "/" in host:
            host = host.split("/")[0]
            
        if not shutil.which("sslyze"):
            # If sslyze is not found, raise SslYzeError or return dummy? The spec says "SSL scan failure: SslYzeError",
            # so raising SslYzeError is correct if it fails/is missing.
            raise SslYzeError("sslyze CLI not available on PATH")

        command = ["sslyze", "--regular", f"{host}:443"]
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=self.scan_timeout_seconds,
                check=False,
            )
            raw.update(
                {
                    "command": " ".join(command),
                    "exit_code": result.returncode,
                    "stdout": result.stdout.strip(),
                    "stderr": result.stderr.strip(),
                }
            )
        except subprocess.TimeoutExpired as exc:
            raise SslYzeError(f"sslyze timed out: {exc}") from exc
        except Exception as exc:
            raise SslYzeError(f"sslyze execution failed: {exc}") from exc
        return raw
