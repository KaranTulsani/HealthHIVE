import React from "react";
import MapDisplay from "./MapDisplay";

const groupActionsByHospital = (actions) => {
  if (!actions) return {};
  return actions.reduce((acc, action) => {
    const hospitalName = `${action.hospital_name} (${action.hospital_id})`;
    if (!acc[hospitalName]) acc[hospitalName] = [];

    let cleanAction = action.action
      .replace(`at ${action.hospital_name} (${action.hospital_id})`, "")
      .replace(`to ${action.hospital_name}`, "");

    acc[hospitalName].push(cleanAction);
    return acc;
  }, {});
};

function ResultsDisplay({ data }) {
  if (!data) return <p>Loading...</p>;

  const { action_plan = {}, hospital_scores = [] } = data;
  const {
    summary = {},
    ambulance_dispatch = [],
    hospital_alerts = [],
    staff_actions = [],
    public_advisory = "",
  } = action_plan;

  const groupedStaffActions = groupActionsByHospital(staff_actions);

  const incident = {
    name: summary.incident_location || data.incident_location,
    lat: data.incident_lat,
    lon: data.incident_lon,
  };

  // ✅ Use assignments from backend (they contain lat/lon)
  const assignments = data.assignments || [];

  return (
    <div className="results-container">
      {/* Summary Section */}
      <div className="result-section">
        <h2 className="section-header">📊 Action Plan Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Incident Location</strong>
            <span>{summary.incident_location || "Unknown"}</span>
          </div>
          <div className="summary-item">
            <strong>Scenario Type</strong>
            <span>
              {summary.scenario
                ? summary.scenario.charAt(0).toUpperCase() +
                  summary.scenario.slice(1)
                : "N/A"}
            </span>
          </div>
          <div className="summary-item">
            <strong>Total Patients</strong>
            <span>{summary.total_patients}</span>
          </div>
          <div className="summary-item">
            <strong>Critical Cases</strong>
            <span style={{ color: "#dc2626" }}>{summary.total_critical}</span>
          </div>
          <div className="summary-item">
            <strong>Stable Cases</strong>
            <span style={{ color: "#059669" }}>{summary.total_stable}</span>
          </div>
          <div className="summary-item">
            <strong>Hospitals Utilized</strong>
            <span>{summary.hospitals_used}</span>
          </div>
        </div>
      </div>

      {/* Dispatch + Alerts */}
      <div className="results-grid">
        <div className="result-section">
          <h2 className="section-header">🚑 Ambulance Dispatch</h2>
          <ul>
            {ambulance_dispatch.map((dispatch, index) => {
              const extras = [];
              if (dispatch.distance_km != null)
                extras.push(`${parseFloat(dispatch.distance_km).toFixed(2)} km`);
              if (dispatch.travel_min != null)
                extras.push(`${parseFloat(dispatch.travel_min).toFixed(1)} min`);
              const extraString =
                extras.length > 0 ? ` (${extras.join(" | ")})` : "";

              return (
                <li key={index}>
                  <strong>
                    {dispatch.hospital_name} ({dispatch.hospital_id})
                  </strong>
                  <br />
                  🔴 {dispatch.critical} critical • 🟢 {dispatch.stable} stable
                  {extraString}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="result-section">
          <h2 className="section-header">🏥 Hospital Alerts</h2>
          <ul>
            {hospital_alerts.map((alert, index) => (
              <li key={index}>{alert.message}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Staff Actions */}
      <div className="result-section">
        <h2 className="section-header">👨‍⚕️ Staff & Resource Actions</h2>
        {Object.entries(groupedStaffActions).map(([hospitalName, actions]) => (
          <div key={hospitalName} className="action-group">
            <h3>{hospitalName}</h3>
            <ul>
              {actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Public Advisory */}
      <div className="result-section">
        <h2 className="section-header">📢 Public Advisory</h2>
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "1.5rem",
            borderRadius: "12px",
            borderLeft: "4px solid #d97706",
            fontSize: "1.05rem",
            lineHeight: "1.7",
          }}
        >
          {public_advisory}
        </div>
      </div>

      {/* 🗺️ Map Section */}
      <div className="result-section">
        <h2 className="section-header">🗺️ Geospatial View</h2>
        <MapDisplay incident={incident} assignments={assignments} />
      </div>

      {/* Scoring Details */}
      <div className="result-section">
        <h2 className="section-header">⚙️ Hospital Scoring Details</h2>
        <p style={{ marginBottom: "1.5rem", color: "#64748b" }}>
          Lower scores indicate better suitability. Scores combine travel time,
          predicted load, capacity, and readiness.
        </p>
        <table className="scores-table">
          <thead>
            <tr>
              <th>Hospital ID</th>
              <th>Travel Time (min)</th>
              <th>Predicted Load</th>
              <th>Capacity Score</th>
              <th>Readiness Index</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {hospital_scores.map((hospital) => (
              <tr key={hospital.hospital_id}>
                <td>{hospital.hospital_id}</td>
                <td>{hospital.travel_min.toFixed(2)}</td>
                <td>{hospital.pred_adm_next.toFixed(2)}</td>
                <td>{hospital.capacity_score.toFixed(1)}</td>
                <td>{hospital.readiness_index.toFixed(1)}</td>
                <td>{hospital.total_score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsDisplay;
