import { useState } from 'react';
import { BookOpen, Search, Code, CheckCircle, Clock, Plus, ShieldAlert, AlertTriangle, AlertCircle, ToggleLeft, ToggleRight, Fingerprint } from 'lucide-react';
import { useAppStore, ALL_ISSUES_DB } from '../store/useAppStore';

export default function KnowledgeBase() {
  const { getActiveProject } = useAppStore();
  const activeProject = getActiveProject();

  const getHits = (ruleCode) => {
    if (!activeProject || !activeProject.issues) return 0;
    return activeProject.issues.filter(i => i.rule === ruleCode || i.id === ruleCode).length;
  };

  const [rules, setRules] = useState(
    ALL_ISSUES_DB.map(issue => ({
      id: issue.rule,
      name: issue.title,
      type: issue.type,
      severity: issue.severity,
      updated: '1 hour ago',
      active: true
    }))
  );

  const toggleRule = (idx) => {
    const newRules = [...rules];
    newRules[idx].active = !newRules[idx].active;
    setRules(newRules);
  };

  const handleAddRule = () => {
    const ruleName = prompt("Enter the name for the new manufacturing rule:");
    if (ruleName) {
      const newRule = {
        id: `CUSTOM-${Math.floor(Math.random() * 900) + 100}`,
        name: ruleName,
        type: 'Custom Constraint',
        severity: 'Medium',
        updated: 'Just now',
        active: true
      };
      setRules([newRule, ...rules]);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Rules Knowledge Base</h1>
          <p className="text-slate-500 mt-2">Manage validation heuristics and ISO 10303 rules</p>
        </div>
        <button onClick={handleAddRule} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm rounded-lg text-sm font-medium hover:shadow-md transition-all hover:-translate-y-[1px]">
          <Plus className="w-4 h-4" /> Add Custom Rule
        </button>
      </div>

      <div className="glass-panel overflow-hidden border border-slate-200/60 shadow-sm rounded-xl">
        <div className="p-5 border-b border-slate-200 bg-white/70 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search rules database by ID or Name..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors bg-white/50" />
          </div>
          <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">{rules.length} Rules Active</div>
        </div>
        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Rule Identifier</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Severity</th>
                <th className="p-4 font-semibold text-center">Evaluation</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/40">
              {rules.map((rule, idx) => {
                const hits = getHits(rule.id);
                return (
                  <tr key={idx} className={`transition-colors group hover:bg-slate-50/80 ${!rule.active && 'opacity-50 grayscale'}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-indigo-400" />
                        <span className="font-mono text-sm text-indigo-700 font-medium group-hover:text-indigo-900">{rule.id}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-800">{rule.name}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        {rule.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                        rule.severity === 'Critical' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                        rule.severity === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        rule.severity === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {rule.severity === 'Critical' && <ShieldAlert className="w-3 h-3" />}
                        {rule.severity === 'High' && <AlertTriangle className="w-3 h-3" />}
                        {rule.severity === 'Medium' && <AlertCircle className="w-3 h-3" />}
                        {rule.severity}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {activeProject?.status === 'completed' ? (
                        hits > 0 ? (
                           <span className="inline-flex items-center justify-center min-w-[70px] gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] uppercase tracking-wider font-bold rounded shadow-sm border border-rose-200">
                             <AlertCircle className="w-3.5 h-3.5" /> 
                             Violated ({hits})
                           </span>
                        ) : (
                           <span className="inline-flex items-center justify-center min-w-[70px] gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-wider font-bold rounded shadow-sm border border-emerald-200">
                             <CheckCircle className="w-3.5 h-3.5" /> 
                             Satisfied
                           </span>
                        )
                      ) : (
                         <span className="inline-flex items-center justify-center min-w-[70px] gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold rounded shadow-sm border border-slate-200">
                           <Clock className="w-3.5 h-3.5" />
                           Pending
                         </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleRule(idx)} className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${rule.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {rule.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5" />} 
                        {rule.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}