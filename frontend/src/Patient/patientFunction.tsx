import { useState } from "react";
import { Appointment } from "../Types";
import { useNavigate } from "react-router-dom";


export const usePatient = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const [selectHistoryAppointment, setSelectHistoryAppointmentr] = useState<Appointment[]>([]);


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
    
    const cancelAppointment = (BACKEND_URL: string, appointmentId: number) => {
        fetch(`${BACKEND_URL}/cancel_appointment/${appointmentId}`, {})
            .then(response => {
                if (response.ok) {
                    // Remove the canceled appointment from the local state
                    setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== appointmentId));
                } else {
                    console.error("Failed to cancel appointment:", response.statusText);
                }
            })
            .catch(error => {
                console.error("Error cancelling appointment:", error);
            });
    };
    
    

    
    

    const filteredAppointments = appointments
    .filter((appointment) => {
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
                const isFuture = appointmentDateTime > currentDateTime;
                const isNotCompleted = appointment.status !== 'completed';
                return isFuture && isNotCompleted;
            } else {
                console.error('Invalid date:', appointment.date_time);
                return false; // or handle this case differently
            }
        } else {
            console.error('Invalid date format:', appointment.date_time);
            return false; // or handle this case differently
        }
    })
    .sort((a, b) => {
        const dateA = new Date(a.date_time).getTime();
        const dateB = new Date(b.date_time).getTime();
        
        return dateA - dateB;
    });


    // const historyPatientAppointment = (BACKEND_URL: string, patientId: number) => {
    //     fetch(`${BACKEND_URL}/history_patient_appointments/${patientId}`)
    //         .then(response => response.json())
    //         .then((data: Appointment[]) => {
    //             const parsedAppointments = parseDateTime(data);  
    //             setSelectHistoryAppointmentr(parsedAppointments);
    //         });
    // };
    
    

    return { getPatientAppointments, appointments , cancelAppointment , selectHistoryAppointment , filteredAppointments };
};
