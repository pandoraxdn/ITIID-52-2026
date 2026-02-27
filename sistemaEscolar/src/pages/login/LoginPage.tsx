import {useEffect} from "react";
import {CharacterLogo} from "./components/CharacterLogo";
import {ButtonTheme} from "./components/ButtonTheme";
import {Particles} from "./components/Particles";
import {LogoLogin} from "./components/LogoLogin";
import {FormLogin} from "./components/FormLogin";
import {useLoginPage} from "./hooks/useLoginPage";
import {usePageStyle} from "@/hooks/usePageStyle";
import './styles/login.css';

export const LoginPage = () => {

  const {state, handleInputChange, handleSubmit, particles, setMounted} = useLoginPage();

  useEffect(() => {
    setMounted();
  }, []);

  useEffect(() => {
    let theme = localStorage.getItem('theme');
    if (!theme) return;
    handleInputChange("dark", (theme === "dark") ? true : false);
  }, []);

  return (
    <div className={`login-root${(state.dark) ? " dark-mode" : " light-mode"}`}>
      <Particles
        arrParticles={particles}
      />
      <ButtonTheme
        isDark={state.dark}
        setIsDark={handleInputChange}
      />
      {/* Main Layout */}
      <main className="login-layout">
        {/* LEFT — Form */}
        <section className={`form-panel${(state.mounted) ? " form-mounted" : ""}`}>
          <LogoLogin
            title="Pandora's Box"
            subTitle="Abre la caja, descubre tu mundo"
          />
          <FormLogin
            state={state}
            handleInput={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </section>
        <CharacterLogo />
      </main>
    </div >
  );
};
