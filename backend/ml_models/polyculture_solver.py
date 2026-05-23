from fastapi import APIRouter
from schemas import PolycultureRequest
import random

router = APIRouter()

# Synergistic Companion Planting Data Matrix
COMPANION_PAIRS = {
    # Crop: {Companion: Benefit_Description}
    "Maize": {
        "Soybeans": "Fixes nitrogen, feeding the Nitrogen-hungry Maize.",
        "Beans": "Climbs Maize stalks for support while fixing nitrogen.",
        "Squash": "Covers soil ground, conserving moisture and repelling weeds.",
        "Marigold": "Repels beetles and other canopy pests."
    },
    "Soybeans": {
        "Maize": "Mutualistic support, thrives under partial Maize shade.",
        "Paddy": "Excellent bund companion, fixes Nitrogen in wet soils.",
        "Sunflower": "Attracts beneficial pollinators to Soybean blossoms."
    },
    "Beans": {
        "Maize": "Climbs stalks, eliminates need for physical stakes.",
        "Potato": "Protects Potato roots from insect pests.",
        "Carrots": "Loosens heavy soil, encouraging deep root systems."
    },
    "Squash": {
        "Maize": "Large leaves act as natural ground cover (mulch).",
        "Marigold": "Repels nematode bugs and beetles."
    },
    "Tomato": {
        "Marigold": "Strong root exudates repel root-knot nematodes.",
        "Basil": "Enhances tomato growth vigor and deters thrips.",
        "Carrots": "Loosens soil, allowing deep root growth for tomato."
    },
    "Marigold": {
        "Tomato": "Acts as biological insect barrier.",
        "Squash": "Protects heavy squash foliage.",
        "Potato": "Suppresses soil fungal pathogens."
    },
    "Paddy": {
        "Legumes": "Adds vital organic Nitrogen into saturated fields.",
        "Azolla": "Floating fern containing cyanobacteria that fixes Nitrogen.",
        "Sesbania": "Ideal green manure before planting new seedlings."
    },
    "Potato": {
        "Beans": "Suppresses Colorado beetle infestations.",
        "Marigold": "Suppresses soil nematodes.",
        "Coriander": "Strong scent masks Potato crop from root flies."
    }
}

