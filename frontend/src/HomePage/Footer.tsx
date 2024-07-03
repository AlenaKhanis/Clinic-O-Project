import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../css/footer.css';

/**
 * The Footer component represents the footer section of the Clinic-O application.
 * It includes the company description, social media links, and copyright information.
 */

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h1 className="logo-text">Clinic-O</h1>
          <p>
            Clinic-O is dedicated to providing compassionate healthcare services to our community.<br />
            &copy; {new Date().getFullYear()} Clinic-O. All rights reserved.
          </p>
        </div>
        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com/clinic-o" className="social-icon"><FaFacebook /></a>
            <a href="https://www.twitter.com/clinic-o" className="social-icon"><FaTwitter /></a>
            <a href="https://www.instagram.com/clinic-o" className="social-icon"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
