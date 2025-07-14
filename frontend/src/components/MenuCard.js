import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MenuCard({ menu }) {
  const navigate = useNavigate();

  const gambarSrc = menu.gambar_url
  ? `http://localhost:5000/${menu.gambar_url}`
  : 'https://via.placeholder.com/400x250?text=No+Image';



  const handleBeli = () => {
  const user = localStorage.getItem('user');

  if (!user) {
    // Simpan tujuan awal ke localStorage
    localStorage.setItem('redirectAfterAuth', `/checkout?menuId=${menu.id}`);

    alert('Silakan daftar/login terlebih dahulu!');
    navigate('/register');
  } else {
    navigate(`/checkout?menuId=${menu.id}`);
  }
};


  return (
    <div className="card h-100 shadow-sm">
      <img
        src={gambarSrc}
        className="card-img-top"
        alt={menu.nama}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{menu.nama}</h5>
        <p className="card-text">{menu.deskripsi || '-'}</p>
        <p className="card-text"><strong>Harga:</strong> Rp{menu.harga}</p>
        <p className="card-text"><strong>Stok:</strong> {menu.stok}</p>
        <button
          className={`btn mt-auto ${menu.stok > 0 ? 'btn-success' : 'btn-secondary'}`}
          onClick={handleBeli}
          disabled={menu.stok <= 0}
        >
          {menu.stok > 0 ? 'Beli Sekarang' : 'Stok Habis'}
        </button>
      </div>
    </div>
  );
}
