import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

import Landing from './pages/Landing';
import MainLayout from './components/layout/MainLayout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SystemFlow from './pages/SystemFlow';
import CADViewer from './pages/CADViewer';
import GDLGraph from './pages/GDLGraph';
import KnowledgeBase from './pages/KnowledgeBase';
import Reasoning from './pages/Reasoning';
import Validation from './pages/Validation';

export default function App() {
  const { checkAuth, isAuthenticated, fetchProjects } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated, fetchProjects]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (No CAD Wrapper) */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected Dashboard Layout (Wrapped in CAD Environment) */}
        <Route element={
            <MainLayout />
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="system-flow" element={<SystemFlow />} />
          <Route path="cad-viewer" element={<CADViewer />} />
          <Route path="gdl" element={<GDLGraph />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="reasoning" element={<Reasoning />} />
          <Route path="validation" element={<Validation />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}