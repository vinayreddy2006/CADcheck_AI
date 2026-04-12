import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import {
  Activity, AlertTriangle, CheckCircle, Database,
  Settings, Plus, Cuboid, Car, Layers, XCircle,
  Trash2, AlertCircle, ArrowRight, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewProjectModal from '../components/layout/NewProjectModal';

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -8,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
  }
};

// ─── Static System Projects (not deletable) ────────────────────────────────────
const STATIC_PROJECTS = [
  {
    id: 'static-demo-002',
    title: 'Car Door Panel',
    description: 'Automotive door structure with complex curvature, edge blending, and structural reinforcements.',
    icon: Car,
    gradient: 'from-cyan-500 via-sky-500 to-slate-600',
    accentColor: 'bg-cyan-500',
    glowColor: 'shadow-cyan-200/60',
    status: 'Pending',
    statusColor: 'bg-amber-400/90 text-white',
    isSystem: true,
  },
  {
    id: 'static-demo-001',
    title: 'Industrial Flange',
    description: 'Heavy engineering assembly with geometric intersection bounds and load-bearing topology.',
    icon: Settings,
    gradient: 'from-indigo-500 via-violet-500 to-purple-600',
    accentColor: 'bg-indigo-500',
    glowColor: 'shadow-indigo-200/60',
    status: 'Analyzed',
    statusColor: 'bg-emerald-500/90 text-white',
    isSystem: true,
  },
];

