import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getStats, getDisposisiForUser, MOCK_SURAT_MASUK,
  ROLE_LABELS
} from '../data/mockData';
import MobileDashboardPage from './MobileDashboardPage';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending:       'badge-pending',
    proses:        'badge-proses',
    selesai:       'badge-selesai',
    ditunda:       'badge-ditunda',
    dikembalikan:  'badge-dikembalikan',
  };
  const label = { pending:'Pending', proses:'Diproses', selesai:'Selesai', ditunda:'Ditunda', dikembalikan:'Dikembalikan' };
  return <span className={`badge ${map[status] || 'badge-pending'}`}>{label[status] || status}</span>;
};

const PrioritasBadge = ({ prioritas }) => {
  const map = { tinggi:'badge-tinggi', sedang:'badge-sedang', rendah:'badge-rendah' };
  return <span className={`badge ${map[prioritas]}`}>{prioritas}</span>;
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' }) : '-';
const fmtRelative = (d) => {
  const diff = Math.floor((Date.now() - new Date(d)) / 60000);
  if (diff < 60)   return `${diff}m lalu`;
  if (diff < 1440) return `${Math.floor(diff/60)}j lalu`;
  return `${Math.floor(diff/1440)}h lalu`;
};

// Stat card
const StatCard = ({ label, value, sub, color, icon, onClick }) => (
  <button
    onClick={onClick}
    className="card p-5 text-left w-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group animate-fade-in-up"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color.replace('text-','bg-').replace('-600','-50').replace('-700','-50')}`}>
        <Icon path={icon} className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-','bg-')}`}
           style={{ width: `${Math.min(100, value * 20)}%` }} />
    </div>
  </button>
);

