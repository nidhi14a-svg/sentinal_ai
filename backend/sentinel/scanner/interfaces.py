from typing import Any


class ScannerInterface:
    """Defines scanner subsystem contract."""

    def execute(
        self,
        domain: str,
        profile: str,
        metadata: dict[str, Any],
        dry_run: bool = False,
        verification: bool = False,
    ) -> dict[str, Any]:
        raise NotImplementedError


class ScannerAdapterInterface:
    """Defines a scanner adapter contract."""

    def run(self, target: str) -> dict[str, Any]:
        raise NotImplementedError
