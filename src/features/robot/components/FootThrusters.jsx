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
    float width = mix(0.38, 0.035, pow(down, 1.7));
    float radius = abs(vUv.x - 0.5) / width;
    float glow = exp(-radius * radius * 2.5);
    float fade = 1.0 - smoothstep(0.6, 1.0, down);
    float pulse = 0.94 + 0.06 * sin(time * 9.0 - down * 11.0);
    float core = exp(-radius * radius * 18.0) * (1.0 - down);
    vec3 color = mix(vec3(0.02, 0.63, 1.0), vec3(0.75, 1.0, 1.0), core);
    gl_FragColor = vec4(color, glow * fade * pulse * 0.85);
  }
`;

function Thruster({ foot, reducedMotion }) {
  const plume = useRef();
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);
  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.elapsedTime;
    plume.current.children.forEach((mesh) => { mesh.material.uniforms.time.value = time; });
    plume.current.scale.y = 1 + Math.sin(time * 7) * 0.045;
  });
  return createPortal(<group position={[0, -0.18, 0.1]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.105, 0.16, 32]} />
      <meshBasicMaterial color="#68efff" toneMapped={false} side={DoubleSide} />
    </mesh>
    <group ref={plume}>
      {[0, Math.PI / 2].map((rotation) => <mesh key={rotation} position={[0, -0.48, 0]} rotation={[0, rotation, 0]}>
        <planeGeometry args={[0.7, 0.96]} />
        <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
      </mesh>)}
    </group>
  </group>, foot);
}

export default function FootThrusters({ scene, reducedMotion }) {
  return ['L', 'R'].map((side) => <Thruster key={side} foot={scene.getObjectByName(`Foot${side}`)} reducedMotion={reducedMotion} />);
}
