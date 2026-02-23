import {motion} from "framer-motion";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Baby, Shapes, BookOpen, GraduationCap, School} from "lucide-react";

const levels = [
  {
    id: "inicial",
    label: "Inicial",
    icon: Baby,
    ages: "0 – 3 años",
    desc: "Estimulación temprana y desarrollo psicomotriz en un ambiente seguro, cálido y lúdico que potencia las habilidades naturales de cada niño.",
    features: ["Estimulación temprana", "Desarrollo sensorial", "Psicomotricidad", "Socialización"],
  },
  {
    id: "preescolar",
    label: "Preescolar",
    icon: Shapes,
    ages: "3 – 6 años",
    desc: "Aprendizaje a través del juego y la exploración, desarrollando las bases cognitivas, sociales y emocionales para el ingreso a primaria.",
    features: ["Lectoescritura inicial", "Pensamiento lógico", "Expresión artística", "Inglés básico"],
  },
  {
    id: "primaria",
    label: "Primaria",
    icon: BookOpen,
    ages: "6 – 12 años",
    desc: "Formación académica sólida con enfoque en competencias clave, fomentando la curiosidad, el pensamiento crítico y el trabajo colaborativo.",
    features: ["Programa bilingüe", "Ciencias y tecnología", "Deportes", "Valores y civismo"],
  },
  {
    id: "secundaria",
    label: "Secundaria",
    icon: School,
    ages: "12 – 15 años",
    desc: "Preparación académica rigurosa que fortalece el razonamiento analítico, la investigación y las habilidades socioemocionales de los jóvenes.",
    features: ["Laboratorios de ciencias", "Talleres tecnológicos", "Orientación vocacional", "Actividades culturales"],
  },
  {
    id: "preparatoria",
    label: "Preparatoria",
    icon: GraduationCap,
    ages: "15 – 18 años",
    desc: "Formación preuniversitaria integral con áreas de especialización que prepara a los estudiantes para el éxito en la educación superior y la vida profesional.",
    features: ["Áreas de especialización", "Preparación universitaria", "Proyectos de investigación", "Servicio social"],
  },
];

export const AcademicOfferSection = () => (
  <section id="oferta" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        className="mx-auto mb-12 max-w-2xl text-center"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
      >
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Oferta Académica</h2>
        <p className="text-muted-foreground">
          Acompañamos a nuestros estudiantes en cada etapa de su desarrollo con programas educativos
          diseñados para su edad y necesidades.
        </p>
      </motion.div>

      <Tabs defaultValue="inicial" className="mx-auto max-w-4xl">
        <TabsList className="mb-8 flex h-auto flex-wrap justify-center gap-2 bg-transparent">
          {levels.map((l) => (
            <TabsTrigger
              key={l.id}
              value={l.id}
              className="gap-2 rounded-full border bg-card px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {levels.map((l) => (
          <TabsContent key={l.id} value={l.id}>
            <motion.div
              className="rounded-xl border bg-card p-8 shadow-sm"
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.3}}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <l.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{l.label}</h3>
                  <span className="text-sm text-primary font-medium">{l.ages}</span>
                </div>
              </div>
              <p className="mb-6 text-muted-foreground">{l.desc}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {l.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  </section>
);
