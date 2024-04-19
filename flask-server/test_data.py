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