class PolicyEngine:
    """
    Centralized Configuration for Security Policies.
    """
    def __init__(self):
        self.password_min_length = 8
        self.password_require_special = True
        self.max_login_attempts = 5
        self.lockout_minutes = 15
        
    def validate_password_policy(self, password: str) -> bool:
        if len(password) < self.password_min_length:
            return False
        if self.password_require_special and not any(not c.isalnum() for c in password):
            return False
        return True

policy_engine = PolicyEngine()
