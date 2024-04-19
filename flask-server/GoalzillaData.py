# from test_data import Task
from GoalzillaTypes import Task 

class GoalzillaData():
    # Stores main application data & routes major tasks
    # Eventually may be good to put this in an external source...

    def __init__(self, include_test_defaults: bool = False): 
        self.goals = [] if not include_test_defaults else self.get_test_defaults()
        self.userId = 0 # TODO: Update once login working
    
    def get_goals_list(self):
        return [goal.name for goal in self.goals]

    def add_journey(self, name, description):
        self.goals.append(Task(name=name, description=description))

    def get_journey_details(self, journeyIdx):
        if journeyIdx < 0 or journeyIdx >= len(self.goals):
            return None
        return self.goals[journeyIdx].get_task_details_full()
    
    def get_test_defaults(self):
        # return []
        return [
            Task(name = 'Test1', description = 'Hello1'),
            Task(name = 'Test2', description = 'Hello2'),
            Task(name = 'Test3', description = 'Hello3'), 
        ]
    
    def get_task(self, journeyIdx:str = None, questIdx:str = None, taskIdx:str = None):
        ids = [journeyIdx, questIdx, taskIdx]
        task = None
        for id in ids:
            if id == None:
                return task
            elif (task == None and journeyIdx < len(self.goals)):
                # initial case - we have to identify journey
                task = self.goals[journeyIdx]
            else:
                subtask = task.get_subtask_by_id(id)
                if subtask:
                    task = subtask
        return task

            
    def remove_journey(self, index):
        self.goals.pop(index)

    def get_quest_preview(self, journeyIdx):
        return self.goals[journeyIdx].get_subtask_preview()
        
    def add_quest(self, journeyIdx, name, description):
        self.goals[journeyIdx].add_subtask(name, description)

    def remove_quest(self, journeyIdx, questIdx):
        self.goals[journeyIdx].remove_subtask(questIdx)

    def get_quest_details(self, journeyIdx, questIdx):
        quest = self.get_task(journeyIdx=journeyIdx, questIdx=questIdx)
        return quest.get_task_details_full()
    
    def get_task_details(self, journeyIdx, questIdx, taskIdx):
        task = self.get_task(journeyIdx=journeyIdx, questIdx=questIdx, taskIdx=taskIdx)
        return task.get_task_details_preview()
    
    def remove_task(self, journeyIdx, questIdx, taskIdx): 
        quest = self.get_task(journeyIdx=journeyIdx, questIdx=questIdx)
        quest.remove_subtask(taskIdx)

    def add_task(self, journeyIdx, questIdx, taskName):
        quest = self.get_task(journeyIdx=journeyIdx, questIdx=questIdx)
        quest.add_subtask(name = taskName)

    def complete_task(self, journeyIdx, questIdx, taskIdx):
        task = self.get_task(journeyIdx=journeyIdx, questIdx=questIdx, taskIdx=taskIdx)
        task.complete()