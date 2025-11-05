import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import itbFoto from '../assets/itb-foto.png';
import logoITBputih from '../assets/itb-logo-putih.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Login:', form);
      setIsLoading(false);
      // navigate('/dashboard');
    }, 1000);
  }

  return (
    <div className="login-root">
      <div className="login-left">
        <img src={itbFoto} alt="ITB" className="left-image" />
        <div className="image-overlay"></div>
      </div>

      <div className="login-right">
        <img src={logoITBputih} alt="ITB Logo" className="logo-itb-white" />

        <form className="login-box" onSubmit={handleSubmit} aria-labelledby="login-title">
          <h1 id="login-title">Login</h1>

          <label className="field">
            <span>NIM</span>
            <input 
              type="text" 
              name="nim" 
              value={form.nim}
              onChange={handleChange}
              placeholder="Masukkan NIM" 
              required 
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input 
              type="password" 
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan Password" 
              required 
            />
          </label>

          <button 
            className={`btn-login ${isLoading ? 'loading' : ''}`} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>

          <p className="register-link">
            Belum punya akun? <button type="button" onClick={() => navigate('/register')}>Daftar di sini</button>
          </p>
        </form>
      </div>
    </div>
  );
}