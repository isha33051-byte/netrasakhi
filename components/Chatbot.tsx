
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Image as ImageIcon, CheckCircle, Clock, Upload, ShieldCheck, Activity } from 'lucide-react';
import { chatWithDoctor, analyzeHealthImage } from '../services/geminiService';
import { Message } from '../types';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'doctor', 
      text: 'Namaste! I am Dr. Sahay. You can send me photos of rashes or symptoms for immediate screening. Sarpanch and ASHA workers can also report weekly status here.', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const userMsg: Message = {
        role: 'user',
        text: 'Sent a medical image for screening.',
        image: base64,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const analysis = await analyzeHealthImage(base64);
        const doctorMsg: Message = {
          role: 'doctor',
          text: `I've analyzed the image. It appears to show markers for ${analysis.condition} (${analysis.severity}). Visual observations: ${analysis.observations.join(', ')}. Recommendations: ${analysis.recommendations[0]}. Please confirm with a physical visit.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, doctorMsg]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { 
      role: 'user', 
      text: inputText, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatWithDoctor([...messages, userMsg]);
      const doctorMsg: Message = {
        role: 'doctor',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, doctorMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
             <User className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Arogya Sahayak (AI)</h3>
            <p className="text-[9px] text-green-600 font-bold flex items-center gap-1 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span> Active Screening
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="p-1.5 bg-blue-50 rounded-lg"><Activity className="w-4 h-4 text-blue-600" /></div>
           <div className="p-1.5 bg-blue-50 rounded-lg"><ShieldCheck className="w-4 h-4 text-blue-600" /></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {msg.image && (
                <img src={msg.image} alt="Uploaded" className="w-full rounded-xl mb-2 border border-white/20" />
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className="flex justify-between items-center mt-1.5 gap-2">
                <span className={`text-[8px] opacity-60 font-medium ${msg.role === 'user' ? 'text-white' : 'text-gray-500'}`}>
                  {msg.timestamp}
                </span>
                {msg.role === 'doctor' && <CheckCircle className="w-2.5 h-2.5 text-blue-400" />}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white rounded-2xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">AI Processing...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 space-y-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex gap-2">
          {['Pregnant Woman', 'High Fever', 'New Rash'].map(tag => (
            <button 
              key={tag}
              onClick={() => setInputText(`Reporting: ${tag}`)}
              className="text-[9px] bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full font-bold text-gray-600 active:bg-blue-50 active:text-blue-600"
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 rounded-2xl border border-gray-100"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe symptoms or report..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-90 transition-transform"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 px-4 py-2 flex items-center justify-between border-t border-blue-100">
        <div className="flex items-center gap-2 text-[9px] text-blue-700 font-bold">
          <Clock className="w-3 h-3" />
          <span>Village Doc response: ~12 min</span>
        </div>
        <span className="text-[9px] text-blue-700 underline font-bold cursor-pointer">Emergency Call</span>
      </div>
    </div>
  );
};

export default Chatbot;
