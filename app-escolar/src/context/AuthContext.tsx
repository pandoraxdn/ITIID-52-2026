// ============================================
// RUTA: src/context/AuthContext.tsx
// ============================================

import {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Usuario} from '@/interfaces/usuario.interface';

const STORAGE_KEY = 'usuario_sesion';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  cargando: boolean;
  guardarSesion: (user: Usuario) => void;
  cerrarSesion: () => void;
}

interface AuthState {
  user: Usuario | null;
  cargando: boolean;
}

type AuthAction =
  | {type: 'cargar'; payload: Usuario | null}
  | {type: 'login'; payload: Usuario}
  | {type: 'logout'};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'cargar': return {user: action.payload, cargando: false};
    case 'login':  return {user: action.payload, cargando: false};
    case 'logout': return {user: null, cargando: false};
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(authReducer, {user: null, cargando: true});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(guardado => dispatch({type: 'cargar', payload: guardado ? JSON.parse(guardado) : null}))
      .catch(() => dispatch({type: 'cargar', payload: null}));
  }, []);

  const guardarSesion = async (userData: Usuario) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    dispatch({type: 'login', payload: userData});
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch({type: 'logout'});
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.user !== null,
      cargando: state.cargando,
      guardarSesion,
      cerrarSesion,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
