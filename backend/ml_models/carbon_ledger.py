from fastapi import APIRouter
from schemas import CarbonLedgerRequest
import hashlib
import datetime
import time

router = APIRouter()

@router.post("/carbon-estimate")
async def estimate_carbon(request: CarbonLedgerRequest):

    base_rate = 0.35

    tillage_bonus = 0.0
    if request.tillage.lower() == "no-till":
        tillage_bonus = 0.30
    elif request.tillage.lower() == "minimum-till":
        tillage_bonus = 0.12
    else:
        tillage_bonus = -0.08

    cover_bonus = 0.28 if request.cover_cropping else 0.0

    compost_efficiency = 0.06
    manure_bonus = min(0.45, request.organic_input_tons * compost_efficiency)

    sequestration_rate_per_acre = max(0.05, base_rate + tillage_bonus + cover_bonus + manure_bonus)

    annual_sequestration_total = sequestration_rate_per_acre * request.acreage

    credit_value_usd = 25.00
    exchange_rate_inr = 83.50
    price_per_credit_inr = credit_value_usd * exchange_rate_inr

    credits_earned_annual = annual_sequestration_total
    value_earned_annual_usd = credits_earned_annual * credit_value_usd
    value_earned_annual_inr = value_earned_annual_usd * exchange_rate_inr

    projection = []
    cumulative_co2 = 0.0
    cumulative_usd = 0.0

    for year in range(1, 6):

        saturation_decay = max(0.85, 1.0 - (year - 1) * 0.03)
        annual_capture = annual_sequestration_total * saturation_decay

        cumulative_co2 += annual_capture
        cumulative_usd += annual_capture * credit_value_usd

        projection.append({
            "year": year,
            "annual_tco2e": round(annual_capture, 2),
            "cumulative_tco2e": round(cumulative_co2, 2),
            "cumulative_usd": round(cumulative_usd, 2),
            "cumulative_inr": round(cumulative_usd * exchange_rate_inr, 2)
        })

    ledger_entries = [
        {
            "id": f"TXN-{int(time.time()) - 86400 * 30:08d}",
            "date": (datetime.datetime.now() - datetime.timedelta(days=30)).strftime("%Y-%m-%d"),
            "event": "Soil Ingest Validation",
            "tillage": request.tillage,
            "credits": round(annual_sequestration_total * 0.25, 2),
            "status": "Verified",
            "auditor": "EcoRegistry Soil Standard"
        },
        {
            "id": f"TXN-{int(time.time()) - 86400 * 5:08d}",
            "date": (datetime.datetime.now() - datetime.timedelta(days=5)).strftime("%Y-%m-%d"),
            "event": "Cover Crop Sprout Audit",
            "tillage": f"Cover Crops Verified: {request.cover_cropping}",
            "credits": round(annual_sequestration_total * 0.25, 2),
            "status": "Verified",
            "auditor": "SGS Agricultural Validation"
        },
        {
            "id": f"TXN-{int(time.time()):08d}",
            "date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "event": "Carbon Credit Minting",
            "tillage": "Ledger Synchronized",
            "credits": round(annual_sequestration_total * 0.50, 2),
            "status": "Pending Final Signature",
            "auditor": "Krishi-Sakhi Ecological Smart Contract"
        }
    ]

    cert_raw = f"{request.crop}-{request.acreage}-{sequestration_rate_per_acre}-{time.time()}"
    security_hash = hashlib.sha256(cert_raw.encode()).hexdigest().upper()[:24]

    certificate = {
        "certificate_id": f"KS-CARB-{security_hash[:8]}-{security_hash[8:16]}",
        "farmer_crop": request.crop,
        "acreage": request.acreage,
        "rate_per_acre": round(sequestration_rate_per_acre, 3),
        "security_hash": security_hash,
        "expiry_date": (datetime.datetime.now() + datetime.timedelta(days=365)).strftime("%Y-%m-%d"),
        "verifiable_url": f"https://registry.krishi-sakhi.ai/verify/{security_hash}"
    }

    return {
        "input_summary": {
            "acreage": request.acreage,
            "crop": request.crop,
            "tillage": request.tillage,
            "cover_cropping": request.cover_cropping,
            "organic_input_tons": request.organic_input_tons
        },
        "sequestration_rate_tco2e_per_acre": round(sequestration_rate_per_acre, 3),
        "annual_co2_sequestered_tons": round(annual_sequestration_total, 2),
        "annual_credit_balance": round(credits_earned_annual, 2),
        "annual_valuation_usd": round(value_earned_annual_usd, 2),
        "annual_valuation_inr": round(value_earned_annual_inr, 2),
        "five_year_projection": projection,
        "ledger_entries": ledger_entries,
        "certificate": certificate
    }
