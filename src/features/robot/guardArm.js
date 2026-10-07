import { Euler, Matrix4, Quaternion, Vector3 } from 'three';

// A shared hinge plane bends the elbow; forearm roll carries palm orientation.
export function createGuardArm(scene, side) {
  const sign = side === 'L' ? 1 : -1;
  const upper = scene.getObjectByName(`UpperArm${side}`);
  const forearm = scene.getObjectByName(`Forearm${side}`);
  const roll = scene.getObjectByName(`ForearmRoll${side}`);
  const hand = scene.getObjectByName(`Hand${side}`);
  const axis = new Vector3(1, 0, 0);
  const upperDirection = new Vector3(), forearmDirection = new Vector3();
  const hinge = new Vector3(), frameX = new Vector3(), frameY = new Vector3();
  const rollNormal = new Vector3(), cross = new Vector3();
  const upperRotation = new Quaternion();
  const forearmRotation = new Quaternion();
  const inverse = new Quaternion();
  const palmRotation = new Quaternion();
  const palmX = new Vector3(), palmY = new Vector3(), palmZ = new Vector3();
  const basis = new Matrix4();
  const angles = new Euler();
  const fingers = [1, 2, 3].map((number) => [scene.getObjectByName(`Finger${number}${side}`), scene.getObjectByName(`Finger${number}Tip${side}`)]);
  const thumb = scene.getObjectByName(`Thumb${side}`);

  return (guard, turn) => {
    const raised = side === 'R';
    upperDirection.set(sign * (raised ? 0.78 : 0.65), -0.9, (raised ? 0.49 : 0.2) + guard * 0.1).normalize();
    forearmDirection.set((raised ? 0.65 : 0.8) + turn * 0.06, (raised ? 0.3 : 0.22) + (guard - 0.9) * 0.15, 0.65).normalize();
    hinge.crossVectors(upperDirection, forearmDirection).normalize().multiplyScalar(sign);
    frameX.copy(upperDirection).multiplyScalar(sign);
    frameY.crossVectors(hinge, frameX);
    upperRotation.setFromRotationMatrix(basis.makeBasis(frameX, frameY, hinge));
    upper.quaternion.copy(upperRotation);
    frameX.copy(forearmDirection).multiplyScalar(sign);
    frameY.crossVectors(hinge, frameX);
    forearmRotation.setFromRotationMatrix(basis.makeBasis(frameX, frameY, hinge));
    forearm.quaternion.copy(upperRotation).invert().multiply(forearmRotation);
    // Both hands slope upward; the raised hand turns inward toward the chest.
    palmX.set(raised ? 0.62 : 0.65, raised ? 0.72 : 0.65, 0.35).normalize().multiplyScalar(sign);
    palmZ.set(raised ? 0.5 : 0.18, -0.12, 1).normalize();
    palmZ.addScaledVector(palmX, -palmZ.dot(palmX)).normalize();
    palmY.crossVectors(palmZ, palmX).normalize();
    palmRotation.setFromRotationMatrix(basis.makeBasis(palmX, palmY, palmZ));
    rollNormal.copy(palmZ).addScaledVector(frameX, -palmZ.dot(frameX)).normalize();
    const twist = Math.atan2(cross.crossVectors(hinge, rollNormal).dot(frameX), hinge.dot(rollNormal));
    roll.quaternion.setFromAxisAngle(axis, twist);
    hand.quaternion.copy(inverse.copy(forearmRotation).multiply(roll.quaternion).invert()).multiply(palmRotation);
    for (let index = 0; index < fingers.length; index++) {
      const [finger, tip] = fingers[index];
      const spread = (1 - index) * 0.1;
      const curl = [0.25, 0.36, 0.45][index] + (raised ? 0.04 : 0) + (guard - 0.9) * 0.18;
      finger.quaternion.setFromEuler(angles.set(0, -sign * curl, sign * spread));
      tip.quaternion.setFromEuler(angles.set(0, -sign * (curl * 0.7 + 0.1), 0));
    }
    thumb.quaternion.setFromEuler(angles.set(0.12, sign * 0.24, -sign * 0.12));
  };
}
