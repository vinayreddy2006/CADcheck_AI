import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getSeverityConfig } from '../lib/severityConfig';
import {
  ShieldCheck, Download, AlertTriangle, CheckCircle2,
  XCircle, X, Zap, Wrench, BrainCircuit, ChevronRight,
  Loader2, FileText, Database, ShieldAlert, Info,
  BookOpen, ExternalLink, Shield, FileWarning, CheckCircle
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Rule Reference Docs
// ─────────────────────────────────────────────────────────────────────────────
const RULE_DOCS = {
  'OEM-Min-Wall-Std-AL-02': {
    title: 'OEM Minimum Wall Standard — Aluminium',
    standard: 'OEM Internal Spec (Rev 02)',
    section: '4.2.1 — Structural Thickness',
    description: 'Specifies the minimum permissible wall thickness for aluminium structural components subjected to static and dynamic load cases. Derived from OEM crash simulation data.',
    requirement: 'All primary structural walls in aluminium panels must maintain a minimum thickness of 2.8 mm across the full load-bearing surface.',
    reference: 'OEM-STRUCT-AL-2022',
    consequence: 'Sub-minimum walls risk catastrophic deformation under 40 kN side-impact load. Immediate redesign required.',
  },
  'Hinge-Fastener-Std-07': {
    title: 'Hinge Fastener Clearance Standard',
    standard: 'Assembly & Fastener Guide',
    section: '7.3 — M8 Clearance Bore',
    description: 'Defines mandatory clearance bore geometry for M8 fasteners used in hinge bracket assemblies. Ensures proper torque application.',
    requirement: 'Clearance bores for M8 fasteners must be Ø8.4 mm +0.1/−0.0 mm with a countersink depth of 1.2 mm min.',
    reference: 'DIN 74-02, VDA 19.1',
    consequence: 'Missing bore causes M8 interference during assembly, leading to torque overload on robotic fastening station.',
  },
  'ISO-13715': {
    title: 'Edge Condition & Blend Radius',
    standard: 'ISO 13715:2017',
    section: '5 — Dihedral Edge Indication',
    description: 'Governs the indication, interpretation, and tolerance of edge states on technical drawings and 3D models.',
    requirement: 'Dihedral edges at extrusion junctions must carry a minimum blend radius of R0.4 mm. Zero-radius sharp edges are non-conformant.',
    reference: 'ASME Y14.5-2018 §2.15',
    consequence: 'Unblended dihedral edges cause stress concentrations leading to fatigue crack initiation and ergonomic hazards.',
  },
};

const getRuleDoc = (ruleId) =>
  RULE_DOCS[ruleId] || {
    title: `Compliance Rule: ${ruleId}`,
    standard: 'Internal Standard',
    section: 'General Guidelines',
    description: 'This rule enforces geometric, structural, or manufacturing tolerances as defined in the applicable OEM or ISO standard.',
    requirement: 'Refer to the full standards document for specific tolerance values and measurement methodology.',
    reference: ruleId,
    consequence: 'Non-conformance may result in downstream manufacturing or assembly failures.',
  };


// ─────────────────────────────────────────────────────────────────────────────
// Upgraded Rule Reference Modal (Click View)
// ─────────────────────────────────────────────────────────────────────────────
function RuleModal({ ruleId, onClose }) {
  if (!ruleId) return null;
  const doc = getRuleDoc(ruleId);

  return (
    <AnimatePresence>
      {ruleId && (
        <>
          <motion.div
            key="rule-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />
          <motion.div
            key="rule-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Sleek Engineering Header */}
              <div className="bg-[#0f172a] px-8 py-6 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Engineering Standard</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white leading-tight">{doc.title}</h2>
                    <p className="text-blue-200/70 text-sm mt-1.5 font-mono">{ruleId}</p>
                  </div>
                  <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 flex flex-col gap-6 overflow-y-auto bg-slate-50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Standard Authority</p>
                    <p className="text-sm font-semibold text-slate-800">{doc.standard}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Document Section</p>
                    <p className="text-sm font-semibold text-slate-800">{doc.section}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> Description</h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">{doc.description}</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strict Requirement</h4>
                  <p className="text-sm text-emerald-900 leading-relaxed font-medium">{doc.requirement}</p>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-rose-700 mb-2 flex items-center gap-2"><FileWarning className="w-4 h-4" /> Non-Conformance Impact</h4>
                  <p className="text-sm text-rose-900 leading-relaxed">{doc.consequence}</p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Database className="w-4 h-4" />
                    <span className="text-xs font-mono">Ref: {doc.reference}</span>
                  </div>
                  <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-md">
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NEW & IMPROVED Exception Approval Confirmation Modal (Light Red/Rose)
// ─────────────────────────────────────────────────────────────────────────────
function ExceptionConfirmModal({ issue, onConfirm, onCancel }) {
  if (!issue) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* BEAUTIFUL LIGHT RED GRADIENT HEADER */}
          <div className="bg-gradient-to-r from-rose-500 to-red-500 px-6 py-4 flex items-center gap-3 shadow-sm">
            <ShieldAlert className="w-6 h-6 text-white" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">Approve Exception?</h2>
          </div>

          <div className="p-6 bg-slate-50/50">
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              You are about to manually override the AI and mark <strong className="text-slate-900 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">{issue.id}</strong> as an approved exception.
            </p>

            {/* UPGRADED CONSEQUENCE BOX */}
            <div className="bg-white border border-rose-100 rounded-xl p-4 mb-6 shadow-sm">
              <p className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <FileWarning className="w-3.5 h-3.5" /> Action Consequences
              </p>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside pl-1 marker:text-rose-300">
                <li>Remove the violation from the active compliance report.</li>
                <li>Recalculate the global validation score.</li>
                <li>Log your Engineering ID as the overriding authority.</li>
              </ul>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(issue.id)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-bold shadow-md shadow-rose-200 hover:from-rose-600 hover:to-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section helper for Drawer
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Issue Detail Drawer
// ─────────────────────────────────────────────────────────────────────────────
function IssueDrawer({ issue, onClose, onOpenRule, onApproveException }) {
  if (!issue) return null;
  const severityConfig = getSeverityConfig(issue.severity);

  return (
    <AnimatePresence>
      {issue && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Issue Detail</p>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">{issue.title}</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">{issue.id}</p>
              </div>
              <button onClick={onClose} className="ml-4 mt-1 p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5 p-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${severityConfig.badge}`}>
                  {severityConfig.icon}{issue.severity}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenRule(issue.rule)}
                  className="font-mono text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100 hover:text-indigo-900 transition-colors border border-indigo-100 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3" /> {issue.rule} <ExternalLink className="w-3 h-3 opacity-60" />
                </button>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{issue.type}</span>
              </div>

              <Section icon={<Info className="w-4 h-4 text-indigo-500" />} title="Issue Description">
                <p className="text-sm text-slate-600 leading-relaxed">{issue.reason || `Constraint violation detected in geometry node "${issue.meshId}".`}</p>
              </Section>

              {issue.rawSnippet && (
                <Section icon={<FileText className="w-4 h-4 text-emerald-500" />} title="RAG Source Document">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5"><Database className="w-3 h-3" /> Vector Match</span>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">{issue.sourceDoc}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-serif italic leading-relaxed">"{issue.rawSnippet}"</p>
                  </div>
                </Section>
              )}

              {issue.fix && (
                <Section icon={<Wrench className="w-4 h-4 text-amber-500" />} title="Suggested Fix">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 leading-relaxed font-medium">{issue.fix}</div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Auto-fix available for this issue</div>
                </Section>
              )}

              {/* ACTION BUTTONS (Inside Drawer) */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* Changed this button to rose/red theme too */}
                <button
                  onClick={() => onApproveException(issue)}
                  className="w-full py-3 rounded-xl bg-white border-2 border-rose-300 text-rose-600 text-sm font-bold hover:bg-rose-50 hover:border-rose-400 transition-colors flex items-center justify-center gap-2 group"
                >
                  <ShieldAlert className="w-4 h-4 group-hover:scale-110 transition-transform" /> Approve Exception
                </button>
                <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
                  Close Detail
                </button>
              </div>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Validation() {
  const { getActiveProject, waiveIssue } = useAppStore();
  const project = getActiveProject();

  // States
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [ruleModalId, setRuleModalId] = useState(null);
  const [exceptionConfirmIssue, setExceptionConfirmIssue] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

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

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const rowVariants = { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => { setIsExporting(false); window.print(); }, 1000);
  };

  const executeApproveException = (issueId) => {
    waiveIssue(issueId);
    setExceptionConfirmIssue(null);
    setSelectedIssue(null);
  };

  return (
    <>
      <motion.div className="flex flex-col gap-6 pb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* Header */}
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Compliance &amp; Validation</h1>
            <p className="text-slate-600 mt-1.5 text-sm font-medium">ISO 10303 constraint evaluation report · {project.name}</p>
          </div>
          <motion.button
            whileHover={!isExporting ? { scale: 1.04, y: -1 } : {}}
            whileTap={!isExporting ? { scale: 0.97 } : {}}
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isExporting ? 'bg-blue-50 text-blue-500 border border-blue-200 cursor-wait' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-md'}`}
          >
            {isExporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Download className="w-4 h-4" /> Export PDF</>}
          </motion.button>
        </div>

        {/* Main Panel */}
        <div className="glass-panel overflow-hidden border border-slate-200/60 shadow-sm rounded-2xl relative">

          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white/70 flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg"><ShieldCheck className="w-5 h-5 text-indigo-600" /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Rule Violations Matrix</h3>
                <p className="text-xs text-slate-400">Click any row to view full issue detail or approve exceptions.</p>
              </div>
            </div>
            {issues.length > 0 ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-300/50">
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                <AlertTriangle className="w-3.5 h-3.5" /> {issues.length} Issues Found
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Clear — Production Ready
              </div>
            )}
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto pb-12">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-bold">Issue ID</th>
                  <th className="px-5 py-3.5 font-bold">Description</th>
                  <th className="px-5 py-3.5 font-bold">Rule ID</th>
                  <th className="px-5 py-3.5 font-bold">Severity</th>
                  <th className="px-5 py-3.5 font-bold text-center">Auto-Fix</th>
                  <th className="px-5 py-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <motion.tbody className="divide-y divide-slate-100" variants={containerVariants} initial="hidden" animate="visible">
                {issues.map((issue, idx) => {
                  const sc = getSeverityConfig(issue.severity);
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.tr
                      key={issue.id}
                      variants={rowVariants}
                      onClick={() => setSelectedIssue(issue)}
                      className={`cursor-pointer transition-all duration-150 group ${isEven ? 'bg-white/60' : 'bg-slate-50/40'} ${sc.row} hover:shadow-inner`}
                    >
                      <td className="px-5 py-4 font-mono text-xs text-slate-400 group-hover:text-blue-600 transition-colors whitespace-nowrap">{issue.id}</td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700 max-w-[280px]">
                        <span className="line-clamp-2">{issue.title}</span>
                        {issue.type && <span className="text-[10px] text-slate-400 font-normal block mt-0.5">{issue.type}</span>}
                      </td>

                      {/* Rule ID Button (Hover removed) */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setRuleModalId(issue.rule); }}
                          className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md hover:bg-indigo-100 hover:text-indigo-900 transition-all whitespace-nowrap flex items-center gap-1.5 border border-indigo-100"
                        >
                          <BookOpen className="w-3 h-3" /> {issue.rule}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${sc.badge}`}>
                          {sc.icon}{issue.severity}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="relative group/tooltip flex justify-center">
                          {issue.fix ? <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-sm group-hover/tooltip:scale-125 transition-transform cursor-help" /> : <XCircle className="w-5 h-5 text-slate-300 cursor-help" />}
                          <div className="hidden group-hover/tooltip:flex absolute bottom-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-10 items-center gap-1.5">
                            <Zap className="w-3 h-3 text-yellow-400" /> {issue.fix ? 'Auto-fix available' : 'Manual fix required'}
                          </div>
                        </div>
                      </td>

                      {/* ACTIONS - Changed to Light Red/Rose Theme */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setExceptionConfirmIssue(issue); }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all whitespace-nowrap"
                            title="Approve Exception (Human Override)"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" /> Approve Exception
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIssue(issue); }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all whitespace-nowrap"
                            title="View full issue detail"
                          >
                            Detail <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {issues.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4 opacity-60" />
                      <p className="text-slate-600 font-semibold text-base">All systems compliant</p>
                      <p className="text-slate-400 text-sm mt-1">No violations detected. Design is fully conformant and ready for production.</p>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Click Rule Documentation Modal */}
      <RuleModal ruleId={ruleModalId} onClose={() => setRuleModalId(null)} />

      {/* Click Issue Row Detail Drawer */}
      <AnimatePresence>
        {selectedIssue && (
          <IssueDrawer
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
            onOpenRule={(ruleId) => { setSelectedIssue(null); setRuleModalId(ruleId); }}
            onApproveException={(issue) => setExceptionConfirmIssue(issue)}
          />
        )}
      </AnimatePresence>

      {/* Human-In-The-Loop Approval Confirmation */}
      <ExceptionConfirmModal
        issue={exceptionConfirmIssue}
        onCancel={() => setExceptionConfirmIssue(null)}
        onConfirm={executeApproveException}
      />
    </>
  );
}