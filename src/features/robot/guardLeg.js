import { Quaternion, Vector3 } from 'three';

// Keep the ankle planted while the pelvis shifts; the knee bends toward the toes.
export function createGuardLeg(scene, side) {
  const sign = side === 'L' ? 1 : -1;
  const thigh = scene.getObjectByName(`Thigh${side}`);
  const shin = scene.getObjectByName(`Shin${side}`);
  const foot = scene.getObjectByName(`Foot${side}`);
  const upperAxis = shin.position.clone().normalize();
  const lowerAxis = foot.position.clone().normalize();
  const upperLength = shin.position.length();
  const lowerLength = foot.position.length();
  const hip = new Vector3(), ankle = new Vector3(), knee = new Vector3();
  const direction = new Vector3(), bend = new Vector3(), scale = new Vector3();
  const rotation = new Quaternion(), parentRotation = new Quaternion();
  const toeRotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), sign * 0.18);

  return () => {
    scene.updateWorldMatrix(true, true);
    thigh.getWorldPosition(hip);
    ankle.set(sign * 0.6, 0.2, side === 'R' ? 0.32 : -0.16);
    scene.localToWorld(ankle);
    const size = scene.getWorldScale(scale).x;
    const upper = upperLength * size, lower = lowerLength * size;
    direction.subVectors(ankle, hip);
    const distance = Math.min(direction.length(), upper + lower - 0.001);
    direction.normalize();
    bend.set(sign * 0.22, 0, 1).transformDirection(scene.matrixWorld);
    bend.addScaledVector(direction, -bend.dot(direction)).normalize();
    const along = (upper * upper - lower * lower + distance * distance) / (2 * distance);
    const height = Math.sqrt(Math.max(0, upper * upper - along * along));
    knee.copy(hip).addScaledVector(direction, along).addScaledVector(bend, height);
    rotation.setFromUnitVectors(upperAxis, direction.subVectors(knee, hip).normalize());
    thigh.quaternion.copy(thigh.parent.getWorldQuaternion(parentRotation).invert()).multiply(rotation);
    thigh.updateMatrixWorld(true);
    rotation.setFromUnitVectors(lowerAxis, direction.subVectors(ankle, knee).normalize());
    shin.quaternion.copy(thigh.getWorldQuaternion(parentRotation).invert()).multiply(rotation);
    shin.updateMatrixWorld(true);
    rotation.copy(scene.getWorldQuaternion(parentRotation)).multiply(toeRotation);
    foot.quaternion.copy(shin.getWorldQuaternion(parentRotation).invert()).multiply(rotation);
  };
}
