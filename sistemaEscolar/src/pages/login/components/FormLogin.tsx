import {FormData} from "../hooks/useLoginPage";
import {InputLogin} from "./InputLogin";
import {ButtonLogin} from "./ButtonLogin";
import {AuthLink} from "./AuthLink";

interface Props {
  state: FormData;
  handleInput: (fieldName: keyof FormData, value: string | boolean) => void;
  handleSubmit: () => void;
}

export const FormLogin = ({state, handleInput, handleSubmit}: Props) => {
  {/* Form */}
  return (
    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
      <InputLogin
        handleInput={handleInput}
        placeholder="tu@email.com"
        state={state}
        title="Correo electrónico"
        type="email"
      />
      <InputLogin
        handleInput={handleInput}
        placeholder="••••••••"
        state={state}
        title="Contraseña"
        type="password"
      />
      <ButtonLogin
        type="submit"
        title="Iniciar sesión"
        action={handleSubmit}
      />
      <AuthLink
        title="¿Olvidaste tu contraseña?"
        link="/reset-password"
      />
      <AuthLink
        title="Regresar al inicio"
        link="/"
      />
    </form>
  );
};
