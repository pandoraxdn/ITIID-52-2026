import {Mail, KeyRound} from "lucide-react";
import {FormData} from "../hooks/useLogin";

interface Props {
  handleInput: (fieldName: keyof FormData, value: string | boolean) => void;
  placeholder: string;
  state: FormData;
  type: "email" | "password";
}

export const InputLogin = ({handleInput, placeholder, state, type}: Props) => {
  return (
    <div className="field-group" style={{animationDelay: "0.25s"}}>
      <label className="field-label" htmlFor="email">Correo electrónico</label>
      <div className="field-wrap">
        <span className="field-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {
              type === "email"
                ? <Mail />
                : <KeyRound />
            }
          </svg>
        </span>
        <input
          id={type}
          type={type}
          className="field-input"
          placeholder={placeholder}
          value={(type === "email") ? state.email : state.password}
          onChange={(e) => handleInput(`${type}`, e.target.value)}
        />
      </div>
    </div>
  );
}
