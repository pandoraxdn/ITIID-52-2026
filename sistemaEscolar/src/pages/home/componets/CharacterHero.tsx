import {motion} from "framer-motion";
import pandora from "@/assets/pandora.png";

export const CharacterHero = () => {
  return (
    <motion.div
      className="flex-1 flex justify-center"
      initial={{opacity: 0, scale: 0.95, y: 20}}
      animate={{opacity: 1, scale: 1, y: 0}}
      transition={{
        duration: 0.6,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-3xl" />
        <img
          src={pandora}
          alt="Pandora"
          className="relative z-10 w-64 drop-shadow-2xl md:w-80 lg:w-96 character-img"
        />
      </div>
    </motion.div>
  );
}
