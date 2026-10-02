import { describe, expect, it } from 'vitest';
import { searchPoseAt } from './searchMotion';

describe('Hero search motion', () => {
  it('holds a deliberate gaze instead of oscillating continuously', () => {
    const left = searchPoseAt(1.2);
    expect(left.headYaw).toBeLessThan(-0.2);
    expect(searchPoseAt(2)).toEqual(left);
    expect(left.armRaise).toBeGreaterThan(0);
  });

  it('checks the other side and then looks down before returning to neutral', () => {
    expect(searchPoseAt(4.6).headYaw).toBeGreaterThan(0.2);
    expect(searchPoseAt(6.6).headPitch).toBeGreaterThan(0.1);
    expect(searchPoseAt(6.6).lean).toBeGreaterThan(0.08);
    expect(searchPoseAt(8.4)).toEqual(searchPoseAt(0));
  });

  it('eases between poses and repeats without a jump', () => {
    const halfway = searchPoseAt(0.6);
    expect(halfway.headYaw).toBeGreaterThan(searchPoseAt(1.2).headYaw);
    expect(halfway.headYaw).toBeLessThan(0);
    expect(searchPoseAt(8.399).headYaw).toBeCloseTo(searchPoseAt(0).headYaw, 4);
  });
});
