import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBInput } from 'mdb-react-ui-kit';
import { faEnvelope, faKey, faLock, faUser, faTimes, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import '../css/Register.css'



//TODO: Sapared the form validation logic and submissin logic in diffrent files!


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

type RegisterFormProps = {
    setShowRegisterPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Register({ setShowRegisterPopup }: RegisterFormProps) {

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [fullNameError, setFullNameError] = useState<string>("");

    const formRef = useRef<HTMLFormElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const fullNameRef = useRef<HTMLInputElement>(null);

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
                // Registration successful
                alert('Registration successful!');
                setShowRegisterPopup(false);
                setIsFormValid(true);
            })
            .catch(error => {
                console.error('Error registering:', error);
                alert('Registration failed. Please try again.');
            });
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

    useEffect(() => {
        const isUsernameFilled = !!usernameRef.current?.value;
        const isEmailFilled = !!emailRef.current?.value;
        const isPasswordFilled = !!passwordRef.current?.value;
        const isConfirmPasswordFilled = !!confirmPasswordRef.current?.value;
        const isFullNameFilled = !!fullNameRef.current?.value;
        const isPackageSelected = !!selectedPackage;
        const isEmailValid = !emailError;
    
        const isUsernameValid = !usernameError;
        const isPasswordValid = !passwordError;
        const isFullNameValid = !fullNameError;
    
        setIsFormValid(
            isUsernameFilled &&
            isEmailFilled &&
            isPasswordFilled &&
            isConfirmPasswordFilled &&
            isFullNameFilled &&
            isPackageSelected &&
            isUsernameValid &&
            isPasswordValid &&
            isFullNameValid &&
            isEmailValid
        );
    }, [selectedPackage, usernameRef, emailRef, passwordRef, confirmPasswordRef, usernameError, passwordError, fullNameError, emailError]);
    



    return (
        <MDBContainer className='register-popup' fluid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <MDBCard className='text-black' style={{ borderRadius: '25px' }}>
                <MDBCardBody>
                    <div className="d-flex justify-content-end">
                        <FontAwesomeIcon icon={faTimes} size="lg" onClick={() => setShowRegisterPopup(false)} style={{ cursor: 'pointer' }} />
                    </div>
                    <MDBRow>
                        <MDBCol col={12} md={6} className='order-2 order-lg-1 d-flex flex-column align-items-center' ref={formRef}>
                            <form className='register-form'  onSubmit={handleRegister}>
                                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                                <div className="d-flex flex-row align-items-center mb-4 ">
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
                                {usernameError && <span style={{ color: 'red' }}>{usernameError}</span>}
                                <div className="d-flex flex-row align-items-center mb-4 ">
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
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <FontAwesomeIcon icon={faEnvelope} className="me-3" size="lg" />
                                    <MDBInput ref={emailRef} placeholder='Email' id='form2' type='email' onBlur={() => handleEmailValidation()} />
                                </div>
                                {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <FontAwesomeIcon icon={faLock} className="me-3" size="lg" />
                                    <MDBInput 
                                    ref={passwordRef} 
                                    placeholder='Password' 
                                    id='form3' 
                                    type='password'
                                    onBlur={() => checkPasswordMatch()} 
                                    style={{ borderColor: passwordError ? 'red' : undefined }}
                                    />
                                </div>
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <FontAwesomeIcon icon={faKey} className="me-3 mt-n1" size="lg" />
                                    <MDBInput 
                                    ref={confirmPasswordRef}
                                    placeholder='Repeat your password'
                                    id='form4' type='password'
                                    onBlur={() => checkPasswordMatch()}
                                    style={{ borderColor: passwordError ? 'red' : undefined }}
                                    />
                                </div>
                                {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <FontAwesomeIcon icon={faIdCard} className="me-3 mt-n1" size="lg" />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <p>Package</p>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                            <div>
                                                <input type="radio" name="package" value="Silver" onChange={handlePackageSelection} />
                                                <label htmlFor="silver">Silver</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="package" value="Gold" onChange={handlePackageSelection} />
                                                <label htmlFor="gold">Gold</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="package" value="Premium" onChange={handlePackageSelection} />
                                                <label htmlFor="premium">Premium</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button className='mb-4' size='lg' type='submit' disabled={!isFormValid}>Register</Button>
                            </form>
                        </MDBCol>

                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}
