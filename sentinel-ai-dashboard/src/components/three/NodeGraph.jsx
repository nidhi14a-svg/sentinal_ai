import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function NodeGraph() {
  const groupRef = useRef();

  // Create 15 nodes with random 3D positions and colors
  const nodes = useMemo(() => {
    const temp = [];
    const colors = ['#ff1a3c', '#00e5ff', '#39ff8a', '#9d4dff']; // critical, scanning, secured, system
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 6;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 6;
      const radius = 0.1 + Math.random() * 0.12;
      const color = colors[Math.floor(Math.random() * colors.length)];
      temp.push({ x, y, z, radius, color, originalPos: new THREE.Vector3(x, y, z) });
    }
    return temp;
  }, []);

  // Compute lines between nodes that are close to each other
  const linePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].originalPos.distanceTo(nodes[j].originalPos);
        if (dist < 3.5) { // connect nodes within range
          points.push(nodes[i].x, nodes[i].y, nodes[i].z);
          points.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    return new Float32Array(points);
  }, [nodes]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    // Slowly rotate the entire constellation
    groupRef.current.rotation.y = time * 0.08;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Render node spheres */}
        {nodes.map((node, i) => (
          <mesh key={i} position={[node.x, node.y, node.z]}>
            <sphereGeometry args={[node.radius, 16, 16]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.9}
            />
            {/* Inner glow element */}
            <mesh scale={[1.4, 1.4, 1.4]}>
              <sphereGeometry args={[node.radius, 8, 8]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={0.35}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </mesh>
        ))}

        {/* Render connection lines */}
        {linePoints.length > 0 && (
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={linePoints.length / 3}
                array={linePoints}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#00e5ff"
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
        )}
      </group>
    </Float>
  );
}