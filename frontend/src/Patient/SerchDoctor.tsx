import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Doctor } from '../UserTypes';
import { useAppointments } from "../Doctor/appointmentsFunction";
import '../css/displayAppontments.css'; // Import CSS file

type SearchDoctorsProps = {
    BACKEND_URL: string;
    patientId : string | null;
};

function SearchDoctors({ BACKEND_URL , patientId }:  SearchDoctorsProps) {
    const [searchDoctor, setSearchDoctor] = useState<Doctor[]>([]);
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const { fetchAppointments, selectedDoctorAppointments, setSelectedDoctorAppointments } = useAppointments();

    useEffect(() => {
        fetch(`${BACKEND_URL}/get_specialetys`)
            .then(response => response.json())
            .then((data: { specialtys: string[] }) => {
                setSelectedDoctorId(null); // Reset selected doctor when searching by specialty
                setSelectedDoctorAppointments([]); // Reset appointments
                // Filter out duplicates
                const uniqueSpecialties = [...new Set(data.specialtys)];
                setSpecialties(uniqueSpecialties);
            })
            .catch(error => console.error('Error fetching specialties:', error));
    }, [BACKEND_URL]);

    const handleSearch = () => {
        if (selectedSpecialty) {
            fetch(`${BACKEND_URL}/get_doctors_by_specialty/${selectedSpecialty}`)
                .then(response => response.json())
                .then((data: { doctors: Doctor[] }) => {
                    const doctors = data.doctors; 
                    setSearchDoctor(doctors);
                    setSelectedDoctorId(null);
                    setSelectedDoctorAppointments([]);
                })
                .catch(error => console.error('Error fetching doctors:', error));
        }
    };

    const handleDoctorClick = (doctorId: number) => {
        setSelectedDoctorId(doctorId);
        if (doctorId) {
            const appointmentsURL = `${BACKEND_URL}/get_appointments?doctor_id=${doctorId}`;
            fetchAppointments(appointmentsURL);
        }
    };

    const scheduleAppointment = (appointmentId: number) => {

        fetch(`${BACKEND_URL}/scedual_appointment/${appointmentId}/${patientId}`, {
            method: 'POST',
        })
        .then(response => {
            if (response.ok){
                console.log('added')
            }
        })
        .catch(error => {
            console.error('Error scheduling appointment:', error);
        });

    };

    return (
        <>
            <div>
                <h2>Search for Doctors</h2>
                <select onClick={handleSearch} value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                    <option value="">Select Specialty</option>
                    {specialties.map((specialty, index) => (
                        <option key={index} value={specialty}>{specialty}</option>
                    ))}
                </select>
            </div>
            {selectedSpecialty && selectedSpecialty !== "" && (
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Specialty</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchDoctor.map((doctor, index) => (
                                <tr key={index} onClick={() => handleDoctorClick(doctor.doctor_id)} className="doctor-row">
                                    <td>{index + 1}</td>
                                    <td>{doctor.full_name}</td>
                                    <td>{doctor.specialty}</td>
                                    <td>{doctor.email}</td>
                                    <td>{doctor.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
            {selectedDoctorId !== null && (
                <div>
                    <h2>Doctor's Appointments</h2>
                    {selectedDoctorAppointments.length > 0 ? (
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedDoctorAppointments
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
                                        return appointmentDateTime >= currentDateTime;
                                    })
                                    .map((appointment, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.time}</td>
                                            <td><button onClick={() => scheduleAppointment(appointment.id)}>Schedule</button></td>
                                        </tr>
                                    ))}
                            </tbody>      
                        </Table>
                    ) : (
                        <div className="no-appointments">
                            <h3>No appointments available</h3>
                        </div>
                    )}
                </div>
            )}
        </>
    ); 
    
}

export default SearchDoctors;
