import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Check, Power, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from '../utils/toast';

interface DramaModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: any;
}

export default function DramaModal({ isOpen, onClose, theme }: DramaModalProps) {
  const isDramaticEnabled = useStore(state => state.isDramaticEnabled);
  const setIsDramaticEnabled = useStore(state => state.setIsDramaticEnabled);
  const dramaPrompt = useStore(state => state.dramaPrompt || "");
  const setDramaPrompt = useStore(state => state.setDramaPrompt);
  
  const isDark = theme.group === 'Dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`w-full h-full flex flex-col shadow-2xl relative ${isDark ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}`}
          >
            {/* Header */}
            <div className={`shrink-0 px-6 py-4 flex items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDramaticEnabled ? 'bg-red-500/20 text-red-500' : isDark ? 'bg-white/10 text-white/50' : 'bg-black/5 text-slate-500'}`}>
                  <Flame size={24} className={isDramaticEnabled ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-wide">CÀI ĐẶT KỊCH TÍNH (DRAMA)</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* ON/OFF Control */}
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
                  <Power size={14} /> TRẠNG THÁI CHẾ ĐỘ
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setIsDramaticEnabled(true);
                      toast.success("Đã bật chế độ Kịch Tính!");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all border-2 ${
                      isDramaticEnabled 
                        ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-[1.02]' 
                        : isDark ? 'bg-black/40 border-white/5 text-white/50 hover:bg-black/60' : `${theme.bgClass} border-black/10 ${theme.textSecondary} hover:opacity-80`
                    }`}
                  >
                    <Check size={20} className={isDramaticEnabled ? 'opacity-100' : 'opacity-0'} />
                    BẬT (ON)
                  </button>
                  <button
                    onClick={() => {
                      setIsDramaticEnabled(false);
                      toast.success("Đã tắt chế độ Kịch Tính!");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all border-2 ${
                      !isDramaticEnabled 
                        ? isDark ? 'bg-white/10 border-white/20 text-white scale-[1.02]' : 'bg-slate-800 border-slate-700 text-white scale-[1.02]' 
                        : isDark ? 'bg-black/40 border-white/5 text-white/50 hover:bg-black/60' : `${theme.bgClass} border-black/10 ${theme.textSecondary} hover:opacity-80`
                    }`}
                  >
                    <X size={20} className={!isDramaticEnabled ? 'opacity-100' : 'opacity-0'} />
                    TẮT (OFF)
                  </button>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest opacity-70 flex items-center justify-between">
                  <span>GỢI Ý KỊCH TÍNH CỦA BẠN</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>Tùy chọn</span>
                </label>
                <textarea
                  value={dramaPrompt}
                  onChange={(e) => setDramaPrompt(e.target.value)}
                  placeholder="Ví dụ: Đột nhiên có một sát thủ áo đen xông vào ám sát MC... hoặc Tông môn đột ngột bị tập kích..."
                  className={`w-full min-h-[250px] p-4 rounded-xl resize-none outline-none custom-scrollbar transition-colors border ${
                    isDark 
                      ? 'bg-black/50 border-white/10 text-white placeholder:text-white/30 focus:border-red-500/50 focus:bg-black/80' 
                      : `${theme.bgClass} border-black/10 ${theme.textPrimary} placeholder:text-slate-400 focus:border-red-500/50`
                  }`}
                />
                <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                  Nhập bất cứ kịch bản, ý tưởng hay gợi ý nào. Mọi thông tin ở đây sẽ được lưu trữ vào tệp lưu game. F5 không mất.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
