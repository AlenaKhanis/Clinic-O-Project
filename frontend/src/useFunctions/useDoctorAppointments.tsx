import { useState } from "react";
import { Appointment, Doctor, Patient } from "../Types";
import { useGlobalFunctions } from "./useGlobalFunctions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const useDoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState<Appointment[]>([]);
  const [selectHistoryAppointments, setSelectHistoryAppointments] = useState<Appointment[]>([]);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Doctor | null>(null);
  const { parseDateTime } = useGlobalFunctions();

  const fetchDoctorAppointments = (doctorID: number) => {
     return fetch(`${BACKEND_URL}/get_appointments/${doctorID}`)
      .then(response => response.json())
      .then((data: Appointment[]) => {
        const parsedAppointments = parseDateTime(data);
        return parsedAppointments.sort((a, b) => (a.date_time > b.date_time ? 1 : -1));
        
      })
      .catch(error => {
        console.error("Error fetching patient history appointments:", error);
        throw error;
      });
  };

  const getDoctorById = (doctorID: number) => {
    return fetch(`${BACKEND_URL}/get_doctors_by_Id/${doctorID}`)
      .then(response => response.json())
      .then((data: Doctor) => {
        setSelectedDoctorDetails(data);
        return data;
      })
      .catch(error => {
        console.error("Error fetching doctor details:", error);
        throw error;
      });
  };

  const getHistoryDoctorAppointments = (doctorID: number) => {
   return fetch(`${BACKEND_URL}/get_appointments_history/${doctorID}`)
      .then(response => response.json())
      .then((data: Appointment[]) => {
        const parsedData = parseDateTime(data);
        return parsedData.sort((a, b) => (a.date_time > b.date_time ? 1 : -1));
      })
      .catch(error => console.error('Error fetching history appointments:', error));
  };

  const getDoctorPatients = (doctorID: number): Promise<Patient[]> => {
    return fetch(`${BACKEND_URL}/get_doctor_patients/${doctorID}`)
      .then(response => response.json())
      .then((data: Patient[]) => {
        return data;
      })
      .catch(error => {
        console.error('Error fetching doctor patients:', error);
        throw error; // Rethrow the error to be caught by the caller
      });
  };

  return {
    appointments,
    selectedDoctorAppointments,
    selectHistoryAppointments,
    fetchDoctorAppointments,
    getDoctorById,
    getHistoryDoctorAppointments,
    selectedDoctorDetails,
    setSelectedDoctorDetails,
    getDoctorPatients
  };
};
