// API Configuration
export const API_BASE_URL = 'https://web-backend.vercel.app';

// API Endpoints
export const ENDPOINTS = {
  register: (role) => `${API_BASE_URL}/register/${role}`,
  login: (role) => `${API_BASE_URL}/login/${role}`,
  user: (uid) => `${API_BASE_URL}/user/${uid}`,
  prescriptions: (uid) => `${API_BASE_URL}/prescriptions/${uid}`,
  pharmacistPrescriptions: `${API_BASE_URL}/pharmacist/prescriptions`,
  updatePrescription: (id) => `${API_BASE_URL}/pharmacist/prescription/${id}`,
};

// API Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Example API call function
export const makeAPICall = async (url, method = 'GET', body = null) => {
  try {
    const response = await fetch(url, {
      method,
      headers: DEFAULT_HEADERS,
      body: body ? JSON.stringify(body) : null,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 