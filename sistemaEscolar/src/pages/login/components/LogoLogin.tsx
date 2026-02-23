import {School} from "lucide-react";

interface Props {
  title?: string;
  sunTitle?: string;
}

export const LogoLogin = ({title, sunTitle}: Props) => {
  return (
    <div className="logo-area" style={{animationDelay: "0.1s"}}>
      <div className="logo-icon">
        <svg width="40" height="40" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#c9a84c" />
              <stop offset="100%" stopColor="#f0d070" />
            </linearGradient>
          </defs>
          <School
            stroke="url(#goldGradient)"
            strokeWidth={2}
          />
        </svg>
      </div>
      <h1 className="brand-title">
        {title}
      </h1>
      <p className="brand-sub">
        {sunTitle}
      </p>
    </div>
  );
}
