import {useState, useEffect} from "react";
import {useLogin} from "./hooks/useLogin";
import {Particles} from "./components/Particles";
import {ButtonTheme} from "./components/ButtonTheme";
import {LogoLogin} from "./components/LogoLogin";
import {FormLogin} from "./components/FormLogin";
import {CharacterLogin} from "./components/CharacterLogin";
import './styles/login.css';

export const LoginPage = () => {

  const {state, handleInputChange, handleSubmit, particles, setMount} = useLogin();

  useEffect(() => {
    setMount();
  }, []);

  return (
    <div className={`login-root${state.dark ? " dark-mode" : " light-mode"}`}>
      {/* Particles */}
      <Particles
        arrParticles={particles}
      />
      {/* Theme Toggle */}
      <ButtonTheme
        isDark={state.dark}
        setIsDark={handleInputChange}
      />
      {/* Main Layout */}
      <main className="login-layout">
        {/* LEFT — Form */}
        <section className={`form-panel${state.mounted ? " form-mounted" : ""}`}>
          {/* Logo */}
          <LogoLogin
            title="Pandora's Box"
            subTitle="Abre la caja, descubre tu mundo"
          />
          {/* Form */}
          <FormLogin
            state={state}
            handleInput={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </section>
        {/* RIGHT — Character */}
        <CharacterLogin />
      </main>
    </div>
  );
};
