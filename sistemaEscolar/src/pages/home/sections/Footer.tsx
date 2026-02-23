import pandoraLogo from "@/assets/pandora.png";

export const Footer = () => {

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({behavior: "smooth"});
  };

  return (
    <footer className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src={pandoraLogo} alt="Pandora" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-['Playfair_Display'] text-lg font-bold text-foreground">
                Centro Educativo Pandora
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Formando estudiantes íntegros con excelencia académica y valores humanos desde educación
              inicial hasta preparatoria.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-foreground">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {["#inicio|Inicio", "#conocenos|Conócenos", "#oferta|Oferta Académica", "#admisiones|Admisiones", "#noticias|Noticias", "#contacto|Contacto"].map((l) => {
                const [href, label] = l.split("|");
                return (
                  <li key={href}>
                    <button onClick={() => scrollTo(href)} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-foreground">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Av. Educación #123, Col. Centro</li>
              <li>(55) 1234-5678</li>
              <li>contacto@cepandora.edu.mx</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Centro Educativo Pandora. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
