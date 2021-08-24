import "./register.css";
import { useRef } from "react";
import { useHistory } from "react-router";
import axios from "axios";

export default function Register() {
  const history = useHistory();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don`t match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };
  const goto = () => {
    history.push("/login");
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
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              type="email"
              ref={email}
              className="loginInput"
            />
            <input
              placeholder="Password"
              required
              type="password"
              ref={password}
              minLength="5"
              className="loginInput"
            />
            <input
              placeholder="Password Again"
              required
              type="password"
              ref={passwordAgain}
              className="loginInput"
            />
            <button type="submit" className="loginButton">
              Sign Up
            </button>
            <button onClick={goto} className="loginRegisterButton">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
