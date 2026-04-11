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
    // INCREASED WIDTH: Changed w-64 to w-72
    <aside className="w-88 border-r border-slate-200/60 bg-white/50 backdrop-blur-xl flex flex-col pt-6 z-10 hidden md:flex shadow-xl shadow-slate-200/30">

      {/* ── Brand Logo (YOUR EXACT OLD CODE) ──────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl shadow-md shadow-blue-500/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-2xl font-black tracking-tight text-blue-700 leading-tight">
            Aegis CAD
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Validation Suite
          </span>
        </div>
      </div>

      {/* ── Section label ───────────────────────────── */}
      <p className="px-6 mb-4 mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        Navigation
      </p>

      {/* ── Nav Links ───────────────────────────────── */}
      {/* INCREASED VERTICAL SPACING: Changed space-y-1 to space-y-3 */}
      <nav className="flex-1 px-4 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                // INCREASED BUTTON SIZE: px-4, py-3.5, and text-[15px]
                'flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 group relative',
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
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-blue-600" />
                )}
                <item.icon
                  className={cn(
                    'flex-shrink-0 transition-colors duration-200',
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                  // INCREASED ICON SIZE: 1.25rem
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                <span className="truncate">{item.label}</span>
                {/* Right active dot */}
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer version badge ─────────────────────── */}
      <div className="px-5 py-5 border-t border-slate-200/60 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            Engine v2.4 · Online
          </span>
        </div>
      </div>
    </aside>
  );
}