import { BookOpen, Lightbulb, Monitor } from 'lucide-react';
import { site } from '@/content/site';
import Description from '@/components/typography/Description';
const icons = [Monitor, BookOpen, Lightbulb];

export default function CurrentlySection() {
  return (
    <section className="section currently-section" id="currently" aria-labelledby="currently-title">
      <div className="container currently-panel">
        <div className="currently-heading">
          <div className="currently-title-row">
            <h2 id="currently-title">Currently<svg className="currently-spark" viewBox="0 0 34 42" fill="none" aria-hidden="true"><path d="m10 12 9-9M13 23l16-3M12 33l11 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" /></svg></h2>
          </div>
          <Description>Hal-hal yang sedang jadi fokusku.</Description>
        </div>
        <ul className="currently-list">
          {site.currently.map((item, index) => { const Icon = icons[index]; return (
            <li className="currently-item" key={item.title}>
              <Icon className="currently-icon" size={38} strokeWidth={1.6} aria-hidden="true" />
              <h3>{item.title}</h3>
              <Description className="currently-detail">{item.detail}</Description>
            </li>
          ); })}
        </ul>
      </div>
    </section>
  );
}
