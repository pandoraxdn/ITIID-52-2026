import {Sun, Moon} from "lucide-react";
import {FormData} from "../hooks/useLogin";

interface Props {
  isDark: boolean;
  setIsDark: (fieldName: keyof FormData, value: string | boolean) => void;
}

export const ButtonTheme = ({isDark, setIsDark}: Props) => {
  {/* Theme Toggle */}

  const addTheme = (isDark: boolean) => {
    if (isDark) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
    }
  }

  return (
    <button
      className="theme-toggle"
      onClick={() => {
        setIsDark('dark', !isDark);
        addTheme(!isDark);
      }}
      aria-label="Cambiar tema"
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      <span className="theme-icon">
        {
          isDark
            ? <Sun color="#f0d070" />
            : <Moon color="#f0d070" />
        }
      </span>
    </button>
  );
};
