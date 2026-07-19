const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_IMG = "/images/7a0e880ec_generated_a61bcacb.png";

// Simple pseudo-noise for terrain displacement
function noise(x, y) {
  return Math.sin(x * 1.3) * Math.cos(y * 1.1) * 0.5 + Math.sin(x * 0.7 + y * 0.5) * 0.4;
}

function initThree(canvas) {
  const scene = new THREE.Scene();
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
  camera.position.set(0, 2.4, 6.2);
  camera.lookAt(0, -0.2, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);

  // Lighting
  scene.add(new THREE.AmbientLight(0xfdfbf7, 0.6));
  const key = new THREE.DirectionalLight(0xffd98a, 1.4);
  key.position.set(4, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x0f766e, 0.8);
  fill.position.set(-5, 2, -3);
  scene.add(fill);

  const group = new THREE.Group();
  scene.add(group);

  // Low-poly terrain parcel
  const geo = new THREE.PlaneGeometry(6, 6, 24, 24);
  geo.rotateX(-Math.PI / 2.4);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const edge = 1 - Math.min(1, Math.sqrt(x * x + z * z) / 3.2);
    pos.setY(i, noise(x * 0.6, z * 0.6) * 0.7 * edge);
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x0f766e,
    metalness: 0.35,
    roughness: 0.55,
    flatShading: true,
    transparent: true,
    opacity: 0.92
  });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);

  // Gold wireframe overlay
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.35 })
  );
  group.add(wire);

  // Floating gold marker
  const markerGeo = new THREE.OctahedronGeometry(0.16, 0);
  const markerMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.2, emissive: 0xb8860b, emissiveIntensity: 0.4 });
  const marker = new THREE.Mesh(markerGeo, markerMat);
  marker.position.set(0.4, 1.3, 0.2);
  group.add(marker);

  group.position.y = -0.4;

  const target = { x: 0, y: 0 };
  const onMove = (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
    target.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
  };
  window.addEventListener("mousemove", onMove);

  let raf;
  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();
    group.rotation.y += (target.x - group.rotation.y) * 0.05 + 0.0015;
    group.rotation.x += (target.y * 0.3 - group.rotation.x) * 0.05;
    marker.position.y = 1.3 + Math.sin(t * 1.6) * 0.12;
    marker.rotation.y = t * 0.8;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  animate();

  const onResize = () => {
    const nw = canvas.clientWidth, nh = canvas.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh, false);
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("resize", onResize);
    geo.dispose(); mat.dispose(); markerGeo.dispose(); markerMat.dispose();
    renderer.dispose();
  };
}

export default function Hero3D() {
  const canvasRef = useRef(null);
  const [use3D, setUse3D] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = window.matchMedia("(max-width: 768px)").matches;
    if (reduce || lowEnd) { setUse3D(false); setLoaded(true); return; }
    try {
      const canvas = canvasRef.current;
      const test = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!test) { setUse3D(false); setLoaded(true); return; }
      const cleanup = initThree(canvas);
      setLoaded(true);
      return cleanup;
    } catch (e) {
      setUse3D(false);
      setLoaded(true);
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-primary text-primary-foreground">
      {/* Background image layer (parallax fallback + depth) */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Premium land estate at golden hour" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary" />
        <div className="absolute inset-0 topo-bg opacity-20 animate-drift" />
      </div>

      {/* 3D canvas */}
      {use3D && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-8xl px-5 md:px-10 min-h-screen flex flex-col justify-center pt-28 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-10 bg-accent" />
            <span className="label-tech">Earthed Etherealism</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[15vw] md:text-[10vw] lg:text-[9rem] leading-[0.92] tracking-tight"
          >
            Bhoodevi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed"
          >
            A curated portfolio of verified land estates, farm lands, and investment parcels — where the weight of the earth meets the fluidity of digital innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/properties"
              className="group inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-7 py-4 font-semibold hover:scale-[1.03] transition-transform shadow-lg"
            >
              Explore Estates
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

          </motion.div>
        </div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-primary-foreground/10 rounded-2xl overflow-hidden glass-dark max-w-3xl"
        >
          {[
            ["420+", "Verified Properties"],
            ["960 ac", "Acres Sold"],
            ["14 yrs", "Experience"],
            ["5200+", "Consultations"],
          ].map(([v, l]) => (
            <div key={l} className="bg-primary/40 backdrop-blur-sm px-5 py-5">
              <div className="font-display text-3xl text-accent">{v}</div>
              <div className="text-xs text-primary-foreground/70 mt-1">{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/60"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}