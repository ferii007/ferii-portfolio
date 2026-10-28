'use client';
import { useEffect, useRef, useState } from 'react';
import { SendHorizontal, X } from 'lucide-react';
import { useLocalization } from '@/context/LocalizationProvider';
import { interpolate, localeKey } from '@/constants/localization';
import { anchor, SECTIONS } from '@/constants/site';
import { CHAT_ENDPOINT, CHAT_LIMITS } from '../config';
import { QUICK_QUESTIONS, quickAnswer } from '../lib/knowledge';

// Recent turns that went through; a failed question and its fallback reply are left out.
const historyOf = (messages) => messages.filter((message) => !message.failed && message.content)
  .slice(-CHAT_LIMITS.history)
  .map(({ role, content }) => ({ role, content: content.slice(0, CHAT_LIMITS.answerLength) }));

// The robot chat: quick questions are answered from the portfolio data, free questions stream from /api/chat.
// Loaded on first open and kept mounted, so the conversation survives closing the panel.
export default function ChatPanel({ open, beside, onClose, onThinking }) {
  const { localization, currentLanguage } = useLocalization();
  const { text } = localization;
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  const updateLast = (changes) => setMessages((current) => [...current.slice(0, -1), { ...current.at(-1), ...changes }]);

  async function ask(question) {
    const sent = [...messages, { role: 'user', content: question }];
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
    } catch (error) {
      const fallback = error.status === 429 ? text.chat_rate_limited : text.chat_unavailable;
      setMessages((current) => [...current.slice(0, -2), { ...current.at(-2), failed: true }, { role: 'assistant', content: fallback, failed: true }]);
    } finally {
      setBusy(false);
      onThinking(false);
    }
  }

  const askQuick = ({ id, section }) => setMessages((current) => [...current,
    { role: 'user', content: text[localeKey('chat_quick', id)] },
    { role: 'assistant', content: quickAnswer(id, localization), section }]);

  const onSubmit = (event) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question || busy) return;
    setDraft('');
    ask(question);
  };

  return <section className={`chat-panel${beside ? ' chat-panel--beside-robot' : ''}`} id="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden={!open}>
    <header className="chat-head">
      <h2 id="chat-title">{text.chat_title}</h2>
      <button type="button" onClick={onClose} aria-label={text.chat_close}><X size={22} /></button>
    </header>
    <ol ref={logRef} className="chat-log" aria-live="polite">
      <li className="chat-message chat-message--robot">{text.chat_intro}</li>
      {messages.map((message, index) => <li key={index} className={`chat-message chat-message--${message.role === 'user' ? 'visitor' : 'robot'}`} aria-busy={busy && index === messages.length - 1}>
        {message.content || <span className="chat-thinking">{text.chat_thinking}</span>}
        {message.section && <a className="chat-section-link" href={anchor(message.section)}>{interpolate(text.chat_see_section, { section: SECTIONS[message.section].nav })}</a>}
      </li>)}
    </ol>
    <div className="chat-quick" role="group" aria-label={text.chat_quick_label}>
      {QUICK_QUESTIONS.map((question) => <button key={question.id} type="button" onClick={() => askQuick(question)} disabled={busy}>{text[localeKey('chat_quick', question.id)]}</button>)}
    </div>
    <form className="chat-form" onSubmit={onSubmit}>
      <input ref={inputRef} type="text" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={CHAT_LIMITS.messageLength} placeholder={text.chat_placeholder} aria-label={text.chat_placeholder} autoComplete="off" />
      <button type="submit" disabled={busy || !draft.trim()} aria-label={text.chat_send}><SendHorizontal size={20} /></button>
    </form>
    <p className="chat-note">{text.chat_note}</p>
  </section>;
}
