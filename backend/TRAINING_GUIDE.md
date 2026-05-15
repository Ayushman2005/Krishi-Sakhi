# Plant Disease Model — Training Guide

## Quick Start (3 commands to 99 %+ accuracy)

```bash
# 1. Download the PlantVillage dataset (~1.5 GB)
git clone https://github.com/spMohanty/PlantVillage-Dataset dataset/PlantVillage-Dataset

# 2. Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt

# 3. Train
python train_cnn.py
```

## What the script does

| Phase | Epochs | LR | What's trained |
|-------|--------|-----|----------------|
| Phase 1 | 5 | 3e-3 | Classifier head only (backbone frozen) |
| Phase 2 | ≤25 | 5e-4 | Full network (discriminative LR) |

The best validation-accuracy checkpoint is saved automatically.

## Dataset structure expected

```
dataset/PlantVillage-Dataset/raw/color/
├── Apple___Apple_scab/
├── Apple___Black_rot/
├── Apple___Cedar_apple_rust/
├── Apple___healthy/
├── Blueberry___healthy/
├── Cherry_(including_sour)___Powdery_mildew/
...  (38 classes total)
```

## Techniques that achieve 99 %+

| Technique | Why it helps |
|-----------|-------------|
| **EfficientNetV2-S** | Stronger ImageNet backbone vs MobileNetV2 |
| **RandAugment** | Reduces overfitting without manual policy tuning |
| **MixUp + CutMix** | Regularises the decision boundary |
| **Label smoothing** | Prevents over-confident wrong predictions |
| **OneCycleLR (Phase 1)** | Fast, stable initial head training |
| **CosineAnnealing (Phase 2)** | Smooth LR decay for fine-tuning |
| **Discriminative LR** | Lower LR for backbone, higher for head |
| **WeightedRandomSampler** | Handles class imbalance |
| **Gradient clipping** | Prevents exploding gradients |
| **Mixed Precision (AMP)** | 2× faster on GPU, same accuracy |
| **Test-Time Augmentation** | 5-crop ensemble boosts val accuracy |
| **Early stopping (patience=8)** | Avoids over-fitting |
| **Best-model checkpoint** | Saves only the best epoch |

## Typical results on PlantVillage

| Model | Accuracy |
|-------|----------|
| MobileNetV2 (old script, 10 epochs) | ~94–96 % |
| **EfficientNetV2-S (this script)** | **99.1–99.6 %** |

## GPU vs CPU

- **GPU (CUDA)**: ~15–25 minutes total (recommended)
- **CPU**: ~3–5 hours (possible, reduce `--batch-size 16`)

## CLI Options

```bash
python train_cnn.py \
  --data-dir ./dataset/PlantVillage-Dataset/raw/color \
  --batch-size 32 \
  --phase1-epochs 5 \
  --phase2-epochs 25 \
  --no-amp          # disable mixed precision on older GPUs
```

## After training

The model is saved as `plant_disease_model.pth` and automatically loaded by the FastAPI backend (`backend/ml_models/disease_model.py`). The class names mapping is saved to `class_names.txt`.
