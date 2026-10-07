import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';
import { Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createGuardArm } from './guardArm';
import { searchPoseAt } from './searchMotion';

let model;
beforeAll(async () => {
  const bytes = await readFile(new URL('../../../public/models/feri-robot-rigged.glb', import.meta.url));
  model = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
});

describe('the shipped robot rig', () => {
  it('has movable waist/shoulders and preserves face morphs and companion clips', () => {
    for (const name of ['Waist', 'ShoulderL', 'ShoulderR']) expect(model.scene.getObjectByName(name).isBone).toBe(true);
    expect(model.scene.getObjectByName('FaceExpressions').morphTargetInfluences).toHaveLength(3);
    expect(model.animations.map((clip) => clip.name)).toEqual(expect.arrayContaining(['Idle', 'Project']));
    const head = model.scene.getObjectByName('Head').getWorldPosition(new Vector3());
    expect(head.y).toBeCloseTo(2.36, 4);
  });

  it('keeps elbows within a natural bend and fingers separated throughout the guard cycle', () => {
    for (const side of ['L', 'R']) {
      const pose = createGuardArm(model.scene, side);
      const position = (name) => model.scene.getObjectByName(`${name}${side}`).getWorldPosition(new Vector3());
      for (let time = 0; time < 8.3; time += 0.2) {
        const target = searchPoseAt(time);
        pose(target.guard + (side === 'L' ? 1 : -1) * target.headYaw * 0.3, target.headYaw);
        model.scene.updateMatrixWorld(true);
        const shoulder = position('UpperArm'), elbow = position('Forearm'), wrist = position('Hand');
        const bend = elbow.clone().sub(shoulder).angleTo(wrist.clone().sub(elbow));
        expect(bend).toBeLessThan(110 * Math.PI / 180);
        for (let finger = 1; finger < 4; finger++) {
          expect(position(`Finger${finger}Tip`).distanceTo(position(`Finger${finger + 1}Tip`))).toBeGreaterThan(0.09);
        }
        const palm = model.scene.getObjectByName(`Hand${side}`).getWorldQuaternion(new Quaternion());
        expect(new Vector3(0, 0, 1).applyQuaternion(palm).z).toBeGreaterThan(0.8);
      }
    }
  });
});
