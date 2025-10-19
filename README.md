# MumbaiHacks

🚀 AI Emergency Load Balancer for Urban Hospital Networks

An intelligent agent that optimizes patient routing during mass casualty incidents in a city like Mumbai. This project uses machine learning to predict hospital strain and an optimization algorithm to generate real-time dispatch plans, ensuring patients get to the fastest available care, not just the closest hospital.

This project was developed for the MumbaiHacks hackathon.

-- Tip: Take a screenshot of your running app, upload it to a site like Imgur, and paste the link here --

The Problem: Urban Overload During Emergencies

During a mass casualty incident, the standard protocol of rushing all patients to the nearest hospital creates a critical bottleneck. The closest facility is overwhelmed, leading to dangerous wait times, while nearby hospitals remain underutilized. This lack of intelligent, city-wide coordination can delay critical care and lead to poorer patient outcomes.

Our Solution: An Agentic AI Coordinator

This project acts as an autonomous, intelligent emergency coordinator that operates on a Sense-Think-Act cycle:

🧠 SENSE: The agent monitors real-time data from the entire hospital network, including bed occupancy, staff utilization, and specialty care availability.

🤔 THINK: It uses an XGBoost model to predict future ER wait times and an optimization algorithm to calculate a "Time-to-Treatment" score for each hospital, balancing travel time with predicted wait time.

🚑 ACT: Based on the scores, the agent issues direct commands: rerouting ambulances, alerting hospitals to prepare, and recommending resource allocation to prevent bottlenecks before they form.

🛠️ Tech Stack

Backend:

Framework: Python, Flask

Machine Learning: Scikit-learn, Pandas, NumPy

Core Logic: Standard Python libraries (subprocess, json)

Frontend:

Framework: React.js

Build Tool: Vite

API Client: Axios

Styling: CSS

📂 Project Structure

The project is organized into two main parts: the Python backend and the React frontend.

.
├── backend/
│   ├── dataset/      # Training and hospital data
│   ├── models/       # Trained ML model files
│   ├── output/       # Generated plans and logs
│   └── src/          # Main Python source code (Flask API, agent logic)
└── frontend/
    └── src/          # React components and application logic


🏁 Getting Started: How to Run This Project Locally

Follow these instructions to get the project up and running on your machine.

Prerequisites

Python: Version 3.10 or newer.

Node.js: Version 18 or newer (which includes npm).

Git: For cloning the repository.

1. Clone the Repository

First, clone the project from GitHub to your local machine.

git clone [https://github.com/KaranTulsani/MumbaiHacks.git](https://github.com/KaranTulsani/MumbaiHacks.git)
cd MumbaiHacks


2. Set Up the Backend (Python)

You'll need two separate terminal windows for this process.

In your first terminal, navigate to the backend directory and set up the Python environment.

# Navigate to the backend folder
cd backend

# Create a Python virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
# source .venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt


3. Set Up the Frontend (React)

In your second terminal, navigate to the frontend directory and install the Node.js dependencies.

# Navigate to the frontend folder
cd frontend

# Install the required npm packages
npm install


🚀 How to Run the Application

Now that both environments are set up, you can start the servers.

Start the Backend Server:

In your first terminal (the one in the backend directory with the virtual environment active), run the Flask application.

python src/app.py


The server will start and be running at http://127.0.0.1:5000. Keep this terminal open.

Start the Frontend Server:

In your second terminal (the one in the frontend directory), run the React development server.

npm run dev
