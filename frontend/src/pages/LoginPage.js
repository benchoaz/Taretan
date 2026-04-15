import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS } from '../data/mockData';

const EyeIcon = ({ open }) => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    {open
      ? <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      : <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    }
  </svg>
);

const LoginPage = () => {
  const navigate         = useNavigate();
  const { login, loading, error } = useAuth();

  const [selectedAccount, setSelectedAccount] = useState(DEMO_ACCOUNTS[0]);
  const [password, setPassword]               = useState('123456');
  const [showPass, setShowPass]               = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(selectedAccount.userId, password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (branding) ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-2xl" />

        {/* Logo section */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-[5px] border-amber-400" />
              <div className="absolute inset-2 rounded-full border-[4px] border-amber-500/70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-amber-400 font-black text-xl">T</span>
              </div>
            </div>
            <div>
              <h1 className="text-white font-black text-3xl tracking-wide">TARETAN</h1>
              <p className="text-slate-400 text-sm leading-tight">Tata Kelola Rekam Dokumen<br/>dan Disposisi PemerintahAN</p>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { icon: '📨', title: 'Manajemen Persuratan', desc: 'Agenda surat masuk & keluar sesuai Permendagri No. 54/2009' },
              { icon: '📋', title: 'Disposisi Berjenjang', desc: 'Alur instruksi hierarkis dari Kepala Dinas hingga Staf Pelaksana' },
              { icon: '📊', title: 'Dashboard Monitoring', desc: 'Real-time tracking status, KPI, dan progress tindak lanjut' },
              { icon: '🗄️', title: 'Arsip Digital ANRI',   desc: 'Klasifikasi dan retensi arsip sesuai Perka ANRI No. 2/2014' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer compliance */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {['Permendagri 54/2009', 'Perpres 95/2018 (SPBE)', 'Perka ANRI 2/2014', 'SNI ISO 27001'].map(r => (
              <span key={r} className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full">
                {r}
              </span>
            ))}
          </div>
          <p className="text-slate-600 text-[11px]">© 2026 Dinas Pendidikan dan Kebudayaan Kab. Probolinggo</p>
        </div>
      </div>

      {/* ── Right panel (login form) ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-[4px] border-amber-400" />
              <div className="absolute inset-1.5 rounded-full border-[3px] border-amber-500/70" />
            </div>
            <div>
              <h1 className="text-slate-900 font-black text-2xl">TARETAN</h1>
              <p className="text-slate-500 text-xs">Sistem E-Disposisi Pemerintah</p>
            </div>
          </div>

          <div className="card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Selamat Datang</h2>
              <p className="text-slate-500 text-sm mt-1">Masuk ke sistem TARETAN menggunakan akun ASN Anda</p>
            </div>

            {/* Demo account picker */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-3 flex items-center gap-1.5">
                <span>⚡</span> Demo — Pilih Peran Login
              </p>
              <div className="grid grid-cols-1 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.userId}
                    type="button"
                    onClick={() => setSelectedAccount(acc)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-left text-xs font-medium transition-all duration-150 ${
                      selectedAccount.userId === acc.userId
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/30'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedAccount.userId === acc.userId ? 'bg-white' : 'bg-slate-300'}`} />
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NIP / Username (read-only for demo) */}
              <div>
                <label className="input-label">NIP / Username</label>
                <input
                  type="text"
                  readOnly
                  value={selectedAccount.label}
                  className="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Demo: gunakan password <strong>123456</strong></p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memverifikasi...
                  </>
                ) : '🔐  Masuk ke Sistem'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Lupa password? Hubungi <span className="text-blue-600 font-medium">operator sistem</span> instansi Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
