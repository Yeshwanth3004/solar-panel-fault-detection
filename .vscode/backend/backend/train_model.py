import zipfile, os
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models

DATA_ZIP = "data/fault_solar.zip"
EXTRACT_DIR = "data/images"
MODEL_PATH = "model/solar_fault_model.pt"
NUM_CLASSES = 2

# 1. Unzip
os.makedirs(EXTRACT_DIR, exist_ok=True)
with zipfile.ZipFile(DATA_ZIP, 'r') as zf:
    zf.extractall(EXTRACT_DIR)

# 2. Data loaders
transform = transforms.Compose([transforms.Resize((224,224)), transforms.ToTensor()])
dataset = datasets.ImageFolder(EXTRACT_DIR, transform=transform)
train_size = int(0.8 * len(dataset)); val_size = len(dataset) - train_size
train_ds, val_ds = torch.utils.data.random_split(dataset, [train_size, val_size])
train_loader = torch.utils.data.DataLoader(train_ds, batch_size=16, shuffle=True)
val_loader   = torch.utils.data.DataLoader(val_ds,   batch_size=16)

# 3. Model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18(pretrained=True)
model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)
model.to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-4)

# 4. Train
epochs = 5
for epoch in range(epochs:=5):
    model.train()
    total=0
    for imgs,labels in train_loader:
        imgs,labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        loss = criterion(model(imgs), labels)
        loss.backward(); optimizer.step()
        total += loss.item()
    print(f"Epoch {epoch+1}/{epochs} - Loss: {total/len(train_loader):.4f}")

# 5. Save
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
torch.save(model.state_dict(), MODEL_PATH)
print(f"Saved model to {MODEL_PATH}")
