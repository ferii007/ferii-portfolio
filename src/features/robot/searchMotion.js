const poses = [
  { time: 0, headYaw: -0.12, headPitch: 0.05, headRoll: -0.07, torsoYaw: -0.14, lean: 0.12, crouch: 0.18, weight: -0.03, guard: 0.9, step: 0.22 },
  { time: 1.2, headYaw: -0.38, headPitch: 0.04, headRoll: -0.09, torsoYaw: -0.2, lean: 0.17, crouch: 0.22, weight: -0.08, guard: 1, step: 0.32 },
  { time: 2, headYaw: -0.38, headPitch: 0.04, headRoll: -0.09, torsoYaw: -0.2, lean: 0.17, crouch: 0.22, weight: -0.08, guard: 1, step: 0.32 },
  { time: 3.3, headYaw: 0.1, headPitch: 0.1, headRoll: 0.02, torsoYaw: 0.03, lean: 0.14, crouch: 0.19, weight: 0.02, guard: 0.94, step: 0.22 },
  { time: 4, headYaw: 0.1, headPitch: 0.1, headRoll: 0.02, torsoYaw: 0.03, lean: 0.14, crouch: 0.19, weight: 0.02, guard: 0.94, step: 0.22 },
  { time: 5.1, headYaw: 0.38, headPitch: -0.02, headRoll: 0.07, torsoYaw: 0.14, lean: 0.2, crouch: 0.28, weight: 0.09, guard: 1.06, step: 0.3 },
  { time: 6, headYaw: 0.38, headPitch: -0.02, headRoll: 0.07, torsoYaw: 0.14, lean: 0.2, crouch: 0.28, weight: 0.09, guard: 1.06, step: 0.3 },
  { time: 7.2, headYaw: -0.12, headPitch: 0.05, headRoll: -0.07, torsoYaw: -0.14, lean: 0.12, crouch: 0.18, weight: -0.03, guard: 0.9, step: 0.22 },
  { time: 8.3, headYaw: -0.12, headPitch: 0.05, headRoll: -0.07, torsoYaw: -0.14, lean: 0.12, crouch: 0.18, weight: -0.03, guard: 0.9, step: 0.22 },
];

export function searchPoseAt(seconds) {
  const time = ((seconds % 8.3) + 8.3) % 8.3;
  const endIndex = poses.findIndex((pose) => pose.time > time);
  const start = poses[endIndex - 1];
  const end = poses[endIndex];
  const progress = (time - start.time) / (end.time - start.time);
  const eased = progress * progress * (3 - 2 * progress);
  return Object.fromEntries(Object.keys(start).filter((key) => key !== 'time').map((key) => [key, start[key] + (end[key] - start[key]) * eased]));
}
