import React, { useState } from 'react';
import { Home, LayoutGrid, FileText, BarChart2, MessageSquare, User, Bell, Settings, Moon, Sun, ArrowUpRight, Heart, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardHome } from './components/DashboardHome';
import { SurveyForm } from './components/SurveyForm';
import { ReportDashboard } from './components/ReportDashboard';
import { RespondenDashboard } from './components/RespondenDashboard';
import { FeedbackDashboard } from './components/FeedbackDashboard';
import { SurveyProvider } from './context/SurveyContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <SurveyProvider>
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-0 md:p-4 lg:p-8 font-sans bg-[#0a0f1c] print:bg-white print:p-0"
      >
        {/* Top Labels outside container */}
        <div className="hidden md:flex w-full max-w-[1250px] justify-between items-end mb-4 px-6 print:hidden">
          <div className="text-blue-300 font-bold tracking-widest uppercase text-sm drop-shadow-md">PEMDES SIJENGGUNG</div>
          <div className="text-blue-300 font-bold tracking-widest uppercase text-sm drop-shadow-md">SURVEI KEPUASAN MASYARAKAT</div>
        </div>

        <div className="w-full max-w-[1250px] h-[100dvh] md:h-[800px] print:h-auto bg-[#0d1425] rounded-none md:rounded-[3rem] print:rounded-none relative overflow-hidden shadow-2xl print:shadow-none shadow-blue-900/20 flex border-0 md:border border-blue-500/20 print:border-none">
          
          {/* Background Digital Overlay for App */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0d1425] via-[#111936] to-[#0a0f1c] print:hidden">
             {/* Tech grid */}
             <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             {/* Glowing orbs */}
             <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
             <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
          </div>

          {/* UI Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col-reverse md:flex-row p-3 md:p-6 print:p-0 gap-3 md:gap-6">
            
            {/* Sidebar / Bottom Navigation */}
            <div className="w-full md:w-20 bg-[#162039]/90 md:bg-[#162039]/80 backdrop-blur-xl rounded-2xl md:rounded-full flex flex-row md:flex-col items-center py-2 px-4 md:px-0 md:py-8 justify-between md:justify-between shadow-2xl border border-blue-400/20 z-20 print:hidden shrink-0">
              <div className="flex flex-row md:flex-col gap-2 md:gap-5 items-center justify-between md:justify-start w-full md:px-2">
                <button 
                  onClick={() => setActiveTab('home')}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'home' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  <Home size={20} />
                </button>
                <button 
                  onClick={() => setActiveTab('survey')}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'survey' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  <FileText size={20} />
                </button>
                <button 
                  onClick={() => setActiveTab('report')}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'report' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  <BarChart2 size={20} />
                </button>
                <button 
                  onClick={() => setActiveTab('responden')}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'responden' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  <Users size={20} />
                </button>
                <div className="hidden md:block w-8 h-[2px] bg-slate-700 my-2 rounded-full"></div>
                <button 
                  onClick={() => setActiveTab('feedback')}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'feedback' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  <MessageSquare size={20} />
                </button>
                <button className="hidden md:flex w-12 h-12 rounded-full items-center justify-center transition-transform hover:scale-105">
                  <img src="https://i.pravatar.cc/100?img=47" alt="User" className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                </button>
                <button className="hidden md:flex w-12 h-12 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#162039] shadow-[0_0_5px_rgba(34,211,238,0.8)]"></span>
                </button>
              </div>
              
              <div className="hidden md:flex flex-col gap-3 items-center bg-[#0d1425]/80 p-2 rounded-full shadow-inner border border-slate-700/50">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:shadow-sm transition-colors">
                  <Settings size={18} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-cyan-400 bg-white/10 shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-colors">
                  <Moon size={18} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Sun size={18} />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-start md:justify-between h-full relative z-10 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                  <motion.div 
                    key="home"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col justify-start md:justify-between overflow-y-auto custom-scrollbar"
                  >
                    <DashboardHome onNavigate={setActiveTab} />
                  </motion.div>
                )}
                {activeTab === 'survey' && (
                   <motion.div 
                     key="survey"
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -50 }}
                     transition={{ duration: 0.3 }}
                     className="h-full overflow-y-auto pr-2 md:pr-4 pb-4 custom-scrollbar bg-[#162039]/60 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] shadow-2xl border border-blue-400/20 md:mt-2 md:mb-2"
                   >
                     <SurveyForm />
                   </motion.div>
                )}
                {activeTab === 'report' && (
                   <motion.div 
                     key="report"
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -50 }}
                     transition={{ duration: 0.3 }}
                     className="h-full overflow-y-auto pr-2 md:pr-4 pb-4 custom-scrollbar bg-[#162039]/60 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] shadow-2xl border border-blue-400/20 md:mt-2 md:mb-2"
                   >
                     <ReportDashboard />
                   </motion.div>
                )}
                {activeTab === 'responden' && (
                   <motion.div 
                     key="responden"
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -50 }}
                     transition={{ duration: 0.3 }}
                     className="h-full overflow-y-auto pr-2 md:pr-4 pb-4 custom-scrollbar bg-[#162039]/60 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] shadow-2xl border border-blue-400/20 md:mt-2 md:mb-2"
                   >
                     <RespondenDashboard />
                   </motion.div>
                )}
                {activeTab === 'feedback' && (
                   <motion.div 
                     key="feedback"
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -50 }}
                     transition={{ duration: 0.3 }}
                     className="h-full overflow-y-auto pr-2 md:pr-4 pb-4 custom-scrollbar bg-[#162039]/60 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] shadow-2xl border border-blue-400/20 md:mt-2 md:mb-2"
                   >
                     <FeedbackDashboard />
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
        
        {/* Bottom outer labels */}
        <div className="hidden md:flex w-full max-w-[1250px] justify-between items-center mt-6 px-6 print:hidden">
          <div className="text-blue-300 font-bold flex items-center gap-2 drop-shadow-md">
            Pemerintah Desa Sijenggung <Heart size={18} className="fill-current text-cyan-400" />
          </div>
          <button className="px-6 py-2 rounded-full border border-blue-500/50 text-blue-300 font-bold hover:bg-blue-500/20 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-sm bg-[#162039]/50">
            Export <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </SurveyProvider>
  );
}
