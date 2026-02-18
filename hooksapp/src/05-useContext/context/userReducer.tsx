import {type UserState} from "./UseContext";
import {type User} from "../data/user-mock.data";

type UserAction =
  | {type: 'login', payload: User}
  | {type: 'logout'};

export const userReducer = (state: UserState, action: UserAction) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        authStatus: 'authenticated',
        user: action.payload
      }
    case 'logout':
      return {
        authStatus: "no-authenticated",
        user: null
      }
    default:
      return state;
  }
}
