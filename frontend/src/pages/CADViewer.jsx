import { Suspense, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BrainCircuit, ArrowRight, Cuboid, PlayCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, Html, RoundedBox } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// Component for Real uploaded STL files
const STLModel = ({ url }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace(/\/api$/, '');
  const fullUrl = `${baseUrl}${url}`;
  const geom = useLoader(STLLoader, fullUrl);
  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.2} />
    </mesh>
  );
};

// Component for Smartphone Chassis Assembly
const SmartphoneModel = ({ issues }) => {
  const { hoveredIssueId, setHoveredIssueId } = useAppStore();

  const getMaterialColor = (isValid, meshId) => {
    const mappedIssue = issues.find(i => i.meshId === meshId);
    if (!isValid && mappedIssue) {
       if (hoveredIssueId === mappedIssue?.id) return "#ff0000";
       return "#ef4444"; 
    }
    return "#10b981"; // Emerald-500
  };

  const isPlateInvalid = issues.some(i => i.meshId === 'phone-plate-err');
  const isCutoutInvalid = issues.some(i => i.meshId === 'phone-cutout-err');
  const isEdgeInvalid = issues.some(i => i.meshId === 'phone-edge-err');

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      
      {/* Base Chassis Plate (The Aluminum Body) */}
      <RoundedBox 
        args={[7, 14, isPlateInvalid ? 0.3 : 0.5]} 
        radius={0.6}
        smoothness={4}
        position={[0, 0, 0]} 
        castShadow receiveShadow
        onPointerOver={(e) => { if (isPlateInvalid) { e.stopPropagation(); setHoveredIssueId('ERR-11'); } }}
        onPointerOut={() => { if (isPlateInvalid) setHoveredIssueId(null); }}
      >
        <meshStandardMaterial color={getMaterialColor(!isPlateInvalid, 'phone-plate-err')} metalness={0.8} roughness={0.3} />
        {hoveredIssueId === 'ERR-11' && (
          <Html position={[0, -2, 1]} distanceFactor={15} center zIndexRange={[100, 0]}>
             <div className="bg-rose-600 backdrop-blur text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-rose-300">
                <AlertCircle className="w-4 h-4 inline-block mr-1" /> Uneven Thickness Variance
             </div>
          </Html>
        )}
      </RoundedBox>

      {/* Screen Frame cut out (Valid) */}
      <RoundedBox args={[6.6, 13.6, 0.1]} radius={0.4} smoothness={4} position={[0, 0, 0.3]} castShadow>
        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
      </RoundedBox>

      {/* Dynamic Island / Screen Notch (Valid) */}
      <RoundedBox args={[2.2, 0.5, 0.15]} radius={0.25} smoothness={4} position={[0, 6.2, 0.32]}>
        <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
      </RoundedBox>

      {/* Power Button (Valid) */}
      <mesh position={[3.55, 3, 0]} castShadow>
        <boxGeometry args={[0.15, 1.6, 0.15]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Volume Rockers (Valid) */}
      <mesh position={[-3.55, 4, 0]} castShadow>
        <boxGeometry args={[0.15, 2.8, 0.15]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Camera Module Base Bump (Valid) */}
      <RoundedBox args={[2.8, 2.8, 0.25]} radius={0.4} smoothness={4} position={[-1.8, 5.2, -0.3]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
      </RoundedBox>

      {/* Double Camera Lenses (Valid) */}
      <mesh position={[-1.2, 4.6, -0.45]} castShadow>
         <cylinderGeometry args={[0.5, 0.5, 0.15, 24]} rotation={[Math.PI/2, 0, 0]} />
         <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
         {/* Inner Lens */}
         <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} rotation={[0, 0, 0]} />
            <meshStandardMaterial color="#38bdf8" metalness={1} roughness={0} />
         </mesh>
      </mesh>
      <mesh position={[-2.4, 5.8, -0.45]} castShadow>
         <cylinderGeometry args={[0.5, 0.5, 0.15, 24]} rotation={[Math.PI/2, 0, 0]} />
         <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
         {/* Inner Lens */}
         <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} rotation={[0, 0, 0]} />
            <meshStandardMaterial color="#38bdf8" metalness={1} roughness={0} />
         </mesh>
      </mesh>

      {/* Charging Port Cutout / Misalignment Error */}
      <mesh 
        position={[isCutoutInvalid ? -1.0 : 0, -7.1, 0]} 
        castShadow
        onPointerOver={(e) => { if (isCutoutInvalid) { e.stopPropagation(); setHoveredIssueId('ERR-12'); } }}
        onPointerOut={() => { if (isCutoutInvalid) setHoveredIssueId(null); }}
      >
        <boxGeometry args={[1.5, 0.3, 0.25]} />
        <meshStandardMaterial color={getMaterialColor(!isCutoutInvalid, 'phone-cutout-err')} metalness={0.4} roughness={0.7} transparent opacity={0.9} wireframe={isCutoutInvalid} />
        {hoveredIssueId === 'ERR-12' && (
          <Html position={[0, -1, 1]} distanceFactor={15} center zIndexRange={[100, 0]}>
             <div className="bg-rose-600 backdrop-blur text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-rose-300">
                <AlertCircle className="w-4 h-4 inline-block mr-1" /> Misaligned Port Axis
             </div>
          </Html>
        )}
      </mesh>

      {/* Edge Bumper / Sharp Corner Error */}
      <mesh 
        position={[3.55, -5.5, 0]} 
        castShadow receiveShadow
        onPointerOver={(e) => { if (isEdgeInvalid) { e.stopPropagation(); setHoveredIssueId('ERR-13'); } }}
        onPointerOut={() => { if (isEdgeInvalid) setHoveredIssueId(null); }}
      >
        <boxGeometry args={[0.3, 1.8, 0.55]} />
        <meshStandardMaterial color={getMaterialColor(!isEdgeInvalid, 'phone-edge-err')} metalness={0.7} roughness={0.2} transparent opacity={isEdgeInvalid ? 0.9 : 1} />
        {hoveredIssueId === 'ERR-13' && (
          <Html position={[1, 1, 1]} distanceFactor={15} center zIndexRange={[100, 0]}>
             <div className="bg-rose-600 backdrop-blur text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-rose-300">
                <AlertCircle className="w-4 h-4 inline-block mr-1" /> Dangerous Sharp Edge
             </div>
          </Html>
        )}
      </mesh>
    </group>
  );
};

