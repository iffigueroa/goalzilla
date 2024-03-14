
REQUIRED_VALUES = {
    'journeyDetails': [('journeyIdx', int)], 
    'quest_preview': [('journeyIdx', int)], 
    'questDetails': [('journeyIdx', int), ('questIdx', int)], 
    'getTaskDetails': [('journeyIdx', int), ('questIdx', int), ('taskIdx', int)], 
    'remove_quest': [('journeyIdx', int), ('questIdx', int)], 
    'add_goal': [('name', str), ('description', str)], 
    'remove_journey': [('index', int)], 
    'add_quest': [('journeyIdx', int), ('name', str), ('description', str)], 
    'remove_task': [('journeyIdx', int), ('questIdx', int), ('taskIdx', int)], 
    'add_task': [('journeyIdx', int), ('questIdx', int), ('taskName', str)], 
    'add_task_completion': [('journeyIdx', int), ('questIdx', int), ('taskIdx', int)], 
}