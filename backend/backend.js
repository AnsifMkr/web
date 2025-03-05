const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// Enhanced CORS configuration
const corsOptions = {
  origin: '*', // In production, replace with your frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB connection
const MONGO_URI = 'mongodb+srv://apasproject2025:vZV3SFgEnQ9e73wK@cluster0.mhaam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'pharmacist'], required: true },
  age: Number,
  gender: String,
  address: String,
  phone: String,
  uid: { type: String, unique: true, required: true },
});

const User = mongoose.model('User', userSchema);

// Prescription Schema and Model
const prescriptionSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  type: { type: String, enum: ['diabetes', 'general'], required: true },
  Metformin: { type: Number, default: null }, // Quantity for Metformin
  Glimepiride: { type: Number, default: null }, // Quantity for Glimepiride
  Vildagliptin: { type: Number, default: null }, // Quantity for Vildagliptin
  Pioglitazone: { type: Number, default: null }, // Quantity for Pioglitazone
  generalPrescription: { type: String, default: null }, // General prescription text
  doctor: { type: String, required: true },
  date: { type: Date, default: Date.now },
  fulfilled: { type: Boolean, default: false },
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

// API Routes
app.post('/register/:role', async (req, res) => {
  try {
    const { username, password, role, age, gender, address, phone, uid } = req.body;
    const urlRole = req.params.role;

    // Log registration attempt
    console.log('Registration attempt:', { username, role, urlRole });

    // Check if all required fields are present
    if (!username || !password || !role || !uid) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['username', 'password', 'role', 'uid'],
        received: Object.keys(req.body)
      });
    }

    // Validate if role matches the URL parameter
    if (role !== urlRole) {
      return res.status(400).json({ 
        error: 'Role mismatch between URL and body',
        urlRole,
        bodyRole: role
      });
    }

    // Validate if role is valid
    if (!['patient', 'doctor', 'pharmacist'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        validRoles: ['patient', 'doctor', 'pharmacist'],
        receivedRole: role
      });
    }

    // Validate UID format (assuming it should be 16 characters)
    if (!/^[A-Z0-9]{16}$/.test(uid)) {
      return res.status(400).json({ 
        error: 'Invalid UID format',
        message: 'UID must be 16 characters long and contain only uppercase letters and numbers'
      });
    }

    // Check if UID already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ error: 'UID already exists' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      age,
      gender,
      address,
      phone,
      uid,
    });

    await newUser.save();
    console.log('User registered successfully:', { username, role, uid });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err.message, err.stack);
    res.status(400).json({ 
      error: 'An error occurred during registration',
      message: err.message
    });
  }
});

app.post('/login/:role', async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body; // loginIdentifier can be username or UID
    const role = req.params.role;

    // Check if loginIdentifier is a UID (16-character alphanumeric)
    const isUID = /^[A-Z0-9]{16}$/.test(loginIdentifier);

    let user;
    if (isUID) {
      // If loginIdentifier is a UID, search by UID
      user = await User.findOne({ uid: loginIdentifier });
    } else {
      // If loginIdentifier is a username, search by username and role
      user = await User.findOne({ username: loginIdentifier, role });
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(400).json({ error: 'An error occurred during login. Please try again.' });
  }
}); 

app.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'An error occurred while fetching user details. Please try again.' });
  }
});

app.post('/prescription', async (req, res) => {
  try {
    const { uid, type, Metformin, Glimepiride, Vildagliptin, Pioglitazone, generalPrescription, doctor } = req.body;

    // Validate required fields
    if (!uid || !type || !doctor) {
      return res.status(400).json({ error: 'Missing required fields: uid, type, or doctor.' });
    }

    // Create a new prescription
    const newPrescription = new Prescription({
      uid,
      type,
      Metformin: Metformin || null,
      Glimepiride: Glimepiride || null,
      Vildagliptin: Vildagliptin || null,
      Pioglitazone: Pioglitazone || null,
      generalPrescription: generalPrescription || null,
      doctor,
    });

    await newPrescription.save();
    res.status(201).json({ message: 'Prescription added successfully', prescription: newPrescription });
  } catch (err) {
    res.status(400).json({ error: 'An error occurred while adding the prescription. Please try again.' });
  }
});


app.get('/prescriptions/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const prescriptions = await Prescription.find({ uid });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: 'An error occurred while fetching prescriptions. Please try again.' });
  }
});

app.get('/pharmacist/prescriptions', async (req, res) => {
  try {
    const { uid, doctor } = req.query;
    const filters = {};
    if (uid) filters.uid = uid;
    if (doctor) filters.doctor = doctor;
    const prescriptions = await Prescription.find(filters);
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: 'An error occurred while fetching prescriptions. Please try again.' });
  }
});

app.patch('/pharmacist/prescription/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      { fulfilled: true },
      { new: true }
    );
    if (!updatedPrescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json({ message: 'Prescription marked as fulfilled', prescription: updatedPrescription });
  } catch (err) {
    res.status(400).json({ error: 'An error occurred while updating the prescription. Please try again.' });
  }
});

app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'API is working',
    database: dbStatus,
    endpoints: {
      register: '/register/:role',
      login: '/login/:role',
      user: '/user/:uid',
      prescriptions: '/prescriptions/:uid'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// module.exports = app;
