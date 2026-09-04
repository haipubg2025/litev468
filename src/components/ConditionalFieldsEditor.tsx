import React from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConditionalFieldsEditorProps {
  type: 'mc' | 'npc';
  theme: any;
}

export default function ConditionalFieldsEditor({ type, theme }: ConditionalFieldsEditorProps) {
  const worldCreation = useStore(state => state.worldCreation);
  const updateWorldCreation = useStore(state => state.updateWorldCreation);
  
  const fields = type === 'mc' ? worldCreation.customMcFields : worldCreation.customNpcFields;
  const conditions = type === 'mc' ? worldCreation.customMcConditions : worldCreation.customNpcConditions;
  
  const isDark = theme.group === 'Dark';

  if (!fields || fields.length === 0) return null;

  const handleToggle = () => {
    const newConditions = conditions ? { ...conditions, enabled: !conditions.enabled } : { enabled: true, referenceFieldId: fields[0]?.id || '', rules: [] };
    if (type === 'mc') updateWorldCreation({ customMcConditions: newConditions });
    else updateWorldCreation({ customNpcConditions: newConditions });
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!conditions) return;
    const newConditions = { ...conditions, referenceFieldId: e.target.value };
    if (type === 'mc') updateWorldCreation({ customMcConditions: newConditions });
    else updateWorldCreation({ customNpcConditions: newConditions });
  };

  const addRule = () => {
    if (!conditions) return;
    const availableFields = fields.filter((f: any) => f.id !== conditions.referenceFieldId);
    if (availableFields.length === 0) return;
    const newRule = { targetFieldId: availableFields[0].id, threshold: 10 };
    const newConditions = { ...conditions, rules: [...conditions.rules, newRule] };
    if (type === 'mc') updateWorldCreation({ customMcConditions: newConditions });
    else updateWorldCreation({ customNpcConditions: newConditions });
  };

  const updateRule = (idx: number, field: string, value: any) => {
    if (!conditions) return;
    const newRules = [...conditions.rules];
    newRules[idx] = { ...newRules[idx], [field]: value };
    const newConditions = { ...conditions, rules: newRules };
    if (type === 'mc') updateWorldCreation({ customMcConditions: newConditions });
    else updateWorldCreation({ customNpcConditions: newConditions });
  };

  const removeRule = (idx: number) => {
    if (!conditions) return;
    const newRules = conditions.rules.filter((_, i) => i !== idx);
    const newConditions = { ...conditions, rules: newRules };
    if (type === 'mc') updateWorldCreation({ customMcConditions: newConditions });
    else updateWorldCreation({ customNpcConditions: newConditions });
  };

  return (
    <div className={`mt-4 border-t border-dashed pt-4 ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-slate-800'}`}>
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
          <Power size={14} /> CƠ CHẾ KÍCH HOẠT ĐIỀU KIỆN
        </label>
        <button
          onClick={handleToggle}
          className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
            conditions?.enabled 
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20' 
              : isDark ? 'bg-white/10 text-white/50 border-white/10' : 'bg-black/5 text-slate-500 border-black/10'
          }`}
        >
          {conditions?.enabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}
        </button>
      </div>

      <AnimatePresence>
        {conditions?.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-black/10'}`}>
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase opacity-70 mb-2">Trường Tham Chiếu (Gốc)</label>
                <select
                  value={conditions.referenceFieldId}
                  onChange={handleReferenceChange}
                  className={`w-full p-2.5 rounded-lg text-sm font-semibold outline-none border ${
                    isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-black'
                  }`}
                >
                  {fields.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
                <p className="text-[10px] opacity-60 mt-1">Trường này luôn được kích hoạt. Giá trị số của trường này sẽ quyết định việc bật/tắt các trường phụ thuộc bên dưới.</p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase opacity-70">Các Trường Phụ Thuộc</label>
                {conditions.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-50 shrink-0">NẾU &gt;=</span>
                    <input
                      type="number"
                      value={rule.threshold}
                      onChange={(e) => updateRule(idx, 'threshold', parseInt(e.target.value) || 0)}
                      className={`w-20 p-2 text-center rounded-lg font-bold border outline-none text-sm ${
                        isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-black'
                      }`}
                    />
                    <span className="text-xs font-bold opacity-50 shrink-0">BẬT</span>
                    <select
                      value={rule.targetFieldId}
                      onChange={(e) => updateRule(idx, 'targetFieldId', e.target.value)}
                      className={`flex-1 p-2 rounded-lg text-sm font-semibold outline-none border w-24 ${
                        isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-black'
                      }`}
                    >
                      {fields.filter((f: any) => f.id !== conditions.referenceFieldId).map((f: any) => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeRule(idx)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addRule}
                  className={`w-full py-2 flex items-center justify-center gap-1 text-xs font-bold rounded-lg border border-dashed transition-colors ${
                    isDark ? 'border-white/20 text-white/60 hover:bg-white/5 hover:text-white' : 'border-black/20 text-black/60 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  <Plus size={14} /> THÊM ĐIỀU KIỆN
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
