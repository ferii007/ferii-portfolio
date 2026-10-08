import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';
import { Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createFlightPose } from './flightPose';

let scene, flight;
beforeAll(async () => {
  const bytes = await readFile(new URL('../../../public/models/feri-robot-rigged.glb', import.meta.url));
  ({ scene } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), ''));
  flight = createFlightPose(scene);
});

describe('flying companion pose', () => {
  it('keeps relaxed elbows, downward palms, separated fingers and downward thrusters throughout a hover cycle', () => {
    const position = (name) => scene.getObjectByName(name).getWorldPosition(new Vector3());
    const rotation = (name) => scene.getObjectByName(name).getWorldQuaternion(new Quaternion());
    for (let time = 0; time < 12; time += 0.2) {
      flight(time);
      scene.updateMatrixWorld(true);
      for (const side of ['L', 'R']) {
        const shoulder = position(`UpperArm${side}`), elbow = position(`Forearm${side}`), wrist = position(`Hand${side}`);
        expect(shoulder.y - wrist.y).toBeGreaterThan(0.6);
        expect(elbow.clone().sub(shoulder).angleTo(wrist.clone().sub(elbow))).toBeLessThan(Math.PI / 6);
        expect(new Vector3(0, 0, 1).applyQuaternion(rotation(`Hand${side}`)).y).toBeLessThan(-0.98);
        expect(scene.getObjectByName(`Hand${side}`).quaternion.angleTo(new Quaternion())).toBeLessThan(50 * Math.PI / 180);
        expect(new Vector3(0, -1, 0).applyQuaternion(rotation(`Foot${side}`)).y).toBeLessThan(-0.95);
        for (let finger = 1; finger < 3; finger++) {
          expect(position(`Finger${finger}Tip${side}`).distanceTo(position(`Finger${finger + 1}Tip${side}`))).toBeGreaterThan(0.14);
        }
      }
      expect(position('FootL').distanceTo(position('FootR'))).toBeGreaterThan(0.5);
    }
  });

  it('extends the right arm with upright fingers and an outward palm, then returns to hover', () => {
    const position = (name) => scene.getObjectByName(name).getWorldPosition(new Vector3());
    const upper = scene.getObjectByName('UpperArmR');
    flight(2);
    const hoverRotation = upper.quaternion.clone();
    flight(2, true);
    scene.updateMatrixWorld(true);
    const shoulder = position('UpperArmR'), elbow = position('ForearmR'), wrist = position('HandR');
    const armDirection = wrist.clone().sub(elbow).normalize();
    const handRotation = scene.getObjectByName('HandR').getWorldQuaternion(new Quaternion());
    expect(elbow.clone().sub(shoulder).angleTo(armDirection)).toBeLessThan(0.15);
    expect(wrist.x).toBeLessThan(shoulder.x - 0.9);
    expect(new Vector3(0, 0, 1).applyQuaternion(handRotation).dot(armDirection)).toBeGreaterThan(0.98);
    expect(new Vector3(-1, 0, 0).applyQuaternion(handRotation).y).toBeGreaterThan(0.85);
    for (let finger = 1; finger < 3; finger++) {
      expect(position(`Finger${finger}TipR`).distanceTo(position(`Finger${finger + 1}TipR`))).toBeGreaterThan(0.14);
    }
    flight(2, 0.5);
    const halfway = upper.quaternion.clone();
    expect(halfway.angleTo(hoverRotation)).toBeGreaterThan(0.1);
    flight(2);
    expect(upper.quaternion.angleTo(hoverRotation)).toBeLessThan(0.00001);
  });
});
