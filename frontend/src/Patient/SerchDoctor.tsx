import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Doctor ,PatientProps } from '../Types';
import { useAppointments } from "../Doctor/doctorAppointmentFunction";
import '../css/displayAppontments.css'; // Import CSS file


function SearchDoctors({ BACKEND_URL , patientId }:  PatientProps) {
    const [searchDoctor, setSearchDoctor] = useState<Doctor[]>([]);
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [MessageScedual , setMessageScedual] = useState<string>('');
    const { fetchAppointments, selectedDoctorAppointments, setSelectedDoctorAppointments , filteredAppointments} = useAppointments();

    useEffect(() => {
        fetch(`${BACKEND_URL}/get_specialties`)
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
            setMessageScedual('');
        }
    };

    const scheduleAppointment = (appointmentId: number, appointmentDate: string, appointmentTime: string) => {
        if (isAppointmentExists(appointmentDate, appointmentTime)) {
            setMessageScedual('You already have an appointment at this date and time.');
        } else {
            fetch(`${BACKEND_URL}/scedual_appointment/${appointmentId}/${patientId}`, {
                method: 'POST',
            })
            .then(response => {
                if (response.ok){
                    setMessageScedual('Appointment scheduled successfully');
                    setSelectedDoctorAppointments([]);
                }
            })
            .catch(error => {
                console.error('Error scheduling appointment:', error);
                setMessageScedual('Failed to schedule appointment');
            });
        }
    };
    

    const isAppointmentExists = (date: string, time: string) => {
        return selectedDoctorAppointments.some(appointment => {
            return appointment.date === date && appointment.time === time && appointment.status !== 'schedule' && appointment.patient_id == patientId;
        });
    };
    

    // const filteredAppointments = selectedDoctorAppointments.filter(appointment => {
    //     const [day, month, year] = appointment.date.split('/');
    //     const [hours, minutes, seconds] = appointment.time.split(':');
    //     const appointmentDateTime = new Date(
    //         parseInt(year),
    //         parseInt(month) - 1,
    //         parseInt(day),
    //         parseInt(hours),
    //         parseInt(minutes),
    //         parseInt(seconds)
    //     );
    //     const currentDateTime = new Date();
    //     return appointmentDateTime >= currentDateTime && appointment.status !== 'scedual';
    // });

    
    return (
        <>
          <div className="content-container">
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
              <>
                <h2>Doctor's Appointments</h2>
                <div className="table-container">
                <Table  className="table">
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
                {filteredAppointments.length === 0 && !MessageScedual && (
                  <div className="no-appointments">
                    <h3>No appointments available</h3>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      );
    }      

export default SearchDoctors;