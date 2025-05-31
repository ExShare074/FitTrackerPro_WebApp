from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import requests
from app.logic.training import generate_training_program, calculate_progression

router = APIRouter()

@router.get("/api/training_program")
def get_training_program(weeks: int = 8):
    program = generate_training_program(weeks)
    return {"weeks": len(program.weeks)}

@router.get("/api/progression")
def get_progression(start_weight: float = 50.0, weeks: int = 8):
    progression = calculate_progression(start_weight, weeks)
    return {"progression": progression}

@router.get("/api/ping")
def ping():
    return {"message": "pong"}

@router.get("/api/nutrition")
def get_nutrition(query: str = Query(...), weight: float = Query(...)):
    api_key = "4xZfpm02uxFnG202Hp9LwQ==EcMoZkKZilJs3yd5"
    url = f"https://api.calorieninjas.com/v1/nutrition?query={query}"
    headers = {"X-Api-Key": api_key}

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return JSONResponse(status_code=500, content={"error": "API запрос не удался"})

    data = response.json()
    if not data["items"]:
        return {"message": "Продукт не найден"}

    item = data["items"][0]
    factor = weight / 100
    return {
        "product": item["name"],
        "kcal": round(item["calories"] * factor, 2),
        "protein": round(item["protein_g"] * factor, 2),
        "fat": round(item["fat_total_g"] * factor, 2),
        "carbs": round(item["carbohydrates_total_g"] * factor, 2),
    }