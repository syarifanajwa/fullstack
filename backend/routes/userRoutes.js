// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ====================================
// ROUTES UNTUK USER MANAGEMENT
// ====================================

// POST: Register user baru
router.post('/register', userController.registerUser);

// POST: Login user
router.post('/login', userController.loginUser);

// GET: Ambil semua user
router.get('/', userController.getAllUsers);

// GET: Ambil user berdasarkan username (untuk dashboard atau verifikasi login)
router.get('/username/:username', userController.getUserByUsername);

// PUT: Update data user by ID
router.put('/:id', userController.updateUser);

// DELETE: Hapus user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
