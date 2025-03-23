const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Fetch prescriptions from localStorage
  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/prescriptions`);
      setPrescriptions(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch prescriptions. Please try again.");
      console.error("Error fetching prescriptions:", error);
    }
  };
  
  useEffect(() => {
    fetchPrescriptions();
  }, []);
  

  // Handle fulfilling a prescription (mark as fulfilled)
  const handleFulfillPrescription = async (prescriptionId) => {
    try {
      await axios.put(`${API_URL}/prescriptions/${prescriptionId}`, { fulfilled: true });
  
      // Refresh prescriptions list
      fetchPrescriptions();
      setError("");
    } catch (error) {
      setError("Failed to fulfill prescription. Please try again.");
      console.error("Error fulfilling prescription:", error);
    }
  };
  

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Pharmacist Dashboard</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Prescriptions Section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Prescriptions</h3>
          {prescriptions.length > 0 ? (
            <ul className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
                  <p><strong className="text-gray-600">Patient UID:</strong> {prescription.uid}</p>
                  <p><strong className="text-gray-600">Username:</strong> {prescription.username}</p>
                  <p><strong className="text-gray-600">Address:</strong> {prescription.address}</p>
                  <p><strong className="text-gray-600">Phone:</strong> {prescription.phone}</p>
                  <p><strong className="text-gray-600">Type:</strong> {prescription.type}</p>

                  {/* Display only medicines with entered quantities */}
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

                  <p><strong className="text-gray-600">Date:</strong> {prescription.date}</p>

                  {/* Fulfill Prescription Button */}
                  {!prescription.fulfilled && (
                    <button
                      onClick={() => handleFulfillPrescription(prescription.id)}
                      className="mt-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                      Fulfill Prescription
                    </button>
                  )}
                  {prescription.fulfilled && (
                    <p className="text-green-600 mt-2">Prescription Fulfilled</p>
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

export default PharmacistDashboard;
