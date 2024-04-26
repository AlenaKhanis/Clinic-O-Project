import { useState, useEffect } from "react";
import { Appointment , PatientDetails} from "../UserTypes";
import "../css/displayAppontments.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

type DisplayAppointmentsProps = {
    doctorId: string | null;
    onAppointmentAdded: () => void;
};

function DisplayAppointments({ doctorId, onAppointmentAdded }: DisplayAppointmentsProps) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [SelectedPatientDetails ,setSelectedPatientDetails ] = useState<PatientDetails | null>(null);

    useEffect(() => {
        if (doctorId) {
            const url = `${BACKEND_URL}/get_appointments?doctor_id=${doctorId}`;
            fetchAppointments(url);
        }
    }, [doctorId, onAppointmentAdded]);

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
                const appointmentsData = data.map(appointment => ({
                    date: new Date(appointment.date).toLocaleDateString('en-GB', options),
                    time: appointment.time.split(' ')[4],
                    status: appointment.status,
                    patient_id: appointment.patient_id,
                    id: appointment.id 
                }));
                setAppointments(appointmentsData);
            })
            .catch(error => {
                console.error("Error fetching appointments:", error);
            });
    };

    const handleViewDetails = (patient_id: number | null) => {
        console.log(patient_id)
        if (patient_id === null) return; 
        fetch(`${BACKEND_URL}/get_petient_by_id/${patient_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch patient details");
                }
                return response.json();
            })
            .then((patientDetails: PatientDetails) => {
                setSelectedPatientDetails(patientDetails);
            })
            .catch(error => {
                console.error("Error fetching patient details:", error);
            });
    };
    
    const isPastAppointment = (date: string, time: string) => {
        const appointmentDateTime = new Date(`${date} ${time}`);
        const currentDateTime = new Date();
        console.log(appointmentDateTime);
        console.log(currentDateTime);
        return appointmentDateTime < currentDateTime;
    };

    return (
        <>
        <div className={appointments.length > 0 ? "tab-content with-scrollbar" : "tab-content"}>
            <h2>Appointments</h2>
            {appointments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.status}</td>
                                <td>
                                    {!isPastAppointment(appointment.date, appointment.time) &&
                                        <button onClick={() => handleViewDetails(appointment.patient_id)}>View Details</button>
                                    }
                                 
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No appointments</p>
            )}

        </div>
        <div>
                    {/* Display appointment details when selected */}
                    {SelectedPatientDetails && (
                            <div>
                                <h3>Appointment Details</h3>
                                <p>Name: {SelectedPatientDetails.patient_name}</p>
                                <p>Diagnoses: {SelectedPatientDetails.diagnosis}</p>
                                <p>Prescription: {SelectedPatientDetails.prescription}</p>
                                {/* {isPastAppointment(appointments.date, appointments.time) && 
                                    <div>
                                        <input type="text" placeholder="Prescription" />
                                        <input type="text" placeholder="Diagnosis" />
                                        <button>Submit</button>
                                    </div>
                                } */}
                            </div>
                        )}
                    </div>
                    </>
    );
}

export default DisplayAppointments;
