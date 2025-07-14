// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert('Semua field wajib diisi!');
      return;
    }

    try {
      // Kirim data ke backend untuk register
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      // Setelah berhasil register, langsung login otomatis
      const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));

      alert('Registrasi dan login berhasil!');
      navigate('/checkout');

    } catch (err) {
      console.error('Error register:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Gagal daftar. Coba lagi.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Daftar Akun</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}
