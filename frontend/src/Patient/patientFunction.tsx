import { useState } from "react";
import { Appointment } from "../Types";


export const usePatient = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

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

    return { getPatientAppointments, appointments };
};
