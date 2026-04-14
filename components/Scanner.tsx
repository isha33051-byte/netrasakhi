
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, RefreshCw, Zap, Info } from 'lucide-react';

interface ScannerProps {
  onCapture: (image: string) => void;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("Position finger/face inside frame");
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setScanStatus("Camera permission denied");
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    setScanStatus("Analyzing nail texture...");

    // Simulated scanning sequence
    const statuses = [
      "Detecting color abnormalities...",
      "Processing health indicators...",
      "Cross-referencing symptoms...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < statuses.length) {
        setScanStatus(statuses[i]);
        i++;
      } else {
        clearInterval(interval);
        const canvas = canvasRef.current!;
        const video = videoRef.current!;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }, 1200);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top Bar */}
      <div className="p-4 flex justify-between items-center text-white bg-black/50 backdrop-blur-md">
        <button onClick={onCancel} className="p-2 rounded-full bg-white/10">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest">Live Screening</h2>
          <p className="text-[10px] opacity-60">Netrasakhi AI Assistant</p>
        </div>
        <button onClick={toggleCamera} className="p-2 rounded-full bg-white/10">
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-gray-900 flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        
        {/* Guiding Frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
            
            {isScanning && <div className="scan-line"></div>}
            
            {/* Center Guide for Nails */}
            {!isScanning && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 flex flex-col items-center">
                <Zap className="w-12 h-12 text-white mb-2" />
                <span className="text-[10px] text-white font-bold text-center">Place finger or face here</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Overlay */}
        <div className="absolute bottom-12 left-0 right-0 px-6 flex flex-col items-center gap-4">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            {isScanning ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Info className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-xs font-semibold text-gray-800">{scanStatus}</span>
          </div>

          {!isScanning && (
            <button 
              onClick={handleCapture}
              className="w-16 h-16 rounded-full border-4 border-white bg-blue-600 shadow-xl flex items-center justify-center active:scale-90 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-white opacity-20"></div>
            </button>
          )}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Scanner;
