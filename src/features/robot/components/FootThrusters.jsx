'use client';
import { useMemo, useRef } from 'react';
import { createPortal, useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  varying vec2 vUv;
  uniform float time;
  void main() {
    float down = 1.0 - vUv.y;
    float width = mix(0.42, 0.025, pow(down, 2.1));
    float radius = abs(vUv.x - 0.5) / width;
    float glow = exp(-radius * radius * 1.8);
    float fade = 1.0 - smoothstep(0.7, 1.0, down);
    float pulse = 0.93 + 0.07 * sin(time * 10.0 - down * 15.0);
    float core = exp(-radius * radius * 9.0) * (1.0 - down);
    vec3 color = mix(vec3(0.0, 0.57, 1.0), vec3(0.85, 1.0, 1.0), core);
    gl_FragColor = vec4(color, glow * fade * pulse);
  }
`;

function Thruster({ foot, reducedMotion }) {
  const plume = useRef();
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);
  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.elapsedTime;
    plume.current.children.forEach((mesh) => { mesh.material.uniforms.time.value = time; });
    plume.current.scale.y = 1 + Math.sin(time * 7) * 0.065;
  });
  return createPortal(<group position={[0, -0.18, 0.1]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.13, 0.21, 32]} />
      <meshBasicMaterial color="#68efff" toneMapped={false} side={DoubleSide} />
    </mesh>
    <pointLight color="#29dfff" intensity={1.2} distance={1.1} decay={2} />
    <group ref={plume}>
      {[0, Math.PI / 2].map((rotation) => <mesh key={rotation} position={[0, -0.675, 0]} rotation={[0, rotation, 0]}>
        <planeGeometry args={[1.05, 1.35]} />
        <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
      </mesh>)}
    </group>
  </group>, foot);
}

export default function FootThrusters({ scene, reducedMotion }) {
  return ['L', 'R'].map((side) => <Thruster key={side} foot={scene.getObjectByName(`Foot${side}`)} reducedMotion={reducedMotion} />);
}
