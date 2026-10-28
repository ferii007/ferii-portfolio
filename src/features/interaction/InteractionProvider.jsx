'use client';
import { createContext, useContext, useMemo, useReducer } from 'react';
import { initialRobotState, robotReducer } from './robotState';

const InteractionContext = createContext(null);

export function InteractionProvider({ children }) {
  const [state, dispatch] = useReducer(robotReducer, initialRobotState);
  const actions = useMemo(() => ({
    setHeroVisible: (visible, immediate = false) => dispatch({ type: 'HERO_VISIBILITY_CHANGED', visible, immediate }),
    completeHeroReturn: () => dispatch({ type: 'HERO_RETURNED' }),
    cycleExpression: () => dispatch({ type: 'ROBOT_CLICKED' }),
    openSkill: (id) => dispatch({ type: 'SKILL_OPENED', id }),
    closeSkill: () => dispatch({ type: 'SKILL_CLOSED' }),
    showRobotMessage: (message) => dispatch({ type: 'ROBOT_MESSAGE_SHOWN', message }),
    dismissRobotMessage: () => dispatch({ type: 'ROBOT_MESSAGE_DISMISSED' }),
    toggleChat: () => dispatch({ type: 'CHAT_TOGGLED' }),
    closeChat: () => dispatch({ type: 'CHAT_CLOSED' }),
    setChatThinking: (thinking) => dispatch({ type: 'CHAT_THINKING', thinking }),
  }), []);
  return <InteractionContext.Provider value={{ state, ...actions }}>{children}</InteractionContext.Provider>;
}

export function usePortfolioInteraction() {
  const context = useContext(InteractionContext);
  if (!context) throw new Error('usePortfolioInteraction must be used inside InteractionProvider');
  return context;
}
