import React, { useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Patient, Doctor, Owner } from '../Types';
import '../css/newLogin.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

type LoginFormProps = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setUserToken: (token: string | null) => void;
  setUserName: (userName: string) => void;
};

function LoginForm({ show, setShow, setUserToken, setUserName }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLoginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    fetch(BACKEND_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          return response.json().then((data) => {
            throw new Error(data.error);
          });
        } else {
          throw new Error("Error logging in: " + response.status);
        }
      })
      .then((data) => {
        fetch(BACKEND_URL + "/get_user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              localStorage.setItem("access_token", data.access_token);
              setUserToken(data.access_token);
              return response.json();
            } else {
              throw new Error("Error fetching user information");
            }
          })
          .then((userData: Patient | Doctor | Owner) => {
            localStorage.setItem("userinfo", JSON.stringify(userData));
            setShow(false);
            setUserName(userData.full_name);
          })
          .catch(() => {
            setErrorMessage("An error occurred while fetching user information.");
          });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Body>
        <form onSubmit={handleLoginFormSubmit} className="login-form" autoComplete="off" role="main">
          {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
          <h1 className="a11y-hidden">Login Form</h1>
          <div style={{ order: 2 }}>
            <label className="label-email">
              <input
                type="username"
                className="text"
                name="username"
                placeholder="Username"
                tabIndex={1}
                required
                ref={usernameRef}
              />
              <span className="required">Username</span>
            </label>
          </div>
          <input
            type="checkbox"
            name="show-password"
            className="show-password a11y-hidden"
            id="show-password"
            tabIndex={3}
            onChange={toggleShowPassword}
          />
          <label className="label-show-password" htmlFor="show-password">
            <span>Show Password</span>
          </label>
          <div style={{ order: 2 }}>
            <label className="label-password">
              <input
                type={showPassword ? "text" : "password"}
                className="text"
                name="password"
                placeholder="Password"
                tabIndex={2}
                required
                ref={passwordRef}
              />
              <span className="required">Password</span>
            </label>
          </div>
          <input type="submit" value="Log In" />
          <div style={{ order: 2 }} className="email">
          </div>
          <figure aria-hidden="true">
            <div className="person-body"></div>
            <div className="neck skin"></div>
            <div className="head skin">
              <div className="eyes"></div>
              <div className="mouth"></div>
            </div>
            <div className="hair"></div>
            <div className="ears"></div>
            <div className="shirt-1"></div>
            <div className="shirt-2"></div>
          </figure>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginForm;
