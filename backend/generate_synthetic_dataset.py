import os
import random
from PIL import Image, ImageDraw, ImageFilter

CLASSES = ["Healthy", "Leaf Blast", "Brown Plant Hopper", "Neck Rot", "Sheath Blight", "Tungro Virus"]
DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset", "Rice-Disease-Dataset", "raw", "color")
IMAGES_PER_CLASS = 150  # 150 per class (total 900 images) is extremely fast to train on CPU but enough for a deep model to learn perfectly
IMG_SIZE = 224

def create_base_leaf(draw, color_base=(34, 139, 34)):
    """Draw a base green leaf with some veins to make it look realistic."""
    # Gradient background
    r_base, g_base, b_base = color_base
    for y in range(IMG_SIZE):
        factor = 1.0 - (y / IMG_SIZE) * 0.2
        r = int(r_base * factor)
        g = int(g_base * factor)
        b = int(b_base * factor)
        draw.line([(0, y), (IMG_SIZE, y)], fill=(r, g, b))
        
    # Draw main central vein
    draw.line([(IMG_SIZE // 2, 0), (IMG_SIZE // 2, IMG_SIZE)], fill=(46, 110, 46), width=3)
    
    # Draw side veins
    for y in range(20, IMG_SIZE, 30):
        # Left vein
        draw.line([(IMG_SIZE // 2, y), (IMG_SIZE // 2 - 60, y + 20)], fill=(46, 110, 46), width=1)
        # Right vein
        draw.line([(IMG_SIZE // 2, y), (IMG_SIZE // 2 + 60, y + 20)], fill=(46, 110, 46), width=1)

def generate_healthy(draw):
    """Healthy leaves are clean and vibrant green."""
    # No extra marks, just pure leaf base. We can add minor noise.
    pass

def generate_leaf_blast(draw):
    """Leaf Blast has brown spindle-shaped/diamond-shaped lesions with gray centers."""
    num_spots = random.randint(3, 7)
    for _ in range(num_spots):
        cx = random.randint(40, IMG_SIZE - 40)
        cy = random.randint(40, IMG_SIZE - 40)
        w = random.randint(15, 30)
        h = random.randint(8, 15)
        
        # Spindle shape: outer brown ring, inner gray center
        # We can simulate this with two overlapping ellipses
        draw.ellipse([cx - w, cy - h, cx + w, cy + h], fill=(139, 69, 19))  # Outer brown
        draw.ellipse([cx - w + 4, cy - h + 2, cx + w - 4, cy + h - 2], fill=(211, 211, 211))  # Inner gray/white

def generate_brown_plant_hopper(draw):
    """Brown Plant Hopper: Green leaves with tiny brown and yellow insect dots."""
    num_bugs = random.randint(15, 30)
    for _ in range(num_bugs):
        cx = random.randint(20, IMG_SIZE - 20)
        cy = random.randint(20, IMG_SIZE - 20)
        size = random.randint(3, 6)
        color = random.choice([(101, 67, 33), (139, 90, 43), (205, 133, 63)])  # Brown shades
        draw.ellipse([cx - size, cy - size, cx + size, cy + size], fill=color)
        
        # Add small yellow hopperburn spots around bugs
        if random.random() > 0.3:
            draw.ellipse([cx + size + 2, cy - 2, cx + size + 5, cy + 1], fill=(218, 165, 32))

def generate_neck_rot(draw):
    """Neck Rot: Dark rot/decay at the stem base (bottom)."""
    # A massive dark brown/black decaying area at the bottom of the leaf
    rot_height = random.randint(60, 100)
    # Draw an irregular polygon at the bottom
    coords = [(0, IMG_SIZE)]
    for x in range(0, IMG_SIZE + 20, 20):
        y = IMG_SIZE - rot_height + random.randint(-15, 15)
        coords.append((x, y))
    coords.append((IMG_SIZE, IMG_SIZE))
    
    # Fill with dark charcoal / black-brown
    draw.polygon(coords, fill=(47, 35, 23))
    
    # Add a soft transition using a lighter brown boundary
    for i in range(len(coords) - 2):
        pt1 = coords[i+1]
        draw.ellipse([pt1[0] - 8, pt1[1] - 8, pt1[0] + 8, pt1[1] + 8], fill=(101, 80, 60))

def generate_sheath_blight(draw):
    """Sheath Blight: Grayish-green lesions with distinct purple/brown margins."""
    num_lesions = random.randint(2, 4)
    for _ in range(num_lesions):
        cx = random.randint(50, IMG_SIZE - 50)
        cy = random.randint(50, IMG_SIZE - 50)
        rx = random.randint(25, 45)
        ry = random.randint(15, 30)
        
        # Outer purple/brown border
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(75, 0, 130))
        # Inner grayish-green lesion
        draw.ellipse([cx - rx + 4, cy - ry + 4, cx + rx - 4, cy + ry - 4], fill=(143, 188, 143))
        # Innermost pale whitish center
        draw.ellipse([cx - rx // 2, cy - ry // 2, cx + rx // 2, cy + ry // 2], fill=(240, 248, 255))

def generate_tungro_virus(draw):
    """Tungro Virus: Strong yellowing and orange-yellow discoloration of the leaf."""
    # Healthy base is replaced or overwritten by yellow-orange gradient
    pass

def main():
    print(f"Creating synthetic Rice Leaf Disease dataset...")
    print(f"Target directory: {DATASET_DIR}")
    
    os.makedirs(DATASET_DIR, exist_ok=True)
    
    for cls in CLASSES:
        cls_dir = os.path.join(DATASET_DIR, cls)
        os.makedirs(cls_dir, exist_ok=True)
        
        # Clean existing files in class folder
        for f in os.listdir(cls_dir):
            os.remove(os.path.join(cls_dir, f))
            
        print(f"Generating {IMAGES_PER_CLASS} images for class: {cls}...")
        for i in range(IMAGES_PER_CLASS):
            # Base leaf color customization
            if cls == "Tungro Virus":
                # Tungro leaves turn yellow-orange
                base_color = (255, random.randint(140, 180), 0)
            elif cls == "Healthy":
                # Healthy is rich vibrant green
                base_color = (34, random.randint(130, 150), 34)
            else:
                # Other classes have slightly standard green leaves
                base_color = (46, random.randint(110, 130), 46)
                
            img = Image.new("RGB", (IMG_SIZE, IMG_SIZE))
            draw = ImageDraw.Draw(img)
            
            # 1. Draw base leaf
            create_base_leaf(draw, color_base=base_color)
            
            # 2. Draw class-specific disease characteristics
            if cls == "Healthy":
                generate_healthy(draw)
            elif cls == "Leaf Blast":
                generate_leaf_blast(draw)
            elif cls == "Brown Plant Hopper":
                generate_brown_plant_hopper(draw)
            elif cls == "Neck Rot":
                generate_neck_rot(draw)
            elif cls == "Sheath Blight":
                generate_sheath_blight(draw)
            elif cls == "Tungro Virus":
                generate_tungro_virus(draw)
                
            # 3. Add global slight noise / blur to simulate real photo camera capture
            img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
            
            # 4. Save
            img_path = os.path.join(cls_dir, f"rice_{cls.lower().replace(' ', '_')}_{i:03d}.jpg")
            img.save(img_path, "JPEG", quality=95)
            
    print("\n[SUCCESS] Rice Disease Dataset generated successfully!")
    print(f"Total classes: {len(CLASSES)}")
    print(f"Total images : {len(CLASSES) * IMAGES_PER_CLASS}")

if __name__ == "__main__":
    main()
