import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getSeverityConfig } from '../lib/severityConfig';
import {
  ShieldCheck, Download, AlertTriangle, CheckCircle2,
  XCircle, X, Zap, Wrench, BrainCircuit, Layers, ChevronRight
} from 'lucide-react';

// getSeverityConfig is now imported from '../lib/severityConfig'
// — shared with GDLGraph for identical look across all pages

// ——————————————————————————————————————
// Issue Detail Drawer
// ——————————————————————————————————————
function IssueDrawer({ issue, onClose }) {
  if (!issue) return null;
  const severityConfig = getSeverityConfig(issue.severity);

  return (
    <AnimatePresence>
      {issue && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40"
          />

          {/* Drawer Panel */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Issue Detail</p>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">{issue.title}</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">{issue.id}</p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 mt-1 p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex flex-col gap-5 p-6">

              {/* Severity + Rule Row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${severityConfig.badge}`}>
                  {severityConfig.icon}{issue.severity}
                </span>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-mono text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100 hover:text-indigo-900 transition-colors border border-indigo-100"
                >
                  {issue.rule}
                </a>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{issue.type}</span>
              </div>

              {/* Description Box */}
              <Section icon={<Info className="w-4 h-4 text-indigo-500" />} title="Issue Description">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {issue.reason || `Constraint violation detected in geometry node "${issue.meshId}". The current design does not conform to standard ${issue.rule} compliance requirements.`}
                </p>
              </Section>

              {/* Affected Geometry */}
              <Section icon={<Layers className="w-4 h-4 text-teal-500" />} title="Affected Geometry">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-100 font-mono">
                    mesh::{issue.meshId || 'unknown'}
                  </code>
                  <code className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-mono">
                    confidence: {issue.confidence || '—'}
                  </code>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {issue.impact || 'Impact assessment available after running full simulation pipeline.'}
                </p>
              </Section>

              {/* Rule Explanation */}
              <Section icon={<ShieldCheck className="w-4 h-4 text-blue-500" />} title="Rule Explanation">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rule <strong className="text-slate-800">{issue.rule}</strong> mandates minimum geometric and structural tolerances for parts under manufacturing and assembly conditions as defined by ISO 10303 and internal design-for-manufacture (DFM) standards.
                </p>
              </Section>

              {/* Suggested Fix */}
              {issue.fix && (
                <Section icon={<Wrench className="w-4 h-4 text-amber-500" />} title="Suggested Fix">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 leading-relaxed font-medium">
                    {issue.fix}
                  </div>
                  {issue.fix && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Auto-fix available for this issue
                    </div>
                  )}
                </Section>
              )}

              {/* AI Reasoning */}
              <Section icon={<BrainCircuit className="w-4 h-4 text-violet-500" />} title="AI Reasoning">
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200/60 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
                  <p>
                    AI model identified this violation with <strong className="text-violet-700">{issue.confidence || '>90%'}</strong> confidence
                    by analyzing the B-Rep topology graph and cross-referencing ISO 10303 and DFM constraint databases.
                    {issue.reason ? ` ${issue.reason}` : ' The geometric feature was flagged as non-conformant based on learned patterns from validated industrial CAD datasets.'}
                  </p>
                </div>
              </Section>

              {/* Close CTA */}
              <button
                onClick={onClose}
                className="w-full mt-2 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
              >
                Close Detail View
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-slate-100 rounded-lg">{icon}</div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// ——————————————————————————————————————
// Main Component
// ——————————————————————————————————————
export default function Validation() {
  const { getActiveProject } = useAppStore();
  const project = getActiveProject();
  const [selectedIssue, setSelectedIssue] = useState(null);

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-500 mt-20 flex flex-col items-center gap-3">
        <ShieldCheck className="w-12 h-12 text-slate-300" />
        <p className="font-semibold text-slate-700">No active project selected.</p>
        <p className="text-sm">Please select a project to view compliance data.</p>
      </div>
    );
  }

  const issues = project.issues || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Page Header */}
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Compliance &amp; Validation</h1>
            <p className="text-slate-500 mt-1.5 text-sm">ISO 10303 constraint evaluation report · {project.name}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-semibold hover:bg-slate-50 hover:shadow-md transition-all text-slate-700"
          >
            <Download className="w-4 h-4" /> Export PDF
          </motion.button>
        </div>

        {/* Main Panel */}
        <div className="glass-panel overflow-hidden border border-slate-200/60 shadow-sm rounded-2xl">

          {/* Panel Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white/70 flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Rule Violations Matrix</h3>
                <p className="text-xs text-slate-400">Click any row to view full issue detail</p>
              </div>
            </div>

            {/* Issue Count Badge */}
            {issues.length > 0 ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-300/50"
              >
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                <AlertTriangle className="w-3.5 h-3.5" />
                {issues.length} Issues Found
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All Clear
              </div>
            )}
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-bold">Issue ID</th>
                  <th className="px-5 py-3.5 font-bold">Description</th>
                  <th className="px-5 py-3.5 font-bold">Rule ID</th>
                  <th className="px-5 py-3.5 font-bold">Severity</th>
                  <th className="px-5 py-3.5 font-bold text-center">Auto-Fix</th>
                  <th className="px-5 py-3.5 font-bold text-center">Detail</th>
                </tr>
              </thead>
              <motion.tbody
                className="divide-y divide-slate-100"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {issues.map((issue, idx) => {
                  const sc = getSeverityConfig(issue.severity);
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.tr
                      key={idx}
                      variants={rowVariants}
                      onClick={() => setSelectedIssue(issue)}
                      className={`cursor-pointer transition-all duration-150 group ${isEven ? 'bg-white/60' : 'bg-slate-50/40'} ${sc.row} hover:shadow-inner`}
                    >
                      {/* Issue ID */}
                      <td className="px-5 py-4 font-mono text-xs text-slate-400 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                        {issue.id || `ERR-${idx + 1}`}
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4 text-sm font-medium text-slate-700 max-w-[260px]">
                        <span className="line-clamp-2">{issue.title}</span>
                        {issue.type && (
                          <span className="text-[10px] text-slate-400 font-normal block mt-0.5">{issue.type}</span>
                        )}
                      </td>

                      {/* Rule ID */}
                      <td className="px-5 py-4">
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); setSelectedIssue(issue); }}
                          className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md hover:bg-indigo-100 hover:text-indigo-900 hover:underline transition-all whitespace-nowrap"
                        >
                          {issue.rule}
                        </a>
                      </td>

                      {/* Severity Badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${sc.badge}`}>
                          {sc.icon}{issue.severity}
                        </span>
                      </td>

                      {/* Auto-Fix */}
                      <td className="px-5 py-4 text-center">
                        <div className="relative group/tooltip flex justify-center">
                          {issue.fix ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400, delay: idx * 0.1 }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-sm group-hover/tooltip:scale-125 transition-transform cursor-help" />
                            </motion.div>
                          ) : (
                            <XCircle className="w-5 h-5 text-slate-300 cursor-help" />
                          )}
                          {/* Tooltip */}
                          <div className="hidden group-hover/tooltip:flex absolute bottom-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-10 items-center gap-1.5">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            {issue.fix ? 'Auto-fix available' : 'Manual fix required'}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                          </div>
                        </div>
                      </td>

                      {/* Detail Chevron */}
                      <td className="px-5 py-4 text-center">
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 mx-auto transition-all group-hover:translate-x-1 duration-200" />
                      </td>
                    </motion.tr>
                  );
                })}

                {/* Empty State */}
                {issues.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4 opacity-60" />
                      <p className="text-slate-600 font-semibold text-base">All systems compliant</p>
                      <p className="text-slate-400 text-sm mt-1">No violations detected. Design is fully conformant.</p>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        {issues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 flex-wrap text-xs text-slate-500"
          >
            <span className="font-semibold text-slate-600">Severity Legend:</span>
            {['Critical', 'High', 'Medium', 'Low'].map((s) => {
              const c = getSeverityConfig(s);
              return (
                <span key={s} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${c.badge}`}>
                  {c.icon}{s}
                </span>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Issue Detail Drawer */}
      <AnimatePresence>
        {selectedIssue && (
          <IssueDrawer issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
        )}
      </AnimatePresence>
    </>
  );
}