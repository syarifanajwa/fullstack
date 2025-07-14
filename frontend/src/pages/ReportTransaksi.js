import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ReportTransaksi() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/pesanan/report')
      .then(res => setTransaksi(res.data))
      .catch(err => {
        console.error(err);
        alert('Gagal mengambil laporan transaksi');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Laporan Transaksi</h2>

      {/* Tombol Navigasi */}
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={() => navigate('/admin/report')}>
          Report Transaksi
        </button>
        <button className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#addModal" onClick={() => navigate('/admin')}>
          + Tambah Menu
        </button>
        <button className="btn btn-info" onClick={() => navigate('/admin/users')}>
          Manajemen User
        </button>
      </div>

      {/* Tabel Transaksi */}
      {loading ? (
        <p>Sedang memuat data...</p>
      ) : transaksi.length === 0 ? (
        <p>Tidak ada transaksi yang ditemukan.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nama Pembeli</th>
              <th>Menu</th>
              <th>Jumlah</th>
              <th>Total Harga</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {transaksi.map(trx => (
              <tr key={trx.id}>
                <td>{trx.id}</td>
                <td>{trx.nama_pembeli}</td>
                <td>{trx.nama_menu}</td>
                <td>{trx.jumlah}</td>
                <td>Rp{trx.total_harga}</td>
                <td>{new Date(trx.created_at).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
