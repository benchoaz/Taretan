import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CameraTimestampModal from '../components/CameraTimestampModal';

const MobileDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  
  // States for Laporan Flow
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedLocation, setCapturedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTasks, setActiveTasks] = useState([
    { id: '1', nomor: '421.1/1234/KCD/2026', perihal: 'Survei Lapangan 1', owner: 'Dewi R.' },
    { id: '2', nomor: '005/789/BKPSDM/2026', perihal: 'Rapat Koordinasi', owner: 'Rizky F.' },
    { id: '3', nomor: '170/567/SETDA/2026', perihal: 'Inventarisasi Mobiler', owner: 'Agus W.' },
  ]);

  const handleCaptureLaporan = (dataUrl, location) => {
    setCapturedImage(dataUrl);
    setCapturedLocation(location);
    setShowCamera(false);
  };

  const submitLaporan = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi API Delay
    setTimeout(() => {
      setIsSubmitting(false);
      setCapturedImage(null);
      alert("Laporan E-Kinerja berhasil dikirim!");
      navigate('/disposisi'); 
    }, 1500);
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#f8fafc] flex flex-col font-sans mb-16 relative">
      {/* ───────────────────────────────────────────────────────────── 
          Form Laporan E-Kinerja (Aktif jika ada Foto Terambil) 
          ───────────────────────────────────────────────────────────── */}
      {capturedImage && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col font-sans animate-fade-in-up">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
            <button onClick={() => setCapturedImage(null)} className="p-2 text-slate-500 font-bold active:scale-95 transition-transform text-sm flex items-center gap-1">
              ← Kembali
            </button>
            <h2 className="font-bold text-slate-800">Buat Laporan</h2>
            <div className="w-16"></div> {/* Spacer */}
          </div>
          
          <div className="flex-1 overflow-y-auto p-5">
             <div className="bg-slate-100 p-2 rounded-2xl mb-5 shadow-inner">
               <img src={capturedImage} alt="Bukti Kegiatan" className="w-full h-auto rounded-xl" />
             </div>
             
             <form onSubmit={submitLaporan} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nomor Disposisi / Tugas</label>
                  <select 
                    className="w-full mt-1 border-b-2 border-slate-200 focus:border-[#85a27a] outline-none py-2 font-semibold text-slate-800 bg-transparent text-sm" 
                    value={selectedTask?.id || ""}
                    onChange={(e) => {
                      const task = activeTasks.find(t => t.id === e.target.value);
                      setSelectedTask(task);
                    }}
                    required
                  >
                    <option value="">— Pilih Tugas Disposisi —</option>
                    {activeTasks.map(task => (
                      <option key={task.id} value={task.id}>{task.nomor} - {task.perihal}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Uraian / Output E-Kinerja</label>
                  <textarea 
                    rows={4}
                    className="w-full mt-1 border border-slate-200 rounded-xl focus:border-[#85a27a] focus:ring-1 focus:ring-[#85a27a] outline-none p-3 text-sm text-slate-700 bg-slate-50"
                    placeholder="Contoh: Mengikuti kegiatan hingga selesai. Dokumentasi terlampir..."
                    required
                  ></textarea>
                </div>

                <div className="bg-[#f0f9ff] text-blue-800 text-[10px] p-3 rounded-lg border border-blue-100 mt-2">
                  ℹ️ Laporan ini akan langsung dihitung sebagai poin E-Kinerja pada SKP bulanan Anda.
                </div>

                <div className="pt-8">
                  <button disabled={isSubmitting} type="submit" className="w-full py-4 rounded-xl font-bold bg-[#85a27a] text-white flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-[#85a27a]/30">
                    {isSubmitting ? 'Mengirim Data...' : 'Kirim Laporan E-Kinerja'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── 
          Dashboard Beranda (Aktif selalu) 
          ───────────────────────────────────────────────────────────── */}
      {/* Header */}
      <div className="flex items-center justify-between p-5 bg-white shrink-0 shadow-sm z-10 sticky top-0">
        <div>
          <h1 className="font-extrabold text-slate-800 text-xl tracking-tight leading-none uppercase">
            TARETAN SAE
          </h1>
          <p className="text-[#85a27a] text-[10px] font-bold mt-1 uppercase tracking-widest">
            melayani setulus hati
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-slate-500 font-medium text-sm">
            Hi, {user?.nama?.split(',')[0]}
          </p>
          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 overflow-x-hidden space-y-5 pb-24">
        {/* Green Dual Button Card */}
        <div className="bg-[#85a27a] rounded-3xl p-6 shadow-lg shadow-[#85a27a]/30 animate-fade-in-up">
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/disposisi')}
              className="bg-white rounded-full py-4 px-6 text-[#6c8562] font-bold text-sm w-full flex items-center justify-center gap-3 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <div className="w-5 h-5 rounded-full bg-[#85a27a] text-white flex items-center justify-center text-xs">+</div>
              Tambah Kegiatan
            </button>
            <button 
              onClick={() => setShowJoinModal(true)}
              className="bg-white rounded-full py-4 px-6 text-[#6c8562] font-bold text-sm w-full flex items-center justify-center gap-3 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Gabung Tim Lapangan
            </button>
          </div>
        </div>

        {/* Black Big Camera Button */}
        <div 
          onClick={() => setShowCamera(true)}
          className="bg-[#1c221e] rounded-3xl p-10 shadow-2xl shadow-black/20 flex flex-col items-center justify-center cursor-pointer hover:bg-[#141815] active:scale-95 transition-all text-center animate-fade-in-up delay-1 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
          <div className="relative z-10 w-24 h-24 rounded-full border-[3px] border-white flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform">
            <div className="w-20 h-20 rounded-full border-[1.5px] border-white/50 flex items-center justify-center bg-white/5 backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3.2" />
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-white text-xl font-extrabold tracking-wide mb-2 uppercase drop-shadow-md">Klik Kamera Cepat</h2>
          <p className="text-slate-400 text-[11px] font-medium leading-relaxed max-w-[200px]">
            Otomatis tambah Lokasi, Waktu, & GPS ke laporan
          </p>
        </div>
      </div>

      {/* Bottom Nav App Bar */}
      <div className="fixed bottom-0 inset-x-0 sm:max-w-md sm:mx-auto bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-slate-100 px-6 py-3 flex items-center justify-between z-20">
        
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center text-[#85a27a] font-bold pb-2 transition-colors">
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-[10px]">Beranda</span>
        </button>

        <button onClick={() => navigate('/disposisi')} className="flex flex-col items-center text-slate-400 font-medium hover:text-[#85a27a] pb-2 transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px]">Kegiatan</span>
        </button>

        {/* Floating action button (Center) */}
        <div className="relative pb-6 mx-2">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white p-1.5 rounded-full shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => setShowCamera(true)}
              className="w-14 h-14 bg-[#85a27a] rounded-full text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-[#85a27a]/30"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" fill="none"/>
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z" />
              </svg>
            </button>
          </div>
        </div>

        <button className="flex flex-col items-center text-slate-400 font-medium hover:text-[#85a27a] pb-2 transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px]">Inbox</span>
        </button>

        <button className="flex flex-col items-center text-slate-400 font-medium hover:text-[#85a27a] pb-2 transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px]">Akun</span>
        </button>
      </div>

      {showCamera && <CameraTimestampModal onClose={() => setShowCamera(false)} onCapture={handleCaptureLaporan} user={user} />}

      {/* ───────────────────────────────────────────────────────────── 
          Modal Gabung Tim Lapangan
          ───────────────────────────────────────────────────────────── */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] p-6 animate-fade-in-up shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-[#1c221e] text-lg uppercase tracking-tight">Gabung Tim Lapangan</h2>
              <button 
                onClick={() => setShowJoinModal(false)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold"
              >✕</button>
            </div>

            <p className="text-slate-500 text-xs mb-6 leading-relaxed">
              Pilih tugas rekan satu tim Anda untuk bergabung dan memberikan laporan kegiatan bersama.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {activeTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowJoinModal(false);
                    setShowCamera(true);
                  }}
                  className="p-4 rounded-2xl border-2 border-slate-100 hover:border-[#85a27a] hover:bg-[#85a27a]/5 transition-all cursor-pointer group active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-[#85a27a] bg-[#85a27a]/10 px-2 py-0.5 rounded-md uppercase tracking-wide">
                      {task.nomor}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">Owner: {task.owner}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#6c8562] transition-colors">{task.perihal}</h3>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#85a27a] uppercase">
                    <span>⚡ Ketuk untuk bergabung</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowJoinModal(false)}
              className="w-full mt-6 py-4 rounded-2xl bg-slate-800 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDashboardPage;
