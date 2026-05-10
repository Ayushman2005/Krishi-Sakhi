import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
import os

# Configuration
DATA_DIR = "./dataset/plantvillage" # You need to download the PlantVillage dataset here
MODEL_SAVE_PATH = "./plant_disease_model.pth"
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 0.001
NUM_CLASSES = 6 # Example: Healthy, Leaf Blast, Brown Plant Hopper, Neck Rot, Sheath Blight, Tungro Virus

def get_data_loaders():
    # Data Augmentation & Normalization
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    if not os.path.exists(DATA_DIR):
        print(f"Dataset directory '{DATA_DIR}' not found. Please download the PlantVillage dataset.")
        return None, None, None

    image_datasets = {x: datasets.ImageFolder(os.path.join(DATA_DIR, x), data_transforms[x])
                      for x in ['train', 'val']}
    
    dataloaders = {x: DataLoader(image_datasets[x], batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
                   for x in ['train', 'val']}
    
    class_names = image_datasets['train'].classes
    return dataloaders, class_names

def build_model(num_classes):
    # Using a pre-trained MobileNetV2 (lightweight, perfect for production)
    model = models.mobilenet_v2(pretrained=True)
    
    # Freeze early layers
    for param in model.parameters():
        param.requires_grad = False
        
    # Replace the final classifier layer
    model.classifier[1] = nn.Linear(model.last_channel, num_classes)
    return model

def train_model():
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")

    dataloaders, class_names = get_data_loaders()
    if not dataloaders:
        return

    model = build_model(len(class_names))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE)

    for epoch in range(EPOCHS):
        print(f'Epoch {epoch+1}/{EPOCHS}')
        print('-' * 10)

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloaders[phase].dataset)
            epoch_acc = running_corrects.double() / len(dataloaders[phase].dataset)

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

    # Save the model weights
    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    print(f"Training complete. Model saved to {MODEL_SAVE_PATH}")
    
    # Save the class names mapping
    with open("class_names.txt", "w") as f:
        f.write("\n".join(class_names))

if __name__ == '__main__':
    train_model()
