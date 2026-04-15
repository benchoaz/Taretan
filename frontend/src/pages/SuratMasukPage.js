import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_SURAT_MASUK, KLASIFIKASI_ARSIP, MOCK_USERS, MOCK_OPD, generateNomorSurat } from '../data/mockData';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-';

const SifatBadge = ({ sifat }) => {
  const m = { segera:'badge-segera', penting:'badge-penting', biasa:'badge-biasa' };
  const l = { segera:'Segera', penting:'Penting', biasa:'Biasa' };
  return <span className={`badge ${m[sifat]||'badge-biasa'}`}>{l[sifat]||sifat}</span>;
};

const StatusBadge = ({ status }) => {
  const m = { pending:'badge-pending', proses:'badge-proses', selesai:'badge-selesai', ditunda:'badge-ditunda' };
  const l = { pending:'Belum', proses:'Diproses', selesai:'Selesai', ditunda:'Ditunda' };
  return <span className={`badge ${m[status]||'badge-pending'}`}>{l[status]||status}</span>;
};

// ── Modal: Add Surat Masuk ────────────────────────────────────────────────
const AddSuratModal = ({ onClose, onSave, initialData = null }) => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialData || {
    nomor_surat: '', tanggal_surat: '', tanggal_terima: new Date().toISOString().slice(0,10),
    asal_surat: '', perihal: '', sifat: 'biasa', klasifikasi_arsip: '420', file_pdf_url: null,
  });
  const [filePreview, setFilePreview] = useState(initialData?.file_pdf_url || null);

  const set = (k, v) => {
    setForm(f => {
      const newForm = { ...f, [k]: v };
      // Auto-generate number if classification changes and no number yet or explicitly wanted
      if (k === 'klasifikasi_arsip' && !initialData) {
        const userUnit = MOCK_OPD.find(o => o.id === user?.unit_id) || MOCK_OPD[0];
        const template = userUnit?.template || '{klas}/{no}/UNIT/{year}';
        newForm.nomor_surat = generateNomorSurat(template, { 
          klasifikasi: v, 
          nomor_urut: '0001', // Ideally fetch from DB
          unit_kode: userUnit?.kode || 'UNIT'
        });
      }
      return newForm;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreview(ev.target.result);
        set('file_pdf_url', ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      onSave({ ...form, updated_at: new Date().toISOString() });
    } else {
      onSave({ ...form, id: 'sm_new_' + Date.now(), created_by: user?.id, status_disposisi: 'pending', created_at: new Date().toISOString() });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl card p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Input Surat Masuk</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sesuai format Permendagri No. 54/2009</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-lg">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="input-label">Nomor Surat *</label>
              <input className="input-field font-mono" placeholder="421.1/0001/INSTANSI/2026"
                value={form.nomor_surat} onChange={e => set('nomor_surat', e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Tanggal Surat *</label>
              <input type="date" className="input-field" value={form.tanggal_surat}
                onChange={e => set('tanggal_surat', e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Tanggal Terima *</label>
              <input type="date" className="input-field" value={form.tanggal_terima}
                onChange={e => set('tanggal_terima', e.target.value)} required />
            </div>
            <div className="col-span-2">
              <label className="input-label">Asal Surat / Instansi Pengirim *</label>
              <input className="input-field" placeholder="Nama instansi pengirim"
                value={form.asal_surat} onChange={e => set('asal_surat', e.target.value)} required />
            </div>
            <div className="col-span-2">
              <label className="input-label">Perihal Surat *</label>
              <textarea className="input-field resize-none" rows={3} placeholder="Isi perihal surat..."
                value={form.perihal} onChange={e => set('perihal', e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Sifat Surat</label>
              <select className="input-field" value={form.sifat} onChange={e => set('sifat', e.target.value)}>
                <option value="biasa">Biasa</option>
                <option value="penting">Penting</option>
                <option value="segera">Segera</option>
              </select>
            </div>
            <div>
              <label className="input-label">Klasifikasi Arsip (ANRI)</label>
              <select className="input-field" value={form.klasifikasi_arsip} onChange={e => set('klasifikasi_arsip', e.target.value)}>
                {KLASIFIKASI_ARSIP.map(k => (
                  <option key={k.kode} value={k.kode}>{k.kode} — {k.nama}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="input-label">Upload / Scan Dokumen Fisik *</label>
              {!filePreview ? (
                <label className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors cursor-pointer bg-slate-50/50 relative overflow-hidden group">
                  <input type="file" accept="image/*,application/pdf" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} required />
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📸</span>
                  </div>
                  <p className="text-slate-700 font-semibold text-sm">Scan Surat Fisik (Kamera) atau Upload PDF</p>
                  <p className="text-slate-400 text-xs mt-1">Gunakan HP Anda untuk langsung menyecan surat tanpa alat scanner</p>
                </label>
              ) : (
                <div className="w-full border border-slate-200 rounded-xl p-3 flex items-start gap-4 bg-white relative">
                  <button type="button" onClick={() => { setFilePreview(null); set('file_pdf_url', null); }} className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs hover:bg-red-200">×</button>
                  <div className="w-16 h-20 rounded shadow-sm overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                    {filePreview.startsWith('data:image') 
                      ? <img src={filePreview} alt="Preview Surat" className="w-full h-full object-cover" /> 
                      : <span className="text-slate-400 text-xs">PDF</span>}
                  </div>
                  <div className="flex-1 mt-1">
                    <p className="text-sm font-semibold text-slate-800">✅ Berkas berhasil dipindai</p>
                    <p className="text-xs text-slate-500 mt-0.5">Dokumen akan dilampirkan otomatis ke Surat Masuk.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">💾 Simpan Surat Masuk</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────
const SuratMasukPage = () => {
  const { canInputSurat } = useAuth();
  const [suratList, setSuratList] = useState(MOCK_SURAT_MASUK);
  const [showAdd, setShowAdd]     = useState(false);
  const [editingSurat, setEditingSurat] = useState(null);
  const [search, setSearch]       = useState('');
  const [filterSifat, setFilterSifat]     = useState('');
  const [filterStatus, setFilterStatus]   = useState('');
  const [selected, setSelected]           = useState(null);

  const filtered = suratList.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.nomor_surat.toLowerCase().includes(q) || s.perihal.toLowerCase().includes(q) || s.asal_surat.toLowerCase().includes(q);
    const matchSifat   = !filterSifat   || s.sifat === filterSifat;
    const matchStatus  = !filterStatus  || s.status_disposisi === filterStatus;
    return matchQ && matchSifat && matchStatus;
  });

  const handleAdd = (surat) => setSuratList(l => [surat, ...l]);
  const handleUpdate = (surat) => {
    setSuratList(l => l.map(s => s.id === surat.id ? surat : s));
    if (selected?.id === surat.id) setSelected(surat);
    setEditingSurat(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-2xl">📨</div>
            <div>
              <h2 className="font-bold text-slate-800">Agenda Surat Masuk</h2>
              <p className="text-xs text-slate-500">{suratList.length} surat terdaftar</p>
            </div>
          </div>
        </div>
        {canInputSurat() && (
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            + Input Surat Masuk
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 animate-fade-in-up delay-1">
        <div className="flex flex-col sm:flex-row gap-3">
          <input className="input-field flex-1" placeholder="🔍 Cari nomor surat, perihal, atau instansi..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input-field w-full sm:w-40" value={filterSifat} onChange={e => setFilterSifat(e.target.value)}>
            <option value="">Semua Sifat</option>
            <option value="biasa">Biasa</option>
            <option value="penting">Penting</option>
            <option value="segera">Segera</option>
          </select>
          <select className="input-field w-full sm:w-44" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="pending">Belum Disposisi</option>
            <option value="proses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
          {(search || filterSifat || filterStatus) && (
            <button className="btn-ghost" onClick={() => { setSearch(''); setFilterSifat(''); setFilterStatus(''); }}>Reset</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden animate-fade-in-up delay-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="tbl-head text-left w-8">#</th>
                <th className="tbl-head text-left w-6"></th>
                <th className="tbl-head text-left">Nomor Surat</th>
                <th className="tbl-head text-left">Perihal</th>
                <th className="tbl-head text-left">Asal Surat</th>
                <th className="tbl-head text-left">Tgl Terima</th>
                <th className="tbl-head text-left">Sifat</th>
                <th className="tbl-head text-left">Klasifikasi</th>
                <th className="tbl-head text-left">Status</th>
                <th className="tbl-head text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-slate-400 text-sm">Tidak ada data surat masuk</td></tr>
              )}
              {filtered.map((s, i) => (
                <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${selected?.id === s.id ? 'bg-blue-50/40' : ''}`}>
                  <td className="tbl-row text-slate-400 text-xs">{i + 1}</td>
                  <td className="tbl-row text-center">
                    {s.file_pdf_url && s.file_pdf_url !== '#' ? <span className="text-blue-500" title="Ada Dokumen Fisik">📎</span> : ''}
                  </td>
                  <td className="tbl-row font-mono text-xs text-blue-700 font-semibold whitespace-nowrap">{s.nomor_surat}</td>
                  <td className="tbl-row max-w-xs">
                    <p className="truncate font-medium text-slate-800">{s.perihal}</p>
                  </td>
                  <td className="tbl-row max-w-[180px]">
                    <p className="truncate text-slate-600 text-xs">{s.asal_surat}</p>
                  </td>
                  <td className="tbl-row text-xs whitespace-nowrap">{fmtDate(s.tanggal_terima)}</td>
                  <td className="tbl-row"><SifatBadge sifat={s.sifat} /></td>
                  <td className="tbl-row text-xs font-mono text-slate-500">{s.klasifikasi_arsip || '-'}</td>
                  <td className="tbl-row"><StatusBadge status={s.status_disposisi} /></td>
                  <td className="tbl-row">
                    <div className="flex items-center gap-1.5">
                      <button className="btn-ghost text-xs py-1 px-2" onClick={() => setSelected(s)}>Detail</button>
                      <button className="btn-ghost text-xs py-1 px-2 text-amber-600" onClick={() => setEditingSurat(s)}>Edit</button>
                      {s.file_pdf_url && s.file_pdf_url !== '#' && (
                        <a href={s.file_pdf_url} target="_blank" rel="noreferrer" className="btn-ghost text-xs py-1 px-2 text-blue-600">PDF</a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Menampilkan {filtered.length} dari {suratList.length} surat</p>
          <div className="flex gap-1">
            <button className="btn-ghost text-xs py-1 px-2 text-slate-400">← Prev</button>
            <button className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white">1</button>
            <button className="btn-ghost text-xs py-1 px-2 text-slate-400">Next →</button>
          </div>
        </div>
      </div>

      {/* Detail side panel */}
      {selected && (
        <div className="card p-5 animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-slate-800">Detail Surat Masuk</h3>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm content-start">
              {[
                { label: 'Nomor Surat',      value: selected.nomor_surat, mono: true },
                { label: 'Tanggal Surat',    value: fmtDate(selected.tanggal_surat) },
                { label: 'Tanggal Terima',   value: fmtDate(selected.tanggal_terima) },
                { label: 'Asal Surat',       value: selected.asal_surat },
                { label: 'Klasifikasi ANRI', value: `${selected.klasifikasi_arsip} — ${KLASIFIKASI_ARSIP.find(k=>k.kode===selected.klasifikasi_arsip)?.nama||'-'}` },
                { label: 'Sifat',            value: selected.sifat },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{f.label}</p>
                  <p className={`text-slate-800 mt-0.5 ${f.mono ? 'font-mono text-blue-700' : ''}`}>{f.value}</p>
                </div>
              ))}
              <div className="col-span-1 sm:col-span-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Perihal</p>
                <p className="text-slate-800 mt-0.5 leading-relaxed">{selected.perihal}</p>
              </div>
            </div>
            
            {/* Document display side */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col min-h-[300px]">
               <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-600 uppercase">Dokumen Fisik</span>
               </div>
               <div className="flex-1 flex items-center justify-center p-2">
                 {selected.file_pdf_url && selected.file_pdf_url !== '#' ? (
                   (selected.file_pdf_url.startsWith('data:image') || selected.file_pdf_url.match(/\.(jpeg|jpg|png|gif)$/i))
                     ? <img src={selected.file_pdf_url} alt="Scan Dokumen" className="w-full h-full object-contain max-h-[500px]" />
                     : <div className="text-center">
                         <span className="text-4xl block mb-2">📄</span>
                         <p className="text-slate-500 text-sm font-medium">Dokumen PDF Terlampir</p>
                         <a href={selected.file_pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 text-xs mt-2 hover:underline inline-block">Buka / Unduh</a>
                       </div>
                 ) : (
                   <p className="text-slate-400 text-sm">Tidak ada dokumen dipindai</p>
                 )}
               </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            <button className="btn-primary text-sm" onClick={() => alert('Arahkan ke halaman Buat Disposisi')}>📋 Buat Disposisi</button>
            <button className="btn-secondary text-sm" onClick={() => setEditingSurat(selected)}>✏️ Edit Surat</button>
            <button className="btn-secondary text-sm" onClick={() => alert('Download PDF')}>📄 Unduh PDF</button>
          </div>
        </div>
      )}

      {showAdd && <AddSuratModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {editingSurat && <AddSuratModal onClose={() => setEditingSurat(null)} onSave={handleUpdate} initialData={editingSurat} />}
    </div>
  );
};

export default SuratMasukPage;
