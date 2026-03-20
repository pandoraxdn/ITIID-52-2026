// ============================================
// RUTA: src/pages/login/components/FormLogin.tsx
// ARCHIVO: FormLogin.tsx
// PROPÓSITO: Renderiza el formulario de login.
//            Recibe los datos y funciones del hook useLoginPage
//            a través de las props. Este componente solo se encarga
//            de mostrar la UI, no de la lógica del login.
// ============================================

import {type FormData} from '../hooks/useLoginPage';
import {InputLogin} from './InputLogin';
import {ButtonLogin} from './ButtonLogin';
import {AuthLink} from './AuthLink';

interface Props {
  state: FormData;
  handleInput: (fieldName: keyof FormData, value: string | boolean) => void;
  handleSubmit: () => void;
  loading: boolean;
  loginError: string | null;
}

export const FormLogin = ({state, handleInput, handleSubmit, loading, loginError}: Props) => {
  return (
    <form className="login-form" onSubmit={(e) => e.preventDefault()}>

      {/* Campo de nombre de usuario */}
      <InputLogin
        handleInput={handleInput}
        placeholder="nombre de usuario"
        state={state}
        title="Usuario"
        type="username"
      />

      {/* Campo de contraseña */}
      <InputLogin
        handleInput={handleInput}
        placeholder="••••••••"
        state={state}
        title="Contraseña"
        type="password"
      />

      {/* Mensaje de error: solo se muestra si loginError tiene texto */}
      {loginError && (
        <p className="login-error" role="alert">
          {loginError}
        </p>
      )}

      {/* Botón de envío: se deshabilita mientras carga para evitar doble click */}
      <ButtonLogin
        type="submit"
        title={loading ? 'Verificando...' : 'Iniciar sesión'}
        action={handleSubmit}
      />

      <AuthLink title="¿Olvidaste tu contraseña?" link="/reset-password" />
      <AuthLink title="Regresar al inicio" link="/" />
    </form>
  );
};
