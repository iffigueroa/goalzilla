from flask import Flask, request, jsonify
from test_data import GoalzillaData
from helper import extract_args

app = Flask(__name__)

app_data = GoalzillaData(include_test_defaults=True)

@app.route("/goals")
def get_goals():
    return {'goals': app_data.get_goals_list()}

@app.route("/add_goal", methods=['POST'])
def add_goal():
    if (kwargs := extract_args(request, 'add_goal', isPost=True)):
        app_data.add_journey(**kwargs)
    return jsonify({'message': f'Goal added successfully'})

@app.route("/remove_journey", methods=['POST'])
def remove_journey():
    if (kwargs := extract_args(request, 'remove_journey', isPost=True)):
        app_data.remove_journey(**kwargs)
    return jsonify({'message': f'Goal removed successfully'})

@app.route("/quest_preview")
def get_quest_preview():
    if (kwargs := extract_args(request, 'quest_preview')):
        return app_data.get_quest_preview(**kwargs)


@app.route("/remove_quest", methods=['POST'])
def remove_quest():
    if (kwargs := extract_args(request, 'remove_quest', isPost=True)):
        app_data.remove_quest(**kwargs)
    return jsonify({'message': 'Quest removed.'})


@app.route("/add_quest", methods=['POST'])
def add_quest():
    if (kwargs := extract_args(request, 'add_quest', isPost=True)):
        app_data.add_quest(**kwargs)
    return jsonify({'message': 'Quest added.'})

@app.route("/journeyDetails")
def getJourneyDetails():
    if (kwargs := extract_args(request, 'journeyDetails')):
        return app_data.get_journey_details(**kwargs)
    return {'error': 'No journey with provided id.'}

@app.route('/questDetails')
def get_quest_details():
    if (kwargs := extract_args(request, 'questDetails')):
        return app_data.get_quest_details(**kwargs)
    return {'error': 'No journey with provided id.'}

@app.route('/getTaskDetails')
def get_task_details():
    if (kwargs := extract_args(request, 'getTaskDetails')):
        return app_data.get_task_details(**kwargs)
    return {'error': 'No journey with provided id.'}

@app.route("/remove_task", methods=['POST'])
def remove_task():
    if (kwargs := extract_args(request, 'remove_task', isPost=True)):
        app_data.remove_task(**kwargs)
    return jsonify({'message': 'task removed.'})    

@app.route("/add_task", methods=['POST'])
def add_task():
    if (kwargs := extract_args(request, 'add_task', isPost=True)):
        app_data.add_task(**kwargs)
    return jsonify({'message': 'Task added.'})

@app.route("/add_task_completion", methods=['POST'])
def add_task_completion():
    if (kwargs := extract_args(request, 'add_task_completion', isPost=True)):
        app_data.complete_task(**kwargs)
    return jsonify({'message': 'Task Completed.'})
    


if __name__ == '__main__':
    app.run(debug=True)