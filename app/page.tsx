'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MicOff, 
  ChevronDown, 
  VideoOff, 
  MonitorUp, 
  MessageSquare
} from 'lucide-react';
import WireframeOrb from '@/components/WireframeOrb';

export default function VoiceAgentInterface() {
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [aiText] = useState("VNC session established. Checking local environment parameters and rendering virtual desktop. Awaiting your next voice command.");

  return (
    <div className="flex flex-col h-screen bg-[#0a0014] text-slate-100 overflow-hidden items-center justify-center relative font-sans">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, #1e0b3d 0%, #0a0014 100%)' }} />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl flex items-center justify-center px-4 sm:px-8 relative z-10 mx-auto pb-32 sm:pb-40 lg:pb-16 pt-8 sm:pt-0">
        
        {/* Center: Expanded VNC Screen */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-video bg-[#05000a] rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)] border border-white/10 overflow-hidden flex flex-col relative z-20">
          {/* Window Header */}
          <div className="bg-[#120524] px-4 py-3 sm:py-4 flex items-center gap-3 border-b border-white/10">
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-400" />
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-green-400" />
            </div>
            <div className="text-xs sm:text-sm font-medium text-purple-300/60 font-mono tracking-wide">
              vnc-viewer: workspace-01
            </div>
          </div>
          
          {/* Screen Content */}
          <div className="flex-1 bg-[#0a0014] p-4 sm:p-6 lg:p-8 flex flex-col gap-2 sm:gap-3 font-mono text-sm sm:text-base lg:text-lg text-emerald-400 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              $ root@workspace-01:~# vncserver -start
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Starting VNC server on display :1...
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              Desktop is workspace-01:1 (root)
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              Log file is /root/.vnc/workspace-01:1.log
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
              className="mt-4 text-slate-500"
            >
              Session established. Framebuffer active. Waiting for signal...
            </motion.div>
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mt-1"
            >
              <div className="w-2.5 sm:w-3 lg:w-4 border-b-2 lg:border-b-4 border-emerald-400 h-5 lg:h-6 inline-block" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Left: Wireframe Mesh Orb & Voice Text */}
        <div className="absolute z-30 bottom-[90px] sm:bottom-[110px] lg:bottom-12 left-0 sm:left-4 lg:left-8 flex items-end gap-3 sm:gap-5 cursor-pointer max-w-[calc(100vw-8px)] sm:max-w-2xl drop-shadow-2xl" onClick={() => setIsSpeaking(!isSpeaking)}>
          {/* Wireframe Orb Container */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 flex-shrink-0 relative flex items-center justify-center p-0 mb-4 lg:mb-0">
             <WireframeOrb isSpeaking={isSpeaking} />
          </div>

          {/* AI Voice Text Bubble */}
          <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl rounded-bl-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 py-3 sm:px-5 sm:py-4 mb-[24px] sm:mb-[28px] lg:mb-8 w-[calc(100vw-120px)] sm:w-auto max-w-[260px] sm:max-w-[340px] lg:max-w-md pointer-events-none relative overflow-hidden">
             {/* Highlight effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-fuchsia-500/10 pointer-events-none" />
             
             <div className="flex items-center gap-2 mb-1.5 sm:mb-2 relative z-10">
                {isSpeaking ? (
                  <div className="flex gap-1 items-center h-3">
                     <motion.div className="w-1 bg-fuchsia-400 rounded-full" animate={{height: ["4px", "12px", "4px"]}} transition={{repeat: Infinity, duration: 0.8}} />
                     <motion.div className="w-1 bg-indigo-400 rounded-full" animate={{height: ["4px", "10px", "4px"]}} transition={{repeat: Infinity, duration: 0.8, delay: 0.15}} />
                     <motion.div className="w-1 bg-blue-400 rounded-full" animate={{height: ["4px", "14px", "4px"]}} transition={{repeat: Infinity, duration: 0.8, delay: 0.3}} />
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-500" />
                )}
                <span className="text-[10px] sm:text-xs font-mono text-indigo-300 tracking-wider font-semibold uppercase">
                  {isSpeaking ? 'Agent Speaking...' : 'Agent Idle'}
                </span>
             </div>
             <p className="text-xs sm:text-sm lg:text-base text-slate-100 leading-relaxed font-medium relative z-10 line-clamp-4">
               {aiText}
             </p>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[680px] px-4 z-10">
        <div className="border border-white/10 hover:border-white/20 rounded-full pl-2 pr-2.5 py-2 flex items-center justify-between bg-black/60 shadow-[0_0_30px_rgba(168,85,247,0.2)] backdrop-blur-xl">
          
          {/* Left Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Mic Control */}
            <div className="flex items-center bg-white/10 text-white rounded-full overflow-hidden cursor-pointer h-10 hover:bg-white/20 transition-colors">
              <div className="flex items-center justify-center pl-3 pr-2 h-full border-r border-white/10">
                <MicOff className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div className="px-2 h-full flex items-center justify-center">
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" strokeWidth={3} />
              </div>
            </div>

            {/* Video Control */}
            <div className="flex items-center bg-white/10 text-white rounded-full overflow-hidden cursor-pointer h-10 hover:bg-white/20 transition-colors">
              <div className="flex items-center justify-center pl-3 pr-2 h-full border-r border-white/10">
                <VideoOff className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div className="px-2 h-full flex items-center justify-center">
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" strokeWidth={3} />
              </div>
            </div>

            {/* Screen Share */}
            <button className="flex items-center justify-center bg-white/10 text-white w-10 h-10 rounded-full hover:bg-white/20 transition-colors ml-0.5">
              <MonitorUp className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Chat */}
            <button className="flex items-center justify-center bg-white/10 text-white w-10 h-10 rounded-full hover:bg-white/20 transition-colors">
              <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
            </button>

          </div>

          {/* Right Controls */}
          <button className="flex items-center justify-center gap-2 sm:gap-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-widest px-4 sm:px-5 h-10 rounded-full transition-colors ml-2 whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" x2="2" y1="2" y2="22"/></svg>
            SAY BYE
          </button>

        </div>
      </div>

    </div>
  );
}
