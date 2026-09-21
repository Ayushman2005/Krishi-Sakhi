import os
import sys
import unittest
import pandas as pd
import numpy as np

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

class TestBackendDatasets(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
        cls.crop_csv = os.path.join(cls.data_dir, "crop_recommendation.csv")
        cls.fert_csv = os.path.join(cls.data_dir, "fertilizer_recommendation.csv")
        cls.yield_csv = os.path.join(cls.data_dir, "crop_yield_data.csv")

    def test_01_dataset_files_exist(self):
        """Verify all three dataset files exist and are non-empty."""
        self.assertTrue(os.path.isfile(self.crop_csv), "crop_recommendation.csv does not exist")
        self.assertTrue(os.path.isfile(self.fert_csv), "fertilizer_recommendation.csv does not exist")
        self.assertTrue(os.path.isfile(self.yield_csv), "crop_yield_data.csv does not exist")

    def test_02_crop_recommendation_schema(self):
        """Verify crop recommendation dataset columns, row count, and classes."""
        df = pd.read_csv(self.crop_csv)
        self.assertEqual(len(df), 2200, f"Expected 2200 rows, got {len(df)}")
        expected_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"]
        self.assertEqual(list(df.columns), expected_cols)
        unique_labels = df["label"].unique()
        self.assertEqual(len(unique_labels), 22, f"Expected 22 unique crop labels, got {len(unique_labels)}")
        self.assertIn("Rice", unique_labels)
        self.assertIn("Maize", unique_labels)
        self.assertIn("Coffee", unique_labels)

    def test_03_fertilizer_recommendation_schema(self):
        """Verify fertilizer recommendation dataset columns and rows."""
        df = pd.read_csv(self.fert_csv)
        self.assertGreaterEqual(len(df), 500)
        expected_cols = ["Temparature", "Humidity", "Moisture", "Soil Type", "Crop Type", "Nitrogen", "Potassium", "Phosphorous", "Fertilizer Name"]
        self.assertEqual(list(df.columns), expected_cols)
        unique_ferts = df["Fertilizer Name"].unique()
        self.assertIn("Urea", unique_ferts)
        self.assertIn("DAP", unique_ferts)

    def test_04_crop_yield_schema(self):
        """Verify crop yield dataset columns and rows."""
        df = pd.read_csv(self.yield_csv)
        self.assertGreaterEqual(len(df), 400)
        expected_cols = ["Crop", "Season", "State", "Area_Acres", "Rainfall_mm", "Temperature_C", "Soil_pH", "Nitrogen_kg_ha", "Phosphorus_kg_ha", "Potassium_kg_ha", "Yield_Quintals_Per_Acre"]
        self.assertEqual(list(df.columns), expected_cols)

    def test_05_crop_model_prediction(self):
        """Verify trained RandomForestClassifier on crop recommendation."""
        from ml_models.recommendation_model import crop_clf
        # Paddy test: high rain (250mm), high humidity (82%), moderate temp (24°C), N=80, P=48, K=40, pH=6.5
        paddy_sample = np.array([[80, 48, 40, 24.0, 82.0, 6.5, 250.0]])
        pred = crop_clf.predict(paddy_sample)[0]
        self.assertEqual(pred, "Rice", f"Expected 'Rice', got {pred}")

    def test_06_fertilizer_model_prediction(self):
        """Verify trained RandomForestClassifier on fertilizer recommendation."""
        from ml_models.recommendation_model import fert_clf
        # Low nitrogen test: Temp=28, Humidity=60, Moisture=40, N=8, P=30, K=30 -> Urea
        sample = np.array([[28.0, 60.0, 40.0, 8.0, 30.0, 30.0]])
        pred = fert_clf.predict(sample)[0]
        self.assertEqual(pred, "Urea", f"Expected 'Urea', got {pred}")

    def test_07_yield_model_prediction(self):
        """Verify trained GradientBoostingRegressor on crop yield."""
        from ml_models.yield_model import yield_models
        self.assertIn("Paddy", yield_models)
        # Optimal paddy conditions: 1400mm rain, 26C, ph 6.5, N=90, P=45, K=45
        sample = np.array([[1400.0, 26.0, 6.5, 90.0, 45.0, 45.0]])
        yield_val = yield_models["Paddy"].predict(sample)[0]
        self.assertGreater(yield_val, 10.0)
        self.assertLess(yield_val, 35.0)

    def test_08_fastapi_dataset_endpoints(self):
        """Verify FastAPI /data/datasets endpoints using TestClient."""
        from fastapi.testclient import TestClient
        from main import app

        client = TestClient(app)
        res = client.get("/data/datasets")
        self.assertEqual(res.status_code, 200)
        datasets = res.json()
        self.assertGreaterEqual(len(datasets), 3)

        preview_res = client.get("/data/datasets/crop_recommendation/preview")
        self.assertEqual(preview_res.status_code, 200)
        preview_data = preview_res.json()
        self.assertEqual(preview_data["total_records"], 2200)
        self.assertEqual(len(preview_data["preview"]), 10)
        self.assertIn("N", preview_data["statistics"])

if __name__ == "__main__":
    unittest.main()
