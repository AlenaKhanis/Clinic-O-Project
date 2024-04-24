import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

interface DisplayAppointmentsProps {
    tabKey: string | null;
    doctorId: string | null;
}

function DisplayAppointments({ tabKey, doctorId }: DisplayAppointmentsProps) {
    // State to hold appointments
    const [appointments, setAppointments] = useState<any[]>([]);

    // Function to fetch appointments from the backend
    function fetchAppointments(url: string) {
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch appointments");
                }
            })
            .then(data => {
                setAppointments(data);
            })
            .catch(error => {
                console.error("Error fetching appointments:", error);
            });
    }

    useEffect(() => {
        if (tabKey === "profile" && doctorId) {
            const url = `${BACKEND_URL}/get_appointments?doctor_id=${doctorId}`;
            fetchAppointments(url);
        }
    }, [tabKey, doctorId]);

    return (
        <div>
            <h2>Appointments</h2>
            <ul>
                {appointments.map((appointment, index) => (
                    <li key={index}>
                        {/* Render each appointment */}
                        Date: {new Date(appointment.date_time).toLocaleDateString()}, Time: {new Date(appointment.date_time).toLocaleTimeString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DisplayAppointments;
