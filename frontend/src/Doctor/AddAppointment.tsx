import { useState } from "react";
import Calendar from "react-calendar";
import '../css/adminPage.css';
import 'react-calendar/dist/Calendar.css'; 

type AddAppointmentProps = {
    doctorId: string | null;
    onSuccess: () => void; // Function to trigger when a new appointment is successfully added
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function AddAppointment({ doctorId, onSuccess }: AddAppointmentProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>(''); 
    const [scheduledAppointments, setScheduledAppointments] = useState<string>('');

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits for month
        const day = date.getDate().toString().padStart(2, '0'); // Ensure 2 digits for day
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (date: Date | Date[]) => {
        setSelectedDate(date instanceof Date ? date : null);
        setSelectedTime('');
        setScheduledAppointments('');
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(e.target.value);
        setScheduledAppointments('');
    };

    const handleFormSubmit = () => {
        if (selectedDate && selectedTime) {
            const formattedDate = formatDate(selectedDate); 
            const url = `${BACKEND_URL}/check_appointment?doctor_id=${doctorId}&date=${formattedDate}&time=${selectedTime}:00`;
            const appointmentData = {
                doctor_id: doctorId,
                date: formattedDate,
                time: selectedTime
            };

            fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => response.json())
            .then(data => {
                if (data.exists === true) {
                    setScheduledAppointments("Appointment already exists for selected date and time.");
                } else {
                    fetch(`${BACKEND_URL}/add_appointment`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(appointmentData),
                    })
                    .then(response => {
                        if (response.ok){
                            setScheduledAppointments(`Schedule Appointment: Date:${formattedDate} Time:${selectedTime}`);
                            onSuccess(); 
                        } else {
                            setScheduledAppointments("Oops! There was a problem scheduling the appointment.");
                        }
                    })
                    .catch(error => {
                        console.error('Error adding appointment:', error);
                    });
                }
            })
            .catch(error => {
                console.error('Error checking appointment:', error);
            });
        } else {
            console.error("Date or Time not selected");
        }
    };

    const renderTimeOptions = (startHour: number, endHour: number, step: number) => {
        const options = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += step) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(<option key={time} value={time}>{time}</option>);
            }
        }
        return options;
    };

    const isDisabled = () => {
        if (!selectedDate) {
            return true;
        }
    
        const today = new Date();
        const currentTimeInSeconds = today.getHours() * 3600 + today.getMinutes() * 60;
        const isSameDay = selectedDate.getDate() === today.getDate();
    
        if (isSameDay) {
            if (selectedTime !== '') {
                const selectedTimeParts = selectedTime.split(':');
                const selectedTimeInSeconds = parseInt(selectedTimeParts[0]) * 3600 + parseInt(selectedTimeParts[1]) * 60;
                return selectedTimeInSeconds <= currentTimeInSeconds;
            } else {
                return true; 
            }
        } else {
            return selectedDate < today;
        }
    };


    // Function to disable dates before yesterday
    const tileDisabled = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); 
            return date < yesterday;
        }
        return false;
    };


    return (
        <>
            <div>
                <h3>Select Date:</h3>
                <Calendar
                    onClickDay={handleDateChange}
                    value={selectedDate}
                    className="custom-calendar"
                    tileDisabled={tileDisabled} // Pass the tileDisabled function to disable dates before today
                />
            </div>
            <div>
                <span style={{ color: 'red' }}>{scheduledAppointments}</span>
                <h3>Select Time:</h3>
                <select onChange={handleTimeChange} value={selectedTime}>
                    <option value="">Select Time</option>
                    {renderTimeOptions(8, 21, 30)}
                </select>
            </div>
            <button onClick={handleFormSubmit} disabled={isDisabled()}>Submit</button>
        </>
    );
}

export default AddAppointment;
