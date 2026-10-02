const poses = [
  { time: 0, headYaw: 0, headPitch: 0, headRoll: 0, torsoYaw: 0, lean: 0, armRaise: 0 },
  { time: 1.2, headYaw: -0.34, headPitch: -0.04, headRoll: -0.04, torsoYaw: -0.1, lean: 0.02, armRaise: 0.9 },
  { time: 2, headYaw: -0.34, headPitch: -0.04, headRoll: -0.04, torsoYaw: -0.1, lean: 0.02, armRaise: 0.9 },
  { time: 3, headYaw: 0, headPitch: -0.08, headRoll: 0, torsoYaw: 0, lean: 0.02, armRaise: 1 },
  { time: 4.2, headYaw: 0.35, headPitch: -0.04, headRoll: 0.04, torsoYaw: 0.11, lean: 0.04, armRaise: 0.85 },
  { time: 5.1, headYaw: 0.35, headPitch: -0.04, headRoll: 0.04, torsoYaw: 0.11, lean: 0.04, armRaise: 0.85 },
  { time: 6.2, headYaw: 0.2, headPitch: 0.19, headRoll: 0.02, torsoYaw: 0.08, lean: 0.13, armRaise: 0.7 },
  { time: 7, headYaw: 0.2, headPitch: 0.19, headRoll: 0.02, torsoYaw: 0.08, lean: 0.13, armRaise: 0.7 },
  { time: 8.4, headYaw: 0, headPitch: 0, headRoll: 0, torsoYaw: 0, lean: 0, armRaise: 0 },
];

export function searchPoseAt(seconds) {
  const time = ((seconds % 8.4) + 8.4) % 8.4;
  const endIndex = poses.findIndex((pose) => pose.time > time);
  const start = poses[endIndex - 1];
  const end = poses[endIndex];
  const progress = (time - start.time) / (end.time - start.time);
  const eased = progress * progress * (3 - 2 * progress);
  return Object.fromEntries(Object.keys(start).filter((key) => key !== 'time').map((key) => [key, start[key] + (end[key] - start[key]) * eased]));
}
