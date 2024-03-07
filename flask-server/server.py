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