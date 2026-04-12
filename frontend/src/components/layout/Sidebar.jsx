import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Cuboid, Network, ShieldCheck,
  Database, FileText, Waypoints
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'System Flow', path: '/system-flow', icon: Waypoints },
  { name: 'CAD Viewer', path: '/cad-viewer', icon: Cuboid },
  { name: 'GDL Visualization', path: '/gdl', icon: Network },
  { name: 'Knowledge Base', path: '/knowledge', icon: Database },
  { name: 'AI Reasoning', path: '/reasoning', icon: FileText },
  { name: 'Compliance', path: '/validation', icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">

      {/* Aegis Branding Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200/60 bg-white/60 backdrop-blur-xl">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center mr-3 shadow-md shadow-blue-200">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-slate-800 tracking-tight text-lg leading-none block">Aegis CAD</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Validation Suite</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Navigation</p>
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}

              {/* Optional: Add a little blue dot indicator for the active route */}
              {({ isActive }) => isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Footer Area */}
      <div className="p-5 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Engine v2.4 · Online</span>
        </div>
      </div>
    </aside>
  );
}