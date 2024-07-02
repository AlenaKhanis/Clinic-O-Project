import { useBackendUrl } from "../BackendUrlContext";
import { Appointment, Patient } from "../Types";
import { useGlobalFunctions } from "./useGlobalFunctions";

//usePatientDetails hook provides several functions to interact with patient-related data

export const usePatientDetails = () => {
 
  const { parseDateTime } = useGlobalFunctions();
  const BACKEND_URL = useBackendUrl();
 
  // Fetches patient details by patientID
  const getPatientById = (patientID: number | null): Promise<Patient> => {
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

  //Fetches historical appointments for a patient.
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

  // Fetches upcoming appointments for a patient.
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

  //Cancels an appointment by appointmentId.
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

  // Fetches all patients
  const getAllPartients = (): Promise<Patient[]> => {
    return fetch(`${BACKEND_URL}/get_all_patients`)
      .then(response => response.json())
      .then((data: Patient[]) => {
        return data;
      })
      .catch(error => {
        console.error("Error fetching all patients:", error);
        throw error;
      });
    }

  return {
    getPatientById,
    getPatientHistoryAppointments,
    getPatientAppointments,
    cancelAppointment,
    getAllPartients
  };
};
