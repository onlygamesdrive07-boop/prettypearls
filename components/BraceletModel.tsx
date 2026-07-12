"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural bead bracelet: beads are threaded around a torus path.
 * Colors echo the brand palette — pearl, gold, beige, soft rose —
 * so the object reads as "handmade" rather than a generic 3D asset.
 */
const BEAD_COUNT = 32;
const RADIUS = 1.55;

const PALETTE = [
  "#F2EEE9", // pearl
  "#E4CE8E", // gold light
  "#C9A961", // gold
  "#EADFCB", // beige
  "#D8C6B0", // warm sand
  "#F5E6D8", // blush
];

export default function BraceletModel({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const beads = useMemo(() => {
    return new Array(BEAD_COUNT).fill(0).map((_, i) => {
      const angle = (i / BEAD_COUNT) * Math.PI * 2;
      const wobble = (i % 5 === 0 ? 1.18 : 1) * (i % 7 === 0 ? 0.9 : 1);
      const size = 0.12 * wobble + (i % 3 === 0 ? 0.03 : 0);
      const color = PALETTE[i % PALETTE.length];
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * RADIUS,
          Math.sin(angle) * RADIUS,
          Math.sin(angle * 3) * 0.08
        ),
        size,
        color,
        angle,
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Slow perpetual rotation — the "always turning" showcase feel
    group.current.rotation.y += delta * 0.18;

    // Gentle parallax toward the pointer, eased for a premium, weighty motion
    const targetX = mouse.current.y * 0.25;
    const targetZ = mouse.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;

    // Subtle breathing float
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <group ref={group}>
      {/* The connecting thread */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#D8C6B0"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {beads.map((bead, i) => (
        <mesh
          key={i}
          position={bead.position}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[bead.size, 32, 32]} />
          <meshPhysicalMaterial
            color={bead.color}
            roughness={0.25}
            metalness={0.15}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
            reflectivity={0.5}
          />
        </mesh>
      ))}

      {/* A single dangling charm for asymmetry — the handmade signature */}
      <mesh position={[0, -RADIUS - 0.35, 0]}>
        <torusGeometry args={[0.12, 0.03, 16, 32]} />
        <meshStandardMaterial color="#C9A961" metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
}
