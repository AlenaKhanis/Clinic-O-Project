import { useState } from "react";
import { Appointment } from "../Types";


export const usePatient = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    // TODO: this function is repet itsel and should be moved to a utils file
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
    

    const getPatientAppointments = (url: string) => {
        fetch(url)
            .then(response => response.json())
            .then((data: Appointment[]) => {
                const parsedAppointments = parseDateTime(data);
                setAppointments(parsedAppointments);
            })
            .catch(error => {
                console.error("Error fetching appointments:", error);
            });
    };

    const cancelAppointment = (BACKEND_URL : string , appointmentId : number) => {
        fetch(`${BACKEND_URL}/cancel_appointment/${appointmentId}`, { 
            
        })
        .then(response => {
            if (response.ok) {
                setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== appointmentId));
            } else {
                console.error("Failed to cancel appointment:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error cancelling appointment:", error);
        }); 
    };
    

    return { getPatientAppointments, appointments , cancelAppointment };
};
