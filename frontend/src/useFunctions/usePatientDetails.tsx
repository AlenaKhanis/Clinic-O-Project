
import { Appointment, Patient } from "../Types";
import { useGlobalFunctions } from "./useGlobalFunctions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const usePatientDetails = () => {
 
  const { parseDateTime } = useGlobalFunctions();
 
  const getPatientById = (patientID: number): Promise<Patient> => {
    return fetch(`${BACKEND_URL}/get_patient_by_id/${patientID}`)
      .then(response => response.json())
      .then((data: Patient) => {
        return data;
      })
      .catch(error => {
        console.error("Error fetching patient details:", error);
        throw error;
      });
  };

  const getPatientHistoryAppointments = (patientID: number): Promise<Appointment[]> => {
    return fetch(`${BACKEND_URL}/history_patient_appointments/${patientID}`)
      .then(response => response.json())
      .then((data: Appointment[]) => {
        const parsedAppointments = parseDateTime(data);
        return parsedAppointments;
      })
      .catch(error => {
        console.error("Error fetching patient history appointments:", error);
        throw error;
      });
  };

const getPatientAppointments = (patientId : number): Promise<Appointment[]> => {
  return fetch(`${BACKEND_URL}/get_appointments_by_patient_id/${patientId}`)
    .then(response => response.json())
    .then((data: Appointment[]) => {
        const parsedAppointments = parseDateTime(data);
        return parsedAppointments;
    })
    .catch(error => {
        console.error("Error fetching appointments:", error);
        throw error;
    });
};

const cancelAppointment = ( appointmentId: number): Promise<void> => {
  return fetch(`${BACKEND_URL}/cancel_appointment/${appointmentId}`, {
      method: 'POST'
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`Failed to cancel appointment: ${response.statusText}`);
          }
      })
      .catch(error => {
          console.error("Error cancelling appointment:", error);
          throw error;
      });
};

  return {
    getPatientById,
    getPatientHistoryAppointments,
    getPatientAppointments,
    cancelAppointment
    
  };
};
