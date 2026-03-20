// ============================================
// RUTA: src/context/AuthContext.tsx
// ARCHIVO: AuthContext.tsx
// PROPÓSITO: Guardar la información del usuario que inició sesión
//            y compartirla con TODA la aplicación.
//
// ¿Qué es un Context en React?
// Es una forma de pasar datos a cualquier componente sin tener que
// pasarlos manualmente de padre a hijo a nieto (prop drilling).
// Funciona como una "variable global" pero de forma ordenada.
// ============================================

import {createContext, useContext, useReducer, type ReactNode} from 'react';
import {type Usuario} from '@/pages/dashboard/interfaces/usuario.interface';

// ============================================
// 1. DEFINIR QUÉ DATOS TENDRÁ EL CONTEXTO
// ============================================
// Aquí describimos las propiedades y funciones que cualquier
// componente podrá usar cuando consuma este contexto.
interface AuthContextType {
  user: Usuario | null;        // El usuario logueado (null si no hay sesión)
  isAuthenticated: boolean;    // true si hay un usuario logueado
  guardarSesion: (user: Usuario) => void;  // Función para iniciar sesión
  cerrarSesion: () => void;                // Función para cerrar sesión
}

// ============================================
// 2. REDUCER DEL CONTEXTO
// ============================================
// El estado del contexto solo tiene un campo: el usuario.
// Las acciones posibles son "login" (guardar usuario) y "logout" (borrarlo).
interface AuthState {
  user: Usuario | null;
}

type AuthAction =
  | { type: 'login'; payload: Usuario }
  | { type: 'logout' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload };
    case 'logout':
      return { ...state, user: null };
  }
};

// ============================================
// 3. CREAR EL CONTEXTO
// ============================================
// createContext crea el "recipiente" donde vivirán los datos.
// Le ponemos undefined como valor inicial porque todavía no hay datos.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// 4. CREAR EL PROVIDER
// ============================================
// El Provider es el componente que "envuelve" a la app y
// hace que todos los hijos puedan acceder a los datos del contexto.
// "children" representa todos los componentes que estén adentro.
export const AuthProvider = ({children}: {children: ReactNode}) => {

  // Leemos desde localStorage para que la sesión persista al recargar la página.
  // Este valor solo se usa la primera vez que el componente se monta.
  const usuarioGuardado = localStorage.getItem('usuario_sesion');
  const estadoInicial: AuthState = {
    user: usuarioGuardado ? JSON.parse(usuarioGuardado) : null,
  };

  const [state, dispatch] = useReducer(authReducer, estadoInicial);

  // Función para guardar la sesión cuando el login es exitoso.
  // Guardamos el usuario tanto en el estado (dispatch) como en localStorage.
  const guardarSesion = (userData: Usuario) => {
    localStorage.setItem('usuario_sesion', JSON.stringify(userData));
    dispatch({ type: 'login', payload: userData });
  };

  // Función para cerrar sesión.
  // Eliminamos el usuario del estado y del localStorage.
  const cerrarSesion = () => {
    localStorage.removeItem('usuario_sesion');
    dispatch({ type: 'logout' });
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.user !== null,
      guardarSesion,
      cerrarSesion,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// 4. CREAR EL HOOK useAuth
// ============================================
// Este hook es un "atajo" para consumir el contexto fácilmente.
// En vez de escribir useContext(AuthContext) en cada componente,
// simplemente escribimos useAuth() y listo.
export const useAuth = () => {
  const contexto = useContext(AuthContext);

  // Si alguien usa useAuth() fuera del AuthProvider, lanzamos un error
  // claro para que sea fácil de detectar durante el desarrollo.
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }

  return contexto;
};
