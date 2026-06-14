import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function AICore({ color = '#ff1a3c', speed = 1, size = 1 }) {
  const pointsRef = useRef();
  const particleCount = 2000;

  // Generate random positions on a sphere
  const [positions, initialDistances] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const dists = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.8 + Math.random() * 0.4; // shell thickness

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      dists[i] = r;
    }
    return [pos, dists];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime() * speed;

    // Rotate the particle core
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = time * 0.02;

    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Original coordinates
      const origX = positions[idx];
      const origY = positions[idx + 1];
      const origZ = positions[idx + 2];

      // Add sinusoidal morphing displacement
      const wave = Math.sin(time * 2 + initialDistances[i] * 5) * 0.15;
      
      posAttr.array[idx] = origX * (1 + wave);
      posAttr.array[idx + 1] = origY * (1 + wave);
      posAttr.array[idx + 2] = origZ * (1 + wave);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Outer float container */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color={color}
            size={0.06 * size}
            sizeAttenuation={true}
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Outer glowing wireframe sphere */}
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial
            color={color}
            wireframe={true}
            transparent={true}
            opacity={0.07}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>

      {/* Floating ambient sparkles around the core */}
      <Sparkles count={50} scale={4} size={1.5} speed={0.4} color={color} />
    </group>
  );
}