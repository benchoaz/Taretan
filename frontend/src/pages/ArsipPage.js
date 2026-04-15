import React, { useState } from 'react';
import { MOCK_SURAT_MASUK, KLASIFIKASI_ARSIP } from '../data/mockData';

const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-';

const SifatBadge = ({ sifat }) => {
  const m = { segera:'badge-segera', penting:'badge-penting', biasa:'badge-biasa' };
  return <span className={`badge ${m[sifat]||'badge-biasa'}`}>{sifat?.charAt(0).toUpperCase()+sifat?.slice(1)}</span>;
};

const ArsipPage = () => {
  const [search, setSearch] = useState('');
  const [filterKlas, setFilterKlas] = useState('');
  const [view, setView]   = useState('grid'); // 'grid' | 'list'
  const [selected, setSelected] = useState(null);

  // Build arsip from surat masuk (demo)
  const arsipItems = MOCK_SURAT_MASUK.map(s => ({
    ...s,
    klas_nama: KLASIFIKASI_ARSIP.find(k=>k.kode===s.klasifikasi_arsip)?.nama || 'Umum',
    retensi: '5 tahun aktif / 10 tahun inaktif',
    nasib_akhir: 'Permanen',
    tahun_berkas: new Date(s.tanggal_terima).getFullYear(),
    no_berkas: `${s.klasifikasi_arsip}/${String(Math.floor(Math.random()*999)+1).padStart(3,'0')}/${new Date(s.tanggal_terima).getFullYear()}`,
  }));

  const filtered = arsipItems.filter(a => {
    const q = search.toLowerCase();
    return (!q || a.nomor_surat.toLowerCase().includes(q) || a.perihal.toLowerCase().includes(q))
        && (!filterKlas || a.klasifikasi_arsip === filterKlas);
  });

  // Stats by classification
  const klasStats = KLASIFIKASI_ARSIP.map(k=>({
    ...k, count: arsipItems.filter(a=>a.klasifikasi_arsip===k.kode).length
  })).filter(k=>k.count>0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🗄️</div>
          <div>
            <h2 className="font-bold text-slate-800">Arsip Digital</h2>
            <p className="text-xs text-slate-500">Klasifikasi sesuai Perka ANRI No. 2/2014</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>alert('Upload dokumen arsip baru...')} className="btn-primary text-sm">+ Upload Arsip</button>
        </div>
      </div>

      {/* ANRI classification summary */}
      <div className="card p-5 animate-fade-in-up delay-1">
        <h3 className="font-bold text-slate-800 text-sm mb-4">Klasifikasi Arsip (Perka ANRI No. 2/2014)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {klasStats.map(k=>(
            <button key={k.kode} onClick={()=>setFilterKlas(filterKlas===k.kode?'':k.kode)}
              className={`p-3 rounded-xl border text-left transition-all hover:shadow-md ${
                filterKlas===k.kode ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 hover:border-blue-300'
              }`}>
              <p className={`font-mono text-lg font-black ${filterKlas===k.kode?'text-white':'text-blue-600'}`}>{k.kode}</p>
              <p className={`text-xs font-semibold mt-0.5 ${filterKlas===k.kode?'text-blue-100':'text-slate-700'}`}>{k.nama}</p>
              <p className={`text-xl font-black mt-1 ${filterKlas===k.kode?'text-white':'text-slate-800'}`}>{k.count}</p>
              <p className={`text-[10px] ${filterKlas===k.kode?'text-blue-200':'text-slate-400'}`}>dokumen</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters & view toggle */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-2">
        <input className="input-field flex-1" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Cari nomor surat, perihal..." />
        <select className="input-field w-full sm:w-56" value={filterKlas} onChange={e=>setFilterKlas(e.target.value)}>
          <option value="">Semua Klasifikasi</option>
          {KLASIFIKASI_ARSIP.map(k=><option key={k.kode} value={k.kode}>{k.kode} — {k.nama}</option>)}
        </select>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {[{k:'grid',l:'⊞'},{k:'list',l:'≡'}].map(v=>(
            <button key={v.k} onClick={()=>setView(v.k)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view===v.k?'bg-white shadow-sm text-slate-800':'text-slate-500'}`}>
              {v.l}
            </button>
          ))}
        </div>
        {(search||filterKlas) && (
          <button className="btn-ghost text-xs" onClick={()=>{setSearch('');setFilterKlas('');}}>Reset</button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400 animate-fade-in-up">Menampilkan {filtered.length} dari {arsipItems.length} dokumen arsip</p>

      {/* Grid View */}
      {view==='grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in-up delay-3">
          {filtered.map(a=>(
            <div key={a.id} onClick={()=>setSelected(a)}
              className="card p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xl">📄</div>
                <div className="text-right">
                  <span className="font-mono text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-lg">{a.klasifikasi_arsip}</span>
                  <p className="text-[10px] text-slate-400 mt-1">{a.klas_nama}</p>
                </div>
              </div>
              <h4 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">{a.perihal}</h4>
              <p className="text-xs text-slate-500 mt-2 font-mono">{a.nomor_surat}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">{a.asal_surat.split(' ').slice(0,3).join(' ')}</span>
                <SifatBadge sifat={a.sifat} />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">📅 {fmtDate(a.tanggal_terima)}</p>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view==='list' && (
        <div className="card overflow-hidden animate-fade-in-up delay-3">
          <table className="w-full">
            <thead>
              <tr>
                <th className="tbl-head text-left">No. Berkas</th>
                <th className="tbl-head text-left">Nomor Surat</th>
                <th className="tbl-head text-left">Perihal</th>
                <th className="tbl-head text-left">Klasifikasi</th>
                <th className="tbl-head text-left">Tgl Terima</th>
                <th className="tbl-head text-left">Retensi</th>
                <th className="tbl-head text-left">Nasib Akhir</th>
                <th className="tbl-head text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/60 cursor-pointer" onClick={()=>setSelected(a)}>
                  <td className="tbl-row font-mono text-xs text-slate-500">{a.no_berkas}</td>
                  <td className="tbl-row font-mono text-xs text-blue-700">{a.nomor_surat}</td>
                  <td className="tbl-row max-w-xs"><p className="truncate text-sm font-medium">{a.perihal}</p></td>
                  <td className="tbl-row">
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg font-semibold">{a.klasifikasi_arsip}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.klas_nama}</p>
                  </td>
                  <td className="tbl-row text-xs whitespace-nowrap">{fmtDate(a.tanggal_terima)}</td>
                  <td className="tbl-row text-xs text-slate-500">{a.retensi}</td>
                  <td className="tbl-row">
                    <span className="badge bg-purple-50 text-purple-700 border-purple-200 text-[10px]">{a.nasib_akhir}</span>
                  </td>
                  <td className="tbl-row">
                    <button className="btn-ghost text-xs py-1">📄 Lihat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setSelected(null)} />
          <div className="relative w-full max-w-xl card p-6 animate-scale-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{selected.klasifikasi_arsip}</span>
                  <span className="text-xs text-slate-500">{selected.klas_nama}</span>
                </div>
                <h3 className="font-bold text-slate-800">Detail Arsip Dokumen</h3>
              </div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-lg">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { l:'Nomor Berkas',    v:selected.no_berkas,      mono:true },
                { l:'Nomor Surat',     v:selected.nomor_surat,    mono:true },
                { l:'Tanggal Surat',   v:fmtDate(selected.tanggal_surat) },
                { l:'Tanggal Terima',  v:fmtDate(selected.tanggal_terima) },
                { l:'Asal Surat',      v:selected.asal_surat },
                { l:'Sifat',           v:selected.sifat },
                { l:'Retensi Aktif',   v:'5 tahun' },
                { l:'Retensi Inaktif', v:'10 tahun' },
                { l:'Nasib Akhir',     v:selected.nasib_akhir },
                { l:'Tahun Berkas',    v:selected.tahun_berkas },
              ].map(f=>(
                <div key={f.l}>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{f.l}</p>
                  <p className={`text-slate-800 mt-0.5 ${f.mono?'font-mono text-blue-700 text-xs':''}`}>{f.v}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Perihal</p>
                <p className="text-slate-800 leading-relaxed">{selected.perihal}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
              <button className="btn-primary text-sm" onClick={()=>alert('Membuka PDF...')}>📄 Buka PDF</button>
              <button className="btn-secondary text-sm" onClick={()=>alert('Mengunduh...')}>⬇️ Unduh</button>
              <button className="btn-secondary text-sm" onClick={()=>alert('Cetak label arsip...')}>🖨️ Cetak Label</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArsipPage;
