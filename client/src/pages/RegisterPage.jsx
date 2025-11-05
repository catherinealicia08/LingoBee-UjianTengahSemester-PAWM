import React, { useState } from 'react';
import './RegisterPage.css';
import itbFoto from '../assets/itb-foto.png';
import logoITBputih from '../assets/itb-logo-putih.png';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    nim: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Password dan konfirmasi tidak sama');
      return;
    }
    console.log('Register form:', form);
    // TODO: kirim ke API
  }

  return (
    <div className="register-root">
      <div className="register-left">
        <img src={itbFoto} alt="ITB Building" className="left-image" />
      </div>

      <div className="register-right">
        <img src={logoITBputih} alt="ITB Logo" className="logo-itb-white" />

        <form className="register-box" onSubmit={handleSubmit} aria-labelledby="register-title">
          <h1 id="register-title">Register</h1>

          <label className="field">
            <span>Nama</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan Nama Lengkap"
              required
            />
          </label>

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
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan Email"
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

          <label className="field">
            <span>Konfirmasi Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi Password"
              required
            />
          </label>

          <button className="btn-register" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}