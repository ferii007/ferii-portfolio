import { Euler, Matrix4, Quaternion, Vector3 } from 'three';

// Define elbow/wrist directions in shoulder space, then resolve local rotations.
// This avoids stacking large Euler offsets on top of the GLB's Idle pose.
export function createGuardArm(scene, side) {
  const sign = side === 'L' ? 1 : -1;
  const upper = scene.getObjectByName(`UpperArm${side}`);
  const forearm = scene.getObjectByName(`Forearm${side}`);
  const hand = scene.getObjectByName(`Hand${side}`);
  const axis = new Vector3(sign, 0, 0);
  const direction = new Vector3();
  const upperRotation = new Quaternion();
  const forearmRotation = new Quaternion();
  const inverse = new Quaternion();
  const palmRotation = new Quaternion();
  const palmX = new Vector3(), palmY = new Vector3(), palmZ = new Vector3();
  const basis = new Matrix4();
  const angles = new Euler();
  const fingers = [1, 2, 3, 4].map((number) => [scene.getObjectByName(`Finger${number}${side}`), scene.getObjectByName(`Finger${number}Tip${side}`)]);
  const thumb = scene.getObjectByName(`Thumb${side}`);

  return (guard, turn) => {
    const raised = side === 'R';
    direction.set(sign * (raised ? 0.4 : 0.7), -0.9, 0.3 + guard * 0.1).normalize();
    upperRotation.setFromUnitVectors(axis, direction);
    upper.quaternion.copy(upperRotation);
    direction.set(sign * ((raised ? -0.14 : 0.3) + turn * sign * 0.08), (raised ? 0.58 : -0.16) + (guard - 0.9) * 0.3, 1).normalize();
    forearmRotation.setFromUnitVectors(axis, direction);
    forearm.quaternion.copy(upperRotation).invert().multiply(forearmRotation);
    // One hand guards the chest; the other reaches lower and farther outward.
    palmX.set(sign * (raised ? 0.38 : 0.66), raised ? 0.9 : 0.7, 0.2).normalize().multiplyScalar(sign);
    palmZ.set(sign * 0.18, -0.12, 1).normalize();
    palmZ.addScaledVector(palmX, -palmZ.dot(palmX)).normalize();
    palmY.crossVectors(palmZ, palmX).normalize();
    palmRotation.setFromRotationMatrix(basis.makeBasis(palmX, palmY, palmZ));
    hand.quaternion.copy(inverse.copy(forearmRotation).invert()).multiply(palmRotation);
    for (let index = 0; index < fingers.length; index++) {
      const [finger, tip] = fingers[index];
      const spread = (index - 1.5) * 0.14;
      const curl = [0.14, 0.23, 0.32, 0.42][index] + (guard - 0.9) * 0.25;
      finger.quaternion.setFromEuler(angles.set(0, -sign * curl, sign * spread));
      tip.quaternion.setFromEuler(angles.set(0, -sign * (curl + 0.12), 0));
    }
    thumb.quaternion.setFromEuler(angles.set(-0.2, sign * 0.3, -sign * 0.22));
  };
}
