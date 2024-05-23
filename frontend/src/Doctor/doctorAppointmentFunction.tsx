import { useState   } from "react";
import { Appointment, Doctor, Patient } from "../Types";
import { useNavigate } from "react-router-dom"; 
import moment from 'moment-timezone';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


//TODO: separate doctor and appointment

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);
    const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState<Appointment[]>([]);
    const [selectedDoctorDetails , setSelectedDoctorDetails] = useState<Doctor | null>(null);
    const [selectHistoryAppointments , setSelectHistoryAppointments] = useState<Appointment[]>([]);
    const navigate = useNavigate();

    function parseDateTime(data: Appointment[]): Appointment[] {
        return data.map(appointment => {
            const date = moment.utc(appointment.date_time);
            const dateString = date.format('DD.MM.YYYY');
            const formattedTime = date.format('HH:mm');

            return {
                ...appointment,
                date: dateString,
                time: formattedTime
            };
        });
    }
        
    
    const fetchDoctorAppointments = (doctorID: number) => {
        fetch(`${BACKEND_URL}/get_appointments/${doctorID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch doctor appointments');
                }
                return response.json();
            })
            .then((data: Appointment[]) => {
                const partsAppointments = parseDateTime(data)
                setAppointments(partsAppointments);
                setSelectedDoctorAppointments(partsAppointments);
                
            })
            .catch(error => {
                console.error('Error fetching doctor appointments:', error);
            });
    };


    const getPatientById = (patient_id: number | null) => {
    return fetch(`${BACKEND_URL}/get_patient_by_id/${patient_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch patient details");
            }
            return response.json();
        });
};

const getPatientHistoryAppointments = (patient_id: number | null) => {
    return fetch(`${BACKEND_URL}/history_patient_appointments/${patient_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch patient history appointments");
            }
            return response.json();
        });
};

const handleViewDetails = (patient_id: number | null , appointmentId?: number) => {
    if (!patient_id) {
        return;
    }
    getPatientById(patient_id)
        .then((patientDetails: Patient) => {
            setSelectedPatientDetails(patientDetails);

            getPatientHistoryAppointments(patient_id)
                .then((data: Appointment[]) => {
                    const parsedAppointments = parseDateTime(data);
                    const stateData = {
                        patientDetails: patientDetails,
                        parsedAppointments: parsedAppointments,
                        appointmentId: appointmentId
                    };
                    
                    navigate('patient-appointment', { state: stateData });
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
        .filter((appointment: Appointment) => {
            const appointmentDate = moment(appointment.date_time, 'DD MMM YYYY HH:mm:ss');
            const currentDate = moment().startOf('day');
            return appointmentDate.isSameOrAfter(currentDate);
         
        })
        .sort((a: Appointment, b: Appointment) => {
            const dateA = moment(a.date_time, 'DD MMM YYYY HH:mm:ss');
            const dateB = moment(b.date_time, 'DD MMM YYYY HH:mm:ss');
            return dateA.diff(dateB);
        });


        
        const getDoctordetails = (doctorID: number | null) => {
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
                    throw error; 
                });
        };
        
        const handleSubmit = (summaryRef: React.RefObject<HTMLTextAreaElement>, diagnosisRef: React.RefObject<HTMLInputElement>, prescriptionRef: React.RefObject<HTMLInputElement> , appointmentID: number, patient_id: number) => {
            const summary = summaryRef.current?.value;
            const diagnosis = diagnosisRef.current?.value;
            const prescription = prescriptionRef.current?.value;
        
            if (summary && diagnosis && prescription) {
                const formData = {
                    summary: summary,
                    diagnosis: diagnosis,
                    prescription: prescription
                };
        
                fetch(`${BACKEND_URL}/add_summary/${appointmentID}/${patient_id}`, {
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
                })
                .catch(error => {
                    console.error("Error in handleSubmit:", error);
                });
            } else {
                console.error("One or more inputs are undefined");
            }
        };

    const get_history_doctor_appointments = (doctor_id: number) => {
        fetch(`${BACKEND_URL}/get_appointments_history/${doctor_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: Appointment[]) => {
            const parsData = parseDateTime(data)
            setSelectHistoryAppointments(parsData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    
    


return { appointments,
       selectedPatientDetails,
       fetchDoctorAppointments,
       handleViewDetails,
       setSelectedPatientDetails,
       filteredAppointments,
       selectedDoctorAppointments,
       setSelectedDoctorAppointments,
       getDoctordetails,
       selectedDoctorDetails,
       setSelectedDoctorDetails,
       handleSubmit,
       get_history_doctor_appointments,
       selectHistoryAppointments,
       getPatientById,
       getPatientHistoryAppointments
       
       };
};


