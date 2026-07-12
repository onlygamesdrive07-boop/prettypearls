"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import BraceletModel from "./BraceletModel";
import ParticleField from "./ParticleField";

function CameraRig() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.4}
        color="#FFF6E5"
        castShadow
      />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#C9A961" />
      <Environment preset="studio" />
    </>
  );
}

export default function HeroSection() {
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    mouse.current.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.current.y = (e.clientY / innerHeight) * 2 - 1;
  };

  return (
    <section
      onMouseMove={handlePointerMove}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-ivory"
    >
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <CameraRig />
            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
              <BraceletModel mouse={mouse} />
            </Float>
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>

      {/* Soft radial vignette for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_35%,_rgba(248,247,244,0.65)_100%)]" />

      {/* Copy Layer */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-6 text-gold-dark"
        >
          Pretty Pearls · Atelier of Handmade Jewelry
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl font-display text-5xl font-light leading-[1.05] text-charcoal sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Handcrafted Stories
          <br />
          <span className="italic text-gradient-gold">You Can Carry.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-md text-balance font-body text-base font-light tracking-wide text-charcoal/70 md:text-lg"
        >
          Every bead. Every flower. Every knot is handmade with care.
        </motion.p>

        <motion.a
          href="#collection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="group pointer-events-auto relative mt-12 inline-flex items-center gap-3 overflow-hidden rounded-full border border-charcoal/20 px-9 py-4 font-body text-sm tracking-wide text-charcoal transition-colors duration-500 ease-luxe hover:border-transparent hover:text-ivory"
        >
          <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-charcoal transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
          Explore the Collection
          <span className="transition-transform duration-500 ease-luxe group-hover:translate-x-1">
            →
          </span>
        </motion.a>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <div className="mx-auto h-10 w-[1px] animate-pulse bg-charcoal/30" />
        <span className="mt-3 block text-[10px] uppercase tracking-widest2 text-charcoal/40">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
