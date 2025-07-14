const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// =============================
// AMBIL SEMUA USER
// =============================
exports.getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query('SELECT id, username, email, role FROM users');
    res.status(200).json(result);
  } catch (err) {
    console.error('Gagal ambil user:', err.message);
    res.status(500).json({ error: 'Gagal ambil data user' });
  }
};

// =============================
// GET USER BY USERNAME
// =============================
exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.query('SELECT id, username, email, role FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Gagal ambil user:', err.message);
    res.status(500).json({ error: 'Gagal ambil data user' });
  }
};

// =============================
// REGISTER USER BARU (dengan token)
// =============================
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    // Cek apakah username sudah ada
    const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Username sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke database
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']
    );

    const newUserId = result.insertId;

    // Buat token JWT
    const token = jwt.sign({ id: newUserId, username }, 'rahasia', { expiresIn: '1d' });

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUserId,
        username,
        email,
        role: 'user'
      }
    });
  } catch (err) {
    console.error('Gagal register:', err.message);
    res.status(500).json({ message: 'Terjadi kesalahan server saat registrasi' });
  }
};

// =============================
// LOGIN USER
// =============================
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'rahasia', { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Gagal login:', err.message);
    res.status(500).json({ message: 'Terjadi kesalahan server saat login' });
  }
};

// =============================
// UPDATE USER
// =============================
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  try {
    await db.query(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );
    res.status(200).json({ message: 'User berhasil diperbarui' });
  } catch (err) {
    console.error('Error update user:', err.message);
    res.status(500).json({ error: 'Gagal update user' });
  }
};

// =============================
// DELETE USER
// =============================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus user:', err.message);
    res.status(500).json({ error: 'Gagal hapus user' });
  }
};
