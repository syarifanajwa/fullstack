import React from 'react';

export default function MenuList({ menu }) {
  return (
    <div>
      {menu.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{item.nama}</h3>
          <p>{item.deskripsi}</p>
          <p><strong>Harga:</strong> Rp {item.harga}</p>
          <p><strong>Stok:</strong> {item.stok}</p>
        </div>
      ))}
    </div>
  );
}
