"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SpiceParticles() {
  const count = 200;
  const ref = useRef<THREE.Points>(null!);

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#f3dfac"), // gold
      new THREE.Color("#ec1164"), // pink
      new THREE.Color("#c9a84c"), // dark gold
      new THREE.Color("#91288c"), // purple
      new THREE.Color("#ffddaa"), // warm light
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 16 - 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sz[i] = Math.random() * 0.05 + 0.01;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, sz, col];
  }, []);

  useFrame((state, delta) => {
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += delta * (0.12 + sizes[i] * 2.5);
      posArr[i * 3] += Math.sin(time * 0.4 + i * 0.8) * delta * 0.03;
      posArr[i * 3 + 2] += Math.cos(time * 0.25 + i * 1.2) * delta * 0.02;
      if (posArr[i * 3 + 1] > 10) {
        posArr[i * 3 + 1] = -6;
        posArr[i * 3] = (Math.random() - 0.5) * 14;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = Math.sin(time * 0.08) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        transparent
        opacity={0.5}
        sizeAttenuation
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ pointer }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.08, 0.02);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.04, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      <SpiceParticles />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
