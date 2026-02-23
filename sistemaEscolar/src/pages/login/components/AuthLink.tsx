import {Link} from "react-router";

interface Props {
  title: string;
  link: string;
}
export const AuthLink = ({title, link}: Props) => {
  return (
    <p className="forgot-link" style={{animationDelay: "0.65s"}}>
      <Link
        to={link}
      >
        {title}
      </Link>
    </p>
  );
}
