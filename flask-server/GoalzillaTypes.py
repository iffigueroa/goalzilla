from enum import Enum
# from test_data import Quest

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
    def __init__(self, name: str, description: str = "", taskType: TaskType=TaskType.JOURNEY, timesToComplete: int = 1):
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
        
        self.update_status()
    
    def add_subtask(self, name:str, description:str = ""):
        subtaskType = TaskType.QUEST if self.taskType == TaskType.JOURNEY else TaskType.TASK
        self.subtasks.append(Task(name, description, taskType=subtaskType))
        self.update_status()
    
    def remove_subtask(self, id): 
        self.subtasks.pop(id)
        self.update_status()

    def update_details(self): 
        pass 

    def get_subtasks_names(self): 
        return [subtask.name for subtask in self.subtasks]

    def get_subtask_preview(self):
        return {'quests': [q.get_task_details_full() for q in self.subtasks]}

    def get_task_details_preview(self):
        return {
            "name": self.name,
            "status": self.status.value
        }

    def get_task_details_full(self) -> dict:
        self.update_status()
        return {
            'name': self.name,
            'description': self.description,
            'subtasksComplete': self.get_competed_subtasks(),
            'totalSubtasks': len(self.subtasks),
            'status': self.status.value,
            'progress': self.get_progress(),
            'subtaskList': self.get_subtasks_names(),
            'tasks': [s.get_task_details_preview() for s in self.subtasks]
        }

    def get_competed_subtasks(self): 
        complete = 0 
        for task in self.subtasks: 
            if task.status == TaskStatus.COMPLETE:
                complete +=1
        return complete

    def get_progress(self):
        all_tasks = sum( len(q.subtasks) for q in self.subtasks)
        completed_tasks = sum( sum(1 for task in quest.subtasks if task.status == TaskStatus.COMPLETE) for quest in self.subtasks)
        return int((completed_tasks/all_tasks)*100) if all_tasks > 0 else 0
    
    def get_subtask_by_id(self, id):
        if id < 0 or id >= len(self.subtasks):
            return None
        return self.subtasks[id]
    
    def update_status(self):
        num_complete = len([t for t in self.subtasks if t.status == TaskStatus.COMPLETE])
        if len(self.subtasks) == 0 and self.taskType != TaskType.TASK:
            self.status = TaskStatus.NOT_STARTED
        elif num_complete >= len(self.subtasks):
            self.status = TaskStatus.COMPLETE
        else: 
            self.status = TaskStatus.IN_PROGRESS 
        return {"success": "task completed."}
    
