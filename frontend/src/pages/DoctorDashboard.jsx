import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from "../App";
import axios from 'axios';

const DoctorDashboard = () => {
  const [uid, setUid] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [diabetesPrescription, setDiabetesPrescription] = useState({
    medicine: '',
    quantity: '',
  });
  const [generalPrescription, setGeneralPrescription] = useState('');
  const [error, setError] = useState('');
  const [loggedInDoctor, setLoggedInDoctor] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve logged-in doctor data from localStorage
    const doctor = JSON.parse(localStorage.getItem('loggedInDoctor')) || {};
    console.log('Logged In Doctor:', doctor); 
    setLoggedInDoctor(doctor);
  }, []);

  // Fetch patient details by UID
  // Fetch patient details by UID
const fetchPatientDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/${uid}`);
    setPatientData(response.data);

    // Fetch prescriptions for the patient
    const prescriptionsResponse = await axios.get(`${API_URL}/prescriptions/${uid}`);
    setRecentPrescriptions(prescriptionsResponse.data);
    setError('');
  } catch (error) {
    setError('Patient not found. Please check the UID.');
    setPatientData(null);
    setRecentPrescriptions([]);
  }
};

// Save prescription to the backend
const savePrescription = async (type) => {
  if (
    !uid ||
    (type === 'diabetes' && (!diabetesPrescription.medicine || !diabetesPrescription.quantity || isNaN(diabetesPrescription.quantity))) ||
    (type === 'general' && !generalPrescription)
  ) {
    setError('Please complete the prescription details before saving.');
    return;
  }

  try {
    const newPrescription = {
      uid,
      type,
      medication: type === 'diabetes' ? diabetesPrescription.medicine : generalPrescription,
      quantity: type === 'diabetes' ? diabetesPrescription.quantity : null,
      doctor: loggedInDoctor.username || 'Unknown Doctor',
    };

    const response = await axios.post(`${API_URL}/prescription`, newPrescription);

    // Clear prescription inputs
    if (type === 'diabetes') setDiabetesPrescription({ medicine: '', quantity: '' });
    if (type === 'general') setGeneralPrescription('');

    // Refresh recent prescriptions
    setRecentPrescriptions([response.data, ...recentPrescriptions]);
    setError('');
  } catch (error) {
    setError('Failed to save prescription. Please try again.');
    console.error('Error saving prescription:', error);
  }
};
  return (
  <div className="bg-gray-50 min-h-screen p-8">
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Doctor Dashboard</h2>

      {/* UID Input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="uid">
          Enter Patient UID
        </label>
        <input
          type="text"
          id="uid"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchPatientDetails}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Fetch Details
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Patient Details */}
      {patientData && (
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Patient Details</h3>
          <p><strong className="text-gray-500">UID:</strong> {patientData.uid}</p>
          <p><strong className="text-gray-500">Name:</strong> {patientData.username}</p>
          <p><strong className="text-gray-500">Age:</strong> {patientData.age}</p>
          <p><strong className="text-gray-500">Gender:</strong> {patientData.gender}</p>
          <p><strong className="text-gray-500">Phone:</strong> {patientData.phone}</p>
        </div>
      )}

      {/* Recent Prescriptions */}
      {recentPrescriptions.length > 0 && (
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Prescriptions</h3>
          <ul className="space-y-4">
            {recentPrescriptions.map((prescription, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <p><strong className="text-gray-600">Type:</strong> {prescription.type}</p>
                {prescription.Metformin && (
                  <p><strong className="text-gray-600">Metformin:</strong> {prescription.Metformin}</p>
                )}
                {prescription.Glimepiride && (
                  <p><strong className="text-gray-600">Glimepiride:</strong> {prescription.Glimepiride}</p>
                )}
                {prescription.Vildagliptin && (
                  <p><strong className="text-gray-600">Vildagliptin:</strong> {prescription.Vildagliptin}</p>
                )}
                {prescription.Pioglitazone && (
                  <p><strong className="text-gray-600">Pioglitazone:</strong> {prescription.Pioglitazone}</p>
                )}
                {prescription.generalPrescription && (
                  <p><strong className="text-gray-600">General Prescription:</strong> {prescription.generalPrescription}</p>
                )}
                <p><strong className="text-gray-600">Date:</strong> {new Date(prescription.date).toLocaleString()}</p>
                <p><strong className="text-gray-600">Prescribed By:</strong> {prescription.doctor}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prescription Forms */}
      {patientData && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Add Prescription</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diabetes Prescription */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="diabetesMedicine">
                Diabetes Prescription
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Metformin */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Metformin</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={diabetesPrescription.Metformin}
                    onChange={(e) =>
                      setDiabetesPrescription((prev) => ({
                        ...prev,
                        Metformin: e.target.value,
                      }))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Glimepiride */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Glimepiride</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={diabetesPrescription.Glimepiride}
                    onChange={(e) =>
                      setDiabetesPrescription((prev) => ({
                        ...prev,
                        Glimepiride: e.target.value,
                      }))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Vildagliptin */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Vildagliptin</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={diabetesPrescription.Vildagliptin}
                    onChange={(e) =>
                      setDiabetesPrescription((prev) => ({
                        ...prev,
                        Vildagliptin: e.target.value,
                      }))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Pioglitazone */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Pioglitazone</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={diabetesPrescription.Pioglitazone}
                    onChange={(e) =>
                      setDiabetesPrescription((prev) => ({
                        ...prev,
                        Pioglitazone: e.target.value,
                      }))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => savePrescription('diabetes')}
                className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Save Diabetes Prescription
              </button>
            </div>

            {/* General Prescription */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="generalPrescription">
                General Prescription
              </label>
              <textarea
                id="generalPrescription"
                value={generalPrescription}
                onChange={(e) => setGeneralPrescription(e.target.value)}
                className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                onClick={() => savePrescription('general')}
                className="mt-4 px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
              >
                Save General Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};


export default DoctorDashboard;
