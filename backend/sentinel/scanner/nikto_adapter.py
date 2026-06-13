import shutil
import subprocess
from typing import Any
from .interfaces import ScannerAdapterInterface
from .exceptions import NiktoExecutionError


class NiktoAdapter(ScannerAdapterInterface):
    """Adapter for Nikto CLI integration."""

    def __init__(self, nikto_path: str = "/usr/bin/nikto", scan_timeout_seconds: int = 120) -> None:
        self.nikto_path = nikto_path
        self.scan_timeout_seconds = scan_timeout_seconds

    def run(self, target: str) -> dict[str, Any]:
        raw: dict[str, Any] = {"source": "nikto"}
        if not shutil.which(self.nikto_path):
            raise NiktoExecutionError(f"Nikto binary not found at '{self.nikto_path}'")

        url = target if (target.startswith("http://") or target.startswith("https://")) else f"http://{target}"
        command = [self.nikto_path, "-host", url]
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
            raise NiktoExecutionError(f"Nikto timed out: {exc}") from exc
        except Exception as exc:
            raise NiktoExecutionError(f"Nikto execution failed: {exc}") from exc
        return raw
