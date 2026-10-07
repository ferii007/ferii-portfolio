'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw, X } from 'lucide-react';
import { fetchSkillSummary } from '../lib/wiki';
import SkillIcon from './SkillIcon';
import Description from '@/components/typography/Description';

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
  return <aside className="skill-dialog fp-hologram" role="dialog" aria-modal="false" aria-labelledby="skill-dialog-title" aria-describedby="skill-dialog-body">
    <div className="skill-dialog-top fp-hologram__head">
      <div className="skill-dialog-identity">
        <div className="skill-dialog-icon" style={{ '--skill-color': skill.color }}><SkillIcon skill={skill} /></div>
        <div><span className="skill-dialog-kicker">Stack explorer</span><h3 id="skill-dialog-title">{skill.label}<svg viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M7 2 5 13M20 5l-7 10M31 20l-11 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></h3><p className="skill-dialog-subtitle">{currentResult.status === 'success' ? currentResult.data.title : 'Ringkasan Wikipedia'}</p></div>
      </div>
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Tutup detail skill"><X size={24} /></button>
    </div>
    <div className="skill-dialog-content fp-hologram__body" key={skill.id}>
      <h4>Tentang {skill.label}</h4>
      <div id="skill-dialog-body" aria-live="polite">
        {currentResult.status === 'loading' && <Description>Memuat ringkasan dari Wikipedia…</Description>}
        {currentResult.status === 'success' && <Description>{currentResult.data.extract}</Description>}
        {currentResult.status === 'not_found' && <Description>Artikel Wikipedia untuk {skill.label} belum ditemukan.</Description>}
        {currentResult.status === 'error' && <Description>Ringkasan belum bisa dimuat. Coba lagi nanti.</Description>}
        {['not_found', 'error'].includes(currentResult.status) && <button className="retry-button" type="button" onClick={() => { setResult({ status: 'loading', skillId: skill.id }); setRequestVersion((value) => value + 1); }}><RotateCcw size={16} /> Coba lagi</button>}
      </div>
      {currentResult.status === 'success' && <div className="skill-dialog-source"><span>Sumber: <strong>Wikipedia</strong></span><a className="fp-btn fp-btn--primary" href={currentResult.data.url} target="_blank" rel="noopener noreferrer">Baca di Wikipedia <ArrowUpRight size={18} /></a></div>}
    </div>
  </aside>;
}
