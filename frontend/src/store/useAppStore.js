import { create } from 'zustand';
import api from '../lib/axios';

// Expand rules list for comprehensive simulation mapping (15 Rules)
export const ALL_ISSUES_DB = [
  // Flange Issues
  { id: 'ERR-01', title: 'Insufficient Wall Thickness', severity: 'Critical', type: 'Design Constraint', rule: 'DFM-Cast-04', confidence: '99%', fix: 'Increase rib thickness to ≥ 2.5mm.', meshId: 'rib-3' },
  { id: 'ERR-02', title: 'Overlapping Bodies', severity: 'High', type: 'Topology Rule', rule: 'B-Rep-03', confidence: '100%', fix: 'Resolve intersecting geometry at flange neck.', meshId: 'rib-4' },
  { id: 'ERR-03', title: 'Missing Fastener Hole', severity: 'High', type: 'Geometry Error', rule: 'Assy-M6-Spacing', confidence: '88%', fix: 'Restore symmetric hole pattern at 45 degrees.', meshId: 'hole-miss-2' },
  { id: 'ERR-04', title: 'Missing Fastener Hole', severity: 'High', type: 'Geometry Error', rule: 'Assy-M6-Spacing', confidence: '88%', fix: 'Restore symmetric hole pattern at 135 degrees.', meshId: 'hole-miss-5' },
  { id: 'ERR-05', title: 'Unfilleted Sharp Edge', severity: 'Medium', type: 'Manufacturing', rule: 'ISO-13715', confidence: '94%', fix: 'Apply 2mm minimal radius to edge strip.', meshId: 'extrusion-err' },
  
  // Extra Rule DB additions (Generic)
  { id: 'ERR-06', title: 'Non-Manifold Vertex', severity: 'High', type: 'Topology Rule', rule: 'B-Rep-Val-09', confidence: '91%', fix: 'Merge detached vertices affecting volume enclosure.', meshId: 'none' },
  { id: 'ERR-07', title: 'Surface Gap Detected', severity: 'Critical', type: 'Geometry Error', rule: 'ISO-10303-T-02', confidence: '97%', fix: 'Stitch surfaces S-44 and S-45.', meshId: 'none' },
  { id: 'ERR-08', title: 'Draft Angle Extraction', severity: 'Medium', type: 'Design Constraint', rule: 'DFM-Molding', confidence: '82%', fix: 'Apply 1.5° outward draft to internal bore.', meshId: 'none' },
  { id: 'ERR-09', title: 'Component Proximity Violation', severity: 'Low', type: 'Assembly Fit', rule: 'Clearance-X1', confidence: '79%', fix: 'Move bolting boss 1mm from inner wall.', meshId: 'none' },
  { id: 'ERR-10', title: 'Self-Intersecting Face', severity: 'Critical', type: 'Topology Rule', rule: 'B-Rep-07', confidence: '100%', fix: 'Re-loft surface to remove self-intersection loop.', meshId: 'none' },
  { id: 'ERR-14', title: 'Surface Continuity Disruption', severity: 'Medium', type: 'Topology Rule', rule: 'G2 Continuity', confidence: '80%', fix: 'Smooth NURBS transition across face boundary.', meshId: 'none' },
  { id: 'ERR-15', title: 'Assembly Fit Tolerance', severity: 'Critical', type: 'Assembly Fit', rule: 'Clearance-Assy', confidence: '99%', fix: 'Increase gap clearance by 0.5mm for PCB mounting.', meshId: 'none' },

  // Smartphone Errors Mapped Explicitly
  { id: 'ERR-11', title: 'Uneven Thickness Constraint', severity: 'Medium', type: 'Tolerance Issue', rule: 'Thickness Variance', confidence: '96%', fix: 'Equalize material displacement on lower chassis plate.', meshId: 'phone-plate-err' },
  { id: 'ERR-12', title: 'Misaligned I/O Cutout', severity: 'High', type: 'Hole Alignment', rule: 'Hole Alignment Guide', confidence: '92%', fix: 'Shift charging port cutout 1.25mm left on X-axis.', meshId: 'phone-cutout-err' },
  { id: 'ERR-13', title: 'Sharp Exterior Edge', severity: 'Critical', type: 'Edge Sharpness', rule: 'Drop Protection Radius', confidence: '100%', fix: 'Apply 1mm minimal fillet radius to outer casing perimeter.', meshId: 'phone-edge-err' }
];

const FLANGE_ISSUES = [ALL_ISSUES_DB[0], ALL_ISSUES_DB[1], ALL_ISSUES_DB[2], ALL_ISSUES_DB[4], ALL_ISSUES_DB[6]];
const SMARTPHONE_ISSUES = [ALL_ISSUES_DB[12], ALL_ISSUES_DB[13], ALL_ISSUES_DB[14], ALL_ISSUES_DB[11]];

const DEMO_PROJECT_1 = {
  _id: 'static-demo-001',
  name: 'Industrial Flange',
  status: 'pending',
  cadFileUrl: 'DEMO_MODE',
  validationScore: '0%',
  stats: { totalNodes: 0, edges: 0, volume: '0 cm³', density: '0 g/cm³' },
  issues: []
};

const DEMO_PROJECT_2 = {
  _id: 'static-demo-002',
  name: 'Smartphone Chassis',
  status: 'pending',
  cadFileUrl: 'DEMO_MODE',
  validationScore: '0%',
  stats: { totalNodes: 0, edges: 0, volume: '0 cm³', density: '0 g/cm³' },
  issues: []
};


