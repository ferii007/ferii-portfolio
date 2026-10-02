'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Euler, Quaternion, Vector3 } from 'three';
import { createAlertFace } from '../createAlertFace';
import { searchPoseAt } from '../searchMotion';

const morphIndex = { happy: -1, deadpan: 0, 'side-eye': 1, panic: 2 };
const animatedBones = ['Hips', 'Spine', 'Neck', 'Head', 'UpperArmL', 'ForearmL', 'HandL', 'UpperArmR', 'ForearmR', 'HandR', 'ThighL', 'ShinL', 'FootL', 'ThighR', 'ShinR', 'FootR'];

export default function RobotModel({ expression, projecting, reducedMotion, hero, onReady, onProjectorPosition }) {
  const group = useRef();
  const heroPose = useRef(null);
  const alertFace = useRef(null);
  const lastProjection = useRef(0);
  const point = useMemo(() => new Vector3(), []);
  const otherFoot = useMemo(() => new Vector3(), []);
  const deltaRotation = useMemo(() => new Quaternion(), []);
  const angles = useMemo(() => new Euler(), []);
  const { camera, gl } = useThree();
  const { scene, animations } = useGLTF('/models/feri-robot-rigged.glb');
  const bodyClips = useMemo(() => animations.filter((clip) => ['Idle', 'Project'].includes(clip.name)).map((clip) => {
    const copy = clip.clone();
    copy.tracks = copy.tracks.filter((track) => !/weights|morphTargetInfluences/i.test(track.name));
    return copy;
  }), [animations]);
  const { actions, mixer } = useAnimations(bodyClips, group);
  useEffect(() => {
    const next = actions[projecting ? 'Project' : 'Idle'];
    if (!next) return;
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
  }, [actions, mixer, projecting, reducedMotion, hero, scene]);
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
      group.current.position.x = body.weight * 0.3;
      group.current.position.y = -1.92;
      group.current.rotation.y = -0.08;
      group.current.rotation.z = 0;
      const pose = heroPose.current;
      const move = (name, x, y, z) => {
        const joint = pose?.[name];
        if (!joint) return;
        angles.set(x, y, z);
        joint.bone.quaternion.copy(joint.rotation).multiply(deltaRotation.setFromEuler(angles));
      };
      move('Hips', -body.lean * 0.25, -body.torsoYaw * 0.15, body.weight * 0.9);
      move('Spine', body.lean * 1.2, body.torsoYaw * 1.2, -body.weight * 2);
      move('Neck', -body.lean * 0.25, target.headYaw * 0.1, 0);
      move('Head', target.headPitch, target.headYaw * 0.65, target.headRoll);
      const leftGuard = arms.guard + arms.headYaw * 0.3;
      const rightGuard = arms.guard - arms.headYaw * 0.3;
      move('UpperArmL', leftGuard * 0.26, -leftGuard * 0.8, leftGuard * 0.5);
      move('ForearmL', 0, 0, leftGuard * 1.5);
      move('HandL', -leftGuard * 0.18, 0, -leftGuard * 0.12);
      move('UpperArmR', rightGuard * 0.26, rightGuard * 1.35, -rightGuard * 0.5);
      move('ForearmR', 0, 0, -rightGuard * 1.7);
      move('HandR', -rightGuard * 0.18, 0, rightGuard * 0.12);
      move('ThighL', body.step * 0.8 + body.crouch * 1.1, 0, body.step * 1.1);
      move('ShinL', -body.step * 1.4 - body.crouch * 1.7, 0, -body.step * 0.35);
      move('FootL', body.step * 0.6 + body.crouch * 0.6, 0, 0);
      move('ThighR', -body.step * 1.2 - body.crouch * 1.1, 0, -body.step * 1.1);
      move('ShinR', body.step * 1.6 + body.crouch * 1.7, 0, body.step * 0.35);
      move('FootR', -body.step * 0.4 - body.crouch * 0.6, 0, 0);
      if (pose?.FootL?.bone && pose?.FootR?.bone) {
        group.current.updateMatrixWorld(true);
        const leftFootY = pose.FootL.bone.getWorldPosition(point).y;
        const rightFootY = pose.FootR.bone.getWorldPosition(otherFoot).y;
        group.current.position.y += -1.92 + 1.12 * 0.2 - Math.min(leftFootY, rightFootY);
      }
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
