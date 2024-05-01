import { useEffect } from 'react';
import '../css/displayAppontments.css';
import { useAppointments } from "./doctorAppointmentFunction";
import {DisplayAppointmentsProps} from '../Types';



function SummeryAppointments({ doctorId, onAppointmentAdded , BACKEND_URL }: DisplayAppointmentsProps) {
    const { appointments, fetchAppointments, handleViewDetails, selectedPatientDetails , setSelectedPatientDetails } = useAppointments();

    useEffect(() => {
        if (doctorId) {
            const url = `${BACKEND_URL}/get_appointments?doctor_id=${doctorId}`;
            fetchAppointments(url);
        }
    }, [doctorId, onAppointmentAdded]);

    // Filter appointments that have already passed
    const filteredAppointments = appointments
        .filter(appointment => {
        const [day, month, year] = appointment.date.split('/');
        const [hours, minutes, seconds] = appointment.time.split(':');

        const appointmentDateTime = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds)
        );
        const currentDateTime = new Date();
        return appointmentDateTime < currentDateTime;
    })
    .filter(appointment => appointment.status === 'scedual');
    ;

    return (
        <>
            <div className={`tab-content ${filteredAppointments.length > 0 ? "with-scrollbar" : ""}`}>
                <h2>History Appointments</h2>
                {filteredAppointments.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>

                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>
                                        <button onClick={() => handleViewDetails(appointment.patient_id)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No history appointments</p>
                )}
            </div>
            <div>
               
                {selectedPatientDetails && (
                     //TODO: more css 
                     
                     <div className="appointment-details">
                     <button className="close-button" onClick={() => setSelectedPatientDetails(null)}>X</button>
                     <h3>Appointment Details</h3>
                     <p>Name: {selectedPatientDetails.full_name}</p>
                     <p>Age: {selectedPatientDetails.age}</p>
                     <p>Package: {selectedPatientDetails.package}</p>
                     <p>Phone: {selectedPatientDetails.phone}</p>
                     <p>Email: {selectedPatientDetails.email}</p>
                     <p>Patient Diagnoses: {selectedPatientDetails.diagnosis}</p>
                     <p>Patient Prescription: {selectedPatientDetails.prescription}</p>
                     <br></br>
                     <div><p>Summary visit:</p><input/></div>
                     <div><p>Add Diagnoses:</p><input/></div>
                     <div><p>Add Prescription:</p><input /></div>
                     <button>Save</button>{/* TODO: Send data */}
                 </div>
                 
                )}
            </div>

        </>
    );
}

export default SummeryAppointments;