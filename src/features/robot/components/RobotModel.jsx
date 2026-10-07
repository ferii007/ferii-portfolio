'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Euler, Quaternion, Vector3 } from 'three';
import { createAlertFace } from '../createAlertFace';
import { createGuardArm } from '../guardArm';
import { createGuardLeg } from '../guardLeg';
import { searchPoseAt } from '../searchMotion';

const morphIndex = { happy: -1, deadpan: 0, 'side-eye': 1, panic: 2 };
const animatedBones = ['Hips', 'Waist', 'Spine', 'Neck', 'Head', 'ShoulderL', 'ShoulderR'];

export default function RobotModel({ expression, projecting, reducedMotion, hero, onReady, onProjectorPosition }) {
  const group = useRef();
  const heroPose = useRef(null);
  const alertFace = useRef(null);
  const lastProjection = useRef(0);
  const point = useMemo(() => new Vector3(), []);
  const deltaRotation = useMemo(() => new Quaternion(), []);
  const angles = useMemo(() => new Euler(), []);
  const { camera, gl } = useThree();
  const { scene, animations } = useGLTF('/models/feri-robot-rigged.glb');
  const guardArms = useMemo(() => [createGuardArm(scene, 'L'), createGuardArm(scene, 'R')], [scene]);
  const guardLegs = useMemo(() => [createGuardLeg(scene, 'L'), createGuardLeg(scene, 'R')], [scene]);
  const hipsRest = useMemo(() => new Vector3(0, 1.08, 0), []);
  const bodyClips = useMemo(() => animations.filter((clip) => ['Idle', 'Project'].includes(clip.name)).map((clip) => {
    const copy = clip.clone();
    copy.tracks = copy.tracks.filter((track) => !/weights|morphTargetInfluences/i.test(track.name));
    return copy;
  }), [animations]);
  const { actions, mixer } = useAnimations(bodyClips, group);
  useEffect(() => {
    const next = actions[projecting ? 'Project' : 'Idle'];
    if (!next) return;
    scene.getObjectByName('Hips').position.copy(hipsRest);
    for (const name of ['Waist', 'ShoulderL', 'ShoulderR', 'ForearmRollL', 'ForearmRollR']) scene.getObjectByName(name).quaternion.identity();
    next.reset().play();
    if (hero && !projecting) {
      Object.values(actions).forEach((action) => { if (action !== next) action.stop(); });
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
  }, [actions, mixer, projecting, reducedMotion, hero, scene, hipsRest]);
  useEffect(() => {
    const head = scene.getObjectByName('Head');
    const face = createAlertFace();
    head.add(face);
    alertFace.current = face;
    return () => {
      head.remove(face);
      face.geometry.dispose();
      face.material.map.dispose();
      face.material.dispose();
      alertFace.current = null;
      scene.getObjectByName('FaceExpressions').visible = true;
    };
  }, [scene]);
  useEffect(() => {
    const face = scene.getObjectByName('FaceExpressions');
    if (face?.morphTargetInfluences) {
      const showingAlert = hero && expression === 'happy';
      face.visible = !showingAlert;
      if (alertFace.current) alertFace.current.visible = showingAlert;
      face.morphTargetInfluences.fill(0);
      if (morphIndex[expression] >= 0) face.morphTargetInfluences[morphIndex[expression]] = 1;
    }
  }, [scene, expression, hero]);
  useEffect(() => { onReady?.(); }, [onReady]);
  useFrame(({ clock }) => {
    if (hero && !projecting && group.current) {
      const time = reducedMotion ? 0 : clock.elapsedTime;
      const target = searchPoseAt(time);
      const arms = searchPoseAt(reducedMotion ? 0 : time - 0.12);
      const body = searchPoseAt(reducedMotion ? 0 : time - 0.24);
      group.current.position.x = 0;
      group.current.position.y = -1.92;
      group.current.rotation.y = -0.3;
      group.current.rotation.z = 0;
      const pose = heroPose.current;
      const move = (name, x, y, z) => {
        const joint = pose?.[name];
        if (!joint) return;
        angles.set(x, y, z);
        joint.bone.quaternion.copy(joint.rotation).multiply(deltaRotation.setFromEuler(angles));
      };
      if (pose?.Hips) pose.Hips.bone.position.set(0.06 + body.weight * 0.3, hipsRest.y - 0.19 - body.crouch * 0.16, -0.04);
      move('Hips', -body.lean * 0.2, -0.08, 0.04 + body.weight * 0.3);
      move('Waist', body.lean * 0.4, 0.14 + body.torsoYaw * 0.5, -0.08 - body.weight * 0.4);
      move('Spine', body.lean * 0.5, 0.08 + body.torsoYaw * 0.4, -0.04 - body.weight * 0.5);
      move('Neck', -body.lean * 0.25, target.headYaw * 0.1, 0);
      move('Head', target.headPitch, target.headYaw * 0.65, -0.09 + target.headRoll * 0.6);
      const leftGuard = arms.guard + arms.headYaw * 0.3;
      const rightGuard = arms.guard - arms.headYaw * 0.3;
      move('ShoulderL', 0, -arms.headYaw * 0.16, (leftGuard - 0.9) * 0.12);
      move('ShoulderR', 0, -arms.headYaw * 0.16, -(rightGuard - 0.9) * 0.12);
      guardArms[0](leftGuard, arms.headYaw);
      guardArms[1](rightGuard, arms.headYaw);
      guardLegs.forEach((plant) => plant());
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
