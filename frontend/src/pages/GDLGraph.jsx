import { useState, useCallback, useEffect, useMemo } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, MarkerType, BezierEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, Search, Filter, Cuboid } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function GDLGraph() {
  const { pipelineState, getActiveProject, hoveredIssueId, setHoveredIssueId } = useAppStore();
  const project = getActiveProject();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Generate a dynamic graph based on the AI issues
  useEffect(() => {
    if (!project) return;

    let baseNodes = [];
    let baseEdges = [];

    if (project.name === 'Smartphone Chassis') {
      baseNodes = [
        { id: 'root', position: { x: 400, y: 50 }, data: { label: 'Smartphone Assembly (Root)' }, type: 'input', style: { background: '#f8fafc', border: '2px solid #94a3b8', borderRadius: '12px', fontWeight: 'bold', padding: '10px 20px' } },
        { id: 'comp-shell', position: { x: 200, y: 150 }, data: { label: 'Aluminum Shell' }, style: { background: '#fdf8f6', border: '1px solid #cbd5e1', borderRadius: '8px' } },
        { id: 'comp-screen', position: { x: 400, y: 150 }, data: { label: 'Screen Recess' }, style: { background: '#fdf8f6', border: '1px solid #cbd5e1', borderRadius: '8px' } },
        { id: 'comp-io', position: { x: 600, y: 150 }, data: { label: 'I/O & Buttons' }, style: { background: '#fdf8f6', border: '1px solid #cbd5e1', borderRadius: '8px' } },

        // Valid Nodes
        { id: 'f-shell-valid', position: { x: 150, y: 250 }, data: { label: 'Back Plate Extrude (Valid)' }, style: { background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', borderRadius: '8px', fontSize: '11px' } },
        { id: 'f-screen-valid', position: { x: 400, y: 250 }, data: { label: 'Bezel Cutout (Valid)' }, style: { background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', borderRadius: '8px', fontSize: '11px' } },
      ];

      baseEdges = [
        { id: 'e-r-1', source: 'root', target: 'comp-shell', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
        { id: 'e-r-2', source: 'root', target: 'comp-screen', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
        { id: 'e-r-3', source: 'root', target: 'comp-io', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
        { id: 'e-c1-v', source: 'comp-shell', target: 'f-shell-valid', type: 'smoothstep', style: { stroke: '#6ee7b7' } },
        { id: 'e-c2-v', source: 'comp-screen', target: 'f-screen-valid', type: 'smoothstep', style: { stroke: '#6ee7b7' } },
      ];
    } else {
      baseNodes = [
        { id: 'root', position: { x: 400, y: 50 }, data: { label: 'Flange Assembly (Root)' }, type: 'input', style: { background: '#f8fafc', border: '2px solid #94a3b8', borderRadius: '12px', fontWeight: 'bold', padding: '10px 20px' } },
        { id: 'comp-base', position: { x: 100, y: 150 }, data: { label: 'Base Plate' }, style: { background: '#fdf8f6', border: '1px solid #cbd5e1', borderRadius: '8px' } },
        { id: 'comp-neck', position: { x: 300, y: 150 }, data: { label: 'Central Neck' }, style: { background: '#fdf8f6', border: '1px solid #cbd5e1', borderRadius: '8px' } },
        { id: 'comp-ribs', position: { x: 500, y: 150 }, data: { label: 'Support Ribs' }, style: { background: '#fdf8f6', border: '1px solid #cbd5e1', borderRadius: '8px' } },
        { id: 'comp-fasteners', position: { x: 700, y: 150 }, data: { label: 'Fastener Array' }, style: { background: '#fdf8f6', border: '1px solid #cbd5e1', borderRadius: '8px' } },

        // Valid Nodes
        { id: 'f-base-valid', position: { x: 50, y: 250 }, data: { label: 'Planar Extrude (Valid)' }, style: { background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', borderRadius: '8px', fontSize: '11px' } },
        { id: 'f-neck-valid', position: { x: 250, y: 250 }, data: { label: 'Cylindrical Bore (Valid)' }, style: { background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', borderRadius: '8px', fontSize: '11px' } },
        { id: 'f-ribs-valid', position: { x: 450, y: 250 }, data: { label: 'Filleted Edge (Valid)' }, style: { background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', borderRadius: '8px', fontSize: '11px' } },
      ];

      baseEdges = [
        { id: 'e-r-1', source: 'root', target: 'comp-base', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
        { id: 'e-r-2', source: 'root', target: 'comp-neck', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
        { id: 'e-r-3', source: 'root', target: 'comp-ribs', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
        { id: 'e-r-4', source: 'root', target: 'comp-fasteners', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } },
        { id: 'e-c1-f1', source: 'comp-base', target: 'f-base-valid', type: 'smoothstep', style: { stroke: '#6ee7b7' } },
        { id: 'e-c2-f1', source: 'comp-neck', target: 'f-neck-valid', type: 'smoothstep', style: { stroke: '#6ee7b7' } },
        { id: 'e-c3-f1', source: 'comp-ribs', target: 'f-ribs-valid', type: 'smoothstep', style: { stroke: '#6ee7b7' } },
      ];
    }

    // Distribute error nodes beneath logical components
    if (project.issues && project.issues.length > 0) {
      project.issues.forEach((issue, index) => {
        let parentId = 'comp-base';
        let xPos = 0;
        
        if (project.name === 'Smartphone Chassis') {
           if (issue.id === 'ERR-11') { parentId = 'comp-shell'; xPos = 200; }
           else if (issue.id === 'ERR-12') { parentId = 'comp-io'; xPos = 650; }
           else if (issue.id === 'ERR-13') { parentId = 'comp-shell'; xPos = 300; }
           else { parentId = 'comp-screen'; xPos = 450; }
        } else {
           if (issue.id === 'ERR-01' || issue.id === 'ERR-02') { parentId = 'comp-ribs'; xPos = 550 + (index % 2 * 140); }
           else if (issue.id === 'ERR-03' || issue.id === 'ERR-04') { parentId = 'comp-fasteners'; xPos = 700 + (index % 2 * 140); }
           else if (issue.id === 'ERR-05' || issue.id === 'ERR-07' || issue.id === 'ERR-10') { parentId = 'comp-base'; xPos = 50 + (index * 130); }
           else { parentId = 'comp-neck'; xPos = 250 + (index % 3 * 130); }
        }

        const isHovered = hoveredIssueId === issue.id;

        baseNodes.push({
          id: issue.id,
          position: { x: xPos - 80, y: 350 + (index % 2 * 70) },
          data: { label: issue.title },
          style: {
            background: isHovered ? '#fecaca' : '#fee2e2',
            border: isHovered ? '2px solid #dc2626' : '1px solid #ef4444',
            borderRadius: '8px',
            color: '#b91c1c',
            fontWeight: 'bold',
            fontSize: '10px',
            width: 140,
            textAlign: 'center',
            boxShadow: isHovered ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none',
            outline: isHovered ? '2px solid rgba(239, 68, 68, 0.3)' : 'none',
            transition: 'all 0.2s ease-in-out',
            zIndex: isHovered ? 100 : 1
          }
        });

        baseEdges.push({
          id: `e-${parentId}-${issue.id}`,
          source: parentId,
          target: issue.id,
          type: 'smoothstep',
          animated: isHovered,
          markerEnd: { type: MarkerType.ArrowClosed, color: isHovered ? '#dc2626' : '#ef4444' },
          style: { stroke: isHovered ? '#dc2626' : '#ef4444', strokeWidth: isHovered ? 3 : 1.5, transition: 'stroke-width 0.2s' }
        });
      });
    }

    setNodes(baseNodes);
    setEdges(baseEdges);
  }, [project, hoveredIssueId]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <Network className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">No Topology Available</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-500 pb-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">GDL Visualization</h1>
          <p className="text-slate-500 mt-2">Attributed Graph representation of B-Rep topology</p>
        </div>
      </div>

      <div className="flex-1 glass-panel border border-slate-200/60 shadow-inner relative overflow-hidden flex rounded-xl">
        {pipelineState === 'graph' && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <Network className="w-12 h-12 text-blue-500 animate-spin opacity-50 mb-4" />
            <p className="font-semibold text-slate-700 text-lg">Constructing Graph...</p>
          </div>
        )}
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange}
          onNodeMouseEnter={(_, node) => setHoveredIssueId(node.id)}
          onNodeMouseLeave={() => setHoveredIssueId(null)}
          fitView 
          minZoom={0.2}
          className="bg-slate-50/50"
        >
          <Background color="#cbd5e1" gap={16} size={1} />
          <Controls className="bg-white border-slate-200 shadow-sm" />
        </ReactFlow>
      </div>
    </div>
  );
}