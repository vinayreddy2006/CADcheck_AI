// shared severity configuration — imported by both GDLGraph and Validation pages
// This is the single source of truth for all severity styles, icons, and colors
import { XCircle, AlertTriangle, Info } from 'lucide-react';

export const getSeverityConfig = (severity) => {
  switch (severity) {
    case 'Critical':
      return {
        badge: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-300/60 shadow-md',
        row: 'hover:bg-rose-50/60',
        icon: <XCircle className="w-3.5 h-3.5 inline-block mr-1" />,
        glow: 'hover:shadow-rose-200',
        // Graph node colors
        nodeBg: '#fff1f2',
        nodeBgHover: '#ffe4e6',
        nodeBorder: '#f43f5e',
        nodeBorderHover: '#e11d48',
        nodeColor: '#881337',
        edgeStroke: '#f43f5e',
        edgeStrokeHover: '#be123c',
        shadowColor: 'rgba(244,63,94,0.30)',
        shadowColorHover: 'rgba(244,63,94,0.55)',
        // Summary bar
        summaryBg: 'bg-rose-50',
        summaryBorder: 'border-rose-200',
        summaryText: 'text-rose-700',
        summaryCount: 'text-rose-800',
        pillBg: 'bg-red-600',
      };
    case 'High':
      return {
        badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-300/60 shadow-md',
        row: 'hover:bg-amber-50/60',
        icon: <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1" />,
        glow: 'hover:shadow-amber-100',
        nodeBg: '#fffbeb',
        nodeBgHover: '#fef3c7',
        nodeBorder: '#f59e0b',
        nodeBorderHover: '#d97706',
        nodeColor: '#78350f',
        edgeStroke: '#f59e0b',
        edgeStrokeHover: '#b45309',
        shadowColor: 'rgba(245,158,11,0.25)',
        shadowColorHover: 'rgba(245,158,11,0.50)',
        summaryBg: 'bg-amber-50',
        summaryBorder: 'border-amber-200',
        summaryText: 'text-amber-700',
        summaryCount: 'text-amber-800',
        pillBg: 'bg-amber-500',
      };
    case 'Medium':
      return {
        badge: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-200/60 shadow-md',
        row: 'hover:bg-blue-50/60',
        icon: <Info className="w-3.5 h-3.5 inline-block mr-1" />,
        glow: 'hover:shadow-blue-100',
        nodeBg: '#eff6ff',
        nodeBgHover: '#dbeafe',
        nodeBorder: '#6366f1',
        nodeBorderHover: '#4f46e5',
        nodeColor: '#1e3a8a',
        edgeStroke: '#818cf8',
        edgeStrokeHover: '#4f46e5',
        shadowColor: 'rgba(99,102,241,0.20)',
        shadowColorHover: 'rgba(99,102,241,0.45)',
        summaryBg: 'bg-indigo-50',
        summaryBorder: 'border-indigo-200',
        summaryText: 'text-indigo-700',
        summaryCount: 'text-indigo-800',
        pillBg: 'bg-indigo-500',
      };
    default:
      return {
        badge: 'bg-slate-100 text-slate-600 border border-slate-200',
        row: 'hover:bg-slate-50',
        icon: <Info className="w-3.5 h-3.5 inline-block mr-1" />,
        glow: '',
        nodeBg: '#f8fafc',
        nodeBgHover: '#f1f5f9',
        nodeBorder: '#94a3b8',
        nodeBorderHover: '#64748b',
        nodeColor: '#334155',
        edgeStroke: '#94a3b8',
        edgeStrokeHover: '#64748b',
        shadowColor: 'rgba(148,163,184,0.20)',
        shadowColorHover: 'rgba(148,163,184,0.40)',
        summaryBg: 'bg-slate-50',
        summaryBorder: 'border-slate-200',
        summaryText: 'text-slate-600',
        summaryCount: 'text-slate-700',
        pillBg: 'bg-slate-400',
      };
  }
};
