import { useState   } from "react";
import { Appointment, Doctor, Patient } from "../Types";
import { useNavigate } from "react-router-dom"; 


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


//TODO: separate doctor and appointment

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);
    const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState<Appointment[]>([]);
    const [selectedDoctorDetails , setSelectedDoctorDetails] = useState<Doctor | null>(null);



    const navigate = useNavigate();

    //Pars the date time to string view
    function parseDateTime(data: Appointment[]): Appointment[] {
        return data.map(appointment => {
            // Convert date and time strings into Date objects
            const date = new Date(appointment.date_time);
      
            // Format date
            const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const dateString = date.toLocaleDateString('en-GB', options).replace(/\//g, '.');
    
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    
            return {
                ...appointment,
                date: dateString,
                time: formattedTime
            };
        });
    }
    
    
    

// Fetch appointments by doctorID
const fetchAppointments = (url: string) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch appointments");
            }
            return response.json();
        })
        .then((data: Appointment[]) => {
            const parsedAppointments = parseDateTime(data); 
            setAppointments(parsedAppointments);
            setSelectedDoctorAppointments(parsedAppointments);
            
        })
        .catch(error => {
            console.error("Error fetching appointments:", error);
           
        });
};


const handleViewDetails = (patient_id: number | null) => {
    if (!patient_id) {
        navigate('/patient-appointment');
        return;
    }

    fetch(`${BACKEND_URL}/get_petient_by_id/${patient_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch patient details");
            }
            return response.json();
        })
        .then((patientDetails: Patient) => {
            setSelectedPatientDetails(patientDetails);

            fetch(`${BACKEND_URL}/history_patient_appointments/${patient_id}`)
                .then(response => response.json())
                .then((data: Appointment[]) => {
                    const parsedAppointments = parseDateTime(data);

                    const stateData = {
                        patientDetails: patientDetails,
                        parsedAppointments: parsedAppointments
                    };
                    console.log(stateData)
                    navigate('/patient-appointment', { state: stateData });
                })
                .catch(error => {
                    console.error("Error fetching history appointments:", error);
                });
        })
        .catch(error => {
            console.error("Error fetching patient details:", error);
        });
};


// sort appointments by date
const filteredAppointments = appointments
    .filter((appointment: Appointment)=> {
        const match = appointment.date_time.match(/(\d+) (\w+) (\d+) (\d+:\d+:\d+)/);
        if (match) {
            const [, day, month, year, time] = match;
            const [hours, minutes, seconds] = time.split(':');

            // Convert month to numeric value
            const numericMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);

            // Construct a new Date object
            const appointmentDateTime = new Date(parseInt(year), numericMonth, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));

            // Check if the constructed date object is valid
            if (!isNaN(appointmentDateTime.getTime())) {
                const currentDateTime = new Date();
                return appointmentDateTime > currentDateTime;
            } else {
                console.error('Invalid date:', appointment.date_time);
                return false; // or handle this case differently
            }
        } else {
            console.error('Invalid date format:', appointment.date_time);
            return false; // or handle this case differently
        }
    })
    .sort((a: Appointment, b: Appointment) => {
        const dateA = new Date(a.date_time).getTime();
        const dateB = new Date(b.date_time).getTime();
        
        return dateA - dateB;
    });

    const getDoctordetails = (BACKEND_URL: string, doctorID: number) => {
        return fetch(`${BACKEND_URL}/get_doctors_by_Id/${doctorID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch doctor");
                }
                return response.json();
            })
            .then((data: Doctor) => {
                setSelectedDoctorDetails(data);
                return data;
            })
            .catch(error => {
                console.error("Error fetching doctor details:", error);
                throw error; // Re-throw the error to propagate it to the caller
            });
    };

   
    
    const startAppointment = () => {
        const currentDate = new Date();
        const endTime = new Date(currentDate.getTime() + 15 * 60000);
    
        const conflictingAppointment = appointments.find(appointment => {
            const appointmentDateTime = new Date(appointment.date_time);
            return appointmentDateTime > currentDate && appointmentDateTime < endTime;
        });
    
        return conflictingAppointment ? "You have another appointment scheduled within the next 15 minutes." : null;
    };
    
    // Inside your component's JSX:
    {startAppointment() && <span>{startAppointment()}</span>}


    function sendAppointmentData(formData: any) {
        return fetch(`${BACKEND_URL}/add_summary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data);
            alert("Appointment has ended successfully.");
        })
        .catch(error => {
            console.error('Error sending data to server:', error);
        });
    }

    const handleSubmit = (summaryRef: React.RefObject<HTMLTextAreaElement>, diagnosisRef: React.RefObject<HTMLInputElement>, prescriptionRef: React.RefObject<HTMLInputElement>) => {
        const summary = summaryRef.current?.value;
        const diagnosis = diagnosisRef.current?.value;
        const prescription = prescriptionRef.current?.value;
    
        const formData = {
            summary: summary,
            diagnosis: diagnosis,
            prescription: prescription
        };
    
        sendAppointmentData(formData);
    }
    


return { appointments,
       selectedPatientDetails,
       fetchAppointments,
       handleViewDetails,
       setSelectedPatientDetails,
       filteredAppointments,
       selectedDoctorAppointments,
       setSelectedDoctorAppointments,
       getDoctordetails,
       selectedDoctorDetails,
       setSelectedDoctorDetails,
       startAppointment,
       handleSubmit
       };
};


