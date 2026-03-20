// ============================================
// RUTA: src/router/ProtectedRoute.tsx
// ARCHIVO: ProtectedRoute.tsx
// PROPÓSITO: Proteger rutas que solo deben verse si hay sesión activa.
//
// ¿Cómo funciona?
// - Si el usuario SÍ está logueado → muestra el contenido (children).
// - Si el usuario NO está logueado → lo redirige a /login.
//
// Lo usaremos en el router para "envolver" las rutas del dashboard.
// ============================================

import {Navigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {type ReactNode} from 'react';

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({children}: Props) => {
  const {isAuthenticated} = useAuth();

  // Si no está autenticado, redirigimos a login y no mostramos nada más
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si sí está autenticado, renderizamos los componentes hijos normalmente
  return <>{children}</>;
};
