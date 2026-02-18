import {use, type ReactNode} from 'react';
import {UserContext} from '../context/UserContext';
import {Navigate} from 'react-router';

interface Props {
  element: ReactNode
}

export const PrivateRoutes = ({element}: Props) => {
  const {authStatus} = use(UserContext);

  if (authStatus === "checking") {
    return null;
  }
  if (authStatus === "authenticated") {
    return element;
  }

  return <Navigate to="/login" replace />;
}
