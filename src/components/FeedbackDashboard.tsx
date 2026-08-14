import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import { MessageSquare, Clock, User } from 'lucide-react';

export function FeedbackDashboard() {
  const { responses } = useSurvey();
  
  // Filter responses that have comments and sort by newest first
  const feedbackList = responses
    .filter(r => r.komentar && r.komentar.trim().length > 0)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (feedbackList.length === 0) {
    return (
      <div className="p-6 lg:p-10 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <MessageSquare size={48} className="text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Belum Ada Feedback</h2>
        <p className="text-slate-400 max-w-md text-center">Masukan dan saran dari responden akan muncul secara realtime di sini.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
          <div className="p-2 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-lg">
            <MessageSquare size={24} />
          </div>
          Feedback & Saran Realtime
        </h1>
        <p className="text-pink-200/80 font-medium max-w-2xl">
          Pantauan langsung saran, kritik, dan masukan dari responden survei masyarakat.
        </p>
      </div>

      <div className="grid gap-6">
        {feedbackList.map(item => (
          <div key={item.id} className="bg-[#1e294b]/80 backdrop-blur-md p-6 rounded-3xl border border-pink-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-pink-500/40 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                  <User size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">{item.demografi.pekerjaan}</div>
                  <div className="text-xs text-slate-400 font-medium">
                    {item.demografi.jenisKelamin}, {item.demografi.usia}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full">
                <Clock size={14} />
                {item.timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <div className="pl-13">
              <p className="text-blue-50 text-lg leading-relaxed relative">
                <span className="absolute -left-4 -top-2 text-4xl text-pink-500/20 font-serif">"</span>
                {item.komentar}
                <span className="absolute -bottom-4 text-4xl text-pink-500/20 font-serif leading-none">"</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
