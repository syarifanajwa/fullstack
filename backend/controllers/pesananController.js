const db = require('../config/database');

// POST: Buat pesanan baru
exports.createPesanan = async (req, res) => {
  try {
    const { nama_pembeli, menu_id, jumlah, total_harga } = req.body;

    if (!nama_pembeli || !menu_id || !jumlah || !total_harga) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    // Cek stok menu
    const [stokResult] = await db.query('SELECT stok FROM menu WHERE id = ?', [menu_id]);
    if (stokResult.length === 0) {
      return res.status(404).json({ error: 'Menu tidak ditemukan' });
    }

    const stokTersedia = stokResult[0].stok;
    if (jumlah > stokTersedia) {
      return res.status(400).json({ error: 'Stok tidak mencukupi' });
    }

    // Simpan pesanan
    const [insertResult] = await db.query(
      'INSERT INTO pesanan (nama_pembeli, menu_id, jumlah, total_harga) VALUES (?, ?, ?, ?)',
      [nama_pembeli, menu_id, jumlah, total_harga]
    );
    const pesananId = insertResult.insertId;

    // Update stok
    await db.query('UPDATE menu SET stok = stok - ? WHERE id = ?', [jumlah, menu_id]);

    res.status(201).json({
      message: 'Pesanan berhasil dikirim!',
      id: pesananId,
    });
  } catch (err) {
    console.error('Error simpan pesanan:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// GET: Ambil pesanan berdasarkan nama pembeli (untuk dashboard user)
exports.getPesananByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const [result] = await db.query(`
      SELECT 
        pesanan.id, 
        pesanan.nama_pembeli, 
        menu.nama AS nama_menu, 
        pesanan.jumlah, 
        pesanan.total_harga, 
        pesanan.created_at
      FROM pesanan 
      JOIN menu ON pesanan.menu_id = menu.id 
      WHERE pesanan.nama_pembeli = ?
    `, [username]);

    res.status(200).json(result);
  } catch (err) {
    console.error('Error ambil pesanan:', err.message);
    res.status(500).json({ error: 'Gagal mengambil data pesanan' });
  }
};

// GET: Ambil pesanan berdasarkan ID (untuk halaman pembayaran)
exports.getPesananById = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`
      SELECT 
        pesanan.id, 
        pesanan.nama_pembeli, 
        menu.nama AS nama_menu, 
        pesanan.jumlah, 
        pesanan.total_harga, 
        pesanan.created_at
      FROM pesanan
      JOIN menu ON pesanan.menu_id = menu.id
      WHERE pesanan.id = ?
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error('Error ambil detail pesanan:', err.message);
    res.status(500).json({ error: 'Gagal mengambil detail pesanan' });
  }
};
// GET: Report semua transaksi (untuk admin)
exports.getAllTransaksi = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        pesanan.id, 
        pesanan.nama_pembeli, 
        menu.nama AS nama_menu, 
        pesanan.jumlah, 
        pesanan.total_harga, 
        pesanan.created_at
      FROM pesanan
      JOIN menu ON pesanan.menu_id = menu.id
      ORDER BY pesanan.created_at DESC
    `);

    res.status(200).json(result); // ✅ kirim hasil
  } catch (err) {
    console.error('Error ambil laporan transaksi:', err.message);
    res.status(500).json({ error: 'Gagal mengambil laporan transaksi' });
  }
};

// POST: Simpan data pembayaran
exports.bayarPesanan = async (req, res) => {
  try {
    const { pesanan_id, metode, total_bayar } = req.body;

    if (!pesanan_id || !metode || !total_bayar) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    await db.query(
      'INSERT INTO pembayaran (pesanan_id, metode, total_bayar) VALUES (?, ?, ?)',
      [pesanan_id, metode, total_bayar]
    );

    res.status(201).json({ message: 'Pembayaran berhasil disimpan!' });
  } catch (err) {
    console.error('Error simpan pembayaran:', err.message);
    res.status(500).json({ error: 'Gagal menyimpan data pembayaran' });
  }
};
