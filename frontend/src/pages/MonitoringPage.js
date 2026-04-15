import React, { useState } from 'react';
import { MOCK_DISPOSISI, MOCK_USERS, ROLE_LABELS, getStats } from '../data/mockData';

const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-';
const daysLeft = d => Math.ceil((new Date(d) - Date.now()) / 86400000);

const StatusBadge = ({ status }) => {
  const m = { pending:'badge-pending', proses:'badge-proses', selesai:'badge-selesai', ditunda:'badge-ditunda', dikembalikan:'badge-dikembalikan' };
  const l = { pending:'Pending', proses:'Diproses', selesai:'Selesai', ditunda:'Ditunda', dikembalikan:'Dikembalikan' };
  return <span className={`badge ${m[status]||'badge-pending'}`}>{l[status]||status}</span>;
};

// Horizontal bar
const HBar = ({ label, value, max, color, sub }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        {sub && <span className="text-slate-400">{sub}</span>}
        <span className="font-bold text-slate-800">{value}</span>
      </div>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width:`${Math.min(100,(value/max)*100)}%`, background:color }} />
    </div>
  </div>
);

// KPI Ring
const KpiRing = ({ pct, label, value, color }) => {
  const r = 36; const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.8s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black" style={{ color }}>{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
};

const MonitoringPage = () => {
  const stats = getStats();
  const [filterUnit, setFilterUnit] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const unitList = [...new Set(MOCK_USERS.map(u => u.unit_kerja))];
  const allDisp  = MOCK_DISPOSISI;

  const filtered = allDisp.filter(d =>
    (!filterStatus || d.status === filterStatus) &&
    (!filterUnit   || d.ke_user?.unit_kerja === filterUnit)
  );

  const totalActive = stats.totalDisposisi - stats.disposisiSelesai;
  const completionRate = Math.round((stats.disposisiSelesai / Math.max(stats.totalDisposisi, 1)) * 100);

  // Per-unit stats
  const unitStats = unitList.map(unit => {
    const unitDisp = allDisp.filter(d => d.ke_user?.unit_kerja === unit);
    return {
      unit,
      total: unitDisp.length,
      selesai: unitDisp.filter(d => d.status === 'selesai').length,
      proses: unitDisp.filter(d => d.status === 'proses').length,
      pending: unitDisp.filter(d => d.status === 'pending').length,
    };
  }).filter(u => u.total > 0).sort((a,b) => b.total - a.total);

  const maxUnit = Math.max(...unitStats.map(u => u.total), 1);

  // Deadline monitoring
  const deadlineItems = allDisp
    .filter(d => d.batas_waktu && d.status !== 'selesai')
    .sort((a,b) => new Date(a.batas_waktu) - new Date(b.batas_waktu));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <h2 className="font-bold text-slate-800">Dashboard Monitoring</h2>
            <p className="text-xs text-slate-500">Real-time status disposisi & kinerja unit kerja</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-xs text-slate-500">Live</span>
          <span className="text-xs text-slate-400">· Update: {new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</span>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-in-up delay-1">
        {[
          { label:'Total Disposisi', val:stats.totalDisposisi, color:'#3b82f6', icon:'📋' },
          { label:'Aktif',           val:totalActive,           color:'#f59e0b', icon:'⚡' },
          { label:'Selesai',         val:stats.disposisiSelesai,color:'#22c55e', icon:'✅' },
          { label:'Tingkat Selesai', val:`${completionRate}%`,  color:'#8b5cf6', icon:'🎯' },
        ].map((s,i)=>(
          <div key={s.label} className={`card p-5 animate-fade-in-up delay-${i+1}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <div className="w-2 h-2 rounded-full" style={{background:s.color}} />
            </div>
            <p className="text-3xl font-black" style={{color:s.color}}>{s.val}</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Status rings */}
        <div className="card p-5 animate-fade-in-up delay-2">
          <h3 className="font-bold text-slate-800 text-sm mb-5">Distribusi Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <KpiRing pct={Math.round((stats.disposisiPending/Math.max(stats.totalDisposisi,1))*100)}
              label="Pending" value={stats.disposisiPending} color="#f59e0b" />
            <KpiRing pct={Math.round((stats.disposisiProses/Math.max(stats.totalDisposisi,1))*100)}
              label="Diproses" value={stats.disposisiProses} color="#3b82f6" />
            <KpiRing pct={completionRate}
              label="Selesai" value={stats.disposisiSelesai} color="#22c55e" />
            <KpiRing pct={Math.round((stats.disposisiDitunda/Math.max(stats.totalDisposisi,1))*100)}
              label="Ditunda" value={stats.disposisiDitunda} color="#94a3b8" />
          </div>
        </div>

        {/* Per-unit performance */}
        <div className="card p-5 animate-fade-in-up delay-3">
          <h3 className="font-bold text-slate-800 text-sm mb-5">Kinerja Per Unit Kerja</h3>
          <div className="space-y-4">
            {unitStats.map(u=>(
              <HBar key={u.unit} label={u.unit} value={u.total} max={maxUnit}
                color="#3b82f6"
                sub={`${u.selesai} selesai`}
              />
            ))}
          </div>
        </div>

        {/* Deadline alerts */}
        <div className="card p-5 animate-fade-in-up delay-4">
          <h3 className="font-bold text-slate-800 text-sm mb-4">⚠️ Monitoring Deadline</h3>
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {deadlineItems.length === 0
              ? <p className="text-xs text-slate-400 text-center py-6">Tidak ada deadline mendekat</p>
              : deadlineItems.map(d => {
                  const dl = daysLeft(d.batas_waktu);
                  const isUrgent = dl <= 2;
                  const isOverdue = dl < 0;
                  return (
                    <div key={d.id} className={`p-3 rounded-xl border ${
                      isOverdue ? 'bg-red-50 border-red-300' :
                      isUrgent  ? 'bg-red-50 border-red-200' :
                      'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{d.surat?.perihal?.slice(0,45)}…</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">→ {d.ke_user?.nama?.split(',')[0]}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs font-bold ${isOverdue?'text-red-700':isUrgent?'text-red-600':'text-amber-700'}`}>
                            {isOverdue ? `${Math.abs(dl)}h lewat` : dl === 0 ? 'Hari ini' : `${dl}h lagi`}
                          </span>
                          <div className="mt-0.5"><StatusBadge status={d.status} /></div>
                        </div>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>

      {/* Table filter & list */}
      <div className="card animate-fade-in-up delay-5">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 flex-wrap gap-3">
          <h3 className="font-bold text-slate-800 text-sm">Detail Progress Semua Disposisi</h3>
          <div className="flex gap-2">
            <select className="input-field text-xs py-1.5 w-44" value={filterUnit} onChange={e=>setFilterUnit(e.target.value)}>
              <option value="">Semua Unit Kerja</option>
              {unitList.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
            <select className="input-field text-xs py-1.5 w-36" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              <option value="">Semua Status</option>
              {['pending','proses','selesai','ditunda','dikembalikan'].map(s=>(
                <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="tbl-head text-left">Surat / Perihal</th>
                <th className="tbl-head text-left">Dari → Kepada</th>
                <th className="tbl-head text-left">Jenis</th>
                <th className="tbl-head text-left">Prioritas</th>
                <th className="tbl-head text-left">Batas Waktu</th>
                <th className="tbl-head text-left">Status</th>
                <th className="tbl-head text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const dl = d.batas_waktu ? daysLeft(d.batas_waktu) : null;
                const prog = d.status==='selesai' ? 100 : d.status==='proses' ? 60 : d.status==='pending' ? 20 : 30;
                return (
                  <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="tbl-row max-w-xs">
                      <p className="text-xs font-mono text-blue-600">{d.surat?.nomor_surat}</p>
                      <p className="truncate text-sm font-medium text-slate-800 mt-0.5">{d.surat?.perihal?.slice(0,50)}…</p>
                    </td>
                    <td className="tbl-row text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-600">{d.dari_user?.nama?.split(',')[0]}</span>
                        <span className="text-slate-400">↓</span>
                        <span className="font-semibold text-slate-800">{d.ke_user?.nama?.split(',')[0]}</span>
                        <span className="text-slate-400 text-[10px]">{d.ke_user?.unit_kerja}</span>
                      </div>
                    </td>
                    <td className="tbl-row text-xs text-slate-600">{d.jenis_disposisi}</td>
                    <td className="tbl-row">
                      <span className={`badge ${d.prioritas==='tinggi'?'badge-tinggi':d.prioritas==='sedang'?'badge-sedang':'badge-rendah'}`}>{d.prioritas}</span>
                    </td>
                    <td className="tbl-row text-xs whitespace-nowrap">
                      {d.batas_waktu ? (
                        <span className={dl!==null&&dl<0?'text-red-600 font-bold':dl!==null&&dl<=3?'text-amber-600 font-semibold':''}>
                          {fmtDate(d.batas_waktu)}
                          {dl !== null && <span className="block text-[10px]">{dl<0?`${Math.abs(dl)}h lewat`:dl===0?'Hari ini':`${dl}h`}</span>}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="tbl-row"><StatusBadge status={d.status} /></td>
                    <td className="tbl-row w-28">
                      <div className="space-y-1">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`progress-bar ${d.status==='selesai'?'bg-green-500':d.status==='proses'?'bg-blue-500':'bg-amber-400'}`}
                               style={{width:`${prog}%`}} />
                        </div>
                        <span className="text-[10px] text-slate-400">{prog}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">Menampilkan {filtered.length} dari {allDisp.length} disposisi</p>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
