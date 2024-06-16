import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import '../css/Tabs.css';
import 'react-calendar/dist/Calendar.css';
import '../css/calendar.css';
import { Alert, Button } from "react-bootstrap";

type AddAppointmentProps = {
    doctorId: number | null;
    onSuccess: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function AddAppointment({ doctorId, onSuccess }: AddAppointmentProps) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertVariant, setAlertVariant] = useState<'danger' | 'success'>('danger');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertTimer, setAlertTimer] = useState<number | null>(null); // Use 'number | null' for setTimeout return type

    useEffect(() => {
        // Clear the alert timer when component unmounts or when alert state changes
        return () => {
            if (alertTimer) {
                clearTimeout(alertTimer);
            }
        };
    }, [alertTimer]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime('');
        setAlertMessage('');
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(e.target.value);
        setAlertMessage('');
    };

    const handleFormSubmit = () => {
        if (selectedDate && selectedTime) {
            const datetime = new Date(selectedDate);
            const timeParts = selectedTime.split(':');
            datetime.setHours(parseInt(timeParts[0]));
            datetime.setMinutes(parseInt(timeParts[1]));

            const formattedDateTime = datetime.toISOString();
            const url = `${BACKEND_URL}/check_appointment?doctor_id=${doctorId}&datetime=${formattedDateTime}`;
            const appointmentData = {
                doctor_id: doctorId,
                datetime: formattedDateTime
            };

            fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => response.json())
            .then(data => {
                if (data.exists === true) {
                    setAlertVariant('danger');
                    setAlertMessage("Appointment already exists for selected date and time.");
                    setShowAlert(true);
                    setAlertTimer(setTimeout(() => {
                        setShowAlert(false);
                    }, 1000)); 
                } else {
                    fetch(`${BACKEND_URL}/add_appointment`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(appointmentData),
                    })
                    .then(response => {
                        if (response.ok) {
                            setAlertVariant('success');
                            setAlertMessage(`Scheduled Appointment: Date: ${selectedDate?.toLocaleDateString()} Time: ${selectedTime}`);
                            setShowAlert(true);
                            setAlertTimer(setTimeout(() => {
                                setShowAlert(false);
                                onSuccess(); 
                            }, 1000));
                        } else {
                            setAlertVariant('danger');
                            setAlertMessage("Oops! There was a problem scheduling the appointment.");
                            setShowAlert(true);
                            setAlertTimer(setTimeout(() => {
                                setShowAlert(false);
                            }, 1000)); 
                        }
                    })
                    .catch(error => {
                        console.error('Error adding appointment:', error);
                        setAlertVariant('danger');
                        setAlertMessage("Oops! There was a problem scheduling the appointment.");
                        setShowAlert(true);
                        setAlertTimer(setTimeout(() => {
                            setShowAlert(false);
                        }, 1000));
                    });
                }
            })
            .catch(error => {
                console.error('Error checking appointment:', error);
                setAlertVariant('danger');
                setAlertMessage("Oops! There was a problem checking the appointment.");
                setShowAlert(true);
                setAlertTimer(setTimeout(() => {
                    setShowAlert(false);
                }, 1000));
            });
        } else {
            console.error("Date or Time not selected");
        }
    };

    const renderTimeOptions = (startHour: number, endHour: number, step: number) => {
        const options = [];
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += step) {
                if (selectedDate && selectedDate.toDateString() === now.toDateString() && (hour < currentHours || (hour === currentHours && minute <= currentMinutes))) {
                    continue; // Skip times that are in the past for the selected day
                }
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(<option key={time} value={time}>{time}</option>);
            }
        }
        return options;
    };

    const isDisabled = () => {
        if (!selectedDate || !selectedTime) {
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
                    tileDisabled={tileDisabled}
                />
            </div>
            <div>
                <h3>Select Time:</h3>
                <select onChange={handleTimeChange} value={selectedTime}>
                    <option value="">Select Time</option>
                    {renderTimeOptions(8, 21, 30)}
                </select>
            </div>
            <Button style={{ width: 'fit-content', margin: '20px' }} variant="outline-dark" onClick={handleFormSubmit} disabled={isDisabled()}>Submit</Button>
            {showAlert && (
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
        </>
    );
}

export default AddAppointment;
