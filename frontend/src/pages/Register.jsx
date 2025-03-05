import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API_URL from "../App";
import axios from 'axios';

const Register = () => {
  const { role } = useParams(); // Get the role from URL params (e.g., patient, doctor, pharmacist)
  const navigate = useNavigate(); // Hook for navigation after successful registration

  const [formData, setFormData] = useState({
    username: '',
    age: '',
    gender: '',
    address: '',
    phone: '',
    password: '',
    confirmPassword: '',
    uid: '', // To store the generated UID
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // To show a loading indicator during registration

  // Generate a random UID for the user
  const generateUID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Uppercase letters and digits
    let uid = '';
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uid += characters.charAt(randomIndex);
    }
    return uid;
  };

  useEffect(() => {
    // Generate UID when the component mounts
    const generatedUID = generateUID();
    setFormData((prevData) => ({
      ...prevData,
      uid: generatedUID, // Set generated UID to formData
    }));
  }, []);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsSubmitting(true);
  
    // Validate password and confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsSubmitting(false);
      return;
    }
  
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }
  
    // Validate that all fields are filled
    if (!formData.username || !formData.age || !formData.gender || !formData.address || !formData.phone) {
      setError('Please fill all the fields.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Send registration data to the backend API
      const userData = {
        username: formData.username,
        password: formData.password,
        role: "patient",
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone,
        uid: formData.uid,
      };
      const API_URL = "https://web-backend.vercel.app";
      console.log("hai");
      const response = await axios.post(`${API_URL}/register/${userData.role}/`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // After successful registration, redirect to login
      setError('');
      setIsSubmitting(false);
      navigate(`/login/${role}`);
    } catch (error) {
      setIsSubmitting(false);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10">Register as {role}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display UID */}
          <div>
            <p className="text-base font-semibold text-red-500">Your UID: {formData.uid}</p>
          </div>

          {/* Username Input */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Age Input */}
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Gender Select */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Address Input */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Phone Number Input */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Confirm Password Input */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Display error message if there is any */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            disabled={isSubmitting} // Disable the button when submitting
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={`/login/${role}`} className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