export const useAppStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,

  projects: [DEMO_PROJECT_1, DEMO_PROJECT_2],
  activeProjectId: DEMO_PROJECT_1._id,
  pipelineState: 'idle',
  inferenceLogs: [],

  // New Interactivity States
  hoveredIssueId: null,
  setHoveredIssueId: (id) => set({ hoveredIssueId: id }),

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.user, isAuthenticated: true, isAuthLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isAuthLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    set({ user: res.data.user, isAuthenticated: true });
    await get().fetchProjects();
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    set({ user: res.data.user, isAuthenticated: true });
    await get().fetchProjects();
  },

  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null, isAuthenticated: false, projects: [DEMO_PROJECT_1, DEMO_PROJECT_2], activeProjectId: DEMO_PROJECT_1._id, pipelineState: 'idle', inferenceLogs: [] });
  },

  fetchProjects: async () => {
    try {
      const res = await api.get('/projects');
      set({ projects: [DEMO_PROJECT_1, DEMO_PROJECT_2, ...res.data.projects] });
    } catch (error) {
      console.error(error);
    }
  },

  setActiveProject: (id) => {
    // Reset pipeline state when switching tabs
    set({ activeProjectId: id, pipelineState: 'idle', inferenceLogs: [] });
  },

  getActiveProject: () => get().projects.find(p => p._id === get().activeProjectId),

  createAndUploadProject: async (name, file) => {
    set({ pipelineState: 'uploading' });
    try {
      const projRes = await api.post('/projects', { name });
      const projectId = projRes.data.project._id;

      const formData = new FormData();
      formData.append('cadFile', file);

      await api.post(`/projects/${projectId}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      await get().fetchProjects();
      set({ activeProjectId: projectId, pipelineState: 'idle' });
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      set({ pipelineState: 'idle' });
      throw error;
    }
  },

  startSimulation: async () => {
    const { activeProjectId } = get();
    if (!activeProjectId) return;

    set({ pipelineState: 'extraction', inferenceLogs: ['[SYS] Initializing Validation Pipeline v2.4'] });

    // ==========================================
    // 1. THE FAKE DEMO PROJECT SIMULATION
    // ==========================================
    if (activeProjectId === DEMO_PROJECT_1._id || activeProjectId === DEMO_PROJECT_2._id) {
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[EXTRACT] B-Rep analysis initiated successfully...'] }));
      await new Promise(r => setTimeout(r, 1500));

      set({ pipelineState: 'graph' });
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[GNN] Converting B-Rep to Attributed Graph.'] }));
      await new Promise(r => setTimeout(r, 1500));

      set({ pipelineState: 'inference' });
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[INFERENCE] Checking rules against ISO database...'] }));
      await new Promise(r => setTimeout(r, 2000));

      // Slice the errors to exactly top 3 based on Severity!
      const targetIssues = activeProjectId === DEMO_PROJECT_1._id ? FLANGE_ISSUES : SMARTPHONE_ISSUES;
      const sortedTrimmedIssues = targetIssues.sort((a, b) => {
        const ranks = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return ranks[a.severity] - ranks[b.severity];
      }).slice(0, 3); // LIMIT TO MAX 3 ERRORS FOR DISPLAY

      set((state) => ({
        pipelineState: 'complete',
        inferenceLogs: [...state.inferenceLogs, '[WARNING] Detected structural/geometric anomalies.', '[SUCCESS] Validation complete. Top issues compiled for UX view.'],
        projects: state.projects.map(p => p._id === activeProjectId ? {
          ...p,
          status: 'completed',
          validationScore: activeProjectId === DEMO_PROJECT_1._id ? '82.5%' : '91.2%',
          stats: { totalNodes: 24502, edges: 51204, volume: '8400 cm³', density: '2.7 g/cm³' },
          issues: sortedTrimmedIssues
        } : p)
      }));
      return; // Stop here for demo mode
    }

    // ==========================================
    // 2. THE REAL GEMINI API PIPELINE
    // ==========================================
    try {
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[EXTRACT] B-Rep analysis initiated...'] }));
      await api.post('/ai/analyze', { projectId: activeProjectId });

      set({ pipelineState: 'graph' });
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[GNN] Converting B-Rep to Attributed Graph.'] }));
      const graphRes = await api.post('/ai/generate-graph', { projectId: activeProjectId });

      set((state) => ({
        projects: state.projects.map(p => p._id === activeProjectId ? { ...p, stats: graphRes.data.stats } : p)
      }));

      set({ pipelineState: 'inference' });
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[INFERENCE] Requesting analysis from Gemini AI...'] }));
      const valRes = await api.post('/ai/validate', { projectId: activeProjectId });

      set((state) => ({
        pipelineState: 'complete',
        inferenceLogs: [...state.inferenceLogs, '[SUCCESS] Gemini AI Validation complete. Issues mapped.'],
        projects: state.projects.map(p => p._id === activeProjectId ? {
          ...p,
          issues: valRes.data.issues,
          validationScore: valRes.data.validationScore,
          status: 'completed'
        } : p)
      }));

    } catch (error) {
      set((state) => ({
        pipelineState: 'idle',
        inferenceLogs: [...state.inferenceLogs, `[ERROR] Pipeline aborted: ${error.message}`]
      }));
    }
  }
}));