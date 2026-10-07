import Image from 'next/image';
import Description from '@/components/typography/Description';
import { Mail, MessageSquare, Send, UserRound } from 'lucide-react';
import { siGithub } from 'simple-icons';
import { site } from '@/content/site';

export default function ContactSection() {
  return <section className="section contact-section" id="contact" aria-labelledby="contact-title"><div className="container contact-grid">
    <div><span className="contact-title-mark" aria-hidden="true" /><h2 id="contact-title">Contact Me<svg viewBox="0 0 34 40" fill="none" aria-hidden="true"><path d="m8 14 7-11M17 23l14-6M18 32l12 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></h2><Description>Punya ide, pertanyaan, atau sekadar ingin menyapa?</Description>
      <form className="contact-form" aria-label="Form kontak demo">
        <p className="contact-demo-note" id="contact-demo-note">Demo — pengiriman belum tersedia</p>
        <label className="contact-field"><span className="fp-visually-hidden">Nama</span><UserRound size={20} aria-hidden="true" /><input name="name" type="text" placeholder="Nama" autoComplete="name" /></label>
        <label className="contact-field"><span className="fp-visually-hidden">Email</span><Mail size={20} aria-hidden="true" /><input name="email" type="email" placeholder="Email" autoComplete="email" /></label>
        <label className="contact-field contact-field--message"><span className="fp-visually-hidden">Pesan</span><MessageSquare size={20} aria-hidden="true" /><textarea name="message" placeholder="Pesan" rows="5" /></label>
        <button className="contact-submit" type="button" disabled aria-describedby="contact-demo-note">Kirim Pesan <Send size={19} aria-hidden="true" /></button>
      </form>
    </div>
    <div className="contact-side"><div className="contact-illustration" aria-hidden="true"><Image src="/images/contact/envelope.webp" width={960} height={640} alt="" sizes="(max-width: 767px) 100vw, 560px" /><svg className="contact-art-spark" viewBox="0 0 34 40" fill="none"><path d="m8 14 7-11M17 23l14-6M18 32l12 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg><div className="contact-handnote"><p>Mari<br />terhubung<br />dan bertukar<br />cerita!</p><svg viewBox="0 0 82 62" fill="none"><path d="M7 37c10 16 36 20 41 8 5-13-13-14-12-4 2 15 33 8 31-30M58 18l9-9 7 11" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
      <div className="contact-socials"><a href={site.contact.github} target="_blank" rel="noopener noreferrer"><svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg><span><strong>GitHub</strong><small>github.com/ferii007</small></span></a><a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer"><svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="3" fill="currentColor" /><circle cx="5.5" cy="6" r="1.7" fill="white" /><path d="M4 9h3v11H4zm5 0h3v1.5c1-1.6 6-2.6 6 3V20h-3v-6c0-2.5-3-2.5-3 0v6H9z" fill="white" /></svg><span><strong>LinkedIn</strong><small>linkedin.com/in/feri-ramdani</small></span></a></div>
    </div>
  </div></section>;
}
