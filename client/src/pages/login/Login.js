import { useRef, useContext } from "react";
import "./login.css";
import { LoginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router";

export default function Login() {
  const history = useHistory();
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const handleClick = (e) => {
    e.preventDefault();
    LoginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };
  const goto = () => {
    history.push("/register");
  };

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Society</h3>
          <span className="loginDesc">Connect with others from here..</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="5"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button
              onClick={goto}
              className="loginRegisterButton"
            >
              Create a New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
