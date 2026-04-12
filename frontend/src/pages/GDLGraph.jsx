import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow, Background, MiniMap, Controls, applyNodeChanges, applyEdgeChanges,
  MarkerType, useReactFlow, ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getSeverityConfig } from '../lib/severityConfig';
import {
  Network, X, Wrench, BrainCircuit, Layers, ShieldCheck,
  CheckCircle2, AlertTriangle, XCircle, Info, Maximize2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// IssueDrawer — Detail Panel
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

function IssueDrawer({ issue, onClose }) {
  if (!issue) return null;
  const sc = getSeverityConfig(issue.severity);

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
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  GDL Node Detail — {issue.id}
                </p>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">{issue.title}</h2>
              </div>
              <button onClick={onClose} className="ml-4 mt-1 p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5 p-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${sc.badge}`}>
                  {sc.icon}{issue.severity}
                </span>
                <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                  {issue.rule}
                </span>
              </div>

              <Section icon={<Info className="w-4 h-4 text-indigo-500" />} title="Issue Description">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {issue.reason || `Constraint violation detected. The current design does not conform to standard ${issue.rule} compliance requirements.`}
                </p>
              </Section>

              <Section icon={<ShieldCheck className="w-4 h-4 text-blue-500" />} title="Rule Explanation">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rule <strong className="text-slate-800">{issue.rule}</strong> mandates minimum geometric
                  and structural tolerances for parts under manufacturing and assembly conditions.
                </p>
              </Section>

              {issue.fix && (
                <Section icon={<Wrench className="w-4 h-4 text-amber-500" />} title="Suggested Fix">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 leading-relaxed font-medium">
                    {issue.fix}
                  </div>
                </Section>
              )}

              <Section icon={<BrainCircuit className="w-4 h-4 text-violet-500" />} title="AI Reasoning">
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200/60 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
                  <p>
                    AI model identified this violation with <strong className="text-violet-700">{issue.confidence || '>90%'}</strong> confidence
                    by analyzing the B-Rep topology graph.
                  </p>
                </div>
              </Section>

              <button onClick={onClose} className="w-full mt-2 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
                Close Detail View
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Node Style Builders
// ─────────────────────────────────────────────────────────────────────────────
const COL_X = [80, 400, 720];
const COL_X_L2 = [80, 400, 720];
const COL_X_L3 = [80, 400, 720];

const buildRootStyle = () => ({
  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  border: '2.5px solid #94a3b8',
  borderRadius: '16px',
  fontWeight: '800',
  fontSize: '13.5px',
  width: 240,
  textAlign: 'center',
  padding: '18px 16px',
  color: '#0f172a',
  boxShadow: '0 8px 28px rgba(148,163,184,0.32)',
  letterSpacing: '-0.3px',
});

const buildL1GroupStyle = () => ({
  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
  border: '1.5px solid #cbd5e1',
  borderRadius: '12px',
  padding: '13px 18px',
  fontSize: '12px',
  color: '#475569',
  fontWeight: '700',
  textAlign: 'center',
  width: 190,
});

const buildL2IntermediateStyle = () => ({
  background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)',
  border: '1.5px solid #a5b4fc',
  borderRadius: '10px',
  padding: '11px 16px',
  fontSize: '11.5px',
  color: '#3730a3',
  fontWeight: '600',
  textAlign: 'center',
  width: 188,
});

const buildValidStyle = () => ({
  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
  border: '1.5px solid #4ade80',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '12px',
  color: '#14532d',
  fontWeight: '700',
  textAlign: 'center',
  width: 188,
});

const buildErrorStyle = (issue, isHovered, isFocused, hasFocus) => {
  const sc = getSeverityConfig(issue.severity);
  const dimmed = hasFocus && !isFocused;
  return {
    background: isHovered ? sc.nodeBgHover : sc.nodeBg,
    border: `${isHovered ? '2.5px' : '1.5px'} solid ${isHovered ? sc.nodeBorderHover : sc.nodeBorder}`,
    borderRadius: '13px',
    color: dimmed ? '#94a3b8' : sc.nodeColor,
    fontWeight: '700',
    fontSize: '11px',
    width: 210,
    padding: '14px 16px',
    textAlign: 'center',
    opacity: dimmed ? 0.3 : 1,
    transition: 'all 0.25s ease-in-out',
    zIndex: isFocused ? 100 : 1,
    boxShadow: isFocused ? `0 0 0 4px ${sc.shadowColorHover}` : (isHovered ? `0 4px 12px ${sc.shadowColorHover}` : 'none'),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Inner graph component
// ─────────────────────────────────────────────────────────────────────────────
function GDLGraphInner() {
  const { pipelineState, getActiveProject, hoveredIssueId, setHoveredIssueId } = useAppStore();
  const project = getActiveProject();

  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);

  const hasFocus = focusedNodeId !== null;

  const dynamicExtent = useMemo(() => {
    const numIssues = project?.issues?.length || 0;
    const maxRows = Math.ceil(numIssues / 3);
    const calculatedMaxY = numIssues > 0 ? 660 + (maxRows * 155) + 100 : 600;
    return [[-50, -50], [1030, calculatedMaxY]];
  }, [project?.issues?.length]);


  useEffect(() => {
    if (!project) return;

    const baseNodes = [
      { id: 'root', position: { x: 365, y: 20 }, data: { label: `${project.name}\n(Root B-Rep Topology)` }, type: 'input', style: buildRootStyle() },
      { id: 'n1', position: { x: COL_X[0], y: 175 }, data: { label: '⬡  Primary Shell Faces' }, style: buildL1GroupStyle() },
      { id: 'n2', position: { x: COL_X[1], y: 175 }, data: { label: '⬡  Structural Features' }, style: buildL1GroupStyle() },
      { id: 'n3', position: { x: COL_X[2], y: 175 }, data: { label: '⬡  Boundary Edges' }, style: buildL1GroupStyle() },
      { id: 'm1', position: { x: COL_X_L2[0], y: 330 }, data: { label: '◈  Reinforcement Layer\nRib & Gusset Analysis' }, style: buildL2IntermediateStyle() },
      { id: 'm2', position: { x: COL_X_L2[1], y: 330 }, data: { label: '◈  Mounting Interfaces\nBolt Pattern & PCD' }, style: buildL2IntermediateStyle() },
      { id: 'm3', position: { x: COL_X_L2[2], y: 330 }, data: { label: '◈  Edge Conditions\nBlend Radius & Draft' }, style: buildL2IntermediateStyle() },
      { id: 'v1', position: { x: COL_X_L3[0], y: 490 }, data: { label: '✓  Manifold Continuity\nISO 10303-42 Compliant' }, style: buildValidStyle() },
      { id: 'v2', position: { x: COL_X_L3[1], y: 490 }, data: { label: '✓  Extrusion Standards\nDFM-Ext-02 Compliant' }, style: buildValidStyle() },
      { id: 'v3', position: { x: COL_X_L3[2], y: 490 }, data: { label: '✓  Fillet Tolerances\nISO-13715 Compliant' }, style: buildValidStyle() },
    ];

    const EDGE_GRAY = { stroke: '#94a3b8', strokeWidth: 1.5 };
    const EDGE_INDIGO = { stroke: '#a5b4fc', strokeWidth: 1.5 };
    const EDGE_GREEN = { stroke: '#86efac', strokeWidth: 1.5 };

    const baseEdges = [
      { id: 'e-r-n1', source: 'root', target: 'n1', type: 'smoothstep', style: EDGE_GRAY },
      { id: 'e-r-n2', source: 'root', target: 'n2', type: 'smoothstep', style: EDGE_GRAY },
      { id: 'e-r-n3', source: 'root', target: 'n3', type: 'smoothstep', style: EDGE_GRAY },
      { id: 'e-n1-m1', source: 'n1', target: 'm1', type: 'smoothstep', style: EDGE_INDIGO },
      { id: 'e-n2-m2', source: 'n2', target: 'm2', type: 'smoothstep', style: EDGE_INDIGO },
      { id: 'e-n3-m3', source: 'n3', target: 'm3', type: 'smoothstep', style: EDGE_INDIGO },
      { id: 'e-m1-v1', source: 'm1', target: 'v1', type: 'smoothstep', style: EDGE_GREEN },
      { id: 'e-m2-v2', source: 'm2', target: 'v2', type: 'smoothstep', style: EDGE_GREEN },
      { id: 'e-m3-v3', source: 'm3', target: 'v3', type: 'smoothstep', style: EDGE_GREEN },
    ];

    if (project.issues?.length > 0) {
      const vParents = ['v1', 'v2', 'v3'];

      project.issues.forEach((issue, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const isHov = hoveredIssueId === issue.id;
        const isFoc = focusedNodeId === issue.id;
        const sc = getSeverityConfig(issue.severity);

        baseNodes.push({
          id: issue.id,
          position: { x: COL_X_L3[col] - 10, y: 660 + row * 155 },
          data: { label: issue.title },
          style: buildErrorStyle(issue, isHov, isFoc, hasFocus),
        });

        baseEdges.push({
          id: `e-${vParents[col]}-${issue.id}`,
          source: vParents[col],
          target: issue.id,
          type: 'smoothstep',
          animated: isHov || isFoc,
          markerEnd: { type: MarkerType.ArrowClosed, color: isHov ? sc.edgeStrokeHover : sc.edgeStroke },
          style: {
            stroke: isHov ? sc.edgeStrokeHover : sc.edgeStroke,
            strokeWidth: isHov || isFoc ? 2.5 : 1.5,
            opacity: hasFocus && !isFoc ? 0.2 : 1,
            transition: 'all 0.25s ease',
          },
        });
      });
    }

    setNodes(baseNodes);
    setEdges(baseEdges);
  }, [project, hoveredIssueId, focusedNodeId, hasFocus]);

  const onNodesChange = useCallback((c) => setNodes((n) => applyNodeChanges(c, n)), []);
  const onEdgesChange = useCallback((c) => setEdges((e) => applyEdgeChanges(c, e)), []);

  const handleNodeMouseEnter = useCallback((_, node) => {
    if (project?.issues?.find(i => i.id === node.id)) setHoveredIssueId(node.id);
  }, [project, setHoveredIssueId]);

  const handleNodeMouseLeave = useCallback(() => setHoveredIssueId(null), [setHoveredIssueId]);

  const handleNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    const issue = project?.issues?.find(i => i.id === node.id);
    if (issue) {
      setFocusedNodeId(prev => prev === node.id ? null : node.id);
      setSelectedIssue(prev => prev?.id === issue.id ? null : issue);
    }
  }, [project]);

  const handlePaneClick = useCallback(() => {
    setFocusedNodeId(null);
    setSelectedIssue(null);
  }, []);

  // ── Wheel handler: let regular scroll pass through to the page;
  //    only intercept ctrl/meta wheel (pinch-to-zoom trackpad gesture).
  const handleWheelCapture = useCallback((e) => {
    if (!e.ctrlKey && !e.metaKey) {
      // Plain scroll — do NOT stop propagation, let the page scroll
      return;
    }
    // Pinch/ctrl+wheel — let ReactFlow handle zoom, stop page from zooming
    e.stopPropagation();
  }, []);

  const issues = project?.issues || [];
  const validCount = 6;
  const critCount = issues.filter(i => i.severity === 'Critical').length;
  const highCount = issues.filter(i => i.severity === 'High').length;
  const medCount = issues.filter(i => i.severity === 'Medium').length;
  const nodeCount = nodes.length;

  if (!project) return null;

  return (
    <>
      <motion.div
        className="flex flex-col gap-4 pb-12"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Aegis CAD · GDL Engine</p>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">GDL Visualization</h1>
          </div>
          <AnimatePresence>
            {hasFocus && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={() => { setFocusedNodeId(null); setSelectedIssue(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 shadow-md"
              >
                <Maximize2 className="w-4 h-4" /> Exit Focus Mode
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="glass-panel border border-slate-200/70 px-5 py-4 flex items-center gap-3.5 rounded-2xl bg-white/60">
            <div className="p-2.5 bg-slate-100 rounded-xl shrink-0"><Network className="w-4 h-4 text-slate-600" /></div>
            <div><p className="text-[9px] font-bold uppercase text-slate-400">Total Nodes</p><p className="text-2xl font-extrabold text-slate-800">{nodeCount}</p></div>
          </div>
          <div className="glass-panel border border-emerald-200/70 px-5 py-4 flex items-center gap-3.5 rounded-2xl bg-emerald-50/50">
            <div className="p-2.5 bg-emerald-100 rounded-xl shrink-0"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
            <div><p className="text-[9px] font-bold uppercase text-emerald-600/80">Passed</p><p className="text-2xl font-extrabold text-emerald-700">{validCount}</p></div>
          </div>
          <div className="glass-panel border border-rose-200/70 px-5 py-4 flex items-center gap-3.5 rounded-2xl bg-rose-50/40">
            <div className="p-2.5 bg-rose-100 rounded-xl shrink-0"><XCircle className="w-4 h-4 text-rose-600" /></div>
            <div><p className="text-[9px] font-bold uppercase text-rose-500/80">Critical / High</p><p className="text-2xl font-extrabold text-rose-700">{critCount + highCount}</p></div>
          </div>
          <div className="glass-panel border border-indigo-200/70 px-5 py-4 flex items-center gap-3.5 rounded-2xl bg-indigo-50/40">
            <div className="p-2.5 bg-indigo-100 rounded-xl shrink-0"><AlertTriangle className="w-4 h-4 text-indigo-500" /></div>
            <div><p className="text-[9px] font-bold uppercase text-indigo-500/80">Medium</p><p className="text-2xl font-extrabold text-indigo-700">{medCount}</p></div>
          </div>
        </div>

        <div className="glass-panel border border-slate-200/70 shadow-md rounded-2xl overflow-hidden relative bg-white/60 flex flex-col">

          <div className="px-6 py-4 border-b border-slate-200 bg-white/80 flex items-center justify-between flex-wrap gap-3 shrink-0 z-10">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-50 rounded-xl"><Network className="w-6 h-6 text-indigo-600" /></div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">B-Rep Topology Graph — {project.name}</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Click &amp; Drag to Pan · Pinch or Buttons to Zoom · Scroll to Move Page
                </p>
              </div>
            </div>
          </div>

          {/* FIX: onWheelCapture lets plain scroll pass to the page,
              only intercepts ctrl/meta+wheel for pinch-zoom inside graph */}
          <div
            className="relative w-full h-[650px]"
            onWheelCapture={handleWheelCapture}
          >
            {/* Zoom Controls — increased factor for snappier zoom */}
            <div className="absolute bottom-6 right-6 z-10 flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-slate-200">
              <button
                onClick={() => zoomIn({ duration: 200, factor: 1.4 })}
                className="w-14 h-14 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border-b border-slate-200 text-3xl font-light transition-colors"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => zoomOut({ duration: 200, factor: 1.4 })}
                className="w-14 h-14 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border-b border-slate-200 text-4xl font-light transition-colors"
                title="Zoom Out"
              >
                −
              </button>
              <button
                onClick={() => fitView({ padding: 0.1, duration: 250 })}
                className="w-14 h-14 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                title="Fit to Screen"
              >
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeMouseEnter={handleNodeMouseEnter}
              onNodeMouseLeave={handleNodeMouseLeave}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              fitView
              fitViewOptions={{ padding: 0.1, maxZoom: 1.2, duration: 250 }}
              translateExtent={dynamicExtent}
              minZoom={0.3}
              maxZoom={3}

              // ── Scroll behaviour fixes ──────────────────────────────────
              // Wheel does NOT zoom or pan the graph — page scrolls normally
              zoomOnScroll={false}
              panOnScroll={false}
              // Critical: don't consume wheel events so the page can scroll
              preventScrolling={false}

              // ── Zoom / pan controls ─────────────────────────────────────
              panOnDrag={true}           // drag to pan
              zoomOnPinch={true}         // trackpad pinch still zooms
              zoomOnDoubleClick={true}   // double-click also zooms in

              className="bg-transparent h-full w-full cursor-grab active:cursor-grabbing"
            >
              <Background variant="dots" color="#cbd5e1" gap={24} size={1.5} />

              <MiniMap
                position="bottom-left"
                className="!bg-white/90 !backdrop-blur-md !border-slate-200 !shadow-lg !rounded-xl overflow-hidden m-5"
                nodeColor={(node) => {
                  if (node.id === 'root') return '#94a3b8';
                  if (node.id.startsWith('v')) return '#4ade80';
                  if (node.id.startsWith('m')) return '#a5b4fc';
                  if (node.id.startsWith('ERR')) return '#f87171';
                  return '#cbd5e1';
                }}
                maskColor="rgba(248, 250, 252, 0.7)"
              />
            </ReactFlow>
          </div>

        </div>
      </motion.div>

      <AnimatePresence>
        {selectedIssue && (
          <IssueDrawer
            issue={selectedIssue}
            onClose={() => { setSelectedIssue(null); setFocusedNodeId(null); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function GDLGraph() {
  return (
    <ReactFlowProvider>
      <GDLGraphInner />
    </ReactFlowProvider>
  );
}