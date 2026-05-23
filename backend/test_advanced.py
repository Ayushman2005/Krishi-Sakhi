import requests
import io
import os
from PIL import Image

def test_future_decay():
    print("[TEST] Testing Future Decay Predictor endpoint...")
    url = "http://localhost:8000/ml/future-decay"
    
    # Create a dummy image
    img = Image.new("RGB", (200, 200), (45, 138, 70))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    files = {"file": ("test_leaf.png", img_byte_arr, "image/png")}
    data = {"deficit_type": "Nitrogen Deficiency"}
    
    try:
        response = requests.post(url, files=files, data=data)
        if response.status_code == 200:
            res_json = response.json()
            print("OK - Future Decay Success!")
            print(f"   Mode: {res_json.get('mode')}")
            print(f"   Deficit: {res_json.get('deficit')}")
            print(f"   Image Base64 length: {len(res_json.get('image_b64', ''))}")
        else:
            print(f"ERR - Future Decay Failed: Status {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"ERR - Future Decay Connection Error: {e}")

def test_acoustic_analyze():
    print("\n[TEST] Testing Bio-Acoustic Monitor endpoint...")
    url = "http://localhost:8000/ml/acoustic-analyze"
    
    # Create mock WAV file bytes
    wav_bytes = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x40\x1f\x00\x00\x80\x3e\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
    files = {"file": ("locust_swarm.wav", io.BytesIO(wav_bytes), "audio/wav")}
    
    try:
        response = requests.post(url, files=files)
        if response.status_code == 200:
            res_json = response.json()
            print("OK - Bio-Acoustic Success!")
            print(f"   Peak Frequency: {res_json.get('peak_frequency_hz')} Hz")
            print(f"   Biomarker: {res_json.get('primary_biomarker')}")
            print(f"   Alerts Count: {len(res_json.get('alerts', []))}")
        else:
            print(f"ERR - Bio-Acoustic Failed: Status {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"ERR - Bio-Acoustic Connection Error: {e}")

def test_polyculture_solve():
    print("\n[TEST] Testing Spatial Polyculture Solver endpoint...")
    url = "http://localhost:8000/ml/polyculture-solve"
    
    payload = {
        "acreage": 2.5,
        "soil_type": "Clay Loam",
        "target_season": "Kharif / Monsoon",
        "selected_crops": ["Maize", "Beans", "Soybeans"]
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            res_json = response.json()
            print("OK - Polyculture Solver Success!")
            print(f"   Synergy Score: {res_json.get('synergy_score')}")
            print(f"   Layout cells: {len(res_json.get('grid_layout', []))} rows")
            print(f"   Benefits count: {len(res_json.get('benefits', []))}")
        else:
            print(f"ERR - Polyculture Solver Failed: Status {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"ERR - Polyculture Solver Connection Error: {e}")

def test_carbon_estimate():
    print("\n[TEST] Testing Soil Carbon Credit Ledger endpoint...")
    url = "http://localhost:8000/ml/carbon-estimate"
    
    payload = {
        "acreage": 12.0,
        "crop": "Paddy",
        "tillage": "no-till",
        "cover_cropping": True,
        "organic_input_tons": 4.5
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            res_json = response.json()
            print("OK - Soil Carbon Credit Ledger Success!")
            print(f"   Annual capture: {res_json.get('annual_co2_sequestered_tons')} tons CO2e")
            print(f"   USD Valuation: ${res_json.get('annual_valuation_usd')}")
            print(f"   Certificate ID: {res_json.get('certificate', {}).get('certificate_id')}")
        else:
            print(f"ERR - Soil Carbon Credit Ledger Failed: Status {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"ERR - Soil Carbon Credit Ledger Connection Error: {e}")

if __name__ == "__main__":
    test_future_decay()
    test_acoustic_analyze()
    test_polyculture_solve()
    test_carbon_estimate()
