class ScannerError(Exception):
    """Base scanner exception."""
    pass


class AdapterExecutionError(ScannerError):
    pass


class ScannerConfigurationError(ScannerError):
    pass