// ─── User Project Card ─────────────────────────────────────────────────────────
function UserProjectCard({ project, onSelect, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    await onDelete(project._id);
  };

  const statusMap = {
    pending: { label: 'Pending', color: 'bg-amber-400/90 text-white' },
    completed: { label: 'Analyzed', color: 'bg-emerald-500/90 text-white' },
    uploading: { label: 'Uploading', color: 'bg-blue-500/90 text-white' },
  };
  const statusInfo = statusMap[project.status] || statusMap.pending;

  return (
    <motion.div
      layout
      variants={cardVariants}
      exit="exit"
      whileHover={!confirmDelete ? { y: -5, boxShadow: '0 24px 48px rgba(0,0,0,0.10)' } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onClick={() => !confirmDelete && onSelect(project._id)}
      className="group relative overflow-hidden flex flex-col rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-md cursor-pointer"
    >
      {/* Card Hero — gradient top */}
      <div className="h-48 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:22px_22px]" />
        {/* Glow radial */}
        <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
        {/* Hover shimmer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* File icon placeholder */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300">
          <Layers className="w-8 h-8 text-white/70" />
        </div>
        <p className="relative z-10 text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">User Upload</p>

        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusInfo.color} shadow-md z-10`}>
          {statusInfo.label === 'Analyzed' ? (
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {statusInfo.label}</span>
          ) : (
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" /> {statusInfo.label}</span>
          )}
        </div>

        {/* Delete trigger — appears on card hover via group-hover CSS, top-left */}
        {!confirmDelete && (
          <button
            className="absolute top-3 left-3 z-20 w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center
                       opacity-0 group-hover:opacity-100 hover:bg-rose-500/80 hover:border-rose-400/60 transition-all duration-200"
            onClick={handleDeleteClick}
            title="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5 text-white/70" />
          </button>
        )}
      </div>

      {/* ── Confirmation Overlay ── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 px-6 rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-rose-500" />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-sm">Delete this project?</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                "{project.name}" will be permanently removed.<br />This cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-semibold shadow-md shadow-rose-200 hover:from-rose-600 hover:to-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Deleting…</>
                ) : (
                  <><Trash2 className="w-3.5 h-3.5" /> Delete</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1 bg-white/50">
        <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-indigo-700 transition-colors duration-200 truncate">
          {project.name}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed flex-1">
          {project.cadFileUrl && project.cadFileUrl !== 'DEMO_MODE'
            ? 'CAD file uploaded · ready for validation pipeline'
            : 'No geometry uploaded yet'}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">User Project</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300">
            Open <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── System Project Card (read-only, no delete) ────────────────────────────────
function SystemProjectCard({ proj, onSelect }) {
  const Icon = proj.icon;
  return (
    <motion.div
      layout
      variants={cardVariants}
      whileHover={{ y: -5, boxShadow: `0 24px 48px rgba(0,0,0,0.10)` }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onClick={() => onSelect(proj.id)}
      className="group relative overflow-hidden flex flex-col rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-md cursor-pointer"
    >
      {/* Card Hero */}
      <div className={`h-48 bg-gradient-to-br ${proj.gradient} flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:22px_22px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <motion.div
          whileHover={{ rotate: 6, scale: 1.12 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <Icon className="w-20 h-20 text-white/45 group-hover:text-white/65 transition-colors duration-300" />
        </motion.div>

        {/* Verified system badge (bottom-left) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/15 border border-white/20 backdrop-blur-sm">
          <Shield className="w-2.5 h-2.5 text-white/70" />
          <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">System</span>
        </div>

        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${proj.statusColor} shadow-md`}>
          {proj.status === 'Analyzed' ? (
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {proj.status}</span>
          ) : (
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" /> {proj.status}</span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1 bg-white/50">
        <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-indigo-700 transition-colors duration-200">
          {proj.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed flex-1">
          {proj.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Demo Model</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300">
            Open <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { getActiveProject, setActiveProject, isAuthenticated, projects, deleteProject } = useAppStore();
  const project = getActiveProject();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // User-created projects (exclude static demo ones)
  const userProjects = projects.filter(
    (p) => !p._id.startsWith('static-demo-')
  );

  const totalProjects = STATIC_PROJECTS.length + userProjects.length;

  // Safety check: No active project
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

  const isCompleted = project.status === 'completed';
  const hasIssues = project.issues?.length > 0;
  const complianceStatus = !isCompleted ? '---' : (hasIssues ? 'FAIL' : 'PASS');
  const complianceColor = hasIssues ? 'text-rose-600' : 'text-emerald-600';
  const complianceBg = hasIssues ? 'bg-rose-100' : 'bg-emerald-100';
  const ComplianceIcon = hasIssues ? XCircle : CheckCircle;

  const kpis = [
    { title: 'Project Status', value: project.status, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100', glow: 'shadow-blue-200/70 hover:shadow-blue-200' },
    { title: 'Geometry Nodes', value: project.stats?.totalNodes || 0, icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-100', glow: 'shadow-indigo-200/70 hover:shadow-indigo-200' },
    { title: 'Active Violations', value: project.issues?.length || 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100', glow: 'shadow-rose-200/70 hover:shadow-rose-200' },
    { title: 'Compliance Status', value: complianceStatus, icon: ComplianceIcon, color: complianceColor, bg: complianceBg, glow: `shadow-${hasIssues ? 'rose' : 'emerald'}-200/70` },
  ];

  const handleSelectDemo = (id) => {
    setActiveProject(id);
    navigate('/system-flow');
  };

  const handleSelectUser = (id) => {
    setActiveProject(id);
    navigate('/system-flow');
  };

  const handleDeleteProject = useCallback(async (id) => {
    await deleteProject(id);
  }, [deleteProject]);

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
        {/* ── Header ── */}
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

        {/* ── KPI Cards ── */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" variants={containerVariants}>
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
              <div className={`absolute right-0 top-0 w-16 h-16 ${kpi.bg} opacity-30 rounded-bl-full`} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Project Section ── */}
        <motion.div variants={cardVariants}>
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Loaded Models</p>
              <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Available Projects</h3>
            </div>
            <div className="flex items-center gap-2">
              {userProjects.length > 0 && (
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest border border-slate-200 rounded-full px-2.5 py-1">
                  {userProjects.length} user
                </span>
              )}
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest border border-slate-200 rounded-full px-2.5 py-1">
                {totalProjects} total
              </span>
            </div>
          </div>

          {/* Gradient divider */}
          <div className="mb-6 h-px bg-gradient-to-r from-blue-200/80 via-indigo-100 to-transparent" />

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
          >
            {/* System / Demo Project Cards */}
            {STATIC_PROJECTS.map((proj) => (
              <SystemProjectCard key={proj.id} proj={proj} onSelect={handleSelectDemo} />
            ))}

            {/* User Project Cards — with delete */}
            <AnimatePresence mode="popLayout">
              {userProjects.map((proj) => (
                <UserProjectCard
                  key={proj._id}
                  project={proj}
                  onSelect={handleSelectUser}
                  onDelete={handleDeleteProject}
                />
              ))}
            </AnimatePresence>

            {/* Add New Project CTA */}
            <motion.div
              layout
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={handleNewProjectClick}
              className="group relative overflow-hidden flex flex-col border-2 border-dashed border-slate-200 hover:border-blue-400/70 shadow-sm hover:shadow-blue-100/50 rounded-3xl cursor-pointer bg-white/40 hover:bg-blue-50/20 transition-all duration-300 min-h-[320px]"
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <motion.div
                  whileHover={{ rotate: 90, scale: 1.15 }}
                  transition={{ duration: 0.35 }}
                  className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-all duration-300 shadow-inner"
                >
                  <Plus className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </motion.div>
                <h3 className="text-lg font-bold text-slate-700 mb-2 group-hover:text-blue-700 transition-colors">
                  Start New Project
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed px-2 max-w-[180px]">
                  Upload CAD geometry to run autonomous validation reports.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}