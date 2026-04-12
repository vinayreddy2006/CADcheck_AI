import { create } from 'zustand';
import api from '../lib/axios';

// ─────────────────────────────────────────────────────────────────────────────
// Static Issue Database — Professionally worded with precise physical locations
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_ISSUES_DB = [

  // ── Industrial Flange Issues ──────────────────────────────────────────────
  {
    id: 'ERR-01',
    title: 'Sub-Critical Wall Thickness Along Outer Perimeter Rib Array',
    severity: 'Critical',
    type: 'Design Constraint',
    rule: 'DFM-Cast-04',
    confidence: '99%',
    meshId: 'rib-3',
    fix: 'Increase the wall thickness of the three radial ribs along the outer perimeter of the upper mounting flange from the current 1.1 mm to a minimum of 2.5 mm to satisfy DFM-Cast-04 casting fill requirements.',
    reason: 'The B-Rep analysis detected that the three equidistant radial stiffening ribs — located at the outer perimeter of the upper mounting flange, between bolt bosses B2 and B4 — exhibit a nominal wall thickness of 1.1 mm. This is 56% below the 2.5 mm minimum mandated by DFM-Cast-04 for gravity die-cast aluminium alloys.',
    impact: 'During the high-pressure die-casting process, molten alloy flowing into thin-walled cavities loses thermal energy faster than feed metal can replenish it. This causes premature solidification and incomplete fill (misrun) in the rib cavity, resulting in cold shuts and sub-surface porosity. Under cyclic torque loading from the bolted joint, these microporous regions will initiate fatigue cracks that propagate through the rib cross-section, ultimately causing catastrophic fracture of the flange body.'
  },
  {
    id: 'ERR-02',
    title: 'Non-Manifold B-Rep Intersection at Neck-to-Barrel Transition Zone',
    severity: 'High',
    type: 'Topology Rule',
    rule: 'B-Rep-03',
    confidence: '100%',
    meshId: 'rib-4',
    fix: 'Perform a Boolean subtraction to resolve the co-incident face overlap between solid body S-12 (neck boss) and S-07 (barrel body) at the neck-to-barrel transition, then re-stitch the resulting open shell edges to restore a fully-closed, two-manifold B-Rep topology.',
    reason: 'Two solid bodies — the neck boss (S-12) and the primary barrel body (S-07) — share a co-incident set of faces at the concave neck-to-barrel transition zone, located 14 mm below the upper flange face. The overlapping faces create a non-manifold condition: a single edge is shared by more than two faces, violating the two-manifold closure invariant required by ISO 10303-42.',
    impact: 'A non-manifold body cannot be processed by downstream CAM systems for CNC toolpath generation, nor by FEA solvers for structural simulation, as the open-shell boundary produces undefined inside/outside volume assignments. Any attempt to manufacture from this geometry will result in tool gouging artefacts or an aborted machining cycle.'
  },
  {
    id: 'ERR-03',
    title: 'Asymmetric M6 Clearance Hole Omission at 135° Bolt Pattern Locus',
    severity: 'High',
    type: 'Geometry Error',
    rule: 'Assy-M6-Spacing',
    confidence: '88%',
    meshId: 'hole-miss-5',
    fix: 'Instantiate an M6 clearance hole (⌀6.4 mm through-bore) at the 135° angular position on the 72 mm Pitch Circle Diameter of the upper mounting flange to restore the required four-bolt symmetric pattern per assembly drawing AD-FLG-007.',
    reason: 'The upper mounting flange defines a four-way symmetric M6 bolt pattern on a 72 mm PCD. The GDL graph traversal identified that the hole instance at the 135° angular position is absent from the B-Rep face set, while the complementary holes at 45°, 225°, and 315° are correctly formed, breaking the required four-fold rotational symmetry.',
    impact: 'This asymmetry concentrates the preload force on the three remaining bolts by 33%, exceeding their rated preload and inducing fretting fatigue at the bolt-seat interface. Under vibration loading, the unbalanced joint will progressively loosen, ultimately allowing the flange to separate from its mating component.'
  },

  // ── Car Door Panel Issues ─────────────────────────────────────────────────
  {
    id: 'ERR-21',
    title: 'Absent Secondary M8 Clearance Bore at Lower Hinge Bracket Attachment Interface',
    severity: 'High',
    type: 'Design Constraint',
    rule: 'Hinge-Fastener-Std-OEM-07',
    confidence: '98%',
    meshId: 'door-hinge-err',
    fix: 'Instantiate an M8 clearance bore (⌀8.4 mm, 16 mm deep) at the secondary fastener locus on the lower hinge bracket attachment interface, located 38 mm inboard of the outer door skin flange and 22 mm above the rocker panel datum, per OEM hinge drawing HNG-D-2284.',
    reason: 'The lower hinge bracket attachment interface — located at the vehicle body pillar junction, 38 mm inboard of the outer door skin flange and 22 mm above the rocker panel datum — specifies a two-bolt M8 fastening pattern per OEM structural drawing HNG-D-2284. The B-Rep face traversal confirmed that only the primary clearance bore is instantiated; the secondary fastener bore at the prescribed locus is absent from the solid body.',
    impact: 'A single-bolt hinge attachment reduces joint stiffness by approximately 65% compared to the design intent twin-bolt configuration. During dynamic door-open events, the cantilevered door mass generates a bending moment at the single bolt, inducing plastic deformation of the bracket stamping. Door sag will exceed the OEM door-gap tolerance (±1.5 mm) within fewer than 10,000 open/close cycles, constituting a warranty failure.'
  },
  {
    id: 'ERR-22',
    title: 'Unmitigated Sub-Minimum Wall Thickness on Central Longitudinal Reinforcement Rib',
    severity: 'Critical',
    type: 'Structural Integrity',
    rule: 'OEM-Min-Wall-Std-AL-02',
    confidence: '99%',
    meshId: 'door-rib-err',
    fix: 'Increase the nominal wall thickness of the central longitudinal reinforcement rib — spanning the full 920 mm vertical extent of the inner door panel along its neutral axis — from the current 1.2 mm to a minimum of 2.5 mm, as mandated by OEM-Min-Wall-Std-AL-02 for aluminium inner panel stampings subject to side-impact loading.',
    reason: 'The central longitudinal reinforcement rib — a continuous stamped feature spanning the full 920 mm vertical extent of the inner door panel along its neutral bending axis — measures a nominal wall thickness of only 1.2 mm. OEM-Min-Wall-Std-AL-02 mandates a minimum of 2.5 mm for inner panel ribs classified as primary lateral load paths in aluminium door structures. The current thickness is 52% deficient.',
    impact: 'Under a FMVSS 214 pole side-impact test scenario, the central rib constitutes the primary barrier against door inner panel intrusion into the occupant compartment. At 1.2 mm, the rib cross-section cannot sustain the plastic bending moment required to absorb mandated impact energy before exceeding the intrusion limit, constituting a critical safety non-conformance that will fail regulatory certification.'
  },
  {
    id: 'ERR-23',
    title: 'Zero-Blend-Radius Dihedral Edge at Upper Window Track Extrusion Terminus',
    severity: 'Medium',
    type: 'Manufacturing',
    rule: 'ISO-13715',
    confidence: '95%',
    meshId: 'door-edge-err',
    fix: 'Apply a 2.0 mm minimum convex blend radius to the 90° dihedral edge at the terminus of the upper window track extrusion, located along the inner face of the door at the intersection of the window aperture surround and the primary door frame flange, per ISO 13715 sharp-edge mitigation specifications.',
    reason: 'The extruded upper window track — located along the inner face of the door at the intersection of the window aperture surround and the primary door frame flange — terminates with a geometrically exact 90° dihedral angle (r = 0.00 mm). ISO 13715 mandates a minimum 2.0 mm convex blend radius for all accessible re-entrant edges on aluminium stampings to prevent operator laceration injury during trim-line assembly.',
    impact: 'A zero-radius re-entrant edge is classified as a Severity 1 ergonomic hazard under ISO 11228-3 and will cause automatic rejection at the OEM process audit. Additionally, the unmitigated stress concentration (Kt ≈ 3.8 for Al-6061-T6 under fatigue loading) will initiate a fatigue crack at the track terminus under cyclic door-deflection loading, propagating toward the window aperture surround flange within the component\'s scheduled service life.'
  }
];

