class ScannerError(Exception):
    """Base scanner exception."""
    pass


class AdapterExecutionError(ScannerError):
    pass


class ScannerConfigurationError(ScannerError):
    pass


class ScannerTargetNotAllowedError(ScannerError):
    pass


class ZapApiError(ScannerError):
    def __init__(self, message: str, retryable: bool = True):
        super().__init__(message)
        self.retryable = retryable


class NiktoExecutionError(ScannerError):
    pass


class SslYzeError(ScannerError):
    pass


class VulnerabilityScannerUnexpectedError(ScannerError):
    pass
