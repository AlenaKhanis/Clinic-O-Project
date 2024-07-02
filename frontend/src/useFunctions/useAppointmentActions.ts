import { Appointment } from "../Types";
import { useBackendUrl } from "../BackendUrlContext";

/*
  useAppointmentActions hook provides several useful functions related to managing appointments.
*/


export const useAppointmentActions = () => {

  const BACKEND_URL = useBackendUrl();
  

  // Fetches a specific appointment from the backend based on its ID  
  const getAppointmentsbyID = (appointmentID: number) => {
      return fetch(`${BACKEND_URL}/get_appointment_by_id/${appointmentID}`)
      .then(response => response.json())
      .then((data: Appointment) => {
          return data;
          })
          .catch(error => {
              console.error('Error fetching appointment by ID:', error);
              throw error;
          });
  }

  // Handles the submission of summary, diagnosis, and prescription data for an appointment to the backend.
  const handleSubmit = (
    summaryRef: React.RefObject<HTMLTextAreaElement>,
    diagnosisRef: React.RefObject<HTMLInputElement>,
    prescriptionRef: React.RefObject<HTMLInputElement>,
    appointmentID: number,
    patient_id: number
  ) => {
    const summary = summaryRef.current?.value;
    const diagnosis = diagnosisRef.current?.value;
    const prescription = prescriptionRef.current?.value;

    if (summary && diagnosis && prescription) {
      const formData = { summary, diagnosis, prescription };

      fetch(`${BACKEND_URL}/add_summary/${appointmentID}/${patient_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => console.error("Error in handleSubmit:", error));
    } else {
      console.error("One or more inputs are undefined");
    }
  };


//  Filters appointments based on the specified filterType (e.g., 'today', 'thisWeek', 'thisMonth').
const filterAppointments = (appointments: Appointment[], filterType: string): Appointment[] => {
  const today = new Date();

  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.date_time);

    switch (filterType) {
      case 'today':
        return isSameDay(apptDate, today);
      case 'thisWeek':
        const startOfWeek = getStartOfWeek(today);
        const endOfWeek = getEndOfWeek(today);
        return apptDate >= startOfWeek && apptDate <= endOfWeek;
      case 'thisMonth':
        return apptDate.getMonth() === today.getMonth();
      default:
        return true;
    }
  });

  return filteredAppointments;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const getStartOfWeek = (date: Date): Date => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getEndOfWeek = (date: Date): Date => {
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() - date.getDay() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};




  return {
     handleSubmit,
     getAppointmentsbyID,
     filterAppointments

    };
};
