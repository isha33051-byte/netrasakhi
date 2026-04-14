
import React from 'react';
import { AlertCircle, CheckCircle, Info, ArrowRight, Share2, MapPin, UserCheck } from 'lucide-react';
import { HealthCondition, Severity, PHC } from '../types';

interface ResultsProps {
  result: {
    condition: HealthCondition;
    severity: Severity;
    confidence: number;
    observations: string[];
    recommendations: string[];
  };
  image: string;
  onDone: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, image, onDone }) => {
  const getSeverityColor = (sev: Severity) => {
    switch(sev) {
      case Severity.HIGH: return 'bg-red-500';
      case Severity.MODERATE: return 'bg-orange-500';
      case Severity.LOW: return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const phcs: PHC[] = [
    { name: "Village PHC - Sector 4", distance: "1.2 km", doctorAvailable: true, specialty: "General Physician" },
    { name: "District Hospital", distance: "8.5 km", doctorAvailable: true, specialty: "Dermatologist" }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Screening Result</h2>
          <div className="p-2 bg-white rounded-full shadow-sm text-blue-600">
             <Share2 className="w-5 h-5" />
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="relative h-48 bg-gray-200">
            <img src={image} alt="Captured" className="w-full h-full object-cover" />
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-[10px] font-bold ${getSeverityColor(result.severity)}`}>
              {result.severity}
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <h3 className="text-xl font-bold">{result.condition}</h3>
              <p className="text-xs opacity-80">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Warning Message */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-800 leading-relaxed">
                This is an <strong>AI-assisted screening tool</strong> and not a final medical diagnosis. 
                Please consult a qualified healthcare professional for confirmed diagnosis.
              </p>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                Detected Indicators
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {result.observations.map((obs, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    {obs}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Suggested Actions
              </h4>
              <div className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-green-50/50 rounded-xl border border-green-100">
                    <span className="text-green-600 font-bold text-xs">{i+1}.</span>
                    <p className="text-xs text-gray-700 font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ASHA Worker Referral Flow (Only if high risk) */}
        {(result.severity === Severity.HIGH || result.severity === Severity.MODERATE) && (
          <div className="space-y-4">
            <h3 className="font-bold text-red-700 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              ASHA Worker Support
            </h3>
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl space-y-3">
              <p className="text-xs text-red-900 font-semibold">Immediate attention recommended. Connecting to nearby PHC:</p>
              {phcs.map((phc, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-red-100 flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-bold text-gray-800">{phc.name}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] text-gray-500">{phc.distance}</span>
                      <span className="text-[10px] px-1 bg-green-100 text-green-700 rounded font-bold">Doctor Available</span>
                    </div>
                  </div>
                  <button className="bg-red-600 text-white p-2 rounded-lg shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={onDone}
          className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Results;
