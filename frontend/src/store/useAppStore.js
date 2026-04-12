import { create } from 'zustand';
import api from '../lib/axios';

// ─────────────────────────────────────────────────────────────────────────────
// Static Issue Database 
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_ISSUES_DB = [
  // ── Industrial Flange Issues ──
  {
    id: 'ERR-01',
    title: 'Sub-Critical Wall Thickness Along Outer Perimeter Rib Array',
    severity: 'Critical',
    type: 'Design Constraint',
    rule: 'DFM-Cast-04',
    confidence: '99%',
    meshId: 'rib-3',
    sourceDoc: 'DFM_Cast_Guidelines_v4.pdf',
    rawSnippet: '...all equidistant radial stiffening ribs located at outer perimeters of mounting flanges must exhibit a minimum nominal wall thickness of 2.5 mm for gravity die-cast aluminium alloys to prevent premature solidification (misrun)...',
    fix: 'Increase the wall thickness of the three radial ribs along the outer perimeter of the upper mounting flange from the current 1.1 mm to a minimum of 2.5 mm to satisfy DFM-Cast-04 casting fill requirements.',
    reason: 'The B-Rep analysis detected that the three equidistant radial stiffening ribs — located at the outer perimeter of the upper mounting flange, between bolt bosses B2 and B4 — exhibit a nominal wall thickness of 1.1 mm. This is 56% below the 2.5 mm minimum mandated by DFM-Cast-04 for gravity die-cast aluminium alloys.',
    impact: 'During the high-pressure die-casting process, molten alloy flowing into thin-walled cavities loses thermal energy faster than feed metal can replenish it. This causes premature solidification and incomplete fill (misrun) in the rib cavity, resulting in cold shuts and sub-surface porosity.'
  },
  {
    id: 'ERR-02',
    title: 'Non-Manifold B-Rep Intersection at Neck-to-Barrel Transition Zone',
    severity: 'High',
    type: 'Topology Rule',
    rule: 'B-Rep-03',
    confidence: '100%',
    meshId: 'rib-4',
    sourceDoc: 'ISO_10303_42_Topology.pdf',
    rawSnippet: '...a valid two-manifold boundary representation (B-Rep) requires that every edge in the topological structure must be shared by exactly two faces. Co-incident face overlaps producing non-manifold edges are strictly prohibited...',
    fix: 'Perform a Boolean subtraction to resolve the co-incident face overlap between solid body S-12 (neck boss) and S-07 (barrel body) at the neck-to-barrel transition, then re-stitch the resulting open shell edges to restore a fully-closed, two-manifold B-Rep topology.',
    reason: 'Two solid bodies — the neck boss (S-12) and the primary barrel body (S-07) — share a co-incident set of faces at the concave neck-to-barrel transition zone, located 14 mm below the upper flange face. The overlapping faces create a non-manifold condition.',
    impact: 'A non-manifold body cannot be processed by downstream CAM systems for CNC toolpath generation, nor by FEA solvers for structural simulation, as the open-shell boundary produces undefined inside/outside volume assignments.'
  },
  {
    id: 'ERR-03',
    title: 'Asymmetric M6 Clearance Hole Omission at 135° Bolt Pattern Locus',
    severity: 'High',
    type: 'Geometry Error',
    rule: 'Assy-M6-Spacing',
    confidence: '88%',
    meshId: 'hole-miss-5',
    sourceDoc: 'Assembly_Tolerance_AD-FLG-007.pdf',
    rawSnippet: '...clearance holes for M6 fasteners on the 72 mm Pitch Circle Diameter must maintain strict four-fold rotational symmetry (4x at 90° intervals) to ensure uniform preload distribution...',
    fix: 'Instantiate an M6 clearance hole (⌀6.4 mm through-bore) at the 135° angular position on the 72 mm Pitch Circle Diameter of the upper mounting flange to restore the required four-bolt symmetric pattern per assembly drawing AD-FLG-007.',
    reason: 'The upper mounting flange defines a four-way symmetric M6 bolt pattern on a 72 mm PCD. The GDL graph traversal identified that the hole instance at the 135° angular position is absent from the B-Rep face set.',
    impact: 'This asymmetry concentrates the preload force on the three remaining bolts by 33%, exceeding their rated preload and inducing fretting fatigue at the bolt-seat interface.'
  },

  // ── Car Door Panel Issues ──
  {
    id: 'ERR-21',
    title: 'Absent Secondary M8 Clearance Bore at Lower Hinge Bracket Attachment',
    severity: 'High',
    type: 'Design Constraint',
    rule: 'Hinge-Fastener-Std-07',
    confidence: '98%',
    meshId: 'door-hinge-err',
    sourceDoc: 'HNG-D-2284_OEM_Standards.pdf',
    rawSnippet: '...lower hinge bracket attachments at the vehicle body pillar junction must utilize a twin-bolt M8 fastening pattern. Single-bolt configurations are prohibited due to insufficient resistance to dynamic bending moments...',
    fix: 'Instantiate an M8 clearance bore (⌀8.4 mm, 16 mm deep) at the secondary fastener locus on the lower hinge bracket attachment interface, located 38 mm inboard of the outer door skin flange and 22 mm above the rocker panel datum.',
    reason: 'The lower hinge bracket attachment interface specifies a two-bolt M8 fastening pattern. The B-Rep face traversal confirmed that only the primary clearance bore is instantiated; the secondary fastener bore is absent.',
    impact: 'A single-bolt hinge attachment reduces joint stiffness by approximately 65%. During dynamic door-open events, the cantilevered door mass generates a bending moment at the single bolt, inducing plastic deformation.'
  },
  {
    id: 'ERR-22',
    title: 'Unmitigated Sub-Minimum Wall Thickness on Central Longitudinal Rib',
    severity: 'Critical',
    type: 'Structural Integrity',
    rule: 'OEM-Min-Wall-Std-AL-02',
    confidence: '99%',
    meshId: 'door-rib-err',
    sourceDoc: 'FMVSS_214_Safety_Regs.pdf',
    rawSnippet: '...longitudinal reinforcement ribs serving as primary lateral load paths in side-impact scenarios must maintain a minimum cross-sectional wall thickness of 2.5 mm to satisfy energy absorption and intrusion limit mandates...',
    fix: 'Increase the nominal wall thickness of the central longitudinal reinforcement rib — spanning the full 920 mm vertical extent of the inner door panel along its neutral axis — from the current 1.2 mm to a minimum of 2.5 mm.',
    reason: 'The central longitudinal reinforcement rib measures a nominal wall thickness of only 1.2 mm. OEM-Min-Wall-Std-AL-02 mandates a minimum of 2.5 mm for inner panel ribs classified as primary lateral load paths. The current thickness is 52% deficient.',
    impact: 'Under a FMVSS 214 pole side-impact test scenario, the central rib constitutes the primary barrier against door inner panel intrusion. At 1.2 mm, the rib cross-section cannot sustain the plastic bending moment required to absorb mandated impact energy.'
  },
  {
    id: 'ERR-23',
    title: 'Zero-Blend-Radius Dihedral Edge at Upper Window Track Extrusion',
    severity: 'Medium',
    type: 'Manufacturing',
    rule: 'ISO-13715',
    confidence: '95%',
    meshId: 'door-edge-err',
    sourceDoc: 'ISO_13715_Ergonomics.pdf',
    rawSnippet: '...to mitigate ergonomic hazards during assembly, all accessible re-entrant dihedral edges on metallic stampings or extrusions must feature a minimum convex blend radius of 2.0 mm...',
    fix: 'Apply a 2.0 mm minimum convex blend radius to the 90° dihedral edge at the terminus of the upper window track extrusion.',
    reason: 'The extruded upper window track terminates with a geometrically exact 90° dihedral angle (r = 0.00 mm). ISO 13715 mandates a minimum 2.0 mm convex blend radius for all accessible re-entrant edges.',
    impact: 'A zero-radius re-entrant edge is classified as a Severity 1 ergonomic hazard under ISO 11228-3. Additionally, the unmitigated stress concentration will initiate a fatigue crack at the track terminus under cyclic loading.'
  }
];

