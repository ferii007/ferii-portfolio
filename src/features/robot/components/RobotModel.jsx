'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const morphIndex = { happy: -1, deadpan: 0, 'side-eye': 1, panic: 2 };

export default function RobotModel({ expression, projecting, reducedMotion, hero, onReady, onProjectorPosition }) {
  const group = useRef();
  const lastProjection = useRef(0);
  const point = useMemo(() => new Vector3(), []);
  const { camera, gl } = useThree();
  const { scene, animations } = useGLTF('/models/feri-robot-rigged.glb');
  const bodyClips = useMemo(() => animations.filter((clip) => ['Idle', 'Wave', 'Project'].includes(clip.name)).map((clip) => {
    const copy = clip.clone();
    copy.tracks = copy.tracks.filter((track) => !/weights|morphTargetInfluences/i.test(track.name));
    return copy;
  }), [animations]);
  const { actions, mixer } = useAnimations(bodyClips, group);
  useEffect(() => {
    const next = actions[projecting ? 'Project' : hero ? 'Wave' : 'Idle'];
    if (!next) return;
    next.reset().play();
    if (reducedMotion) {
      mixer.setTime(0.5);
      next.setEffectiveTimeScale(0);
    } else {
      next.setEffectiveTimeScale(1);
      next.fadeIn(0.3);
    }
    return () => next.fadeOut(0.3);
  }, [actions, mixer, projecting, reducedMotion, hero]);
  useEffect(() => {
    const face = scene.getObjectByName('FaceExpressions');
    if (face?.morphTargetInfluences) {
      face.morphTargetInfluences.fill(0);
      if (morphIndex[expression] >= 0) face.morphTargetInfluences[morphIndex[expression]] = 1;
    }
  }, [scene, expression]);
  useEffect(() => { onReady?.(); }, [onReady]);
  useFrame(() => {
    if (!projecting || !onProjectorPosition || performance.now() - lastProjection.current < 100) return;
    const socket = scene.getObjectByName('ProjectorSocketL') ?? scene.getObjectByName('ProjectorSocket.L');
    if (!socket) return;
    socket.getWorldPosition(point).project(camera);
    const rect = gl.domElement.getBoundingClientRect();
    if (Number.isFinite(point.x) && Number.isFinite(point.y)) onProjectorPosition({ x: rect.left + (point.x + 1) * rect.width / 2, y: rect.top + (1 - point.y) * rect.height / 2 });
    lastProjection.current = performance.now();
  });
  return <group ref={group} position={[0, hero ? -1.92 : -1.45, 0]} scale={hero ? 1.12 : 0.85}><primitive object={scene} /></group>;
}

useGLTF.preload('/models/feri-robot-rigged.glb');
