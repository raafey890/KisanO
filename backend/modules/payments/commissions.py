from typing import Dict, Any, Tuple
from modules.payments.constants import PaymentType

class CommissionEngine:
    def __init__(self):
        # In a real enterprise system, this would be loaded from a configuration DB
        # or environment variables. We mock it in code for the MVP.
        self.rules = {
            PaymentType.EQUIPMENT_RENTAL: {"platform_fee_percent": 10.0, "gateway_fee_percent": 2.0},
            PaymentType.MARKETPLACE_ORDER: {"platform_fee_percent": 5.0, "gateway_fee_percent": 2.0},
            PaymentType.SPRAYER_SERVICE: {"platform_fee_percent": 8.0, "gateway_fee_percent": 2.0},
            PaymentType.SUBSCRIPTION: {"platform_fee_percent": 0.0, "gateway_fee_percent": 2.0},
            PaymentType.WALLET_TOPUP: {"platform_fee_percent": 0.0, "gateway_fee_percent": 2.0},
            PaymentType.DONATION: {"platform_fee_percent": 0.0, "gateway_fee_percent": 2.0},
        }

    def calculate_pricing(self, payment_type: PaymentType, gross_amount: float) -> Tuple[float, float, float, float]:
        """
        Returns (platform_commission, gateway_charges, taxes, net_amount)
        """
        rule = self.rules.get(payment_type, {"platform_fee_percent": 0.0, "gateway_fee_percent": 2.0})
        
        platform_commission = (gross_amount * rule["platform_fee_percent"]) / 100.0
        gateway_charges = (gross_amount * rule["gateway_fee_percent"]) / 100.0
        
        # Taxes placeholder (e.g. 18% GST on the platform commission, not the gross amount)
        taxes = (platform_commission * 0.18)
        
        net_amount = gross_amount - platform_commission - gateway_charges - taxes
        
        return round(platform_commission, 2), round(gateway_charges, 2), round(taxes, 2), round(net_amount, 2)

commission_engine = CommissionEngine()
