// Flight has its own relaxed pose; all rotations are relative to the rig's bind pose.
export function createFlightPose(scene) {
  const bones = {};
  scene.traverse((object) => { if (object.isBone) bones[object.name] = object; });
  const rotate = (name, x, y, z) => bones[name].rotation.set(x, y, z);

  return (time, projecting = false) => {
    const breathe = Math.sin(time * 1.6);
    const balance = Math.sin(time * 1.1);
    rotate('Root', 0, 0, 0);
    bones.Hips.position.set(0, 1.08, 0);
    rotate('Hips', -0.04, 0, 0);
    rotate('Waist', 0.02, 0, 0);
    rotate('Spine', 0.02, 0, 0);
    rotate('Neck', 0, 0, 0);
    rotate('Head', -0.025, balance * 0.035, -0.035);
    for (const side of ['L', 'R']) {
      const sign = side === 'L' ? 1 : -1;
      rotate(`Shoulder${side}`, 0, 0, 0);
      rotate(`ForearmRoll${side}`, 0, 0, 0);
      // The left arm remains available for the skill projector animation.
      if (!projecting || side !== 'L') {
        rotate(`UpperArm${side}`, 0, -sign * 0.12, -sign * (0.88 + breathe * 0.025));
        rotate(`Forearm${side}`, 0, 0, sign * 0.18);
        rotate(`Hand${side}`, 0, sign * 0.08, -sign * 0.08);
        for (let index = 1; index <= 3; index++) {
          rotate(`Finger${index}${side}`, 0, -sign * (0.12 + index * 0.025), sign * (2 - index) * 0.22);
          rotate(`Finger${index}Tip${side}`, 0, -sign * 0.16, 0);
        }
        rotate(`Thumb${side}`, 0.1, sign * 0.2, sign * 0.26);
      }
      rotate(`Thigh${side}`, -0.14 + sign * balance * 0.025, sign * 0.06, sign * 0.055);
      rotate(`Shin${side}`, 0.26 - sign * balance * 0.025, 0, 0);
      rotate(`Foot${side}`, -0.04, 0, -sign * 0.025);
    }
  };
}
