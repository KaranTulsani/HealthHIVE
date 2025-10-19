import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Component Imports
import LandingPage from './components/LandingPage/LandingPage.jsx';
import IncidentForm from './components/IncidentForm/IncidentForm.jsx';
import ResultsDisplay from './components/ResultsDisplay/ResultsDisplay.jsx';

// --- THIS IS THE FIX ---
// Use the environment variable for the API URL
const API_URL = import.meta.env.VITE_API_URL;
// Forcing a Vercel sync
// Container for animated routes
const AnimatedRoutes = () => {
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemStatus, setSystemStatus] = useState('offline'); // Default to offline
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the API_URL is defined. If not, we know it's a build issue.
    if (!API_URL) {
      console.error("VITE_API_URL is not defined! Make sure it's set in your .env file or Vercel settings.");
      setSystemStatus('offline');
      return;
    }
    
    axios.get(`${API_URL}/health`, { timeout: 10000 }) // Increased timeout for waking up server
      .then(() => setSystemStatus('operational'))
      .catch((err) => {
        console.error("Health check failed:", err);
        setSystemStatus('offline');
      });
  }, []);

  const handleGeneratePlan = async (formData) => {
    setIsLoading(true);
    setError('');
    setPlanData(null);
    navigate('/results'); // Navigate immediately to show the loading state

    try {
      const response = await axios.post(`${API_URL}/generate-plan`, formData, { timeout: 60000 }); // Longer timeout for plan generation
      setPlanData(response.data);
    } catch (err) {
      let errorMessage = 'Failed to generate plan. ';
      if (err.code === 'ECONNABORTED') errorMessage += 'The request timed out. The server might be waking up or busy.';
      else if (err.response) errorMessage += `Server error (${err.response.status}): ${err.response.data?.error || err.response.statusText}`;
      else if (err.request) errorMessage += 'Cannot connect to the backend server.';
      else errorMessage += `An unknown error occurred: ${err.message}`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBackToForm = () => {
    setPlanData(null);
    setError('');
    navigate('/incident');
  };
  
  const handleGoHome = () => {
    setPlanData(null);
    setError('');
    navigate('/');
  };


  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <LandingPage systemStatus={systemStatus} />
            </motion.div>
          } 
        />
        <Route 
          path="/incident" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <IncidentForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
            </motion.div>
          } 
        />
        <Route 
          path="/results" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ResultsDisplay data={planData} error={error} isLoading={isLoading} onGoBack={handleGoBackToForm} onGoHome={handleGoHome} />
            </motion.div>
          } 
        />
        <Route path="*" element={
          <motion.div className="page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1>404 - Page Not Found</h1>
              <p>Oops! The page you're looking for doesn't exist.</p>
              <button className="primary-button" onClick={() => navigate('/')}>Go to Home</button>
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;