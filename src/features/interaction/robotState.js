export const expressions = ['happy', 'deadpan', 'side-eye', 'panic'];
export const initialRobotState = { location: 'hero', expression: 'happy', activeSkillId: null, previousExpression: null };

export function robotReducer(state, event) {
  switch (event.type) {
    case 'HERO_VISIBILITY_CHANGED':
      if (!event.visible) return { ...state, location: 'companion' };
      if (state.location === 'hero' || event.immediate) return { ...state, location: 'hero' };
      return { ...state, location: 'returning' };
    case 'HERO_RETURNED':
      return state.location === 'returning' ? { ...state, location: 'hero' } : state;
    case 'ROBOT_CLICKED':
      if (state.activeSkillId || state.location !== 'hero') return state;
      return { ...state, expression: expressions[(expressions.indexOf(state.expression) + 1) % expressions.length] };
    case 'SKILL_OPENED':
      return { ...state, activeSkillId: event.id, previousExpression: state.previousExpression ?? state.expression, expression: 'happy' };
    case 'SKILL_CLOSED':
      return { ...state, activeSkillId: null, expression: state.previousExpression ?? state.expression, previousExpression: null };
    default:
      return state;
  }
}
