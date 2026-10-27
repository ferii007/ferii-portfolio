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
import { structuredData } from '@/content/seo';

export default function Home() {
  // Structured data (schema.org) for search engines; `<` is escaped so the JSON can't close the script tag.
  const jsonLd = JSON.stringify(structuredData()).replace(/</g, '\\u003c');
  return <InteractionProvider><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /><Header /><main id="top"><HeroSection /><AboutSection /><CurrentlySection /><SkillsSection /><JourneySection /><ProjectsSection /><BeyondCodingSection /><ContactSection /></main><Footer /></InteractionProvider>;
}
