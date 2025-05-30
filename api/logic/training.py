from typing import List

class Day:
    def __init__(self, exercises: List[str]):
        self.exercises = exercises

class Week:
    def __init__(self, days: List[Day]):
        self.days = days

class TrainingCycle:
    def __init__(self, weeks: List[Week]):
        self.weeks = weeks

def generate_training_program(duration_weeks: int) -> TrainingCycle:
    # Пример генерации программы тренировок
    weeks = []
    for _ in range(duration_weeks):
        days = [Day(exercises=["Exercise A", "Exercise B"]) for _ in range(5)]
        weeks.append(Week(days=days))
    return TrainingCycle(weeks=weeks)

def calculate_progression(start_weight: float, weeks: int) -> List[float]:
    # Пример расчёта прогрессии веса
    return [start_weight + i * 2.5 for i in range(weeks)]