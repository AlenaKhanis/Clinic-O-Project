import { useEffect, useState } from "react";
import { Appointment, Doctor, PatientProps } from "../Types";
import { useAppointments } from "../DoctorComponents/doctorAppointmentFunction";
import { Button } from 'react-bootstrap';




function PatientHistoryAppointments({BACKEND_URL , patientId, refreshAppointments }: PatientProps) {
    const [selectHistoryAppointments, setSelectHistoryAppointments] = useState<Appointment[]>([]);
    const { getPatientHistoryAppointments ,getDoctordetails} = useAppointments();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [openAppointments, setOpenAppointments] = useState<{ [key: number]: boolean }>({});

    const toggleAppointmentDetails = (id: number) => {
        setOpenAppointments(prevState => ({ ...prevState, [id]: !prevState[id] }));
    };

    useEffect(() => {
    if (patientId) {
        getPatientHistoryAppointments(patientId).then((data: Appointment[]) => { 
        setSelectHistoryAppointments(data);
        });
    }
    }, [patientId, refreshAppointments]);


        useEffect(() => {
        selectHistoryAppointments.forEach(appointment => {
            getDoctordetails(appointment.doctor_id)
                .then((doctor: Doctor) => {
                    setDoctor(doctor);
                })
                .catch(error => console.error("Error fetching patient details:", error));
        });
    }, [selectHistoryAppointments]);


    return (
        <>
            <div>
                {selectHistoryAppointments.length > 0 ? (
                    <table>
                        <tbody>
                            {selectHistoryAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>Date: {appointment.date}</td>
                                    <td>Time: {appointment.time}</td>
                                    <td>
                                        <Button
                                            onClick={() => toggleAppointmentDetails(appointment.id)}
                                            aria-controls={`appointment-details-${appointment.id}`}
                                            aria-expanded={openAppointments[appointment.id]}
                                        >
                                            {openAppointments[appointment.id] ? 'Hide Details' : 'Show Appointment Details'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No history appointments</p>
                )}
            </div>
            {selectHistoryAppointments.map((appointment, index) => (
                <div key={`details-${index}`} style={{ display: openAppointments[appointment.id] ? 'block' : 'none' }}>
                    <p>
                        <span style={{ fontWeight: 'bold' }}>Summary:</span> {appointment.summery}
                    </p>
                    <p>Writen_diagnosis: {appointment.writen_diagnosis}</p>
                    <p>Writen_prescription: {appointment.writen_prescription}</p>
                    <p>Doctor: {doctor ? doctor.full_name : 'Loading...'}</p>
                    <p>Specialty: {doctor ? doctor.specialty : 'Loading...'}</p>
                </div>
            ))}
        </>
    );
};
export default PatientHistoryAppointments;