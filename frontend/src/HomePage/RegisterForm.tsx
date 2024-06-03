import {  MDBCol,  MDBInput  } from 'mdb-react-ui-kit';
import { faEnvelope, faKey, faLock, faUser, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import '../css/Register.css'
import { useNavigate } from 'react-router-dom';

//TODO: Add birthday field
//TODO: Add phone number field

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


export default function Register() {

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [fullNameError, setFullNameError] = useState<string>("");
    const [registrationError, setRegistrationError] = useState<string>('');
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const fullNameRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    

    const handleCheckUsername = () => {
        const username = usernameRef.current?.value;
        fetch(`${BACKEND_URL}/check-username?username=${username}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.exists) {
                    setUsernameError("Username already exists");
                } else {
                    setUsernameError("");
                }
            })
            .catch(error => {
                console.error('Error checking username:', error);
            });
    };

    const handlePackageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPackage(event.target.value);
    };

    const checkPasswordMatch = () => {
        const password = passwordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
        }
        else {
            setPasswordError("");
        }
    };

    const handleFullNameValidation = () => {
        const fullName = fullNameRef.current?.value || '';
        if (!fullName) {
            setFullNameError(""); 
        } else if (!/^[a-zA-Z ]+$/.test(fullName)) {
            setFullNameError("Full name must contain only letters");
        } else {
            setFullNameError("");
        }
    };

    const handleEmailValidation = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = emailRef.current?.value || '';
        if (!email) {
            setEmailError("");
        }
        else if (!emailPattern.test(email)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    };

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const email = emailRef.current?.value;
        const fullName = fullNameRef.current?.value;

        const registrationData = {
            username,
            password,
            email,
            fullName,
            package: selectedPackage
        };

        fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registrationData)
        })
 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setIsFormValid(true);
                setIsFormValid(true);
                navigate('/');
            })
            .catch(error => {
                console.error('Error registering:', error);
                setRegistrationError('Registration failed. Please try again.');
            });
    };

    const handlePasswordValidation = () => {
        const password = passwordRef.current?.value || '';
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(password)) {
          setPasswordError("Password must be at least 8 characters long and include both letters and numbers");
        } else {
          setPasswordError("");
        }
      };


useEffect(() => {
    const fields = [usernameRef, emailRef, passwordRef, confirmPasswordRef, fullNameRef];
    const errors = [usernameError, passwordError, fullNameError, emailError];

    const areFieldsFilled = fields.every(field => !!field.current?.value);
    const areErrorsAbsent = errors.every(error => !error);
    const isPackageSelected = !!selectedPackage;

    setIsFormValid(areFieldsFilled && areErrorsAbsent && isPackageSelected);
}, [selectedPackage, usernameRef, emailRef, passwordRef, confirmPasswordRef, usernameError, passwordError, fullNameError, emailError]);



    return (
        <div className='register-form'>
            <form onSubmit={handleRegister}>
                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                <MDBCol md='6'>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
                        <MDBInput
                            ref={usernameRef}
                            placeholder='UserName'
                            id='form1'
                            type='text'
                            className='w-100'
                            onBlur={() => handleCheckUsername()}
                            style={{ borderColor: usernameError ? 'red' : undefined }}
                        />
                    </div>
                    {usernameError && <span style={{ color: 'red' , margin: '30px' }}>{usernameError}</span>}
                </MDBCol>

                <MDBCol md='6'>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
                        <MDBInput
                            ref={fullNameRef}
                            placeholder='Full Name'
                            id='form5'
                            type='text'
                            className='w-100'
                            onBlur={() => handleFullNameValidation()}
                            style={{ borderColor: fullNameError ? 'red' : undefined }}
                        />
                    </div>
                    {fullNameError && <span style={{ color: 'red' }}>{fullNameError}</span>}
                </MDBCol>

                <MDBCol md='6'>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faEnvelope} className="me-3" size="lg" />
                        <MDBInput
                            ref={emailRef}
                            placeholder='Email'
                            id='form2'
                            type='email'
                            onBlur={() => handleEmailValidation()}
                        />
                    </div>
                    {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
                </MDBCol>

                <MDBCol md='6'>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faLock} className="me-3" size="lg" />
                        <MDBInput
                            ref={passwordRef}
                            placeholder='Password'
                            id='form3'
                            type='password'
                            onBlur={handlePasswordValidation}
                            style={{ borderColor: passwordError ? 'red' : undefined }}
                        />
                    </div>
                    <small className="text-muted">Password must be at least 8 characters long and include both letters and numbers</small>
                </MDBCol>

                <MDBCol md='6'>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faKey} className="me-3 mt-n1" size="lg" />
                        <MDBInput
                            ref={confirmPasswordRef}
                            placeholder='Repeat your password'
                            id='form4'
                            type='password'
                            onBlur={() => checkPasswordMatch()}
                            style={{ borderColor: passwordError ? 'red' : undefined }}
                        />
                    </div>
                    {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
                </MDBCol>

                <div className="d-flex flex-row align-items-center mb-4">
                    <FontAwesomeIcon icon={faIdCard} className="me-3 mt-n1" size="lg" />
                    <p className='package-p'>Package</p>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div>
                                <input type="radio" name="package" value="Silver" onChange={handlePackageSelection} style={{ transform: 'scale(0.8)' }} />
                                <label htmlFor="silver">Silver</label>
                            </div>
                            <div>
                                <input type="radio" name="package" value="Gold" onChange={handlePackageSelection} style={{ transform: 'scale(0.8)' }} />
                                <label htmlFor="gold">Gold</label>
                            </div>
                            <div>
                                <input type="radio" name="package" value="Premium" onChange={handlePackageSelection} style={{ transform: 'scale(0.8)' }} />
                                <label htmlFor="premium">Premium</label>
                            </div>
                        </div>
                    </div>
                </div>
                {registrationError && (
                    <Alert variant="danger" onClose={() => setRegistrationError('')} dismissible>
                    {registrationError}
                    </Alert>
                )}
                <Button className='mb-4' size='lg' type='submit' disabled={!isFormValid}>Register</Button>
            </form>
        </div>
    );

}