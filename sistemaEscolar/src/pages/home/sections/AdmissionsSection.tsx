import {motion} from "framer-motion";
import {ClipboardList, FileText, UserCheck, CalendarCheck} from "lucide-react";
import {Button} from "@/components/ui/button";

const steps = [
  {icon: ClipboardList, title: "Solicitud", desc: "Completa el formulario de solicitud de admisión en línea o en nuestras oficinas."},
  {icon: FileText, title: "Documentación", desc: "Entrega los documentos requeridos: acta de nacimiento, CURP, boletas anteriores y fotografías."},
  {icon: UserCheck, title: "Evaluación", desc: "Evaluación diagnóstica del alumno y entrevista con los padres de familia."},
  {icon: CalendarCheck, title: "Inscripción", desc: "Una vez aprobado, formaliza la inscripción y recibe la información de inicio de clases."},
];

export const AdmissionsSection = () => (
  <section id="admisiones" className="bg-secondary/30 py-20">
    <div className="container mx-auto px-4">
      <motion.div
        className="mx-auto mb-14 max-w-2xl text-center"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
      >
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Admisiones</h2>
        <p className="text-muted-foreground">
          El proceso de admisión del Centro Educativo Pandora es sencillo y transparente.
          Sigue estos pasos para formar parte de nuestra comunidad.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            className="relative flex flex-col items-center text-center"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: i * 0.15}}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <s.icon className="h-7 w-7" />
            </div>
            <span className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">Paso {i + 1}</span>
            <h4 className="mb-2 font-['Playfair_Display'] text-lg font-bold text-foreground">{s.title}</h4>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" className="bg-primary font-semibold" onClick={() => document.querySelector("#contacto")?.scrollIntoView({behavior: "smooth"})}>
          Solicitar Información
        </Button>
      </div>
    </div>
  </section>
);
