import React, { useState } from 'react';
import { MOCK_DISPOSISI, MOCK_USERS, MOCK_SURAT_MASUK, MOCK_SURAT_KELUAR, getStats } from '../data/mockData';

const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-';

const StatusBadge = ({ status }) => {
  const m = { pending:'badge-pending', proses:'badge-proses', selesai:'badge-selesai', ditunda:'badge-ditunda' };
  const l = { pending:'Pending', proses:'Diproses', selesai:'Selesai', ditunda:'Ditunda' };
  return <span className={`badge ${m[status]||'badge-pending'}`}>{l[status]||status}</span>;
};

// Simulated monthly data for chart
const MONTHLY_DATA = [
  { bln:'Jan', masuk:12, keluar:9,  disposisi:8  },
  { bln:'Feb', masuk:18, keluar:14, disposisi:15 },
  { bln:'Mar', masuk:15, keluar:11, disposisi:12 },
  { bln:'Apr', masuk:22, keluar:17, disposisi:19 },
];

const VerticalBarChart = ({ data }) => {
  const maxVal = Math.max(...data.flatMap(d=>[d.masuk,d.keluar,d.disposisi]),1);
  const h = 100;
  return (
    <div className="flex items-end gap-3 pt-2">
      {data.map(d=>(
        <div key={d.bln} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-end justify-center gap-0.5" style={{height:`${h}px`}}>
            {[
              {val:d.masuk,    color:'#3b82f6'},
              {val:d.keluar,   color:'#8b5cf6'},
              {val:d.disposisi,color:'#f59e0b'},
            ].map((b,i)=>(
              <div key={i} className="flex-1 rounded-t transition-all duration-700"
                style={{height:`${(b.val/maxVal)*h}px`, background:b.color, opacity:0.85}} />
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{d.bln}</span>
        </div>
      ))}
    </div>
  );
};

const LaporanPage = () => {
  const stats  = getStats();
  const [tab,  setTab]  = useState('disposisi');
  const [year, setYear] = useState('2026');

  const selesaiDisp    = MOCK_DISPOSISI.filter(d=>d.status==='selesai');
  const prosesDisp     = MOCK_DISPOSISI.filter(d=>d.status==='proses');
  const completionRate = Math.round((selesaiDisp.length/Math.max(MOCK_DISPOSISI.length,1))*100);

  const perUser = MOCK_USERS.filter(u=>u.role!=='operator').map(u=>{
    const received = MOCK_DISPOSISI.filter(d=>d.ke_user_id===u.id);
    const sent     = MOCK_DISPOSISI.filter(d=>d.dari_user_id===u.id);
    const selesai  = received.filter(d=>d.status==='selesai').length;
    return { ...u, received:received.length, sent:sent.length, selesai, rate: received.length ? Math.round((selesai/received.length)*100) : 0 };
  }).filter(u=>u.received+u.sent>0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📄</div>
          <div>
            <h2 className="font-bold text-slate-800">Laporan & Statistik</h2>
            <p className="text-xs text-slate-500">Rekap kinerja disposisi dan persuratan</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select className="input-field text-sm w-32" value={year} onChange={e=>setYear(e.target.value)}>
            {['2024','2025','2026'].map(y=><option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={()=>alert('Export PDF akan diunduh...')} className="btn-secondary text-sm">📄 Export PDF</button>
          <button onClick={()=>alert('Export Excel akan diunduh...')} className="btn-primary text-sm">📊 Export Excel</button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-in-up delay-1">
        {[
          { label:'Total Surat Masuk',  val:stats.totalSuratMasuk,  color:'text-blue-600',  bg:'bg-blue-50',  icon:'📨' },
          { label:'Total Surat Keluar', val:stats.totalSuratKeluar, color:'text-purple-600', bg:'bg-purple-50', icon:'📤' },
          { label:'Total Disposisi',    val:stats.totalDisposisi,   color:'text-amber-600',  bg:'bg-amber-50',  icon:'📋' },
          { label:'Tingkat Selesai',    val:`${completionRate}%`,   color:'text-green-600',  bg:'bg-green-50',  icon:'🎯' },
        ].map((s,i)=>(
          <div key={s.label} className={`card p-4 animate-fade-in-up delay-${i+1}`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">{s.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Tahun {year}</p>
          </div>
        ))}
      </div>

      {/* Chart & legend */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 card p-5 animate-fade-in-up delay-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Grafik Bulanan {year}</h3>
              <p className="text-xs text-slate-400">Volume surat & disposisi per bulan</p>
            </div>
            <div className="flex items-center gap-4">
              {[{c:'#3b82f6',l:'Surat Masuk'},{c:'#8b5cf6',l:'Surat Keluar'},{c:'#f59e0b',l:'Disposisi'}].map(({c,l})=>(
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{background:c}} />
                  <span className="text-[11px] text-slate-500">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <VerticalBarChart data={MONTHLY_DATA} />
        </div>

        <div className="card p-5 animate-fade-in-up delay-3">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Ringkasan Disposisi</h3>
          <div className="space-y-3">
            {[
              { label:'Pending',    val:stats.disposisiPending,  color:'#f59e0b', pct:Math.round((stats.disposisiPending/Math.max(stats.totalDisposisi,1))*100) },
              { label:'Diproses',   val:stats.disposisiProses,   color:'#3b82f6', pct:Math.round((stats.disposisiProses/Math.max(stats.totalDisposisi,1))*100) },
              { label:'Selesai',    val:stats.disposisiSelesai,  color:'#22c55e', pct:completionRate },
              { label:'Ditunda',    val:stats.disposisiDitunda,  color:'#94a3b8', pct:Math.round((stats.disposisiDitunda/Math.max(stats.totalDisposisi,1))*100) },
            ].map(s=>(
              <div key={s.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">{s.label}</span>
                  <span className="font-bold text-slate-800">{s.val} <span className="text-slate-400 font-normal">({s.pct}%)</span></span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{width:`${s.pct}%`,background:s.color}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab report tables */}
      <div className="card animate-fade-in-up delay-4">
        <div className="flex items-center gap-1 p-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          {[
            { key:'disposisi', label:'Laporan Disposisi' },
            { key:'kinerja',   label:'Kinerja Pegawai' },
            { key:'surat',     label:'Rekap Surat' },
          ].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t.key?'bg-blue-600 text-white shadow-sm':'text-slate-500 hover:bg-slate-100'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Laporan Disposisi */}
        {tab==='disposisi' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="tbl-head text-left">#</th>
                  <th className="tbl-head text-left">Nomor Surat</th>
                  <th className="tbl-head text-left">Perihal</th>
                  <th className="tbl-head text-left">Dari</th>
                  <th className="tbl-head text-left">Kepada</th>
                  <th className="tbl-head text-left">Tgl Disposisi</th>
                  <th className="tbl-head text-left">Batas Waktu</th>
                  <th className="tbl-head text-left">Status</th>
                  <th className="tbl-head text-left">Durasi</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DISPOSISI.map((d,i)=>{
                  const durasi = d.tanggal_selesai
                    ? Math.ceil((new Date(d.tanggal_selesai)-new Date(d.created_at))/86400000)
                    : null;
                  return (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="tbl-row text-slate-400 text-xs">{i+1}</td>
                      <td className="tbl-row font-mono text-xs text-blue-700">{d.surat?.nomor_surat}</td>
                      <td className="tbl-row max-w-xs"><p className="truncate text-sm">{d.surat?.perihal?.slice(0,45)}…</p></td>
                      <td className="tbl-row text-xs">{d.dari_user?.nama?.split(',')[0]}</td>
                      <td className="tbl-row text-xs">{d.ke_user?.nama?.split(',')[0]}</td>
                      <td className="tbl-row text-xs whitespace-nowrap">{fmtDate(d.created_at)}</td>
                      <td className="tbl-row text-xs whitespace-nowrap">{fmtDate(d.batas_waktu)}</td>
                      <td className="tbl-row"><StatusBadge status={d.status} /></td>
                      <td className="tbl-row text-xs text-slate-500">
                        {durasi ? `${durasi} hari` : d.status==='selesai' ? '—' : <span className="text-amber-600">Berjalan</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Kinerja Pegawai */}
        {tab==='kinerja' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="tbl-head text-left">#</th>
                  <th className="tbl-head text-left">Nama Pegawai</th>
                  <th className="tbl-head text-left">Jabatan</th>
                  <th className="tbl-head text-left">Unit Kerja</th>
                  <th className="tbl-head text-left">Disposisi Diterima</th>
                  <th className="tbl-head text-left">Dikirim</th>
                  <th className="tbl-head text-left">Selesai</th>
                  <th className="tbl-head text-left">Kinerja</th>
                </tr>
              </thead>
              <tbody>
                {perUser.map((u,i)=>(
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="tbl-row text-slate-400 text-xs">{i+1}</td>
                    <td className="tbl-row">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs">{u.avatar}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{u.nama.split(',')[0]}</p>
                          <p className="text-[10px] text-slate-400">{u.nip}</p>
                        </div>
                      </div>
                    </td>
                    <td className="tbl-row text-xs text-slate-600">{u.jabatan}</td>
                    <td className="tbl-row text-xs text-slate-500">{u.unit_kerja}</td>
                    <td className="tbl-row text-center font-bold text-slate-800">{u.received}</td>
                    <td className="tbl-row text-center text-slate-600">{u.sent}</td>
                    <td className="tbl-row text-center text-green-700 font-semibold">{u.selesai}</td>
                    <td className="tbl-row w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${u.rate>=70?'bg-green-500':u.rate>=40?'bg-amber-400':'bg-red-400'}`}
                               style={{width:`${u.rate}%`}} />
                        </div>
                        <span className={`text-xs font-bold ${u.rate>=70?'text-green-600':u.rate>=40?'text-amber-600':'text-red-600'}`}>{u.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rekap Surat */}
        {tab==='surat' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-100">
            <div className="p-4">
              <h4 className="font-semibold text-slate-700 text-sm px-1 mb-3">📨 Surat Masuk</h4>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="tbl-head text-left"></th>
                    <th className="tbl-head text-left">Nomor</th>
                    <th className="tbl-head text-left">Perihal</th>
                    <th className="tbl-head text-left">Asal</th>
                    <th className="tbl-head text-left">Tgl</th>
                    <th className="tbl-head text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SURAT_MASUK.map(s=>(
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="tbl-row text-[10px]">{s.file_pdf_url && s.file_pdf_url !== '#' ? '📎' : ''}</td>
                      <td className="tbl-row font-mono text-[10px] text-blue-700">{s.nomor_surat.split('/').slice(0,2).join('/')}</td>
                      <td className="tbl-row max-w-[140px]"><p className="truncate text-xs">{s.perihal?.slice(0,30)}…</p></td>
                      <td className="tbl-row text-[10px] text-slate-500 max-w-[100px]"><p className="truncate">{s.asal_surat.split(' ').slice(0,3).join(' ')}</p></td>
                      <td className="tbl-row text-[10px] whitespace-nowrap">{fmtDate(s.tanggal_terima)}</td>
                      <td className="tbl-row"><StatusBadge status={s.status_disposisi} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-700 text-sm px-1 mb-3">📤 Surat Keluar</h4>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="tbl-head text-left"></th>
                    <th className="tbl-head text-left">Nomor</th>
                    <th className="tbl-head text-left">Perihal</th>
                    <th className="tbl-head text-left">Kepada</th>
                    <th className="tbl-head text-left">Tgl</th>
                    <th className="tbl-head text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SURAT_KELUAR.map(s=>(
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="tbl-row text-[10px]">{s.file_pdf_url && s.file_pdf_url !== '#' ? '📎' : ''}</td>
                      <td className="tbl-row font-mono text-[10px] text-purple-700">{s.nomor_surat.split('/').slice(0,2).join('/')}</td>
                      <td className="tbl-row max-w-[140px]"><p className="truncate text-xs">{s.perihal?.slice(0,30)}…</p></td>
                      <td className="tbl-row text-[10px] text-slate-500 max-w-[100px]"><p className="truncate">{s.tujuan_surat?.split(' ').slice(0,3).join(' ')}</p></td>
                      <td className="tbl-row text-[10px] whitespace-nowrap">{fmtDate(s.tanggal_surat)}</td>
                      <td className="tbl-row">
                        <span className={`badge text-[10px] ${s.status==='terkirim'?'badge-selesai':s.status==='dikirim'?'badge-proses':'badge-pending'}`}>
                          {s.status==='terkirim'?'Terkirim':s.status==='dikirim'?'Review':'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Data tahun {year} · TARETAN v1.0</p>
          <button onClick={()=>alert('Mencetak laporan...')} className="btn-ghost text-xs text-blue-600">🖨️ Cetak Halaman Ini</button>
        </div>
      </div>
    </div>
  );
};

export default LaporanPage;
