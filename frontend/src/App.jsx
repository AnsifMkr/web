import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PharmacistDashboard from './pages/PharmacistDashboard';
import image from './assets/pharmacy.jpeg';


// API base URL configuration
export const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: `url(${image})` }}>
              <h1 className="text-4xl font-bold text-white mb-8">Welcome to the Pharmacy Assistant</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/login/patient">
                  <button className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
                    Patient
                  </button>
                </Link>
                <Link to="/login/doctor">
                  <button className="px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition">
                    Doctor
                  </button>
                </Link>
                <Link to="/login/pharmacist">
                  <button className="px-6 py-4 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition">
                    Pharmacist
                  </button>
                </Link>
              </div>
            </div>
          }
        />
        
        {/* Authentication Routes */}
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard/pharmacist" element={<PharmacistDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
