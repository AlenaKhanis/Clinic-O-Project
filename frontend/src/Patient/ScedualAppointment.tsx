import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Appointment, Doctor, PatientProps } from '../Types';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import { usePatientDetails } from '../useFunctions/usePatientDetails';
import Alert from 'react-bootstrap/Alert';

function SearchDoctors({ BACKEND_URL, patientId, refreshAppointments }: PatientProps & { refreshAppointments: () => void }) {
    const [searchDoctor, setSearchDoctor] = useState<Doctor[]>([]);
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState<Appointment[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { fetchDoctorAppointments } = useDoctorAppointments();
    const { getPatientAppointments } = usePatientDetails();
    const [searchName, setSearchName] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState<'success' | 'danger' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState<string>('');

    useEffect(() => {
        if (patientId) {
            getPatientAppointments(patientId)
                .then((data: Appointment[]) => setAppointments(data))
                .catch(error => console.error('Error fetching patient appointments:', error));
        }
    }, [patientId, refreshAppointments]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/get_specialties`)
            .then(response => response.json())
            .then((data: { specialtys: string[] }) => {
                setSpecialties([...new Set(data.specialtys)]);
            })
            .catch(error => console.error('Error fetching specialties:', error));
    }, []);

    useEffect(() => {
        handleSearch();
    }, [selectedSpecialty, searchName]);

    const handleSearch = () => {
        let query = `${BACKEND_URL}/get_doctor`;
        if (selectedSpecialty || searchName) {
            if (selectedSpecialty) {
                query += `/by_specialty/${selectedSpecialty}`;
            }
            if (searchName) {
                query += `/by_name/${searchName}`;
            }

            fetch(query)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch doctors: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((data: { doctors: Doctor[] }) => {
                    setSearchDoctor(data.doctors);
                    setSelectedDoctorId(null);
                    setSelectedDoctorAppointments([]);
                })
                .catch(error => console.error('Error fetching doctors:', error));
        }
    };

    const handleDoctorClick = (doctorId: number) => {
        setSelectedDoctorId(doctorId);
        if (doctorId) {
            fetchDoctorAppointments(doctorId)
                .then((data: Appointment[]) => {
                    setSelectedDoctorAppointments(data);
                    setShowAlert(false);
                })
                .catch(error => console.error('Error fetching doctor appointments:', error));
        }
    };

    const scheduleAppointment = (appointmentId: number, appointmentDate: string, appointmentTime: string) => {
        const formattedAppointmentTime = appointmentTime.split(':').map(part => part.padStart(2, '0')).join(':');

        if (isAppointmentExists(appointmentDate, formattedAppointmentTime)) {
            setAlertMessage('You already have an appointment at this date and time.');
            setAlertVariant('danger');
            setShowAlert(true);
        } else {
            fetch(`${BACKEND_URL}/schedule_appointment/${appointmentId}/${patientId}`, {
                method: 'POST',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to schedule appointment');
                    }
                    setAlertMessage('Appointment scheduled successfully.');
                    setAlertVariant('success');
                    setShowAlert(true);
                    setSearchDoctor([]);
                    setSelectedDoctorId(null);
                    setSelectedDoctorAppointments([]);
                    refreshAppointments();
                })
                .catch(error => {
                    console.error('Error scheduling appointment:', error);
                    setAlertMessage('Failed to schedule appointment.');
                    setAlertVariant('error');
                    setShowAlert(true);
                });
        }
    };

    const isAppointmentExists = (date: string, time: string) => {
        return appointments.some(appointment => {
            const appointmentDateTime = new Date(appointment.date_time);
            const appointmentDate = appointmentDateTime.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
            const hours = appointmentDateTime.getUTCHours();
            const minutes = appointmentDateTime.getUTCMinutes();
            const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

            return appointmentDate === date && formattedTime === time && appointment.patient_id === Number(patientId);
        });
    };

    const filteredAppointments = selectedDoctorAppointments
        .filter(appointment => {
            const appointmentDateTime = new Date(appointment.date_time);
            return appointmentDateTime > new Date() && appointment.status === 'open';
        })
        .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setShowAlert(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div className="content-container">
            <div>
                <h2>Search for Doctors</h2>
                <div className="search-filters">
                    <select value={selectedSpecialty} onChange={(e) => {
                        setSelectedSpecialty(e.target.value);
                        setSearchName('');
                        setSelectedDoctorId(null); 
                        setSelectedDoctorAppointments([]); 
                    }}>
                        <option value="">Select Specialty</option>
                        {specialties.map((specialty, index) => (
                            <option key={index} value={specialty}>{specialty}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search by doctor's name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
            </div>
            {(selectedSpecialty || searchName) && (
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
                <>
                    <h2>Doctor's Appointments</h2>
                    <div className="table-container">
                        <Table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredAppointments.map((appointment, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.time}</td>
                                            <td><button onClick={() => scheduleAppointment(appointment.id, appointment.date, appointment.time)}>Schedule</button></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </div>
                    {!filteredAppointments.length && (
                        <div className="no-appointments">
                            <h3>No appointments available</h3>
                        </div>
                    )}
                </>
            )}
            {showAlert && (
                <Alert variant={alertVariant} onClose={() => {setShowAlert(false)
                setSearchName('')
                setSelectedDoctorAppointments([]); }  } dismissible>
                    {alertMessage}
                </Alert>
            )}
        </div>
    );
}

export default SearchDoctors;
