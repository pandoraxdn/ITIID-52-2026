import {useState, useEffect} from "react";
import './styles/login.css';
import {useLogin} from "./hooks/useLogin";
import {ButtonTheme} from "./components/BottonTheme";
import {Particles} from "./components/Particles";
import {LogoLogin} from "./components/LogoLogin";
import {FormLogin} from "./components/FormLogin";
import {CharacterLogin} from "./components/CharacterLogin";

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
            title="Ingresar al sistema"
            subTitle="Bienvenido al sistema"
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
