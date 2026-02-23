import {motion} from "framer-motion";
import {Calendar} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";

const news = [
  {
    title: "Inscripciones Abiertas 2026-2027",
    date: "15 Feb 2026",
    desc: "Ya están abiertas las inscripciones para el próximo ciclo escolar. ¡Asegura tu lugar!",
    tag: "Admisiones",
  },
  {
    title: "Feria de Ciencias y Tecnología",
    date: "28 Mar 2026",
    desc: "Nuestros alumnos presentarán proyectos innovadores en la feria anual de ciencias.",
    tag: "Evento",
  },
  {
    title: "Torneo Deportivo Interescolar",
    date: "10 Abr 2026",
    desc: "Pandora será sede del torneo interescolar de fútbol, basquetbol y atletismo.",
    tag: "Deportes",
  },
  {
    title: "Taller de Arte y Cultura",
    date: "05 May 2026",
    desc: "Nuevos talleres de pintura, música y teatro disponibles para todos los niveles.",
    tag: "Cultura",
  },
];

export const NewsSection = () => (
  <section id="noticias" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        className="mx-auto mb-12 max-w-2xl text-center"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
      >
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Noticias y Eventos</h2>
        <p className="text-muted-foreground">
          Mantente al día con las últimas novedades y eventos del Centro Educativo Pandora.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {news.map((n, i) => (
          <motion.div
            key={n.title}
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: i * 0.1}}
          >
            <Card className="h-full overflow-hidden border transition-shadow hover:shadow-lg">
              <div className="h-2 bg-primary" />
              <CardContent className="p-6">
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {n.tag}
                </span>
                <h4 className="mb-2 font-['Playfair_Display'] text-lg font-bold text-foreground">{n.title}</h4>
                <p className="mb-4 text-sm text-muted-foreground">{n.desc}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {n.date}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
