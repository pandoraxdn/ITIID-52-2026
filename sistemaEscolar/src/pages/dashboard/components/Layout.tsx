// ============================================
// ARCHIVO: Layout.tsx
// ============================================
import {ReactNode, createContext, useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
  Award,
  Moon,
  Sun,
  IdCardIcon,
} from 'lucide-react';
import {useTheme} from 'next-themes';
import {Button} from '@/components/ui/button';
import pandoraImg from '@/assets/pandora.png';
import {useSchoolStore} from '../hooks/useSchoolStore';
import {ParticlesBackground} from './ParticlesBackground';

// -------------------------------------------------------------------
// Contexto para el store global de la escuela
// -------------------------------------------------------------------
/**
 * Contexto React que proporciona el store de la escuela (useSchoolStore) a todos los componentes
 * dentro del Layout. Esto evita tener que pasar el store manualmente por props.
 */
const SchoolContext = createContext<ReturnType<typeof useSchoolStore> | null>(null);

/**
 * Hook personalizado para acceder al store de la escuela desde cualquier componente hijo.
 * Debe ser usado dentro del componente Layout, de lo contrario lanza un error.
 *
 * @returns {ReturnType<typeof useSchoolStore>} El store de la escuela.
 * @throws {Error} Si se usa fuera del proveedor SchoolContext.
 */
export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error('useSchool must be used inside Layout');
  return ctx;
}

// -------------------------------------------------------------------
// Configuración de elementos de navegación del sidebar
// -------------------------------------------------------------------
/**
 * Arreglo que define las rutas, íconos y etiquetas de los elementos del menú lateral.
 * Se utiliza para renderizar los enlaces de navegación de forma dinámica.
 */
const navItems = [
  {to: '/dashboard', icon: GraduationCap, label: 'Dashboard'},
  {to: '/dashboard/alumnos', icon: Users, label: 'Alumnos'},
  {to: '/dashboard/materias', icon: BookOpen, label: 'Materias'},
  {to: '/dashboard/profesores', icon: UserCheck, label: 'Profesores'},
  {to: '/dashboard/inscripciones', icon: ClipboardList, label: 'Inscripciones'},
  {to: '/dashboard/calificaciones', icon: Award, label: 'Calificaciones'},
  {to: '/dashboard/Empleados', icon: IdCardIcon, label: 'Empleados'},
];

// -------------------------------------------------------------------
// Componente principal de Layout
// -------------------------------------------------------------------
/**
 * Componente de layout que envuelve toda la aplicación. Proporciona:
 * - Fondo animado de partículas (ParticlesBackground).
 * - Barra lateral (sidebar) con navegación y logo.
 * - Header superior con botón de cambio de tema (claro/oscuro).
 * - Área principal (main) donde se renderizan las páginas hijas.
 * - Contexto del store de la escuela para toda la aplicación.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {ReactNode} props.children - Contenido de la página actual.
 * @returns {JSX.Element} Estructura completa del layout.
 */
export function Layout({children}: {children: ReactNode}) {
  const location = useLocation();
  const {theme, setTheme} = useTheme();
  const store = useSchoolStore();

  return (
    <SchoolContext.Provider value={store}>
      {/* Fondo animado de partículas */}
      <ParticlesBackground />

      {/* Contenedor principal con alto mínimo de pantalla y posición relativa para superponer sobre el fondo */}
      <div className="flex min-h-screen relative z-10">
        {/* Barra lateral */}
        <aside className="w-64 border-r border-border/60 bg-sidebar/80 backdrop-blur-sm flex flex-col shrink-0">
          {/* Cabecera del sidebar con logo y nombre de la aplicación */}
          <div className="p-5 border-b border-border/60">
            <div className="flex items-center gap-3">
              <img
                src={pandoraImg}
                alt="Pandora"
                className="h-10 w-10 rounded-full object-cover object-top ring-2 ring-primary/60 shadow-lg shadow-primary/10"
              />
              <div>
                <h1 className="font-display text-base font-bold">Pandora</h1>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Sistema Escolar
                </p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map(({to, icon: Icon, label}) => {
              // Determina si la ruta actual coincide con el enlace (para resaltar el elemento activo)
              const active =
                to === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Contenido principal (derecha) */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Header superior con botón de cambio de tema */}
          <header className="flex items-center justify-end p-4 border-b border-border/60 bg-background/60 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </header>

          {/* Área donde se renderiza la página actual (children) */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SchoolContext.Provider>
  );
}
