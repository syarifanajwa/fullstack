// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // simpan di folder uploads/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Route
router.get('/', menuController.getAllMenu);
router.post('/', upload.single('gambar'), menuController.createMenu);
router.put('/:id', upload.single('gambar'), menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

module.exports = router;
