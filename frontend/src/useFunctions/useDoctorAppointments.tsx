import { useState } from "react";
import { Appointment, Doctor } from "../Types";
import { useGlobalFunctions } from "./useGlobalFunctions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const useDoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState<Appointment[]>([]);

  const [selectHistoryAppointments, setSelectHistoryAppointments] = useState<Appointment[]>([]);
  const { parseDateTime } = useGlobalFunctions();

  const fetchDoctorAppointments = (doctorID: number) => {
    fetch(`${BACKEND_URL}/get_appointments/${doctorID}`)
      .then(response => response.json())
      .then((data: Appointment[]) => {
        const parsedAppointments = parseDateTime(data);
        setAppointments(parsedAppointments);
        setSelectedDoctorAppointments(parsedAppointments);
      })
      .catch(error => console.error('Error fetching doctor appointments:', error));
  };

  const getDoctorById = (doctorID: number) => {
    return fetch(`${BACKEND_URL}/get_doctors_by_Id/${doctorID}`)
      .then(response => response.json())
      .then((data: Doctor) => {
        
        return data;
      })
      .catch(error => {
        console.error("Error fetching doctor details:", error);
        throw error;
      });
  };

  const getHistoryDoctorAppointments = (doctorID: number) => {
    fetch(`${BACKEND_URL}/get_appointments_history/${doctorID}`)
      .then(response => response.json())
      .then((data: Appointment[]) => {
        const parsedData = parseDateTime(data);
        setSelectHistoryAppointments(parsedData);
      })
      .catch(error => console.error('Error fetching history appointments:', error));
  };

  return {
    appointments,
    selectedDoctorAppointments,
    selectHistoryAppointments,
    fetchDoctorAppointments,
    getDoctorById,
    getHistoryDoctorAppointments,
  };
};
