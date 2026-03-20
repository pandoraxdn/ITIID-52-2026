// ============================================
// RUTA: src/pages/dashboard/components/Layout.tsx
// ARCHIVO: Layout.tsx
// PROPÓSITO: Este componente define la estructura visual principal de la aplicación.
//            Contiene el menú lateral (sidebar), el encabezado superior y el área
//            donde se cargan las páginas. También maneja el tema (oscuro/claro)
//            y provee un contexto global con información de la escuela.
// ============================================

// Importaciones de React y React Router
import {type ReactNode, createContext, useContext, useState} from "react";
import {Link, useLocation} from "react-router-dom";

// Importación de íconos desde lucide-react (una librería de íconos)
import {
  GraduationCap,
  Users,
  UserCheck,
  ClipboardList,
  Award,
  Moon,
  Sun,
  IdCardIcon,
  ChevronDown,
  ChevronRight,
  UserRoundPen,
  FileUser,
  HeartHandshake,
  LogOut
} from "lucide-react";

// Importaciones de componentes de UI y utilidades
import {useTheme} from "next-themes";           // Hook para cambiar el tema (oscuro/claro)
import {Button} from "@/components/ui/button"; // Botón personalizado
import pandoraImg from "@/assets/pandora.png";    // Logo de la aplicación
import {useSchoolStore} from "../hooks/useSchoolStore"; // Hook que trae datos de la escuela
import {ParticlesBackground} from "./ParticlesBackground"; // Fondo animado de partículas
import {useAuth} from "@/context/AuthContext"; // Contexto de autenticación
import {useNavigate} from "react-router-dom";

// ============================================
// CONTEXTO GLOBAL DE LA ESCUELA
// ============================================
// Creamos un contexto para compartir los datos de la escuela (como el nombre, etc.)
// con todos los componentes hijos, sin tener que pasar props manualmente.
const SchoolContext = createContext<ReturnType<typeof useSchoolStore> | null>(null);

// Hook personalizado para usar el contexto de la escuela.
// Si se usa fuera del Layout, lanza un error para evitar problemas.
export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error("useSchool must be used inside Layout");
  return ctx;
}

// ============================================
// TIPOS PARA EL MENÚ DE NAVEGACIÓN
// ============================================
// Definimos dos tipos de elementos en el menú:
// - 'item': un enlace individual (como Dashboard).
// - 'group': un grupo que contiene varios subítems (como CRUDs y Módulos).
type NavItem = {
  type: 'item';
  to: string;
  icon: React.ElementType;
  label: string;
} | {
  type: 'group';
  label: string;
  items: {to: string; icon: React.ElementType; label: string;}[];
};

// ============================================
// CONFIGURACIÓN DEL MENÚ
// ============================================
// Aquí definimos todos los elementos del menú lateral.
// Cada objeto tiene:
// - type: 'item' o 'group'
// - label: texto visible
// - to: ruta (si es item)
// - icon: componente de ícono
// - items: lista de subítems (si es group)
const navItems: NavItem[] = [
  // Elemento individual: Dashboard (página de inicio)
  {type: 'item', to: '/dashboard', icon: GraduationCap, label: 'Dashboard'},

  // Grupo: CRUDs (operaciones de alta, baja, modificación)
  {
    type: 'group',
    label: 'CRUDs',
    items: [
      {to: '/dashboard/profesores', icon: UserCheck, label: 'Profesores'},
      {to: '/dashboard/empleados', icon: IdCardIcon, label: 'Empleados'},
      {to: '/dashboard/alumnos', icon: UserRoundPen, label: 'Alumnos'},
      {to: '/dashboard/roles', icon: FileUser, label: 'Roles'},
      {to: '/dashboard/usuarios', icon: Users, label: 'Usuarios'},
      {to: '/dashboard/tutores', icon: HeartHandshake, label: 'Tutores'},
    ],
  },
  // Grupo: Módulos (funcionalidades adicionales)
  {
    type: 'group',
    label: 'Módulos',
    items: [
      {to: '/dashboard/inscripciones', icon: ClipboardList, label: 'Inscripciones'},
      {to: '/dashboard/calificaciones', icon: Award, label: 'Calificaciones'},
    ],
  },
];

