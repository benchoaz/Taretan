import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '../data/mockData';

// ── Icons (inline SVG to avoid dependencies issues) ──────────────────────────
const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const ICONS = {
  home:       'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  inbox:      'M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z',
  outbox:     'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
  disposisi:  'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
  monitoring: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6',
  laporan:    'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  arsip:      'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
  admin:      'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  bell:       'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  logout:     'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9',
  chevron:    'M8.25 4.5l7.5 7.5-7.5 7.5',
};

const NAV_ITEMS = [
  { path: '/dashboard',      label: 'Beranda',         icon: 'home',       roles: null },
  { path: '/surat-masuk',    label: 'Surat Masuk',     icon: 'inbox',      roles: null },
  { path: '/surat-keluar',   label: 'Surat Keluar',    icon: 'outbox',     roles: null },
  { path: '/disposisi',      label: 'Disposisi',       icon: 'disposisi',  roles: null },
  { path: '/monitoring',     label: 'Monitoring',      icon: 'monitoring', roles: null },
  { path: '/laporan',        label: 'Laporan',         icon: 'laporan',    roles: null },
  { path: '/arsip',          label: 'Arsip Digital',   icon: 'arsip',      roles: null },
  { path: '/admin',          label: 'Administrasi',    icon: 'admin',      roles: ['kepala_dinas', 'operator'] },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  const handleNav = (path) => navigate(path);

  const pendingNotif = 3; // demo badge

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 flex flex-col z-30 select-none">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* TARETAN ring logo */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-4 border-amber-400 opacity-80" />
            <div className="absolute inset-1.5 rounded-full border-3 border-amber-500" style={{ borderWidth: 3 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-amber-400 font-black text-xs">T</span>
            </div>
          </div>
          <div>
            <p className="text-white font-black text-base leading-tight tracking-wide">TARETAN</p>
            <p className="text-slate-500 text-[10px] leading-tight">Tata Kelola Disposisi</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="mx-3 mt-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.avatar || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-xs truncate">{user?.nama?.split(',')[0]}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${ROLE_COLORS[user?.role]}`}>
              {ROLE_LABELS[user?.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 pb-2 overflow-y-auto space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Menu Utama</p>
        {NAV_ITEMS.filter(item => !item.roles || item.roles.includes(user?.role)).map(item => {
          const active = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`nav-item w-full text-left ${active ? 'active' : ''}`}
            >
              <Icon path={ICONS[item.icon]} className="nav-icon" />
              <span>{item.label}</span>
              {item.path === '/disposisi' && pendingNotif > 0 && !active && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingNotif}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-slate-800 space-y-1">
        <button className="nav-item w-full text-left" onClick={() => alert('Fitur notifikasi — coming soon')}>
          <Icon path={ICONS.bell} className="nav-icon" />
          <span>Notifikasi</span>
          <span className="ml-auto">
            <span className="live-dot inline-block" />
          </span>
        </button>
        <button className="nav-item w-full text-left text-red-400 hover:bg-red-900/30 hover:text-red-300" onClick={logout}>
          <Icon path={ICONS.logout} className="nav-icon" />
          <span>Keluar</span>
        </button>
      </div>

      {/* Version */}
      <div className="px-5 py-2 text-center">
        <p className="text-slate-700 text-[10px]">v1.0.0 · {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
