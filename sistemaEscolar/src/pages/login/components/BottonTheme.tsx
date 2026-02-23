import {Moon, Sun} from "lucide-react";
import {FormData} from "../hooks/useLogin";
import {Button} from "@/components/ui/button";

interface Props {
  isDark: boolean;
  setIsDark: (fieldName: keyof FormData, value: string | boolean) => void;
}

export const ButtonTheme = ({isDark, setIsDark}: Props) => {
  return (
    <Button
      className="theme-toggle"
      onClick={() => setIsDark("dark", !isDark)}
      aria-label="Cambiar tema"
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {
        isDark
          ? <Sun color="#f0d070" />
          : <Moon color="#f0d070" />
      }
    </Button>
  );
}
