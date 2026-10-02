import { ArrowUpRight, GitBranch, Mail } from 'lucide-react';
import { site } from '@/content/site';

export default function ContactSection() {
  return <section className="section contact-section" id="contact" aria-labelledby="contact-title"><div className="container contact-grid">
    <div><p className="eyebrow">08 / Say hello</p><h2 id="contact-title">Contact Me<span className="accent-dot">.</span></h2><p>Punya ide, pertanyaan, atau sekadar ingin menyapa?</p>
      <form className="contact-form" aria-label="Form kontak demo" action="#contact">
        <p className="demo-note">Demo — pengiriman belum tersedia</p>
        <label>Nama<input name="name" type="text" placeholder="Nama kamu" autoComplete="name" /></label>
        <label>Email<input name="email" type="email" placeholder="Email kamu" autoComplete="email" /></label>
        <label>Pesan<textarea name="message" placeholder="Tulis pesanmu" rows="5" /></label>
        <button className="button button-primary" type="button" disabled>Pengiriman belum tersedia</button>
      </form>
    </div>
    <div className="contact-side"><div className="contact-illustration" aria-hidden="true"><Mail size={115} strokeWidth={1} /><span>Hi, Feri! ✦</span></div><p>Untuk saat ini, kamu bisa menemukanku di:</p><a href={site.contact.github} target="_blank" rel="noopener noreferrer"><GitBranch size={23} /> GitHub / ferii007 <ArrowUpRight size={18} /></a></div>
  </div></section>;
}
