import Image from 'next/image';

export default function AboutIllustration() {
  return (
    <div className="about-art" aria-hidden="true">
      <Image className="about-still-life" src="/images/about/plant-and-books.png" width={1536} height={1024} sizes="(max-width: 767px) 100vw, 520px" alt="" />
      <div className="about-note">
        <span className="about-tape" />
        <p>Belajar<br />lewat<br />membangun.</p>
        <svg className="about-note-spark" viewBox="0 0 34 34" fill="none"><path d="M7 2 5 13M20 5l-7 10M31 20l-11 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
        <svg className="about-note-underline" viewBox="0 0 110 24" fill="none"><path d="M4 12C29 7 65 6 103 9M15 21c22-5 46-6 68-6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg>
      </div>
    </div>
  );
}
