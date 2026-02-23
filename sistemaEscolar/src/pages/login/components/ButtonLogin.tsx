import {Button} from "@/components/ui/button";
interface Props{
  type: "button" | "submit" | "reset";
  title: string;
  action: () => void;
}

export const ButtonLogin = ({type, title, action}:Props) => {
  return (
    <Button
      type={type}
      className="login-btn"
      style={{animationDelay: "0.55s"}}
      onClick={() => action()}
    >
      <span className="btn-shimmer" />
      <span className="btn-text">{title}</span>
      <svg className="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Button>
  );
}
