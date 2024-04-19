from enum import Enum
from test_data import Quest

class ActivityStatus(Enum):
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'

class TaskStatus(Enum):
    NOT_STARTED = 'Not Started'
    IN_PROGRESS = 'In Progress'
    COMPLETE = 'Complete'

class TaskType(Enum): 
    JOURNEY = "Journey"
    QUEST = "Quest"
    TASK = "Task"


class Task():
    def __init__(self, name: str, description: str, taskType: TaskType=TaskType.JOURNEY, timesToComplete: int = 1):
        self.name = name
        self.description = description
        self.taskType = taskType
        self.status:TaskStatus = TaskStatus.NOT_STARTED
        self.activityStatus:ActivityStatus =  ActivityStatus.INACTIVE
        self.timesToComplete = timesToComplete
        self.timesCompleted = 0
        self.subtasks = []
        self.progress = 0
        
        
    def complete(self): 
        self.timesCompleted += 1
        if self.status == TaskStatus.COMPLETE:
            return
        if self.timesCompleted >= self.timesToComplete: 
            self.status = TaskStatus.COMPLETE
        else: 
            self.status = TaskStatus.IN_PROGRESS
    
    def add_subtask(self, name, description):
        self.subtasks.append(Quest(name, description))
    
    def remove_subtask(self, questIdx): 
        self.subtasks.pop(questIdx)

    def update_details(self): 
        pass 

    def get_subtasks_names(self): 
        # return list of subtasks by name
        return [subtask.name for subtask in self.subtasks]

    def get_subtask_preview(self):
        return {'quests': [q.get_preview() for q in self.subtasks]}

    def get_task_details(self) -> dict:
        return {
            'journeyName': self.name,
            'journeyDetail': self.description,
            'questsComplete': self.get_competed_subtasks(),
            'totalQuests': len(self.subtasks),
            'progress': self.get_progress(),
            'questList': self.get_subtasks_names(),
        }

    def get_competed_subtasks(self): 
        complete = 0 
        for task in self.subtasks: 
            if task.status == TaskStatus.COMPLETE:
                complete +=1
        return complete

    def get_progress(self):
        # count num complete tasks
        all_tasks = sum( len(q.tasks) for q in self.subtasks)
        completed_tasks = sum( sum(1 for task in quest.tasks if task.status == TaskStatus.COMPLETE) for quest in self.subtasks)
        return int((completed_tasks/all_tasks)*100) if all_tasks > 0 else 0
    
    def get_subtask_by_id(self, id):
        if id < 0 or id >= len(self.subtasks):
            return None
        return self.subtasks[id]
    
