import { Appointment } from "../Types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const useAppointmentActions = () => {

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



  return {
     handleSubmit,
     getAppointmentsbyID

    };
};
