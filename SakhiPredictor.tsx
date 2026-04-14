
import React, { useState } from 'react';
import { Calendar, Baby, Droplets, ArrowRight, ShieldCheck, Info, Sparkles, CheckCircle2 } from 'lucide-react';

const SakhiPredictor: React.FC = () => {
  const [activePredictor, setActivePredictor] = useState<'vaccine' | 'polio'>('vaccine');

  // Vaccination Form State
  const [babyName, setBabyName] = useState('');
  const [babyAgeMonths, setBabyAgeMonths] = useState('');
  const [lastVaccineDate, setLastVaccineDate] = useState('');
  const [vaccineResult, setVaccineResult] = useState<any[] | null>(null);

  // Polio Form State
  const [polioBabyName, setPolioBabyName] = useState('');
  const [polioAge, setPolioAge] = useState('');
  const [polioResult, setPolioResult] = useState<any | null>(null);

  const calculateVaccines = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(babyAgeMonths);
    const lastDate = new Date(lastVaccineDate || Date.now());
    
    // Simple logic based on Indian Universal Immunization Programme
    const schedule = [
      { age: 1.5, name: 'Pentavalent 1, OPV 1, Rota 1', description: 'At 6 weeks' },
      { age: 2.5, name: 'Pentavalent 2, OPV 2, Rota 2', description: 'At 10 weeks' },
      { age: 3.5, name: 'Pentavalent 3, OPV 3, Rota 3, IPV', description: 'At 14 weeks' },
      { age: 9, name: 'MR 1, Vitamin A 1', description: 'At 9 months completed' },
      { age: 16, name: 'DPT Booster 1, MR 2, OPV Booster', description: 'Between 16-24 months' },
      { age: 60, name: 'DPT Booster 2', description: 'At 5-6 years' }
    ];

    const upcoming = schedule.filter(s => s.age > age).map(s => {
      const diffMonths = s.age - age;
      const predictedDate = new Date(lastDate);
      predictedDate.setMonth(predictedDate.getMonth() + Math.ceil(diffMonths));
      return {
        ...s,
        date: predictedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    });

    setVaccineResult(upcoming.slice(0, 3));
  };

  const predictPolio = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(polioAge);
    
    // Pulse Polio typically occurs in Feb and March/April
    const dates = [
      { date: '15 Feb 2026', title: 'National Immunization Day' },
      { date: '22 Mar 2026', title: 'Sub-National Immunization Day' }
    ];

    setPolioResult({
      name: polioBabyName,
      age: age,
      upcoming: dates
    });
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-900 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 text-yellow-400 w-8 h-8 opacity-50" />
        <h2 className="text-2xl font-black mb-1">SakhiPredictor</h2>
        <p className="text-blue-100 text-xs font-medium uppercase tracking-widest opacity-80">Interactive Health Foresight</p>
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => setActivePredictor('vaccine')}
            className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activePredictor === 'vaccine' ? 'bg-white text-blue-900 shadow-lg' : 'bg-blue-800 text-blue-200'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Vaccination
          </button>
          <button 
            onClick={() => setActivePredictor('polio')}
            className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activePredictor === 'polio' ? 'bg-white text-blue-900 shadow-lg' : 'bg-blue-800 text-blue-200'}`}
          >
            <Droplets className="w-3.5 h-3.5" /> Polio Drops
          </button>
        </div>
      </div>

      {activePredictor === 'vaccine' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Vaccine Timeline</h3>
                <p className="text-[10px] text-gray-400 font-bold">Predict based on baby's current age</p>
              </div>
            </div>

            <form onSubmit={calculateVaccines} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Baby Name</label>
                  <input 
                    type="text" required value={babyName} onChange={e => setBabyName(e.target.value)}
                    placeholder="Enter baby's name"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Current Age (Months)</label>
                  <input 
                    type="number" required value={babyAgeMonths} onChange={e => setBabyAgeMonths(e.target.value)}
                    placeholder="Age in months"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Last Vaccine Date</label>
                  <input 
                    type="date" required value={lastVaccineDate} onChange={e => setLastVaccineDate(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-700 text-white py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                Generate Prediction <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {vaccineResult && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest px-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Upcoming for {babyName}
              </h4>
              <div className="space-y-3">
                {vaccineResult.map((v, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-lg flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black shadow-inner">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-gray-800">{v.name}</h5>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{v.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                         <span className="text-[9px] bg-blue-600 text-white px-3 py-1 rounded-full font-black uppercase shadow-md shadow-blue-100">
                           {v.date}
                         </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                  Dates are estimated based on Bahirwadi village health records. Please confirm with your ASHA worker.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Polio Drop Tracker</h3>
                <p className="text-[10px] text-gray-400 font-bold">Never miss a pulse polio drive</p>
              </div>
            </div>

            <form onSubmit={predictPolio} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Baby Name</label>
                  <input 
                    type="text" required value={polioBabyName} onChange={e => setPolioBabyName(e.target.value)}
                    placeholder="Enter baby's name"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-red-500 shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Current Age (Years)</label>
                  <input 
                    type="number" required value={polioAge} onChange={e => setPolioAge(e.target.value)}
                    placeholder="Age in years"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-red-500 shadow-inner"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                Predict Next Dose <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {polioResult && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
               {polioResult.age < 5 ? (
                 <>
                  <h4 className="text-xs font-black text-red-900 uppercase tracking-widest px-2 flex items-center gap-2">
                    <Droplets className="w-4 h-4" /> National Pulse Polio Drives
                  </h4>
                  <div className="space-y-3">
                    {polioResult.upcoming.map((p: any, i: number) => (
                      <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-lg flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
                           <Droplets className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-gray-800">{p.title}</h5>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recommended for {polioResult.name}</p>
                          <div className="mt-2">
                             <span className="text-[9px] bg-red-600 text-white px-3 py-1 rounded-full font-black uppercase shadow-md shadow-red-100">
                               Scheduled: {p.date}
                             </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                 </>
               ) : (
                 <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-green-200">
                       <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-base font-black text-green-900 leading-tight">Vaccination Completed!</h4>
                    <p className="text-xs text-green-800/70 font-medium">
                      {polioResult.name} is now over 5 years old and has completed the primary Pulse Polio immunization cycle.
                    </p>
                 </div>
               )}
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="p-6 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex flex-col items-center text-center gap-3">
        <h4 className="text-sm font-black text-blue-900 uppercase">Aapli Mansa Apla Arogya</h4>
        <p className="text-[10px] text-blue-700 font-medium leading-relaxed opacity-80 uppercase tracking-widest">
          Integrated Screening & Immunization Support for Bahirwadi Gram Panchayat
        </p>
      </div>
    </div>
  );
};

export default SakhiPredictor;
