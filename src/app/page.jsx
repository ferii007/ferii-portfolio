import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProjectsSection from '@/features/projects/components/ProjectsSection';

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
        <ProjectsSection />
      </main>
      <Footer />
    </>
  );
}
