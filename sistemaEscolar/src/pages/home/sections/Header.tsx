import {useState} from "react";
import {Link} from "react-router";
import {Menu, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ThemeToggle} from "../componets/ThemeToggle";
import pandoraLogo from "@/assets/pandora.png";

const navLinks = [
  {label: "Inicio", href: "#inicio"},
  {label: "Conócenos", href: "#conocenos"},
  {label: "Oferta Académica", href: "#oferta"},
  {label: "Admisiones", href: "#admisiones"},
  {label: "Noticias", href: "#noticias"},
  {label: "Contacto", href: "#contacto"},
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({behavior: "smooth"});
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="#inicio" onClick={() => scrollTo("#inicio")} className="flex items-center gap-3">
          <img src={pandoraLogo} alt="Pandora" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-['Playfair_Display'] text-lg font-bold tracking-tight text-foreground md:text-xl">
            Centro Educativo Pandora
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              variant="ghost"
              className="
                neon-gold-border 
                rounded-md 
                border 
                border-transparent 
                px-3 
                py-2 
                text-sm 
                font-medium 
                text-muted-foreground 
                transition-all 
                hover:text-foreground
              "
            >
              {l.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="hidden sm:block">
            <Button variant="secondary" className="neon-gold-border font-semibold">Iniciar Sesión</Button>
          </Link>
          <button
            className="ml-1 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t bg-background px-4 pb-4 lg:hidden">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="
                neon-gold-border 
                block 
                w-full 
                py-3 
                text-left 
                text-sm 
                font-medium 
                text-muted-foreground 
                transition-colors 
                hover:text-foreground
                mt-2
              "
            >
              {l.label}
            </button>
          ))}
          <Link to="/login" className="mt-2 block sm:hidden">
            <Button variant="secondary" className="neon-gold-border w-full bg-primary font-semibold">Iniciar Sesión</Button>
          </Link>
        </nav>
      )}
    </header>
  );
};
