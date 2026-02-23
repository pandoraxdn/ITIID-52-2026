import {CharacterHero} from "../componets/CharacterHero";
import {GoldenParticles} from "../componets/GoldenParticles";
import {ImageBackgroundLogo} from "../componets/ImageBackgroundLogo";
import {Slogan} from "../componets/Slogan";

export const HeroSection = () => {

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({behavior: "smooth"});
  };

  return (
    <section id="inicio" className="relative min-h-[90vh] overflow-hidden flex items-center">
      {/* School background image */}
      <ImageBackgroundLogo />
      <GoldenParticles />
      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center gap-12 px-4 py-20 md:flex-row md:gap-16 md:py-32">
        <Slogan
          title="Formando el futuro, un estudiante a la vez"
          subTitle="En el Centro Educativo Pandora cultivamos el conocimiento, los valores y la creatividad desde la educación inicial hasta la preparatoria."
          scrollTo={scrollTo}
        />
        <CharacterHero />
      </div>
    </section>
  );
};
