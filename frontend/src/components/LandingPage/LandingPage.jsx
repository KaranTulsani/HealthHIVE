import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';
import '../../SharedStyles.css';
<<<<<<< HEAD
import AnimatedFeature from './AnimatedFeature'; // Import the new component

// IMPORTANT: Find 3 images and place them in an `assets` folder
// You can get great free illustrations from sites like undraw.co
import senseImage from '../../assets/sense.png'; 
import thinkImage from '../../assets/think.png'; 
import actImage from '../../assets/act.png';     
=======
>>>>>>> 3cf55562be907eaaadacc9cdd5e452193458e4e6

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
<<<<<<< HEAD
      {/* --- Top Bar: Brand + System Status (No Change) --- */}
      <div className="top-bar">
         <motion.div 
=======
      {/* --- Top Bar: Brand + System Status --- */}
      <div className="top-bar">
        <motion.div 
>>>>>>> 3cf55562be907eaaadacc9cdd5e452193458e4e6
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

<<<<<<< HEAD
      {/* --- Hero Section (Improved Text) --- */}
=======
      {/* --- Hero Section --- */}
>>>>>>> 3cf55562be907eaaadacc9cdd5e452193458e4e6
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
<<<<<<< HEAD
          From Chaos to Coordination
          <br />
          <span>AI-Powered Emergency Response</span>
=======
          Emergency Hospital <br />
          <span>Load Balancer</span>
>>>>>>> 3cf55562be907eaaadacc9cdd5e452193458e4e6
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
<<<<<<< HEAD
          Our agentic AI transforms city-wide hospital chaos into an intelligent, coordinated response during emergencies, ensuring every patient gets to the right place, at the right time.
=======
          Find the nearest hospital with available beds and the right specialization in critical moments. Smart routing for emergency care when every second counts.
>>>>>>> 3cf55562be907eaaadacc9cdd5e452193458e4e6
        </motion.p>
        <motion.div 
          className="hero-buttons"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <button className="primary-button" onClick={() => navigate('/incident')}>
<<<<<<< HEAD
            <span className="icon">📍</span> Activate Emergency Protocol
=======
            <span className="icon">📍</span> Find Emergency Care Now
>>>>>>> 3cf55562be907eaaadacc9cdd5e452193458e4e6
          </button>
        </motion.div>
      </div>

<<<<<<< HEAD
      {/* --- How It Works Section (New Animated Section) --- */}
      <div className="how-it-works-container">
        <AnimatedFeature
          icon="📡"
          title="Sense: The Digital Pulse"
          description="Our agent constantly monitors the entire hospital network, ingesting live data on bed occupancy, ICU availability, staff utilization, and incoming incident reports. It sees the complete picture in real-time."
          image={senseImage}
          imageSide="right"
        />
        <AnimatedFeature
          icon="🧠"
          title="Think: The Predictive Brain"
          description="This is where the magic happens. An XGBoost model predicts future surge and wait times, while our optimization algorithm calculates a unique 'Time-to-Treatment' score for every hospital. It doesn't just find the closest hospital—it finds the BEST one."
          image={thinkImage}
          imageSide="left"
        />
        <AnimatedFeature
          icon="⚡"
          title="Act: Coordinated Action Plan"
          description="Based on its analysis, the agent generates and dispatches a clear, actionable plan. It reroutes ambulances, sends alerts to hospitals to prepare ER teams, recommends resource mobilization, and even issues public advisories."
          image={actImage}
          imageSide="right"
        />
=======
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
>>>>>>> 3cf55562be907eaaadacc9cdd5e452193458e4e6
      </div>
    </motion.div>
  );
};

<<<<<<< HEAD
export default LandingPage;
=======
export default LandingPage;
>>>>>>> 3cf55562be907eaaadacc9cdd5e452193458e4e6
