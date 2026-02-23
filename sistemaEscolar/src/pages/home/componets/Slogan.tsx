import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";

interface Props {
  title: string;
  subTitle: string;
  scrollTo: (id: string) => void;
}

export const Slogan = ({title, subTitle, scrollTo}: Props) => {
  return (
    <motion.div
      className="flex-1 text-center md:text-left"
      initial={{opacity: 0, y: 30}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.8}}
    >
      <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl neon-text">
        {title}{" "}
      </h1>
      <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl neon-text">
        {subTitle}
      </p>
      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        <Button size="lg" variant="default" className="background neon-gold-border" onClick={() => scrollTo("#admisiones")}>
          Proceso de Admisión
        </Button>
        <Button size="lg" variant="secondary" className="background neon-gold-border" onClick={() => scrollTo("#conocenos")}>
          Conócenos
        </Button>
      </div>
    </motion.div>
  );
};
