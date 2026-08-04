from typing import Dict, Any

class BookingPricing:
    @staticmethod
    def generate_snapshot(
        base_rate: float,
        rate_type: str,
        units: float,
        travel_charges: float = 0.0,
        emergency_charges: float = 0.0,
        fuel_charges: float = 0.0,
        discount_amount: float = 0.0,
        tax_rate: float = 0.18
    ) -> Dict[str, Any]:
        """
        Standardized pricing math generation.
        """
        base_amount = base_rate * units
        subtotal = base_amount + travel_charges + emergency_charges + fuel_charges - discount_amount
        
        # Ensure subtotal doesn't go below zero due to discounts
        subtotal = max(0.0, subtotal)
        
        tax_amount = subtotal * tax_rate
        final_amount = subtotal + tax_amount
        
        return {
            "baseRate": base_rate,
            "rateType": rate_type,
            "units": units,
            "baseAmount": base_amount,
            "travelCharges": travel_charges,
            "emergencyCharges": emergency_charges,
            "fuelCharges": fuel_charges,
            "discountAmount": discount_amount,
            "taxAmount": tax_amount,
            "finalAmount": final_amount
        }
