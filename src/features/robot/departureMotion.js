export const DEPARTURE_DURATION = 1100;
const smooth = (value) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

export function departurePoseAt(milliseconds) {
  const progress = milliseconds / DEPARTURE_DURATION;
  return {
    lift: smooth(progress / 0.3),
    look: smooth((progress - 0.15) / 0.3),
    turn: smooth((progress - 0.28) / 0.47),
    boost: smooth((progress - 0.55) / 0.45),
  };
}
