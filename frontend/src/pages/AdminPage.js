import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, MOCK_LOG_AKTIVITAS, ROLE_LABELS, ROLE_COLORS, MOCK_OPD } from '../data/mockData';

const fmtDateTime = d => d
  ? new Date(d).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})
  : '-';

const PERMISSIONS = [
  { id:'surat.view',            label:'Lihat Surat',                    roles:['kepala_dinas','kepala_bidang','kepala_seksi','staf','operator'] },
  { id:'surat.create',          label:'Input Surat Masuk/Keluar',       roles:['operator','kepala_dinas','kepala_bidang'] },
  { id:'disposisi.view',        label:'Lihat Disposisi',                roles:['kepala_dinas','kepala_bidang','kepala_seksi','staf'] },
  { id:'disposisi.create',      label:'Buat/Teruskan Disposisi',        roles:['kepala_dinas','kepala_bidang','kepala_seksi'] },
  { id:'laporan.upload',        label:'Upload Laporan Hasil',           roles:['staf'] },
  { id:'laporan.verify',        label:'Verifikasi Laporan',             roles:['kepala_dinas','kepala_bidang','kepala_seksi'] },
  { id:'arsip.view',            label:'Lihat Arsip Digital',            roles:['kepala_dinas','kepala_bidang','kepala_seksi','staf','operator'] },
  { id:'arsip.manage',          label:'Kelola Arsip',                   roles:['operator','kepala_dinas'] },
  { id:'monitoring.view',       label:'Dashboard Monitoring',           roles:['kepala_dinas','kepala_bidang','kepala_seksi','staf','operator'] },
  { id:'laporan.export',        label:'Ekspor Laporan PDF/Excel',       roles:['kepala_dinas','kepala_bidang'] },
  { id:'admin.user',            label:'Manajemen Pengguna',             roles:['kepala_dinas','operator'] },
  { id:'audit.view',            label:'Lihat Audit Trail',              roles:['kepala_dinas'] },
];

const ROLE_LIST = ['kepala_dinas','kepala_bidang','kepala_seksi','staf','operator'];

