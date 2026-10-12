import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="footer-logo">
              <GraduationCap size={24} />
            </div>
            <div>
              <strong>Gurukul</strong>
              <span>English Medium School</span>
            </div>
          </div>
          <p>
            Nurturing young minds with values, knowledge, and excellence since 2005.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-facebook">
              <FaFacebookF size={15} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-instagram">
              <FaInstagram size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-youtube">
              <FaYoutube size={17} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-linkedin">
              <FaLinkedinIn size={15} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="social-twitter">
              <FaXTwitter size={14} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/features">Features</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>For Parents</h4>
          <Link to="/login">Parent Portal</Link>
          <Link to="/login">Student Login</Link>
          <Link to="/login">Fee Payment</Link>
          <Link to="/login">Notices</Link>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <div className="footer-contact">
            <MapPin size={14} />
            <span>Station Road, Nanded, Maharashtra 431601</span>
          </div>
          <div className="footer-contact">
            <Phone size={14} />
            <span>+91 90000 00001</span>
          </div>
          <div className="footer-contact">
            <Mail size={14} />
            <span>info@gurukul.edu</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Gurukul English Medium School · All rights reserved.</p>
      </div>
    </footer>
  );
}