@router.post("/polyculture-solve")
async def solve_polyculture(request: PolycultureRequest):
    """
    Computes an optimal spatial 3x3 companion planting grid and a 3-year rotation plan.
    Uses rule-based crop matrix synergy equations.
    """
    # 1. Populate active crops list (fill defaults if empty or too few)
    active_crops = [c for c in request.selected_crops if c]
    defaults = ["Maize", "Beans", "Squash", "Marigold", "Soybeans", "Potato", "Tomato"]
    
    while len(active_crops) < 5:
        pick = random.choice(defaults)
        if pick not in active_crops:
            active_crops.append(pick)

    # 2. Place crops into 3x3 spatial grid to maximize adjacent companion synergies
    # For a perfect 3x3, we have 9 cells. Let's arrange them strategically.
    # Put key companions in the center and corners to maximize neighbor cells.
    grid_layout = []
    shuffled_crops = list(active_crops)
    # Ensure center cell [1,1] holds a highly synergistic central crop (like Maize or Tomato)
    center_crop = "Maize"
    for c in ["Maize", "Tomato", "Paddy"]:
        if c in shuffled_crops:
            center_crop = c
            shuffled_crops.remove(c)
            break
            
    # Assemble cells: 3x3 layout
    cells = []
    # Fill centers & corners
    layout = [
        "corner", "edge", "corner",
        "edge", "center", "edge",
        "corner", "edge", "corner"
    ]
    
    # Pre-populate center
    grid = [[None for _ in range(3)] for _ in range(3)]
    grid[1][1] = center_crop
    
    # Distribute other crops deterministically to create beautiful layout
    assigned = []
    for r in range(3):
        for c in range(3):
            if r == 1 and c == 1:
                continue
            # Pick a crop from shuffled_crops or defaults to make a rich visual variety
            if shuffled_crops:
                pick = shuffled_crops.pop(0)
            else:
                # Add a companion to center_crop if possible
                comps = list(COMPANION_PAIRS.get(center_crop, {}).keys())
                available_comps = [cmp for cmp in comps if cmp not in assigned and cmp != center_crop]
                if available_comps:
                    pick = available_comps[0]
                else:
                    # Pick general default companion
                    pick = random.choice(defaults)
                    while pick == center_crop or pick in assigned:
                        pick = random.choice(defaults)
            grid[r][c] = pick
            assigned.append(pick)

    # 3. Calculate companion synergies (Synergy Score)
    # Check all adjacent pairs (cardinal neighbors)
    synergy_score = 55.0  # Base score
    pairs_evaluated = 0
    synergy_benefits = []
    
    for r in range(3):
        for c in range(3):
            crop = grid[r][c]
            # Check neighbors: Right and Down to avoid duplicate counting
            for dr, dc in [(0, 1), (1, 0)]:
                nr, nc = r + dr, c + dc
                if nr < 3 and nc < 3:
                    neighbor = grid[nr][nc]
                    pairs_evaluated += 1
                    # Check compatibility
                    is_sym1 = neighbor in COMPANION_PAIRS.get(crop, {})
                    is_sym2 = crop in COMPANION_PAIRS.get(neighbor, {})
                    if is_sym1 or is_sym2:
                        synergy_score += 7.5
                        benefit = COMPANION_PAIRS.get(crop, {}).get(neighbor) or COMPANION_PAIRS.get(neighbor, {}).get(crop)
                        synergy_benefits.append(f"🌱 {crop} + {neighbor}: {benefit}")

    # Clip score
    synergy_score = min(100.0, max(40.0, synergy_score))

    # Construct final grid coordinates output
    output_grid = []
    for r in range(3):
        row_cells = []
        for c in range(3):
            crop = grid[r][c]
            # Assess neighbor compatibility to flag cell highlights
            has_excellent = False
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < 3 and 0 <= nc < 3:
                    n_crop = grid[nr][nc]
                    if n_crop in COMPANION_PAIRS.get(crop, {}) or crop in COMPANION_PAIRS.get(n_crop, {}):
                        has_excellent = True
                        break
            
            row_cells.append({
                "row": r,
                "col": c,
                "crop": crop,
                "status": "excellent" if has_excellent else "neutral",
                "notes": f"Synergizes well with neighbors" if has_excellent else "Standard placement"
            })
        output_grid.append(row_cells)

    # 4. Compute 3-Year Crop Rotation Schedule
    # Standard sustainable agricultural sequence:
    # Year 1 (High Feeder - e.g., Grains/Leafy) -> Year 2 (Legumes/Nitrogen-Fixers) -> Year 3 (Light Feeder/Tuber roots)
    rotation_plan = [
        {
            "year": 1,
            "season": "Main Kharif / Monsoon",
            "crop_group": "Heavy Feeder (Cereals)",
            "example_crops": [grid[1][1], "Wheat", "Cabbage"],
            "rationale": "High-vigor cereal crops consume deep soil Nitrogen reserves during optimum growing periods."
        },
        {
            "year": 2,
            "season": "Kharif / Rabi Rotation",
            "crop_group": "Nitrogen Fixers (Legumes)",
            "example_crops": ["Soybeans", "Chickpeas", "Green Gram"],
            "rationale": "Nodule-dwelling rhizobia bacteria naturally replenish and lock organic nitrogen back into depleted soil layers."
        },
        {
            "year": 3,
            "season": "Rabi / Winter Taproot",
            "crop_group": "Light Feeder (Root Crops / Tubers)",
            "example_crops": ["Potato", "Carrots", "Radish"],
            "rationale": "Deep roots aerate heavy compact soil layers and access low subsoil potassium, while consuming minimal nitrogen."
        }
    ]

    return {
        "acreage": request.acreage,
        "soil_type": request.soil_type,
        "target_season": request.target_season,
        "synergy_score": round(synergy_score, 1),
        "grid_layout": output_grid,
        "rotation_plan": rotation_plan,
        "benefits": synergy_benefits[:4],
        "tactical_tips": [
            "Always sow Nitrogen-fixing legumes (Beans) on the windy side of your cereals (Maize).",
            "Introduce flowering Marigolds at spacing boundaries to form a natural insect repellant perimeter.",
            "Avoid tilling between years 2 and 3 to preserve organic subterranean fungal root pathways."
        ]
    }
