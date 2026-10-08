export function spawnTiming(age, companion) {
  const delay = companion ? 0.06 : 0.1;
  const duration = companion ? 0.55 : 0.8;
  const end = delay + duration;
  const progress = Math.max(0, Math.min(1, (age - delay) / duration));
  return {
    progress,
    reveal: progress * progress * (3 - 2 * progress),
    fade: companion ? Math.max(0, Math.min(1, 1 - (age - end) / 0.22)) : 1,
    materializing: age < end,
  };
}
