import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import API_URL from '../App';


  const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPatientData = async () => {
    setLoading(true);
    setError('');
  
    try {
      const loggedInPatient = JSON.parse(localStorage.getItem('loggedInPatient'));
  
      if (!loggedInPatient || !loggedInPatient.uid) {
        navigate("/login/patient");
        return;
      }
  
      // Fetch patient details
      const patientResponse = await axios.get(`${API_URL}/user/${loggedInPatient.uid}`);
      setPatientData(patientResponse.data);
  
      // Fetch patient prescriptions
      const prescriptionsResponse = await axios.get(`${API_URL}/prescriptions/${loggedInPatient.uid}`);
      setPrescriptions(prescriptionsResponse.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to fetch patient data. Please try again later.');
      }
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  };
  const updateDashboard = async () => {
    try {
      setLoading(true);
      const loggedInPatientUID = JSON.parse(localStorage.getItem('loggedInPatient'))?.uid;
      const response = await axios.get(`http://localhost:5000/user/${loggedInPatientUID}`);
      const patient = response.data;
      setPatientData(patient);

      const prescriptionsResponse = await axios.get(`http://localhost:5000/prescriptions/${loggedInPatientUID}`);
      setPrescriptions(prescriptionsResponse.data);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();

    // Listen for storage updates
    const handleStorageUpdate = () => fetchPatientData();
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Patient Dashboard</h2>
        <button
          onClick={updateDashboard}
          className="mb-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Update Dashboard
        </button>

        {/* Personal Details Section */}
        {patientData ? (
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Personal Details</h3>
            <div className="space-y-2">
              <p><strong className="text-gray-500">UID:</strong> {patientData.uid}</p>
              <p><strong className="text-gray-500">Username:</strong> {patientData.username}</p>
              <p><strong className="text-gray-500">Age:</strong> {patientData.age}</p>
              <p><strong className="text-gray-500">Gender:</strong> {patientData.gender}</p>
              <p><strong className="text-gray-500">Address:</strong> {patientData.address}</p>
              <p><strong className="text-gray-500">Phone:</strong> {patientData.phone}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No personal details available. Please <a href="/register/patient" className="text-blue-500">register</a>.</p>
        )}

        {/* Prescriptions Section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Prescriptions</h3>
          {prescriptions.length > 0 ? (
            <ul className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
                  <p><strong className="text-gray-600">Doctor:</strong> {prescription.doctor}</p>
                  <p><strong className="text-gray-600">Medication:</strong> {prescription.medication || 'Details not available'}</p>
                  <p><strong className="text-gray-600">Date:</strong> {format(new Date(prescription.date), 'MMM dd, yyyy')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No prescriptions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;