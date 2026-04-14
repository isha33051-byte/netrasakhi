
import React, { useState } from 'react';
import { 
  Users, UserPlus, MapPin, ChevronRight, Stethoscope, 
  Calendar, Phone, Info, CheckCircle2, XCircle, Activity,
  Baby, HeartPulse, ShieldAlert, Tent, Star, UserCheck, 
  X, ClipboardList, PlusCircle, History
} from 'lucide-react';
import { Patient, Doctor, Severity, HealthCondition, HealthCamp, BabyRegistration } from '../types';

interface DashboardProps {
  patients: Patient[];
  onSelectPatient: (p: Patient) => void;
  onStartScan: () => void;
  onCallHelpline: () => void;
  registrations: BabyRegistration[];
  onAddRegistration: (reg: BabyRegistration) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  patients, 
  onSelectPatient, 
  onStartScan, 
  onCallHelpline,
  registrations,
  onAddRegistration
}) => {
  const [view, setView] = useState<'village' | 'doctors' | 'camps'>('village');
  const [campFilter, setCampFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [bookedDoctors, setBookedDoctors] = useState<string[]>([]);
  const [selectedCamp, setSelectedCamp] = useState<HealthCamp | null>(null);
  const [showRegForm, setShowRegForm] = useState(false);

  // Form State
  const [babyName, setBabyName] = useState('');
  const [parentName, setParentName] = useState('');
  const [babyAge, setBabyAge] = useState('');

  const nearbyDoctors: Doctor[] = [
    { id: '1', name: 'Patil', location: 'Kaman', available: true, specialty: 'General Physician', gender: 'Mr.' },
    { id: '2', name: 'Sawant', location: 'Chas', available: true, specialty: 'Skin Specialist', gender: 'Mrs.' },
    { id: '3', name: 'Waghule', location: 'Peth', available: true, specialty: 'Paediatrician', gender: 'Mrs.' },
    { id: '4', name: 'Rakshe', location: 'Khed', available: true, specialty: 'General Surgeon', gender: 'Mr.' },
    { id: '5', name: 'Pawar', location: 'Kaman', available: false, specialty: 'Nutritionist', gender: 'Mrs.' },
  ];

  const camps: HealthCamp[] = [
    {
      id: 'c1',
      title: 'Anaemia in Children Prevention',
      initiative: 'Integrated Child Development Service',
      date: '15 Feb 2026',
      leadASHA: 'Shanti Tai',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
      status: 'upcoming',
      description: 'Mass screening for Hb levels in children under 5. Nutritional supplements and iron syrup distribution included.',
      type: 'general',
      location: 'Bahirwadi Gram Panchayat Hall'
    },
    {
      id: 'c2',
      title: 'Adolescent Girl Health Programme',
      initiative: 'Kishori Shakti Yojana',
      date: '28 Feb 2026',
      leadASHA: 'Vimala Didi',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
      status: 'upcoming',
      description: 'Educational session on menstrual hygiene and distribution of folic acid tablets for local adolescent girls.',
      type: 'maternal',
      location: 'Bahirwadi Secondary School'
    },
    {
      id: 'c3',
      title: 'Polio Drops Mega Camp',
      initiative: 'Pulse Polio Abhiyan 2026',
      date: '22 Feb 2026',
      leadASHA: 'Meena Tai',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
      status: 'upcoming',
      description: 'Nation-wide polio vaccination drive. Every child under 5 must receive two drops of life.',
      type: 'vaccination',
      location: 'Anganwadi Center Bahirwadi'
    },
    {
      id: 'p1',
      title: 'Dermatological Outreach 2025',
      initiative: 'Skin Health Mission',
      date: '12 Dec 2025',
      leadASHA: 'Shanti Tai',
      image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400',
      status: 'past',
      description: 'Specialist skin clinic for treating rashes, infections, and monitoring leprosy markers in the community.',
      type: 'general',
      location: 'PHC Khed'
    },
    {
      id: 'p2',
      title: 'Child Malnutrition Screening',
      initiative: 'Kuposhan Mukt Bharat',
      date: '05 Aug 2025',
      leadASHA: 'Sunita Didi',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
      status: 'past',
      description: 'Weight and height mapping for all toddlers to identify SAM (Severe Acute Malnutrition) cases.',
      type: 'general',
      location: 'Bahirwadi Main Chowk'
    }
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCamp || !babyName || !parentName || !babyAge) return;

    const newReg: BabyRegistration = {
      id: Date.now().toString(),
      campId: selectedCamp.id,
      babyName,
      parentName,
      age: babyAge,
      timestamp: new Date().toLocaleDateString()
    };

    onAddRegistration(newReg);
    setBabyName('');
    setParentName('');
    setBabyAge('');
    setShowRegForm(false);
  };

  const filteredCamps = camps.filter(c => c.status === campFilter);

  const toggleBooking = (id: string) => {
    if (bookedDoctors.includes(id)) {
      setBookedDoctors(prev => prev.filter(d => d !== id));
    } else {
      setBookedDoctors(prev => [...prev, id]);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Camp Details Modal */}
      {selectedCamp && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="relative h-48">
              <img src={selectedCamp.image} className="w-full h-full object-cover" />
              <button 
                onClick={() => { setSelectedCamp(null); setShowRegForm(false); }}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{selectedCamp.initiative}</p>
                <h3 className="text-xl font-bold">{selectedCamp.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Date</span>
                  <span className="text-sm font-bold text-blue-900">{selectedCamp.date}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Location</span>
                  <span className="text-[10px] font-bold text-blue-900">{selectedCamp.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest">About the Camp</h4>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {selectedCamp.description}
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Lead ASHA Worker</p>
                  <h5 className="text-sm font-bold text-gray-800">{selectedCamp.leadASHA}</h5>
                </div>
              </div>

              {/* Registration Form / List */}
              {selectedCamp.status === 'upcoming' && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Registrations</h4>
                    {!showRegForm && (
                      <button 
                        onClick={() => setShowRegForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 flex items-center gap-2 active:scale-95 transition-all"
                      >
                        <PlusCircle className="w-3 h-3" /> Register Baby
                      </button>
                    )}
                  </div>

                  {showRegForm ? (
                    <form onSubmit={handleRegister} className="bg-gray-50 p-5 rounded-3xl space-y-4 border border-blue-100 animate-in zoom-in-95">
                      <div className="space-y-3">
                        <input 
                          type="text" required placeholder="Baby Name" 
                          value={babyName} onChange={e => setBabyName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                        />
                        <input 
                          type="text" required placeholder="Parent Name" 
                          value={parentName} onChange={e => setParentName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                        />
                        <input 
                          type="text" required placeholder="Baby Age (e.g. 2 yrs)" 
                          value={babyAge} onChange={e => setBabyAge(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-blue-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">Save Registration</button>
                        <button type="button" onClick={() => setShowRegForm(false)} className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase text-gray-400 border border-gray-200">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      {registrations.filter(r => r.campId === selectedCamp.id).length === 0 ? (
                        <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50 rounded-2xl border border-dashed">No registrations yet. Be the first!</p>
                      ) : (
                        registrations.filter(r => r.campId === selectedCamp.id).map(reg => (
                          <div key={reg.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold">
                                {reg.babyName.charAt(0)}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-gray-800">{reg.babyName}</h5>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">Parent: {reg.parentName} • {reg.age}</p>
                              </div>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Slogan */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg h-44 bg-blue-900 ring-4 ring-blue-50">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400" 
          alt="Rural Health" 
          className="w-full h-full object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/40 to-transparent p-6 flex flex-col justify-end">
          <h2 className="text-2xl font-bold text-white mb-1">आपली माणसं, आपलं आरोग्य</h2>
          <p className="text-blue-100 text-[10px] font-bold tracking-widest uppercase">Village: Bahirwadi (Taluka - Khed)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
        {[
          { id: 'village', icon: Users, label: 'Village' },
          { id: 'doctors', icon: Stethoscope, label: 'Doctors' },
          { id: 'camps', icon: Tent, label: 'Camps' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setView(tab.id as any)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 ${view === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {view === 'village' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-red-50 border border-red-100 p-4 rounded-3xl">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">Critical</span>
                </div>
                <div className="text-3xl font-black text-red-700">02</div>
                <p className="text-[8px] text-red-600 mt-1 font-medium">High fever cases this week</p>
             </div>
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Baby className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">Maternal</span>
                </div>
                <div className="text-3xl font-black text-blue-700">05</div>
                <p className="text-[8px] text-blue-600 mt-1 font-medium">Active pregnant women</p>
             </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-sm">Registered Patients ({patients.length})</h3>
              <button className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-100">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {patients.map(patient => (
                <div 
                  key={patient.id} 
                  onClick={() => onSelectPatient(patient)}
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${
                      patient.severity === Severity.HIGH ? 'bg-red-100 text-red-600' : 
                      patient.severity === Severity.MODERATE ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700 border border-green-100'
                    }`}>
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{patient.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <span>Age: {patient.age}</span>
                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                        <span className="text-blue-600">{patient.latestCondition}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : view === 'doctors' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-gray-50 rounded-3xl p-4 border border-gray-200">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-red-500" /> Specialist Map: Kaman, Chas, Peth
            </h3>
            
            <div className="space-y-3">
              {nearbyDoctors.map(doctor => {
                const isBooked = bookedDoctors.includes(doctor.id);
                return (
                  <div key={doctor.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-inner">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">
                          {doctor.gender} {doctor.name}
                        </h4>
                        <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase">
                            <MapPin className="w-3 h-3" /> {doctor.location}
                          </span>
                          {doctor.available ? (
                            <span className="text-green-600 text-[9px] font-black flex items-center gap-1 uppercase">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Available
                            </span>
                          ) : (
                            <span className="text-red-400 text-[9px] font-black flex items-center gap-1 uppercase">
                              <XCircle className="w-2.5 h-2.5" /> Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {doctor.available && (
                      <button 
                        onClick={() => toggleBooking(doctor.id)}
                        className={`px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                          isBooked ? 'bg-green-500 text-white shadow-green-100' : 'bg-blue-600 text-white shadow-blue-100'
                        }`}
                      >
                        {isBooked ? <CheckCircle2 className="w-3 h-3" /> : null}
                        {isBooked ? 'Booked' : 'Book'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {/* Camp Filter Section */}
           <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
              <button 
                onClick={() => setCampFilter('upcoming')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${campFilter === 'upcoming' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400'}`}
              >
                <ClipboardList className="w-3.5 h-3.5" /> Upcoming Camps (2026)
              </button>
              <button 
                onClick={() => setCampFilter('past')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${campFilter === 'past' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400'}`}
              >
                <History className="w-3.5 h-3.5" /> Past Impact (2025)
              </button>
           </div>

           <div className="space-y-4">
             {filteredCamps.map(camp => (
               <div 
                 key={camp.id} 
                 onClick={() => setSelectedCamp(camp)}
                 className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl group hover:shadow-blue-50 transition-all cursor-pointer"
               >
                  <div className="h-40 relative">
                     <img src={camp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-4 left-4 bg-white/90 glass-effect px-4 py-1.5 rounded-full text-[9px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2 shadow-lg">
                        <Calendar className="w-3 h-3" /> {camp.date}
                     </div>
                     {camp.status === 'upcoming' && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                           Live Booking
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">{camp.initiative}</p>
                        <h4 className="text-xl font-bold leading-tight">{camp.title}</h4>
                     </div>
                  </div>
                  <div className="p-5 flex items-center justify-between bg-white group-hover:bg-blue-50/30 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 shadow-inner group-hover:bg-white transition-colors">
                           <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Lead ASHA Worker</p>
                           <h5 className="text-xs font-bold text-gray-800">{camp.leadASHA}</h5>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        {registrations.filter(r => r.campId === camp.id).length > 0 && (
                          <div className="flex -space-x-2">
                            {registrations.filter(r => r.campId === camp.id).slice(0, 3).map((reg, idx) => (
                              <div key={idx} className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white text-[8px] flex items-center justify-center text-white font-black">
                                {reg.babyName.charAt(0)}
                              </div>
                            ))}
                            {registrations.filter(r => r.campId === camp.id).length > 3 && (
                               <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white text-[8px] flex items-center justify-center text-gray-600 font-black">
                                 +{registrations.filter(r => r.campId === camp.id).length - 3}
                               </div>
                            )}
                          </div>
                        )}
                        <button className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl shadow-blue-100 group-hover:translate-x-1 transition-transform">
                           <ChevronRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Persistent Help/Support */}
      <div className="p-6 bg-blue-900 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl shadow-blue-200 relative overflow-hidden group">
         <div className="absolute inset-0 bg-blue-800/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
         <div className="relative z-10">
            <h4 className="font-bold text-base">Arogya Helpline</h4>
            <p className="text-[10px] opacity-70 font-medium uppercase tracking-widest">Village Bahirwadi Medical Support</p>
         </div>
         <button 
           onClick={onCallHelpline}
           className="relative z-10 w-14 h-14 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md active:scale-90 transition-all border border-white/20 shadow-xl"
         >
           <Phone className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};

export default Dashboard;
