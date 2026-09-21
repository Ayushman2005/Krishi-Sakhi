import os
import sys
import unittest
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

class TestComprehensiveDataAndNotebook(unittest.TestCase):
    def test_01_dataset_exists_and_valid(self):
        csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "comprehensive_plants_and_crops.csv")
        self.assertTrue(os.path.isfile(csv_path), "Dataset file does not exist")
        df = pd.read_csv(csv_path)
        self.assertEqual(len(df), 4060, f"Expected 4060 rows, got {len(df)}")
        self.assertEqual(df["label"].nunique(), 58, f"Expected 58 distinct crops, got {df['label'].nunique()}")
        self.assertEqual(df["category"].nunique(), 8, f"Expected 8 categories, got {df['category'].nunique()}")
        self.assertEqual(df.isnull().sum().sum(), 0, "Dataset contains unexpected null values")

    def test_02_notebook_exists_and_valid(self):
        nb_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "notebooks", "train_plants_and_crops.ipynb")
        self.assertTrue(os.path.isfile(nb_path), "Jupyter notebook does not exist")
        import json
        with open(nb_path, "r", encoding="utf-8") as f:
            nb_data = json.load(f)
        self.assertIn("cells", nb_data)
        self.assertGreaterEqual(len(nb_data["cells"]), 15)

    def test_03_exported_model_artifacts(self):
        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ml_models", "best_crop_model.joblib")
        self.assertTrue(os.path.isfile(model_path), "Trained best_crop_model.joblib does not exist")
        import joblib
        artifacts = joblib.load(model_path)
        self.assertIn("model", artifacts)
        self.assertIn("scaler", artifacts)
        self.assertIn("label_encoder", artifacts)
        self.assertEqual(len(artifacts["classes"]), 58)
        self.assertGreaterEqual(artifacts["metadata"]["test_accuracy"], 95.0)

    def test_04_api_endpoint_preview(self):
        from fastapi.testclient import TestClient
        from main import app

        client = TestClient(app)
        res = client.get("/data/datasets")
        self.assertEqual(res.status_code, 200)
        datasets = {d["id"]: d for d in res.json()}
        self.assertIn("comprehensive_plants_and_crops", datasets)
        self.assertEqual(datasets["comprehensive_plants_and_crops"]["records"], 4060)

        preview_res = client.get("/data/datasets/comprehensive_plants_and_crops/preview?limit=5")
        self.assertEqual(preview_res.status_code, 200)
        pdata = preview_res.json()
        self.assertEqual(pdata["total_records"], 4060)
        self.assertEqual(len(pdata["target_classes"]), 58)
        self.assertEqual(len(pdata["preview"]), 5)

if __name__ == "__main__":
    unittest.main()
