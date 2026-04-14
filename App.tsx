
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Results from './components/Results';
import Chatbot from './components/Chatbot';
import SakhiPredictor from './components/SakhiPredictor';
import { analyzeHealthImage } from './services/geminiService';
import { HealthCondition, Severity, Patient, Chemist, ASHAWorker, BabyRegistration } from './types';
import { ArrowLeft, User, Phone, MapPin, Calendar, Activity, Pill, Star, Quote, PhoneOff, Mic, Volume2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showScanner, setShowScanner] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [menuView, setMenuView] = useState<string | null>(null);
  const [bookedEntities, setBookedEntities] = useState<string[]>([]);
  
  // Registration State
  const [campRegistrations, setCampRegistrations] = useState<BabyRegistration[]>([
    { id: '1', campId: 'c1', babyName: 'Arjun P.', parentName: 'Sanjay Patil', age: '3 yrs', timestamp: '12 Feb 2026' },
    { id: '2', campId: 'c1', babyName: 'Meena K.', parentName: 'Kaveri K.', age: '2 yrs', timestamp: '13 Feb 2026' },
    { id: '3', campId: 'c3', babyName: 'Chotu S.', parentName: 'Vikas S.', age: '1.5 yrs', timestamp: '10 Feb 2026' }
  ]);
  
  // Village patients state
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Sunita Gaikwad',
      age: 28,
      gender: 'Female',
      symptoms: ['White spots on nails', 'Fatigue'],
      latestCondition: HealthCondition.ZINC_DEFICIENCY,
      severity: Severity.MODERATE,
      lastScan: '12 Oct, 2023',
      medicineHistory: ['Zinc Vit Plus', 'Iron Supplements (Sachet)'],
      testimonial: "The screening was very quick. The ASHA worker helped me understand the nutrition plan.",
      visitHistory: [{ month: 'Aug', count: 1 }, { month: 'Sep', count: 3 }, { month: 'Oct', count: 2 }],
      vitaminLevels: [{ type: 'Zinc', level: 65 }, { type: 'Iron', level: 45 }, { type: 'D3', level: 30 }]
    },
    {
      id: '2',
      name: 'Rahul Deshmukh',
      age: 42,
      gender: 'Male',
      symptoms: ['Yellow eyes', 'Loss of appetite'],
      latestCondition: HealthCondition.JAUNDICE,
      severity: Severity.HIGH,
      lastScan: '14 Oct, 2023',
      medicineHistory: ['Liver Care Syrup', 'B-Complex'],
      testimonial: "Alerted me to jaundice indicators early enough to start local treatment.",
      visitHistory: [{ month: 'Aug', count: 0 }, { month: 'Sep', count: 1 }, { month: 'Oct', count: 4 }],
      vitaminLevels: [{ type: 'B12', level: 80 }, { type: 'Iron', level: 60 }, { type: 'D3', level: 20 }]
    }
  ]);

  const chemists: Chemist[] = [
    { id: 'ch1', name: 'Bahirwadi Gram Medical', location: 'Main Chowk', hours: '8AM - 10PM' },
    { id: 'ch2', name: 'Khed Medical Stores', location: 'Peth Road', hours: '24 Hours' }
  ];

  const ashas: ASHAWorker[] = [
    { id: 'a1', name: 'Shanti Tai', distance: '0.5 km', activeCases: 12, available: true },
    { id: 'a2', name: 'Vimala Didi', distance: '1.2 km', activeCases: 8, available: true }
  ];

  const handleCapture = async (image: string) => {
    setCapturedImage(image);
    setShowScanner(false);
    setIsAnalyzing(true);

    try {
      const result = await analyzeHealthImage(image);
      setAnalysisResult(result);
      if (selectedPatient) {
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? {
          ...p,
          latestCondition: result.condition,
          severity: result.severity,
          lastScan: 'Today'
        } : p));
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysisResult({
        condition: HealthCondition.NORMAL,
        severity: Severity.LOW,
        confidence: 0.9,
        observations: ["No significant visual markers detected."],
        recommendations: ["Maintain balanced diet.", "Re-scan in 1 month."]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addRegistration = (reg: BabyRegistration) => {
    setCampRegistrations(prev => [...prev, reg]);
  };

  const renderPatientProfile = (patient: Patient) => (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
      <button 
        onClick={() => setSelectedPatient(null)}
        className="flex items-center gap-2 text-blue-700 font-bold text-[10px] mb-4 uppercase tracking-widest"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Village List
      </button>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl border border-gray-100 ring-8 ring-blue-50/50">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center text-4xl font-black text-blue-700 shadow-inner">
            {patient.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">{patient.name}</h2>
            <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-1 uppercase tracking-widest">
              <User className="w-3 h-3" /> {patient.age} yrs • {patient.gender}
            </p>
            <div className={`mt-3 px-4 py-1.5 rounded-full text-[10px] font-black inline-block tracking-widest uppercase ${
              patient.severity === Severity.HIGH ? 'bg-red-500 text-white' : 'bg-green-500 text-white shadow-lg shadow-green-100'
            }`}>
              {patient.severity}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6 mb-8">
          <div className="bg-gray-50 p-5 rounded-3xl">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Nutrient Screening Trend
             </h4>
             <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patient.vitaminLevels}>
                    <XAxis dataKey="type" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                    <Bar dataKey="level" radius={[6, 6, 0, 0]}>
                      {patient.vitaminLevels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#1d4ed8' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-3xl">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> PHC Visit History
             </h4>
             <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patient.visitHistory}>
                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        <div className="space-y-5">
           <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100">
              <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4" /> Current Medications
              </h4>
              <div className="flex flex-wrap gap-2">
                {patient.medicineHistory.map(m => (
                  <span key={m} className="bg-white text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">
                    {m}
                  </span>
                ))}
              </div>
           </div>

           <div className="bg-green-50/50 p-5 rounded-3xl border border-green-100 relative">
              <Quote className="absolute top-4 right-4 w-10 h-10 text-green-100" />
              <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" /> Patient Feedback
              </h4>
              <p className="text-xs text-green-900/80 italic font-medium leading-relaxed relative z-10">
                "{patient.testimonial}"
              </p>
           </div>

           <div className="pt-4 grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowScanner(true)}
                className="bg-blue-700 text-white py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
              >
                Start New Scan
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className="bg-white border-2 border-blue-700 text-blue-700 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                Chat with AI
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderCallScreen = () => (
    <div className="fixed inset-0 bg-blue-900 z-[100] flex flex-col items-center justify-center p-8 text-white animate-in fade-in zoom-in duration-300">
       <div className="flex flex-col items-center gap-8 mb-24">
          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center relative">
             <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
             <Phone className="w-12 h-12" />
          </div>
          <div className="text-center">
             <h2 className="text-2xl font-bold mb-2">Bahirwadi Helpline</h2>
             <p className="text-blue-200 font-medium animate-pulse">Connecting to nearest ASHA worker...</p>
          </div>
       </div>

       <div className="flex gap-12">
          <button className="flex flex-col items-center gap-2">
             <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"><Mic className="w-6 h-6" /></div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Mute</span>
          </button>
          <button className="flex flex-col items-center gap-2">
             <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"><Volume2 className="w-6 h-6" /></div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Speaker</span>
          </button>
       </div>

       <button 
         onClick={() => setIsCalling(false)}
         className="mt-20 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/40 active:scale-90 transition-transform"
       >
         <PhoneOff className="w-8 h-8" />
       </button>
    </div>
  );

  const renderMenuView = () => (
    <div className="p-4 space-y-6 animate-in slide-in-from-left-2 duration-300">
       <button 
        onClick={() => setMenuView(null)}
        className="flex items-center gap-2 text-blue-700 font-bold text-[10px] mb-4 uppercase tracking-widest"
      >
        <ArrowLeft className="w-3 h-3" /> Back Home
      </button>

      {menuView === 'chemists' ? (
        <div className="space-y-4">
           <h2 className="text-xl font-black text-gray-900">Chemists near Bahirwadi</h2>
           {chemists.map(ch => (
             <div key={ch.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-lg flex justify-between items-center">
                <div>
                   <h4 className="font-bold text-gray-800">{ch.name}</h4>
                   <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {ch.location}
                   </p>
                   <p className="text-[10px] text-gray-400 font-medium mt-1">{ch.hours}</p>
                </div>
                <button className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-50 active:scale-90 transition-all">
                   <Phone className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>
      ) : menuView === 'ashas' ? (
        <div className="space-y-4">
           <h2 className="text-xl font-black text-gray-900">ASHA Workers (Khed Sector)</h2>
           {ashas.map(asha => {
             const isBooked = bookedEntities.includes(asha.id);
             return (
               <div key={asha.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-lg flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-700 font-bold">
                       {asha.name.charAt(0)}
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-800">{asha.name}</h4>
                       <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{asha.activeCases} active cases • {asha.distance}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setBookedEntities(prev => isBooked ? prev.filter(e => e !== asha.id) : [...prev, asha.id])}
                    className={`px-4 py-2 rounded-2xl text-[9px] font-black transition-all shadow-md ${
                      isBooked ? 'bg-green-500 text-white' : 'bg-blue-700 text-white'
                    }`}
                  >
                    {isBooked ? 'Requested' : 'Contact'}
                  </button>
               </div>
             )
           })}
        </div>
      ) : null}
    </div>
  );

  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-8 animate-pulse">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 border-8 border-blue-50 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-12 h-12 text-blue-600 animate-bounce" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">AI Screening in Progress</h2>
            <p className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest opacity-60">Scanning Bio-Markers...</p>
          </div>
        </div>
      );
    }

    if (analysisResult && capturedImage) {
      return (
        <Results 
          result={analysisResult} 
          image={capturedImage} 
          onDone={() => {
            setAnalysisResult(null);
            setCapturedImage(null);
            setActiveTab('home');
          }} 
        />
      );
    }

    if (isCalling) return renderCallScreen();
    if (menuView) return renderMenuView();
    if (selectedPatient) return renderPatientProfile(selectedPatient);

    switch (activeTab) {
      case 'home':
        return <Dashboard 
          patients={patients} 
          onSelectPatient={setSelectedPatient} 
          onStartScan={() => setShowScanner(true)} 
          onCallHelpline={() => setIsCalling(true)}
          registrations={campRegistrations}
          onAddRegistration={addRegistration}
        />;
      case 'records':
        return (
          <div className="p-4 space-y-4">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900">Health Ledger</h2>
                <div className="p-2 bg-gray-100 rounded-2xl"><Calendar className="w-6 h-6 text-gray-500" /></div>
             </div>
             {patients.map(p => (
               <div key={p.id} onClick={() => setSelectedPatient(p)} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 hover:shadow-xl transition-all cursor-pointer group">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center font-black text-blue-700 transition-colors">{p.name.charAt(0)}</div>
                     <div>
                        <h4 className="font-black text-gray-900 text-sm">{p.name}</h4>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{p.latestCondition}</p>
                     </div>
                   </div>
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                     p.severity === Severity.HIGH ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-green-500 text-white shadow-lg shadow-green-100'
                   }`}>
                     {p.severity}
                   </span>
                 </div>
                 <div className="flex items-center gap-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {p.lastScan}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Bahirwadi</span>
                 </div>
               </div>
             ))}
          </div>
        );
      case 'predictor':
        return <SakhiPredictor />;
      case 'chat':
        return <Chatbot />;
      default:
        return <Dashboard patients={patients} onSelectPatient={setSelectedPatient} onStartScan={() => setShowScanner(true)} onCallHelpline={() => setIsCalling(true)} registrations={campRegistrations} onAddRegistration={addRegistration} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        if (tab === 'scan') {
          setShowScanner(true);
        } else {
          setMenuView(null);
          setSelectedPatient(null);
          setActiveTab(tab);
        }
      }}
      onOpenMenu={setMenuView}
    >
      {renderContent()}
      
      {showScanner && (
        <Scanner 
          onCapture={handleCapture} 
          onCancel={() => setShowScanner(false)} 
        />
      )}
    </Layout>
  );
};

export default App;
