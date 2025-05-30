from api.logic.training import TrainingCycle, generate_training_program

class User:
    def __init__(self, name: str):
        self.name = name
        self.current_cycle = None

    def start_new_cycle(self, duration_weeks: int):
        self.current_cycle = generate_training_program(duration_weeks)
