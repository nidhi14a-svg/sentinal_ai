class ReconError(Exception):
    """Base exception for reconnaissance failures."""
    pass


class InvalidDomainError(ReconError):
    pass


class TargetNotAllowedError(ReconError):
    pass


class ReconServiceError(ReconError):
    pass


class DomainReconError(ReconError):
    """Base exception for domain reconnaissance subsystem."""
    pass


class DnsLookupError(DomainReconError):
    def __init__(self, message: str, retryable: bool = True):
        super().__init__(message)
        self.retryable = retryable


class WhoisLookupError(DomainReconError):
    pass


class SslInspectionError(DomainReconError):
    pass


class DomainReconUnexpectedError(DomainReconError):
    pass
