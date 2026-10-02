import { describe, expect, it } from 'vitest';
import { initialRobotState, robotReducer } from './robotState';

describe('robot interaction state', () => {
  it('moves between hero and companion when hero visibility changes', () => {
    const away = robotReducer(initialRobotState, { type: 'HERO_VISIBILITY_CHANGED', visible: false });
    expect(away.location).toBe('companion');
    expect(robotReducer(away, { type: 'HERO_VISIBILITY_CHANGED', visible: true }).location).toBe('hero');
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
