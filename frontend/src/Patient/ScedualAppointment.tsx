import { useState, useEffect } from 'react';

import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Button } from 'react-bootstrap';

import { Appointment, Doctor } from '../Types';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import { usePatientDetails } from '../useFunctions/usePatientDetails';
import { useBackendUrl } from '../BackendUrlContext';

import '../css/SearchDoctors.css';


/**
 * SearchDoctors component 
 * provides a user interface for patients to search for doctors based on their specialty or name.
 * schedule appointments with selected doctors. 
 */


function SearchDoctors({ patientId, refreshAppointments }: & {patientId: number | null , refreshAppointments: () => void }) {
    const [searchDoctor, setSearchDoctor] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState<Appointment[]>([]);
    
    const { fetchDoctorAppointments } = useDoctorAppointments();
    const { getPatientAppointments } = usePatientDetails();


    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState<'success' | 'danger' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [showNoDoctorsFound, setShowNoDoctorsFound] = useState(false);

    const BACKEND_URL = useBackendUrl();

    useEffect(() => {
        if (patientId) {
            getPatientAppointments(patientId)
                .then((data: Appointment[]) => setAppointments(data))
                .catch(error => console.error('Error fetching patient appointments:', error));
        }
    }, [patientId, refreshAppointments]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/get_specialties`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: { specialties: string[] }) => {
                setSpecialties([...new Set(data.specialties)]);
            })
            .catch(error => {
                console.error('Error fetching specialties:', error);
            });
    }, []);

    // Perform search whenever selectedSpecialty or searchName changes
    useEffect(() => {
        handleSearch();
    }, [selectedSpecialty, searchName]);

    // Function to handle search for doctors based on specialty or name
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
                    if (data.doctors.length === 0) {
                        setSearchDoctor([]);
                        setShowNoDoctorsFound(true);
                    } else {
                        setSearchDoctor(data.doctors);
                        setSelectedDoctorId(null);
                        setSelectedDoctorAppointments([]);
                        setShowNoDoctorsFound(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching doctors:', error);
                    setSearchDoctor([]);
                    setShowNoDoctorsFound(true);
                });
        }
    };

     // Handle clicking on a doctor's row to fetch and display their appointments
    const handleDoctorClick = (doctorId: number) => {
        if (selectedDoctorId === doctorId) {
            setSelectedDoctorId(null);
        } else {
            setSelectedDoctorId(doctorId);
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
            hideAlertAfterDelay();
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
                    hideAlertAfterDelay();
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
                    hideAlertAfterDelay();
                });
        }
    };

    const hideAlertAfterDelay = () => {
        setTimeout(() => {
            setShowAlert(false);
        }, 3000); 
    };

    // Check if the patient already has an appointment at the given date and time
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

    // Filter and sort appointments for the selected doctor
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
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => {
                            setSelectedSpecialty(e.target.value);
                            setSearchName('');
                            setSelectedDoctorId(null);
                            setSelectedDoctorAppointments([]);
                            setShowNoDoctorsFound(false);
                        }}
                    >
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
                                <th>Name</th>
                                <th>Specialty</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchDoctor.map((doctor, index) => (
                                <tr
                                    key={index}
                                    onClick={() => handleDoctorClick(doctor.doctor_id)}
                                    className="doctor-row"
                                >
                                    <td>{doctor.full_name}</td>
                                    <td>{doctor.specialty}</td>
                                    <td>{doctor.email}</td>
                                    <td>{doctor.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {showNoDoctorsFound && searchDoctor.length === 0 && (
                        <div className="not-found">No doctors found matching your search criteria.</div>
                    )}
                </div>
            )}
            {selectedDoctorId !== null && (
                <>
                    <h2>Doctor's Appointments</h2>
                    <div className="table-container">
                        {filteredAppointments.length > 0 ? (
                            <Table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.map((appointment, index) => {
                                        const appointmentDateTime = new Date(appointment.date_time);
                                        const day = appointmentDateTime.getUTCDate().toString().padStart(2, '0');
                                        const month = (appointmentDateTime.getUTCMonth() + 1).toString().padStart(2, '0');
                                        const year = appointmentDateTime.getUTCFullYear();
                                        const hours = appointmentDateTime.getUTCHours().toString().padStart(2, '0');
                                        const minutes = appointmentDateTime.getUTCMinutes().toString().padStart(2, '0');

                                        return (
                                            <tr key={index}>
                                                <td>{`${day}.${month}.${year}`}</td>
                                                <td>{`${hours}:${minutes}`}</td>
                                                <td>
                                                    <Button
                                                        variant='outline-dark'
                                                        onClick={() => scheduleAppointment(
                                                            appointment.id,
                                                            `${day}.${month}.${year}`,
                                                            `${hours}:${minutes}`
                                                        )}
                                                    >
                                                        Schedule
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="not-found">No appointments available.</div>
                        )}
                    </div>
                </>
            )}
            
            {showAlert && (
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
        </div>
    );
}

export default SearchDoctors;
