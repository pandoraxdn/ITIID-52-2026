// ============================================
// RUTA: src/context/ThemeContext.tsx
// PROPÓSITO: Controla el tema claro/oscuro de toda la app móvil.
//            Persiste la preferencia con AsyncStorage.
// ============================================

import {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';

const THEME_KEY = 'app_theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';   // tema efectivo que se aplica
  mode: ThemeMode;            // preferencia guardada (puede ser 'system')
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

interface ThemeState {
  mode: ThemeMode;
  cargando: boolean;
}

type ThemeAction =
  | {type: 'cargar'; payload: ThemeMode}
  | {type: 'set'; payload: ThemeMode};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'cargar': return {mode: action.payload, cargando: false};
    case 'set':    return {mode: action.payload, cargando: false};
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const systemScheme = useColorScheme() ?? 'light';
  const [state, dispatch] = useReducer(themeReducer, {mode: 'system', cargando: true});

  // Cargar preferencia guardada al montar
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then(guardado => dispatch({type: 'cargar', payload: (guardado as ThemeMode) ?? 'system'}))
      .catch(() => dispatch({type: 'cargar', payload: 'system'}));
  }, []);

  const setMode = async (mode: ThemeMode) => {
    await AsyncStorage.setItem(THEME_KEY, mode);
    dispatch({type: 'set', payload: mode});
  };

  const theme: 'light' | 'dark' =
    state.mode === 'system' ? systemScheme : state.mode;

  const toggleTheme = () => {
    setMode(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      mode: state.mode,
      isDark: theme === 'dark',
      setMode,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
};
