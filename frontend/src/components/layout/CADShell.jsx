import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import {
  Box, MousePointer2, Move3d, Ruler, Save, Undo, Redo,
  Layers, Settings, Circle, AlertTriangle, Hexagon, Component,
  ShieldCheck
} from 'lucide-react';

// Helper component for the CAD feature tree
function TreeItem({ icon: Icon, text, isWarning, indent = false }) {
  return (
    <li className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer ${indent ? 'pl-6' : 'pl-2'} ${isWarning ? 'bg-rose-50/80 border border-rose-100/50 rounded-md text-rose-600' : 'hover:bg-slate-200/50 text-slate-700'}`}>
      {indent && <span className="w-3 h-px bg-slate-300" />}
      <Icon className={`w-3.5 h-3.5 ${isWarning ? 'text-rose-500' : 'text-blue-600'}`} />
      <span className={`text-[11px] font-mono tracking-tight ${isWarning ? 'font-bold' : ''}`}>
        {text} {isWarning && '⚠️'}
      </span>
    </li>
  );
}

export default function CADShell({ children }) {
  const location = useLocation();
  const { getActiveProject } = useAppStore();
  const project = getActiveProject();

  // Automatically bypass the CAD wrapper if on the Landing or Auth pages
  if (location.pathname === '/' || location.pathname === '/auth') {
    return <>{children}</>;
  }

  // Dynamic state syncing
  const projectName = project?.name || 'New Part';
  const isCarDoor = projectName === 'Car Door Panel';
  const isFlange = projectName === 'Industrial Flange';

  return (
    <div className="w-screen h-screen flex flex-col bg-[#e5e7eb] font-sans overflow-hidden select-none">

      {/* ── FAKE CAD: Top Menu Bar ── */}
      <div className="h-7 bg-white flex items-center px-3 text-[11px] text-slate-700 border-b border-slate-300 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-2 mr-6">
          <Component className="w-4 h-4 text-blue-700" />
          <span className="font-extrabold text-slate-800 tracking-tight">NX Simulation Studio 2406</span>
        </div>
        <span className="hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">File</span>
        <span className="hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">Edit</span>
        <span className="hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">View</span>
        <span className="hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">Insert</span>
        <span className="hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">Assemblies</span>
        <span className="hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">Tools</span>
        <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-1 rounded cursor-pointer border border-indigo-100">Aegis Validation</span>
        <span className="hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">Window</span>
      </div>

      {/* ── FAKE CAD: Ribbon Toolbar ── */}
      <div className="h-16 bg-[#f3f4f6] border-b border-slate-300 flex items-center px-2 gap-2 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-1 pr-4 border-r border-slate-300 h-10">
          <div className="p-2 hover:bg-slate-200 rounded cursor-pointer transition-colors"><Save className="w-5 h-5 text-slate-700" /></div>
          <div className="p-2 hover:bg-slate-200 rounded cursor-pointer transition-colors"><Undo className="w-5 h-5 text-slate-400" /></div>
          <div className="p-2 hover:bg-slate-200 rounded cursor-pointer transition-colors"><Redo className="w-5 h-5 text-slate-400" /></div>
        </div>
        <div className="flex items-center gap-1 px-4 border-r border-slate-300 h-10">
          <div className="flex flex-col items-center p-1 px-3 hover:bg-slate-200 rounded cursor-pointer transition-colors">
            <MousePointer2 className="w-5 h-5 text-slate-700 mb-0.5" />
            <span className="text-[9px] text-slate-600 font-semibold uppercase">Select</span>
          </div>
          <div className="flex flex-col items-center p-1 px-3 bg-blue-100 border border-blue-200 rounded cursor-pointer shadow-sm">
            <Box className="w-5 h-5 text-blue-700 mb-0.5" />
            <span className="text-[9px] text-blue-800 font-bold uppercase">Extrude</span>
          </div>
          <div className="flex flex-col items-center p-1 px-3 hover:bg-slate-200 rounded cursor-pointer transition-colors">
            <Circle className="w-5 h-5 text-slate-700 mb-0.5" />
            <span className="text-[9px] text-slate-600 font-semibold uppercase">Blend</span>
          </div>
          <div className="flex flex-col items-center p-1 px-3 hover:bg-slate-200 rounded cursor-pointer transition-colors">
            <Move3d className="w-5 h-5 text-slate-700 mb-0.5" />
            <span className="text-[9px] text-slate-600 font-semibold uppercase">Move</span>
          </div>
          <div className="flex flex-col items-center p-1 px-3 hover:bg-slate-200 rounded cursor-pointer transition-colors">
            <Ruler className="w-5 h-5 text-slate-700 mb-0.5" />
            <span className="text-[9px] text-slate-600 font-semibold uppercase">Measure</span>
          </div>
        </div>
      </div>

      {/* ── Main Work Area ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* FAKE CAD: Left Feature Tree */}
        <div className="w-64 bg-[#f8fafc] border-r border-slate-300 flex flex-col shadow-[2px_0_10px_rgba(0,0,0,0.05)] z-10 shrink-0">
          <div className="bg-[#e2e8f0] px-3 py-2 border-b border-slate-300 text-xs font-extrabold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-700" /> Part Navigator
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center gap-2 bg-blue-600 text-white px-2 py-1.5 rounded border border-blue-700 shadow-sm mb-2">
              <Box className="w-4 h-4 text-blue-200" />
              <span className="text-xs font-bold truncate">{projectName}_ASSY_V4</span>
            </div>
            <ul className="space-y-0.5">
              <TreeItem icon={Hexagon} text="Datum Coordinate System" indent />

              {/* DYNAMIC SYNC: Car Door Tree */}
              {isCarDoor && (
                <>
                  <TreeItem icon={Layers} text="Outer_Skin_Stamping" indent />
                  <TreeItem icon={Circle} text="Edge_Blend_2mm" indent />
                  <TreeItem icon={Layers} text="Inner_Frame_DeepDraw" indent />
                  <TreeItem icon={AlertTriangle} text="Hinge_Mount_Bracket" isWarning indent />
                  <TreeItem icon={AlertTriangle} text="Longitudinal_Rib_Array" isWarning indent />
                  <TreeItem icon={Settings} text="Window_Track_Extrusion" indent />
                </>
              )}

              {/* DYNAMIC SYNC: Flange Tree */}
              {isFlange && (
                <>
                  <TreeItem icon={Layers} text="Main_Barrel_Body" indent />
                  <TreeItem icon={Layers} text="Upper_Mounting_Flange" indent />
                  <TreeItem icon={AlertTriangle} text="Radial_Rib_Array" isWarning indent />
                  <TreeItem icon={AlertTriangle} text="Neck_Transition_Blend" isWarning indent />
                  <TreeItem icon={Settings} text="M6_Bolt_Pattern" indent />
                  <TreeItem icon={AlertTriangle} text="M6_Hole_Instance_4" isWarning indent />
                </>
              )}

              {/* DYNAMIC SYNC: Generic Upload Tree */}
              {!isCarDoor && !isFlange && (
                <>
                  <TreeItem icon={Layers} text="Imported_Base_Body" indent />
                  <TreeItem icon={Settings} text="Feature_Recognition_1" indent />
                  <TreeItem icon={Box} text="Solid_Body_Extraction" indent />
                </>
              )}
            </ul>
          </div>
        </div>

        {/* ── AEGIS CAD: Expanded Dashboard Area ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          // Notice: flex-1 makes this take up ALL the remaining space! No more dark box.
          className="flex-1 bg-white flex flex-col z-50 relative overflow-hidden"
        >
          {/* Fake Plugin Header */}
          <div className="h-9 bg-[#0f172a] flex items-center justify-between px-4 shrink-0 shadow-sm z-50">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-extrabold text-slate-200 uppercase tracking-[0.2em]">Aegis CAD · Edge Integration Active</span>
              <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest">{project?.validationScore || '0%'} CONFIDENCE</span>
            </div>
          </div>

          {/* Actual Aegis CAD App rendered inside this panel! */}
          <div className="flex-1 overflow-y-auto bg-slate-50 relative">
            {children}
          </div>
        </motion.div>

      </div>

      {/* FAKE CAD: Bottom Status Bar */}
      <div className="h-6 bg-[#f8fafc] border-t border-slate-300 flex items-center px-4 justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-500 font-semibold">Ready</span>
          <span className="text-[10px] text-slate-400">|</span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1.5"><Circle className="w-3 h-3 text-emerald-500" /> Server Connected</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono font-bold bg-slate-200 px-2 py-0.5 rounded">
          mmks | Work Part: {projectName}
        </span>
      </div>
    </div>
  );
}