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
    setTimeout(() => {
      setIsSubmitting(false);
      setCapturedImage(null);
      alert("Laporan berhasil dikirim!");
      navigate('/disposisi'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col font-sans pb-32 animate-ios-slide">
      
      {/* iOS HEADER AREA */}
      <div className="ios-glass sticky top-0 z-40 px-5 pt-12 pb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
            <img src={`https://ui-avatars.com/api/?name=${user?.nama}&background=random`} alt="profile" />
          </div>
        </div>
        <h1 className="text-[34px] font-extrabold tracking-tight text-black leading-tight">Beranda</h1>
      </div>

      {/* MAIN CONTENT (SCROLLABLE) */}
      <div className="flex-1 px-5 space-y-6 mt-4">
        
        {/* ACTION CARDS */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/disposisi')}
            className="ios-card p-6 flex flex-col items-center justify-center gap-3 text-center transition-all bg-white"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-2xl">
              📝
            </div>
            <span className="text-xs font-bold text-slate-800">Tambah Kegiatan</span>
          </button>
          
          <button 
            onClick={() => setShowJoinModal(true)}
            className="ios-card p-6 flex flex-col items-center justify-center gap-3 text-center transition-all bg-white"
          >
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-2xl">
              👥
            </div>
            <span className="text-xs font-bold text-slate-800">Gabung Tim</span>
          </button>
        </div>

        {/* LARGE CAMERA WIDGET (iPHONE STYLE) */}
        <div 
          onClick={() => setShowCamera(true)}
          className="ios-card relative overflow-hidden h-64 group active:scale-[0.97]"
        >
          <div className="absolute inset-0 bg-slate-900">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-400/30 transition-colors"></div>
          </div>
          
          <div className="relative z-20 h-full p-8 flex flex-col justify-end items-start">
            <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center mb-4 bg-white/10 backdrop-blur-sm shadow-xl">
              <span className="text-3xl">📸</span>
            </div>
            <h2 className="text-white text-2xl font-bold tracking-tight">Kamera Cepat</h2>
            <p className="text-white/60 text-sm mt-1">Jepret & Lapor Otomatis</p>
          </div>
        </div>

        {/* RECENT ACTIVITY LIST (iOS STYLE) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold text-black">Tugas Aktif</h3>
            <button className="text-blue-600 text-sm font-semibold">Lihat Semua</button>
          </div>
          
          <div className="ios-card divide-y divide-slate-50 overflow-hidden">
            {activeTasks.map(task => (
              <div 
                key={task.id} 
                className="p-4 flex items-center gap-4 active:bg-slate-50 transition-colors"
                onClick={() => { setSelectedTask(task); setShowCamera(true); }}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                  📄
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-blue-600 uppercase mb-0.5">{task.nomor}</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{task.perihal}</p>
                </div>
                <div className="text-slate-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TECH TEST LINK */}
        <div className="pb-10 pt-4">
          <button 
            onClick={() => navigate('/camera-test')}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-bold text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
          >
            <span>⚙️ PENGUJIAN KAMERA NATIVE (KOTLIN)</span>
          </button>
        </div>
      </div>

      {/* iOS BOTTOM TAB BAR */}
      <div className="ios-glass fixed bottom-0 left-0 right-0 h-24 px-8 pt-3 flex justify-between items-start border-t border-slate-200/50 z-50">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <div className="w-6 h-6 flex items-center justify-center text-xl">🏠</div>
          <span className="text-[10px] font-bold">Beranda</span>
        </button>
        <button onClick={() => navigate('/disposisi')} className="flex flex-col items-center gap-1 text-slate-400">
          <div className="w-6 h-6 flex items-center justify-center text-xl">📥</div>
          <span className="text-[10px] font-bold">Kegiatan</span>
        </button>
        <button onClick={() => setShowCamera(true)} className="flex flex-col items-center -mt-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 text-2xl active:scale-90 transition-transform">
            ⚡
          </div>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <div className="w-6 h-6 flex items-center justify-center text-xl">🔔</div>
          <span className="text-[10px] font-bold">Notifikasi</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <div className="w-6 h-6 flex items-center justify-center text-xl">👤</div>
          <span className="text-[10px] font-bold">Profil</span>
        </button>
      </div>

      {/* LAPORAN MODAL WRAPPER (iOS STYLE) */}
      {capturedImage && (
        <div className="fixed inset-0 z-[100] bg-white animate-ios-slide">
           <div className="ios-glass sticky top-0 flex items-center justify-between p-4">
              <button onClick={() => setCapturedImage(null)} className="text-blue-600 font-bold">Batal</button>
              <h2 className="font-bold text-black">Laporan Baru</h2>
              <div className="w-10"></div>
           </div>
           
           <div className="p-5 space-y-6 overflow-y-auto h-full">
              <div className="ios-card overflow-hidden">
                <img src={capturedImage} alt="Bukti" className="w-full h-auto" />
              </div>
              
              <form onSubmit={submitLaporan} className="space-y-4">
                 <div className="ios-card p-4">
                    <label className="text-[10px] font-bold text-blue-600 uppercase mb-2 block">Pilih Tugas</label>
                    <select 
                      className="w-full bg-transparent font-semibold outline-none text-sm"
                      onChange={(e) => setSelectedTask(activeTasks.find(t => t.id === e.target.value))}
                      required
                    >
                      <option value="">-- Pilih Tugas --</option>
                      {activeTasks.map(t => <option key={t.id} value={t.id}>{t.perihal}</option>)}
                    </select>
                 </div>
                 
                 <div className="ios-card p-4">
                    <label className="text-[10px] font-bold text-blue-600 uppercase mb-2 block">Uraian E-Kinerja</label>
                    <textarea 
                      className="w-full bg-transparent text-sm outline-none" 
                      rows={4} 
                      placeholder="Apa yang Anda kerjakan?"
                      required
                    ></textarea>
                 </div>

                 <button 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                 >
                   {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {showCamera && <CameraTimestampModal onClose={() => setShowCamera(false)} onCapture={handleCaptureLaporan} user={user} />}
      
      {/* JOIN MODAL (iOS ACTION SHEET STYLE) */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end p-4 animate-fade-in">
          <div className="w-full bg-[#F9F9F9] rounded-[2rem] overflow-hidden animate-ios-slide">
            <div className="p-6">
              <h2 className="text-xl font-bold text-black text-center mb-2">Gabung Tim</h2>
              <p className="text-center text-slate-500 text-sm mb-6 px-4">Pilih kegiatan rekan Anda untuk memberikan laporan bersama.</p>
              
              <div className="space-y-2">
                {activeTasks.map(task => (
                  <button 
                    key={task.id}
                    onClick={() => { setShowJoinModal(false); setShowCamera(true); }}
                    className="w-full p-4 bg-white rounded-2xl font-bold text-sm text-blue-600 active:bg-blue-50 transition-colors"
                  >
                    {task.perihal}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-2 border-t border-slate-200">
              <button onClick={() => setShowJoinModal(false)} className="w-full py-4 font-bold text-red-500">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDashboardPage;
