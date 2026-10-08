import { describe, expect, it } from 'vitest';
import { initialRobotState, robotReducer } from './robotState';

describe('robot interaction state', () => {
  it('refreshes a repeated speech message without changing the robot pose or expression', () => {
    const before = { ...initialRobotState, location: 'companion', expression: 'side-eye' };
    const event = { type: 'ROBOT_MESSAGE_SHOWN', message: 'Belum bisa dibuka. Sabar dulu, ya.' };
    const speaking = robotReducer(before, event);
    expect(speaking).toMatchObject({ location: 'companion', expression: 'side-eye', message: { text: event.message } });
    expect(robotReducer(speaking, event).message).not.toBe(speaking.message);
    expect(robotReducer(speaking, { type: 'ROBOT_MESSAGE_DISMISSED' }).message).toBeNull();
    expect(robotReducer(speaking, { type: 'SKILL_OPENED', id: 'react' }).message).toBeNull();
    expect(robotReducer(speaking, { type: 'HERO_VISIBILITY_CHANGED', visible: true }).message).toBeNull();
  });
  it('moves between hero and companion when hero visibility changes', () => {
    const away = robotReducer(initialRobotState, { type: 'HERO_VISIBILITY_CHANGED', visible: false });
    expect(away.location).toBe('companion');
    const returning = robotReducer(away, { type: 'HERO_VISIBILITY_CHANGED', visible: true });
    expect(returning.location).toBe('returning');
    expect(robotReducer(returning, { type: 'HERO_RETURNED' }).location).toBe('hero');
  });
  it('cancels departure when scrolling away again and ignores a stale animation callback', () => {
    const returning = { ...initialRobotState, location: 'returning' };
    const away = robotReducer(returning, { type: 'HERO_VISIBILITY_CHANGED', visible: false });
    expect(robotReducer(away, { type: 'HERO_RETURNED' }).location).toBe('companion');
  });
  it('returns immediately with reduced motion and ignores clicks outside Hero', () => {
    const away = { ...initialRobotState, location: 'companion' };
    expect(robotReducer(away, { type: 'ROBOT_CLICKED' })).toBe(away);
    expect(robotReducer(away, { type: 'HERO_VISIBILITY_CHANGED', visible: true, immediate: true }).location).toBe('hero');
  });
  it('cycles all four expressions in order', () => {
    let state = initialRobotState;
    for (const expression of ['deadpan', 'side-eye', 'panic', 'happy']) {
      state = robotReducer(state, { type: 'ROBOT_CLICKED' });
      expect(state.expression).toBe(expression);
    }
  });
  it('restores the prior expression after skill closes', () => {
    const before = robotReducer(initialRobotState, { type: 'ROBOT_CLICKED' });
    const open = robotReducer(before, { type: 'SKILL_OPENED', id: 'react' });
    expect(open).toMatchObject({ activeSkillId: 'react', previousExpression: 'deadpan', expression: 'happy' });
    expect(robotReducer(open, { type: 'SKILL_CLOSED' })).toMatchObject({ activeSkillId: null, previousExpression: null, expression: 'deadpan' });
  });
  it('does not change expression from robot clicks while skill is open', () => {
    const open = robotReducer(initialRobotState, { type: 'SKILL_OPENED', id: 'react' });
    expect(robotReducer(open, { type: 'ROBOT_CLICKED' })).toEqual(open);
  });
});
