import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FiAlignJustify } from "react-icons/fi";
import '../css/OffCanvas.css';
import { Link } from 'react-router-dom';

interface OffCanvasExampleProps {
  placement?: 'start' | 'end' | 'top' | 'bottom';
  role: string; // 'owner' | 'doctor' | 'patient';
}

export function OffCanvasExample({ placement = 'end', role, ...props }: OffCanvasExampleProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <>
      <Button style={{ width: 'fit-content', margin: '20px' }} variant="outline-ligth" onClick={handleShow} className="me-2">
        <FiAlignJustify />
      </Button>
      <Offcanvas className="my-offcanvas" show={show} onHide={handleClose} placement={placement} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {role === 'owner' && <Link to="admin/admin_profile">My Profile</Link>}
          {role === 'doctor' && <Link to="doctor/doctor_profile">My Profile</Link>}
          {role === 'patient' && <Link to="/patient_profile">My Profile</Link>}
          {role !== 'owner' && role !== 'doctor' && role !== 'patient' && <span>No profile available</span>}
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
  
}
