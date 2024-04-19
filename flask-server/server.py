from flask import Flask, request, jsonify
from request_config import ROUTE_INFO
from GoalzillaData import GoalzillaData

app = Flask(__name__)
app_data = GoalzillaData(include_test_defaults=True)

""" Route Handling Helpers"""

def extract_args(request, route: str, route_details: dict):
    if route_details['method']=="POST":
        params = request.get_json()
    else:
        params = request.args
    values_needed = route_details['parameters']
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

def handle_request(request, route):
    route_details = ROUTE_INFO.get(route)
    if not route_details:
        raise Exception(f"NO ROUTE FOUND: {route}")
    
    handler = getattr(app_data, route_details['handler'])

    if (kwargs := extract_args(request, route, route_details)):
        try: 
            result = handler(**kwargs)
            if result:
                return result
        except Exception as e:
            return jsonify({"message": f"Failed to execute request {route} w/exception {e}"})
    return jsonify({'message': f'Successful execution of {request}'})


@app.route("/goals")
def get_goals():
    return {'goals': app_data.get_goals_list()}

@app.route("/add_goal", methods=['POST'])
def add_goal():
    return handle_request(request, 'add_goal')

@app.route("/remove_journey", methods=['POST'])
def remove_journey():
    return handle_request(request, 'remove_journey')

@app.route("/quest_preview")
def get_quest_preview():
    return handle_request(request, 'quest_preview')


@app.route("/remove_quest", methods=['POST'])
def remove_quest():
    return handle_request(request, 'remove_quest')

@app.route("/add_quest", methods=['POST'])
def add_quest():
    return handle_request(request, 'add_quest')

@app.route("/journeyDetails")
def getJourneyDetails():
    return handle_request(request, 'journeyDetails')

@app.route('/questDetails')
def get_quest_details():
    return handle_request(request, 'questDetails')

@app.route('/getTaskDetails')
def get_task_details():
    return handle_request(request, 'getTaskDetails')

@app.route("/remove_task", methods=['POST'])
def remove_task():
    return handle_request(request, 'remove_task')

@app.route("/add_task", methods=['POST'])
def add_task():
    return handle_request(request, 'add_task')

@app.route("/add_task_completion", methods=['POST'])
def add_task_completion():
    return handle_request(request, 'add_task_completion')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)