// Component for the Detailed Single Engineering Assembly
const SingleComplexModel = ({ issues }) => {
  const { hoveredIssueId, setHoveredIssueId } = useAppStore();

  const getMaterialColor = (isValid, meshId) => {
    // Determine which issue maps to this mesh
    const mappedIssue = issues.find(i => i.meshId === meshId);
    
    // Core highlight logic
    if (!isValid) {
       // If currently targeted by hover
       if (hoveredIssueId === mappedIssue?.id) return "#ff0000"; // Bright red highlight
       return "#ef4444"; // Standard invalid red
    }
    
    // If it's valid, usually green, but to not overwhelm we use Emerald
    return "#10b981"; // Emerald-500
  };

  return (
    <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
      {/* 1. Base Flange Plate (Valid) */}
      <mesh position={[0, -2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[6, 6, 0.5, 64]} />
        <meshStandardMaterial color={getMaterialColor(true, 'base')} metalness={0.8} roughness={0.2} transparent opacity={0.85} />
      </mesh>

      {/* 2. Central Neck (Valid) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3, 3, 4, 64]} />
        <meshStandardMaterial color={getMaterialColor(true, 'neck')} metalness={0.8} roughness={0.2} transparent opacity={0.85} />
      </mesh>

      {/* 3. Central Bore (Hole simulation) */}
      <mesh position={[0, 0.01, 0]} castShadow>
        <cylinderGeometry args={[2, 2, 4.1, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.1} roughness={1} /> 
      </mesh>

      {/* 4. Support Ribs */}
      {/* Rib 1 (Valid) */}
      <mesh position={[0, -0.25, 3.5]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 3.5, 2]} />
        <meshStandardMaterial color={getMaterialColor(true, 'rib-1')} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Rib 2 (Valid) */}
      <mesh position={[0, -0.25, -3.5]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 3.5, 2]} />
        <meshStandardMaterial color={getMaterialColor(true, 'rib-2')} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Rib 3: Error 1 (Thin/Weak Rib) mapped to ERR-01 */}
      <mesh 
        position={[3.5, -0.25, 0]} 
        castShadow receiveShadow
        onPointerOver={(e) => { e.stopPropagation(); setHoveredIssueId('ERR-01'); }}
        onPointerOut={() => setHoveredIssueId(null)}
      >
        <boxGeometry args={[2, 3.5, 0.1]} />
        <meshStandardMaterial color={getMaterialColor(false, 'rib-3')} metalness={0.8} roughness={0.2} transparent opacity={0.9} />
        {hoveredIssueId === 'ERR-01' && (
          <Html position={[2, 1, 0]} distanceFactor={15} center>
             <div className="bg-rose-600 backdrop-blur text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-rose-300 transform scale-110 transition-transform">
                <AlertCircle className="w-4 h-4 inline-block mr-1" /> Insufficient Thickness
             </div>
          </Html>
        )}
      </mesh>

      {/* Rib 4: Error 2 (Misaligned Part) mapped to ERR-02 */}
      <mesh 
        position={[-4.5, 0.5, 0]} rotation={[0, 0, 0.4]} 
        castShadow receiveShadow
        onPointerOver={(e) => { e.stopPropagation(); setHoveredIssueId('ERR-02'); }}
        onPointerOut={() => setHoveredIssueId(null)}
      >
        <boxGeometry args={[2, 3.5, 0.6]} />
        <meshStandardMaterial color={getMaterialColor(false, 'rib-4')} metalness={0.8} roughness={0.2} transparent opacity={0.9} />
        {hoveredIssueId === 'ERR-02' && (
          <Html position={[-3, 1, 0]} distanceFactor={15} center>
             <div className="bg-rose-600 backdrop-blur text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-rose-300 transform scale-110 transition-transform">
                <AlertCircle className="w-4 h-4 inline-block mr-1" /> Overlapping Body
             </div>
          </Html>
        )}
      </mesh>

      {/* 5. Bolt Holes in the Base */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const x = Math.cos(angle) * 4.8;
        const z = Math.sin(angle) * 4.8;
        
        // ERR-03 mapped to missing hole 2, ERR-04 mapped to missing hole 5
        const isMissing = (i === 2) ? 'ERR-03' : (i === 5) ? 'ERR-04' : null;

        if (isMissing) {
          return (
            <group key={`hole-miss-${i}`}>
               <mesh 
                 position={[x, -1.9, z]} 
                 castShadow
                 onPointerOver={(e) => { e.stopPropagation(); setHoveredIssueId(isMissing); }}
                 onPointerOut={() => setHoveredIssueId(null)}
               >
                 <cylinderGeometry args={[0.5, 0.5, 0.8, 16]} />
                 <meshStandardMaterial color={getMaterialColor(false, `hole-miss-${i}`)} metalness={0.1} roughness={0.5} transparent opacity={0.4} wireframe />
                 {hoveredIssueId === isMissing && (
                   <Html position={[0, 0.5, 0]} distanceFactor={15} center>
                     <div className="bg-rose-600 backdrop-blur text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-rose-300 transform scale-110 transition-transform">
                        <AlertCircle className="w-4 h-4 inline-block mr-1" /> Missing Hole
                     </div>
                   </Html>
                 )}
               </mesh>
            </group>
          );
        }

        return (
          <mesh key={`hole-${i}`} position={[x, -2, z]} castShadow>
             <cylinderGeometry args={[0.4, 0.4, 0.51, 16]} />
             <meshStandardMaterial color="#1e293b" metalness={0.1} roughness={1} />
          </mesh>
        );
      })}

      {/* Error 4: Unfilleted Edge Exception mapped to ERR-05 */}
      <group>
        <mesh 
          position={[0, 1.5, 2.5]} 
          castShadow
          onPointerOver={(e) => { e.stopPropagation(); setHoveredIssueId('ERR-05'); }}
          onPointerOut={() => setHoveredIssueId(null)}
        >
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color={getMaterialColor(false, 'extrusion-err')} metalness={0.5} roughness={0.5} transparent opacity={0.9} />
          {hoveredIssueId === 'ERR-05' && (
            <Html position={[0, 1, 1]} distanceFactor={15} center>
               <div className="bg-rose-600 backdrop-blur text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-rose-300 transform scale-110 transition-transform">
                  <AlertCircle className="w-4 h-4 inline-block mr-1" /> Unfilleted Edge
               </div>
            </Html>
          )}
        </mesh>
      </group>
    </group>
  );
};

