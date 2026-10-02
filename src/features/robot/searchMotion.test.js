import { describe, expect, it } from 'vitest';
import { searchPoseAt } from './searchMotion';

describe('Hero search motion', () => {
  it('starts in a grounded guard stance', () => {
    const guard = searchPoseAt(0);
    expect(guard.crouch).toBeGreaterThan(0.1);
    expect(guard.guard).toBeGreaterThan(0.8);
    expect(guard.step).toBeGreaterThan(0.15);
  });

  it('holds a deliberate gaze while shifting weight', () => {
    const left = searchPoseAt(1.2);
    expect(left.headYaw).toBeLessThan(-0.2);
    expect(searchPoseAt(2)).toEqual(left);
    expect(left.weight).toBeLessThan(0);
  });

  it('checks the other side without leaving the guard pose', () => {
    const right = searchPoseAt(5.1);
    expect(right.headYaw).toBeGreaterThan(0.2);
    expect(right.weight).toBeGreaterThan(0);
    expect(right.crouch).toBeGreaterThan(0.1);
    expect(searchPoseAt(8.3)).toEqual(searchPoseAt(0));
  });

  it('eases between poses and repeats without a jump', () => {
    const halfway = searchPoseAt(0.6);
    expect(halfway.headYaw).toBeGreaterThan(searchPoseAt(1.2).headYaw);
    expect(halfway.headYaw).toBeLessThan(searchPoseAt(0).headYaw);
    expect(searchPoseAt(8.299).headYaw).toBeCloseTo(searchPoseAt(0).headYaw, 4);
  });
});
