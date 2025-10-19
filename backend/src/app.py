from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import traceback
from datetime import datetime

# Import the main controller function
from .logic_controller import run_full_simulation

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

# Configuration - Fixed to point to backend/plans/ (one level up from src/)
# __file__ is api.py which is in backend/src/
# We need to go up one level to get to backend/
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/src/
BACKEND_DIR = os.path.dirname(CURRENT_DIR)  # backend/
PLANS_DIR = os.path.join(BACKEND_DIR, "plans")  # backend/plans/

# Ensure plans directory exists
os.makedirs(PLANS_DIR, exist_ok=True)

print(f"Current directory (src): {CURRENT_DIR}")
print(f"Backend directory: {BACKEND_DIR}")
print(f"Plans directory: {PLANS_DIR}")


@app.route("/")
def index():
    """A simple route to check if the API is running."""
    return jsonify({
        "status": "AI Emergency Load Balancer API is running!",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }), 200


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend status."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "HealthHive AI Load Balancer"
    }), 200


@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    """
    Main API endpoint to generate an emergency action plan.
    
    Expected JSON payload:
    {
        "location": "string",
        "critical_patients": int,
        "stable_patients": int,
        "scenario": int
    }
    
    Returns:
    {
        "action_plan": { ... },
        "timestamp": "ISO timestamp",
        "incident_id": "unique identifier"
    }
    """
    request_id = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    try:
        # Parse request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No JSON data provided",
                "request_id": request_id
            }), 400
        
        print(f"\n{'='*60}")
        print(f"[{request_id}] Received request data:")
        print(json.dumps(data, indent=2))
        print(f"{'='*60}\n")

        # Extract and validate required fields
        location = data.get('location', '').strip()
        critical_patients = data.get('critical_patients')
        stable_patients = data.get('stable_patients')
        scenario = data.get('scenario')

        # Validation
        validation_errors = []
        
        if not location:
            validation_errors.append("location is required and cannot be empty")
        if critical_patients is None:
            validation_errors.append("critical_patients is required")
        elif not isinstance(critical_patients, int) or critical_patients < 0:
            validation_errors.append("critical_patients must be a non-negative integer")
            
        if stable_patients is None:
            validation_errors.append("stable_patients is required")
        elif not isinstance(stable_patients, int) or stable_patients < 0:
            validation_errors.append("stable_patients must be a non-negative integer")
            
        if scenario is None:
            validation_errors.append("scenario is required")
        elif not isinstance(scenario, int) or scenario not in [1, 2, 3, 4]:
            validation_errors.append("scenario must be an integer between 1 and 4")

        if validation_errors:
            return jsonify({
                "error": "Validation failed",
                "details": validation_errors,
                "request_id": request_id
            }), 400

        # Run simulation
        print(f"[{request_id}] Starting simulation...")
        success = run_full_simulation(
            location=location,
            critical_patients=critical_patients,
            stable_patients=stable_patients,
            scenario=str(scenario)
        )

        if not success:
            error_msg = "Backend simulation script failed to execute"
            print(f"[{request_id}] ERROR: {error_msg}")
            return jsonify({
                "error": error_msg,
                "request_id": request_id
            }), 500

        # Read output file
        output_path = os.path.join(PLANS_DIR, "last_routing.json")
        
        if not os.path.exists(output_path):
            error_msg = f"Output file not found at {output_path}"
            print(f"[{request_id}] ERROR: {error_msg}")
            return jsonify({
                "error": "Simulation ran but output file was not found",
                "details": error_msg,
                "request_id": request_id
            }), 500

        # Parse and return result
        with open(output_path, 'r', encoding='utf-8') as f:
            result_data = json.load(f)

        # Ensure proper structure
        if not isinstance(result_data, dict):
            result_data = {"action_plan": result_data}

        # Add metadata
        response = {
            **result_data,
            "request_id": request_id,
            "timestamp": datetime.now().isoformat(),
            "incident_summary": {
                "location": location,
                "critical_patients": critical_patients,
                "stable_patients": stable_patients,
                "total_patients": critical_patients + stable_patients,
                "scenario": scenario
            }
        }

        print(f"[{request_id}] Successfully generated plan")
        print(f"[{request_id}] Response keys: {list(response.keys())}\n")
        
        return jsonify(response), 200

    except json.JSONDecodeError as e:
        error_msg = f"Invalid JSON format: {str(e)}"
        print(f"[{request_id}] JSON Decode Error: {error_msg}")
        return jsonify({
            "error": error_msg,
            "request_id": request_id
        }), 400

    except Exception as e:
        error_msg = str(e)
        print(f"[{request_id}] Unexpected Error: {error_msg}")
        traceback.print_exc()
        return jsonify({
            "error": "An internal server error occurred",
            "details": error_msg if app.debug else None,
            "request_id": request_id
        }), 500


@app.route("/status", methods=["GET"])
def get_status():
    """Get system status and statistics."""
    try:
        plan_count = len([f for f in os.listdir(PLANS_DIR) if f.endswith('.json')])
        return jsonify({
            "status": "operational",
            "plans_generated": plan_count,
            "plans_directory": PLANS_DIR,
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        "error": "Endpoint not found",
        "path": request.path,
        "method": request.method
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({
        "error": "Method not allowed",
        "path": request.path,
        "method": request.method
    }), 405


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({
        "error": "Internal server error",
        "message": str(error)
    }), 500


if __name__ == "__main__":
    print(f"\n{'='*60}")
    print("🚨 HealthHive AI Emergency Load Balancer API")
    print(f"{'='*60}")
    print(f"Starting server on http://localhost:5000")
    print(f"Plans directory: {PLANS_DIR}")
    print(f"Debug mode: {app.debug}")
    print(f"{'='*60}\n")
    
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)
