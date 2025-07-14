// controllers/menuController.js
const db = require('../config/database');
const path = require('path');

// GET semua menu
exports.getAllMenu = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu');
    
    // Tambahkan base URL untuk gambar
    const menusWithUrl = rows.map(item => ({
      ...item,
      gambar_url: item.gambar_url ? `uploads/${item.gambar_url}` : null
    }));

    res.json(menusWithUrl);
  } catch (err) {
    console.error(' Error ambil data menu:', err.message);
    res.status(500).json({ error: 'Gagal mengambil data menu' });
  }
};

// POST: Tambah menu dengan gambar
exports.createMenu = async (req, res) => {
  try {
    const { nama, deskripsi = '', harga, stok } = req.body;
    const gambar_url = req.file ? req.file.filename : null;

    if (!nama || !harga || !stok || !gambar_url) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const query = `
      INSERT INTO menu (nama, deskripsi, harga, stok, gambar_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [nama, deskripsi, harga, stok, gambar_url]);

    res.status(201).json({ message: ' Menu berhasil ditambahkan' });
  } catch (err) {
    console.error('Error tambah menu:', err.message);
    res.status(500).json({ error: 'Gagal tambah menu' });
  }
};

// PUT: Update menu by ID (dengan opsi update gambar)
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi = '', harga, stok } = req.body;
    const gambar_url = req.file ? req.file.filename : null;

    if (!nama || !harga || !stok) {
      return res.status(400).json({ error: 'Field nama, harga, dan stok wajib diisi' });
    }

    let query, values;

    if (gambar_url) {
      query = `
        UPDATE menu
        SET nama = ?, deskripsi = ?, harga = ?, stok = ?, gambar_url = ?
        WHERE id = ?
      `;
      values = [nama, deskripsi, harga, stok, gambar_url, id];
    } else {
      query = `
        UPDATE menu
        SET nama = ?, deskripsi = ?, harga = ?, stok = ?
        WHERE id = ?
      `;
      values = [nama, deskripsi, harga, stok, id];
    }

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu tidak ditemukan' });
    }

    res.json({ message: 'Menu berhasil diperbarui' });
  } catch (err) {
    console.error(' Error update menu:', err.message);
    res.status(500).json({ error: 'Gagal update menu' });
  }
};

// DELETE: Hapus menu by ID
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM menu WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu tidak ditemukan' });
    }

    res.json({ message: 'Menu berhasil dihapus' });
  } catch (err) {
    console.error(' Error hapus menu:', err.message);
    res.status(500).json({ error: 'Gagal hapus menu' });
  }
};
