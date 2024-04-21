import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Calendar, View, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { ToolbarProps } from 'react-big-calendar';
import "../css/adminPage.css";




const CustomToolbardate = (toolbarProps: ToolbarProps) => {
  // Define custom event handler type
  const handleViewChange = (view: View) => {
      toolbarProps.onView(view);
  };

  return (
      <div className="custom-toolbar">
          <button className="toolbar-button" onClick={() => handleViewChange('month')}>
              Month
          </button>
          <button className="toolbar-button" onClick={() => handleViewChange('week')}>
              Week
          </button>
          <button className="toolbar-button" onClick={() => handleViewChange('day')}>
              Day
          </button>
          <span className="toolbar-label">{toolbarProps.label}</span>
      </div>
  );
};


const localizer = momentLocalizer(moment);

interface SlotInfo {
    start: Date;
    end: Date;
}

interface MyCalendarProps {
    onSave: (slot: SlotInfo) => void;
}



function MyCalendar({ onSave }: MyCalendarProps) {
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
      setSelectedSlot(slotInfo);
  };

  const handleSave = () => {
      if (selectedSlot) {
          onSave(selectedSlot);
          setSelectedSlot(null); // Clear selected slot after saving
      }
  };

  return (
      <div style={{ height: 500 }}>
          <Calendar
              localizer={localizer}
              onSelectSlot={handleSelectSlot}
              selectable
              events={[]}
              style={{ width: '100%' }}
              components={{ toolbar: CustomToolbardate }} 
          />
          {selectedSlot && (
              <div style={{ marginTop: 10 }}>
                  <p>Selected slot:</p>
                  <p>Start: {selectedSlot.start.toLocaleString()}</p>
                  <p>End: {selectedSlot.end.toLocaleString()}</p>
                  <button onClick={handleSave}>Save</button>
              </div>
          )}
      </div>
  );
}


function DoctorHomePage() {
    const handleSave = (selectedSlot: SlotInfo) => {
        console.log('Selected slot:', selectedSlot);
        // Add logic to save the selected slot data to your data structure or send it to the server
    };

    return (
        <div style={{ width: '700px', height: '700px' }}>
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="home" title="Open Appointments">
                    <MyCalendar onSave={handleSave} />
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