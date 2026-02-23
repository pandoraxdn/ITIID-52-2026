import {LogIn} from "lucide-react";
import {Button} from "@/components/ui/button";
import {t} from "node_modules/react-router/dist/development/index-react-server-client-MKTlCGL3.d.mts";

interface Props {
  type: "button" | "submit" | "reset";
  title: string;
  action: () => void;
}

export const ButtonLogin = ({type, title, action}: Props) => {
  return (
    <button
      type={type}
      className="login-btn"
      style={{animationDelay: "0.55s"}}
    >
      <span className="btn-shimmer" />
      <span className="btn-text">{title}</span>
      <svg className="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <LogIn />
      </svg>
    </button>
  );
}
