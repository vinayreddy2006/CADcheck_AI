import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Undo2, Redo2, MousePointer2, Pencil, Box, Layers, Ruler,
  RotateCcw, GitBranch, Maximize2, ExternalLink, ShieldCheck,
  ChevronRight
} from 'lucide-react';

const MENU_ITEMS = ['File', 'Edit', 'View', 'Insert', 'Assemblies', 'Tools', 'Aegis Validation', 'Window'];

const RIBBON_GROUPS = [
  {
    id: 'nav',
    tools: [
      { icon: Undo2, label: 'Undo' },
      { icon: Redo2, label: 'Redo' },
    ],
  },
  {
    id: 'select',
    tools: [
      { icon: MousePointer2, label: 'Select', active: true },
      { icon: RotateCcw, label: 'Rotate' },
      { icon: Ruler, label: 'Measure' },
    ],
  },
  {
    id: 'feature',
    tools: [
      { icon: Pencil, label: 'Sketch' },
      { icon: Box, label: 'Extrude' },
      { icon: Layers, label: 'Pattern' },
      { icon: GitBranch, label: 'Features' },
    ],
  },
  {
    id: 'aegis',
    tools: [
      { icon: ShieldCheck, label: 'Validate', active: true, accent: true },
      { icon: Maximize2, label: 'Fit View' },
    ],
  },
];

export default function CADMenuBar({ activeProject }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  return (
    <div style={{ userSelect: 'none' }}>
      {/* ── Menu Strip ── */}
      <div className="cad-menu-bar">
        {/* App Icon */}
        <div className="flex items-center gap-2 mr-3 pl-1 pr-4 border-r border-[var(--cad-separator)]">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--cad-text-bright)', letterSpacing: '0.04em' }}>
            NX Simulation Studio
          </span>
        </div>

        {/* Menu items */}
        {MENU_ITEMS.map((item) => (
          <button
            key={item}
            onMouseEnter={() => setActiveMenu(item)}
            onMouseLeave={() => setActiveMenu(null)}
            className={`cad-menu-item ${item === 'Aegis Validation' ? 'active' : ''}`}
            style={activeMenu === item ? { background: 'var(--cad-hover)', color: 'var(--cad-text-bright)' } : {}}
          >
            {item}
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Integration Status Pill */}
        <div className="cad-integration-pill mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          Aegis CAD · Edge Integration Active
        </div>

        {/* Unlock to Web */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
          style={{ color: 'var(--cad-text)', background: 'var(--cad-hover)', border: '1px solid var(--cad-separator)', letterSpacing: '0.05em' }}
          title="Open Dashboard"
        >
          <ExternalLink className="w-3 h-3" />
          Unlock to Web
        </button>
      </div>

      {/* ── Tool Ribbon ── */}
      <div className="cad-ribbon">
        {RIBBON_GROUPS.map((group, gIdx) => (
          <div key={group.id} className="flex items-center">
            {gIdx > 0 && <div className="cad-ribbon-separator" />}
            <div className="cad-ribbon-group">
              {group.tools.map((tool) => (
                <button
                  key={tool.label}
                  className={`cad-ribbon-btn ${tool.active ? 'active' : ''}`}
                  title={tool.label}
                >
                  <tool.icon
                    style={{
                      width: 16,
                      height: 16,
                      color: tool.accent ? '#60a5fa' : (tool.active ? 'var(--cad-accent)' : 'var(--cad-text)'),
                    }}
                  />
                  <span className="cad-ribbon-label">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Active project breadcrumb */}
        {activeProject && (
          <div className="flex items-center gap-1.5 mr-2">
            <span style={{ fontSize: '10px', color: 'var(--cad-text-dim)', letterSpacing: '0.04em' }}>Work Part:</span>
            <div className="flex items-center gap-1" style={{ color: 'var(--cad-text)', fontSize: '10.5px', fontWeight: 700 }}>
              <ChevronRight className="w-3 h-3 opacity-40" />
              {activeProject}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
