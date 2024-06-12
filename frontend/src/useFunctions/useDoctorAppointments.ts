import { useState } from "react";
import { Appointment, Doctor, Owner, Patient } from "../Types";
import { useGlobalFunctions } from "./useGlobalFunctions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const useDoctorAppointments = () => {
  const [appointments, ] = useState<Appointment[]>([]);
  const [selectedDoctorAppointments, ] = useState<Appointment[]>([]);
  const [selectHistoryAppointments, setSelectHistoryAppointments] = useState<Appointment[]>([]);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Doctor | null>(null);
  const { parseDateTime } = useGlobalFunctions();

  const fetchDoctorAppointments = async (doctorID: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/get_appointments/${doctorID}`);
      const data = await response.json();
  
      if (data === null) {
        // No appointments found
        return [];
      }
  
      const parsedAppointments = parseDateTime(data);
      return parsedAppointments.sort((a, b) => (a.date_time > b.date_time ? 1 : -1));
    } catch (error) {
      console.error("Error fetching patient history appointments:", error);
      throw error;
    }
  };

  const getDoctorById = async (doctorID: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/get_doctors_by_Id/${doctorID}`);
      const data = await response.json();
      setSelectedDoctorDetails(data);
      return data;
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      throw error;
    }
  };

  const getHistoryDoctorAppointments = async (doctorID: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/get_appointments_history/${doctorID}`);
      const data = await response.json();
      const parsedData = parseDateTime(data);
      setSelectHistoryAppointments(parsedData);
      return parsedData.sort((a, b) => (a.date_time > b.date_time ? 1 : -1));
    } catch (error) {
      console.error('Error fetching history appointments:', error);
      throw error;
    }
  };

  const getDoctorPatients = async (doctorID: number): Promise<Patient[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/get_doctor_patients/${doctorID}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching doctor patients:', error);
      throw error;
    }
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
