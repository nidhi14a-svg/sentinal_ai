import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function RadarSweep() {
  const sweepRef = useRef();
  const blipsRef = useRef();

  // Create static blip positions
  const blips = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.random() * 1.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      temp.push({ x, z, intensity: Math.random() });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate sweep plane
    if (sweepRef.current) {
      sweepRef.current.rotation.y = -time * 1.5;
    }

    // Pulse blips
    if (blipsRef.current) {
      const children = blipsRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const material = children[i].material;
        if (material) {
          material.opacity = (Math.sin(time * 3 + i) + 1) * 0.4 + 0.1;
        }
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* 3D Polar Grid Helper */}
      <polarGridHelper
        args={[3, 16, 4, 64, '#ff1a3c', 'rgba(0, 229, 255, 0.2)']}
        rotation={[0, 0, 0]}
      />

      {/* Rotating Radar Sweep Slice */}
      <mesh ref={sweepRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[0, 3, 32, 1, 0, Math.PI / 4]} />
        <meshBasicMaterial
          color="#ff1a3c"
          side={THREE.DoubleSide}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Crosshair lines */}
      <gridHelper args={[6, 2, '#ff1a3c', '#ff1a3c']} position={[0, 0.01, 0]} />

      {/* Blips / Signals detected */}
      <group ref={blipsRef}>
        {blips.map((blip, i) => (
          <mesh key={i} position={[blip.x, 0.02, blip.z]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial
              color="#ff1a3c"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}