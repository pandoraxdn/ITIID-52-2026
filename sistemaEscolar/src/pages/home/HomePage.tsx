import {AboutSection} from "./sections/AboutSection";
import {AcademicOfferSection} from "./sections/AcademicOfferSection";
import {AdmissionsSection} from "./sections/AdmissionsSection";
import {ContactSection} from "./sections/ContactSection";
import {Footer} from "./sections/Footer";
import {Header} from "./sections/Header";
import {HeroSection} from "./sections/HeroSection";
import {NewsSection} from "./sections/NewsSection";
import './styles/page.css';

export const HomePage = () => {
  return (
    <div
      className="min-h-screen bg-background"
    >
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <AcademicOfferSection />
        <AdmissionsSection />
        <NewsSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
};
