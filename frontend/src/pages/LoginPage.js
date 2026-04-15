import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS } from '../data/mockData';

const EyeIcon = ({ open }) => (
  <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center p-6 animate-fade-in font-sans">
      
      {/* iOS STYLE AUTH CONTAINER */}
      <div className="w-full max-w-sm space-y-8">
        
        {/* APP ICON & BRANDING */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[22%] shadow-2xl flex items-center justify-center text-white text-5xl font-black">
            T
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-black">Zimpen E-Disposisi</h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Kabupaten Probolinggo</p>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="ios-card overflow-hidden">
          <div className="bg-white/80 p-8">
            <h2 className="text-lg font-bold text-black mb-6">Silakan Masuk</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ACCOUNT SELECTOR (iOS STYLE LIST) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Pilih Jabatan</label>
                <div className="divide-y divide-slate-50 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                  {DEMO_ACCOUNTS.map(acc => (
                    <button
                      key={acc.userId}
                      type="button"
                      onClick={() => setSelectedAccount(acc)}
                      className={`w-full p-4 flex items-center justify-between text-left text-sm font-semibold transition-all ${
                        selectedAccount.userId === acc.userId ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-800'
                      }`}
                    >
                      <span>{acc.label}</span>
                      {selectedAccount.userId === acc.userId && <span className="text-blue-600">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Wajib diisi"
                    className="w-full p-4 bg-white rounded-2xl border border-slate-100 font-semibold text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {/* ERROR FEEDBACK */}
              {error && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-600 text-xs font-bold animate-ios-slide">
                  ⚠️ {error}
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-blue-600 text-white rounded-[1.2rem] font-bold text-lg shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
              >
                {loading ? 'Memuat...' : 'Masuk'}
              </button>

            </form>
          </div>
        </div>

        {/* SYSTEM FOOTER */}
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by SPBE Probolinggo</p>
          <div className="mt-4 flex justify-center gap-4 text-slate-400">
             <span className="text-[10px]">v1.0.2-alpha</span>
             <span className="text-[10px]">SPBE COMPLIANT</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
