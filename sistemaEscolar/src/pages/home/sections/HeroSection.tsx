import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import pandoraMascot from "@/assets/pandora.png";
import schoolBg from "@/assets/school-bg.jpg";
import {GoldenParticles} from "../components/GoldenParticles";

export const HeroSection = () => {

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({behavior: "smooth"});
  };

  return (
    <section id="inicio" className="relative min-h-[90vh] overflow-hidden flex items-center">
      {/* School background image */}
      <div className="absolute inset-0">
        <img src={schoolBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/30 dark:from-background/95 dark:via-background/80 dark:to-background/40" />
      </div>

      <GoldenParticles />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center gap-12 px-4 py-20 md:flex-row md:gap-16 md:py-32">
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.7}}
        >
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Formando el futuro,{" "}
            <span className="text-primary">un estudiante a la vez</span>
          </h1>
          <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
            En el Centro Educativo Pandora cultivamos el conocimiento, los valores y la creatividad
            desde la educación inicial hasta la preparatoria.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            <Button size="lg" className="neon-gold-border bg-primary font-semibold" onClick={() => scrollTo("#admisiones")}>
              Proceso de Admisión
            </Button>
            <Button size="lg" variant="outline" className="neon-gold-border" onClick={() => scrollTo("#conocenos")}>
              Conócenos
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center"
          initial={{opacity: 0, scale: 0.9}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.7, delay: 0.2}}
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/10 blur-3xl" />
            <img
              src={pandoraMascot}
              alt="Mascota Pandora"
              className="
                character-img
                relative 
                z-10 
                w-64 
                drop-shadow-2xl 
                md:w-80 
                lg:w-96
              "
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
