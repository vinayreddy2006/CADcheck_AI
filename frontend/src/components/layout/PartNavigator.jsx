import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronRight, AlertTriangle, Minus
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

// Simulated CAD tree nodes (updated reactively based on active project)
function getTreeNodes(projectName, hasIssues) {
  return [
    {
      id: 'root',
      label: projectName || 'No Active Part',
      indent: 0,
      expanded: true,
      isRoot: true,
    },
    { id: 'datum', label: 'Datum Coordinate System', indent: 1 },
    { id: 'extrude', label: 'Extrude(1) [Outer Skin]', indent: 1 },
    { id: 'blend', label: 'Edge Blend(2)', indent: 1 },
    { id: 'shell', label: 'Shell(3) [Inner Frame]', indent: 1 },
    {
      id: 'hole',
      label: 'Hole(4) [Hinge Mount]',
      indent: 1,
      warning: hasIssues,
    },
    { id: 'pattern', label: 'Pattern Feature(5)', indent: 1 },
  ];
}

// Simple XYZ axis indicator (SVG)
function AxisIndicator() {
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" fill="none">
      {/* Z axis — blue */}
      <line x1="29" y1="46" x2="29" y2="14" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="29,10 26,16 32,16" fill="#3b82f6" />
      <text x="31" y="11" fill="#3b82f6" fontSize="8" fontWeight="700">Z</text>
      {/* X axis — red */}
      <line x1="29" y1="46" x2="52" y2="46" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="56,46 50,43 50,49" fill="#ef4444" />
      <text x="52" y="44" fill="#ef4444" fontSize="8" fontWeight="700">X</text>
      {/* Y axis — green (diagonal) */}
      <line x1="29" y1="46" x2="11" y2="56" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="8,58 10,51 15,55" fill="#22c55e" />
      <text x="4" y="55" fill="#22c55e" fontSize="8" fontWeight="700">Y</text>
      {/* Origin dot */}
      <circle cx="29" cy="46" r="2.5" fill="#9ba3b2" />
    </svg>
  );
}

export default function PartNavigator() {
  const { getActiveProject } = useAppStore();
  const project = getActiveProject();
  const navigate = useNavigate();

  const hasIssues = (project?.issues?.length || 0) > 0;
  const nodes = getTreeNodes(project?.name, hasIssues);
  const [selectedId, setSelectedId] = useState('extrude');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="cad-panel" style={{ width: collapsed ? '28px' : '200px', transition: 'width 0.2s ease' }}>
      {/* Header */}
      <div className="cad-panel-header">
        {!collapsed && <span className="cad-panel-title">Part Navigator</span>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{ color: 'var(--cad-text-dim)', padding: 2, borderRadius: 3 }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? (
            <ChevronRight style={{ width: 12, height: 12 }} />
          ) : (
            <Minus style={{ width: 12, height: 12 }} />
          )}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Tree */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                className={`cad-tree-item w-full text-left ${selectedId === node.id ? 'active' : ''} ${node.warning ? 'warning' : ''}`}
                style={{ paddingLeft: `${12 + node.indent * 12}px`, display: 'flex', alignItems: 'center', gap: 5 }}
                title={node.label}
              >
                {node.isRoot ? (
                  <ChevronDown style={{ width: 10, height: 10, flexShrink: 0, opacity: 0.6 }} />
                ) : (
                  <span style={{ width: 10, height: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  </span>
                )}
                <span style={{ fontSize: '11px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {node.label}
                </span>
                {node.warning && (
                  <AlertTriangle style={{ width: 10, height: 10, color: '#f59e0b', flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>

          {/* 3D Viewport Placeholder */}
          <div
            style={{
              borderTop: '1px solid var(--cad-separator)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              background: '#12151b',
              flexShrink: 0,
            }}
          >
            {/* Mini viewport label */}
            <span style={{ fontSize: '8.5px', color: 'var(--cad-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              3D Graphics Viewport
            </span>
            {/* Axis widget */}
            <AxisIndicator />
          </div>
        </>
      )}
    </div>
  );
}
