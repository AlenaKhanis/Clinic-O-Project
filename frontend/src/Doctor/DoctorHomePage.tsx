import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Calendar from 'react-calendar'; // Import Calendar component from react-calendar
import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../css/adminPage.css';

function DoctorHomePage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>(''); // Use string for selected time

    const formatDate = (date: Date): string => {
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDateChange = (date: Date | Date[]) => {
        setSelectedDate(date instanceof Date ? date : null);
        setSelectedTime(''); // Reset selected time when date changes
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(e.target.value);
    };

    const handleFormSubmit = () => {
        if (selectedDate && selectedTime) {
            const combinedDateTime = `${formatDate(selectedDate)} ${selectedTime}`;
            // Here you can send the combinedDateTime to your data processing function or API
            console.log("Combined Date and Time:", combinedDateTime);
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
    ;
    

    return (
        <div style={{ width: '700px', height: '700px' }}>
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="home" title="Open Appointments">
                    <div>
                        <h3>Select Date:</h3>
                        <Calendar
                            onClickDay={handleDateChange}
                            value={selectedDate}
                            className="custom-calendar"
                        />
                    </div>
                    <div>
                        <h3>Select Time:</h3>
                        <select onChange={handleTimeChange} value={selectedTime}>
                            <option value="">Select Time</option>
                            {renderTimeOptions(8, 21, 30)}
                        </select>
                    </div>
                    <button onClick={handleFormSubmit} disabled={isDisabled()}>Submit</button>
                </Tab>
                <Tab eventKey="profile" title="Profile">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="contact" title="Contact">
                    Tab content for Contact
                </Tab>
            </Tabs>
        </div>
    );
}

export default DoctorHomePage;
