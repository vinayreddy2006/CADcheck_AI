import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Cuboid, BrainCircuit, Network, Zap, Settings, PlayCircle, Layers, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200">
      
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-black tracking-tight text-slate-900">CADCheck AI</span>
        </div>
        <nav>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors shadow-sm shadow-blue-600/20"
          >
            Dashboard
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" /> Next-Generation Validation
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            AI-Powered CAD <br/> Validation & Analysis
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Instantly detect manufacturing flaws, geometry anomalies, and compliance violations before sending your models to production.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full text-lg font-bold shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 mx-auto"
          >
            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Abstract Interface Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 w-full max-w-4xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 z-10 bottom-0 top-1/2"></div>
          <div className="bg-white rounded-t-3xl border border-slate-200 border-b-0 shadow-2xl p-2 relative overflow-hidden">
             <div className="bg-slate-100 rounded-t-2xl h-8 flex items-center px-4 gap-2 border-b border-slate-200">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
             </div>
             <div className="h-64 bg-slate-900 rounded-b-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_50%)]"></div>
                <Cuboid className="w-32 h-32 text-blue-500/50 spinning-slow" />
                <div className="absolute right-8 top-8 bg-black/50 backdrop-blur border border-white/10 p-4 rounded-xl max-w-xs text-left">
                   <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-2 uppercase"><Settings className="w-3 h-3" /> Issue Detected</div>
                   <div className="text-white text-sm">Insufficient structural rib thickness mapped at coordinate X:24 Y:-12</div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core Capabilities</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Cuboid className="w-6 h-6" /></div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Detect Geometry Errors</h3>
              <p className="text-slate-600 text-sm">Identify non-manifold edges, gaps, and intersecting faces instantly.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><Settings className="w-6 h-6" /></div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Manufacturing Rules</h3>
              <p className="text-slate-600 text-sm">Ensure your designs meet standard ISO DFM/DFA constraints before tooling.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4"><Network className="w-6 h-6" /></div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">CAD Topology</h3>
              <p className="text-slate-600 text-sm">Convert B-Reps into rich Graph structures for advanced algorithmic checks.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4"><BrainCircuit className="w-6 h-6" /></div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">AI-Powered Insights</h3>
              <p className="text-slate-600 text-sm">Get actionable suggestions powered by large language models on how to fix flaws.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-10 left-10 right-10 h-0.5 bg-slate-700 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center text-2xl font-black text-blue-400 mb-6 shadow-xl">1</div>
              <h4 className="font-bold text-lg mb-2">Upload CAD Model</h4>
              <p className="text-slate-400 text-sm">Drag and drop standard STL payload files.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center text-2xl font-black text-blue-400 mb-6 shadow-xl">2</div>
              <h4 className="font-bold text-lg mb-2">Run Validation</h4>
              <p className="text-slate-400 text-sm">Our AI scans the meshing geometry instantly.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center text-2xl font-black text-blue-400 mb-6 shadow-xl">3</div>
              <h4 className="font-bold text-lg mb-2">Detect Issues</h4>
              <p className="text-slate-400 text-sm">Isolate problematic areas in the 3D viewer.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 border-4 border-blue-400 rounded-full flex items-center justify-center text-2xl font-black text-white mb-6 shadow-xl shadow-blue-500/30">4</div>
              <h4 className="font-bold text-lg mb-2">Fix with Suggestions</h4>
              <p className="text-blue-200 text-sm">Read the structured AI reasoning to resolve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use This */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
               <h2 className="text-3xl font-bold text-slate-800 mb-6">Why CADCheck?</h2>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                   <div><strong className="text-slate-700 block">Saves Time</strong><span className="text-slate-500 text-sm">Automated evaluation takes seconds instead of hours of manual review.</span></div>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                   <div><strong className="text-slate-700 block">Reduces Design Errors</strong><span className="text-slate-500 text-sm">Avoid costly manufacturing delays and re-spins caused by missed dimensional flaws.</span></div>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                   <div><strong className="text-slate-700 block">Easy for Beginners</strong><span className="text-slate-500 text-sm">Plain English explanations with precise visual highlights guide novice engineers.</span></div>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                   <div><strong className="text-slate-700 block">Industry-Relevant</strong><span className="text-slate-500 text-sm">Trained on standard rules, it brings enterprise-grade checks directly to your browser.</span></div>
                 </li>
               </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center aspect-square shadow-inner">
                <Layers className="w-16 h-16 text-indigo-400 mb-4" />
                <h3 className="font-bold text-indigo-900 text-xl mb-2">Ready to validate?</h3>
                <p className="text-indigo-700 text-sm mb-6">Experience the AI validation framework with sample assemblies right away.</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-colors flex items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" /> Start Analyzing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm bg-slate-100 border-t border-slate-200">
         <p>© 2026 CADCheck AI. Built for next-generation engineering teams.</p>
      </footer>
      
    </div>
  );
}
