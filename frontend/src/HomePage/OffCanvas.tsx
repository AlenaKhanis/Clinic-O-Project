import { useState} from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FiAlignJustify } from "react-icons/fi";
import '../css/OffCanvas.css';

interface OffCanvasExampleProps {
  placement?: 'start' | 'end' | 'top' | 'bottom';
}

export function OffCanvasExample({ placement = 'end',...props }: OffCanvasExampleProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button  style={{ width: 'fit-content' , margin: '20px' }} variant="outline-ligth"  onClick={handleShow} className="me-2">
        <FiAlignJustify/>
      </Button>
      <Offcanvas className="my-offcanvas" show={show} onHide={handleClose} placement={placement} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}