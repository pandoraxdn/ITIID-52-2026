import {motion} from "framer-motion";
import {MapPin, Phone, Mail} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

export const ContactSection = () => (
  <section id="contacto" className="bg-secondary/30 py-20">
    <div className="container mx-auto px-4">
      <motion.div
        className="mx-auto mb-12 max-w-2xl text-center"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
      >
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Contacto</h2>
        <p className="text-muted-foreground">
          ¿Tienes preguntas? Estamos aquí para ayudarte. Contáctanos y con gusto te atenderemos.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        {/* Form */}
        <motion.form
          className="space-y-5 rounded-xl border bg-card p-8 shadow-sm"
          initial={{opacity: 0, x: -20}}
          whileInView={{opacity: 1, x: 0}}
          viewport={{once: true}}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Nombre completo" />
            <Input placeholder="Correo electrónico" type="email" />
          </div>
          <Input placeholder="Teléfono" type="tel" />
          <Textarea placeholder="Escribe tu mensaje..." rows={5} />
          <Button type="submit" className="w-full bg-primary font-semibold">
            Enviar Mensaje
          </Button>
        </motion.form>

        {/* Info */}
        <motion.div
          className="flex flex-col justify-center gap-8"
          initial={{opacity: 0, x: 20}}
          whileInView={{opacity: 1, x: 0}}
          viewport={{once: true}}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Dirección</h4>
              <p className="text-sm text-muted-foreground">Av. Educación #123, Col. Centro, Ciudad, CP 12345</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Teléfono</h4>
              <p className="text-sm text-muted-foreground">(55) 1234-5678</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Correo</h4>
              <p className="text-sm text-muted-foreground">contacto@cepandora.edu.mx</p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="h-48 w-full overflow-hidden rounded-xl border bg-muted flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Mapa — próximamente</span>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
