import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./AuthReducer";


const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: null,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  //useReducer takes two parameters one is function (AuthReducer) another is current state (INITIAL_STATE)
  //useReducer returns two parameters first one is current state another one is function called dispatch
  //dispatch is the function what we call in order to update our state. it will call AuthReducer in order to update
  //AuthReducer going to take two parameters one is current state another one is action that we pass to dispatch
  //when we call dispatch it will be set to action variable and reducer going to return new updated state

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
