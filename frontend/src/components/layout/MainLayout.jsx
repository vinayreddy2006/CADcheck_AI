import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // FIX: Changed from '../Navbar' to './Navbar'

export default function MainLayout() {
  return (
    // We use h-full instead of h-screen so it perfectly fits inside the CADShell workspace
    <div className="flex h-full w-full bg-slate-50 overflow-hidden relative">

      {/* 1. Inner Aegis Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Top Navigation Bar */}
        <Navbar />

        {/* Scrollable Page Content (Dashboard, Validation, CAD Viewer, etc.) */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}