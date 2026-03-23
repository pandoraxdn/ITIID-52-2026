// ============================================
// RUTA: src/hooks/useLogin.ts
// ============================================

import {useReducer} from 'react';
import {graphqlRequest} from '@/api/pandoraApi';
import {useAuth} from '@/context/AuthContext';
import {Usuario} from '@/interfaces/usuario.interface';

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
    case 'iniciar':  return {loading: true,  loginError: null};
    case 'error':    return {loading: false, loginError: action.payload};
    case 'limpiar':  return {loading: false, loginError: state.loginError};
  }
};

export const useLogin = () => {
  const [form, formDispatch]        = useReducer(formReducer, initialForm);
  const [loginState, loginDispatch] = useReducer(loginReducer, initialLoginState);
  const {guardarSesion} = useAuth();

  const handleInputChange = (fieldName: keyof FormData, value: string) => {
    formDispatch({type: 'handleInputChange', payload: {fieldName, value}});
  };

  // onSuccess es OPCIONAL — no necesita llamar navigate().
  // guardarSesion() ya provoca el re-render del DrawerNavigator.
  const handleSubmit = async (onSuccess?: () => void) => {
    if (!form.username.trim() || !form.password.trim()) {
      loginDispatch({type: 'error', payload: 'Ingresa tu usuario y contraseña.'});
      return;
    }

    loginDispatch({type: 'iniciar'});
    let exitoso = false;

    try {
      const data = await graphqlRequest<{login: Usuario | null}>(LOGIN_QUERY, {
        input: {
          id_usuario:    0,
          username:      form.username.trim(),
          password_hash: form.password,
        },
      });

      if (!data.login) {
        loginDispatch({type: 'error', payload: 'Usuario o contraseña incorrectos.'});
        return;
      }

      exitoso = true;
      await guardarSesion(data.login);
      onSuccess?.();

    } catch (err: any) {
      const msg = err?.message?.toLowerCase().includes('network')
        ? 'Sin conexión. Verifica tu red.'
        : 'No se pudo conectar con el servidor.';
      loginDispatch({type: 'error', payload: msg});
    } finally {
      // No despachar sobre componente desmontado en caso exitoso
      if (!exitoso) {
        loginDispatch({type: 'limpiar'});
      }
    }
  };

  return {
    form,
    handleInputChange,
    handleSubmit,
    loading:    loginState.loading,
    loginError: loginState.loginError,
  };
};
