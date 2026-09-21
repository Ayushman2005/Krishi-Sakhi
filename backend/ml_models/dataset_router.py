import os
import pandas as pd
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

DATASET_METADATA = {
    "crop_recommendation": {
        "filename": "crop_recommendation.csv",
        "description": "Precision agriculture dataset matching soil macronutrients (N, P, K), pH, and climate variables to 22 crops.",
        "target_col": "label"
    },
    "fertilizer_recommendation": {
        "filename": "fertilizer_recommendation.csv",
        "description": "Prescription dataset mapping soil type, crop type, and nutrient deficits to specific commercial fertilizers.",
        "target_col": "Fertilizer Name"
    },
    "crop_yield_data": {
        "filename": "crop_yield_data.csv",
        "description": "Historical agro-climatic yield benchmark dataset for multi-state Indian crop production.",
        "target_col": "Yield_Quintals_Per_Acre"
    },
    "comprehensive_plants_and_crops": {
        "filename": "comprehensive_plants_and_crops.csv",
        "description": "Exhaustive multi-category dataset covering 58 plants & crops across Cereals, Pulses, Fruits, Vegetables, Cash Crops, Plantation, Oilseeds, and Spices.",
        "target_col": "label"
    }
}

@router.get("/datasets")
async def list_datasets() -> List[Dict[str, Any]]:
    """List all available precision agriculture datasets in the backend with metadata."""
    results = []
    
    if not os.path.exists(DATA_DIR):
        return []

    for name, meta in DATASET_METADATA.items():
        file_path = os.path.join(DATA_DIR, meta["filename"])
        if os.path.isfile(file_path):
            try:
                df = pd.read_csv(file_path)
                file_size_kb = round(os.path.getsize(file_path) / 1024, 2)
                results.append({
                    "id": name,
                    "filename": meta["filename"],
                    "description": meta["description"],
                    "target_column": meta["target_col"],
                    "records": len(df),
                    "columns": list(df.columns),
                    "size_kb": file_size_kb
                })
            except Exception as e:
                results.append({
                    "id": name,
                    "filename": meta["filename"],
                    "error": str(e)
                })

    return results

@router.get("/datasets/{dataset_id}/preview")
async def preview_dataset(dataset_id: str, limit: int = 10) -> Dict[str, Any]:
    """Retrieve preview rows and descriptive statistics for a specific dataset."""
    if dataset_id not in DATASET_METADATA:
        raise HTTPException(
            status_code=404,
            detail=f"Dataset '{dataset_id}' not found. Available: {list(DATASET_METADATA.keys())}"
        )

    meta = DATASET_METADATA[dataset_id]
    file_path = os.path.join(DATA_DIR, meta["filename"])

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=f"Dataset file '{meta['filename']}' not found on disk.")

    try:
        df = pd.read_csv(file_path)
        numeric_df = df.select_dtypes(include=["number"])
        
        stats = {}
        for col in numeric_df.columns:
            stats[col] = {
                "mean": round(float(numeric_df[col].mean()), 2),
                "min": round(float(numeric_df[col].min()), 2),
                "max": round(float(numeric_df[col].max()), 2),
                "std": round(float(numeric_df[col].std()), 2)
            }

        target_col = meta["target_col"]
        unique_targets = []
        if target_col in df.columns:
            unique_targets = df[target_col].dropna().unique().tolist()

        preview_records = df.head(limit).to_dict(orient="records")

        return {
            "id": dataset_id,
            "filename": meta["filename"],
            "description": meta["description"],
            "total_records": len(df),
            "columns": list(df.columns),
            "target_column": target_col,
            "target_classes": unique_targets,
            "statistics": stats,
            "preview": preview_records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read dataset: {str(e)}")
