class RemediationError(Exception):
    """Base remediation error."""
    pass


class RemediationApprovalError(RemediationError):
    pass


class RemediationExecutionError(RemediationError):
    pass


class UnsupportedRemediationError(RemediationError):
    pass


class RemediationTargetNotAllowedError(RemediationError):
    pass
