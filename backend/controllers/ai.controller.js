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
      You are an expert AI CAD evaluation system. The user has uploaded a CAD model named "${project.name}".
      Based on the name of this part, generate 1 to 3 realistic manufacturing, geometry, or topological errors that might occur during validation.
      
      You MUST return your response as a raw, valid JSON array of objects. Do not include markdown tags like \`\`\`json.
      Use this exact object structure for each issue:
      [
        {
          "id": "ERR_01",
          "title": "Short descriptive title of the issue",
          "severity": "Critical", "High", or "Medium",
          "type": "Geometry", "Topology", or "Constraint",
          "rule": "Make up an ISO standard like ISO-10303-XX",
          "confidence": "A percentage like 88.5%",
          "fix": "Actionable engineering advice to fix it"
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