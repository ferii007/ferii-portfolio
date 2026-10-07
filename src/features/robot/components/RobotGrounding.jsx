'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SPAWN_FLOOR } from './SpawnPortal';

const vertex = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const fragment = `
  varying vec2 vUv;
  uniform float opacity;
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = dot(p, p);
    float contact = exp(-r * 18.0) * 0.42 + exp(-r * 5.0) * 0.35;
    gl_FragColor = vec4(0.09, 0.18, 0.23, contact * opacity);
  }
`;

export default function RobotGrounding({ feet, spawn }) {
  const spots = useRef([]);
  const body = useRef();
  useFrame(() => {
    const opacity = Math.min(1, spawn.current.reveal * 4);
    body.current.material.opacity = opacity * 0.18;
    spots.current.forEach((spot, index) => {
      spot.position.set(feet.current[index].x, SPAWN_FLOOR + 0.003, feet.current[index].z);
      spot.material.uniforms.opacity.value = opacity;
    });
  });
  return <group>
    <mesh ref={body} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0.05, SPAWN_FLOOR + 0.001, 0.06]} renderOrder={1}>
      <circleGeometry args={[1.8, 64]} />
      <shadowMaterial color="#294657" transparent opacity={0} depthWrite={false} />
    </mesh>
    {[0.12, 0.48].map((angle, index) => <mesh key={index} ref={(node) => { spots.current[index] = node; }} rotation={[-Math.PI / 2, 0, angle]} renderOrder={2}>
      <planeGeometry args={[1.05, 1.35]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={{ opacity: { value: 0 } }} transparent depthWrite={false} />
    </mesh>)}
  </group>;
}
