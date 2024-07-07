import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button } from 'react-bootstrap';

import InputField from './InputFields';  // Custom input field component

import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateFullName,
  validatePhone,
  validateBirthday,
  checkPasswordMatch
} from './validations';  // Validation functions for form fields

import {
  faEnvelope,
  faKey,
  faLock,
  faUser,
  faIdCard,
  faBriefcaseMedical,
  faPhone,
  faBirthdayCake
} from '@fortawesome/free-solid-svg-icons';
import './css/Register.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

interface UserFormProps {
  isAdmin: boolean;
  initialData?: {
    username?: string;
    fullName?: string;
    email?: string;
    package?: string;
    specialty?: string;
    phone?: string;
    birthday?: string;
  };
  onSuccess: () => void; // Callback function after successful registration
}

interface RegistrationData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'doctor' | 'patient';
  package?: string;
  specialty?: string;
  phone: string;
  birthday: string;
}


/*
UserForm component
user registration form that can be used for registering both patients and doctors,with role-specific fields and validations. 
It handles form submission, validation, error handling, and success messages
*/


const UserForm: React.FC<UserFormProps> = ({ isAdmin, initialData = {}, onSuccess }) => {
  const [registrationError, setRegistrationError] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<string>(initialData.package || '');
  const [specialty, setSpecialty] = useState<string>(initialData.specialty || '');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient');

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);

  // Registration data state
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    username: initialData.username || '',
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    password: '',
    confirmPassword: '',
    role: selectedRole,
    package: selectedRole === 'patient' ? selectedPackage : undefined,
    specialty: selectedRole === 'doctor' ? specialty : undefined,
    phone: initialData.phone || '',
    birthday: initialData.birthday || '',
  });

  // Form errors state
  const [formErrors, setFormErrors] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthday: '',
    specialty: '',
  });

   // List of specialties for doctors
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

   // Effect hook to handle registration success
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (registrationSuccess) {
      timeoutId = setTimeout(() => {
        setRegistrationSuccess(false);
        onSuccess();
        clearFormFields();
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [registrationSuccess, onSuccess]);

  // Effect hook to validate form inputs and update form validity
  useEffect(() => {
    const fields = [usernameRef, emailRef, passwordRef, confirmPasswordRef, fullNameRef, phoneRef, birthdayRef];
    const errors = Object.values(formErrors);

    const areFieldsFilled = fields.every(field => !!field.current?.value);
    const areErrorsAbsent = errors.every(error => !error);
    const isSpecialtySelected = selectedRole === 'doctor' ? !!specialty : true;
    const isPackageSelected = selectedRole === 'patient' ? !!selectedPackage : true;

    setIsFormValid(areFieldsFilled && areErrorsAbsent && isPackageSelected && isSpecialtySelected);

    setRegistrationData(prevData => ({
      ...prevData,
      role: selectedRole,
      package: selectedRole === 'patient' ? selectedPackage : undefined,
      specialty: selectedRole === 'doctor' ? specialty : undefined,
    }));
  }, [selectedRole, selectedPackage, specialty, formErrors]);


   // Handle registration form submission
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();

      if (result.error) {
        setRegistrationError(result.error);
      } else {
        setRegistrationSuccess(true);
        setRegistrationError('');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setRegistrationError('Registration failed. Please try again.');
    }
  };

   // Handle input change for form fields
  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    if (field === 'role') {
      setRegistrationData(prevData => ({
        ...prevData,
        [field]: value as 'doctor' | 'patient',
        specialty: value === 'doctor' ? specialty : undefined,
      }));
    } else {
      setRegistrationData(prevData => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  // Clear all form fields and reset states
  const clearFormFields = () => {
    setRegistrationData({
      username: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: selectedRole,
      package: undefined,
      specialty: undefined,
      phone: '',
      birthday: '',
    });


    setSelectedPackage('');
    setSpecialty('');
    setFormErrors({
      username: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      birthday: '',
      specialty: '',
    });

     // Clear input field values using refs
    if (usernameRef.current) usernameRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
    if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (fullNameRef.current) fullNameRef.current.value = '';
    if (phoneRef.current) phoneRef.current.value = '';
    if (birthdayRef.current) birthdayRef.current.value = '';
  };

  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    
    <div className='register-form'>
      <form onSubmit={handleRegister}>
        <p className="text-center">{isAdmin ? 'Add Doctor/Patient' : 'Register'}</p>

        {isAdmin && (
          <div className="role-selection">
            <p>Select role:</p>
            <div>
              <input
                type="radio"
                id="patient"
                name="role"
                value="patient"
                checked={selectedRole === 'patient'}
                onChange={(e) => setSelectedRole(e.target.value as 'patient')}
              />
              <label htmlFor="patient">Patient</label>
            </div>
            <div>
              <input
                type="radio"
                id="doctor"
                name="role"
                value="doctor"
                checked={selectedRole === 'doctor'}
                onChange={(e) => setSelectedRole(e.target.value as 'doctor')}
              />
              <label htmlFor="doctor">Doctor</label>
            </div>
          </div>
        )}

        {registrationSuccess && (
          <Alert variant="success">
            {isAdmin ? `${selectedRole.toUpperCase()} Added successfully` : 'Registration successful. Redirecting to homepage...'}
          </Alert>
        )}

        <InputField
          icon={faUser}
          placeholder="Username"
          type="text"
          error={formErrors.username}
          setError={(error) => setFormErrors({ ...formErrors, username: error })}
          validationFunction={(value) => validateUsername(value, BACKEND_URL)}
          ref={usernameRef}
          onChange={(value) => handleInputChange('username', value)}
        />

        <InputField
          icon={faUser}
          placeholder="Full Name"
          type="text"
          error={formErrors.fullName}
          setError={(error) => setFormErrors({ ...formErrors, fullName: error })}
          validationFunction={validateFullName}
          ref={fullNameRef}
          onChange={(value) => handleInputChange('fullName', value)}
        />

        <InputField
          icon={faEnvelope}
          placeholder="Email"
          type="email"
          error={formErrors.email}
          setError={(error) => setFormErrors({ ...formErrors, email: error })}
          validationFunction={validateEmail}
          ref={emailRef}
          onChange={(value) => handleInputChange('email', value)}
        />

      <InputField
        icon={faKey}
        placeholder="Password"
        type={showPassword ? 'text' : 'password'}
        error={formErrors.password}
        setError={(error) => setFormErrors((prevErrors) => ({ ...prevErrors, password: error }))}
        validationFunction={validatePassword}
        ref={passwordRef}
        onChange={(value) => handleInputChange('password', value)}
        showPasswordToggle={true} // Pass a prop to indicate password toggle should be shown
        togglePasswordVisibility={togglePasswordVisibility} // Pass the toggle function
      />

        <InputField
          icon={faLock}
          placeholder="Confirm Password"
          type="password"
          error={formErrors.confirmPassword}
          setError={(error) => setFormErrors({ ...formErrors, confirmPassword: error })}
          validationFunction={(value) => checkPasswordMatch(value, registrationData.password)}
          ref={confirmPasswordRef}
          onChange={(value) => handleInputChange('confirmPassword', value)}
        />

        <InputField
          icon={faPhone}
          placeholder="Phone"
          type="text"
          error={formErrors.phone}
          setError={(error) => setFormErrors({ ...formErrors, phone: error })}
          validationFunction={validatePhone}
          ref={phoneRef}
          onChange={(value) => handleInputChange('phone', value)}
        />


        <InputField
          icon={faBirthdayCake}
          placeholder="Birthday"
          type="date"
          error={formErrors.birthday}
          setError={(error) => setFormErrors({ ...formErrors, birthday: error })}
          validationFunction={validateBirthday}
          ref={birthdayRef}
          onChange={(value) => handleInputChange('birthday', value)}
        />


        {selectedRole === 'patient' && (
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faIdCard} className="me-3 mt-n1" size="lg" />
            <p className='package-p'>Package</p>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  <input type="radio" name="package" value="Silver" checked={selectedPackage === 'Silver'} style={{ transform: 'scale(0.8)' }} onChange={(e) => setSelectedPackage(e.target.value)} />
                  <label htmlFor="silver">Silver</label>
                </div>
                <div>
                  <input type="radio" name="package" value="Gold" checked={selectedPackage === 'Gold'} style={{ transform: 'scale(0.8)' }} onChange={(e) => setSelectedPackage(e.target.value)} />
                  <label htmlFor="gold">Gold</label>
                </div>
                <div>
                  <input type="radio" name="package" value="Premium" checked={selectedPackage === 'Premium'} style={{ transform: 'scale(0.8)' }} onChange={(e) => setSelectedPackage(e.target.value)} />
                  <label htmlFor="premium">Premium</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedRole === 'doctor' && (
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faBriefcaseMedical} />
            <div className="form-outline flex-fill mb-0">
              <label className="form-label" htmlFor="specialty">Specialty</label>
              <select
                id="specialty"
                className="form-control"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">Select Specialty</option>
                {specialties.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
              {formErrors.specialty && <div className="error-message">{formErrors.specialty}</div>}
            </div>
          </div>
        )}

        {registrationError && (
          <Alert variant="danger">
            {registrationError}
          </Alert>
        )}

        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
          <Button type="submit" className="btn btn-primary btn-lg" disabled={!isFormValid}>
            {isAdmin ? 'Add' : 'Register'}
          </Button>
        </div>
      </form>
    </div>
    
  );
};

export default UserForm;
