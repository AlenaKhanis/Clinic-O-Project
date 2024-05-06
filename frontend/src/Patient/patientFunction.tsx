import { useState } from "react";
import { Appointment } from "../Types";
import { useNavigate } from "react-router-dom";


export const usePatient = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [, setCancelAppointmentCalled] = useState(false);
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
    
    
    const cancelAppointment = (BACKEND_URL : string , appointmentId : number) => {
        fetch(`${BACKEND_URL}/cancel_appointment/${appointmentId}`, { 
            
        })
        .then(response => {
            if (response.ok) {
                setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== appointmentId));
                setCancelAppointmentCalled(true);
                
            } else {
                console.error("Failed to cancel appointment:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error cancelling appointment:", error);
        }); 
    };

    const historyPatientAppointment = (BACKEND_URL: string, patientId: number , navigateCallback?: (parsedAppointments: Appointment[]) => void) => {
        fetch(`${BACKEND_URL}/history_patient_appointments/${patientId}`)
            .then(response => response.json())
            .then((data: Appointment[]) => {
                // Parse date and time of appointments
                const parsedAppointments = parseDateTime(data);
                console.log("parse",parsedAppointments)    
                // Invoke navigateCallback if provided
                if (navigateCallback) {
                    navigateCallback(parsedAppointments); 
                }
                
                // Set the parsed appointments
                setSelectHistoryAppointmentr(parsedAppointments);
            });
    };
    
    

    return { getPatientAppointments, appointments , cancelAppointment , setCancelAppointmentCalled ,historyPatientAppointment };
};
