import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';
import '../../SharedStyles.css';

const LandingPage = ({ systemStatus }) => {
  const navigate = useNavigate();

  const statusInfo = {
    operational: { text: 'System Operational', color: '#22c55e' },
    offline: { text: 'System Offline', color: '#ef4444' },
  };
  const currentStatus = statusInfo[systemStatus] || statusInfo.offline;

  return (
    <motion.div 
      className="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- Top Bar: Brand + System Status --- */}
      <div className="top-bar">
        <motion.div 
          className="brand-name"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span className="brand-highlight">Health</span>HIVE.<span className="ai">AI</span>
        </motion.div>

        <motion.div 
          className="system-status-indicator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="status-dot" style={{ backgroundColor: currentStatus.color }}></div>
          <span>{currentStatus.text}</span>
        </motion.div>
      </div>

      {/* --- Hero Section --- */}
      <div className="hero-section">
        <motion.div 
          className="heart-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
        >
          ❤️
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Emergency Hospital <br />
          <span>Load Balancer</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Find the nearest hospital with available beds and the right specialization in critical moments. Smart routing for emergency care when every second counts.
        </motion.p>
        <motion.div 
          className="hero-buttons"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <button className="primary-button" onClick={() => navigate('/incident')}>
            <span className="icon">📍</span> Find Emergency Care Now
          </button>
        </motion.div>
      </div>

      {/* --- Features Section --- */}
      <div className="features-section">
        <motion.div 
          className="feature-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="feature-icon">🕒</div>
          <h3>Real-Time Availability</h3>
          <p>Live updates on bed availability and hospital capacity for instant decision making.</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="feature-icon">🗺️</div>
          <h3>Smart Location Routing</h3>
          <p>AI-powered recommendations based on distance, specialization, and current load.</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="feature-icon">🎗️</div>
          <h3>Specialized Care</h3>
          <p>Match patients with hospitals that specialize in their specific emergency needs.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
