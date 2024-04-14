
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBInput } from 'mdb-react-ui-kit';
import { faEnvelope, faKey, faLock, faUser, faTimes , faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import '../css/Register.css'
type RegisterFormProps = {
    setShowRegisterPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Register({ setShowRegisterPopup }: RegisterFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleLoginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            // TODO: 
            // const [userError, setUserError] = useState("");
            // const [passError, setPassError] = useState("");
            // const [emailError, setEmailError] = useState("");
            // const usernameRef = useRef<HTMLInputElement>(null);
            // const passwordRef = useRef<HTMLInputElement>(null);
            // const confirmPasswordRef = useRef<HTMLInputElement>(null);
            // const emailRef = useRef<HTMLInputElement>(null);
        
            // function validatePassword() {
            //     const pass1 = passwordRef.current?.value;
            //     const pass2 = confirmPasswordRef.current?.value;
            //     const err = (pass1?.length || 0) < 8 ? "Password must be at least 8 characters" : pass1 !== pass2 ? "Passwords do not match" : "";
            //     setPassError(err);
            //     return !err;
            // }
        
            // function validateUsername() {
            //     const exampleUsernames = ["admin", "john"];
            //     const username = usernameRef.current?.value;
            //     let err = "";
            //     if ((username?.length || 0) < 3) {
            //         err = "Username must be at least 3 characters";
            //     } else if (username && exampleUsernames.includes(username)) {
            //         err = "Username already taken";
            //     }
            //     setUserError(err);
            //     return !userError;
            // }
        
            // function validateEmail() {
            //     const email = emailRef.current?.value;
            //     const err = !email || !email.includes("@") ? "Invalid email" : "";
            //     setEmailError(err);
            //     return !err;
            // }
        
        
            // function handleSubmit(event: React.MouseEvent) {
            //     event.preventDefault();  // Prevents the form from being submitted
            //     event.stopPropagation(); // Prevents the form from being submitted
            //     if (validateUsername() && validatePassword() && validateEmail()) {
            //         alert("Successfully registered!");
            //     } else {
            //         alert("Please fix the errors in the form");
            //     }
            // }
        
            // const submitEnabled = !userError && !passError && !emailError;
            
            event.preventDefault();
            setShowRegisterPopup(false);
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            setShowRegisterPopup(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    return <>
            <MDBContainer className='register-popup' fluid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MDBCard className='text-black' style={{ borderRadius: '25px'  }}>
                    <MDBCardBody>
                        <div className="d-flex justify-content-end">
                            <FontAwesomeIcon icon={faTimes} size="lg" onClick={() => setShowRegisterPopup(false)} style={{ cursor: 'pointer' }} />
                        </div>
                        <MDBRow>
                            <MDBCol col={12} md={6} className='order-2 order-lg-1 d-flex flex-column align-items-center' ref={formRef}>
                            <form className='login-form' onSubmit={handleLoginFormSubmit}>
                                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                                    <div className="d-flex flex-row align-items-center mb-4 ">
                                        <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
                                        <MDBInput placeholder='ID Number' id='form1' type='text' className='w-100' />
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-4 ">
                                        <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
                                        <MDBInput placeholder='Name' id='form1' type='text' className='w-100' />
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <FontAwesomeIcon icon={faEnvelope} className="me-3" size="lg" />
                                        <MDBInput placeholder='Email' id='form2' type='email' />
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <FontAwesomeIcon icon={faLock} className="me-3" size="lg" />
                                        <MDBInput placeholder='Password' id='form3' type='password' />
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <FontAwesomeIcon icon={faKey} className="me-3 mt-n1" size="lg" />
                                        <MDBInput placeholder='Repeat your password' id='form4' type='password' />
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-4">
                                    <FontAwesomeIcon  icon={faIdCard} className="me-3 mt-n1" size="lg" />
                                    <Form.Select aria-label="Default select example">
                                        <option>Package</option>
                                        <option value="1">Silver</option>
                                        <option value="2">Premium</option>
                                        <option value="3">Gold</option>
                                    </Form.Select>
                                    </div>
                                    <Button className='mb-4' size='lg' onClick={() => {handleLoginFormSubmit}}>Register</Button>
                                   
                             </form>
                            </MDBCol>
                            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                                <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
            </>
}
