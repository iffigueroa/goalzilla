from flask import Flask, request, jsonify
from request_config import ROUTE_INFO
from GoalzillaData import GoalzillaData

app = Flask(__name__)
GOALZILLA_APP_HANDLER = GoalzillaData(include_test_defaults=True)

""" Route Handling Helpers"""
def extract_args(request, route_details: dict):
    if route_details['method']=="POST":
        params = request.get_json()
    else:
        params = request.args
    values_needed = route_details['parameters']
    if not values_needed: 
        return {}
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

def handle_request(request, route, route_details, app_handler):
    handler = getattr(app_handler, route_details['handler'])
    try: 
        kwargs = extract_args(request, route_details)
        result = handler(**kwargs)
        if result:
            return result
    except Exception as e:
        return jsonify({"message": f"Failed to execute request {route} w/exception {e}"})
    return jsonify({'message': f'Successful execution of {request}'})


def generate_route_methods(route_config, app_handler):
    for route in route_config.keys():
        route_details = route_config.get(route)
        if not route_details:
            raise Exception(f"No route found for: {route}")

        def create_route_method(route, route_details):
            def func():
                return handle_request(request, route, route_details, app_handler)
            return func

        view_func = create_route_method(route, route_details)
        view_func.__name__ =  f"_function_{route}" 
        app.add_url_rule(f"/{route}", view_func.__name__, view_func, methods=[route_details['method']])


generate_route_methods(route_config=ROUTE_INFO, app_handler=GOALZILLA_APP_HANDLER)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)