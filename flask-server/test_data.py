from typing import List 
from enum import Enum

class TaskStatus(Enum): 
    NOT_STARTED = 'Not Started'
    IN_PROGRESS = 'In Progress'
    COMPLETE = 'Complete'

class Task():
    def __init__(self, name): 
        self.name = name
        self.completions = 0
        self.times_to_complete = 1
        self.status = TaskStatus.NOT_STARTED

    def get_task_details(self):
        return {
            "name": self.name,
            "status": str(self.status)
        }

    def complete(self):
        self.completions = self.completions + 1
        if self.status == TaskStatus.COMPLETE:
            return
        if self.completions >= self.times_to_complete: 
            self.status = TaskStatus.COMPLETE
        else: 
            self.status = TaskStatus.IN_PROGRESS

class QuestStatus(Enum): 
    NOT_STARTED = 'Not Started'
    IN_PROGRESS = 'In Progress'
    COMPLETE = 'Complete'

class Quest():
    def __init__(self, name: str, description: str):
        self.name: str = name
        self.description: str = description
        self.status: QuestStatus = QuestStatus.NOT_STARTED
        self.tasks: List[Task]= [
            # Task("test"),
            # Task("test2"),
            # Task("test3"),
            # Task("test4"),
        ]

    def get_task_details(self, taskIdx):
        if taskIdx < 0 or taskIdx >= len(self.tasks):
            return {'error': "Index out of range"}
        return self.tasks[taskIdx].get_task_details()
    
    def get_preview(self):
        return {
            'name': self.name,
            'description': self.description,
            'status': str(self.status.value),
            'tasks': [
                {
                    'name':t.name, 
                    'status': str(t.status.value)
                }
                for t in self.tasks
            ]
        }
    
    def complete_task(self, taskIdx):
        print(self.tasks)
        if taskIdx < 0 or taskIdx >= len(self.tasks):
            print(f"{taskIdx} {len(self.tasks)}\n\n")
            return {'error': "Index out of range"}
        self.tasks[taskIdx].complete()
        self.update_status()
    
    def update_status(self):
        # Check if Quests are complete: 
        num_complete = len([t for t in self.tasks if t.status == TaskStatus.COMPLETE])
        print(f"{num_complete} {len(self.tasks)}")
        if num_complete >= len(self.tasks):
            self.status = QuestStatus.COMPLETE
        else: 
            self.status = QuestStatus.IN_PROGRESS 
        print(f"Quest Status == {self.status}\n\n")
        return {"success": "task completed."}
class JourneyStatus(Enum): 
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'

class Journey():
    def __init__(self, name: str, description: str):
        self.name: str = name
        self.description: str = description
        self.quests: List[Quest]= [
            Quest("This is a test quest name that's kinda long", "hello"),
        ] 
        self.status: JourneyStatus = JourneyStatus.INACTIVE
        self.progress: int = 0
    
    def update_details(self):
        pass

    def add_quest(self, name, description):
        self.quests.append(Quest(name, description))
    
    def remove_quest(self, questIdx):
        self.quests.pop(questIdx)

    def get_progress(self):
        # count num complete tasks
        all_tasks = sum( len(q.tasks) for q in self.quests)
        completed_tasks = sum( sum(1 for task in quest.tasks if task.status == TaskStatus.COMPLETE) for quest in self.quests)
        return int((completed_tasks/all_tasks)*100) if all_tasks > 0 else 0

    def get_journey_details(self):
        return {
            'journeyName': self.name,
            'journeyDetail': self.description,
            'questsComplete': self.get_competed_quests(),
            'totalQuests': len(self.quests),
            'progress': self.get_progress(),
            'questList': [q.name for q in self.quests]
        }
    
    def get_competed_quests(self): 
        complete = 0 
        for q in self.quests: 
            if q.status == QuestStatus.COMPLETE:
                complete +=1
        return complete
    
    def get_quests_preview(self):
        return {'quests': [q.get_preview() for q in self.quests]}
    
    def get_quest_details(self, questIdx):
        if questIdx < 0 or questIdx >= len(self.quests):
            return {'error': "Index out of range"}
        return self.quests[questIdx].get_preview()

    def get_task_from_quest(self, questIdx, taskIdx):
        if questIdx < 0 or questIdx >= len(self.quests):
            return {'error': "Index out of range"}
        return self.quests[questIdx].get_task_details(taskIdx)

class GoalzillaData():
    # Eventually may be good to put this in an external source...
    def __init__(self, include_test_defaults: bool = False): 
        self.goals = [] if not include_test_defaults else self.get_test_defaults()
    
    def get_goals_list(self):
        return [goal.name for goal in self.goals]

    def add_journey(self, name, description):
        self.goals.append(Journey(name=name, description=description))

    def get_journey_details(self, journeyIdx):
        if journeyIdx < 0 or journeyIdx >= len(self.goals):
            return None
        return self.goals[journeyIdx].get_journey_details()
    
    def get_test_defaults(self):
        # return []
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

    def get_quest_details(self, journeyIdx: int, questIdx: int):
        return self.goals[journeyIdx].get_quest_details(questIdx)
    
    def get_task_details(self, journeyIdx, questIdx, taskIdx):
         return self.goals[journeyIdx].get_task_from_quest(questIdx, taskIdx)
    
    def remove_task(self, journeyIdx, questIdx, taskIdx): 
        journey = self.goals[journeyIdx]
        quest: Quest = journey.quests[questIdx]
        quest.tasks.pop(taskIdx)
        quest.update_status()

    def add_task(self, journeyIdx, questIdx, taskName):
        journey = self.goals[journeyIdx]
        quest: Quest = journey.quests[questIdx]
        quest.tasks.append(Task(taskName))
        quest.update_status()

    def complete_task(self, journeyIdx, questIdx, taskIdx):
        journey = self.goals[journeyIdx]
        quest: Quest = journey.quests[questIdx]
        print("in complete task main")
        quest.complete_task(taskIdx)