import React, { useEffect, useRef } from 'react';
import { MDBContainer, MDBRow, MDBCol,MDBInput, MDBCard } from 'mdb-react-ui-kit';
import '../css/LoginForm.css';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
console.log(BACKEND_URL);

type LoginFormProps = {
  setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setUserToken: (token: string | null) => void;
}

function LoginForm({ setShowLoginPopup, setUserToken }: LoginFormProps) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleLoginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    fetch(BACKEND_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // ?
      body: JSON.stringify({ username, password }), //?
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("access_token", data.access_token);
        setUserToken(data.access_token);
      })
      .catch((error) => alert("Error logging in: " + error));
      console.log(username , password)
            
    event.preventDefault();
    setShowLoginPopup(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      setShowLoginPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return <>
    
    <MDBContainer className='login-popup' fluid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'  }}>
      <MDBCard className='text-black' style={{ borderRadius: '25px' , backgroundColor: '#A1d6e2'}}>
      <MDBRow>
        <MDBCol col={12} md={6} className="text-center mb-4 mb-md-0">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
        </MDBCol>
        <MDBCol col={12} md={6} className="mb-4 mb-md-0" ref={formRef}>
       
          <form className='login-form' onSubmit={handleLoginFormSubmit}>
          <div className="d-flex justify-content-end">
           <FontAwesomeIcon icon={faTimes} size="lg" onClick={() => setShowLoginPopup(false)} style={{ cursor: 'pointer' }} />
          </div>
            <h1 className='login'>Login</h1>
            <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
            <MDBInput  type="text" name="username" placeholder="Username" ref={usernameRef} required />
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faKey} className="me-3 mt-n1" size="lg" />
            <MDBInput type="password" name="password" placeholder="Password" ref={passwordRef} required />
            </div>
            <Button variant="primary" type="submit"  onClick={() => {handleLoginFormSubmit}}>Continue</Button>
          </form>
        </MDBCol>
      </MDBRow>
      </MDBCard>
    </MDBContainer>
    </>

}

export default LoginForm;
