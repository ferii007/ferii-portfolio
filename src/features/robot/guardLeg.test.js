import { readFile } from 'node:fs/promises';
import { expect, it } from 'vitest';
import { Group, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createGuardLeg } from './guardLeg';
import { searchPoseAt } from './searchMotion';

it('keeps both soles level and ankles planted through the full weight shift', async () => {
  const bytes = await readFile(new URL('../../../public/models/feri-robot-rigged.glb', import.meta.url));
  const { scene } = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const group = new Group();
  group.add(scene);
  group.position.y = -1.92;
  group.rotation.y = -0.3;
  group.scale.setScalar(1.12);
  const hips = scene.getObjectByName('Hips');
  const legs = ['L', 'R'].map((side) => ({ side, plant: createGuardLeg(scene, side) }));
  for (let time = 0; time < 8.3; time += 0.1) {
    const pose = searchPoseAt(time);
    hips.position.set(0.06 + pose.weight * 0.3, 1.08 - 0.19 - pose.crouch * 0.16, -0.04);
    hips.rotation.set(-pose.lean * 0.2, -0.08, 0.04 + pose.weight * 0.3);
    for (const { side, plant } of legs) {
      plant();
      const foot = scene.getObjectByName(`Foot${side}`);
      const ankle = scene.worldToLocal(foot.getWorldPosition(new Vector3()));
      const target = new Vector3(side === 'L' ? 0.6 : -0.6, 0.2, side === 'R' ? 0.32 : -0.16);
      expect(ankle.distanceTo(target)).toBeLessThan(0.0001);
      const soleUp = new Vector3(0, 1, 0).applyQuaternion(foot.getWorldQuaternion(new Quaternion()));
      expect(soleUp.y).toBeCloseTo(1, 5);
    }
  }
});
