'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import RobotModel from './RobotModel';

export default function RobotCanvas({ expression, projecting, reducedMotion, hero, onReady, onProjectorPosition }) {
  return <Canvas className="robot-canvas" camera={{ position: [0, 1, 8], fov: 32 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.7]}>
    <ambientLight intensity={0.8} />
    <hemisphereLight args={['#e7f9ff', '#8293a8', 1]} />
    <directionalLight position={[4, 7, 6]} intensity={2.4} />
    <directionalLight position={[-5, 3, 1]} intensity={0.9} color="#8bdcff" />
    <Suspense fallback={null}><RobotModel expression={expression} projecting={projecting} reducedMotion={reducedMotion} hero={hero} onReady={onReady} onProjectorPosition={onProjectorPosition} /></Suspense>
  </Canvas>;
}
