import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Appointment, Doctor, PatientProps } from '../Types';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import { usePatientDetails } from '../useFunctions/usePatientDetails';
import { useBackendUrl } from '../BackendUrlContext';
import { Button } from 'react-bootstrap';

/**
 * SearchDoctors Component
 *
 * @param {number} patientId - The ID of the patient using the component.
 * @param {Function} refreshAppointments - A function to refresh the patient's appointments after scheduling a new one.
 *
 * This component allows patients to search for doctors based on specialty or name and view available appointments.
 * Patients can schedule appointments directly through this interface. The component handles fetching data from a backend,
 * managing state, and displaying alert messages for user actions.
 */
function SearchDoctors({ patientId, refreshAppointments }: PatientProps & { refreshAppointments: () => void }) {
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

    // Fetch the backend URL from context
    const BACKEND_URL = useBackendUrl();

    // Effect to fetch patient appointments on component mount and whenever patientId or refreshAppointments change
    useEffect(() => {
        if (patientId) {
            getPatientAppointments(patientId)
                .then((data: Appointment[]) => setAppointments(data))
                .catch(error => console.error('Error fetching patient appointments:', error));
        }
    }, [patientId, refreshAppointments]);

    // Effect to fetch available specialties from the backend
    useEffect(() => {
        fetch(`${BACKEND_URL}/get_specialties`)
            .then(response => response.json())
            .then((data: { specialtys: string[] }) => {
                setSpecialties([...new Set(data.specialtys)]);
            })
            .catch(error => console.error('Error fetching specialties:', error));
    }, []);

    // Effect to handle search when selectedSpecialty or searchName changes
    useEffect(() => {
        handleSearch();
    }, [selectedSpecialty, searchName]);

    // Function to handle the search for doctors based on selected specialty and name
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
    // Function to handle clicking on a doctor to view their appointments
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

    // Function to schedule an appointment
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

    // Function to hide the alert message after a delay of 3 seconds
    const hideAlertAfterDelay = () => {
        setTimeout(() => {
            setShowAlert(false);
        }, 1000);
    };

    // Function to check if an appointment already exists for the patient at the given date and time
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

    // Filter and sort the appointments for the selected doctor
    const filteredAppointments = selectedDoctorAppointments
        .filter(appointment => {
            const appointmentDateTime = new Date(appointment.date_time);
            return appointmentDateTime > new Date() && appointment.status === 'open';
        })
        .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

    // Effect to hide alert message when the document becomes hidden (e.g., if the user switches tabs)
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
                        {filteredAppointments.length > 0 ? (
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
                                    {filteredAppointments.map((appointment, index) => {
                                        const appointmentDateTime = new Date(appointment.date_time);
                                        const day = appointmentDateTime.getUTCDate().toString().padStart(2, '0');
                                        const month = (appointmentDateTime.getUTCMonth() + 1).toString().padStart(2, '0');
                                        const year = appointmentDateTime.getUTCFullYear();
                                        const hours = appointmentDateTime.getUTCHours().toString().padStart(2, '0');
                                        const minutes = appointmentDateTime.getUTCMinutes().toString().padStart(2, '0');

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{`${day}.${month}.${year}`}</td>
                                                <td>{`${hours}:${minutes}`}</td>
                                                <td>
                                                <Button variant='outline-dark' onClick={() => scheduleAppointment(appointment.id, `${day}.${month}.${year}`, `${hours}:${minutes}`)}>
                                                    Schedule
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                        ) : (
                            <div className="no-appointments">No appointments available.</div>
                        )}
                    </div>
                </>
            )}
            {showAlert && (
                <div className="alert-container">
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                </div>
            )}
        </div>
    );
}

export default SearchDoctors;
