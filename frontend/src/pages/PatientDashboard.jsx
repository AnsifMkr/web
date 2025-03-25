import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../App'; // Ensure API_URL is correctly set

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  const loggedInPatient = JSON.parse(localStorage.getItem('loggedInPatient'));

  useEffect(() => {
    const fetchPatientData = async (patientUID) => {
      try {
        const response = await fetch(`${API_URL}/dashboard/patient?uid=${patientUID}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent if using HTTP-only auth
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const data = await response.json();
        setPatientData(data.patient);
        setPrescriptions(data.prescriptions || []);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        navigate('/register/patient'); // Redirect if no patient data
      }
    };

    fetchPatientData(loggedInPatient.uid);

  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Patient Dashboard</h2>

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
          <p className="text-gray-600">No personal details available. Please register first.</p>
        )}

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Prescriptions</h3>
          {prescriptions.length > 0 ? (
            <ul className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
                  <p><strong className="text-gray-600">Doctor:</strong> {prescription.doctor}</p>
                  <p><strong className="text-gray-600">Date:</strong> {new Date(prescription.date).toLocaleString()}</p>
                  {prescription.type === 'diabetes' && (
                    <div className="mt-2">
                      <p className="text-gray-600 font-medium">Diabetes Medications:</p>
                      <ul className="list-disc list-inside">
                        {prescription.Metformin && <li><strong>Metformin:</strong> {prescription.Metformin}</li>}
                        {prescription.Glimepiride && <li><strong>Glimepiride:</strong> {prescription.Glimepiride}</li>}
                        {prescription.Vildagliptin && <li><strong>Vildagliptin:</strong> {prescription.Vildagliptin}</li>}
                        {prescription.Pioglitazone && <li><strong>Pioglitazone:</strong> {prescription.Pioglitazone}</li>}
                      </ul>
                    </div>
                  )}
                  {prescription.type === 'general' && (
                    <div className="mt-2">
                      <p className="text-gray-600 font-medium">General Prescription:</p>
                      <p>{prescription.generalPrescription}</p>
                    </div>
                  )}
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
