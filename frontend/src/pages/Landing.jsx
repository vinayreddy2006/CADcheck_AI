import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, Cuboid, BrainCircuit, Network,
  Zap, Settings, PlayCircle, Layers, ArrowRight, Cpu,
  Timer, BarChart3, Database
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  // Animation variants for smooth scrolling video demo
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 overflow-x-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="px-8 py-5 flex items-center justify-between absolute top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              Aegis CAD
            </span>
          </div>
        </div>
        <nav>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full transition-all shadow-lg"
          >
            Launch Console
          </button>
        </nav>
      </header>

      {/* ── Hero Section (Dark Tech Theme for Video Impact) ─────────────── */}
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center bg-[#0B1120] border-b border-slate-800 overflow-hidden">
        {/* Abstract Background Grid & Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          className="relative z-10 max-w-5xl mx-auto"
          initial="hidden" animate="visible" variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Cpu className="w-4 h-4" /> AI-Driven Design Intelligence
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Early-Stage Validation via <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400">
              Geometric Deep Learning
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            An AI-powered CAD co-pilot that integrates natively with CATIA and NX. Combines <strong className="text-slate-200">Agentic Reasoning</strong> with <strong className="text-slate-200">Deterministic Validation</strong> for sub-second, zero-hallucination DFM feedback.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/dashboard')}
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-base font-bold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all flex items-center gap-2"
            >
              Start Live Validation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm font-medium backdrop-blur-md">
              <span className="flex items-center gap-2"><Network className="w-4 h-4 text-emerald-400" /> Geometric AI</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-indigo-400" /> Agentic Reasoning</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-400" /> Deterministic Metrology</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Quantifiable Impact (Based EXACTLY on Slide 2) ──────────────────────── */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100"
        >
          <div className="flex flex-col items-center text-center md:px-4">
            <Timer className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-3xl font-black text-slate-800 mb-1">99%</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Faster Validation</p>
            <p className="text-xs text-slate-500 mt-2">Cuts DFM review time from 4-8 hours to under 1.5 seconds.</p>
          </div>
          <div className="flex flex-col items-center text-center md:px-4 pt-6 md:pt-0">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mb-3" />
            <h3 className="text-3xl font-black text-slate-800 mb-1">100%</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Accuracy</p>
            <p className="text-xs text-slate-500 mt-2">Eliminates human errors and AI hallucinations for zero false positives.</p>
          </div>
          <div className="flex flex-col items-center text-center md:px-4 pt-6 md:pt-0">
            <BarChart3 className="w-8 h-8 text-indigo-500 mb-3" />
            <h3 className="text-3xl font-black text-slate-800 mb-1">10x</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Cost Savings</p>
            <p className="text-xs text-slate-500 mt-2">Prevents costly tooling rework by catching issues at the design stage.</p>
          </div>
          <div className="flex flex-col items-center text-center md:px-4 pt-6 md:pt-0">
            <Zap className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="text-3xl font-black text-slate-800 mb-1">30%</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">More Productivity</p>
            <p className="text-xs text-slate-500 mt-2">Frees engineer time by automating manual compliance checks.</p>
          </div>
        </motion.div>
      </section>

      {/* ── Architectural Topology (Based EXACTLY on Slide 3) ─────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2">Core Technology</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Architectural Topology</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1: GDL */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 border border-indigo-100"><Network className="w-6 h-6" /></div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Geometric Deep Learning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Converts raw CAD models into graph-based structures. Identifies complex 3D CAD features spatially to enable true 3D understanding.</p>
            </motion.div>

            {/* Card 2: Knowledge Core */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 border border-blue-100"><Database className="w-6 h-6" /></div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Semantic Knowledge Core</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Auto-extracts and applies manufacturing rules from standard PDF guidelines using High-Dimensional Vector Search and Vision-Language Models.</p>
            </motion.div>

            {/* Card 3: Deterministic Verifier */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 border border-emerald-100"><ShieldCheck className="w-6 h-6" /></div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Deterministic Metrology</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Zero hallucination with OpenCASCADE-backed mathematical precision. Measures exact geometry to eliminate AI-based errors and false positives.</p>
            </motion.div>

            {/* Card 4: Cognitive Core */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 border border-purple-100"><BrainCircuit className="w-6 h-6" /></div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Agentic Reasoning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">An AI-powered orchestrator that understands 3D geometry, interprets rules dynamically, and coordinates the workflow to provide actionable design feedback.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Closed-Loop Validation Flow ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Closed-Loop Validation Flow</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-10 right-10 h-0.5 bg-slate-100 z-0"></div>

            {[
              { step: 1, title: "CAD Integration", desc: "Captures real-time CAD changes and overlays validation feedback.", color: "bg-slate-100 text-slate-800 border-slate-200" },
              { step: 2, title: "Topology Extraction", desc: "Extracts precise B-Rep geometry and converts it into structured data.", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
              { step: 3, title: "Cognitive Processing", desc: "Coordinates AI workflow, rule-based reasoning, and decision-making logic.", color: "bg-blue-100 text-blue-700 border-blue-200" },
              { step: 4, title: "Deterministic Validation", desc: "Validates results against standards and highlights potential risks.", color: "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className={`w-20 h-20 border-4 rounded-full flex items-center justify-center text-2xl font-black mb-6 ${item.color}`}>
                  {item.step}
                </div>
                <h4 className="font-bold text-lg mb-2 text-slate-800">{item.title}</h4>
                <p className="text-slate-500 text-sm px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#0f172a] to-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-700 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_50%)]" />
            <Layers className="w-16 h-16 text-blue-400 mx-auto mb-6 relative z-10" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">Experience Real-Time Validation</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Launch the interactive console to see Aegis CAD process complex B-Rep assemblies, extract geometry graphs, and highlight non-compliant features.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] transition-all flex items-center gap-2 mx-auto relative z-10"
            >
              <PlayCircle className="w-6 h-6" /> Start Live Validation
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="py-8 text-center text-slate-500 text-sm bg-white border-t border-slate-200">
        <p className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">
          © 2026 Aegis CAD · Developed for Varroc Eureka Challenge
        </p>
      </footer>

    </div>
  );
}