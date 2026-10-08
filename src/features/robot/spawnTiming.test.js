import { describe, expect, it } from 'vitest';
import { spawnTiming } from './spawnTiming';

describe('spawn handoff timing', () => {
  it('finishes companion materialization and clears the portal within one second', () => {
    expect(spawnTiming(0, true)).toMatchObject({ reveal: 0, fade: 1 });
    expect(spawnTiming(0.62, true)).toMatchObject({ reveal: 1, materializing: false });
    expect(spawnTiming(0.84, true).fade).toBe(0);
  });
  it('reveals the Hero promptly after departure without removing its ground portal', () => {
    expect(spawnTiming(0.15, false).reveal).toBeGreaterThan(0);
    expect(spawnTiming(0.91, false)).toMatchObject({ reveal: 1, fade: 1, materializing: false });
  });
});
