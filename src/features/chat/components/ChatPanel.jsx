'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, SendHorizontal, X } from 'lucide-react';
import Tape from '@/components/paper/Tape';
import { useLocalization } from '@/context/LocalizationProvider';
import { interpolate, localeKey } from '@/constants/localization';
import { anchor, SECTIONS, SOCIAL } from '@/constants/site';
import { CHAT_ENDPOINT, CHAT_LIMITS, normalizeQuestion } from '../config';
import { QUICK_QUESTIONS, quickAnswer } from '../lib/knowledge';

// Recent turns that went through; a failed question and its fallback reply are left out.
const historyOf = (messages) => messages.filter((message) => !message.failed && message.content)
  .slice(-CHAT_LIMITS.history)
  .map(({ role, content }) => ({ role, content: content.slice(0, CHAT_LIMITS.answerLength) }));

// The robot's earlier answer to the same question in this conversation, so asking again doesn't call the AI.
function earlierAnswer(messages, question) {
  const key = normalizeQuestion(question);
  for (let index = messages.length - 2; index >= 0; index -= 1) {
    const [asked, reply] = [messages[index], messages[index + 1]];
    if (asked.role === 'user' && !asked.failed && normalizeQuestion(asked.content) === key && reply.role === 'assistant' && !reply.failed && reply.content) return reply;
  }
  return null;
}

// "GitHub" and "LinkedIn" in a reply become links to the profiles.
const profiles = Object.values(SOCIAL);
const profilePattern = new RegExp(`(${profiles.map((profile) => profile.label).join('|')})`);
const withProfileLinks = (content) => content.split(profilePattern).map((part, index) => {
  const profile = index % 2 ? profiles.find((item) => item.label === part) : null;
  return profile ? <a key={index} className="chat-profile-link" href={profile.url} target="_blank" rel="noopener noreferrer">{part}</a> : part;
});

// The robot chat: quick questions are answered from the portfolio data, free questions stream from /api/chat.
// Loaded on first open and kept mounted, so the conversation survives closing the panel.
export default function ChatPanel({ open, onClose, onThinking }) {
  const { localization, currentLanguage } = useLocalization();
  const { text } = localization;
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  // Escape or a click anywhere outside the page closes it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    const onPointerDown = (event) => { if (!panelRef.current.contains(event.target)) onClose(); };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, onClose]);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);
  // The question field grows downwards with the text (up to a few lines), so the whole question stays readable.
  useLayoutEffect(() => {
    const field = inputRef.current;
    field.style.height = 'auto';
    field.style.height = `${field.scrollHeight}px`;
  }, [draft]);

  const updateLast = (changes) => setMessages((current) => [...current.slice(0, -1), { ...current.at(-1), ...changes }]);

  async function ask(question) {
    const sent = [...messages, { role: 'user', content: question, at: Date.now() }];
    const repeated = earlierAnswer(messages, question);
    if (repeated) {
      setMessages([...sent, { role: 'assistant', content: repeated.content, section: repeated.section, at: Date.now() }]);
      return;
    }
    setMessages([...sent, { role: 'assistant', content: '' }]);
    setBusy(true);
    onThinking(true);
    try {
      const response = await fetch(CHAT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language: currentLanguage, messages: historyOf(sent) }) });
      if (!response.ok) throw Object.assign(new Error('chat failed'), { status: response.status });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
        answer += decoder.decode(chunk.value, { stream: true });
        updateLast({ content: answer });
        onThinking(false);
      }
      if (!answer.trim()) throw new Error('empty answer');
      updateLast({ at: Date.now() });
    } catch (error) {
      const fallback = error.status === 429 ? text.chat_rate_limited : text.chat_unavailable;
      setMessages((current) => [...current.slice(0, -2), { ...current.at(-2), failed: true }, { role: 'assistant', content: fallback, failed: true, at: Date.now() }]);
    } finally {
      setBusy(false);
      onThinking(false);
    }
  }

  const askQuick = ({ id, section }) => setMessages((current) => [...current,
    { role: 'user', content: text[localeKey('chat_quick', id)], at: Date.now() },
    { role: 'assistant', content: quickAnswer(id, localization), section, at: Date.now() }]);

  const send = () => {
    const question = draft.trim();
    if (!question || busy) return;
    setDraft('');
    ask(question);
  };
  const onSubmit = (event) => { event.preventDefault(); send(); };
  // Enter sends; Shift+Enter starts a new line.
  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); }
  };

  return <section ref={panelRef} className="chat-panel fp-paper" id="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden={!open}>
    <Tape />
    <header className="chat-head">
      <h2 id="chat-title">{text.chat_title}</h2>
      <button className="chat-close" type="button" onClick={onClose} aria-label={text.chat_close}><X size={22} /></button>
    </header>
    <ol ref={logRef} className="chat-log" aria-live="polite">
      <li className="chat-message chat-message--robot">{text.chat_intro}</li>
      {messages.map((message, index) => <li key={index} className={`chat-message chat-message--${message.role === 'user' ? 'visitor' : 'robot'}`} aria-busy={busy && index === messages.length - 1}>
        {message.content ? (message.role === 'user' ? message.content : withProfileLinks(message.content)) : <span className="chat-thinking">{text.chat_thinking}</span>}
        {message.section && <a className="chat-section-link" href={anchor(message.section)}>{interpolate(text.chat_see_section, { section: SECTIONS[message.section].nav })}<ArrowRight size={14} aria-hidden="true" /></a>}
        {message.at && <time className="chat-time" dateTime={new Date(message.at).toISOString()}>{localization.time(message.at)}</time>}
      </li>)}
    </ol>
    <div className={`chat-quick${messages.length ? ' chat-quick--compact' : ''}`} role="group" aria-label={text.chat_quick_label}>
      {QUICK_QUESTIONS.map((question) => <button key={question.id} type="button" onClick={() => askQuick(question)} disabled={busy}>{text[localeKey('chat_quick', question.id)]}</button>)}
    </div>
    <form className="chat-form" onSubmit={onSubmit}>
      <textarea ref={inputRef} rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} maxLength={CHAT_LIMITS.messageLength} placeholder={text.chat_placeholder} aria-label={text.chat_placeholder} autoComplete="off" />
      <button type="submit" disabled={busy || !draft.trim()} aria-label={text.chat_send}><SendHorizontal size={20} /></button>
    </form>
    <p className="chat-note">{text.chat_note}</p>
  </section>;
}
