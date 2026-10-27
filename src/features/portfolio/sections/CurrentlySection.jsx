import Image from 'next/image';
import { BookOpen, Laptop, Lightbulb } from 'lucide-react';
import { site } from '@/content/site';
const icons = [Laptop, BookOpen, Lightbulb];

function Spark({ className }) {
  return <svg className={className} viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M7 2 5 13M20 5l-7 10M31 20l-11 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
}

export default function CurrentlySection() {
  return (
    <section className="section currently-section" id="currently" aria-labelledby="currently-title">
      <div className="container currently-panel">
        <div className="currently-heading">
          <h2 className="section-title" id="currently-title">Currently<svg viewBox="0 0 34 42" fill="none" aria-hidden="true"><path d="m10 12 9-9M13 23l16-3M12 33l11 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" /></svg></h2>
          <div className="currently-handnote" aria-hidden="true"><p className="hand-note">Setiap hari<br />sedikit lebih<br />baik.</p><svg viewBox="0 0 90 40" fill="none"><path d="M4 32c22 8 50 2 74-20m-13 0 14-3-1 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        </div>
        <ul className="currently-list">
          {site.currently.map((item, index) => { const Icon = icons[index]; return (
            <li className="currently-item fp-paper" key={item.title}>
              <span className="fp-tape" aria-hidden="true" />
              <Icon className="currently-icon" size={58} strokeWidth={1.9} aria-hidden="true" />
              <Spark className="currently-item-spark" />
              <h3>{item.title}</h3>
              <p className="currently-detail">{item.detail}</p>
            </li>
          ); })}
        </ul>
        <div className="currently-desk" aria-hidden="true">
          <Image className="currently-ledge" src="/images/currently/desk-plank.webp" width={1160} height={140} sizes="(max-width: 1023px) 100vw, 1160px" alt="" />
          <Image className="currently-books" src="/images/currently/desk-books.webp" width={214} height={107} sizes="130px" alt="" />
          <Image className="currently-plant" src="/images/currently/desk-plant.webp" width={317} height={467} sizes="220px" alt="" />
        </div>
      </div>
    </section>
  );
}