const FLANGE_ISSUES = [ALL_ISSUES_DB[0], ALL_ISSUES_DB[1], ALL_ISSUES_DB[2]];
const CAR_DOOR_ISSUES = [ALL_ISSUES_DB.find(i => i.id === 'ERR-22'), ALL_ISSUES_DB.find(i => i.id === 'ERR-21'), ALL_ISSUES_DB.find(i => i.id === 'ERR-23')];

const DEMO_PROJECT_1 = {
  _id: 'static-demo-002',
  name: 'Car Door Panel',
  status: 'pending',
  cadFileUrl: 'DEMO_MODE',
  validationScore: '0%',
  stats: { totalNodes: 0, edges: 0, volume: '0 cm³', density: '0 g/cm³' },
  issues: []
};

const DEMO_PROJECT_2 = {
  _id: 'static-demo-001',
  name: 'Industrial Flange',
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

  hoveredIssueId: null,
  setHoveredIssueId: (id) => set({ hoveredIssueId: id }),

  // THE NEW HITL OVERRIDE FUNCTION
  waiveIssue: (issueId) => {
    set((state) => {
      const activeProject = state.projects.find(p => p._id === state.activeProjectId);
      if (!activeProject) return state;

      const updatedIssues = activeProject.issues.filter(i => i.id !== issueId);
      const newScore = updatedIssues.length === 0 ? '100%' : activeProject.validationScore;

      return {
        projects: state.projects.map(p => p._id === state.activeProjectId ? {
          ...p,
          issues: updatedIssues,
          validationScore: newScore
        } : p),
        hoveredIssueId: state.hoveredIssueId === issueId ? null : state.hoveredIssueId
      };
    });
  },

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

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      const { activeProjectId } = get();
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        activeProjectId: activeProjectId === id ? DEMO_PROJECT_1._id : activeProjectId,
      }));
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  },

  startSimulation: async () => {
    const { activeProjectId } = get();
    if (!activeProjectId) return;

    set({ pipelineState: 'extraction', inferenceLogs: ['[SYS] Initializing Validation Pipeline v2.4'] });

    if (activeProjectId === DEMO_PROJECT_1._id || activeProjectId === DEMO_PROJECT_2._id) {
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[EXTRACT] B-Rep analysis initiated successfully...'] }));
      await new Promise(r => setTimeout(r, 1500));

      set({ pipelineState: 'graph' });
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[GNN] Converting B-Rep to Attributed Graph.'] }));
      await new Promise(r => setTimeout(r, 1500));

      set({ pipelineState: 'inference' });
      set((state) => ({ inferenceLogs: [...state.inferenceLogs, '[INFERENCE] Checking rules against ISO database...'] }));
      await new Promise(r => setTimeout(r, 2000));

      const targetIssues = activeProjectId === 'static-demo-002' ? CAR_DOOR_ISSUES : FLANGE_ISSUES;

      const sortedTrimmedIssues = targetIssues.sort((a, b) => {
        const ranks = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return ranks[a.severity] - ranks[b.severity];
      }).slice(0, 3);

      set((state) => ({
        pipelineState: 'complete',
        inferenceLogs: [...state.inferenceLogs, '[WARNING] Detected structural/geometric anomalies.', '[SUCCESS] Validation complete. Top issues compiled for UX view.'],
        projects: state.projects.map(p => p._id === activeProjectId ? {
          ...p,
          status: 'completed',
          validationScore: activeProjectId === 'static-demo-001' ? '82.5%' : '91.2%',
          stats: { totalNodes: 24502, edges: 51204, volume: '8400 cm³', density: '2.7 g/cm³' },
          issues: sortedTrimmedIssues
        } : p)
      }));
      return;
    }

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