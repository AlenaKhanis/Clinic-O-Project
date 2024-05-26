// HistoryAppointments.tsx
import { useState } from 'react';
import { Appointment } from './Types';
import { Button, Collapse, Table } from 'react-bootstrap';

type HistoryAppointmentsProps =  {
    patientHistoryAppointments: Appointment[];
    selectedDoctorDetails: Record<number, { doctorName: string, doctorSpecialty: string }>;
}

const HistoryAppointments = ({ patientHistoryAppointments, selectedDoctorDetails } : HistoryAppointmentsProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                style={{ width: 'fit-content' }}
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
                                    <td>{appointment.summery || "None"}</td>
                                    <td>{appointment.writen_diagnosis || "None"}</td>
                                    <td>{appointment.writen_prescription || "None"}</td>
                                    <td>{selectedDoctorDetails[appointment.doctor_id]?.doctorName || "Unknown"}</td>
                                    <td>{selectedDoctorDetails[appointment.doctor_id]?.doctorSpecialty || "Unknown"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Collapse>
        </>
    );
};

export default HistoryAppointments;
