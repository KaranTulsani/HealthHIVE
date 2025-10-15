from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import traceback

# Import the main controller function
from logic_controller import run_full_simulation

# Initialize the Flask application
app = Flask(__name__)

# --- Simplified and More Robust CORS Configuration ---
# This configuration is generally the most reliable for development.
# It tells the server to automatically handle preflight requests
# from any origin, which is what we need for localhost testing.
CORS(app)


@app.route("/")
def index():
    """A simple route to check if the API is running."""
    return jsonify({"status": "AI Emergency Load Balancer API is running!"})


@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    """
    The main API endpoint. The CORS library now handles the OPTIONS
    preflight request automatically, so we only need to handle POST.
    """
    try:
        # 1. Get the JSON data sent from the React frontend
        data = request.get_json()
        print(f"Received request data: {data}")

        # Extract data with checks for missing keys
        location = data.get('location')
        critical_patients = data.get('critical_patients')
        stable_patients = data.get('stable_patients')
        scenario = data.get('scenario')

        if None in [location, critical_patients, stable_patients, scenario]:
            return jsonify({"error": "Missing data in request"}), 400

        # 2. Run the full simulation via the controller
        success = run_full_simulation(
            location=location,
            critical_patients=critical_patients,
            stable_patients=stable_patients,
            scenario=str(scenario)
        )

        if not success:
            return jsonify({"error": "Backend simulation script failed to execute."}), 500

        # 3. Read the JSON file that your scripts generated.
        output_path = os.path.join("plans", "last_routing.json")
        
        if not os.path.exists(output_path):
             return jsonify({"error": "Simulation ran but output file was not found."}), 500

        with open(output_path, 'r', encoding='utf-8') as f:
            result_data = json.load(f)

        # 4. Send the JSON data back to the React frontend
        return jsonify(result_data)

    except Exception as e:
        print(f"An error occurred in the Flask endpoint: {e}")
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred."}), 500


if __name__ == "__main__":
    # Runs the app on http://127.0.0.1:5000
    app.run(debug=True, port=5000)

