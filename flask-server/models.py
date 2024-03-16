from enum import Enum


class TaskStatus(Enum):
    NOT_STARTED = 'Not Started'
    IN_PROGRESS = 'In Progress'
    COMPLETE = 'Complete'

class TaskType(Enum, str): 
    JOURNEY = "Journey"
    QUEST = "Quest"
    TASK = "Task"


class TaskUnits(Enum, int):
    COUNT = 0
    TIME = 1

class Task():
    def __init__(self, name: str, description: str, task_type: TaskType, times_to_complete: int = 1, completion_units: TaskUnits = TaskUnits.COUNT):
        self.name = name
        self.description = description
        self.status = TaskStatus.NOT_STARTED
        self.times_to_complete = times_to_complete
        self.subtasks = []
        self.progress = 0
        self.times_completed = 0
        
    def complete(self): 
        self.completions = self.completions + 1
        if self.status == TaskStatus.COMPLETE:
            return
        if self.completions >= self.times_to_complete: 
            self.status = TaskStatus.COMPLETE
        else: 
            self.status = TaskStatus.IN_PROGRESS
    
    def add_subtask(self): 
        pass
    
    def remove_subtask(self): 
        pass 

    def update_details(self): 
        pass 

    def get_subtasks(self): 
        # return list of subtasks
        pass 

    def get_task_details(self) -> dict:
        pass

