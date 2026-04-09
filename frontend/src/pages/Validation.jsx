import { useAppStore } from '../store/useAppStore';
import { ShieldCheck, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Validation() {
  const { getActiveProject } = useAppStore();
  const project = getActiveProject();

  // SAFETY CHECK
  if (!project) {
    return <div className="p-8 text-center text-slate-500 mt-20">No active project selected.</div>;
  }

  const issues = project.issues || [];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Compliance & Validation</h1>
          <p className="text-slate-500 mt-2">ISO 10303 constraint evaluation report</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="glass-panel overflow-hidden border border-slate-200/60 shadow-sm">
        <div className="p-5 border-b border-slate-200 bg-white/70 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <h3 className="font-semibold text-slate-800 text-lg">Rule Violations Matrix</h3>
          </div>
          <div className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200 uppercase tracking-wider">
            {issues.length} Issues Found
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Issue ID</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Rule ID</th>
                <th className="p-4 font-semibold">Severity</th>
                <th className="p-4 font-semibold text-center">Auto-Fix Built-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/40">
              {issues.map((issue, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 font-mono text-xs text-slate-400 group-hover:text-blue-600 transition-colors">{issue.id || `ERR-${idx + 1}`}</td>
                  <td className="p-4 text-sm font-medium text-slate-700">{issue.title}</td>
                  <td className="p-4 font-mono text-xs text-indigo-600 bg-indigo-50/50">{issue.rule}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded font-bold text-[10px] uppercase tracking-widest border ${issue.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        issue.severity === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center">
                    {issue.fix ? <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-sm" /> : <AlertTriangle className="w-5 h-5 text-slate-300" />}
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-50" />
                    No violations found. Design is fully compliant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}