import json
from api.logic.user import User

def save_user_data(user, filename: str):
    with open(filename, 'w') as f:
        json.dump(user.__dict__, f)

def load_user_data(filename: str):
    with open(filename, 'r') as f:
        data = json.load(f)
    user = User(name=data['name'])
    user.current_cycle = data['current_cycle']
    return user
