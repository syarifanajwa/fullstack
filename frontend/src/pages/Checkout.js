// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Checkout() {
  const [menuList, setMenuList] = useState([]);
  const [nama, setNama] = useState('');
  const [menuId, setMenuId] = useState('');
  const [jumlah, setJumlah] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Coba ambil user dari localStorage
    try {
      const storedUser = localStorage.getItem('user');

      if (!storedUser || storedUser === 'undefined') {
        // Simpan tujuan redirect sebelum login
        localStorage.setItem('redirectAfterAuth', location.pathname + location.search);
        throw new Error('User belum login atau data rusak');
      }

      const user = JSON.parse(storedUser);

      if (!user.username) {
        localStorage.setItem('redirectAfterAuth', location.pathname + location.search);
        throw new Error('User tidak valid');
      }

      setNama(user.username); // Set nama dari user

    } catch (err) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    // Ambil menuId dari URL jika ada
    const params = new URLSearchParams(location.search);
    const menuIdFromUrl = params.get('menuId');
    if (menuIdFromUrl) {
      setMenuId(menuIdFromUrl);
    }

    // Ambil daftar menu dari API
    axios.get('http://localhost:5000/api/menu')
      .then((res) => {
        setMenuList(res.data);
      })
      .catch((err) => {
        console.error('Gagal ambil menu:', err);
        alert('Gagal ambil daftar menu');
      });

  }, [location.search, location.pathname, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedMenu = menuList.find(item => item.id === parseInt(menuId));
    if (!selectedMenu) return alert('Menu tidak ditemukan');

    const totalHarga = selectedMenu.harga * jumlah;
    const dataPesanan = {
      nama_pembeli: nama,
      menu_id: parseInt(menuId),
      jumlah: parseInt(jumlah),
      total_harga: totalHarga
    };

    try {
      const res = await axios.post('http://localhost:5000/api/pesanan', dataPesanan);
      const pesananId = res.data.id;
      alert('Pesanan berhasil dibuat!');
      navigate(`/pembayaran/${pesananId}`);
    } catch (err) {
      console.error('Error buat pesanan:', err.response?.data || err.message);
      alert('Gagal buat pesanan!');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Form Pemesanan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama Pembeli</label>
            <input
              type="text"
              className="form-control"
              value={nama}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Pilih Menu</label>
            <select
              className="form-select"
              value={menuId}
              onChange={(e) => setMenuId(e.target.value)}
              required
            >
              <option value="">-- Pilih Menu --</option>
              {menuList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} - Rp{item.harga}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Jumlah</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Buat Pesanan
          </button>
        </form>
      </div>
    </div>
  );
}
