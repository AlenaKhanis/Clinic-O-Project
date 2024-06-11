
export const validateUsername = async (username: string, backendUrl: string): Promise<string> => {
  console.log(backendUrl);
  if (username.length < 3) return "Username must be at least 3 characters long";

  const response = await fetch(`${backendUrl}/check-username?username=${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
    
  });

  const data = await response.json();
  if (data.exists) return "Username already taken";

  return "";
};

export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

export const validatePassword = (password: string): string => {
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) return "Password must contain both letters and numbers";
  return "";
};

export const checkPasswordMatch = (password: string, confirmPassword: string): string => {
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

export const validateFullName = (fullName: string): string => {
  if (!fullName) return "Full name cannot be empty";
  if (/\d/.test(fullName)) return "Full name cannot include numbers";
  return "";
};

export const validateSpecialty = (specialty: string): string => {
  if (specialty.length < 3) return "Specialty must be at least 3 characters long";
  return "";
};

export const validatePhone = (phone: string): string => {
  if (!phone) {
    return 'Phone number is required';
  }
  if (phone.length < 10) {
    return 'Phone number must be at least 10 characters long';
  }
  return '';
};



export const validateBirthday = (birthday: string): string => {
  if (!birthday) {
    return 'Must enter a birthday'; 
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthDate = new Date(birthday);
  birthDate.setHours(0, 0, 0, 0); 

  if (birthDate > today) {
    return 'Birthday cannot be in the future';
  }

  if (birthDate.getTime() === today.getTime()) {
    return 'Birthday cannot be today';
  }

  return '';
};
