import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../App';
import axios from 'axios';

const Login = () => {
  const { role } = useParams(); // Get the role from the URL (patient, doctor, pharmacist)
  const navigate = useNavigate(); // Hook for redirection after successful login

  const [loginIdentifier, setLoginIdentifier] = useState(''); // For username or UID
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${API_URL}/login/${role}`, {
        loginIdentifier, // Send loginIdentifier (username or UID)
        password,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
  
      if (response.data.message === 'Login successful') {
        setError(''); // Clear any previous error
  
        // Store the logged-in user's data in localStorage
        if (role === 'doctor') {
          localStorage.setItem('loggedInDoctor', JSON.stringify(response.data.user));
        } else if (role === 'patient') {
          localStorage.setItem('loggedInPatient', JSON.stringify(response.data.user));
        }
  
        navigate(`/dashboard/${role}`);
      } else {
        setError(response.data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10">Login as {role}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username or UID"
            value={loginIdentifier}
            onChange={(e) => setLoginIdentifier(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          New user?{' '}
          <Link to={`/register/${role}`} className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
