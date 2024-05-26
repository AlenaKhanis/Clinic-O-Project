
import { Appointment, Patient } from "../Types";
import { useGlobalFunctions } from "./useGlobalFunctions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const usePatientDetails = () => {
 
  const { parseDateTime } = useGlobalFunctions();
 
  const getPatientById = (patientID: number) => {
    return fetch(`${BACKEND_URL}/get_patient_by_id/${patientID}`)
      .then(response => response.json())
      .then((data: Patient) => {
        // setSelectedPatientDetails(data);
        return data;
      })
      .catch(error => {
        console.error("Error fetching patient details:", error);
        throw error;
      });
  };

  const getPatientHistoryAppointments = (patientID: number) => {
    return fetch(`${BACKEND_URL}/history_patient_appointments/${patientID}`)
      .then(response => response.json())
      .then((data: Appointment[]) => {
        const parsedAppointments = parseDateTime(data);
        // setPatientHistoryAppointments(parsedAppointments);
        return parsedAppointments;
      })
      .catch(error => {
        console.error("Error fetching patient history appointments:", error);
        throw error;
      });
  };

  return {
    getPatientById,
    getPatientHistoryAppointments,
    
  };
};
