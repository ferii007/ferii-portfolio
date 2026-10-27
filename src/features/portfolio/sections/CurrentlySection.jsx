import Image from 'next/image';
import { BookOpen, Laptop, Lightbulb } from 'lucide-react';
import { CURRENTLY_ITEMS } from '@/constants/site';
import { getLocalization } from '@/constants/localization';
import Lines from '@/components/typography/Lines';
import { Section, SectionTitle } from '@/components/layout/Section';
import Doodle from '@/components/doodles/Doodle';
import Tape from '@/components/paper/Tape';
const icons = [Laptop, BookOpen, Lightbulb];

export default function CurrentlySection({ language }) {
  const { text } = getLocalization(language);
  return (
    <Section name="currently" className="currently-section">
      <div className="container currently-panel">
        <div className="currently-heading">
          <SectionTitle name="currently" />
          <div className="currently-handnote" aria-hidden="true"><p className="hand-note"><Lines text={text.currently_handnote} /></p><Doodle name="arrowRise" /></div>
        </div>
        <ul className="currently-list">
          {CURRENTLY_ITEMS.map((item, index) => { const Icon = icons[index]; return (
            <li className="currently-item fp-paper" key={item}>
              <Tape />
              <Icon className="currently-icon" size={58} strokeWidth={1.9} aria-hidden="true" />
              <Doodle name="sparkAccent" className="currently-item-spark" />
              <h3>{text[`currently_${item}_title`]}</h3>
              <p className="currently-detail">{text[`currently_${item}_detail`]}</p>
            </li>
          ); })}
        </ul>
        <div className="currently-desk" aria-hidden="true">
          <Image className="currently-ledge" src="/images/currently/desk-plank.webp" width={1160} height={140} sizes="(max-width: 1023px) 100vw, 1160px" alt="" />
          <Image className="currently-books" src="/images/currently/desk-books.webp" width={214} height={107} sizes="130px" alt="" />
          <Image className="currently-plant" src="/images/currently/desk-plant.webp" width={317} height={467} sizes="220px" alt="" />
        </div>
      </div>
    </Section>
  );
}
