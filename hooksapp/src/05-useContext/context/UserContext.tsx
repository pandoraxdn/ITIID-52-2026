import {createContext, type ReactNode, useEffect, useEffectEvent, useReducer} from "react";
import {users, type User} from "../data/user-mock.data";
import {userReducer} from "./userReducer";

export type AuthStatus =
  | 'checking'
  | 'authenticated'
  | 'no-authenticated';

export interface UserState {
  authStatus: AuthStatus;
  user: User | null;
}

interface UserContextProps extends UserState {
  isAuthenticated: boolean;
  login: (userId: number) => void;
  logout: () => void;
}

const initialState: UserState = {
  authStatus: "checking",
  user: null,
}

export const UserContext = createContext({} as UserContextProps);

export const UserContextProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const login = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    if (!user) {
      dispatch({type: "logout"});
      return false;
    }
    localStorage.setItem('userId', userId.toString());
    dispatch({type: "login", payload: user});
    return true;
  }

  const logout = () => {
    localStorage.removeItem("userId");
    dispatch({type: "logout"});
  }

  useEffect(() => {
    const storeUserId = localStorage.getItem("userId");
    if (!storeUserId) {
      logout();
      return;
    }
    login(+storeUserId);
  }, []);

  return (
    <UserContext
      value={{
        ...state,
        isAuthenticated: state.authStatus === 'authenticated',
        login,
        logout
      }}
    >
      {children}
    </UserContext>
  );
}



