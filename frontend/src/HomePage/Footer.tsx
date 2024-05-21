
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../css/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h1 className="logo-text">CompanyName</h1>
          <p>
            CompanyName is a fictional company that provides top-notch services
            and products to its customers worldwide.
          </p>
        </div>
        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com" className="social-icon"><FaFacebook /></a>
            <a href="https://www.twitter.com" className="social-icon"><FaTwitter /></a>
            <a href="https://www.instagram.com" className="social-icon"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CompanyName. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
