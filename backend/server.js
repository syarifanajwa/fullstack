const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database'); // koneksi db
const path = require('path');
// Import semua routes
const menuRoutes = require('./routes/menuRoutes');
const pesananRoutes = require('./routes/pesananRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(cors());
app.use(express.json());

// Routing utama
app.use('/api/menu', menuRoutes);
app.use('/api/pesanan', pesananRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cek koneksi MySQL saat server dinyalakan
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('MySQL connected!');
    connection.release();
  } catch (err) {
    console.error('MySQL connection error:', err.message);
  }
})();

// Middleware 404 - endpoint tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
