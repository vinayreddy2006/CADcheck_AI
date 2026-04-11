import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import {
  Activity, AlertTriangle, CheckCircle, Database,
  Settings, Plus, Cuboid, Car, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewProjectModal from '../components/layout/NewProjectModal';

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

// Project cards data
const STATIC_PROJECTS = [
  {
    id: 'static-demo-001',
    title: 'Industrial Flange',
    description: 'Heavy engineering assembly with geometric intersection bounds and load-bearing topology.',
    icon: Settings,
    gradient: 'from-indigo-500 to-purple-600',
    status: 'Analyzed',
    statusColor: 'bg-emerald-500/90 text-white',
  },
  {
    id: 'static-demo-002',
    title: 'Car Door Panel',
    description: 'Automotive door structure with complex curvature, edge blending, and structural reinforcements.',
    icon: Car,
    gradient: 'from-cyan-500 to-slate-600',
    status: 'Pending',
    statusColor: 'bg-amber-400/90 text-white',
  },
];

export default function Dashboard() {
  const { getActiveProject, setActiveProject, isAuthenticated } = useAppStore();
  const project = getActiveProject();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SAFETY CHECK: If no project is selected
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center mb-5 shadow-inner">
          <Cuboid className="w-10 h-10 text-blue-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-700 tracking-tight">No Active Project</h2>
        <p className="text-sm text-slate-400 mt-1.5">Select or upload a CAD model using the top navigation bar.</p>
        <p className="text-[10px] uppercase tracking-widest text-slate-300 mt-4 font-semibold">Aegis CAD · Validation Suite</p>
      </div>
    );
  }

  // Dynamic KPIs based on the global state
  const kpis = [
    { title: 'Project Status', value: project.status, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100', glow: 'shadow-blue-200/70 hover:shadow-blue-200' },
    { title: 'Geometry Nodes', value: project.stats?.totalNodes || 0, icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-100', glow: 'shadow-indigo-200/70 hover:shadow-indigo-200' },
    { title: 'Active Violations', value: project.issues?.length || 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100', glow: 'shadow-rose-200/70 hover:shadow-rose-200' },
    { title: 'Validation Score', value: project.validationScore || '0%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', glow: 'shadow-emerald-200/70 hover:shadow-emerald-200' },
  ];

  const handleSelectDemo = (id) => {
    setActiveProject(id);
    navigate('/cad-viewer');
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
      <motion.div
        className="flex flex-col gap-6 pb-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Aegis CAD · System Console</p>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">System Overview</h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">Manage simulations, metrics, and new CAD analysis runs.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </div>
        </motion.div>

        {/* Quick Stats (KPIs) */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {kpis.map((kpi, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.025 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={`relative glass-panel p-5 flex items-center gap-4 cursor-default border border-slate-200/60 bg-white/60 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden transition-shadow duration-300 ${kpi.glow}`}
            >
              <div className={`p-3.5 rounded-xl ${kpi.bg} ${kpi.color} shadow-inner flex-shrink-0`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.title}</p>
                <p className="text-2xl font-extrabold text-slate-800 mt-0.5 tracking-tight">{kpi.value.toString()}</p>
              </div>
              {/* Corner accent */}
              <div className={`absolute right-0 top-0 w-16 h-16 ${kpi.bg} opacity-30 rounded-bl-full`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Hero Projects Section */}
        <motion.div variants={cardVariants}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Loaded Models</p>
              <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Available Projects</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest border border-slate-200 rounded-full px-2.5 py-1">{STATIC_PROJECTS.length} models</span>
          </div>
          {/* Gradient divider */}
          <div className="mb-5 h-px bg-gradient-to-r from-blue-200/80 via-indigo-100 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Static Project Cards */}
            {STATIC_PROJECTS.map((proj) => {
              const Icon = proj.icon;
              return (
                <motion.div
                  key={proj.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.025, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  onClick={() => handleSelectDemo(proj.id)}
                  className="glass-panel group relative overflow-hidden flex flex-col border border-slate-200 shadow-sm rounded-3xl cursor-pointer"
                >
                  {/* Card Hero */}
                  <div className={`h-44 bg-gradient-to-br ${proj.gradient} flex flex-col items-center justify-center relative overflow-hidden`}>
                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:20px_20px]" />
                    {/* Top gradient shimmer on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-20 h-20 text-white/40 group-hover:text-white/60 transition-colors duration-300" />
                    </motion.div>
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${proj.statusColor} shadow-md`}>
                      {proj.status === 'Analyzed' ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {proj.status}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" /> {proj.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1 bg-white/60">
                    <h3 className="text-lg font-bold text-slate-800 mb-1.5 group-hover:text-indigo-700 transition-colors duration-200">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1">
                      {proj.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      Open Project <span className="text-base leading-none">→</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Add Project CTA */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              onClick={handleNewProjectClick}
              className="glass-panel group relative overflow-hidden flex flex-col border-2 border-dashed border-slate-300 hover:border-blue-400 shadow-sm hover:shadow-blue-100/60 rounded-3xl cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all duration-300"
            >
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center min-h-[260px]">
                <motion.div
                  whileHover={{ rotate: 90, scale: 1.15 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all duration-300 shadow-inner"
                >
                  <Plus className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-700 mb-2 group-hover:text-blue-700 transition-colors">
                  Start New Project
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed px-2">
                  Upload CAD geometry to run autonomous validation reports.
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </motion.div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}