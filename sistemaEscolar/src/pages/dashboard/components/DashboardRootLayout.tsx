// ============================================
// ARCHIVO: DashboardRootLayout.tsx
// PROPÓSITO: Este componente define la estructura raíz del dashboard.
//            Actúa como un contenedor que provee servicios globales
//            (tema, consultas a API, tooltips y notificaciones) a
//            todas las páginas que se rendericen dentro del dashboard.
// ============================================

import React from "react";
import {Outlet} from "react-router-dom";
import {ThemeProvider} from "next-themes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster as Sonner} from "@/components/ui/sonner";

// ============================================
// CREACIÓN DEL CLIENTE DE REACT QUERY
// ============================================
// QueryClient es el objeto que gestiona el caché y las peticiones a la API.
// Lo creamos fuera del componente para que sea único en toda la aplicación
// (patrón Singleton). Así todas las llamadas a useQuery y useMutation
// compartirán la misma instancia y el mismo caché.
const queryClient = new QueryClient();

// ============================================
// COMPONENTE PRINCIPAL: DashboardRootLayout
// ============================================
// Este componente envuelve todo el contenido del dashboard con varios
// "proveedores de contexto" (Providers). Cada provider añade funcionalidades
// globales que estarán disponibles en cualquier componente hijo.
//
// El orden de los providers es importante: algunos dependen de otros,
// pero en este caso todos son independientes, así que el orden no afecta.
export const DashboardRootLayout: React.FC = () => {
  return (
    // 1. ThemeProvider: Maneja el tema claro/oscuro de la aplicación.
    //    - attribute="class": Aplica los estilos mediante clases CSS (dark/light).
    //    - defaultTheme="dark": Tema por defecto oscuro.
    //    - enableSystem={false}: No usa la preferencia del sistema operativo,
    //      solo el tema seleccionado manualmente.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>

      {/* 2. QueryClientProvider: Proporciona el cliente de React Query a toda la app.
            Cualquier componente hijo podrá usar hooks como useQuery o useMutation
            para comunicarse con el backend. */}
      <QueryClientProvider client={queryClient}>

        {/* 3. TooltipProvider: Habilita los tooltips (mensajes emergentes)
              de la librería de componentes (shadcn/ui). Sin este provider,
              los tooltips no funcionarían. */}
        <TooltipProvider>

          {/* 4. Sonner: Componente que muestra notificaciones tipo "toast"
                (mensajes breves que aparecen y desaparecen). Se coloca
                antes del Outlet para que las notificaciones se muestren
                por encima del contenido. */}
          <Sonner />

          {/* 5. Outlet: Es un componente de react-router-dom que indica
                dónde se deben renderizar las rutas hijas del dashboard.
                Por ejemplo, cuando la URL es /dashboard/usuarios, aquí
                se mostrará el componente de la página de usuarios. */}
          <Outlet />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

// ============================================
// RESUMEN:
// ============================================
// Este archivo configura el "esqueleto" global del dashboard.
// Todos los componentes que se rendericen dentro del dashboard tendrán
// acceso al tema, a React Query, a tooltips y a las notificaciones toast.
// El componente Outlet permite que las diferentes páginas (como Usuarios,
// Alumnos, etc.) se inyecten en este layout.
