import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
    gambar: null
  });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState('');

  const fetchData = () => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setMenuList(res.data))
      .catch(err => console.error('Gagal ambil menu:', err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'gambar') {
      setForm(prev => ({ ...prev, gambar: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/menu', formData);
      alert('Menu berhasil ditambahkan');
      setForm({ nama: '', deskripsi: '', harga: '', stok: '', gambar: null });
      setPreview('');
      fetchData();
      window.bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    } catch (err) {
      console.error('Gagal tambah menu:', err);
      alert('Gagal tambah menu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus menu ini?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      alert('Menu berhasil dihapus');
      fetchData();
    } catch (err) {
      console.error('Gagal hapus menu:', err);
      alert('Gagal hapus menu');
    }
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setForm({
      nama: item.nama,
      deskripsi: item.deskripsi || '',
      harga: item.harga,
      stok: item.stok,
      gambar: null
    });
    setPreview(item.gambar_url ? `http://localhost:5000/${item.gambar_url}` : '');
    const modal = new window.bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('deskripsi', form.deskripsi);
    formData.append('harga', form.harga);
    formData.append('stok', form.stok);
    if (form.gambar) {
      formData.append('gambar', form.gambar);
    }

    try {
      await axios.put(`http://localhost:5000/api/menu/${editId}`, formData);
      alert('Menu berhasil diperbarui');
      setEditId(null);
      setForm({ nama: '', deskripsi: '', harga: '', stok: '', gambar: null });
      setPreview('');
      fetchData();
      window.bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    } catch (err) {
      console.error('Gagal update menu:', err);
      alert('Gagal update menu');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Dashboard Admin</h2>
      <button className="btn btn-success mb-3" onClick={() => navigate('/admin/report')}>
        Report Transaksi
      </button>
      <button className="btn btn-primary mb-3 ms-2" data-bs-toggle="modal" data-bs-target="#addModal">+ Tambah Menu</button>

<button className="btn btn-info mb-3 ms-2" onClick={() => navigate('/admin/users')}>
  Manajemen User
</button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menuList.map(item => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.gambar_url ? `http://localhost:5000/${item.gambar_url}` : 'https://via.placeholder.com/100'}
                  alt={item.nama}
                  width="100"
                  height="70"
                  style={{ objectFit: 'cover' }}
                />
              </td>
              <td>{item.nama}</td>
              <td>Rp {item.harga}</td>
              <td>{item.stok}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Menu</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input type="text" className="form-control mb-2" name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" required />
              <textarea className="form-control mb-2" name="deskripsi" value={form.deskripsi} onChange={handleChange} placeholder="Deskripsi" />
              <input type="number" className="form-control mb-2" name="harga" value={form.harga} onChange={handleChange} placeholder="Harga" required />
              <input type="number" className="form-control mb-2" name="stok" value={form.stok} onChange={handleChange} placeholder="Stok" required />
              <input type="file" className="form-control" name="gambar" onChange={handleChange} accept="image/*" />
              {preview && <img src={preview} alt="Preview" className="mt-2" width="150" style={{ objectFit: 'cover' }} />}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
              <button type="submit" className="btn btn-success">Simpan</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Edit */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleEditSubmit} encType="multipart/form-data">
            <div className="modal-header">
              <h5 className="modal-title">Edit Menu</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input type="text" className="form-control mb-2" name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" required />
              <textarea className="form-control mb-2" name="deskripsi" value={form.deskripsi} onChange={handleChange} placeholder="Deskripsi" />
              <input type="number" className="form-control mb-2" name="harga" value={form.harga} onChange={handleChange} placeholder="Harga" required />
              <input type="number" className="form-control mb-2" name="stok" value={form.stok} onChange={handleChange} placeholder="Stok" required />
              <input type="file" className="form-control" name="gambar" onChange={handleChange} accept="image/*" />
              {preview && <img src={preview} alt="Preview" className="mt-2" width="150" style={{ objectFit: 'cover' }} />}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
              <button type="submit" className="btn btn-warning">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
