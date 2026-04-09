import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Activity, AlertTriangle, CheckCircle, Database, Settings, Smartphone, Plus, Cuboid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewProjectModal from '../components/layout/NewProjectModal';

export default function Dashboard() {
  const { getActiveProject, setActiveProject, isAuthenticated } = useAppStore();
  const project = getActiveProject();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SAFETY CHECK: If no project is selected
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-in fade-in duration-500">
        <Cuboid className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">No Active Project</h2>
        <p>Please select or upload a new project from the top navigation bar.</p>
      </div>
    );
  }

  // Dynamic KPIs based on the global state
  const kpis = [
    { title: 'Project Status', value: project.status, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Geometry Nodes', value: project.stats?.totalNodes || 0, icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Active Violations', value: project.issues?.length || 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { title: 'Validation Score', value: project.validationScore || '0%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const handleSelectDemo = (id) => {
    setActiveProject(id);
    navigate('/cad');
  };

  const handleNewProjectClick = () => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Overview</h1>
            <p className="text-slate-500 mt-2">Manage simulations, metrics, and new CAD analysis</p>
          </div>
        </div>

        {/* Quick Stats (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <motion.div key={idx} whileHover={{ y: -4 }} className="glass-panel p-6 flex items-center gap-4 cursor-default border border-slate-200/60 shadow-sm rounded-2xl">
              <div className={`p-4 rounded-xl ${kpi.bg} ${kpi.color} shadow-inner`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <p className="text-2xl font-bold text-slate-800">{kpi.value.toString()}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Projects Section */}
        <h3 className="font-semibold text-slate-800 mt-6 text-xl tracking-tight border-b border-slate-200 pb-3">Available Projects</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Project 1: Industrial Flange */}
          <div className="glass-panel relative overflow-hidden flex flex-col border border-slate-200 shadow-sm rounded-3xl">
            <div className="h-44 bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center relative overflow-hidden">
               <Settings className="w-24 h-24 text-white/40" />
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>
            <div className="p-6 flex flex-col flex-1 bg-white/60">
               <h3 className="text-xl font-bold text-slate-800 mb-2">Industrial Flange</h3>
               <p className="text-sm text-slate-500 leading-relaxed flex-1">
                 Heavy engineering assembly with geometric intersection bounds.
               </p>
            </div>
          </div>

          {/* Project 2: Smartphone Body */}
          <div className="glass-panel relative overflow-hidden flex flex-col border border-slate-200 shadow-sm rounded-3xl">
            <div className="h-44 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center relative overflow-hidden">
               <Smartphone className="w-24 h-24 text-white/40" />
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>
            <div className="p-6 flex flex-col flex-1 bg-white/60">
               <h3 className="text-xl font-bold text-slate-800 mb-2">Smartphone Body</h3>
               <p className="text-sm text-slate-500 leading-relaxed flex-1">
                 Aluminum enclosure evaluating material variance and bounding cuts.
               </p>
            </div>
          </div>

          {/* Add Project CTA */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }} 
            onClick={handleNewProjectClick}
            className="glass-panel group relative overflow-hidden flex flex-col border-2 border-dashed border-slate-300 hover:border-blue-500 shadow-sm hover:shadow-blue-100 transition-all rounded-3xl cursor-pointer bg-slate-50/50 hover:bg-blue-50/30"
          >
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300 shadow-inner">
                 <Plus className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
               </div>
               <h3 className="text-2xl font-bold text-slate-700 mb-2 group-hover:text-blue-700 transition-colors">Start New Project</h3>
               <p className="text-sm text-slate-500 leading-relaxed px-2">
                 Upload CAD geometry to run autonomous validation reports.
               </p>
            </div>
          </motion.div>

        </div>
      </div>
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}