import { useAppStore } from '../store/useAppStore';
import { BrainCircuit, Cpu, Network, CheckCircle2, AlertCircle, Info, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reasoning() {
  const { inferenceLogs, getActiveProject, hoveredIssueId, setHoveredIssueId } = useAppStore();
  const logs = inferenceLogs || [];
  const project = getActiveProject();
  const issues = project?.issues || [];
  const isCompleted = project?.status === 'completed';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">AI Reasoning Engine</h1>
          <p className="text-slate-500 mt-2">Transparent inference steps and structural analysis</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-lg text-indigo-800 text-sm font-medium">
          <Cpu className="w-5 h-5" /><span>Model: <span className="font-bold">BRepGAT-v2.1</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 pb-4 overflow-hidden">
        {/* Left Side: Structured Reasoning Cards */}
        <div className="glass-panel flex flex-col md:col-span-2 border border-slate-200/60 overflow-hidden">
          <div className="p-4 border-b border-slate-200/60 bg-white/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-indigo-600" /> Structural Analysis Findings
            </h3>
            {isCompleted && (
               <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">Validation Complete</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {!isCompleted ? (
               <div className="bg-[#0f172a] p-6 rounded-xl font-mono text-sm h-full text-emerald-400 overflow-y-auto flex flex-col gap-2">
                 {logs.length === 0 && <span className="text-slate-500">Awaiting execution trace...</span>}
                 {logs.map((log, i) => (
                   <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i}>
                     <span className="text-blue-400">core&gt;</span> <span className="text-slate-300">{log}</span>
                   </motion.div>
                 ))}
               </div>
            ) : issues.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                  <p className="font-bold text-lg">No Issues Detected</p>
               </div>
            ) : (
               <div className="flex flex-col gap-6">
                 {issues.map((issue, idx) => (
                    <motion.div 
                      key={issue.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onMouseEnter={() => setHoveredIssueId(issue.id)}
                      onMouseLeave={() => setHoveredIssueId(null)}
                      className={`flex flex-col rounded-xl border-2 transition-all p-5 shadow-sm bg-white ${hoveredIssueId === issue.id ? 'border-indigo-400 shadow-indigo-100/50 scale-[1.01] z-10 relative' : 'border-slate-100'}`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${issue.severity === 'Critical' ? 'bg-rose-100 text-rose-600' : issue.severity === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                             <AlertCircle className="w-5 h-5" />
                           </div>
                           <div>
                             <h4 className="font-bold text-lg text-slate-800 leading-tight">{issue.title}</h4>
                             <p className="text-xs font-mono text-slate-500 mt-1">Rule: {issue.rule}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full mb-1">
                             Confidence: {issue.confidence}
                           </span>
                         </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {/* Why this is an issue */}
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            <Info className="w-4 h-4 text-blue-500" /> Origin Reason
                          </h5>
                          <p className="text-sm text-slate-600">{issue.reason || 'Geometry violates basic topology constraints.'}</p>
                        </div>
                        
                        {/* Manufacturing Impact */}
                        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                          <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800 mb-2">
                            <Network className="w-4 h-4 text-rose-500" /> Manufacturing Impact
                          </h5>
                          <p className="text-sm text-rose-700">{issue.impact || 'General structural failure risk increased.'}</p>
                        </div>
                      </div>

                      {/* Suggested Fix */}
                      <div className="mt-4 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                         <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md shrink-0"><Wrench className="w-4 h-4" /></div>
                         <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1">Suggested Mitigation</h5>
                            <p className="text-sm text-indigo-800 font-medium flex items-center gap-2">
                              {issue.fix}
                            </p>
                         </div>
                      </div>
                    </motion.div>
                 ))}
               </div>
            )}
          </div>
        </div>

        {/* Right Side: Stats Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 text-center flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-0 shadow-lg shadow-indigo-600/20">
            <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4">Global Confidence Score</h3>
            <div className="text-6xl font-black text-white drop-shadow-md">{project?.validationScore || '0%'}</div>
            <p className="text-indigo-200 text-xs mt-4 max-w-[200px]">AI certainty across {project?.stats?.totalNodes || 0} evaluated nodes</p>
          </div>
          <div className="glass-panel p-6 flex-1">
            <h3 className="text-slate-500 text-xs font-bold uppercase mb-5">Node Classifications</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Evaluated Faces</span>
                <b className="text-slate-800">{project?.stats?.edges ? (project.stats.edges / 2).toFixed(0) : 0}</b>
              </li>
              <li className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                <span className="flex items-center gap-2 text-rose-600 font-bold"><BrainCircuit className="w-4 h-4" /> Hard Violations</span>
                <b className="text-rose-600 text-lg">{issues.length}</b>
              </li>
            </ul>
            
            {/* Visual Indicator Hint */}
            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 flex items-start gap-2">
               <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
               <p>Hover over any issue panel to instantly highlight the affected geometry component within the 3D Viewer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}