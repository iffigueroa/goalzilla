from typing import List 
from enum import Enum

class Task():
    pass

class QuestStatus(Enum): 
    NOT_STARTED = 'Not Started'
    IN_PROGRESS = 'In Progress'
    COMPLETE = 'Complete'

class Quest():
    def __init__(self, name: str, description: str):
        self.name: str = name
        self.description: str = description
        self.status: QuestStatus = QuestStatus.NOT_STARTED
        self.tasks: List[Task]= []

    def get_preview(self):
        return {
            'name': self.name,
            'description': self.description,
            'status': str(self.status.value),
            'tasks': ["step one", "step two", "step three"]
        }
    

class JourneyStatus(Enum): 
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'

class Journey():
    def __init__(self, name: str, description: str):
        self.name: str = name
        self.description: str = description
        self.quests: List[Quest]= [
            Quest("This is a test quest name that's kinda long", "hello"),
            # Quest("test2", "hello"),
            # Quest("test3", "hello"),
        ] 
        self.status: JourneyStatus = JourneyStatus.INACTIVE
        self.progress: int = 50
    
    def set_journey_status(self, active: bool):
        self.status =  JourneyStatus.ACTIVE if active else JourneyStatus.INACTIVE
    
    def update_details(self):
        pass

    def add_quest(self, name, description):
        self.quests.append(Quest(name, description))
    
    def remove_quest(self, questIdx):
        self.quests.pop(questIdx)

    def get_progress(self): 
        return 0

    def get_journey_details(self):
        return {
            'journeyName': self.name,
            'journeyDetail': self.description,
            'questsComplete': 2, 
            'totalQuests': 10,
            'progress': self.progress,
            'questList': [q.name for q in self.quests]
        }
    def get_quests_preview(self):
        return {'quests': [q.get_preview() for q in self.quests]}
    
    def get_quest_details(self, questIdx): 
        return self.quests[questIdx].get_preview()


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

    
    def get_quest_preview(self, journeyIdx):
        return self.goals[journeyIdx].get_quests_preview()
        
    def add_quest(self, journeyIdx, name, description):
        self.goals[journeyIdx].add_quest(name, description)

    def remove_quest(self, journeyIdx, questIdx):
        self.goals[journeyIdx].remove_quest(questIdx)

    def get_quest_details(self, journeyIdx, questIdx):
        return self.goals[journeyIdx].get_quest_details(questIdx)