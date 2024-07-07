import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './css/about.css';

// About component that displays information about the clinic

const About: React.FC = () => {
  return (
    <Container className="about-container">
      <Row>
        <Col>
          <Card className="about-card">
            <Card.Body>
              <Card.Title>About Clinic-O</Card.Title>
              <Card.Text>
                Welcome to Clinic-O! We are dedicated to providing the best healthcare services for you and your family. Our team of experienced doctors and friendly staff are here to ensure you receive the highest quality care.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="about-card">
            <Card.Body>
              <Card.Title>Our Mission</Card.Title>
              <Card.Text>
                Our mission is to improve the health and well-being of our patients by providing comprehensive, high-quality medical care in a compassionate and welcoming environment.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="about-card">
            <Card.Body>
              <Card.Title>Our Services</Card.Title>
              <Card.Text>
                We offer a wide range of medical services including general check-ups, specialist consultations, diagnostic tests, and more. Our state-of-the-art facilities are equipped to handle all your healthcare needs.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="about-card">
            <Card.Body>
              <Card.Title>Contact Us</Card.Title>
              <Card.Text>
                Have questions or need to make an appointment? Contact us at 456-7890 or email us at info@clinico.com. We are here to help you!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="about-card">
            <Card.Body>
              <Card.Title>Our History</Card.Title>
              <Card.Text>
                Clinic-O was founded in 1990 with the goal of providing high-quality healthcare services to the community. Over the past 30 years, we have grown to become a trusted provider of comprehensive medical care.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="about-card">
            <Card.Body>
              <Card.Title>Meet Our Team</Card.Title>
              <Card.Text>
                Our team consists of highly qualified doctors, nurses, and administrative staff who are committed to providing excellent care. Each member of our team brings a unique set of skills and expertise to our clinic.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;