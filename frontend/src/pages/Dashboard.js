// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pesanan, setPesanan] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('Silakan login terlebih dahulu.');
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    axios.get(`http://localhost:5000/api/pesanan/user/${userData.username}`)
      .then((res) => {
        setPesanan(res.data);
      })
      .catch((err) => {
        console.error('Gagal ambil pesanan:', err);
        alert('Gagal ambil riwayat pesanan!');
      });
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="container mt-5">
      <h3 className="mb-3">Selamat datang, {user.username}!</h3>
      <p>Email: {user.email}</p>

      <hr />

      <h4 className="mt-4">Riwayat Pesanan</h4>
      {pesanan.length === 0 ? (
        <p>Belum ada pesanan.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Menu</th>
              <th>Jumlah</th>
              <th>Total Harga</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {pesanan.map((item, index) => {
              const tanggalValid = item.created_at
                ? new Date(item.created_at).toLocaleString('id-ID')
                : '-';
              return (
                <tr key={index}>
                  <td>{item.nama_menu}</td>
                  <td>{item.jumlah}</td>
                  <td>Rp{item.total_harga}</td>
                  <td>{tanggalValid}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
