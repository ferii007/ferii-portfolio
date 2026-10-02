'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import RobotModel from './RobotModel';

export default function RobotCanvas({ expression, projecting, onReady, onProjectorPosition }) {
  return <Canvas className="robot-canvas" camera={{ position: [0, 1, 8], fov: 32 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.7]}>
    <ambientLight intensity={1.5} />
    <directionalLight position={[4, 7, 6]} intensity={3} />
    <directionalLight position={[-5, 3, 1]} intensity={1.1} color="#c7edff" />
    <Suspense fallback={null}><RobotModel expression={expression} projecting={projecting} onReady={onReady} onProjectorPosition={onProjectorPosition} /></Suspense>
  </Canvas>;
}
