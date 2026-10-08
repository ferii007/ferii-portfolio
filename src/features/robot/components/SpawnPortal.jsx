'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';
import { spawnTiming } from '../spawnTiming';

export const SPAWN_FLOOR = -1.772;
export const COMPANION_SPAWN_FLOOR = -1.1;
export const COMPANION_SPAWN_HEIGHT = 3.5;

const vertex = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const beamFragment = `
  varying vec2 vUv;
  uniform float time;
  uniform float power;
  void main() {
    float fade = pow(1.0 - vUv.y, 1.7) * smoothstep(0.0, 0.12, vUv.y);
    float threads = pow(0.5 + 0.5 * sin(vUv.x * 100.0 + time * 0.7), 10.0);
    float wave = pow(0.5 + 0.5 * sin(vUv.y * 32.0 - time * 3.0), 8.0);
    gl_FragColor = vec4(0.08, 0.65, 0.87, fade * power * (0.16 + threads * 0.07 + wave * 0.06));
  }
`;
const floorFragment = `
  varying vec2 vUv;
  uniform float power;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float glow = pow(max(0.0, 1.0 - r), 2.0);
    gl_FragColor = vec4(0.04, 0.65, 0.85, glow * power * 0.5);
  }
`;

export default function SpawnPortal({ onSpawnFrame, reducedMotion, companion = false }) {
  const portal = useRef();
  const floorY = companion ? COMPANION_SPAWN_FLOOR : SPAWN_FLOOR;
  const height = companion ? COMPANION_SPAWN_HEIGHT : 4.15;
  const outer = useRef(), inner = useRef(), scan = useRef();
  const particles = useRef(), beam = useRef(), floor = useRef();
  const started = useRef(null);
  const dots = useMemo(() => {
    const positions = new Float32Array(36 * 3);
    for (let i = 0; i < 36; i++) {
      const angle = i * 2.39996;
      const radius = 0.65 + (i % 5) * 0.095;
      positions.set([Math.cos(angle) * radius, (i * 0.618) % 1, Math.sin(angle) * radius], i * 3);
    }
    return positions;
  }, []);
  const uniforms = useMemo(() => ({ time: { value: 0 }, power: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (started.current === null) started.current = clock.elapsedTime;
    const age = reducedMotion ? 3 : clock.elapsedTime - started.current;
    const { progress, reveal, fade: fadeOut, materializing } = spawnTiming(age, companion);
    onSpawnFrame(age, reveal);
    portal.current.visible = !companion || (!reducedMotion && fadeOut > 0);
    if (companion && !portal.current.visible) return;
    const pulse = reducedMotion ? 0 : Math.sin(age * 1.7) * 0.08;
    const power = materializing ? Math.min(1, age / 0.1) * 1.8 : 0.65 + pulse;
    beam.current.material.uniforms.time.value = reducedMotion ? 0 : age;
    beam.current.material.uniforms.power.value = power * fadeOut;
    floor.current.material.uniforms.power.value = power * fadeOut;
    outer.current.rotation.z = reducedMotion ? 0 : age * 0.16;
    inner.current.rotation.z = reducedMotion ? 0 : -age * 0.23;
    outer.current.material.opacity = (0.48 + power * 0.16) * fadeOut;
    inner.current.children.forEach((segment) => { segment.material.opacity = (0.25 + power * 0.1) * fadeOut; });
    scan.current.visible = !reducedMotion && progress > 0 && progress < 1;
    scan.current.position.y = floorY + reveal * height;
    scan.current.material.opacity = Math.sin(progress * Math.PI) * 0.55;
    const positions = particles.current.geometry.attributes.position;
    for (let i = 0; i < 36; i++) {
      const rise = reducedMotion ? dots[i * 3 + 1] : (dots[i * 3 + 1] + age * 0.16) % 1;
      positions.setY(i, rise * (height - 0.35));
    }
    positions.needsUpdate = true;
    particles.current.material.opacity = (reducedMotion ? 0.2 : 0.2 + power * 0.16) * fadeOut;
  });

  return <group ref={portal} position={[0.05, 0, 0.06]}>
    <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY - 0.005, 0]}>
      <circleGeometry args={[1.46, 64]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={floorFragment} uniforms={uniforms} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
    <mesh ref={outer} rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]}>
      <torusGeometry args={[1.1, 0.014, 8, 96]} />
      <meshBasicMaterial color="#11a6da" transparent opacity={0.65} depthWrite={false} />
    </mesh>
    {!companion && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY - 0.003, 0]}>
      <torusGeometry args={[1.1, 0.055, 8, 96]} />
      <meshBasicMaterial color="#65d9ef" transparent opacity={0.1} depthWrite={false} />
    </mesh>}
    <group ref={inner} rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY + 0.008, 0]}>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} rotation={[0, 0, i * Math.PI / 8]}>
        <torusGeometry args={[0.94, 0.012, 6, 12, Math.PI / 12]} />
        <meshBasicMaterial color="#29b8e5" transparent opacity={0.5} depthWrite={false} />
      </mesh>)}
      <mesh><torusGeometry args={[0.77, 0.009, 6, 80]} /><meshBasicMaterial color="#55c6e7" transparent opacity={0.5} depthWrite={false} /></mesh>
    </group>
    <mesh ref={beam} position={[0, floorY + (companion ? height / 2 : 2.05), 0]}>
      <cylinderGeometry args={[0.65, 1.08, companion ? height : 4.1, 64, 1, true]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={beamFragment} uniforms={uniforms} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
    <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.06, 0.018, 8, 96]} />
      <meshBasicMaterial color="#33c7ed" transparent depthWrite={false} />
    </mesh>
    <points ref={particles} position={[0, floorY, 0]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[dots.slice(), 3]} /></bufferGeometry>
      <pointsMaterial color="#2bb7df" size={0.035} transparent opacity={0.4} depthWrite={false} />
    </points>
  </group>;
}
