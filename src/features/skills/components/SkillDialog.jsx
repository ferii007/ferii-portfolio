'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw, X } from 'lucide-react';
import { fetchSkillSummary } from '../lib/wiki';

export default function SkillDialog({ skill, onClose }) {
  const closeRef = useRef(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const [result, setResult] = useState({ status: 'loading' });

  useEffect(() => {
    if (!skill) return;
    const controller = new AbortController();
    let active = true;
    const run = async () => {
      try {
        const data = await fetchSkillSummary(skill.wikiTitle, { signal: controller.signal });
        if (active) setResult({ status: 'success', data, skillId: skill.id });
      } catch (error) {
        if (active && error.name !== 'AbortError') setResult({ status: error.code === 'not_found' ? 'not_found' : 'error', skillId: skill.id });
      }
    };
    run();
    return () => { active = false; controller.abort(); };
  }, [skill, requestVersion]);
  useEffect(() => {
    if (skill) closeRef.current?.focus();
  }, [skill]);
  useEffect(() => {
    if (!skill) return;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [skill, onClose]);
  if (!skill) return null;
  const currentResult = result.skillId === skill.id ? result : { status: 'loading' };
  return <aside className="skill-dialog" role="dialog" aria-modal="false" aria-labelledby="skill-dialog-title" aria-describedby="skill-dialog-body">
    <div className="skill-dialog-top"><span>HOLOGRAM / {skill.label.toUpperCase()}</span><button ref={closeRef} type="button" onClick={onClose} aria-label="Tutup detail skill"><X size={22} /></button></div>
    <div className="skill-dialog-content" key={skill.id}>
      <div className="skill-dialog-icon" style={{ '--skill-color': skill.color }} aria-hidden="true">{skill.iconLabel}</div>
      <h3 id="skill-dialog-title">{skill.label}</h3>
      <div id="skill-dialog-body" aria-live="polite">
        {currentResult.status === 'loading' && <p>Memuat ringkasan dari Wikipedia…</p>}
        {currentResult.status === 'success' && <><p>{currentResult.data.extract}</p><a href={currentResult.data.url} target="_blank" rel="noopener noreferrer">Baca artikel Wikipedia <ArrowUpRight size={16} /></a></>}
        {currentResult.status === 'not_found' && <p>Artikel Wikipedia untuk {skill.label} belum ditemukan.</p>}
        {currentResult.status === 'error' && <p>Ringkasan belum bisa dimuat. Coba lagi nanti.</p>}
        {['not_found', 'error'].includes(currentResult.status) && <button className="retry-button" type="button" onClick={() => { setResult({ status: 'loading', skillId: skill.id }); setRequestVersion((value) => value + 1); }}><RotateCcw size={16} /> Coba lagi</button>}
      </div>
    </div>
  </aside>;
}
