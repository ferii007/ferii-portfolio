// Rebuild the portfolio robot from its original GLB; no external service required.
import { readFile, writeFile } from 'node:fs/promises';
import { Bone, CylinderGeometry, Mesh, MeshStandardMaterial, Skeleton, SphereGeometry, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => { this.result = result; this.onloadend?.(); });
  }
};

const source = await readFile(new URL('../assets/robot/feri-robot-original.glb', import.meta.url));
const { scene, animations } = await new GLTFLoader().parseAsync(source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength), '');
const meshes = [];
scene.traverse((object) => { if (object.isSkinnedMesh) meshes.push(object); });
const bones = meshes[0].skeleton.bones;
const byName = Object.fromEntries(bones.map((bone) => [bone.name, bone]));

// Increase clearance at the waist while preserving the rigid ceramic panels.
for (const mesh of meshes) {
  if (mesh.name === 'FaceExpressions') continue;
  const geometry = mesh.geometry;
  const positions = geometry.attributes.position;
  const joints = geometry.attributes.skinIndex;
  for (let i = 0; i < positions.count; i++) {
    const bone = bones[joints.getX(i)].name;
    let x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    if (bone === 'Spine') {
      const taper = Math.max(0, Math.min(1, (y - 1.36) / 0.62));
      x *= 0.72 + 0.28 * taper;
      z *= 0.86 + 0.14 * taper;
    }
    if (bone === 'Hips') {
      x *= 0.86;
      y = 1.17 + (y - 1.17) * 0.8;
    }
    if (/^Hand[LR]$/.test(bone)) {
      if (mesh.material.name.includes('Ceramic')) {
        y = 2.02 + (y - 2.02) * 1.7;
        z *= 0.65;
      } else if (/cobalt|LED/.test(mesh.material.name)) z -= 0.06;
    }
    if (/^Thumb[LR]$/.test(bone)) {
      y -= 0.04;
      z += 0.04;
    }
    const finger = bone.match(/^Finger([1-4])(Tip)?([LR])$/);
    if (finger) {
      const number = Number(finger[1]) - 1;
      const side = finger[3] === 'L' ? 1 : -1;
      const lengths = [0.78, 1.04, 1, 0.84];
      const baseZ = [-0.14, -0.047, 0.047, 0.14][number];
      x = side * 1.86 + (x - side * 1.86) * lengths[number];
      const oldY = y;
      y = 2.02 + z + baseZ * 0.38;
      z = oldY - 2.02;
    }
    positions.setXYZ(i, x, y, z);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
}

for (const side of ['L', 'R']) {
  const sign = side === 'L' ? 1 : -1;
  for (let number = 1; number <= 4; number++) {
    const finger = byName[`Finger${number}${side}`];
    finger.position.y = finger.position.z * 1.38;
    finger.position.z = 0;
    byName[`Finger${number}Tip${side}`].position.x *= [0.78, 1.04, 1, 0.84][number - 1];
  }
  const thumb = byName[`Thumb${side}`];
  thumb.position.y -= 0.04;
  thumb.position.z += 0.04;
  const thumbHinge = new Mesh(new SphereGeometry(0.055, 16, 12), new MeshStandardMaterial({ color: '#344351', metalness: 0.45, roughness: 0.35 }));
  thumbHinge.name = `ThumbHinge${side}`;
  thumb.add(thumbHinge);
  const upperArm = byName[`UpperArm${side}`];
  const shoulder = new Bone();
  shoulder.name = `Shoulder${side}`;
  shoulder.position.set(sign * 0.36, upperArm.position.y, 0);
  upperArm.parent.add(shoulder);
  upperArm.position.sub(shoulder.position);
  shoulder.add(upperArm);
  bones.push(shoulder);
}

const waist = new Bone();
waist.name = 'Waist';
waist.position.set(0, 0.31, 0);
byName.Hips.add(waist);
byName.Spine.position.sub(waist.position);
waist.add(byName.Spine);
bones.push(waist);
const abdomen = new Mesh(new CylinderGeometry(0.255, 0.28, 0.19, 32), new MeshStandardMaterial({ color: '#263749', metalness: 0.45, roughness: 0.38 }));
abdomen.name = 'FlexibleWaist';
abdomen.position.y = -0.02;
waist.add(abdomen);

scene.updateMatrixWorld(true);
const skeleton = new Skeleton(bones);
skeleton.calculateInverses();
for (const mesh of meshes) mesh.bind(skeleton, mesh.bindMatrix);

// Validate the edited hierarchy and preserved head bind position before exporting.
for (const name of ['Finger1L', 'Finger4R', 'Waist', 'ShoulderL', 'ShoulderR']) {
  if (!scene.getObjectByName(name)) throw new Error(`Missing required joint: ${name}`);
}
const height = byName.Head.getWorldPosition(new Vector3()).y;
if (Math.abs(height - 2.36) > 0.001) throw new Error('Rig refinement changed the head bind position');
const output = await new GLTFExporter().parseAsync(scene, { binary: true, animations, onlyVisible: false });
await writeFile(new URL('../public/models/feri-robot-rigged.glb', import.meta.url), Buffer.from(output));
console.log(`Refined robot: ${bones.length} joints, ${output.byteLength} bytes`);
