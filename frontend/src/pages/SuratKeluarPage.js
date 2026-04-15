import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_SURAT_KELUAR, KLASIFIKASI_ARSIP, MOCK_OPD, generateNomorSurat } from '../data/mockData';

const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-';

const StatusBadge = ({ status }) => {
  const cfg = {
    draft:    { cls: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Draft' },
    dikirim:  { cls: 'bg-blue-50 text-blue-700 border-blue-200',     label: 'Dalam Proses' },
    terkirim: { cls: 'bg-green-50 text-green-700 border-green-200',  label: 'Terkirim' },
  };
  const c = cfg[status] || cfg.draft;
  return <span className={`badge ${c.cls}`}>{c.label}</span>;
};

const SifatBadge = ({ sifat }) => {
  const m = { segera:'badge-segera', penting:'badge-penting', biasa:'badge-biasa' };
  return <span className={`badge ${m[sifat]||'badge-biasa'}`}>{sifat?.charAt(0).toUpperCase()+sifat?.slice(1)}</span>;
};

const AddModal = ({ onClose, onSave, initialData = null }) => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialData || {
    nomor_surat:'', tanggal_surat: new Date().toISOString().slice(0,10),
    tujuan_surat:'', perihal:'', sifat:'biasa', klasifikasi_arsip:'420', status:'draft',
    file_pdf_url: null,
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
          nomor_urut: 'XXXX',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl card p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Buat Surat Keluar</h3>
            <p className="text-xs text-slate-500">Penomeran otomatis sesuai sistem TARETAN</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-lg">×</button>
        </div>
        <form onSubmit={e=>{
          e.preventDefault();
          if (initialData) {
            onSave({...form, updated_at: new Date().toISOString()});
          } else {
            onSave({...form, id:'sk_'+Date.now(), created_at:new Date().toISOString()});
          }
          onClose();
        }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Nomor Surat</label>
              <input className="input-field font-mono" placeholder="420/XXX/DISDIK/2026"
                value={form.nomor_surat} onChange={e=>set('nomor_surat',e.target.value)} />
            </div>
            <div>
              <label className="input-label">Tanggal Surat *</label>
              <input type="date" className="input-field" value={form.tanggal_surat}
                onChange={e=>set('tanggal_surat',e.target.value)} required />
            </div>
            <div className="col-span-2">
              <label className="input-label">Kepada / Tujuan *</label>
              <input className="input-field" placeholder="Nama instansi / pejabat penerima"
                value={form.tujuan_surat} onChange={e=>set('tujuan_surat',e.target.value)} required />
            </div>
            <div className="col-span-2">
              <label className="input-label">Perihal Surat *</label>
              <textarea className="input-field resize-none" rows={3}
                value={form.perihal} onChange={e=>set('perihal',e.target.value)} required
                placeholder="Isi perihal surat keluar..." />
            </div>
            <div>
              <label className="input-label">Sifat</label>
              <select className="input-field" value={form.sifat} onChange={e=>set('sifat',e.target.value)}>
                <option value="biasa">Biasa</option>
                <option value="penting">Penting</option>
                <option value="segera">Segera</option>
              </select>
            </div>
            <div>
              <label className="input-label">Klasifikasi Arsip (ANRI)</label>
              <select className="input-field" value={form.klasifikasi_arsip} onChange={e=>set('klasifikasi_arsip',e.target.value)}>
                {KLASIFIKASI_ARSIP.map(k=>(
                  <option key={k.kode} value={k.kode}>{k.kode} — {k.nama}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="input-label">Template / Lampiran *</label>
              {!filePreview ? (
                <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:border-blue-400 transition-colors relative group overflow-hidden">
                  <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} required />
                  <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-xl">📎</span>
                  </div>
                  <p className="text-slate-500 font-semibold text-sm">Upload draft surat (.docx / .pdf)</p>
                  <p className="text-slate-400 text-[10px] mt-1 italic">Klik area ini atau seret file ke sini</p>
                </label>
              ) : (
                <div className="w-full border border-slate-200 rounded-xl p-3 flex items-start gap-4 bg-white relative">
                  <button type="button" onClick={() => { setFilePreview(null); set('file_pdf_url', null); }} className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs hover:bg-red-200">×</button>
                  <div className="w-16 h-20 rounded shadow-sm overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                    {filePreview.startsWith('data:image') 
                      ? <img src={filePreview} alt="Preview" className="w-full h-full object-cover" /> 
                      : <span className="text-slate-400 text-xs font-bold">PDF</span>}
                  </div>
                  <div className="flex-1 mt-1">
                    <p className="text-sm font-semibold text-slate-800">✅ Draft berhasil diunggah</p>
                    <p className="text-xs text-slate-500 mt-0.5">Berkas telah siap untuk ditinjau pimpinan.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-secondary">💾 Simpan Draft</button>
            <button type="submit" className="btn-primary">✉️ Kirim untuk Persetujuan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Workflow steps indicator
const WorkflowSteps = ({ status }) => {
  const steps = [
    { key: 'draft',    label: 'Draft' },
    { key: 'dikirim',  label: 'Review Pimpinan' },
    { key: 'terkirim', label: 'Terkirim' },
  ];
  const idx = steps.findIndex(s=>s.key===status);
  return (
    <div className="flex items-center gap-1">
      {steps.map((s,i)=>(
        <React.Fragment key={s.key}>
          <div className={`flex items-center gap-1 text-[10px] font-semibold ${i<=idx?'text-blue-600':'text-slate-400'}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              i<idx?'bg-blue-600 border-blue-600':i===idx?'border-blue-600 bg-white':'border-slate-300 bg-white'}`}>
              {i<idx && <span className="text-white text-[8px]">✓</span>}
              {i===idx && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 block" />}
            </div>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i<steps.length-1 && <div className={`h-0.5 w-6 ${i<idx?'bg-blue-500':'bg-slate-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

const SuratKeluarPage = () => {
  const { canInputSurat } = useAuth();
  const [list,    setList]    = useState(MOCK_SURAT_KELUAR);
  const [showAdd, setShowAdd] = useState(false);
  const [editingSurat, setEditingSurat] = useState(null);
  const [search,  setSearch]  = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);

  const handleUpdate = (surat) => {
    setList(l => l.map(s => s.id === surat.id ? surat : s));
    if (selected?.id === surat.id) setSelected(surat);
    setEditingSurat(null);
  };

  const filtered = list.filter(s=>{
    const q = search.toLowerCase();
    return (!q || s.nomor_surat?.toLowerCase().includes(q) || s.perihal?.toLowerCase().includes(q) || s.tujuan_surat?.toLowerCase().includes(q))
        && (!filterStatus || s.status===filterStatus);
  });

  const counts = {
    draft: list.filter(s=>s.status==='draft').length,
    dikirim: list.filter(s=>s.status==='dikirim').length,
    terkirim: list.filter(s=>s.status==='terkirim').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📤</div>
          <div>
            <h2 className="font-bold text-slate-800">Agenda Surat Keluar</h2>
            <p className="text-xs text-slate-500">{list.length} surat diterbitkan</p>
          </div>
        </div>
        {canInputSurat() && (
          <button onClick={() => setShowAdd(true)} className="btn-primary">+ Buat Surat Keluar</button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in-up delay-1">
        {[
          { label:'Draft',          val:counts.draft,    cls:'bg-slate-100 text-slate-700',   icon:'📝' },
          { label:'Review Pimpinan',val:counts.dikirim,  cls:'bg-blue-50 text-blue-700',      icon:'🔍' },
          { label:'Terkirim',       val:counts.terkirim, cls:'bg-green-50 text-green-700',     icon:'✅' },
        ].map(c=>(
          <div key={c.label} onClick={()=>setFilterStatus(filterStatus===c.label.toLowerCase().split(' ')[0]?'':c.label.toLowerCase().split(' ')[0])}
               className={`card p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${c.cls}`}>
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="text-2xl font-black">{c.val}</p>
              <p className="text-xs font-semibold">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 animate-fade-in-up delay-2">
        <div className="flex gap-3">
          <input className="input-field flex-1" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍 Cari nomor surat, perihal, tujuan..." />
          <select className="input-field w-48" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="dikirim">Dalam Review</option>
            <option value="terkirim">Terkirim</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden animate-fade-in-up delay-3">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="tbl-head text-left w-8">#</th>
                <th className="tbl-head text-left"></th>
                <th className="tbl-head text-left">Nomor Surat</th>
                <th className="tbl-head text-left">Perihal</th>
                <th className="tbl-head text-left">Kepada</th>
                <th className="tbl-head text-left">Tgl Surat</th>
                <th className="tbl-head text-left">Sifat</th>
                <th className="tbl-head text-left">Alur</th>
                <th className="tbl-head text-left">Status</th>
                <th className="tbl-head text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 && (
                <tr><td colSpan={9} className="text-center py-12 text-slate-400 text-sm">Tidak ada surat keluar</td></tr>
              )}
              {filtered.map((s,i)=>(
                <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${selected?.id === s.id ? 'bg-blue-50/40' : ''}`}>
                  <td className="tbl-row text-slate-400 text-xs">{i+1}</td>
                  <td className="tbl-row text-center">
                    {s.file_pdf_url && s.file_pdf_url !== '#' ? <span className="text-blue-500" title="Ada Lampiran">📎</span> : ''}
                  </td>
                  <td className="tbl-row font-mono text-xs text-blue-700 font-semibold whitespace-nowrap">{s.nomor_surat}</td>
                  <td className="tbl-row max-w-xs"><p className="truncate font-medium">{s.perihal}</p></td>
                  <td className="tbl-row max-w-[180px]"><p className="truncate text-xs text-slate-500">{s.tujuan_surat}</p></td>
                  <td className="tbl-row text-xs whitespace-nowrap">{fmtDate(s.tanggal_surat)}</td>
                  <td className="tbl-row"><SifatBadge sifat={s.sifat} /></td>
                  <td className="tbl-row"><WorkflowSteps status={s.status} /></td>
                  <td className="tbl-row"><StatusBadge status={s.status} /></td>
                   <td className="tbl-row">
                    <div className="flex gap-1">
                      <button className="btn-ghost text-xs py-1 px-2" onClick={() => setSelected(s)}>Detail</button>
                      <button className="btn-ghost text-xs py-1 px-2 text-amber-600" onClick={() => setEditingSurat(s)}>Edit</button>
                      {s.status==='draft' && <button className="btn-primary text-xs py-1 px-2">Kirim</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail side panel */}
      {selected && (
        <div className="card p-5 animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-slate-800">Detail Surat Keluar</h3>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm content-start">
              {[
                { label: 'Nomor Surat',      value: selected.nomor_surat || '420/XXX/DISDIK/2026', mono: true },
                { label: 'Tanggal Surat',    value: fmtDate(selected.tanggal_surat) },
                { label: 'Tujuan Surat',     value: selected.tujuan_surat },
                { label: 'Klasifikasi ANRI', value: `${selected.klasifikasi_arsip} — ${KLASIFIKASI_ARSIP.find(k=>k.kode===selected.klasifikasi_arsip)?.nama||'-'}` },
                { label: 'Sifat',            value: selected.sifat },
                { label: 'Status',           value: selected.status.toUpperCase() },
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
                 <span className="text-xs font-bold text-slate-600 uppercase">Draft / Lampiran Dokumen</span>
               </div>
               <div className="flex-1 flex items-center justify-center p-2">
                 {selected.file_pdf_url && selected.file_pdf_url !== '#' ? (
                   (selected.file_pdf_url.startsWith('data:image') || selected.file_pdf_url.match(/\.(jpeg|jpg|png|gif)$/i))
                     ? <img src={selected.file_pdf_url} alt="Scan Dokumen" className="w-full h-full object-contain max-h-[500px]" />
                     : <div className="text-center">
                         <span className="text-4xl block mb-2">📄</span>
                         <p className="text-slate-500 text-sm font-medium">Draft Dokumen Terlampir</p>
                         <a href={selected.file_pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 text-xs mt-2 hover:underline inline-block">Buka / Unduh Berkas</a>
                       </div>
                 ) : (
                   <div className="text-center p-5">
                     <p className="text-slate-400 text-sm">Tidak ada berkas draft yang dilampirkan</p>
                     <p className="text-[10px] text-slate-300 mt-2 italic">Gunakan tombol edit untuk mengunggah draft baru.</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            {selected.status === 'draft' && <button className="btn-primary text-sm" onClick={() => alert('Kirim untuk persetujuan pimpinan')}>✉️ Kirim Sekarang</button>}
            <button className="btn-secondary text-sm" onClick={() => setEditingSurat(selected)}>✏️ Edit Surat</button>
            <button className="btn-secondary text-sm" onClick={() => alert('Download Draft')}>📄 Unduh Draft (.docx)</button>
          </div>
        </div>
      )}

      {showAdd && <AddModal onClose={()=>setShowAdd(false)} onSave={s=>setList(l=>[s,...l])} />}
      {editingSurat && <AddModal onClose={()=>setEditingSurat(null)} onSave={handleUpdate} initialData={editingSurat} />}
    </div>
  );
};

export default SuratKeluarPage;
