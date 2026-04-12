import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import CADMenuBar from './CADMenuBar';
import PartNavigator from './PartNavigator';

function CADStatusBar({ projectName, pipelineState }) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const stageLabel =
    pipelineState === 'idle' ? 'Ready'
    : pipelineState === 'complete' ? 'Analysis Complete'
    : `Processing — ${pipelineState.toUpperCase()}`;

  return (
    <div className="cad-statusbar">
      <span className="cad-status-item">mmks</span>
      <div className="cad-status-sep" />
      <span className="cad-status-item">
        Work Part: <span style={{ color: 'var(--cad-text)' }}>{projectName || '—'}</span>
      </span>
      <div className="cad-status-sep" />
      <span className="cad-status-item">{stageLabel}</span>

      <div className="flex-1" />

      {/* Engine online pill */}
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"
          style={{ boxShadow: '0 0 4px rgba(52,211,153,0.6)' }}
        />
        <span className="cad-status-item" style={{ color: 'var(--cad-text)' }}>Engine v2.4 · Online</span>
      </div>

      <div className="cad-status-sep" />
      <span className="cad-status-item">{time}</span>
    </div>
  );
}

/**
 * CADShell — The outermost wrapper that makes the entire Aegis app
 * look like it is embedded inside a professional CAD tool (NX/CATIA style).
 *
 * Layout:
 *   [CADMenuBar + Ribbon]
 *   [PartNavigator | children (Sidebar + Outlet)]
 *   [StatusBar]
 */
export default function CADShell({ children }) {
  const { getActiveProject, pipelineState } = useAppStore();
  const project = getActiveProject();
  const projectName = project?.name;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--cad-bg)',
      }}
    >
      {/* ── Top chrome: menus + ribbon ── */}
      <CADMenuBar activeProject={projectName} />

      {/* ── Body: Part Navigator + Workspace ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <PartNavigator />

        {/* ── Main workspace ── */}
        <div className="cad-workspace">
          {children}
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <CADStatusBar projectName={projectName} pipelineState={pipelineState} />
    </div>
  );
}
