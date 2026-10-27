'use client';
import { useState } from 'react';
import Image from 'next/image';
import Eyebrow from '@/components/typography/Eyebrow';
import { Mail, MessageSquare, Send, UserRound } from 'lucide-react';
import { siGithub } from 'simple-icons';
import { site } from '@/content/site';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import { useLocalization } from '@/context/LocalizationProvider';
import Lines from '@/components/typography/Lines';

function ContactField({ name, label, Icon, type = 'text', multiline = false }) {
  const Control = multiline ? 'textarea' : 'input';
  return <label className="contact-field">
    <Control name={name} type={multiline ? undefined : type} placeholder=" " autoComplete={multiline ? undefined : name} rows={multiline ? 5 : undefined} required />
    <fieldset className="contact-field-border" aria-hidden="true"><legend><span><Icon />{label}</span></legend></fieldset>
    <span className="contact-field-label"><Icon aria-hidden="true" />{label}</span>
  </label>;
}

export default function ContactSection() {
  const { localization: { text } } = useLocalization();
  const { showRobotMessage } = usePortfolioInteraction();
  // The submit button stays disabled until every field has content and the email is valid.
  const [complete, setComplete] = useState(false);
  const checkComplete = (event) => {
    const form = event.currentTarget;
    setComplete([...form.elements].filter((field) => field.name).every((field) => field.value.trim()) && form.checkValidity());
  };
  const submitDemo = (event) => {
    event.preventDefault();
    if (!complete) return;
    // Local simulation only: no request or storage of the form contents.
    event.currentTarget.reset();
    setComplete(false);
    showRobotMessage(text.contact_sent_message);
  };
  return <section className="section contact-section" id="contact" aria-labelledby="contact-title"><div className="container contact-grid">
    <div><h2 className="section-title contact-title" id="contact-title">{text.contact_title}<svg viewBox="0 0 34 42" fill="none" aria-hidden="true"><path d="m10 12 9-9M13 23l16-3M12 33l11 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" /></svg></h2><Eyebrow className="contact-eyebrow">{text.contact_eyebrow}</Eyebrow>
      <form className="contact-form fp-paper" aria-label={text.contact_form_label} onSubmit={submitDemo} onInput={checkComplete}>
        <span className="fp-tape contact-tape" aria-hidden="true" />
        <ContactField name="name" label={text.contact_name} Icon={UserRound} />
        <ContactField name="email" label={text.contact_email} Icon={Mail} type="email" />
        <ContactField name="message" label={text.contact_message} Icon={MessageSquare} multiline />
        <button className="contact-submit" type="submit" disabled={!complete}>{text.contact_submit} <Send size={19} aria-hidden="true" /></button>
      </form>
    </div>
    <div className="contact-side"><div className="contact-illustration" aria-hidden="true"><Image src="/images/contact/letter-studio.webp" width={1448} height={1086} alt="" sizes="(max-width: 767px) 100vw, 800px" />
        {/* The letter is blank in the artwork; the greeting is written on it here, in the image's 1448×1086 pixels. */}
        <svg className="contact-letter" viewBox="0 0 1448 1086" fill="none">
          <defs><clipPath id="contact-letter-face"><path d="M332 457 905 348 959 555 813 672 630 697 292 563Z" /></clipPath></defs>
          <g clipPath="url(#contact-letter-face)" className="contact-letter-ink">
            <text transform="translate(452 572) rotate(-10.8)" fontSize="96">{text.contact_letter_greeting}</text>
            <path className="contact-letter-line" d="M500 618c70-10 150-26 228-44" />
            <text transform="translate(668 652) rotate(-10.8)" fontSize="64">:)</text>
          </g>
          <path className="contact-letter-spark" d="m796 446 22-30M806 478l36-12M808 506l32 8" />
        </svg>
        {/* Chat hologram, animated in the artwork's 1448×1086 pixels (everything follows the panel's ~11° perspective):
            messages arrive one after another, their text lines shimmer like loading skeletons, the avatars ping and the
            paper plane keeps launching a ghost copy along a dotted trail. */}
        <svg className="chat-holo" viewBox="0 0 1448 1086" fill="none">
          <defs><clipPath id="chat-holo-panel"><path d="M800 95 1215 175 1200 490 805 480Z" /></clipPath></defs>
          <g clipPath="url(#chat-holo-panel)">
            <rect className="chat-holo-flicker" x="790" y="85" width="440" height="415" />
            <rect className="chat-holo-bubble" x="-117" y="-37" width="234" height="74" rx="30" transform="translate(985 228) rotate(11)" />
            <rect className="chat-holo-bubble chat-holo-bubble--2" x="-95" y="-34" width="190" height="68" rx="28" transform="translate(943 318) rotate(11)" />
            <circle className="chat-holo-ping" cx="911" cy="220" r="16" />
            <circle className="chat-holo-ping chat-holo-ping--2" cx="891" cy="305" r="13.5" />
            <path className="chat-holo-shimmer" d="M947 218 1070 245" pathLength="100" />
            <path className="chat-holo-shimmer chat-holo-shimmer--b" d="M942 237 1020 255" pathLength="100" />
            <path className="chat-holo-shimmer chat-holo-shimmer--c" d="M922 306 1012 327" pathLength="100" />
            <path className="chat-holo-shimmer chat-holo-shimmer--d" d="M919 321 969 334" pathLength="100" />
            <path className="chat-holo-plane-glow" d="M1020 395 1132 350 1080 445 1062 410Z" />
            <path className="chat-holo-trail" d="M1112 372C1140 350 1150 320 1185 300" pathLength="100" />
            <g transform="translate(1078 397)"><path className="chat-holo-ghost" d="M-58-2 54-47 2 48-16 13Z M-16 13 54-47" /></g>
          </g>
        </svg>
        <div className="contact-handnote"><p className="hand-note"><Lines text={text.contact_handnote} /></p><svg viewBox="0 0 68 54" fill="none"><path d="M61 9C36 8 16 21 12 43M7 33l5 12 12-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
      <div className="contact-socials"><a href={site.contact.github} target="_blank" rel="noopener noreferrer"><svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg><span><strong>GitHub</strong></span></a><a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer"><svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="3" fill="currentColor" /><circle cx="5.5" cy="6" r="1.7" fill="white" /><path d="M4 9h3v11H4zm5 0h3v1.5c1-1.6 6-2.6 6 3V20h-3v-6c0-2.5-3-2.5-3 0v6H9z" fill="white" /></svg><span><strong>LinkedIn</strong></span></a></div>
    </div>
  </div></section>;
}
