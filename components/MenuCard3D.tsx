"use client";
import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function Card({ hovered, frontColor, backColor }: { hovered: boolean; frontColor: string; backColor: string }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    const target = hovered ? Math.PI : 0;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, target, 0.06);
  });

  return (
    <group ref={meshRef}>
      <RoundedBox args={[3, 4, 0.15]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color={frontColor} roughness={0.8} metalness={0.1} />
      </RoundedBox>
      {/* Front face accent */}
      <mesh position={[0, 0, 0.081]}>
        <planeGeometry args={[2.6, 3.6]} />
        <meshStandardMaterial color={frontColor} transparent opacity={0.3} />
      </mesh>
      {/* Back face */}
      <mesh position={[0, 0, -0.081]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.8, 3.8]} />
        <meshStandardMaterial color={backColor} />
      </mesh>
    </group>
  );
}

interface MenuCard3DProps {
  name: string;
  emoji?: string;
  image?: string;
  items: string[];
  frontColor?: string;
  backColor?: string;
  onCardClick?: () => void;
}

export default function MenuCard3D({ name, image, items, frontColor = "#2a1530", backColor = "#f3dfac", onCardClick }: MenuCard3DProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="h-[320px] md:h-[400px] md:cursor-pointer relative"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => { setFlipped(!flipped); onCardClick?.(); }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#f3dfac" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#91288c" />
        <Suspense fallback={null}>
          <Card hovered={flipped} frontColor={frontColor} backColor={backColor} />
        </Suspense>
      </Canvas>
      {/* Front overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none transition-opacity duration-300"
        style={{ opacity: flipped ? 0 : 1 }}
      >
        {image && (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 ring-2 ring-gold/20 shadow-lg">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
        )}
        <h3 className="font-heading text-xl md:text-2xl font-bold">{name}</h3>
      </div>
      {/* Back overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4 transition-opacity duration-300"
        style={{ opacity: flipped ? 1 : 0 }}
      >
        <h3 className="font-heading text-xl text-dark-card font-bold mb-3">{name}</h3>
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item} className="text-dark-card/80 text-sm">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