const AdminPage = () => {
  const { user } = useAuth();
  const [tab, setTab]         = useState('pengguna');
  const [users, setUsers]     = useState(MOCK_USERS);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch]   = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [verifyCode, setVerifyCode] = useState('');

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.nama.toLowerCase().includes(q) || u.nip.includes(q) || u.unit_kerja.toLowerCase().includes(q);
  });

  const requestAction = (action, label) => {
    setPendingAction({ action, label });
    setShowVerify(true);
    setVerifyCode('');
  };

  const handleToggleStatus = (id) => {
    const u = users.find(x => x.id === id);
    const newStatus = u.status === 'aktif' ? 'nonaktif' : 'aktif';
    requestAction(() => {
      setUsers(us => us.map(x => x.id === id ? { ...x, status: newStatus } : x));
      alert(`Status ${u.nama.split(',')[0]} berhasil diubah menjadi ${newStatus}`);
    }, `Ubah Status: ${u.nama.split(',')[0]}`);
  };

  // Add user form
  const AddUserModal = ({ onClose }) => {
    const [form, setForm] = useState({ nama:'', nip:'', email:'', jabatan:'', unit_kerja:'', role:'staf' });
    const set = (k,v) => setForm(f=>({...f,[k]:v}));
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg card p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800">Tambah Pengguna</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-lg">×</button>
          </div>
          <form onSubmit={e=>{
            e.preventDefault();
            requestAction(() => {
              setUsers(u=>[...u,{...form,id:'u_'+Date.now(),avatar:form.nama.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase(),status:'aktif',phone:''}]);
              onClose();
              alert(`Pengguna ${form.nama} berhasil didaftarkan.`);
            }, `Registrasi Pengguna Baru: ${form.nama}`);
          }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="input-label">Nama Lengkap *</label>
                <input className="input-field" value={form.nama} onChange={e=>set('nama',e.target.value)} required placeholder="Nama lengkap beserta gelar" />
              </div>
              <div>
                <label className="input-label">NIP *</label>
                <input className="input-field font-mono" value={form.nip} onChange={e=>set('nip',e.target.value)} required placeholder="18 digit NIP" maxLength={18} />
              </div>
              <div>
                <label className="input-label">Email *</label>
                <input type="email" className="input-field" value={form.email} onChange={e=>set('email',e.target.value)} required />
              </div>
              <div className="col-span-2">
                <label className="input-label">Jabatan</label>
                <input className="input-field" value={form.jabatan} onChange={e=>set('jabatan',e.target.value)} placeholder="Jabatan struktural" />
              </div>
              <div>
                <label className="input-label">Unit Kerja</label>
                <input className="input-field" value={form.unit_kerja} onChange={e=>set('unit_kerja',e.target.value)} />
              </div>
              <div>
                <label className="input-label">Role / Peran *</label>
                <select className="input-field" value={form.role} onChange={e=>set('role',e.target.value)}>
                  {ROLE_LIST.map(r=><option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
              <button type="submit" className="btn-primary">💾 Simpan Pengguna</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚙️</div>
          <div>
            <h2 className="font-bold text-slate-800">Administrasi Sistem</h2>
            <p className="text-xs text-slate-500">Manajemen pengguna, peran, dan audit trail</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit animate-fade-in-up delay-1">
        {[
          { k:'pengguna', l:'👤 Pengguna' },
          { k:'organisasi', l:'🏢 Organisasi' },
          { k:'peran',    l:'🔐 Hak Akses' },
          { k:'pengaturan', l:'⚙️ Pengaturan' },
          { k:'audit',    l:'📜 Audit Trail' },
        ].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t.k?'bg-white shadow-sm text-slate-800 font-semibold':'text-slate-500 hover:text-slate-700'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* TAB: ORGANISASI (OPD) ────────────────────────── */}
      {tab==='organisasi' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Struktur Organisasi (OPD)</h3>
              <p className="text-xs text-slate-500">Kelola hirarki dinas, bidang, s.d kecamatan</p>
            </div>
            <button className="btn-primary" onClick={() => alert('Tambah Unit Kerja Baru')}>+ Unit Baru</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <p className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                📂 Bagan Hirarki
              </p>
              <div className="space-y-3">
                {MOCK_OPD.map(opd => (
                  <div key={opd.id} className="border-l-2 border-blue-200 pl-4 py-1">
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{opd.nama} <span className="text-[10px] font-mono text-blue-500">({opd.kode})</span></p>
                        <p className="text-[10px] text-slate-400">Level: {opd.level === 0 ? 'Kabupaten/Pusat' : 'OPD/Kecamatan'}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                        <button className="text-[10px] text-blue-600 font-bold hover:underline">Edit</button>
                        <button className="text-[10px] text-slate-400 font-bold hover:underline">+</button>
                      </div>
                    </div>
                    {opd.children && (
                      <div className="mt-2 space-y-2 ml-4">
                        {opd.children.map(child => (
                          <div key={child.id} className="flex items-center justify-between p-2 border border-slate-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                            <span className="text-xs text-slate-600">└─ {child.nama}</span>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                              <button className="text-[10px] text-blue-600">✏️</button>
                              <button className="text-[10px] text-red-500">🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5 bg-slate-50 border-dashed border-2 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-3xl mb-4">🌳</div>
              <h4 className="font-bold text-slate-800">Visualisasi Modular</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-[280px]">
                Struktur ini akan menentukan alur disposisi otomatis dan format penomoran surat di tiap jenjang.
              </p>
              <button className="mt-6 text-blue-600 font-bold text-sm border-b border-blue-600">Buka Visual Designer Mode</button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PENGGUNA ─────────────────────────────────── */}
      {tab==='pengguna' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex gap-3">
            <input className="input-field flex-1" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="🔍 Cari nama, NIP, atau unit kerja..." />
            <button onClick={()=>setShowAdd(true)} className="btn-primary">+ Tambah Pengguna</button>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="tbl-head text-left">#</th>
                    <th className="tbl-head text-left">Pengguna</th>
                    <th className="tbl-head text-left">NIP</th>
                    <th className="tbl-head text-left">Jabatan</th>
                    <th className="tbl-head text-left">Unit Kerja</th>
                    <th className="tbl-head text-left">Peran</th>
                    <th className="tbl-head text-left">Status</th>
                    <th className="tbl-head text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u,i)=>(
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="tbl-row text-slate-400 text-xs">{i+1}</td>
                      <td className="tbl-row">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">{u.avatar}</div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{u.nama.split(',')[0]}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="tbl-row font-mono text-xs text-slate-600">{u.nip}</td>
                      <td className="tbl-row text-xs text-slate-600">{u.jabatan}</td>
                      <td className="tbl-row text-xs text-slate-500">
                        {MOCK_OPD.find(o => o.id === u.unit_id)?.nama || u.unit_kerja}
                      </td>
                      <td className="tbl-row">
                        <span className={`badge ${ROLE_COLORS[u.role]} text-xs`}>{ROLE_LABELS[u.role]}</span>
                      </td>
                      <td className="tbl-row">
                        <button onClick={()=>handleToggleStatus(u.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${u.status!=='nonaktif'?'bg-green-500':'bg-slate-300'}`}>
                          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${u.status!=='nonaktif'?'translate-x-4.5':'translate-x-1'}`} style={{transform:u.status!=='nonaktif'?'translateX(18px)':'translateX(2px)'}} />
                        </button>
                        <p className="text-[10px] text-slate-400 mt-0.5 text-center">{u.status!=='nonaktif'?'Aktif':'Nonaktif'}</p>
                      </td>
                      <td className="tbl-row">
                        <div className="flex gap-1">
                          <button className="btn-ghost text-xs py-1">Edit</button>
                          <button 
                            onClick={() => requestAction(() => alert(`Password ${u.nama.split(',')[0]} telah direset.`), `Reset Password: ${u.nama.split(',')[0]}`)}
                            className="btn-ghost text-xs py-1 text-red-500 hover:bg-red-50"
                          >
                            Reset PW
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: HAK AKSES / RBAC ────────────────────────── */}
      {tab==='peran' && (
        <div className="card overflow-hidden animate-fade-in-up">
          <div className="px-5 py-4 border-b border-slate-100 bg-amber-50">
            <p className="text-sm text-amber-700 font-medium">🔐 Matrix Hak Akses per Peran — ✅ Diizinkan · ❌ Tidak Diizinkan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="tbl-head text-left w-56">Hak Akses</th>
                  {ROLE_LIST.map(r=>(
                    <th key={r} className="tbl-head text-center">
                      <span className={`badge ${ROLE_COLORS[r]} text-[10px]`}>{ROLE_LABELS[r]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map(p=>(
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/40">
                    <td className="tbl-row">
                      <p className="text-sm font-medium text-slate-800">{p.label}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.id}</p>
                    </td>
                    {ROLE_LIST.map(r=>(
                      <td key={r} className="tbl-row text-center">
                        {p.roles.includes(r)
                          ? <span className="text-green-600 text-lg">✅</span>
                          : <span className="text-slate-300 text-lg">❌</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PENGATURAN (TEMPLATES) ──────────────────── */}
      {tab==='pengaturan' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              📄 Template Penomoran Surat
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Template Surat Masuk', id: 'tmpl_masuk', pattern: '{klas}/{no}/{unit}/{year}' },
                { label: 'Template Surat Keluar', id: 'tmpl_keluar', pattern: '{klas}/{no}/{unit}/{year}' },
              ].map(t => (
                <div key={t.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-sm font-bold text-slate-700">{t.label}</label>
                    <p className="text-[10px] text-slate-400 mt-0.5 italic">Gunakan: &#123;klas&#125;, &#123;no&#125;, &#123;unit&#125;, &#123;year&#125;</p>
                    <div className="mt-3">
                      <input className="input-field font-mono text-sm" defaultValue={t.pattern} />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Live Preview Result</p>
                    <p className="font-mono text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                      421.1 / 0001 / SETDA / 2026
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button className="btn-primary" onClick={() => requestAction(() => alert('Pengaturan berhasil disimpan.'), 'Simpan Konfigurasi Penomoran')}>
                💾 Simpan Konfigurasi
              </button>
            </div>
          </div>

          <div className="card p-6 bg-slate-900 text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2">📱 Field Mode Integration</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Konfigurasi di atas akan otomatis disinkronkan ke aplikasi lapangan (Mobile Mode). <br/>
              Pastikan field <strong>&#123;unit&#125;</strong> sesuai dengan kode OPD masing-masing sekretariat.
            </p>
            <div className="flex gap-2">
              <span className="badge bg-green-500/20 text-green-400 border-green-500/30">Synced</span>
              <span className="badge bg-blue-500/20 text-blue-400 border-blue-500/30">V2.4.0-Modular</span>
            </div>
          </div>
        </div>
      )}
      {tab==='audit' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="card p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
              📜 Audit trail mencatat semua aktivitas pengguna sesuai Perka ANRI dan standar keamanan BSN SNI ISO 27001
            </p>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="tbl-head text-left">#</th>
                    <th className="tbl-head text-left">Waktu</th>
                    <th className="tbl-head text-left">Pengguna</th>
                    <th className="tbl-head text-left">Peran</th>
                    <th className="tbl-head text-left">Aktivitas</th>
                    <th className="tbl-head text-left">IP Address</th>
                    <th className="tbl-head text-left">Ref ID</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LOG_AKTIVITAS.map((log,i)=>(
                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="tbl-row text-slate-400 text-xs">{i+1}</td>
                      <td className="tbl-row text-xs whitespace-nowrap text-slate-600">{fmtDateTime(log.created_at)}</td>
                      <td className="tbl-row">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs">{log.user?.avatar}</div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{log.user?.nama?.split(',')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="tbl-row">
                        <span className={`badge text-[10px] ${ROLE_COLORS[log.user?.role]}`}>{ROLE_LABELS[log.user?.role]}</span>
                      </td>
                      <td className="tbl-row text-xs text-slate-700 max-w-xs">
                        <p className="truncate">{log.aktivitas}</p>
                      </td>
                      <td className="tbl-row font-mono text-xs text-slate-500">{log.ip_address}</td>
                      <td className="tbl-row font-mono text-[10px] text-blue-600 truncate max-w-[100px]">{log.referensi_id || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400">Total {MOCK_LOG_AKTIVITAS.length} log aktivitas</p>
              <button className="btn-ghost text-xs text-blue-600" onClick={()=>alert('Ekspor audit log...')}>📊 Ekspor Log</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && <AddUserModal onClose={()=>setShowAdd(false)} />}

      {/* ───────────────────────────────────────────────────────────── 
          Verification Modal (Two-Man Rule Simulator)
          ───────────────────────────────────────────────────────────── */}
      {showVerify && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowVerify(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl animate-scale-in border border-slate-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-slate-800">Verifikasi Diperlukan</h3>
              <p className="text-sm text-slate-500 mt-2">
                Tindakan kritis terdeteksi: <br/>
                <span className="font-bold text-slate-700">"{pendingAction?.label}"</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">🔐 Otorisasi Pimpinan (PIN)</p>
                <input 
                  type="password" 
                  className="w-full bg-white border-2 border-slate-200 rounded-xl py-4 text-center text-2xl font-mono tracking-[1em] focus:border-blue-500 outline-none transition-all"
                  placeholder="****"
                  maxLength={4}
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="bg-blue-50 text-blue-700 text-[10px] p-3 rounded-lg border border-blue-100 leading-relaxed">
                ℹ️ Masukkan PIN 4 digit yang dikirimkan ke perangkat Kepala Dinas (Demo: <strong>1234</strong>) untuk menyetujui tindakan ini.
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowVerify(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >Batal</button>
                <button 
                  onClick={() => {
                    if (verifyCode === '1234') {
                      pendingAction.action();
                      setShowVerify(false);
                      // Log to mock audit 
                      console.log(`[AUDIT] Action Verified & Executed: ${pendingAction.label}`);
                    } else {
                      alert("Kode Verifikasi Salah! Otorisasi ditolak.");
                    }
                  }}
                  className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                >Verifikasi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
