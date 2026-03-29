// ============================================
// RUTA: src/pages/login/hooks/useLoginPage.tsx
// ARCHIVO: useLoginPage.tsx
// PROPÓSITO: Manejar toda la lógica de la página de login.
//            La vista (LoginPage) no sabe cómo funciona el login,
//            solo llama a las funciones que este hook le da.
//            Esto se llama separación de responsabilidades.
// ============================================

import {useReducer} from 'react';
import {useNavigate} from 'react-router-dom';
import {pandoraApi} from '@/api/pandoraApi';
import {useAuth} from '@/context/AuthContext';
import {LOGIN_USUARIO} from '@/pages/dashboard/graphql/usuarios';
import {type Usuario} from '@/pages/dashboard/interfaces/usuario.interface';

// ============================================
// TIPOS E INTERFACES
// ============================================

// Representa cada partícula animada del fondo de la pantalla de login.
export interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// Representa el estado del formulario.
// Cambiamos "email" por "username" para que coincida con el backend.
export interface FormData {
  username: string;
  password: string;
  dark: boolean;
  mounted: boolean;
}

// ============================================
// REDUCER DEL FORMULARIO
// ============================================
// Un reducer es una función que recibe el estado actual y una acción,
// y devuelve el nuevo estado. Es útil cuando hay varios campos
// relacionados que cambian juntos.
type FormAction = {
  type: 'handleInputChange';
  payload: { fieldName: keyof FormData; value: string | boolean };
};

const initialForm: FormData = {
  username: '',
  password: '',
  dark: false,
  mounted: false,
};

const formReducer = (state: FormData, action: FormAction): FormData => {
  switch (action.type) {
    case 'handleInputChange':
      // Crea un nuevo objeto con todos los valores anteriores (...state)
      // pero reemplaza solo el campo que cambió.
      return { ...state, [action.payload.fieldName]: action.payload.value };
  }
};

// ============================================
// REDUCER DEL PROCESO DE LOGIN
// ============================================
// Agrupa los estados de carga y error en un solo reducer,
// lo que hace más fácil ver todos los posibles estados del login:
// - idle: sin hacer nada
// - loading: esperando respuesta del servidor
// - error: ocurrió un problema
interface LoginState {
  loading: boolean;
  loginError: string | null;
}

type LoginAction =
  | { type: 'iniciar' }
  | { type: 'error'; payload: string }
  | { type: 'limpiar' };

const initialLoginState: LoginState = {
  loading: false,
  loginError: null,
};

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case 'iniciar':
      // Comenzamos la petición: activamos loading y limpiamos el error anterior
      return { loading: true, loginError: null };
    case 'error':
      // Ocurrió un error: guardamos el mensaje y quitamos el loading
      return { loading: false, loginError: action.payload };
    case 'limpiar':
      // Petición terminada (éxito o fallo): quitamos el loading
      return { ...state, loading: false };
  }
};

// ============================================
// FUNCIÓN AUXILIAR: Generar partículas
// ============================================
const generarParticulas = (cantidad: number): Particle[] => {
  return Array.from({ length: cantidad }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 4 + 6,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.6 + 0.2,
  }));
};

// ============================================
// HOOK PRINCIPAL
// ============================================
export const useLoginPage = (PARTICLE_COUNT = 80) => {

  // useReducer para el formulario (username, password, dark, mounted)
  const [state, dispatch] = useReducer(formReducer, initialForm);

  // useReducer para el proceso de login (loading y error)
  const [loginState, loginDispatch] = useReducer(loginReducer, initialLoginState);

  // Generamos las partículas una sola vez
  const particles: Particle[] = generarParticulas(PARTICLE_COUNT);

  // Hooks externos que necesitamos
  const { guardarSesion } = useAuth();   // Para guardar el usuario en el contexto
  const navigate = useNavigate();        // Para redirigir al dashboard

  // ---- Funciones del formulario ----

  // Marca el componente como "montado" para activar la animación de entrada
  const setMounted = () => {
    dispatch({ type: 'handleInputChange', payload: { fieldName: 'mounted', value: true } });
  };

  // Actualiza cualquier campo del formulario cuando el usuario escribe
  const handleInputChange = (fieldName: keyof FormData, value: string | boolean) => {
    dispatch({ type: 'handleInputChange', payload: { fieldName, value } });
  };

  // ---- Función principal: enviar el formulario ----
  const handleSubmit = async () => {

    // Validación básica antes de llamar a la API
    if (!state.username || !state.password) {
      loginDispatch({ type: 'error', payload: 'Por favor ingresa tu usuario y contraseña.' });
      return;
    }

    // Activamos loading y limpiamos el error anterior
    loginDispatch({ type: 'iniciar' });

    try {
      // Llamamos a la API de GraphQL con la query LOGIN_USUARIO.
      // Enviamos username y password_hash (el backend compara con bcrypt).
      const response = await pandoraApi.post('', {
        query: LOGIN_USUARIO,
        variables: {
          input: {
            id_usuario: 0, // requerido por el DTO pero no se usa en el login
            username: state.username,
            password_hash: state.password,
          },
        },
      });

      // Si GraphQL devuelve errores en la respuesta, las credenciales son incorrectas
      if (response.data.errors) {
        loginDispatch({ type: 'error', payload: 'Usuario o contraseña incorrectos.' });
        return;
      }

      // Extraemos el usuario de la respuesta
      const usuario: Usuario | null = response.data?.data?.login ?? null;

      // Si el backend devuelve null, las credenciales no coincidieron
      if (!usuario) {
        loginDispatch({ type: 'error', payload: 'Usuario o contraseña incorrectos.' });
        return;
      }

      // ¡Login exitoso! Guardamos el usuario en el contexto y redirigimos
      guardarSesion(usuario);
      navigate('/dashboard');

    } catch {
      // Error de red o del servidor
      loginDispatch({ type: 'error', payload: 'No se pudo conectar con el servidor.' });
    } finally {
      // Siempre quitamos el loading, tanto si hubo error como si no
      loginDispatch({ type: 'limpiar' });
    }
  };

  return {
    state,
    handleInputChange,
    handleSubmit,
    particles,
    setMounted,
    loading: loginState.loading,
    loginError: loginState.loginError,
  };
};
