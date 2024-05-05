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
  diagnosis: string | null;
  prescription: string | null;
};

export type Doctor = {
  appointments: any;
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
  status: string;
  patient_id: number | null;
  id: number;
  date_time: string;
  summery?: string;
  written_diagnosis?: string;
  written_prescriptions?: string;
  date: string;
  time: string;
  doctor_id: number;
}

export type DisplayAppointmentsProps = {
  doctorId: string | null;
  onAppointmentAdded: () => void;
  BACKEND_URL: string;
};

export type PatientProps = {
  BACKEND_URL: string;
  patientId : string | null;
  refreshAppointments: () => void;
};
