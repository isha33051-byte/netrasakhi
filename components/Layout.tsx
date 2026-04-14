
import React, { useState } from 'react';
import { Home, Camera, FileText, MessageSquare, Menu, Users, HeartPulse, X, Store, UserCheck, Settings, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMenu: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onOpenMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'chemists', label: 'Chemists nearby', icon: Store },
    { id: 'ashas', label: 'ASHA workers nearby', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Side Menu Drawer */}
      <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="gov-gradient p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white p-2 rounded-xl">
                 <Users className="text-blue-900 w-6 h-6" />
              </div>
              <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <h2 className="text-xl font-bold">Netrasakhi Menu</h2>
            <p className="text-xs opacity-80">Serving Bahirwadi (Khed)</p>
          </div>
          <div className="flex-1 p-4 space-y-2">
            {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  onOpenMenu(item.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 text-gray-700 font-bold transition-colors"
              >
                <item.icon className="w-5 h-5 text-blue-600" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="p-6 border-t text-[10px] text-gray-400 font-medium">
            Version 2.4.0 • Ministry of Health MH
          </div>
        </div>
      </div>

      {/* Gov Header */}
      <header className="gov-gradient text-white shadow-md z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl shadow-inner">
                <div className="relative w-8 h-8 flex items-center justify-center">
                   <Users className="text-blue-900 w-6 h-6 absolute -top-1" />
                   <HeartPulse className="text-red-500 w-4 h-4 absolute bottom-0" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight leading-none">Netrasakhi</h1>
                <p className="text-[9px] uppercase font-medium opacity-90 tracking-wider">Health & Family Welfare • MH</p>
              </div>
            </div>
            <button onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6 opacity-80" />
            </button>
          </div>
          <div className="text-[10px] flex justify-between items-center opacity-70 border-t border-white/20 pt-2 mt-1 font-medium">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              ABDM Integrated
            </span>
            <span>Bahirwadi (Khed)</span>
          </div>
        </div>
        
        {/* Gov Marquee */}
        <div className="bg-blue-800 py-1 overflow-hidden">
          <div className="animate-marquee text-[10px] font-bold text-blue-100 flex items-center gap-8">
            <span>• मोफत आरोग्य तपासणी शिबिर दि. २२ ऑक्टोबर रोजी जिल्हा परिषदेत •</span>
            <span>• मुलांमधील ॲनिमिया प्रतिबंध मोहीम सुरू झाली आहे •</span>
            <span>• पावसाळी आजारांपासून सावध रहा, लक्षणे दिसल्यास एएनएम ला संपर्क करा •</span>
            <span>• स्वच्छ भारत - स्वस्थ भारत •</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 flex justify-around py-3 px-2 z-10 shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-700 font-bold scale-110' : 'text-gray-400'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[9px]">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('records')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'records' ? 'text-blue-700 font-bold scale-110' : 'text-gray-400'}`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-[9px]">Records</span>
        </button>
        <button 
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center gap-1 -mt-10 bg-blue-700 p-4 rounded-full text-white shadow-xl ring-4 ring-white transition-all active:scale-90 hover:bg-blue-800`}
        >
          <Camera className="w-7 h-7" />
        </button>
        <button 
          onClick={() => setActiveTab('predictor')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'predictor' ? 'text-blue-700 font-bold scale-110' : 'text-gray-400'}`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-[9px]">SakhiPredictor</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'chat' ? 'text-blue-700 font-bold scale-110' : 'text-gray-400'}`}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-[9px]">Support</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
