import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/features/portfolio/sections/HeroSection';
import AboutSection from '@/features/portfolio/sections/AboutSection';
import CurrentlySection from '@/features/portfolio/sections/CurrentlySection';
import JourneySection from '@/features/portfolio/sections/JourneySection';
import ProjectsSection from '@/features/projects/components/ProjectsSection';
import BeyondCodingSection from '@/features/portfolio/sections/BeyondCodingSection';
import ContactSection from '@/features/contact/components/ContactSection';
import { InteractionProvider } from '@/features/interaction/InteractionProvider';
import RobotExperience from '@/features/robot/components/RobotExperience';

export default function Home() {
  return <InteractionProvider><Header /><main id="top"><HeroSection /><RobotExperience /><AboutSection /><CurrentlySection /><div id="skills" className="container section"><h2>My Skills<span className="accent-dot">.</span></h2></div><JourneySection /><ProjectsSection /><BeyondCodingSection /><ContactSection /></main><Footer /></InteractionProvider>;
}
