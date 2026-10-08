export const expressions = ['happy', 'deadpan', 'side-eye', 'panic'];
export const initialRobotState = { location: 'hero', expression: 'happy', activeSkillId: null, previousExpression: null, message: null };

export function robotReducer(state, event) {
  switch (event.type) {
    case 'HERO_VISIBILITY_CHANGED':
      if (!event.visible) return { ...state, location: 'companion' };
      if (state.location === 'hero' || event.immediate) return { ...state, location: 'hero', message: null };
      return { ...state, location: 'returning', message: null };
    case 'HERO_RETURNED':
      return state.location === 'returning' ? { ...state, location: 'hero' } : state;
    case 'ROBOT_MESSAGE_SHOWN':
      return { ...state, message: { text: event.message } };
    case 'ROBOT_MESSAGE_DISMISSED':
      return { ...state, message: null };
    case 'ROBOT_CLICKED':
      if (state.activeSkillId || state.location !== 'hero') return state;
      return { ...state, expression: expressions[(expressions.indexOf(state.expression) + 1) % expressions.length] };
    case 'SKILL_OPENED':
      return { ...state, message: null, activeSkillId: event.id, previousExpression: state.previousExpression ?? state.expression, expression: 'happy' };
    case 'SKILL_CLOSED':
      return { ...state, activeSkillId: null, expression: state.previousExpression ?? state.expression, previousExpression: null };
    default:
      return state;
  }
}
