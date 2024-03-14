
from request_config import REQUIRED_VALUES
def extract_args(request, route: str, post:bool=False):
    if post:
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

