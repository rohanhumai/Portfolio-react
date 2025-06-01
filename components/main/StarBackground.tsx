"use client";

import React, { useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Preload } from "@react-three/drei";
import { inSphere } from "maath/random";
import * as THREE from "three";

const StarBackground = () => {
  const ref = useRef<THREE.Points | null>(null);

  // Generate positions only once
  const [positions] = useState(() =>
    inSphere(new Float32Array(15000), { radius: 1.2 })
  );

  // Memoize geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  // Animate rotation
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <points ref={ref} geometry={geometry} rotation={[0, 0, Math.PI / 4]}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.002}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const StarsCanvas = () => (
  <div className="w-full h-auto fixed inset-0 z-[20] pointer-events-none">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarBackground />
        <Preload all />
      </Suspense>
    </Canvas>
  </div>
);

export default StarsCanvas;
