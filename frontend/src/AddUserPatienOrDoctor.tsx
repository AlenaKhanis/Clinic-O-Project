import { MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { faEnvelope, faKey, faLock, faUser, faIdCard, faBriefcaseMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import './css/Register.css';
import React from 'react';

export default function AddUserPatienOrDoctor({BACKEND_URL}:  {BACKEND_URL : string}) {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [role, setRole] = useState<string>("patient");
  const [passwordError, setPasswordError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [fullNameError, setFullNameError] = useState<string>("");
  const [specialtyError, setSpecialtyError] = useState<string>("");
  const [registrationError, setRegistrationError] = useState<string>('');

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");

  let variant = "";

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Family Medicine",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Pediatrics",
    "Psychiatry",
    "Radiology"
  ];

  const handleCheckUsername = () => {
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
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    }
    else {
      setPasswordError("");
    }
  };

  const handleFullNameValidation = () => {
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
    if (!email) {
      setEmailError("");
    }
    else if (!emailPattern.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const registrationData = {
      username,
      password,
      email,
      fullName,
      role,
      package: role === 'patient' ? selectedPackage : undefined,
      specialty: role === 'doctor' ? specialty : undefined
    };

    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        throw new Error(`Failed to register ${role}`);
      }

      const result = await response.json();
      
      if (result.error) {
        setRegistrationError(result.error);
        variant = 'danger';
      } else {
        setRegistrationError('Register successful!'); // Indicate success
        setSelectedPackage("");
        setRole("patient");
        setPasswordError("");
        setUsernameError("");
        setEmailError("");
        setFullNameError("");
        setSpecialtyError("");
        variant = 'success';  
      }
      
    } catch (error) {
      setRegistrationError(`Failed to register ${role}`);
    }
  };

  const handlePasswordValidation = () => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must be at least 8 characters long and include both letters and numbers");
    } else {
      setPasswordError("");
    }
  };

  const handleCheckSpecialty = () => {
    if (!specialty) {
      setSpecialtyError("Specialty is required");
    } else {
      setSpecialtyError("");
    }
  }

 useEffect(() => {
  const fields = role === 'doctor'
    ? [username, email, password, confirmPassword, fullName, specialty]
    : [username, email, password, confirmPassword, fullName];
  const errors = [usernameError, passwordError, fullNameError, emailError, specialtyError];

  const areFieldsFilled = fields.every(field => !!field);
  const areErrorsAbsent = errors.every(error => !error);
  const isPackageSelected = role === 'patient' ? !!selectedPackage : true;

  console.log('fields:', fields);
  console.log('errors:', errors);
  console.log('areFieldsFilled:', areFieldsFilled);
  console.log('areErrorsAbsent:', areErrorsAbsent);
  console.log('isPackageSelected:', isPackageSelected);

  setIsFormValid(areFieldsFilled && areErrorsAbsent && isPackageSelected);
}, [selectedPackage, username, email, password, confirmPassword, usernameError, passwordError, fullNameError, emailError, specialtyError, specialties, role]);

  return (
    <div className='register-form'>
      <form onSubmit={handleRegister}>
        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

        <div className="d-flex flex-row align-items-center mb-4">
          <FontAwesomeIcon icon={faIdCard} className="me-3 mt-n1" size="lg" />
          <p className='role-p'>Role</p>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div>
                <input type="radio" name="role" value="patient" onChange={handleRoleChange} checked={role === 'patient'} />
                <label htmlFor="patient">Patient</label>
              </div>
              <div>
                <input type="radio" name="role" value="doctor" onChange={handleRoleChange} checked={role === 'doctor'} />
                <label htmlFor="doctor">Doctor</label>
              </div>
            </div>
          </div>
        </div>

        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
            <MDBInput
              value={username}
              placeholder='UserName'
              id='form1'
              type='text'
              className='w-100'
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleCheckUsername()}
              style={{ borderColor: usernameError ? 'red' : undefined }}
            />
          </div>
          {usernameError && <span style={{ color: 'red', margin: '30px' }}>{usernameError}</span>}
        </MDBCol>

        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
            <MDBInput
              value={fullName}
              placeholder='Full Name'
              id='form5'
              type='text'
              className='w-100'
              onChange={(e) => setFullName(e.target.value)}
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
              value={email}
              placeholder='Email'
              id='form2'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleEmailValidation()}
            />
          </div>
          {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
        </MDBCol>

        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faLock} className="me-3" size="lg" />
            <MDBInput
              value={password}
              placeholder='Password'
              id='form3'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              placeholder='Repeat your password'
              id='form4'
              type='password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => checkPasswordMatch()}
              style={{ borderColor: passwordError ? 'red' : undefined }}
            />
          </div>
          {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
        </MDBCol>

        {role === 'doctor' && (
          <MDBCol md='6'>
            <div className="d-flex flex-row align-items-center mb-4">
              <FontAwesomeIcon icon={faBriefcaseMedical} className="me-3" size="lg" />
              <select
                value={specialty}
                id='form6'
                className='form-select w-100'
                onChange={(e) => setSpecialty(e.target.value)}
                onBlur={handleCheckSpecialty}
                style={{ borderColor: specialtyError ? 'red' : undefined }}
              >
                <option value=''>Select Specialty</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            {specialtyError && <span style={{ color: 'red' }}>{specialtyError}</span>}
          </MDBCol>
        )}

        {role === 'patient' && (
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faIdCard} className="me-3 mt-n1" size="lg" />
            <p className='package-p'>Package</p>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  <input type="radio" name="package" value="Silver" onChange={handlePackageSelection} checked={selectedPackage === 'Silver'} style={{ transform: 'scale(0.8)' }} />
                  <label htmlFor="silver">Silver</label>
                </div>
                <div>
                  <input type="radio" name="package" value="Gold" onChange={handlePackageSelection} checked={selectedPackage === 'Gold'} style={{ transform: 'scale(0.8)' }} />
                  <label htmlFor="gold">Gold</label>
                </div>
                <div>
                  <input type="radio" name="package" value="Premium" onChange={handlePackageSelection} checked={selectedPackage === 'Premium'} style={{ transform: 'scale(0.8)' }} />
                  <label htmlFor="premium">Premium</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {registrationError && (
          <Alert variant={variant} onClose={() => setRegistrationError('')} dismissible>
            {registrationError}
          </Alert>
        )}
        <Button className='mb-4' size='lg' type='submit' disabled={!isFormValid}>{role === 'doctor' ? 'Add Doctor' : 'Register'}</Button>
      </form>
    </div>
  );
}
