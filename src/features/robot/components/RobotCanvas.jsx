'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense, useCallback, useRef } from 'react';
import RobotModel from './RobotModel';
import SpawnPortal from './SpawnPortal';
import RobotGrounding from './RobotGrounding';
import { Vector3 } from 'three';

export default function RobotCanvas({ expression, projecting, reducedMotion, hero, onReady, onProjectorPosition }) {
  const spawn = useRef({ age: 0, reveal: 0 });
  const feet = useRef([new Vector3(), new Vector3()]);
  const onSpawnFrame = useCallback((age, reveal) => { spawn.current.age = age; spawn.current.reveal = reveal; }, []);
  const onFeetPosition = useCallback((left, right) => { feet.current[0].copy(left); feet.current[1].copy(right); }, []);
  return <Canvas className="robot-canvas" shadows={hero ? 'variance' : false} camera={{ position: [0, 1, 8], fov: 32 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => { gl.localClippingEnabled = true; }} dpr={[1, hero ? 1.7 : 1.5]}>
    <ambientLight intensity={0.8} />
    <hemisphereLight args={['#e7f9ff', '#8293a8', 1]} />
    <directionalLight position={[4, 7, 6]} intensity={2.4} castShadow={hero} shadow-mapSize={[1024, 1024]} shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={4} shadow-camera-bottom={-3} shadow-camera-near={1} shadow-camera-far={18} shadow-bias={-0.0001} shadow-normalBias={0.015} shadow-radius={10} shadow-blurSamples={12} />
    <directionalLight position={[-5, 3, 1]} intensity={0.9} color="#8bdcff" />
    <Suspense fallback={null}>
      <SpawnPortal onSpawnFrame={onSpawnFrame} reducedMotion={reducedMotion} companion={!hero} />
      <RobotModel spawn={spawn} onFeetPosition={onFeetPosition} expression={expression} projecting={projecting} reducedMotion={reducedMotion} hero={hero} onReady={onReady} onProjectorPosition={onProjectorPosition} />
      {hero && <RobotGrounding feet={feet} spawn={spawn} />}
    </Suspense>
  </Canvas>;
}
