import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: '' });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error(err);
        alert('Gagal ambil data user');
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Yakin hapus user ini?')) return;

    axios.delete(`http://localhost:5000/api/users/${id}`)
      .then(() => {
        alert('User berhasil dihapus');
        fetchUsers();
      })
      .catch(err => {
        console.error(err);
        alert('Gagal hapus user');
      });
  };

  const openEditModal = (user) => {
    setEditId(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role
    });
    const modal = new window.bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:5000/api/users/${editId}`, editForm)
      .then(() => {
        alert('User berhasil diperbarui');
        fetchUsers();
        window.bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
      })
      .catch(err => {
        console.error(err);
        alert('Gagal update user');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Manajemen User</h2>

      {/* Tombol Navigasi */}
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={() => navigate('/admin/report')}>
          Report Transaksi
        </button>
        <button className="btn btn-primary me-2" onClick={() => navigate('/admin')}>
          + Tambah Menu
        </button>
        <button className="btn btn-info" onClick={() => navigate('/admin/users')}>
          Manajemen User
        </button>
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">Belum ada user</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(user)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Hapus</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Edit User */}
      <div className="modal fade" id="editUserModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleEditSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                placeholder="Username"
                required
              />
              <input
                type="email"
                className="form-control mb-2"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Email"
                required
              />
              <select
                className="form-control"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
              <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
