import { useState } from "react";
import { Appointment, Patient } from "../Types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);
    const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState<Appointment[]>([]);

    //Pars the date time to string view
    function parseDateTime(data: Appointment[]): Appointment[] {
        return data.map(appointment => {
            const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const date = new Date(appointment.date);
            const dateString = date.toLocaleDateString('en-GB', options);
    
            const year = parseInt(appointment.time.slice(12, 16));
            const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(appointment.time.slice(8, 11));
            const day = parseInt(appointment.time.slice(5, 7));
            const hours = parseInt(appointment.time.slice(17, 19));
            const minutes = parseInt(appointment.time.slice(20, 22));
            const seconds = parseInt(appointment.time.slice(23, 25));
    
            const time = new Date(year, month, day, hours, minutes, seconds);
            const timeString = time.toLocaleTimeString('en-US', { hour12: false });
    
            return {
                ...appointment,
                date: dateString,
                time: timeString
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
            console.log(data)
            const parsedAppointments = parseDateTime(data);
            setAppointments(parsedAppointments);
            setSelectedDoctorAppointments(parsedAppointments);
        })
        .catch(error => {
            console.error("Error fetching appointments:", error);
           
        });
};

// View details of a patient by appointment
const handleViewDetails = (patient_id: number | null) => {
    if (!patient_id){
    setSelectedPatientDetails(null);
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
        })
        .catch(error => {
            console.error("Error fetching patient details:", error);
        });
};


// sort appointments by date
const filteredAppointments = appointments
    .filter(appointment => {
        const [day, month, year] = appointment.date.split('/');
        const [hours, minutes, seconds] = appointment.time.split(':');

        // Construct a new Date object
        const appointmentDateTime = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds)
        );

        const currentDateTime = new Date();
        return appointmentDateTime > currentDateTime;
    })
    .sort((a, b) => {

        const [monthA, yearA] = a.date.split('/');
        const [monthB, yearB] = b.date.split('/');


        if (yearA < yearB) return -1;
        if (yearA > yearB) return 1;

        if (monthA < monthB) return -1;
        if (monthA > monthB) return 1;

        const timeA = new Date(`2000-01-01T${a.time}`);
        const timeB = new Date(`2000-01-01T${b.time}`);
        if (timeA < timeB) return 1;
        if (timeA > timeB) return -1;

        return 0;
    });
    

return { appointments,
       selectedPatientDetails,
       fetchAppointments,
       handleViewDetails,
       setSelectedPatientDetails,
       filteredAppointments,
       selectedDoctorAppointments,
       setSelectedDoctorAppointments,
       };
};


