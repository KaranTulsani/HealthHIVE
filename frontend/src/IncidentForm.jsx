import { useState } from 'react';

// Simple SVG Icon components
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const CriticalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m12 16 4-4-4-4" /><path d="m8 12 h8" /></svg>
);
const StableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M8 12h8" /></svg>
);
const ScenarioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

function IncidentForm({ onSubmit, isLoading }) {
  const [location, setLocation] = useState('Worli');
  const [critical, setCritical] = useState(3);
  const [stable, setStable] = useState(6);
  const [scenario, setScenario] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      location: location,
      critical_patients: parseInt(critical),
      stable_patients: parseInt(stable),
      scenario: parseInt(scenario),
    });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>AI Emergency Load Balancer</h1>
        <p className="hero-subtitle">
          Intelligent resource allocation for emergency medical services using real-time ML predictions
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">95%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">&lt;2s</span>
            <span className="stat-label">Response Time</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Monitoring</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Info Panel */}
        <div className="info-panel">
          <h2>How It Works</h2>
          <ul className="feature-list">
            <li className="feature-item">
              <strong>Smart Routing</strong>
              <span>ML-powered algorithms calculate optimal hospital assignments based on real-time capacity and travel time</span>
            </li>
            <li className="feature-item">
              <strong>Predictive Analysis</strong>
              <span>Forecasts hospital load for the next hour to prevent overcrowding</span>
            </li>
            <li className="feature-item">
              <strong>Dynamic Allocation</strong>
              <span>Automatically adjusts resource distribution based on severity and hospital readiness</span>
            </li>
            <li className="feature-item">
              <strong>Real-time Alerts</strong>
              <span>Instant notifications to hospitals and staff for immediate action</span>
            </li>
          </ul>
        </div>

        {/* Form Card */}
        <div className="card">
          <h2>Emergency Incident Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="location">Incident Location</label>
                <div className="input-wrapper">
                  <LocationIcon />
                  <input 
                    type="text" 
                    id="location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="e.g., Bandra, Dadar, Worli"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="scenario">Scenario Type</label>
                <div className="input-wrapper">
                  <ScenarioIcon />
                  <select 
                    id="scenario" 
                    value={scenario} 
                    onChange={(e) => setScenario(e.target.value)} 
                    required
                  >
                    <option value="1">Normal Operations</option>
                    <option value="2">Major Accident (Critical Spike)</option>
                    <option value="3">Disease Outbreak (Both Up)</option>
                    <option value="4">Festival Crowd (Stable Spike)</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="critical">Critical Patients</label>
                <div className="input-wrapper">
                  <CriticalIcon />
                  <input 
                    type="number" 
                    id="critical" 
                    value={critical} 
                    onChange={(e) => setCritical(e.target.value)} 
                    min="0" 
                    max="100"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="stable">Stable Patients</label>
                <div className="input-wrapper">
                  <StableIcon />
                  <input 
                    type="number" 
                    id="stable" 
                    value={stable} 
                    onChange={(e) => setStable(e.target.value)} 
                    min="0" 
                    max="100"
                    required 
                  />
                </div>
              </div>
              
              <button type="submit" disabled={isLoading}>
                {isLoading ? '⏳ Processing...' : '🚀 Generate Action Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default IncidentForm;