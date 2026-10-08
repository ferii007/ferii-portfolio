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

  it('preserves the projector arm while maintaining the flight posture', () => {
    const upper = scene.getObjectByName('UpperArmL');
    const forearm = scene.getObjectByName('ForearmL');
    upper.rotation.set(0.2, 0.4, 0.6);
    forearm.rotation.set(0.1, 0.3, 0.5);
    const upperBefore = upper.quaternion.clone(), forearmBefore = forearm.quaternion.clone();
    flight(2, true);
    expect(upper.quaternion.angleTo(upperBefore)).toBeLessThan(0.00001);
    expect(forearm.quaternion.angleTo(forearmBefore)).toBeLessThan(0.00001);
    flight(2);
    expect(upper.quaternion.angleTo(upperBefore)).toBeGreaterThan(0.5);
  });
});
