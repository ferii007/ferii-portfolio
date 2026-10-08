import { Euler, Quaternion } from 'three';

// Flight has its own relaxed pose; all rotations are relative to the rig's bind pose.
export function createFlightPose(scene) {
  const bones = {};
  scene.traverse((object) => { if (object.isBone) bones[object.name] = object; });
  const stopPose = Object.entries({
    UpperArmR: [0, 0.98, -0.4],
    ForearmR: [0, -0.08, -0.06],
    ForearmRollR: [Math.PI / 2, 0, 0],
    HandR: [0, -Math.PI / 2, 0],
    Finger1R: [0, 0.02, -0.18],
    Finger2R: [0, 0.02, 0],
    Finger3R: [0, 0.02, 0.18],
    Finger1TipR: [0, 0.025, 0],
    Finger2TipR: [0, 0.025, 0],
    Finger3TipR: [0, 0.025, 0],
    ThumbR: [0.1, -0.2, -0.38],
  }).map(([name, angles]) => [bones[name], new Quaternion().setFromEuler(new Euler(...angles))]);
  const rotate = (name, x, y, z) => bones[name].rotation.set(x, y, z);

  return (time, projecting = false, departure = { lift: 0, look: 0, turn: 0, boost: 0 }) => {
    const breathe = Math.sin(time * 1.6);
    const balance = Math.sin(time * 1.1);
    rotate('Root', 0, 0, 0);
    bones.Hips.position.set(0, 1.08, 0);
    rotate('Hips', -0.06, -0.04, 0.075);
    rotate('Waist', 0.02, 0.035, -0.055);
    rotate('Spine', 0.025, 0.025, -0.025);
    rotate('Neck', 0, 0, 0);
    rotate('Head', -0.045 - departure.lift * 0.1, 0.055 + balance * 0.025 + departure.look * (1 - departure.turn) * 0.24, -0.1);
    for (const side of ['L', 'R']) {
      const sign = side === 'L' ? 1 : -1;
      rotate(`Shoulder${side}`, 0, 0, 0);
      rotate(`ForearmRoll${side}`, 0, 0, 0);
      const armDrop = (side === 'L' ? 0.82 : 1.0) + breathe * 0.025 + departure.boost * 0.12;
      const elbowBend = side === 'L' ? 0.28 : 0.22;
      rotate(`UpperArm${side}`, 0, -sign * 0.12, -sign * armDrop);
      rotate(`Forearm${side}`, 0, 0, sign * elbowBend);
      // Roll the forearm first, then extend the wrist to level the palm toward the ground.
      rotate(`ForearmRoll${side}`, Math.PI / 2, 0, 0);
      rotate(`Hand${side}`, 0, sign * (armDrop - elbowBend), 0);
      for (let index = 1; index <= 3; index++) {
        rotate(`Finger${index}${side}`, 0, -sign * (0.025 + index * 0.015), sign * (2 - index) * 0.18);
        rotate(`Finger${index}Tip${side}`, 0, -sign * 0.055, 0);
      }
      rotate(`Thumb${side}`, 0.1, sign * 0.2, sign * 0.26);
      rotate(`Thigh${side}`, (side === 'L' ? -0.04 : -0.1) + sign * balance * 0.025, sign * 0.06, sign * 0.055);
      rotate(`Shin${side}`, (side === 'L' ? 0.3 : 0.5) - sign * balance * 0.025 + departure.boost * 0.16, 0, 0);
      rotate(`Foot${side}`, side === 'L' ? -0.18 : -0.32, 0, -sign * 0.025);
    }
    // Blend into an open stop gesture: straight elbow, upright fingers, palm facing out.
    for (const [bone, rotation] of stopPose) bone.quaternion.slerp(rotation, Number(projecting));
  };
}
