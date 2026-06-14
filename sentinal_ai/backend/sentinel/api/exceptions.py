class ApiValidationError(Exception):
    """Raised when request validation fails."""
    pass


class TaskNotFoundError(Exception):
    """Raised when the requested scan task is not found."""
    pass


class OrchestrationError(Exception):
    """Raised when the orchestration workflow fails."""
    pass
