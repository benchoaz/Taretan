import React, { useRef, useState, useEffect, useCallback } from 'react';

const CameraTimestampModal = ({ onClose, onCapture, user }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Menunggu lokasi...");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Template Settings
  const [showSettings, setShowSettings] = useState(false);
  const [optLogo, setOptLogo] = useState(true);
  const [titleText, setTitleText] = useState("Tugas Lapangan");
  const [optCoord, setOptCoord] = useState(true);
  const [optAddress, setOptAddress] = useState(true);
  const [notesText, setNotesText] = useState("Kondisi aman terkendali");
  
  // Camera State
  const [facingMode, setFacingMode] = useState('environment');

  // Keep time updated
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Start Camera
  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: facingMode,
            width: { ideal: 1920 }, // Memaksimalkan Tangkapan Resolusi Tinggi (1080p+)
            height: { ideal: 1080 } 
          }, 
          audio: false 
        });
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
             playPromise.catch(e => console.log("Play interrupted:", e));
          }
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      if (activeStream) activeStream.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [facingMode]);

  // Start GPS
  useEffect(() => {
    // Get GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            acc: pos.coords.accuracy,
          });
          // Mocking reverse geocoding for UI display
          setAddress(`Jl. Pahlawan Karya No. ${Math.floor(Math.random()*100)}, Pusat Pemerintahan, Indonesia`);
        },
        (err) => setAddress("GPS Gagal / Tidak Aktif"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setAddress("GPS tidak didukung");
    }
  }, []);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Canvas drawing helper
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw Camera Frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Context scaling to make text look good on high-res camera
    const scale = canvas.width / 1080;
    ctx.scale(scale, scale);

    const paddingX = 40;
    let currentY = 1080 * (canvas.height / canvas.width) - 60; // Bottom up drawing

    // Draw Notes
    if (notesText) {
      currentY -= 40;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      drawRoundedRect(ctx, paddingX, currentY, 1000, 50, 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px "Inter", sans-serif';
      ctx.fillText(`Catatan: ${notesText}`, paddingX + 20, currentY + 33);
      currentY -= 20;
    }

    // Draw Coordinates
    if (optCoord && location) {
      currentY -= 40;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Inter", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
      ctx.fillText(`Lat: ${location.lat.toFixed(6)}  Lng: ${location.lng.toFixed(6)}`, paddingX, currentY + 30);
      ctx.shadowBlur = 0;
      currentY -= 10;
    }

    // Draw Address
    if (optAddress) {
      currentY -= 45;
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px "Inter", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
      ctx.fillText(address, paddingX, currentY + 35);
      ctx.shadowBlur = 0;
      currentY -= 20;
    }

    // Draw Date
    currentY -= 45;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
    const dateStr = currentTime.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    ctx.fillText(dateStr, paddingX, currentY + 35);
    ctx.shadowBlur = 0;
    currentY -= 20;

    // Draw Title Badge (Yellow)
    if (titleText) {
      currentY -= 70;
      ctx.fillStyle = '#facc15'; // Yellow 400
      const timeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const badgeText = `${titleText.toUpperCase()} ${timeStr}`;
      ctx.font = 'bold 42px "Inter", sans-serif';
      const textWidth = ctx.measureText(badgeText).width;
      
      drawRoundedRect(ctx, paddingX, currentY, textWidth + 40, 70, 12);
      ctx.fillStyle = '#1e293b'; // Slate 800
      ctx.fillText(badgeText, paddingX + 20, currentY + 50);
      currentY -= 20;
    }

    // Logo
    if (optLogo) {
      currentY -= 100;
      ctx.fillStyle = '#2563eb'; // Blue 600
      drawRoundedRect(ctx, paddingX, currentY, 100, 100, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px serif';
      ctx.fillText("T", paddingX + 30, currentY + 70);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onCapture(dataUrl, location);
  }, [location, address, currentTime, optLogo, titleText, optCoord, optAddress, notesText, onCapture]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans">
      {/* Top Header */}
      <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => setShowSettings(true)} className="p-2 text-white">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex gap-4 text-white">
          {/* Tombol Flip Camera */}
          <button onClick={toggleCamera} className="active:scale-95 transition-transform bg-black/40 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Video Preview */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-zinc-900 object-cover">
        {!stream && <p className="text-white/50 text-sm">Menghubungkan kamera...</p>}
        <video 
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          playsInline
          muted
        />
        
        {/* HTML LIVE PREVIEW OVERLAY (Matches Canvas Output logically) */}
        {stream && (
          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-1 z-10 pointer-events-none drop-shadow-md">
            
            {optLogo && (
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl mb-2 shadow-lg">
                T
              </div>
            )}
            
            {titleText && (
              <div className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-md font-bold text-sm tracking-tight shadow-md flex items-center gap-1 mb-1">
                <span>{titleText.toUpperCase()}</span>
                <span>{currentTime.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
            )}
            
            <p className="text-white font-bold text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {currentTime.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            
            {optAddress && (
              <p className="text-white text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] max-w-[85%] leading-tight mt-1">
                {address}
              </p>
            )}

            {optCoord && (
              <p className="text-white text-[10px] font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mt-1">
                Lat: {location ? location.lat.toFixed(6) : '-'} Lng: {location ? location.lng.toFixed(6) : '-'}
              </p>
            )}

            {notesText && (
              <div className="mt-2 bg-black/60 rounded-md px-3 py-1.5 text-white text-[10px] w-full border border-white/10 backdrop-blur-sm">
                Catatan: {notesText}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Bottom Controls (Native App Style) */}
      <div className="h-44 bg-black flex flex-col items-center justify-between pb-8 pt-4 z-20">
        <div className="flex items-center gap-8 text-xs font-medium text-white mb-4">
          <span className="text-yellow-400 font-bold">PHOTO</span>
          <span className="text-white/50">VIDEO</span>
        </div>
        
        <div className="w-full flex items-center justify-around px-8">
          <button onClick={onClose} className="flex flex-col items-center gap-1 text-white/80 active:scale-95 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="text-[9px]">Kembali</span>
          </button>

          <button 
            onClick={handleCapture}
            disabled={!stream}
            className="w-20 h-20 rounded-full border-[3px] border-white flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
          >
            <div className="w-16 h-16 rounded-full bg-white"></div>
          </button>

          <button onClick={() => setShowSettings(true)} className="flex flex-col items-center gap-1 text-white/80 active:scale-95 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            <span className="text-[9px]">Templat</span>
          </button>
        </div>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Settings Modal Slide-Up */}
      {showSettings && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSettings(false)}></div>
          <div className="bg-white rounded-t-3xl p-5 pb-8 animate-fade-in-up z-10 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-lg">Edit Templat</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400">✕</button>
            </div>
            
            <div className="space-y-4">
              {/* Toggles */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 text-sm">Tampilkan Logo</span>
                <input type="checkbox" checked={optLogo} onChange={e => setOptLogo(e.target.checked)} className="w-5 h-5 accent-yellow-500 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 text-sm">Tampilkan Koordinat</span>
                <input type="checkbox" checked={optCoord} onChange={e => setOptCoord(e.target.checked)} className="w-5 h-5 accent-yellow-500 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 text-sm">Tampilkan Alamat</span>
                <input type="checkbox" checked={optAddress} onChange={e => setOptAddress(e.target.checked)} className="w-5 h-5 accent-yellow-500 rounded" />
              </div>

              {/* Text Inputs */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Judul Overlay</label>
                <input 
                  type="text" 
                  value={titleText} 
                  onChange={e => setTitleText(e.target.value)}
                  className="w-full border-b-2 border-slate-200 focus:border-yellow-500 outline-none py-2 font-medium text-slate-800"
                  placeholder="Misal: MASUK, TUGAS LAPANGAN"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Catatan Tambahan</label>
                <input 
                  type="text" 
                  value={notesText} 
                  onChange={e => setNotesText(e.target.value)}
                  className="w-full border-b-2 border-slate-200 focus:border-yellow-500 outline-none py-2 font-medium text-slate-800 text-sm"
                  placeholder="Tambahkan teks..."
                />
              </div>
            </div>

            <button onClick={() => setShowSettings(false)} className="w-full bg-yellow-400 text-slate-900 font-bold py-3.5 rounded-xl mt-6 active:scale-95 transition-transform">
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraTimestampModal;
