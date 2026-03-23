// ============================================
// RUTA: src/pages/login/LoginPage.tsx
// ARCHIVO: LoginPage.tsx
// PROPÓSITO: Página de login. Solo se encarga de la estructura visual.
//            Toda la lógica (validar, llamar a la API, redirigir)
//            vive en el hook useLoginPage.
// ============================================

import {useEffect} from 'react';
import {CharacterLogo} from './components/CharacterLogo';
import {ButtonTheme} from './components/ButtonTheme';
import {Particles} from './components/Particles';
import {LogoLogin} from './components/LogoLogin';
import {FormLogin} from './components/FormLogin';
import {useLoginPage} from './hooks/useLoginPage';
import './styles/login.css';

export const LoginPage = () => {

  const {state, handleInputChange, handleSubmit, particles, setMounted, loading, loginError} = useLoginPage();

  // Activamos la animación de entrada al montar el componente
  useEffect(() => {
    setMounted();
  }, []);

  // Leemos el tema guardado en localStorage para aplicarlo al entrar
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (!theme) return;
    handleInputChange('dark', theme === 'dark');
  }, []);

  return (
    <div className={`login-root${state.dark ? ' dark-mode' : ' light-mode'}`}>
      <Particles arrParticles={particles} />
      <ButtonTheme isDark={state.dark} setIsDark={handleInputChange} />

      <main className="login-layout">
        {/* Panel izquierdo: formulario */}
        <section className={`form-panel${state.mounted ? ' form-mounted' : ''}`}>
          <LogoLogin
            title="Pandora's Box"
            subTitle="Abre la caja, descubre tu mundo"
          />
          <FormLogin
            state={state}
            handleInput={handleInputChange}
            handleSubmit={handleSubmit}
            loading={loading}
            loginError={loginError}
          />
        </section>

        {/* Panel derecho: personaje decorativo */}
        <CharacterLogo />
      </main>
    </div>
  );
};