// ============================================
// COMPONENTE PRINCIPAL: Layout
// ============================================
// Este componente recibe 'children' (el contenido de la página actual)
// y lo envuelve en la estructura completa: fondo, sidebar, header y área principal.
export function Layout({children}: {children: ReactNode}) {
  // Hook de React Router para saber en qué ruta estamos actualmente.
  const location = useLocation();

  // Hook de next-themes para manejar el tema oscuro/claro.
  const {theme, setTheme} = useTheme();

  // Hook personalizado que trae los datos de la escuela (ej. nombre, configuración).
  const store = useSchoolStore();

  // Obtenemos el usuario logueado y la función para cerrar sesión del contexto.
  const {user, cerrarSesion} = useAuth();

  // Hook para redirigir al usuario después de cerrar sesión.
  const navigate = useNavigate();

  // Función que cierra la sesión y manda al usuario a la página de login.
  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  // Estado para controlar qué grupos del menú están expandidos (abiertos).
  // Inicialmente, ambos grupos empiezan cerrados (false).
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    CRUDs: false,
    Módulos: false,
  });

  // Función para cambiar el estado expandido/colapsado de un grupo.
  // Recibe el nombre del grupo y cambia su valor (true/false).
  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupLabel]: !prev[groupLabel]
    }));
  };

  // Función para determinar si una ruta está activa (la página actual).
  // - Para el Dashboard, comprobamos que sea exactamente '/dashboard'.
  // - Para otras rutas, comprobamos si la ruta actual empieza con ella.
  const isActive = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(to);
  };

  // Renderizado del componente
  return (
    // Proveemos el contexto de la escuela a todos los hijos.
    <SchoolContext.Provider value={store}>
      {/* Fondo animado de partículas */}
      <ParticlesBackground />

      {/* Contenedor principal: flex para sidebar + contenido */}
      <div className="flex min-h-screen relative z-10">
        {/* SIDEBAR (menú lateral) */}
        <aside className="w-64 border-r border-border/60 bg-sidebar/80 backdrop-blur-sm flex flex-col shrink-0">
          {/* Cabecera del sidebar: logo y nombre de la app */}
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

          {/* Navegación: recorremos todos los navItems */}
          <nav className="flex-1 p-3 space-y-2">
            {navItems.map((item) => {
              // Si el elemento es un 'item' (enlace individual)
              if (item.type === 'item') {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </Link>
                );
              } else {
                // Si es un 'group' (grupo con subítems)
                const isExpanded = expandedGroups[item.label] ?? true;
                return (
                  <div key={item.label} className="space-y-1">
                    {/* Botón del grupo: al hacer clic, expande/colapsa */}
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className="w-full flex items-center gap-1 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                      <span>{item.label}</span>
                    </button>

                    {/* Subítems: solo se muestran si el grupo está expandido */}
                    {isExpanded && (
                      <div className="space-y-0.5 pl-2">
                        {item.items.map((subItem) => {
                          const active = isActive(subItem.to);
                          return (
                            <Link
                              key={subItem.to}
                              to={subItem.to}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5'
                                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
                                }`}
                            >
                              <subItem.icon className="h-4 w-4" />
                              {subItem.label}
                              {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL (lado derecho) */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Header superior */}
          <header className="flex items-center justify-end p-4 border-b border-border/60 bg-background/60 backdrop-blur-sm gap-3">

            {/* Foto de perfil y nombre del usuario logueado */}
            <div className="flex items-center gap-2">
              <img
                src={
                  // Si ya trae el prefijo "data:" lo usamos directo,
                  // si no, le agregamos el prefijo base64 para que el navegador lo entienda
                  user?.avatar_url?.startsWith('data:')
                    ? user.avatar_url
                    : `data:image/jpeg;base64,${user?.avatar_url}`
                }
                alt={user?.username}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/40"
              />
              <span className="text-sm text-muted-foreground">
                Hola, <span className="font-medium text-foreground">{user?.username}</span>
              </span>
            </div>

            {/* Botón cambio de tema */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Botón cerrar sesión */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </header>

          {/* Área donde se renderiza la página actual (children) */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SchoolContext.Provider>
  );
}
