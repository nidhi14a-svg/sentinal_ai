class RemediationError(Exception):
    """Base remediation error."""
    pass


class RemediationApprovalError(RemediationError):
    pass


class RemediationExecutionError(RemediationError):
    pass
