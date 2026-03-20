// ============================================
// RUTA: src/hooks/useLogin.ts
// PROPÓSITO: Lógica del login separada de la vista.
//            Dos reducers: uno para el formulario,
//            otro para el estado de la petición.
// ============================================

import {useReducer} from 'react';
import {graphqlRequest} from '@/api/pandoraApi';
import {useAuth} from '@/context/AuthContext';
import {Usuario} from '@/interfaces/usuario.interface';

// ── Query de login ─────────────────────────────────────────────────────────────
// Mandamos id_usuario: 0 porque el DTO lo requiere
// pero el servicio de login no lo usa.
const LOGIN_QUERY = `
  query Login($input: UpdateUsuarioInput!) {
    login(input: $input) {
      id_usuario
      username
      rol_id
      empleado_id
      alumno_id
      tutor_id
      avatar_url
      ultimo_acceso
      activo
    }
  }
`;

// ── Reducer del formulario ────────────────────────────────────────────────────
export interface FormData {
  username: string;
  password: string;
}

type FormAction = {
  type: 'handleInputChange';
  payload: {fieldName: keyof FormData; value: string};
};

const initialForm: FormData = {username: '', password: ''};

const formReducer = (state: FormData, action: FormAction): FormData => {
  switch (action.type) {
    case 'handleInputChange':
      return {...state, [action.payload.fieldName]: action.payload.value};
  }
};

// ── Reducer del proceso de login ──────────────────────────────────────────────
interface LoginState {
  loading: boolean;
  loginError: string | null;
}

type LoginAction =
  | {type: 'iniciar'}
  | {type: 'error'; payload: string}
  | {type: 'limpiar'};

const initialLoginState: LoginState = {loading: false, loginError: null};

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case 'iniciar':  return {loading: true, loginError: null};
    case 'error':    return {loading: false, loginError: action.payload};
    case 'limpiar':  return {...state, loading: false};
  }
};

// ── Hook principal ─────────────────────────────────────────────────────────────
export const useLogin = () => {
  const [form, formDispatch]        = useReducer(formReducer, initialForm);
  const [loginState, loginDispatch] = useReducer(loginReducer, initialLoginState);

  const {guardarSesion} = useAuth();

  const handleInputChange = (fieldName: keyof FormData, value: string) => {
    formDispatch({type: 'handleInputChange', payload: {fieldName, value}});
  };

  // onSuccess es la función de navegación que le pasa LoginScreen
  const handleSubmit = async (onSuccess: () => void) => {

    if (!form.username || !form.password) {
      loginDispatch({type: 'error', payload: 'Ingresa tu usuario y contraseña.'});
      return;
    }

    loginDispatch({type: 'iniciar'});

    try {
      const data = await graphqlRequest<{login: Usuario | null}>(LOGIN_QUERY, {
        input: {
          id_usuario: 0,          // requerido por el DTO pero no se usa
          username: form.username,
          password_hash: form.password,
        },
      });

      const usuario = data.login;

      if (!usuario) {
        loginDispatch({type: 'error', payload: 'Usuario o contraseña incorrectos.'});
        return;
      }

      // Login exitoso — guardamos sesión y navegamos
      await guardarSesion(usuario);
      onSuccess();

    } catch {
      loginDispatch({type: 'error', payload: 'No se pudo conectar con el servidor.'});
    } finally {
      loginDispatch({type: 'limpiar'});
    }
  };

  return {
    form,
    handleInputChange,
    handleSubmit,
    loading: loginState.loading,
    loginError: loginState.loginError,
  };
};
