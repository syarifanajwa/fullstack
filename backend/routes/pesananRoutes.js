// routes/pesananRoutes.js
const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesananController');

// POST: Buat pesanan baru
router.post('/', pesananController.createPesanan);

// GET: Ambil semua pesanan berdasarkan nama pembeli
router.get('/user/:username', pesananController.getPesananByUsername);

// GET: Ambil detail pesanan berdasarkan ID (untuk pembayaran)
router.get('/id/:id', pesananController.getPesananById);

// POST: Simpan data pembayaran untuk pesanan tertentu
router.post('/pembayaran', pesananController.bayarPesanan); // Pastikan fungsi ini ada di controller

router.get('/report', pesananController.getAllTransaksi);
module.exports = router;
