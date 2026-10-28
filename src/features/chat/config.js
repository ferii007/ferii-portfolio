// Shared by the chat panel and /api/chat, so both sides agree on the limits.
export const CHAT_ENDPOINT = '/api/chat';
export const CHAT_LIMITS = {
  messageLength: 400, // characters per visitor message
  answerLength: 800, // characters per robot answer sent back as history
  history: 8, // most recent messages sent with each question
};

// A conversation the endpoint accepts: recent turns only, each short, ending with the visitor's question.
export const validMessages = (messages) => Array.isArray(messages)
  && messages.length > 0
  && messages.length <= CHAT_LIMITS.history
  && messages.every((message) => ['user', 'assistant'].includes(message?.role) && typeof message.content === 'string' && message.content.trim() && message.content.length <= CHAT_LIMITS.answerLength)
  && messages.at(-1).role === 'user'
  && messages.at(-1).content.length <= CHAT_LIMITS.messageLength;
