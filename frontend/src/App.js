import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Pembayaran from './pages/Pembayaran'; 
import UserManagement from './pages/UserManagement';
import ReportTransaksi from './pages/ReportTransaksi';
import AdminLogin from './pages/AdminLogin';

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'admin') {
    return <AdminLogin />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Hanya admin yang bisa akses */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        
        <Route path="/pembayaran/:pesananId" element={<Pembayaran />} />
        <Route path="/admin/users" element={<RequireAdmin><UserManagement /></RequireAdmin>} />
        <Route path="/admin/report" element={<RequireAdmin><ReportTransaksi /></RequireAdmin>} />
        
        {/* Login khusus admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;