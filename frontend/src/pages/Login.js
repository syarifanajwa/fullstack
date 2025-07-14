import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Username dan password wajib diisi!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      // Simpan ke localStorage jika user ditemukan
      if (!res.data.user) {
        alert("Login gagal: Data user tidak ditemukan");
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert('Login berhasil!');

      // Ambil tujuan redirect (jika ada)
      const redirect = localStorage.getItem('redirectAfterAuth');
      localStorage.removeItem('redirectAfterAuth');

      // Redirect ke tujuan sebelumnya atau ke dashboard
      if (redirect && redirect.startsWith('/')) {
        navigate(redirect);
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error('Error login:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Gagal login. Cek username/password');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <h2 className="mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
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
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
