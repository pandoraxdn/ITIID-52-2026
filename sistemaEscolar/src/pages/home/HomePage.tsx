import {Header} from "./sections/Header";
import {HeroSection} from "./sections/HeroSection";
import {AboutSection} from "./sections/AboutSection";
import {AcademicOfferSection} from "./sections/AcademicOfferSection";
import {AdmissionsSection} from "./sections/AdmissionsSection";
import {NewsSection} from "./sections/NewsSection";
import {ContactSection} from "./sections/ContactSection";
import {Footer} from "./sections/Footer";

export const HomePage = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroSection />
      <AboutSection />
      <AcademicOfferSection />
      <AdmissionsSection />
      <NewsSection />
      <ContactSection />
    </main>
    <Footer />
  </div>
);