export default function CADViewer() {
  const { getActiveProject, pipelineState, startSimulation, hoveredIssueId, setHoveredIssueId } = useAppStore();
  const project = getActiveProject();

  if (!project) return null;

  const isEvaluating = pipelineState !== 'idle' && pipelineState !== 'complete';
  const needsEvaluation = project.status === 'pending' && pipelineState === 'idle';
  const isCompleted = project.status === 'completed';
  const issues = project.issues || [];

  const isDemo = project.cadFileUrl === 'DEMO_MODE';
  const isSTL = isDemo || project.cadFileUrl?.toLowerCase().endsWith('.stl');

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500 pb-4 relative">

      <AnimatePresence>
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} animate={{ opacity: 1, backdropFilter: 'blur(12px)' }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 rounded-2xl shadow-2xl"
          >
            <BrainCircuit className="w-24 h-24 text-blue-500 mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-2">Gemini AI is Analyzing Geometry</h2>
            <p className="text-blue-300 font-mono mb-8 animate-pulse">Current Stage: {pipelineState.toUpperCase()}...</p>
            <div className="w-96 bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
              <motion.div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full" initial={{ width: "0%" }} animate={{ width: pipelineState === 'extraction' ? "30%" : pipelineState === 'graph' ? "60%" : "90%" }} transition={{ duration: 0.5 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-700 ease-in-out glass-panel relative overflow-hidden group border border-slate-200/60 shadow-inner ${isCompleted ? 'flex-1' : 'w-full'}`}>

        {needsEvaluation && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/10 backdrop-blur-[2px] pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startSimulation}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/25 border border-blue-400/50 pointer-events-auto cursor-pointer"
            >
              <PlayCircle className="w-8 h-8 animate-pulse" />
              <div className="text-left">
                <div className="font-bold text-xl uppercase tracking-widest">Evaluate Model</div>
                <div className="text-blue-200 text-xs font-mono">Run AI Geometry Check</div>
              </div>
            </motion.button>
          </div>
        )}

        {/* REAL 3D CANVAS OR DEMO VIEW */}
        <div className="w-full h-full bg-slate-100">
          {!isSTL ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50">
              <Cuboid className="w-12 h-12 mb-3 text-slate-300" />
              <p className="font-bold text-lg text-slate-700">Non-STL File Uploaded</p>
              <p className="text-sm">Gemini validation completed successfully, but the 3D preview only supports .STL files.</p>
            </div>
          ) : isDemo ? (
            <div className="w-full h-full p-4">
              <div className="w-full h-full rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm relative group">
                {/* Overlay UI */}
                <div className="absolute top-4 left-4 z-10 flex gap-4">
                  <div className="bg-emerald-500/10 backdrop-blur px-4 py-2 rounded-lg border border-emerald-500/20 text-emerald-700 font-bold shadow-sm flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" /> Valid Regions
                  </div>
                  <div className="bg-rose-500/10 backdrop-blur px-4 py-2 rounded-lg border border-rose-500/20 text-rose-700 font-bold shadow-sm flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" /> Critical Errors (Select to highlight)
                  </div>
                </div>

                {/* 3D Canvas rendering a single combined model */}
                <Canvas shadows dpr={[1, 2]} camera={{ position: [18, 18, 18], fov: 35 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow shadow-bias={-0.0001} />
                  <Suspense fallback={null}>
                    <Stage environment="apartment" intensity={0.4} adjustCamera={false}>
                      {project.name === 'Smartphone Chassis' ? (
                        <SmartphoneModel issues={issues} />
                      ) : (
                        <SingleComplexModel issues={issues} />
                      )}
                    </Stage>
                  </Suspense>
                  <OrbitControls makeDefault enableZoom={true} enablePan={true} autoRotate={false} />
                </Canvas>
              </div>
            </div>
          ) : (
            <div className="w-full h-full cursor-move">
              <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 150], fov: 40 }}>
                <Suspense fallback={null}>
                  <Stage environment="city" intensity={0.6}>
                    <STLModel url={project.cadFileUrl} />
                  </Stage>
                </Suspense>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={2} />
              </Canvas>
            </div>
          )}
        </div>
      </div>

      {isCompleted && (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-96 flex flex-col gap-4">
          <div className="glass-panel p-5 flex flex-col gap-4 h-full overflow-y-auto shadow-sm border border-slate-200/60">
            <h3 className="font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3 uppercase tracking-wider text-xs sticky top-0 bg-white/90 backdrop-blur-sm z-10">
              <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-500" /> AI Findings</span>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 font-bold"><CheckCircle2 className="w-3 h-3" /> Analyzed</span>
            </h3>

            {issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="font-bold text-slate-700 mb-2">Perfect Compliance</h4>
                <p className="text-sm px-4">No ISO manufacturing violations detected.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8 pb-4">
                {issues.map((issue, idx) => {
                  const isHovered = hoveredIssueId === issue.id;

                  return (
                    <motion.div 
                      key={issue.id || idx}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      onMouseEnter={() => setHoveredIssueId(issue.id)}
                      onMouseLeave={() => setHoveredIssueId(null)}
                      className={`flex flex-col gap-3 text-sm p-4 rounded-xl border transition-all cursor-crosshair ${isHovered ? 'bg-rose-50/50 border-rose-300 shadow-xl transform scale-[1.02] z-50' : 'bg-white border-slate-100'}`}
                    >
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mb-2 border ${issue.severity === 'Critical' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            issue.severity === 'High' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                          {issue.severity}
                        </span>
                        <h4 className={`font-bold mb-1.5 leading-snug ${isHovered ? 'text-rose-700' : 'text-slate-800'}`}>{issue.title}</h4>
                        <p className="text-slate-500 text-xs flex items-center gap-1.5">
                          Rule: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{issue.rule}</span>
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100/50 p-4 rounded-xl relative overflow-hidden mt-2">
                        <BrainCircuit className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/5 rotate-12" />
                        <h5 className="font-semibold text-indigo-900 flex items-center gap-2 mb-2 text-xs uppercase tracking-widest">
                          <BrainCircuit className="w-4 h-4 text-indigo-500" /> Explainability
                        </h5>
                        <p className="text-slate-600 text-xs mb-4 leading-relaxed bg-white/50 p-2 rounded border border-white relative z-10">
                          The AI identified a <span className="font-bold text-indigo-700">{issue.type}</span> violation with {issue.confidence} confidence.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-slate-700 mb-2 text-xs uppercase tracking-wider">Suggested Fix</h5>
                        <div className="bg-slate-800 p-3 rounded-xl border-l-4 border-emerald-400 shadow-sm relative group overflow-hidden">
                          <p className="text-emerald-300 text-xs font-mono leading-relaxed relative z-10 flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" />
                            {issue.fix}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}