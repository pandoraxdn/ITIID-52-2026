import {FormData} from "../hooks/useLogin";
import {AuthLink} from "./AuthLink";
import {ButtonLogin} from "./ButtonLogin";
import {InputLogin} from "./InputLogin";

interface Props {
  state: FormData;
  handleInput: (fieldName: keyof FormData, value: string | boolean) => void;
  handleSubmit: () => void;
}
export const FormLogin = (state, handleInput, handleSubmit) => {
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
        placeholder="*********"
        state={state}
        title="Contraseña"
        type="password"
      />
      <ButtonLogin
        title="Iniciar Sesión"
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
}
