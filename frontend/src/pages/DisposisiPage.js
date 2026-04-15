import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MOCK_DISPOSISI, MOCK_SURAT_MASUK, MOCK_USERS,
  JENIS_DISPOSISI_OPTIONS, ROLE_LABELS, ROLE_COLORS,
  getDisposisiForUser, getDisposisiChain,
} from '../data/mockData';
import CameraTimestampModal from '../components/CameraTimestampModal';

const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-';
const daysLeft = d => Math.ceil((new Date(d) - Date.now()) / 86400000);

// ── Status Badge ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const m = { pending:'badge-pending', proses:'badge-proses', selesai:'badge-selesai', ditunda:'badge-ditunda', dikembalikan:'badge-dikembalikan' };
  const l = { pending:'Pending', proses:'Diproses', selesai:'Selesai', ditunda:'Ditunda', dikembalikan:'Dikembalikan' };
  return <span className={`badge ${m[status]||'badge-pending'}`}>{l[status]||status}</span>;
};

const PrioritasBadge = ({ p }) => {
  const m = { tinggi:'badge-tinggi', sedang:'badge-sedang', rendah:'badge-rendah' };
  const icons = { tinggi:'🔴', sedang:'🟡', rendah:'🟢' };
  return <span className={`badge ${m[p]}`}>{icons[p]} {p?.charAt(0).toUpperCase()+p?.slice(1)}</span>;
};

