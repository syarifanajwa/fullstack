import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Pembayaran() {
  const { pesananId } = useParams();
  const navigate = useNavigate();

  const [metode, setMetode] = useState('');
  const [totalBayar, setTotalBayar] = useState('');
  const [pesanan, setPesanan] = useState(null);

  // Ambil detail pesanan berdasarkan ID dari URL
  useEffect(() => {
    axios.get(`http://localhost:5000/api/pesanan/id/${pesananId}`)
      .then((res) => {
        setPesanan(res.data);
        setTotalBayar(res.data.total_harga); // Set total bayar otomatis
      })
      .catch((err) => {
        console.error('Gagal ambil data pesanan:', err);
        alert('Gagal mengambil data pesanan');
      });
  }, [pesananId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      pesanan_id: parseInt(pesananId),
      metode: metode,
      total_bayar: parseInt(totalBayar),
    };

    try {
      await axios.post('http://localhost:5000/api/pesanan/pembayaran', data);
      alert('Pembayaran berhasil!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error pembayaran:', err.response?.data || err.message);
      alert('Gagal menyimpan pembayaran');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Form Pembayaran</h2>

        {pesanan ? (
          <>
            <p><strong>Nama:</strong> {pesanan.nama_pembeli}</p>
            <p><strong>Menu:</strong> {pesanan.nama_menu}</p>
            <p><strong>Total Harga:</strong> Rp{pesanan.total_harga}</p>
          </>
        ) : (
          <p>Loading data pesanan...</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Metode Pembayaran</label>
            <select
              className="form-select"
              value={metode}
              onChange={(e) => setMetode(e.target.value)}
              required
            >
              <option value="">-- Pilih Metode --</option>
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="QRIS">QRIS</option>
              <option value="COD">COD</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Total Bayar</label>
            <input
              type="number"
              className="form-control"
              value={totalBayar}
              onChange={(e) => setTotalBayar(e.target.value)}
              required
              readOnly // Tidak bisa diedit manual
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Bayar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
