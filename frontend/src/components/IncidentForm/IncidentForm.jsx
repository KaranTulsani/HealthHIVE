import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './IncidentForm.css';

// Define the API URL from environment variables for deployment flexibility
const API_URL = import.meta.env.VITE_API_URL;

const AlertCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

function IncidentForm({ onSubmit, isLoading, setIsLoading, setResultsData, setError }) {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Bandra');
  const [critical, setCritical] = useState(4);
  const [stable, setStable] = useState(7);
  const [scenario, setScenario] = useState('1');

  // --- MODIFIED HANDLE SUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state in parent
    setError(null);     // Clear previous errors

    const incidentData = {
      location: location,
      critical_patients: parseInt(critical),
      stable_patients: parseInt(stable),
      scenario: parseInt(scenario),
    };
    
    try {
      const response = await fetch(`${API_URL}/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const results = await response.json();
      setResultsData(results); // Pass results to parent component
      
      // Navigate to the results page with the data
      navigate('/results', { state: { results } });

    } catch (error) {
      console.error("Failed to generate plan:", error);
      setError("Could not connect to the AI service. Please try again later.");
      // Optionally navigate to an error state or show an inline error
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  const totalPatients = useMemo(() => (parseInt(critical) || 0) + (parseInt(stable) || 0), [critical, stable]);

  return (
    <div className="page-wrapper incident-form-wrapper">
      <div className="incident-form-banner">
        <div className="banner-icon"><AlertCircle /></div>
        <h2>Emergency Hospital Finder</h2>
        <p>Enter incident details to generate an optimized routing plan.</p>
      </div>

      <div className="card incident-form-card">
        <form onSubmit={handleSubmit}>
          <h3>Incident Details</h3>

          <div className="form-group">
            <label htmlFor="location">Incident Location</label>
            <div className="input-with-icon">
              <MapPin />
              <input 
                type="text" 
                id="location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="e.g., Marine Drive"
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="critical">Critical Patients</label>
              <div className="input-with-icon">
                <UserIcon />
                <input 
                  type="number" 
                  id="critical" 
                  value={critical} 
                  onChange={(e) => setCritical(e.target.value)} 
                  min="0" 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="stable">Stable Patients</label>
              <div className="input-with-icon">
                <UserIcon />
                <input 
                  type="number" 
                  id="stable" 
                  value={stable} 
                  onChange={(e) => setStable(e.target.value)} 
                  min="0" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="scenario">Scenario Type</label>
            <select id="scenario" value={scenario} onChange={(e) => setScenario(e.target.value)} required>
              <option value="1">Normal Operations</option>
              <option value="2">Accident (Critical Spike)</option>
              <option value="3">Outbreak (Both Up)</option>
              <option value="4">Festival Crowd (Stable Spike)</option>
            </select>
          </div>
          
          <div className="total-patients-display">
            Total Patients: <strong>{totalPatients}</strong>
          </div>

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? (
              <>Generating Plan <span className="spinner"></span></>
            ) : (
              '🚀 Generate Action Plan'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default IncidentForm;