import {motion} from "framer-motion";
import {BookOpen, Eye, Heart, Trophy} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";

const values = [
  {
    icon: BookOpen,
    title: "Excelencia Académica",
    desc: "Programas rigurosos y actualizados que preparan a nuestros estudiantes para los retos del futuro."
  },
  {
    icon: Heart,
    title: "Valores Humanos",
    desc: "Fomentamos el respeto, la responsabilidad y la empatía como pilares de la formación integral."
  },
  {
    icon: Eye,
    title: "Innovación Educativa",
    desc: "Incorporamos tecnología y metodologías modernas para un aprendizaje significativo."
  },
  {
    icon: Trophy,
    title: "Desarrollo Integral",
    desc: "Actividades deportivas, artísticas y culturales que complementan la formación académica."
  },
];

const fadeUp = {
  hidden: {opacity: 0, y: 30},
  visible: (i: number) => ({opacity: 1, y: 0, transition: {delay: i * 0.15, duration: 0.5}}),
};

export const AboutSection = () => (
  <section id="conocenos" className="bg-secondary/30 py-20">
    <div className="container mx-auto px-4">
      <motion.div
        className="mx-auto mb-16 max-w-2xl text-center"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.5}}
      >
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Conócenos</h2>
        <p className="text-muted-foreground">
          Desde nuestra fundación, el Centro Educativo Pandora se ha dedicado a brindar una educación
          de calidad con calidez humana. Nuestra comunidad educativa trabaja día a día para formar
          ciudadanos íntegros, críticos y comprometidos con la sociedad.
        </p>
      </motion.div>

      <div className="mx-auto mb-16 grid max-w-4xl gap-6 md:grid-cols-2">
        <motion.div
          className="rounded-xl border color-card p-8"
          initial={{opacity: 0, x: -20}}
          whileInView={{opacity: 1, x: 0}}
          viewport={{once: true}}
        >
          <h3 className="mb-3 text-xl font-bold text-primary">Nuestra Misión</h3>
          <p className="text-muted-foreground">
            Formar estudiantes competentes, creativos y con sólidos valores éticos a través de una
            educación integral que les permita enfrentar los desafíos de un mundo en constante cambio.
          </p>
        </motion.div>
        <motion.div
          className="rounded-xl border bg-card p-8"
          initial={{opacity: 0, x: 20}}
          whileInView={{opacity: 1, x: 0}}
          viewport={{once: true}}
        >
          <h3 className="mb-3 text-xl font-bold text-primary">Nuestra Visión</h3>
          <p className="text-muted-foreground">
            Ser reconocidos como una institución educativa líder en innovación pedagógica, formación
            en valores y excelencia académica en todos los niveles educativos.
          </p>
        </motion.div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <motion.div key={v.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once: true}}>
            <Card className="h-full border-none bg-card shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <v.icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="mb-2 font-['Playfair_Display'] text-lg font-bold text-foreground">{v.title}</h4>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
