import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Gagal parse user:", e);
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">DapoerRasa</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link">Beranda</Link>
            </li>

            {user?.role !== 'admin' && (
              <li className="nav-item">
                <Link to="/checkout" className="nav-link">Pesan</Link>
              </li>
            )}

            {!user ? (
              <>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Daftar</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin-login" className="btn btn-sm btn-light ms-2">Admin</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">Hai, {user.username}</span>
                </li>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link to="/admin" className="btn btn-sm btn-light ms-2 mb-2">Admin</Link>
                  </li>
                )}

                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-danger btn-sm ms-2">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