// ── Avatar bubble ─────────────────────────────────────────────────────────
const Avatar = ({ user, size = 'sm' }) => {
  const sz = size === 'lg' ? 'w-10 h-10 text-sm' : 'w-7 h-7 text-xs';
  return (
    <div className={`${sz} rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {user?.avatar || '?'}
    </div>
  );
};

// ── Disposisi Tree (visual chain) ─────────────────────────────────────────
const DisposisiChainView = ({ rootId }) => {
  const buildTree = (nodes, parentId) =>
    nodes.filter(n => n.parent_disposisi_id === parentId)
         .map(n => ({ ...n, children: buildTree(nodes, n.id) }));

  const tree = buildTree(MOCK_DISPOSISI, null).filter(n => n.id === rootId);

  const TreeNode = ({ node, depth = 0 }) => {
    const dl = node.batas_waktu ? daysLeft(node.batas_waktu) : null;
    const urgentDl = dl !== null && dl <= 2 && node.status !== 'selesai';

    return (
      <div className={`relative ${depth > 0 ? 'ml-8 mt-3 pl-4 border-l-2 border-dashed border-slate-200' : ''}`}>
        <div className={`rounded-xl border p-3.5 transition-all duration-200 hover:shadow-md ${
          node.status === 'selesai' ? 'bg-green-50 border-green-200' :
          node.status === 'proses'  ? 'bg-blue-50 border-blue-200' :
          node.status === 'ditunda' ? 'bg-slate-50 border-slate-200' :
          urgentDl                  ? 'bg-red-50 border-red-200' :
          'bg-white border-slate-200'
        }`}>
          {/* Header row */}
          <div className="flex items-start gap-3">
            <Avatar user={node.dari_user} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-800">{node.dari_user?.nama?.split(',')[0]}</span>
                <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <Avatar user={node.ke_user} />
                <span className="text-xs font-bold text-slate-800">{node.ke_user?.nama?.split(',')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${ROLE_COLORS[node.ke_user?.role]}`}>
                  {ROLE_LABELS[node.ke_user?.role]}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 italic">"{node.instruksi}"</p>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{node.jenis_disposisi}</span>
                <StatusBadge status={node.status} />
                <PrioritasBadge p={node.prioritas} />
                {node.batas_waktu && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    urgentDl ? 'bg-red-100 text-red-700' : dl <= 7 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    ⏰ {dl !== null && dl <= 0 ? 'LEWAT BATAS' : dl !== null && dl <= 0 ? 'Hari ini' : `${dl}h · ${fmtDate(node.batas_waktu)}`}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400 whitespace-nowrap">
              <div>Level {node.level}</div>
              <div className="mt-0.5">{new Date(node.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})}</div>
            </div>
          </div>

          {/* Laporan hasil (if any) */}
          {node.laporan_hasil?.length > 0 && (
            <div className="mt-2.5 pt-2.5 border-t border-current/10 space-y-2">
              {node.laporan_hasil.map(lap => (
                <div key={lap.id} className="text-xs bg-white/60 rounded-lg p-2.5 border border-current/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-700 font-semibold">📊 Laporan Hasil</span>
                    <span className={`badge text-[10px] ${lap.status_verifikasi==='terverifikasi'?'badge-selesai':'badge-pending'}`}>
                      {lap.status_verifikasi}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-snug">{lap.uraian}</p>
                  {lap.foto_url && (
                    <div className="mt-2">
                       <img src={lap.foto_url} alt="Laporan Foto" className="w-full max-w-sm rounded-lg border border-slate-200" />
                    </div>
                  )}
                  {lap.latitude && (
                    <a href={`https://maps.google.com/?q=${lap.latitude},${lap.longitude}`} target="_blank" rel="noreferrer"
                       className="text-blue-600 hover:underline text-[10px] mt-1.5 inline-block">📍 Lihat Lokasi</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Children */}
        {node.children?.map(child => (
          <TreeNode key={child.id} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return tree.length > 0 ? <TreeNode node={tree[0]} /> : null;
};

// ── Create Disposisi Modal ────────────────────────────────────────────────
const CreateDisposisiModal = ({ onClose, onSave, parentDisposisi }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    surat_id: parentDisposisi?.surat_id || '',
    ke_user_id: '',
    instruksi: '',
    jenis_disposisi: 'Untuk Ditindaklanjuti',
    batas_waktu: '',
    prioritas: 'sedang',
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  // Filter eligible recipients based on hierarchy
  const eligibleUsers = MOCK_USERS.filter(u => {
    if (u.id === user?.id) return false;
    const hierarchy = ['kepala_dinas','kepala_bidang','kepala_seksi','staf','operator'];
    const myIdx     = hierarchy.indexOf(user?.role);
    const theirIdx  = hierarchy.indexOf(u.role);
    return theirIdx > myIdx;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dari = MOCK_USERS.find(u => u.id === user?.id);
    const ke   = MOCK_USERS.find(u => u.id === form.ke_user_id);
    const surat = MOCK_SURAT_MASUK.find(s => s.id === form.surat_id);
    onSave({
      ...form,
      id: 'disp_' + Date.now(),
      parent_disposisi_id: parentDisposisi?.id || null,
      level: parentDisposisi ? (parentDisposisi.level + 1) : 0,
      dari_user_id: user?.id, dari_user: dari,
      ke_user: ke, surat,
      status: 'pending',
      laporan_hasil: [],
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl card p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {parentDisposisi ? '↪ Teruskan Disposisi' : '+ Buat Disposisi Baru'}
            </h3>
            {parentDisposisi && (
              <p className="text-xs text-blue-600 mt-0.5">
                Sub-disposisi dari: <strong>{parentDisposisi.dari_user?.nama?.split(',')[0]}</strong>
              </p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-lg">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!parentDisposisi && (
            <div>
              <label className="input-label">Surat Masuk *</label>
              <select className="input-field" value={form.surat_id} onChange={e=>set('surat_id',e.target.value)} required>
                <option value="">— Pilih surat masuk —</option>
                {MOCK_SURAT_MASUK.map(s=>(
                  <option key={s.id} value={s.id}>{s.nomor_surat} — {s.perihal.slice(0,50)}…</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="input-label">Kepada *</label>
            <select className="input-field" value={form.ke_user_id} onChange={e=>set('ke_user_id',e.target.value)} required>
              <option value="">— Pilih penerima disposisi —</option>
              {eligibleUsers.map(u=>(
                <option key={u.id} value={u.id}>
                  [{ROLE_LABELS[u.role]}] {u.nama.split(',')[0]} – {u.unit_kerja}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Jenis Disposisi *</label>
            <select className="input-field" value={form.jenis_disposisi} onChange={e=>set('jenis_disposisi',e.target.value)}>
              {JENIS_DISPOSISI_OPTIONS.map(j=><option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          <div>
            <label className="input-label">Instruksi / Catatan *</label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="Tuliskan instruksi yang jelas dan terukur..."
              value={form.instruksi} onChange={e=>set('instruksi',e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Batas Waktu</label>
              <input type="date" className="input-field" value={form.batas_waktu} onChange={e=>set('batas_waktu',e.target.value)} min={new Date().toISOString().slice(0,10)} />
            </div>
            <div>
              <label className="input-label">Prioritas</label>
              <select className="input-field" value={form.prioritas} onChange={e=>set('prioritas',e.target.value)}>
                <option value="rendah">🟢 Rendah</option>
                <option value="sedang">🟡 Sedang</option>
                <option value="tinggi">🔴 Tinggi</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">📋 Kirim Disposisi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Disposisi Page ───────────────────────────────────────────────────
const DisposisiPage = () => {
  const { user, canCreateDisposisi } = useAuth();
  const [dispList, setDispList]       = useState(MOCK_DISPOSISI);
  const [tab,      setTab]            = useState('masuk');
  const [showCreate, setShowCreate]   = useState(false);
  const [showForward, setShowForward] = useState(null);
  const [viewTree, setViewTree]       = useState(null);
  const [showCamera, setShowCamera]   = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const myDisp = getDisposisiForUser(user?.id, user?.role);
  const dispMasuk  = myDisp.filter(d => d.ke_user_id === user?.id);
  const dispKeluar = myDisp.filter(d => d.dari_user_id === user?.id);

  const displayed = (tab === 'masuk' ? dispMasuk : tab === 'keluar' ? dispKeluar : myDisp)
    .filter(d => !filterStatus || d.status === filterStatus);

  // Root disposisi (for tree view)
  const rootDisposisi = dispList.filter(d => !d.parent_disposisi_id);

  const handleCreate = (newDisp) => setDispList(l => [newDisp, ...l]);

  const handleCaptureLaporan = (dataUrl, location) => {
    if (showCamera) {
      setDispList(list => list.map(d => {
        if (d.id === showCamera.id) {
          return {
            ...d,
            laporan_hasil: [
              ...d.laporan_hasil,
              {
                id: 'lap_' + Date.now(),
                disposisi_id: d.id, user_id: user?.id, user: user,
                uraian: 'Laporan visual hasil tindak lanjut lapangan.',
                foto_url: dataUrl,
                latitude: location?.lat || null, longitude: location?.lng || null,
                tanggal_lapor: new Date().toISOString().slice(0,10),
                status_verifikasi: 'pending',
                created_at: new Date().toISOString()
              }
            ],
            // Optionally auto mark as finished: 
            // status: 'selesai', tanggal_selesai: new Date().toISOString()
          };
        }
        return d;
      }));
    }
    setShowCamera(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📋</div>
          <div>
            <h2 className="font-bold text-slate-800">Disposisi Berjenjang</h2>
            <p className="text-xs text-slate-500">Alur instruksi sesuai hierarki jabatan</p>
          </div>
        </div>
        {canCreateDisposisi() && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">+ Buat Disposisi</button>
        )}
      </div>

      {/* Tab selector */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit animate-fade-in-up delay-1">
        {[
          { key:'masuk',  label:`📥 Masuk (${dispMasuk.length})` },
          { key:'keluar', label:`📤 Dikirim (${dispKeluar.length})` },
          { key:'semua',  label:`📋 Semua (${myDisp.length})` },
          { key:'pohon',  label:'🌳 Pohon Disposisi' },
        ].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab===t.key ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-500 hover:text-slate-700'
            }`}>{t.label}
          </button>
        ))}
      </div>

      {/* Tree view ─────────────────────────────────────────────────────── */}
      {tab === 'pohon' ? (
        <div className="space-y-4 animate-fade-in-up">
          <div className="card p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
              <span>🌳</span>
              Pohon disposisi menampilkan alur hierarkis dari Kepala Dinas hingga Staf Pelaksana
            </p>
          </div>
          {rootDisposisi.map(root => (
            <div key={root.id} className="card p-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                <div>
                  <p className="text-xs font-mono text-blue-600 font-semibold">{root.surat?.nomor_surat}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{root.surat?.perihal?.slice(0,60)}…</p>
                </div>
                <StatusBadge status={root.status} />
              </div>
              <DisposisiChainView rootId={root.id} />
            </div>
          ))}
        </div>
      ) : (
        /* List view ──────────────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="card p-3 flex gap-3 animate-fade-in-up delay-2">
            {['','pending','proses','selesai','ditunda','dikembalikan'].map(s=>(
              <button key={s} onClick={()=>setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filterStatus===s?'bg-blue-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {s ? s.charAt(0).toUpperCase()+s.slice(1) : 'Semua'}
              </button>
            ))}
          </div>

          {displayed.length === 0 && (
            <div className="card p-12 text-center animate-fade-in-up">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-slate-500 font-medium">Tidak ada disposisi</p>
              <p className="text-slate-400 text-sm mt-1">Belum ada disposisi yang sesuai filter</p>
            </div>
          )}

          {displayed.map((d, i) => {
            const dl = d.batas_waktu ? daysLeft(d.batas_waktu) : null;
            const urgent = dl !== null && dl <= 2 && d.status !== 'selesai';
            return (
              <div key={d.id}
                className={`card p-5 animate-fade-in-up hover:shadow-md transition-all duration-200 ${urgent?'border-red-300 bg-red-50/30':''}`}
                style={{ animationDelay: `${i*0.05}s`, opacity:0 }}>
                <div className="flex items-start gap-4">
                  <Avatar user={tab==='masuk'?d.dari_user:d.ke_user} size="lg" />
                  <div className="flex-1 min-w-0">
                    {/* Surat info */}
                    <p className="text-[10px] font-mono text-blue-600 font-semibold">{d.surat?.nomor_surat}</p>
                    <h4 className="font-semibold text-slate-800 text-sm mt-0.5 truncate">{d.surat?.perihal}</h4>

                    {/* Sender/receiver */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-slate-500">
                        {tab==='masuk' ? 'Dari:' : 'Kepada:'} <span className="font-semibold text-slate-700">
                          {(tab==='masuk'?d.dari_user:d.ke_user)?.nama?.split(',')[0]}
                        </span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${ROLE_COLORS[(tab==='masuk'?d.dari_user:d.ke_user)?.role]}`}>
                        {ROLE_LABELS[(tab==='masuk'?d.dari_user:d.ke_user)?.role]}
                      </span>
                    </div>

                    {/* Instruksi */}
                    <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 rounded-lg p-2 border border-slate-100">
                      "{d.instruksi?.slice(0,120)}{d.instruksi?.length>120?'…':''}"
                    </p>

                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap mt-2.5">
                      <StatusBadge status={d.status} />
                      <PrioritasBadge p={d.prioritas} />
                      <span className="badge bg-slate-100 border-slate-200 text-slate-600">{d.jenis_disposisi}</span>
                      {d.batas_waktu && (
                        <span className={`badge ${urgent?'badge-tinggi':dl<=7?'badge-sedang':'badge-rendah'}`}>
                          ⏰ {dl<=0?'LEWAT BATAS':`${dl}h · ${fmtDate(d.batas_waktu)}`}
                        </span>
                      )}
                      {d.level > 0 && (
                        <span className="badge bg-purple-50 text-purple-700 border-purple-200">Level {d.level}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={()=>setViewTree(d.id)} className="btn-ghost text-xs py-1">🌳 Pohon</button>
                    {d.status==='proses' && tab==='masuk' && (
                      <button onClick={()=>setShowCamera(d)} className="btn-primary text-xs py-1">📷 Kamera Laporan</button>
                    )}
                    {canCreateDisposisi() && d.status==='proses' && tab==='masuk' && (
                      <button onClick={()=>setShowForward(d)} className="btn-secondary text-xs py-1">↪ Teruskan</button>
                    )}
                    {d.status==='pending' && tab==='masuk' && (
                      <button onClick={() => {
                        setDispList(l => l.map(x => x.id === d.id ? { ...x, status: 'proses' } : x));
                      }} className="btn-primary text-xs py-1">✅ Proses</button>
                    )}
                    {d.laporan_hasil?.length > 0 && (
                      <span className="text-[10px] text-center text-green-600 font-medium">
                        📊 {d.laporan_hasil.length} laporan
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mini tree modal for single item */}
      {viewTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setViewTree(null)} />
          <div className="relative w-full max-w-3xl card p-6 animate-scale-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Pohon Disposisi</h3>
              <button onClick={()=>setViewTree(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-lg">×</button>
            </div>
            <DisposisiChainView rootId={viewTree} />
          </div>
        </div>
      )}

      {showCreate  && <CreateDisposisiModal onClose={()=>setShowCreate(false)}  onSave={handleCreate} />}
      {showForward && <CreateDisposisiModal onClose={()=>setShowForward(null)}  onSave={handleCreate} parentDisposisi={showForward} />}
      {showCamera  && <CameraTimestampModal onClose={()=>setShowCamera(null)}   onCapture={handleCaptureLaporan} user={user} />}
    </div>
  );
};

export default DisposisiPage;
