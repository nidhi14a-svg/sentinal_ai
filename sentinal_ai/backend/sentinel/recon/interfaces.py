from typing import Any


class ReconInterface:
    """Defines methods for domain reconnaissance."""

    def run(self, domain: str, profile: str, dry_run: bool = False, verification: bool = False) -> dict[str, Any]:
        raise NotImplementedError


class AllowlistValidatorInterface:
    """Defines allowlist validation contract."""

    def is_allowed(self, domain: str) -> bool:
        raise NotImplementedError
