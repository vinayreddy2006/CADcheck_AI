import { useAppStore } from '../store/useAppStore';
import { BrainCircuit, Cpu, Network, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reasoning() {
  // FIXED: Changed pipelineLogs to inferenceLogs
  const { inferenceLogs } = useAppStore();
  const logs = inferenceLogs || [];
  const confidenceScore = 92.4; // Fixed score for prototype display

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">AI Reasoning Engine</h1>
          <p className="text-slate-500 mt-2">Transparent inference steps and model telemetry</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-lg text-indigo-800 text-sm font-medium">
          <Cpu className="w-5 h-5" /><span>Model: <span className="font-bold">BRepGAT-v2.1</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 pb-4">
        <div className="glass-panel flex flex-col md:col-span-2 border border-slate-200/60 overflow-hidden">
          <div className="p-4 border-b border-slate-200/60 bg-white/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider"><BrainCircuit className="w-4 h-4 text-indigo-600" /> Inference Chain Log</h3>
          </div>
          <div className="flex-1 bg-[#0f172a] p-6 font-mono text-sm overflow-y-auto text-emerald-400">
            {logs.length === 0 && <span className="text-slate-500">Awaiting execution trace...</span>}
            <div className="flex flex-col gap-3">
              {logs.map((log, i) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i}>
                  <span className="text-blue-400">core&gt;</span> <span className="text-slate-300">{log}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Global Confidence Score</h3>
            <div className="text-6xl font-black text-indigo-600">{confidenceScore}%</div>
          </div>
          <div className="glass-panel p-6 flex-1">
            <h3 className="text-slate-500 text-xs font-bold uppercase mb-5">Node Classifications</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm"><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Manifold Entities</span><b>1,204</b></li>
              <li className="flex justify-between items-center text-sm"><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Planar Faces</span><b>452</b></li>
              <li className="flex justify-between items-center text-sm border-t border-slate-200 pt-4"><span className="flex items-center gap-2 text-rose-600 font-bold"><Network className="w-4 h-4" /> Anomalies</span><b className="text-rose-600">2</b></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}