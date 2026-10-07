import Description from '@/components/typography/Description';
import Image from 'next/image';
import journey from '../data/journey.json';

export default function JourneySection() {
  return (
    <section className="section journey-section" id="journey" aria-labelledby="journey-title">
      <div className="container">
        <div className="journey-heading">
          <div><span className="journey-title-mark" aria-hidden="true" /><h2 id="journey-title">My Journey<svg viewBox="0 0 36 40" fill="none" aria-hidden="true"><path d="m8 17 8-14M17 29l15-7" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg></h2><Description>Dari bangku sekolah ke dunia pengembangan software.</Description></div>
          <div className="journey-handnote" aria-hidden="true"><p>Setiap langkah<br />punya cerita.</p><svg viewBox="0 0 64 60" fill="none"><path d="M51 5C25 14 14 30 12 50M5 37l7 15 15-9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        </div>
        <ol className="journey-timeline">
          {journey.map((item, index) => <li className={`journey-item${item.current ? ' journey-item--current' : ''}`} key={item.id}>
            <div className="journey-period">{item.period.map((line, lineIndex) => <span key={lineIndex}>{line}</span>)}</div>
            <span className="journey-marker" aria-hidden="true">{index + 1}</span>
            <article className="journey-card">
              <div className="journey-icon" aria-hidden="true"><Image src={item.icon} width={256} height={256} unoptimized alt="" /></div>
              <div className="journey-content"><h3>{item.title}</h3><p className="journey-organization">{item.organization}</p><p className="journey-role">{item.role}</p><Description>{item.description}</Description></div>
              {index > 0 && <svg className="journey-card-spark" viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="m7 18 8-13M15 27l13-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>}
            </article>
          </li>)}
        </ol>
      </div>
    </section>
  );
}
