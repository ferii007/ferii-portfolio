'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw, X } from 'lucide-react';
import { fetchSkillSummary } from '../lib/wiki';
import SkillIcon from './SkillIcon';
import Description from '@/components/typography/Description';
import { useLocalization } from '@/context/LocalizationProvider';
import { interpolate } from '@/constants/localization';
import { LABELS } from '@/constants/site';
import Doodle from '@/components/doodles/Doodle';

export default function SkillDialog({ skill, onClose }) {
  const { localization: { text }, currentLanguage } = useLocalization();
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const [result, setResult] = useState({ status: 'loading' });

  useEffect(() => {
    if (!skill) return;
    const controller = new AbortController();
    let active = true;
    const run = async () => {
      try {
        const data = await fetchSkillSummary(skill.wikiTitle, { signal: controller.signal, language: currentLanguage });
        if (active) setResult({ status: 'success', data, skillId: skill.id });
      } catch (error) {
        if (active && error.name !== 'AbortError') setResult({ status: error.code === 'not_found' ? 'not_found' : 'error', skillId: skill.id });
      }
    };
    run();
    return () => { active = false; controller.abort(); };
  }, [skill, requestVersion, currentLanguage]);
  useEffect(() => {
    if (skill) closeRef.current?.focus();
  }, [skill]);
  useEffect(() => {
    if (!skill) return;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    const onPointerDown = (event) => {
      if (!dialogRef.current.contains(event.target) && !event.target.closest('.skill-card')) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [skill, onClose]);
  if (!skill) return null;
  const currentResult = result.skillId === skill.id ? result : { status: 'loading' };
  return <aside ref={dialogRef} className="skill-dialog fp-hologram" role="dialog" aria-modal="false" aria-labelledby="skill-dialog-title" aria-describedby="skill-dialog-body">
    <div className="skill-dialog-top fp-hologram__head">
      <div className="skill-dialog-identity">
        <div className="skill-dialog-icon" style={{ '--skill-color': skill.colorOnHolo ?? skill.color }}><SkillIcon skill={skill} /></div>
        <div><span className="skill-dialog-kicker">{LABELS.skillKicker}</span><h3 id="skill-dialog-title">{skill.label}<Doodle name="sparkAccent" /></h3>{currentResult.status === 'loading' ? <span className="skill-skeleton-line skill-skeleton-subtitle" aria-hidden="true" /> : <p className="skill-dialog-subtitle">{currentResult.status === 'success' ? currentResult.data.title : 'Ringkasan Wikipedia'}</p>}</div>
      </div>
      <button ref={closeRef} type="button" onClick={onClose} aria-label={text.skill_dialog_close}><X size={24} /></button>
    </div>
    <div className="skill-dialog-content fp-hologram__body" key={skill.id} aria-busy={currentResult.status === 'loading'}>
      <h4>{interpolate(text.skill_dialog_about, { skill: skill.label })}</h4>
      <div id="skill-dialog-body" aria-live="polite">
        {currentResult.status === 'loading' && <div className="skill-skeleton" role="status"><span className="fp-visually-hidden">{text.skill_dialog_loading}</span><div className="skill-skeleton-lines" aria-hidden="true"><span className="skill-skeleton-line" /><span className="skill-skeleton-line" /><span className="skill-skeleton-line" /><span className="skill-skeleton-line" /></div></div>}
        {currentResult.status === 'success' && <Description>{currentResult.data.extract}</Description>}
        {currentResult.status === 'not_found' && <Description>{interpolate(text.skill_dialog_not_found, { skill: skill.label })}</Description>}
        {currentResult.status === 'error' && <Description>{text.skill_dialog_error}</Description>}
        {['not_found', 'error'].includes(currentResult.status) && <button className="retry-button" type="button" onClick={() => { setResult({ status: 'loading', skillId: skill.id }); setRequestVersion((value) => value + 1); }}><RotateCcw size={16} /> {text.skill_dialog_retry}</button>}
      </div>
      {currentResult.status === 'loading' && <div className="skill-dialog-source skill-skeleton-footer" aria-hidden="true"><span className="skill-skeleton-line" /><span className="skill-skeleton-line skill-skeleton-button" /></div>}
      {currentResult.status === 'success' && <div className="skill-dialog-source"><span>{text.skill_dialog_source} <strong>Wikipedia</strong></span><a className="fp-btn fp-btn--primary" href={currentResult.data.url} target="_blank" rel="noopener noreferrer">{text.skill_dialog_read_more} <ArrowUpRight size={18} /></a></div>}
    </div>
  </aside>;
}
