import { ArrowUpRight, GitBranch, Mail } from 'lucide-react';
import { site } from '@/content/site';

export default function ContactSection() {
  return <section className="section contact-section fp-section" id="contact" aria-labelledby="contact-title"><div className="container contact-grid fp-container fp-contact">
    <div><p className="eyebrow fp-eyebrow">08 / Say hello</p><h2 className="fp-h2 fp-section-title" id="contact-title">Contact Me<span className="accent-dot">.</span></h2><p>Punya ide, pertanyaan, atau sekadar ingin menyapa?</p>
      <form className="contact-form grid gap-3" aria-label="Form kontak demo">
        <p className="demo-note fp-badge fp-badge--warm">Demo — pengiriman belum tersedia</p>
        <label className="fp-field"><span className="fp-label">Nama</span><input className="fp-input" name="name" type="text" placeholder="Nama kamu" autoComplete="name" /></label>
        <label className="fp-field"><span className="fp-label">Email</span><input className="fp-input" name="email" type="email" placeholder="Email kamu" autoComplete="email" /></label>
        <label className="fp-field"><span className="fp-label">Pesan</span><textarea className="fp-input" name="message" placeholder="Tulis pesanmu" rows="5" /></label>
        <button className="button button-primary fp-btn fp-btn--primary" type="button" disabled>Pengiriman belum tersedia</button>
      </form>
    </div>
    <div className="contact-side"><div className="contact-illustration fp-panel" aria-hidden="true"><div className="contact-letter"><Mail size={100} strokeWidth={1.2} /><span>Hi, Feri! ✦</span></div><span className="contact-spark contact-spark-one">✳</span><span className="contact-spark contact-spark-two">✦</span></div><p>Untuk saat ini, kamu bisa menemukanku di:</p><a href={site.contact.github} target="_blank" rel="noopener noreferrer"><GitBranch size={23} /> GitHub / ferii007 <ArrowUpRight size={18} /></a></div>
  </div></section>;
}
