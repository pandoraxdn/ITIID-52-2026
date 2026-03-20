// ============================================
// RUTA: src/pages/login/components/InputLogin.tsx
// ARCHIVO: InputLogin.tsx
// PROPÓSITO: Campo de entrada reutilizable para el formulario de login.
//            Soporta tipo "username" y "password".
//            Mostramos un icono diferente según el tipo de campo.
// ============================================

import {User, KeyRound} from 'lucide-react';
import {type FormData} from '../hooks/useLoginPage';

interface Props {
  handleInput: (fieldName: keyof FormData, value: string | boolean) => void;
  placeholder: string;
  state: FormData;
  title: string;
  type: 'username' | 'password';
}

export const InputLogin = ({handleInput, placeholder, state, title, type}: Props) => {
  return (
    <div className="field-group" style={{animationDelay: '0.4s'}}>
      <label className="field-label" htmlFor={type}>{title}</label>
      <div className="field-wrap">
        <span className="field-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {type === 'username' ? <User /> : <KeyRound />}
          </svg>
        </span>
        <input
          id={type}
          type={type === 'username' ? 'text' : 'password'}
          className="field-input"
          placeholder={placeholder}
          value={type === 'username' ? state.username : state.password}
          onChange={(e) => handleInput(type, e.target.value)}
        />
      </div>
    </div>
  );
};
