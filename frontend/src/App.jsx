// src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import './App.css';
import IncidentForm from './IncidentForm';
import ResultsDisplay from './ResultsDisplay';

// The URL where your FastAPI backend is running
const API_URL = 'http://127.0.0.1:5000';

function App() {
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePlan = async (formData) => {
    setIsLoading(true);
    setError('');
    setPlanData(null);

    try {
      // Make the POST request to the backend API
      const response = await axios.post(`${API_URL}/generate-plan`, formData);
      setPlanData(response.data);
    } catch (err) {
      console.error("API Error:", err);
      setError('Failed to generate plan. Please ensure the backend server is running and accessible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🚀 AI Emergency Load Balancer</h1>
      
      <div className="card">
        <IncidentForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
      </div>

      {isLoading && <p className="loading">🧠 Analyzing data and generating plan...</p>}
      {error && <p className="error">⚠️ {error}</p>}
      
      {planData && (
        <div className="card results-container">
          <ResultsDisplay data={planData} />
        </div>
      )}
    </div>
  );
}

export default App;