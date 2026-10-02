import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="container hero" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow">— Hello, World!</p>
            <h1 id="hero-title">Feri Ramdani</h1>
            <p className="hero-role">Full Stack Developer</p>
            <p className="hero-copy">Aku suka membangun website, mencoba ide baru, dan belajar lewat prosesnya.</p>
            <a className="button button-primary" href="#projects">Lihat proyek →</a>
          </div>
        </section>
        <section className="container section" id="projects" aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
        </section>
      </main>
      <Footer />
    </>
  );
}
