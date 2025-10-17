import React from 'react';
import { useLocation } from 'react-router-dom';
import './ResultsDisplay.css';

const groupActionsByHospital = (actions) => {
  if (!actions || !Array.isArray(actions)) return {};
  return actions.reduce((acc, action) => {
    const hospitalName = `${action.hospital_name} (${action.hospital_id})`;
    if (!acc[hospitalName]) acc[hospitalName] = [];
    let cleanAction = action.action.replace(`at ${action.hospital_name} (${action.hospital_id})`, '');
    cleanAction = cleanAction.replace(`to ${action.hospital_name}`, '');
    acc[hospitalName].push(cleanAction.trim());
    return acc;
  }, {});
};

const ResultsDisplay = ({ data, error, isLoading, onGoBack, onGoHome }) => {
  const location = useLocation();
  
  // Get data from location state if available, otherwise use props
  const resultsData = location.state?.results || data;
  const resultsError = error;
  const resultsLoading = isLoading;

  if (resultsLoading) {
    return (
      <div className="page-wrapper results-loading-container">
        <div className="spinner large"></div>
        <h2>Generating Action Plan...</h2>
        <p>Analyzing incident data and running predictive models.</p>
      </div>
    );
  }

  if (resultsError) {
    return (
      <div className="page-wrapper results-error-container">
        <div className="error-icon">⚠️</div>
        <h2>Error Generating Plan</h2>
        <p>{resultsError}</p>
        <div className="error-actions">
          <button className="secondary-button" onClick={onGoBack}>← Try Again</button>
          <button className="primary-button" onClick={onGoHome}>Go to Home</button>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="page-wrapper results-no-data-container">
        <h2>No Plan Available</h2>
        <p>No data was returned for the incident. Please try again.</p>
        <button className="primary-button" onClick={onGoBack}>← Back to Form</button>
      </div>
    );
  }

  console.log('ResultsDisplay received data:', resultsData);

  // Extract data from response
  const incident_location = resultsData.incident_location || 'Unknown Location';
  const total_critical = resultsData.total_critical || 0;
  const total_stable = resultsData.total_stable || 0;
  const total_patients = total_critical + total_stable;
  const scenario = resultsData.scenario || 'Unknown';
  const action_plan = resultsData.action_plan || {};
  
  const ambulance_dispatch = action_plan.ambulance_dispatch || [];
  const hospital_alerts = action_plan.hospital_alerts || [];
  const staff_actions = action_plan.staff_actions || [];
  const public_advisory = action_plan.public_advisory || '';

  const groupedStaffActions = groupActionsByHospital(staff_actions);

  return (
    <div className="page-wrapper results-container">
      <div className="results-header-card">
        <button className="back-button" onClick={onGoBack}>← New Report</button>
        <h3 className="text-center">Action Plan Generated</h3>
        <p className="text-center">
          Incident at <strong>{incident_location}</strong> involving <strong>{total_patients} patients</strong>
        </p>
        <p className="text-center" style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>
          Scenario: <strong>{scenario}</strong> | Critical: <strong>{total_critical}</strong> | Stable: <strong>{total_stable}</strong>
        </p>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <h4>🚑 Ambulance Dispatch</h4>
          <ul>
            {ambulance_dispatch && ambulance_dispatch.length > 0 ? (
              ambulance_dispatch.map((d, i) => (
                <li key={i}>
                  <strong>{d.hospital_name} ({d.hospital_id})</strong>
                  <div><span className="critical">{d.critical} critical</span> • <span>{d.stable} stable</span></div>
                  <div className="details">~{parseFloat(d.distance_km).toFixed(1)} km • ~{parseFloat(d.travel_min).toFixed(0)} min</div>
                </li>
              ))
            ) : <li>No dispatch required</li>}
          </ul>
        </div>
        <div className="result-card">
          <h4>🏥 Hospital Alerts</h4>
          <ul>
            {hospital_alerts && hospital_alerts.length > 0 ? (
              hospital_alerts.map((a, i) => (
                <li key={i}>{a.message || a}</li>
              ))
            ) : <li>No alerts generated</li>}
          </ul>
        </div>
      </div>

      {Object.keys(groupedStaffActions).length > 0 && (
        <div className="result-card full-width">
          <h4>👨‍⚕️ Staff & Resource Actions</h4>
          <div className="action-groups">
            {Object.entries(groupedStaffActions).map(([name, actions]) => (
              <div key={name} className="action-group">
                <h5>{name}</h5>
                <ul>{actions.map((act, i) => <li key={i}>{act}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {public_advisory && (
        <div className="result-card full-width">
          <h4>📢 Public Advisory</h4>
          <p className="advisory-text">{public_advisory}</p>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;