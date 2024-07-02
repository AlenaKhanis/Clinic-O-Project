import { useState } from "react";
import { Appointment, Doctor, Patient } from "../Types";
import { useGlobalFunctions } from "./useGlobalFunctions";
import { useBackendUrl } from "../BackendUrlContext";

//useDoctorAppointments hook provides functions related to managing doctor appointments and details.

export const useDoctorAppointments = () => {

  const BACKEND_URL = useBackendUrl();

  const [appointments, ] = useState<Appointment[]>([]);
  const [selectedDoctorAppointments, ] = useState<Appointment[]>([]);
  const [selectHistoryAppointments, setSelectHistoryAppointments] = useState<Appointment[]>([]);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Doctor | null>(null);
  const { parseDateTime } = useGlobalFunctions();
  
  // Fetches appointments for a specific doctor from the backend.
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

  //Fetches details of a specific doctor based on their ID.
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

  //Fetches historical appointments for a specific doctor from the backend.
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

  //Fetches patients associated with a specific doctor from the backend.
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
