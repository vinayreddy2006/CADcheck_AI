import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Network, Cuboid, Workflow, BookOpen, BrainCircuit, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/system-flow', label: 'System Flow', icon: Workflow },
  { to: '/cad-viewer', label: 'CAD Viewer', icon: Cuboid },
  { to: '/gdl', label: 'GDL Visualization', icon: Network },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { to: '/reasoning', label: 'AI Reasoning', icon: BrainCircuit },
  { to: '/validation', label: 'Compliance', icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200/60 bg-white/50 backdrop-blur-xl flex flex-col pt-6 z-10 hidden md:flex shadow-xl shadow-slate-200/30">

      {/* ── Brand Logo ──────────────────────────────── */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30 flex-shrink-0">
            <ShieldCheck className="text-white" style={{ width: '1.1rem', height: '1.1rem' }} />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 leading-none">
              Aegis CAD
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase leading-tight mt-0.5">
              Validation Suite
            </p>
          </div>
        </div>
        {/* Gradient separator */}
        <div className="mt-5 h-px bg-gradient-to-r from-blue-100 via-slate-200 to-transparent" />
      </div>

      {/* ── Section label ───────────────────────────── */}
      <p className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Navigation
      </p>

      {/* ── Nav Links ───────────────────────────────── */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50/60 shadow-sm border border-blue-100/80 shadow-blue-100/50'
                  : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 hover:-translate-y-px'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Left active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-blue-600" />
                )}
                <item.icon
                  className={cn(
                    'flex-shrink-0 transition-colors duration-200',
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                  style={{ width: '1.05rem', height: '1.05rem' }}
                />
                <span className="truncate">{item.label}</span>
                {/* Right active dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer version badge ─────────────────────── */}
      <div className="px-5 py-4 border-t border-slate-200/60 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
            Engine v2.4 · Online
          </span>
        </div>
      </div>
    </aside>
  );
}
