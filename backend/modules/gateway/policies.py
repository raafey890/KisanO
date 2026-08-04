class PolicyEngine:
    def __init__(self):
        self.maintenance_mode = False
        self.max_payload_size_bytes = 10 * 1024 * 1024 # 10 MB

    def is_maintenance_mode(self) -> bool:
        return self.maintenance_mode

policy_engine = PolicyEngine()
