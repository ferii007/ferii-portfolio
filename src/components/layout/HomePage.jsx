import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/features/portfolio/sections/HeroSection';
import AboutSection from '@/features/portfolio/sections/AboutSection';
import CurrentlySection from '@/features/portfolio/sections/CurrentlySection';
import JourneySection from '@/features/portfolio/sections/JourneySection';
import ProjectsSection from '@/features/projects/components/ProjectsSection';
import BeyondCodingSection from '@/features/portfolio/sections/BeyondCodingSection';
import ContactSection from '@/features/contact/components/ContactSection';
import SkillsSection from '@/features/skills/components/SkillsSection';
import { InteractionProvider } from '@/features/interaction/InteractionProvider';
import { LocalizationProvider } from '@/context/LocalizationProvider';
import { structuredData } from '@/content/seo';
import { getLocalization } from '@/constants/localization';

// The one-page portfolio in a given language. Server sections take `language`; client ones read the provider.
export default function HomePage({ language }) {
  // Structured data (schema.org) for search engines; `<` is escaped so the JSON can't close the script tag.
  const jsonLd = JSON.stringify(structuredData(language)).replace(/</g, '\\u003c');
  return <LocalizationProvider language={language}><InteractionProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    {/* First tab stop: lets keyboard users jump past the navigation (WCAG 2.4.1). */}
    <a className="skip-link" href="#top">{getLocalization(language).text.skip_to_content}</a>
    <Header />
    <main id="top" tabIndex={-1}><HeroSection language={language} /><AboutSection language={language} /><CurrentlySection language={language} /><SkillsSection /><JourneySection language={language} /><ProjectsSection language={language} /><BeyondCodingSection /><ContactSection /></main>
    <Footer />
  </InteractionProvider></LocalizationProvider>;
}
