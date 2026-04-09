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
    <aside className="w-64 border-r border-slate-200/50 bg-white/40 backdrop-blur-md flex flex-col pt-6 z-10 hidden md:flex">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span>CoreAI CAD</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group overflow-hidden",
                isActive 
                  ? "text-blue-700 bg-blue-50/80 shadow-sm border border-blue-100/50" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive && "text-blue-600")} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      

    </aside>
  );
}