// Mini progress for chart
const MiniBarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t-md transition-all duration-700"
               style={{ height: `${(d.value / max) * 64}px`, background: d.color }} />
          <span className="text-[9px] text-slate-400 font-medium truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Jika mobile, otomatis tampilkan MobileDashboardPage untuk SEMUA role
  if (isMobile) {
    return <MobileDashboardPage />;
  }

  const stats     = getStats();
  const myDisp    = getDisposisiForUser(user?.id, user?.role);
  const recentSurat = MOCK_SURAT_MASUK.slice(0, 4);

  const deadline = myDisp
    .filter(d => d.batas_waktu && d.status !== 'selesai')
    .sort((a, b) => new Date(a.batas_waktu) - new Date(b.batas_waktu))
    .slice(0, 4);

  const barData = [
    { label: 'Pending',    value: stats.disposisiPending,  color: '#f59e0b' },
    { label: 'Proses',     value: stats.disposisiProses,   color: '#3b82f6' },
    { label: 'Selesai',    value: stats.disposisiSelesai,  color: '#22c55e' },
    { label: 'Ditunda',    value: stats.disposisiDitunda,  color: '#94a3b8' },
  ];

  const daysUntil = (d) => Math.ceil((new Date(d) - Date.now()) / 86400000);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="animate-fade-in-up">
        <h2 className="text-xl font-bold text-slate-800">
          Selamat {new Date().getHours() < 12 ? 'Pagi' : new Date().getHours() < 17 ? 'Siang' : 'Sore'}, {user?.nama?.split(',')[0]?.split(' ').slice(0,2).join(' ')} 👋
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          {ROLE_LABELS[user?.role]} · {user?.unit_kerja} · {fmtDate(new Date().toISOString())}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="delay-1">
          <StatCard label="Surat Masuk"  value={stats.totalSuratMasuk}  color="text-blue-600"
            sub="Total surat diterima"
            icon="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
            onClick={() => navigate('/surat-masuk')}
          />
        </div>
        <div className="delay-2">
          <StatCard label="Surat Keluar" value={stats.totalSuratKeluar} color="text-purple-600"
            sub="Total surat diterbitkan"
            icon="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            onClick={() => navigate('/surat-keluar')}
          />
        </div>
        <div className="delay-3">
          <StatCard label="Disposisi Aktif" value={stats.disposisiProses + stats.disposisiPending} color="text-amber-600"
            sub={`${stats.disposisiPending} pending · ${stats.disposisiProses} diproses`}
            icon="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
            onClick={() => navigate('/disposisi')}
          />
        </div>
        <div className="delay-4">
          <StatCard label="Selesai" value={stats.disposisiSelesai} color="text-green-600"
            sub="Disposisi tuntas"
            icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            onClick={() => navigate('/monitoring')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Surat Masuk */}
        <div className="xl:col-span-2 card animate-fade-in-up delay-2">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Surat Masuk Terbaru</h3>
              <p className="text-xs text-slate-400">Agenda surat masuk terakhir</p>
            </div>
            <button onClick={() => navigate('/surat-masuk')} className="btn-ghost text-blue-600 text-xs">
              Lihat Semua →
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentSurat.map(s => (
              <div key={s.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${
                  s.sifat === 'segera' ? 'bg-red-500' : s.sifat === 'penting' ? 'bg-amber-500' : 'bg-slate-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{s.perihal}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.asal_surat} · <span className="font-mono">{s.nomor_surat}</span></p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <StatusBadge status={s.status_disposisi} />
                  <p className="text-[10px] text-slate-400 block">{fmtDate(s.tanggal_terima)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Status chart */}
          <div className="card p-5 animate-fade-in-up delay-3">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Status Disposisi</h3>
            <MiniBarChart data={barData} />
            <div className="grid grid-cols-2 gap-2 mt-4">
              {barData.map(d => (
                <div key={d.label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-[11px] text-slate-500">{d.label} <span className="font-bold text-slate-700">{d.value}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Deadline alert */}
          <div className="card p-5 animate-fade-in-up delay-4">
            <h3 className="font-bold text-slate-800 text-sm mb-3">⏰ Mendekati Jatuh Tempo</h3>
            {deadline.length === 0
              ? <p className="text-xs text-slate-400 text-center py-3">Tidak ada deadline mendekat</p>
              : <div className="space-y-2">
                  {deadline.map(d => {
                    const days = daysUntil(d.batas_waktu);
                    const urgent = days <= 2;
                    return (
                      <div key={d.id} onClick={() => navigate('/disposisi')}
                           className={`p-3 rounded-xl border cursor-pointer hover:opacity-90 transition-opacity ${urgent ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                        <p className="text-xs font-semibold text-slate-800 truncate">{d.surat?.perihal?.slice(0,40)}…</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-slate-500">ke {d.ke_user?.nama?.split(',')[0]?.split(' ').slice(-1)}</span>
                          <span className={`text-[11px] font-bold ${urgent ? 'text-red-600' : 'text-amber-600'}`}>
                            {days <= 0 ? 'LEWAT BATAS' : `${days}h lagi`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-5 animate-fade-in-up delay-5">
        <h3 className="font-bold text-slate-800 text-sm mb-4">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/field')} className="btn-primary text-sm bg-slate-800 border-slate-800 hover:bg-slate-900">
            📱 Buka Mode Lapangan
          </button>
          {[
            { label: '📨 Input Surat Masuk',      path: '/surat-masuk',  roles: ['operator','kepala_dinas','kepala_bidang'] },
            { label: '📤 Buat Surat Keluar',      path: '/surat-keluar', roles: ['operator','kepala_dinas','kepala_bidang'] },
            { label: '📋 Buat Disposisi',         path: '/disposisi',    roles: ['kepala_dinas','kepala_bidang','kepala_seksi'] },
            { label: '📊 Lihat Monitoring',       path: '/monitoring',   roles: null },
            { label: '📄 Unduh Laporan',          path: '/laporan',      roles: null },
            { label: '🗄️ Kelola Arsip',           path: '/arsip',        roles: null },
          ]
          .filter(a => !a.roles || a.roles.includes(user?.role))
          .map(a => (
            <button key={a.label} onClick={() => navigate(a.path)}
                    className="btn-secondary text-sm font-semibold">
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
