import { useState } from "react";
import { Appointment, Patient } from "../UserTypes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);


// Get All App
const fetchAppointments = (url: string) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch appointments");
            }
            return response.json();
        })
        .then((data: Appointment[]) => {
            const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

            const appointmentsData = data.map(appointment => {
                const date = new Date(appointment.date);
                const dateString = date.toLocaleDateString('en-GB', options);
                
                // Extract year, month, day, hours, minutes, and seconds from the time string
                const year = parseInt(appointment.time.slice(12, 16));
                const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(appointment.time.slice(8, 11));
                const day = parseInt(appointment.time.slice(5, 7));
                const hours = parseInt(appointment.time.slice(17, 19));
                const minutes = parseInt(appointment.time.slice(20, 22));
                const seconds = parseInt(appointment.time.slice(23, 25));

                // Construct new Date object using extracted components
                const time = new Date(year, month, day, hours, minutes, seconds);

                // Format time back to string
                const timeString = time.toLocaleTimeString('en-US', { hour12: false });

                return {
                    date: dateString,
                    status: appointment.status,
                    patient_id: appointment.patient_id,
                    id: appointment.id,
                    time: timeString,
                };
            });

            setAppointments(appointmentsData);
        })
        .catch(error => {
            console.error("Error fetching appointments:", error);
        });
};



// See App Details by patient id
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
        return appointmentDateTime >= currentDateTime;
    })
    .sort((a, b) => {
        // Concatenate date and time strings for comparison
        const dateTimeA = `${a.date} ${a.time}`;
        const dateTimeB = `${b.date} ${b.time}`;

        // Compare concatenated strings directly
        if (dateTimeA < dateTimeB) return 1;
        if (dateTimeA > dateTimeB) return -1;
        return 0;
    });

return { appointments, selectedPatientDetails, fetchAppointments, handleViewDetails ,setSelectedPatientDetails ,filteredAppointments};
};


