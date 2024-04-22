

ROUTE_INFO = {
    'goals': {
        'parameters': None,
        'method': 'GET',
        'handler': 'get_goals_list',
    },
    'journeyDetails': {
        'parameters': [('journeyIdx', int)],
        'method': 'GET',
        'handler': 'get_journey_details',
    }, 
    'quest_preview': {
        'parameters': [('journeyIdx', int)],
        'method': 'GET',
        'handler': 'get_quest_preview',
    },

    'questDetails':  {
        'parameters':[('journeyIdx', int), ('questIdx', int)], 
        'method': 'GET',
        'handler': 'get_quest_details',
    },

    'getTaskDetails':  {
        'parameters':[('journeyIdx', int), ('questIdx', int), ('taskIdx', int)], 
        'method': 'GET',
        'handler': 'get_task_details',
    },
    'remove_quest':  {
        'parameters': [('journeyIdx', int), ('questIdx', int)], 
        'method': 'POST',
        'handler': 'remove_quest',
    },
    'add_goal':  {
        'parameters': [('name', str), ('description', str)], 
        'method': 'POST',
        'handler': 'add_journey',
    },
    'remove_journey':  {
        'parameters': [('index', int)], 
        'method': 'POST',
        'handler': 'remove_journey',
    },
    'add_quest':  {
        'parameters': [('journeyIdx', int), ('name', str), ('description', str)], 
        'method': 'POST',
        'handler': 'add_quest',
    },
    'remove_task':  {
        'parameters': [('journeyIdx', int), ('questIdx', int), ('taskIdx', int)], 
        'method': 'POST',
        'handler': 'remove_task',
    },
    'add_task':  {
        'parameters': [('journeyIdx', int), ('questIdx', int), ('taskName', str)], 
        'method': 'POST',
        'handler': 'add_task',
    },
    'add_task_completion':  {
        'parameters': [('journeyIdx', int), ('questIdx', int), ('taskIdx', int)],
        'method': 'POST',
        'handler': 'complete_task',
    },
}