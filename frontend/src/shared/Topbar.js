import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../data/mockData';

const PAGE_TITLES = {
  '/dashboard':    { title: 'Beranda',            sub: 'Ringkasan aktivitas sistem disposisi' },
  '/surat-masuk':  { title: 'Surat Masuk',        sub: 'Kelola agenda surat masuk' },
  '/surat-keluar': { title: 'Surat Keluar',       sub: 'Kelola surat keluar instansi' },
  '/disposisi':    { title: 'Disposisi',          sub: 'Alur disposisi berjenjang' },
  '/monitoring':   { title: 'Monitoring',         sub: 'Dashboard status dan progress disposisi' },
  '/laporan':      { title: 'Laporan & Statistik', sub: 'Rekap kinerja dan ekspor data' },
  '/arsip':        { title: 'Arsip Digital',      sub: 'Manajemen arsip dan klasifikasi ANRI' },
  '/admin':        { title: 'Administrasi Sistem', sub: 'Pengguna, peran, dan audit trail' },
};

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const NOTIFS = [
  { id: 1, text: 'Disposisi baru dari Dr. Ahmad Suryadi', time: '5m lalu', read: false, color: 'bg-blue-500' },
  { id: 2, text: 'Batas waktu disposisi sm1 mendekati (2h lagi)', time: '30m lalu', read: false, color: 'bg-red-500' },
  { id: 3, text: 'Laporan dari Dewi Rahayu menunggu verifikasi', time: '2j lalu', read: false, color: 'bg-amber-500' },
  { id: 4, text: 'Surat masuk 005/789/BKPSDM/2026 selesai diproses', time: '1h lalu', read: true, color: 'bg-green-500' },
];

const Topbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs]       = useState(NOTIFS);

  const page   = PAGE_TITLES[location.pathname] || { title: 'TARETAN', sub: '' };
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-slate-100 z-20 flex items-center px-6 gap-4">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-800 leading-tight">{page.title}</h1>
        <p className="text-xs text-slate-400 truncate">{page.sub}</p>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Date */}
        <div className="hidden sm:block text-right">
          <p className="text-xs font-medium text-slate-700">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-[10px] text-slate-400">WIB — Sistem Aktif</p>
        </div>

        {/* Notif bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(v => !v)}
            className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-600"
          >
            <BellIcon />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 z-50 animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-semibold text-sm text-slate-800">Notifikasi</span>
                <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Tandai semua dibaca</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${n.read ? 'opacity-60' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-slate-300' : n.color}`} />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs text-blue-600 hover:underline">Lihat semua notifikasi</button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 max-w-[140px] truncate">{user?.nama?.split(',')[0]}</p>
            <p className="text-[10px] text-slate-400">{ROLE_LABELS[user?.role]}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.avatar}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
