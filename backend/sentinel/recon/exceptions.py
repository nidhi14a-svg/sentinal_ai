class ReconError(Exception):
    """Base exception for reconnaissance failures."""
    pass


class InvalidDomainError(ReconError):
    pass


class TargetNotAllowedError(ReconError):
    pass


class ReconServiceError(ReconError):
    pass
