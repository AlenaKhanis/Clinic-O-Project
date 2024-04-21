import React, { useEffect, useRef } from 'react';
import { MDBContainer, MDBRow, MDBCol,MDBInput, MDBCard } from 'mdb-react-ui-kit';
import '../css/LoginForm.css';
import { Button, PageItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { Patient, Doctor } from '../types.tsx';



const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


type LoginFormProps = {
  setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setUserToken: (token: string | null) => void;
  setUserName: (userName: string) => void;
  setRole: (userRole: string) => void;
};


function LoginForm({ setShowLoginPopup, setUserToken , setUserName ,setRole }: LoginFormProps) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);



  const handleLoginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
  
    fetch(BACKEND_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    .then((response) => {
      console.log("in login")
      if (response.ok) {
        // Parse JSON response
        return response.json();
      } else if (response.status === 400) {
        // If status is 401, username or password is invalid
        throw new Error("Invalid username or password");
      } else {
        // Handle other status codes as needed
        throw new Error("Error logging in: " + response.status);
      }
    })
    .then((data) => {
      // Handle successful login
      localStorage.setItem("access_token", data.access_token);
      setUserToken(data.access_token);
      setShowLoginPopup(false);
      // Fetch user information
      fetch(BACKEND_URL + "/get_user", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${data.access_token}`
        }
    })
        .then(response => {
          console.log("in get user")
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error fetching user information");
            }
        })
        .then((userData: Patient | Doctor) => {
          localStorage.setItem("userinfo", JSON.stringify(userData));
          setShowLoginPopup(false);
          setUserName(userData.full_name);
          setRole(userData.role);
        })
        .catch(error => {
            alert("Error fetching user information: " + error.message);
        });
    })
    .catch((error) => {
        // Catch and handle any errors that occur during the fetch or parsing of response
        alert("Error logging in: " + error.message);
    });

    event.preventDefault();
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
            <Button variant="primary" type="submit" >Continue</Button>
          </form>
        </MDBCol>
      </MDBRow>
      </MDBCard>
    </MDBContainer>
    </>

}

export default LoginForm;
