import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Database, Network, BrainCircuit, ShieldCheck, CheckCircle2, Cuboid } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const stages = [
  { id: 'idle', label: 'CAD Upload', icon: Cuboid, route: '/cad-viewer' },
  { id: 'extraction', label: 'B-Rep Extraction', icon: Database, route: '/cad-viewer' },
  { id: 'graph', label: 'Graph Generation', icon: Network, route: '/gdl' },
  { id: 'inference', label: 'AI Inference', icon: BrainCircuit, route: '/reasoning' },
  { id: 'validation', label: 'Rules Validation', icon: ShieldCheck, route: '/validation' },
  { id: 'complete', label: 'Compliance Report', icon: CheckCircle2, route: '/validation' },
];

export default function SystemFlow() {
  // FIXED: Changed pipelineLogs to inferenceLogs
  const { pipelineState, inferenceLogs } = useAppStore();
  const navigate = useNavigate();

  const currentIndex = stages.findIndex(s => s.id === pipelineState);
  const activeIdx = pipelineState === 'complete' ? stages.length - 1 : Math.max(0, currentIndex);
  const logs = inferenceLogs || [];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Pipeline Visualization</h1>
        <p className="text-slate-500 mt-2">Real-time status of the AI geometry analysis engine.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {stages.map((stage, idx) => {
          const isPast = idx < activeIdx || pipelineState === 'complete';
          const isActive = idx === activeIdx && pipelineState !== 'complete';

          return (
            <motion.div key={stage.id} onClick={() => navigate(stage.route)} className={cn("glass-panel p-5 flex flex-col items-center text-center gap-4 cursor-pointer relative transition-all", isActive && "border-blue-400 ring-4 ring-blue-500/10 shadow-lg", isPast && "border-green-400/40 bg-green-50/30")}>
              <div className={cn("p-3.5 rounded-2xl", isActive ? "bg-blue-100 text-blue-600 shadow-inner" : isPast ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400")}>
                <stage.icon className={cn("w-7 h-7", isActive && "animate-pulse")} />
              </div>
              <div>
                <h3 className={cn("text-sm font-semibold", isActive ? "text-blue-900" : isPast ? "text-green-900" : "text-slate-500")}>{stage.label}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{isPast ? 'Completed' : isActive ? 'Processing...' : 'Pending'}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex-1 glass-panel p-6 flex flex-col mt-4 font-mono">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2 uppercase tracking-wider mb-4"><BrainCircuit className="w-5 h-5 text-indigo-500" /> Live Inference Terminal</h2>
        <div className="flex-1 bg-[#0f172a] rounded-xl p-6 overflow-y-auto text-emerald-400 shadow-inner">
          {logs.length === 0 ? <span className="text-slate-500">Waiting for trigger...</span> : (
            <div className="flex flex-col gap-1.5">
              {logs.map((log, i) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="text-sm">
                  <span className="text-blue-400">sys_kernel&gt;</span> {log}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}