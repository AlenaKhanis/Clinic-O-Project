export type Patient = {
  id: number;
  patient_id: number;
  package: string;
  created_date: Date;
  updated_date: Date;
  username: string;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  role: string;
};

export type Doctor = {
  id: number;
  doctor_id: number;
  specialty: string;
  created_date: Date;
  updated_date: Date;
  username: string;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  role: string;
  open_appointment: Date;
};

export type Owner = {
  id: number;
  owner_id: number;
  created_date: Date;
  updated_date: Date;
  username: string;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  role: string;
}

export type Appointment =  {
  date: string;
  time: string;
  status: string;
  patient_id: number | null;
  id: number;
}

export type PatientDetails =  {
  patient_name: string;
  diagnosis: string | null;
  prescription: string | null;
}