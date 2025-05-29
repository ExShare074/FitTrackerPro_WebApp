from fastapi import APIRouter
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
