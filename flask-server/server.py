from flask import Flask, request, jsonify
from test_data import GoalzillaData

app = Flask(__name__)

app_data = GoalzillaData(include_test_defaults=True)

@app.route("/goals")
def get_goals():
    return {'goals': app_data.get_goals_list()}

@app.route("/add_goal", methods=['POST'])
def add_goal():
    data = request.get_json()
    name = data.get('name')
    desc = data.get('description')
    app_data.add_journey(journey_name=name, description=desc)
    return jsonify({'message': f'Goal [{name}] added successfully'})

@app.route("/remove_journey", methods=['POST'])
def remove_journey():
    data = request.get_json()
    idx = data.get('index')
    app.logger.info(f"removing {idx}")
    app_data.remove_journey(index=idx)
    app.logger.info("removed")
    return jsonify({'message': f'Goal [{idx}] added successfully'})

@app.route("/quest_preview")
def get_quest_preview():
    args = request.args
    journeyIdx = args.get('journeyIdx')
    if journeyIdx: 
        journeyIdx = int(journeyIdx)
        return app_data.get_quest_preview(journeyIdx=journeyIdx)


@app.route("/remove_quest", methods=['POST'])
def remove_quest():
    data = request.get_json()
    journeyIdx = data.get('journeyIdx')
    questIdx = data.get('questIdx')
    app_data.remove_quest(journeyIdx=journeyIdx, questIdx=questIdx)
    return jsonify({'message': 'Quest removed.'})


@app.route("/add_quest", methods=['POST'])
def add_quest():
    data = request.get_json()
    journeyIdx = data.get('journeyIdx')
    name = data.get('name')
    desc = data.get('description')
    app_data.add_quest(journeyIdx=journeyIdx, name=name, description=desc)
    return jsonify({'message': 'Quest added.'})

@app.route("/journeyDetails")
def getJourneyDetails():
    journeyIdx = request.args.get('index')
    if journeyIdx: 
        journeyIdx = int(journeyIdx)
        app.logger.info(f"Request for Journey Details for {journeyIdx}")
        if (journeyDetails := app_data.get_journey_details(journeyIdx)):
            return journeyDetails
        return {'error': 'No journey with provided id.'}
    else: 
        return {'error': 'No journey with provided id.'}

if __name__ == '__main__':
    app.run(debug=True)