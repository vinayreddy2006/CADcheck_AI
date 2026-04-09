import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ChevronDown, Bell, LogOut, Plus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewProjectModal from './NewProjectModal';

export default function Navbar() {
  const { projects, activeProjectId, setActiveProject, pipelineState, startSimulation, logout, user, isAuthenticated } = useAppStore();
  const activeProject = projects.find(p => p._id === activeProjectId);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
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
      <header className="h-16 border-b border-slate-200/50 bg-white/40 backdrop-blur-md flex items-center justify-between px-8 z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-3 px-5 py-2.5 bg-white shadow-sm border border-slate-200 hover:border-blue-400 hover:ring-4 hover:ring-blue-50/50 rounded-xl text-base font-bold text-slate-800 transition-all min-w-[240px] justify-between">
              {activeProject ? activeProject.name : 'Select Project'}
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </button>
            <div className="absolute top-full left-0 w-80 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl py-2 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 flex items-center justify-between uppercase tracking-wider">
                  <span>Select Project</span>
                  <button onClick={handleNewProjectClick} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
                {projects.map(p => (
                  <button
                    key={p._id}
                    onClick={() => setActiveProject(p._id)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${p._id === activeProjectId ? 'text-blue-700 font-medium bg-blue-50/80 border-l-2 border-blue-500' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {pipelineState === 'uploading' ? (
            <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200/50 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Uploading CAD...
            </div>
          ) : pipelineState === 'idle' || pipelineState === 'complete' ? (
            <button
              onClick={startSimulation}
              disabled={!activeProjectId} // Removed the demo block so anyone can click it
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-md text-sm font-medium shadow-sm transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-blue-200 animate-pulse"></span>
              Run AI Validation
            </button>
          ) : (
            <div className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-md text-sm font-medium border border-amber-200/50 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Processing ({pipelineState})...
            </div>
          )}

          <button title="Notifications" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative bg-white/50 border border-slate-200">
            <Bell className="w-4 h-4" />
          </button>

          {isAuthenticated ? (
            <button onClick={handleLogout} title="Logout" className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors relative bg-white/50 border border-rose-200">
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => navigate('/auth')} title="Sign In" className="px-3 py-1.5 flex items-center gap-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-semibold text-sm bg-white/50 border border-blue-200">
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>
      </header>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}