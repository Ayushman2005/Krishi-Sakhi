from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
import logging
import io
import os
import base64
import random
from PIL import Image, ImageEnhance, ImageDraw, ImageFilter

router = APIRouter()
logger = logging.getLogger(__name__)

from ml_models.ai_client import ollama_configured, generate_content_with_fallback

@router.post("/future-decay")
async def future_decay(
    file: UploadFile = File(...),
    deficit_type: str = Form(...)
):

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")

    try:
        contents = await file.read()
        original_image = Image.open(io.BytesIO(contents)).convert('RGB')

        if ollama_configured:
            try:

                prompt = f"""
                You are a visual agronomic simulator. Analyze this leaf image.
                Synthesize what this EXACT leaf will look like when experiencing advanced 

                                                                                          {deficit_type}.
                
                Apply realistic textures:
                - For 'Nitrogen Deficiency': overall chlorosis, fading green to pale yellow/white.
                - For 'Potassium Deficiency': necrotic margins, scorching, leaf edges turning brittle brown.
                - For 'Leaf Blast / Rust': spindle-shaped brownish lesions, fuzzy fungal spots scattered across the surface.
                
                Maintain the overall outline shape and structure of the original leaf.
                Return ONLY a standard base64 encoded PNG string of the mutated leaf image. Do not output markdown, HTML, or any text. Just the pure base64 string.
                

                """

                import asyncio
                response = await asyncio.to_thread(
                    generate_content_with_fallback,
                    contents=[prompt, original_image]
                )

                clean_text = response.text.strip()

                if "base64," in clean_text:
                    clean_text = clean_text.split("base64,")[1]
                clean_text = clean_text.replace("```", "").replace("\n", "").replace(" ", "").strip()

                decoded_bytes = base64.b64decode(clean_text)
                return {
                    "image_b64": f"data:image/png;base64,{clean_text}",
                    "mode": "generative",
                    "deficit": deficit_type,
                    "description": f"Generative simulation of {deficit_type} mapped onto your leaf tissue structure."
                }
            except Exception as e:
                logger.warning(f"Ollama Generative Decay failed, falling back to PIL processor: {e}")

        mutated_img = original_image.copy()
        width, height = mutated_img.size

        if deficit_type == "Nitrogen Deficiency":

            yellow_layer = Image.new("RGB", (width, height), (235, 220, 140))
            mutated_img = Image.blend(mutated_img, yellow_layer, alpha=0.35)

            contrast = ImageEnhance.Contrast(mutated_img)
            mutated_img = contrast.enhance(0.85)
            desc = " Faded green chlorophyll to pale chlorotic yellowing typical of severe Nitrogen deficiency."

        elif deficit_type == "Potassium Deficiency":

            mask = Image.new("L", (width, height), 0)
            draw = ImageDraw.Draw(mask)

            margin = min(width, height) // 10
            draw.ellipse([margin, margin, width - margin, height - margin], fill=255)

            mask = Image.eval(mask, lambda x: 255 - x)
            mask = mask.filter(ImageFilter.GaussianBlur(radius=margin / 2))

            scorch_color = Image.new("RGB", (width, height), (120, 80, 45))
            scorch_blended = Image.blend(mutated_img, scorch_color, alpha=0.8)

            mutated_img = Image.composite(scorch_blended, mutated_img, mask)
            desc = "Brittle margin chlorosis, necrosis, and edge-scorching caused by Potassium transport failure."

        else:

            draw = ImageDraw.Draw(mutated_img)
            num_spots = random.randint(18, 30)
            for _ in range(num_spots):

                x = random.randint(width // 10, int(width * 0.9))
                y = random.randint(height // 10, int(height * 0.9))
                r_w = random.randint(min(width, height) // 30, min(width, height) // 15)
                r_h = random.randint(min(width, height) // 50, min(width, height) // 25)

                draw.ellipse([x - r_w, y - r_h, x + r_w, y + r_h], fill=(95, 60, 35))
                draw.ellipse([x - r_w//2, y - r_h//2, x + r_w//2, y + r_h//2], fill=(175, 155, 130))

            mutated_img = mutated_img.filter(ImageFilter.BoxBlur(1))
            desc = "Necrotic spindle-shaped brown lesions with typical greyish centers indicating active fungal colonization."

        buffered = io.BytesIO()
        mutated_img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return {
            "image_b64": f"data:image/png;base64,{img_str}",
            "mode": "simulation",
            "deficit": deficit_type,
            "description": f"Visual filter simulation: {desc}"
        }

    except Exception as e:
        logger.error(f"Generative Decay endpoint failure: {e}")
        raise HTTPException(status_code=500, detail=f"Visual simulator failed: {str(e)}")
