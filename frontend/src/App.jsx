import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Component Imports
import LandingPage from './components/LandingPage/LandingPage.jsx';
import IncidentForm from './components/IncidentForm/IncidentForm.jsx';
import ResultsDisplay from './components/ResultsDisplay/ResultsDisplay.jsx';

// Use the environment variable for the API URL
const API_URL = import.meta.env.VITE_API_URL;

// Container for animated routes
const AnimatedRoutes = () => {
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemStatus, setSystemStatus] = useState('offline'); // Default to offline
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!API_URL) {
      console.error("VITE_API_URL is not defined!");
      setSystemStatus('offline');
      return;
    }
    axios.get(`${API_URL}/health`, { timeout: 10000 })
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
    navigate('/results'); 

    try {
      const response = await axios.post(`${API_URL}/generate-plan`, formData, { timeout: 60000 });
      setPlanData(response.data);
    } catch (err) {
      let errorMessage = 'Failed to generate plan. ';
      if (err.code === 'ECONNABORTED') errorMessage += 'The request timed out.';
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
        <Route path="/" element={<LandingPage systemStatus={systemStatus} />} />
        <Route path="/incident" element={<IncidentForm onSubmit={handleGeneratePlan} isLoading={isLoading} />} />
        <Route path="/results" element={<ResultsDisplay data={planData} error={error} isLoading={isLoading} onGoBack={handleGoBackToForm} onGoHome={handleGoHome} />} />
        <Route path="*" element={
          <div className="page-container">
              <h1>404 - Page Not Found</h1>
              <button className="primary-button" onClick={() => navigate('/')}>Go to Home</button>
          </div>
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