from flask import Flask, request, jsonify

app = Flask(__name__)
# TODO load from external source
goals_list = []

@app.route("/goals")
def get_goals():
    return {'goals': goals_list}

@app.route("/add_goal", methods=['POST'])
def add_goal():
    data = request.get_json()
    new_goal = data.get('name')
    goals_list.append(new_goal)
    return jsonify({'message': f'Goal [{new_goal}] added successfully'})


if __name__ == '__main__':
    app.run(debug=True)