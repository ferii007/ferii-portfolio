import { describe, expect, it } from 'vitest';
import { DEPARTURE_DURATION, departurePoseAt } from './departureMotion';

describe('departure choreography', () => {
  it('lifts before turning and turns before accelerating', () => {
    const lifting = departurePoseAt(DEPARTURE_DURATION * 0.25);
    expect(lifting.lift).toBeGreaterThan(0.9);
    expect(lifting.turn).toBe(0);
    expect(lifting.boost).toBe(0);
    const turning = departurePoseAt(DEPARTURE_DURATION * 0.5);
    expect(turning.turn).toBeGreaterThan(0.4);
    expect(turning.boost).toBe(0);
    expect(departurePoseAt(DEPARTURE_DURATION)).toEqual({ lift: 1, look: 1, turn: 1, boost: 1 });
  });
});
