
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
    

def extract_args(request, route, isPost:bool=False):
    if isPost:
        params = request.get_json()
    else:
        params = request.args
    values_needed = REQUIRED_VALUES.get(route)
    if not values_needed: 
        raise Exception(f"No required values found for {route}.")
    kwargs = {}
    for value, value_type in values_needed: 
        arg = params.get(value)
        if arg == None: 
            raise Exception(f"Value for {value} is missing.") 
        try:
            casted_value = value_type(arg)
        except ValueError:
            raise Exception(f"Failed to cast value {arg} to type {value_type} for {value}.")
        kwargs[value] = casted_value
    print(kwargs)
    return kwargs

