import { useEffect, useState } from 'react';
import { Appointment, Doctor } from '../Types';
import { Button, Collapse, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { usePatientDetails } from '../useFunctions/usePatientDetails';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import '../css/HistoryAppt.css';

const HistoryAppointments = () => {
    const { patient_id } = useParams<{ patient_id: string }>();
    const patientIdNumber = Number(patient_id);
    const [open, setOpen] = useState(false);
    const { getPatientHistoryAppointments } = usePatientDetails();
    const { getDoctorById } = useDoctorAppointments();
    const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Record<number, { doctorName: string, doctorSpecialty: string }>>({});
    const [patientHistoryAppointments, setPatientHistoryAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        if (patient_id) {
            getPatientHistoryAppointments(patientIdNumber)
                .then((data: Appointment[]) => {
                    setPatientHistoryAppointments(data);
                })
                .catch(error => {
                    console.error("Error fetching patient history appointments:", error);
                });
        }
    }, [patient_id]);

    useEffect(() => {
        const uniqueDoctorIds = new Set<number>();
        patientHistoryAppointments.forEach((appointment: Appointment) => {
            uniqueDoctorIds.add(appointment.doctor_id);
        });

        uniqueDoctorIds.forEach((doctorId: number) => {
            getDoctorById(doctorId)
                .then((doctor: Doctor) => {
                    if (doctor) {
                        setSelectedDoctorDetails(prevMap => ({
                            ...prevMap,
                            [doctorId]: {
                                doctorName: doctor.full_name,
                                doctorSpecialty: doctor.specialty
                            }
                        }));
                    }
                })
                .catch(error => {
                    console.error("Error fetching doctor details:", error);
                });
        });
    }, [patientHistoryAppointments]);

    return (
        <>
            <div className="box-histoty_main">
                <Button
                    className='history-appointments-button'
                    variant="outline-dark"
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                >
                    History Appointments
                </Button>
                <Collapse in={open}>
                    <div id="example-collapse-text">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Summary</th>
                                    <th>Written Diagnosis</th>
                                    <th>Written Prescriptions</th>
                                    <th>Doctor Name</th>
                                    <th>Doctor Specialty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientHistoryAppointments.map((appointment: Appointment, index: number) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.summary}</td> 
                                        <td>{appointment.written_diagnosis}</td> 
                                        <td>{appointment.written_prescription}</td> 
                                        <td>{selectedDoctorDetails[appointment.doctor_id]?.doctorName || "Unknown"}</td>
                                        <td>{selectedDoctorDetails[appointment.doctor_id]?.doctorSpecialty || "Unknown"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Collapse>
            </div>
        </>
    );
};

export default HistoryAppointments;
