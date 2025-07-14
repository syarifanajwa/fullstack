// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuCard from '../components/MenuCard'; // pakai komponen baru

export default function Home() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then((res) => {
        setMenu(res.data);
      })
      .catch((err) => {
        console.error('Gagal mengambil data menu:', err);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Daftar Menu Homemade</h2>
      <div className="row">
        {menu.length === 0 ? (
          <p>Belum ada menu tersedia.</p>
        ) : (
          menu.map((item) => (
            <div className="col-md-6 col-lg-4 mb-4" key={item.id}>
              <MenuCard menu={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
