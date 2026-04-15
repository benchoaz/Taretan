import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const CameraTestPage = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const takePhoto = async () => {
    setLoading(true);
    setError(null);
    try {
      const image = await Camera.getPhoto({
        quality: 100, // Max quality
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera, // Force use camera
        saveToGallery: true
      });

      setPhoto(image.webPath);
    } catch (err) {
      setError("Gagal mengambil gambar: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white font-sans">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
            📷
          </div>
          <div>
            <h1 className="text-xl font-bold">Native Camera Test</h1>
            <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">Zimpen Mobile Engine v1.0</p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="aspect-[3/4] w-full bg-slate-800 rounded-[2rem] border-2 border-slate-700 overflow-hidden relative flex flex-col items-center justify-center shadow-2xl">
          {photo ? (
            <img src={photo} alt="Result" className="w-full h-full object-cover animate-fade-in" />
          ) : (
            <div className="text-center space-y-4 px-8">
              <div className="text-5xl opacity-20">🖼️</div>
              <p className="text-sm text-slate-500 italic">Belum ada foto yang diambil. Gunakan tombol di bawah untuk mulai menguji kamera native.</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <button 
            onClick={takePhoto}
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? 'Membuka Kamera...' : 'Jepret Foto Native'}
          </button>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Specs Table */}
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-500 mb-1">IMAGE QUALITY</p>
            <p className="font-bold text-white">MAX (100%)</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-500 mb-1">GALLERY SYNC</p>
            <p className="font-bold text-green-400">ENABLED</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-500 mb-1">AUTO EDIT</p>
            <p className="font-bold text-white">SYSTEM DEFAULT</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-500 mb-1">PLATFORM</p>
            <p className="font-bold text-blue-400">ANDROID KOTLIN</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraTestPage;
