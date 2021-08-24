import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: {
    profilePicture:
      "https://img.icons8.com/pastel-glyph/64/000000/person-male--v3.png",
    coverPicture:
      "http://apy-ingenierie.fr/wp-content/plugins/uix-page-builder/uixpb_templates/images/UixPageBuilderTmpl/default-cover-6.jpg",
    isAdmin: false,
    relationship: "Single",
    _id: "611de9694baaa81d3868c0e8",
    username: "john",
    email: "john@gmail.com",
    password: "$2b$10$BgLuJU6zeWvvEnciCP0Bwumb6EUdRI0BdQlUlkFdYrq3iknqW7Ebu",
    createdAt: "2021-08-19T05:17:29.974Z",
    updatedAt: "2021-08-19T07:37:18.720Z",
    __v: 0,
    desc: "Welcome to my profile",
    city: "Dhaka",
    gender: "Male",
    hometown: "Narsingdi",
    followings: [],
    followers: [],
  },
  isFetching: null,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

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