const FLANGE_ISSUES = [ALL_ISSUES_DB[0], ALL_ISSUES_DB[1], ALL_ISSUES_DB[2]];
const CAR_DOOR_ISSUES = [ALL_ISSUES_DB.find(i => i.id === 'ERR-22'), ALL_ISSUES_DB.find(i => i.id === 'ERR-21'), ALL_ISSUES_DB.find(i => i.id === 'ERR-23')];

// FIXED THE ORDER: Project 1 is now Car Door Panel, Project 2 is Industrial Flange
const DEMO_PROJECT_1 = {
  _id: 'static-demo-002', // Explicitly Car Door ID
  name: 'Car Door Panel',
  status: 'pending',
  cadFileUrl: 'DEMO_MODE',
  validationScore: '0%',
  stats: { totalNodes: 0, edges: 0, volume: '0 cm³', density: '0 g/cm³' },
  issues: []
};

const DEMO_PROJECT_2 = {
  _id: 'static-demo-001', // Explicitly Flange ID
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

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      const { activeProjectId } = get();
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        // If the deleted project was active, fall back to the first demo project
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

      // FIXED LOGIC: Match by explicit ID instead of variable name
      const targetIssues = activeProjectId === 'static-demo-002' ? CAR_DOOR_ISSUES : FLANGE_ISSUES;

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
          validationScore: activeProjectId === 'static-demo-001' ? '82.5%' : '91.2%',
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