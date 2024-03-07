from typing import List 
from enum import Enum

class JourneyStatus(Enum): 
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'

class Journey():
    def __init__(self, name: str, description: str):
        self.name: str = name
        self.description: str = description
        self.quests: List = []
        self.status: JourneyStatus = JourneyStatus.INACTIVE
        self.progress: int = 0
    
    def set_journey_status(self, active: bool):
        self.status =  JourneyStatus.ACTIVE if active else JourneyStatus.INACTIVE
    
    def update_details(self):
        pass

    def add_quest(self, new_quest):
        self.quests.append(new_quest)

    def get_progress(self): 
        return 0

    def get_journey_details(self):
        return {
            'journeyName': self.name,
            'journeyDetail': self.description,
            'questsComplete': 2, 
            'totalQuests': 10,
            'progress': self.progress,
            'quests': []
        }


class GoalzillaData():
    # Eventually may be good to put this in an external source...
    def __init__(self, include_test_defaults: bool = False): 
        self.goals = [] if not include_test_defaults else self.get_test_defaults()
    
    def get_goals_list(self):
        return [goal.name for goal in self.goals]

    def add_journey(self, journey_name, description):
        self.goals.append(Journey(name=journey_name, description=description))

    def get_journey_details(self, index):
        if index < 0:
            return None
        return self.goals[index].get_journey_details()
    
    def get_test_defaults(self):
        return [
            Journey(name = 'Test1', description = 'Hello1'),
            Journey(name = 'Test2', description = 'Hello2'),
            Journey(name = 'Test3', description = 'Hello3'), 
        ]

    def remove_journey(self, index):
        self.goals.pop(index)
        