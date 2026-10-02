'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Euler, Quaternion, Vector3 } from 'three';

const morphIndex = { happy: -1, deadpan: 0, 'side-eye': 1, panic: 2 };
const animatedBones = ['Spine', 'Head', 'UpperArm.L', 'UpperArm.R', 'Forearm.R', 'Hand.R'];

export default function RobotModel({ expression, projecting, reducedMotion, hero, onReady, onProjectorPosition }) {
  const group = useRef();
  const heroPose = useRef(null);
  const lastProjection = useRef(0);
  const point = useMemo(() => new Vector3(), []);
  const deltaRotation = useMemo(() => new Quaternion(), []);
  const angles = useMemo(() => new Euler(), []);
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
    if (hero && !projecting) {
      next.setEffectiveWeight(1);
      mixer.setTime(0.5);
      next.setEffectiveTimeScale(0);
      heroPose.current = Object.fromEntries(animatedBones.map((name) => {
        const bone = scene.getObjectByName(name);
        return [name, bone ? { bone, rotation: bone.quaternion.clone() } : null];
      }));
    } else if (reducedMotion) {
      heroPose.current = null;
      mixer.setTime(0.5);
      next.setEffectiveTimeScale(0);
    } else {
      heroPose.current = null;
      next.setEffectiveTimeScale(1);
      next.fadeIn(0.3);
    }
    return () => next.fadeOut(0.3);
  }, [actions, mixer, projecting, reducedMotion, hero, scene]);
  useEffect(() => {
    const face = scene.getObjectByName('FaceExpressions');
    if (face?.morphTargetInfluences) {
      face.morphTargetInfluences.fill(0);
      if (morphIndex[expression] >= 0) face.morphTargetInfluences[morphIndex[expression]] = 1;
    }
  }, [scene, expression]);
  useEffect(() => { onReady?.(); }, [onReady]);
  useFrame(({ clock }) => {
    if (hero && !projecting && group.current) {
      const t = clock.elapsedTime;
      const motion = reducedMotion ? 0 : 1;
      group.current.position.y = -1.92 + motion * 0.045 * Math.sin(t * 1.7);
      group.current.rotation.y = motion * 0.075 * Math.sin(t * 0.7);
      group.current.rotation.z = motion * 0.025 * Math.sin(t * 1.1);
      const pose = heroPose.current;
      const move = (name, x, y, z) => {
        const joint = pose?.[name];
        if (!joint) return;
        angles.set(x * motion, y * motion, z * motion);
        joint.bone.quaternion.copy(joint.rotation).multiply(deltaRotation.setFromEuler(angles));
      };
      move('Spine', 0.025 * Math.sin(t * 1.7), 0, 0.025 * Math.sin(t * 1.1));
      move('Head', 0.055 * Math.sin(t * 0.9 + 0.5), 0.14 * Math.sin(t * 0.7), 0.055 * Math.sin(t * 1.1 + 0.8));
      move('UpperArm.L', 0.025 * Math.sin(t * 1.3), 0, 0.08 * Math.sin(t * 1.2));
      move('UpperArm.R', 0.09 * Math.sin(t * 1.8), 0, 0.28 * Math.sin(t * 2.3));
      move('Forearm.R', 0, 0, 0.4 * Math.sin(t * 2.3 + 0.35));
      move('Hand.R', 0.045 * Math.sin(t * 2.3 + 0.7), 0, 0.45 * Math.sin(t * 2.3 + 0.7));
    }
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
