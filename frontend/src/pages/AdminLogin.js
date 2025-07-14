import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      if (res.data.user.role !== 'admin') {
        setError('Akses ditolak. Hanya admin yang dapat masuk.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Username atau password salah');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Login Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Masukkan username"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Masukkan password"
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-success w-100">Login</button>
        </form>
      </div>
    </div>
  );
}