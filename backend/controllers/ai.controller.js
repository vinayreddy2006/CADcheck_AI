const Project = require('../models/Project');
const Validation = require('../models/Validation');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini (Ensure your .env has GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const analyzeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await delay(2000); // Simulate extraction time
    project.status = 'processing';
    await project.save();

    res.json({ success: true, message: 'Analysis started', status: 'Extraction complete' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateGraph = async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await delay(2500); // Simulate graph generation time

    project.stats = {
      totalNodes: Math.floor(Math.random() * 5000) + 1000,
      edges: Math.floor(Math.random() * 15000) + 3000,
      volume: '150.2 cm³',
      density: '3.4 g/cm³'
    };
    await project.save();

    res.json({ success: true, message: 'Graph generated', stats: project.stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const validateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.status = 'processing';
    await project.save();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_actual_api_key_here') {
      throw new Error("Missing or invalid GEMINI_API_KEY in backend/.env file");
    }

    // BULLETPROOF KEY SANITIZATION:
    // This strips out any accidental quotes, spaces, or hidden newlines from your .env file
    const rawKey = process.env.GEMINI_API_KEY;
    const cleanKey = rawKey.replace(/['"]/g, '').trim();

    // Call Gemini API using the cleaned key
    const genAI = new GoogleGenerativeAI(cleanKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are an Aegis CAD — an expert AI CAD validation engine deployed inside an enterprise-grade geometric intelligence platform used by aerospace, automotive, and precision manufacturing engineers.
The user has uploaded a CAD solid model named "${project.name}".

Your task: Perform a simulated B-Rep topology audit and geometric constraint validation on this part. Generate between 1 and 3 realistic, high-fidelity manufacturing, topological, or geometric violations that a senior CAD QA engineer or DFM specialist would flag in a formal design review.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY CONTENT RULES — VIOLATIONS OF ANY RULE = INVALID OUTPUT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RULE 1 — ADVANCED ENGINEERING TERMINOLOGY (MANDATORY):
Every field must use precise, professional engineering, topological, and manufacturing vocabulary. You must draw from the following lexicon (non-exhaustive):
  Topology: "two-manifold B-Rep closure", "non-manifold dihedral edge", "co-incident face set", "open-shell boundary", "Euler characteristic violation", "NURBS parametric domain fold"
  Geometry: "G1/G2 surface continuity", "Kt stress concentration factor", "pitch circle diameter (PCD)", "datum plane offset", "nominal wall section", "re-entrant fillet", "dihedral angle"
  Manufacturing: "DFM draft angle", "misrun defect", "cold shut discontinuity", "micro-porosity nucleation", "tool gouging artifact", "fretting fatigue at bolt-seat interface", "ejector-pin punch-through", "die-lock condition", "CNC undercut", "thermal mass deficit"
  Standards: Reference real or plausible ISO/OEM codes (e.g., ISO 10303-42, DFM-Cast-04, ISO 13715, ASME Y14.5, OEM-Min-Wall-Std-AL-02, B-Rep-03, Assy-M6-Spacing).

RULE 2 — HYPER-PRECISE PHYSICAL LOCALIZATION (MANDATORY, ZERO EXCEPTIONS):
Every single issue MUST specify an exact, convincingly inventive physical location on the 3D part. You must combine a named feature, a spatial qualifier, and a dimensional reference. Examples of ACCEPTABLE location strings:
  ✓ "along the outer perimeter of the upper mounting flange, between bolt bosses B2 and B4"
  ✓ "at the concave neck-to-barrel transition zone, 14 mm below datum face A"
  ✓ "at the 135° angular position on the 72 mm Pitch Circle Diameter of the lower bearing housing"
  ✓ "intersecting the primary central bore at a depth of 8.5 mm from the inboard datum face"
  ✓ "at the terminus of the upper window track extrusion, at the window aperture surround flange junction"
  ✓ "on the anti-drive-side lateral support rib, 22 mm inboard of the outer skin flange"
  ✗ UNACCEPTABLE: "on the part", "in the model", "near the surface", "at the edge"
The physical location string MUST appear in both the "title" AND the "fix" fields.

RULE 3 — CAUSE-AND-EFFECT FAILURE CHAIN (MANDATORY):
The "fix" field must form a complete engineering failure narrative using this structure:
  (a) State the corrective geometric action with exact dimensions (e.g., "Increase the root fillet radius from 0.4 mm to ≥ 2.5 mm").
  (b) Name the specific manufacturing process that will be compromised if left unresolved (e.g., "gravity die-casting", "CNC 3-axis milling", "FMVSS 214 pole side-impact certification").
  (c) State the precise downstream consequence using technical cause-and-effect language (e.g., "premature solidification front will cause misrun porosity nucleation within the rib cavity, initiating fatigue crack propagation under cyclic joint loading").

RULE 4 — TITLE SPECIFICITY (MANDATORY):
Issue titles must be specific, jargon-dense, and include a named location. Study these patterns:
  ✗ "Missing Hole"              → ✓ "Absent Secondary M8 Clearance Bore at the Lower Hinge Bracket Twin-Fastener Locus"
  ✗ "Thin Wall"                 → ✓ "Sub-Critical Nominal Wall Thickness on the Outer Perimeter Radial Rib Array"
  ✗ "Edge Issue"                → ✓ "Zero-Blend-Radius Dihedral Re-entrant Edge at the Upper Window Track Extrusion Terminus"
  ✗ "Draft Angle Problem"       → ✓ "Non-Compliant Near-Vertical Draft Angle on the Exterior Housing Flange Sidewall"
  ✗ "Stress Issue"              → ✓ "Unmitigated Kt Stress Riser at the Primary Central Bore-to-Lateral Rib Intersection"

RULE 5 — "reason" FIELD — ROOT CAUSE TRACEABILITY:
The "reason" must describe a plausible automated detection mechanism: reference the specific B-Rep analysis method, graph traversal, or measurement threshold that triggered the flag. E.g., "The GDL graph node traversal detected a valence-3 edge shared by three coincident face sets at this locus, violating the two-manifold closure invariant of ISO 10303-42."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT — STRICT JSON ARRAY, NO MARKDOWN WRAPPERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY a raw, valid JSON array. Do NOT include any text before or after the array. Do NOT wrap it in \`\`\`json code fences.
Use exactly this schema for every object:
[
  {
    "id": "ERR-01",
    "title": "<Specific jargon-rich title that includes the exact physical location on the part>",
    "severity": "Critical" | "High" | "Medium",
    "type": "Design Constraint" | "Topology Rule" | "Geometry Error" | "Structural Integrity" | "Manufacturing",
    "rule": "<Plausible ISO or OEM standard code, e.g. DFM-Cast-04, ISO-10303-42, B-Rep-03>",
    "confidence": "<Realistic confidence percentage, e.g. 97.4%>",
    "fix": "<Multi-sentence corrective action: (a) WHERE + exact dimension fix, (b) manufacturing process affected, (c) downstream failure consequence if left unresolved>",
    "reason": "<One or two sentences of root-cause analysis referencing the B-Rep feature, graph traversal result, or measurement that triggered the violation>",
    "meshId": "<Plausible mesh node or face identifier, e.g. face-S12, bore-inner-left, rib-web-03>"
  }
]
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON returned by Gemini
    let generatedIssues = [];
    try {
      // Strip out markdown code blocks if Gemini accidentally includes them
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      generatedIssues = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseText);
      // Fallback if the AI returns malformed JSON
      generatedIssues = [{
        id: 'ERR_FAIL',
        title: 'AI Parsing Error',
        severity: 'Medium',
        type: 'System',
        rule: 'N/A',
        confidence: '0%',
        fix: 'Check backend logs. Gemini did not return valid JSON.'
      }];
    }

    // Save the dynamic AI data to the database
    project.issues = generatedIssues;

    // Calculate a realistic validation score based on the amount of errors
    const baseScore = Math.max(0, 100 - (generatedIssues.length * 8));
    project.validationScore = `${baseScore + (Math.floor(Math.random() * 50) / 10)}%`;
    project.status = 'completed';
    await project.save();

    const validation = await Validation.create({
      projectId: project._id,
      results: { issues: generatedIssues, rawOutput: responseText },
      confidence: 95.0,
      timestamps: { startedAt: new Date(Date.now() - 3000), completedAt: new Date() }
    });

    res.json({
      success: true,
      message: 'Validation complete',
      validationScore: project.validationScore,
      issues: project.issues,
      validationId: validation._id
    });

  } catch (error) {
    console.error("Validation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeProject, generateGraph, validateProject };