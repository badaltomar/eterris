import {
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* 1. BRAND & CONTACT */}
          <div className="footer-section brand-section">
            <div className="footer-logo">
              <div className="logo-box-sm">E</div>
              <span className="brand-name">Eterris CRM</span>
            </div>
            <p className="footer-desc">
              Simplifying customer relationships with data-driven insights, lead
              tracking, and automated sales pipelines.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>183 Innovation Dr, Tech City, India</span>
              </div>
              <div className="contact-item">
                <Phone size={16} className="contact-icon" />
                <span>+91 73109 25207</span>
              </div>
            </div>
          </div>

          {/* 2. PRODUCT (App Routes) */}
          <div className="footer-section">
            <h4>Product</h4>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/sales">Sales Pipeline</NavLink>
            <NavLink to="/reports">Reports & Analytics</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </div>

          {/* 3. MANAGEMENT (App Routes) */}
          <div className="footer-section">
            <h4>Management</h4>
            <NavLink to="/leads">All Leads</NavLink>
            <NavLink to="/agents">Agents Team</NavLink>
            <NavLink to="/leads/status">Leads by Status</NavLink>
            <NavLink to="/leads/new">Add New Lead</NavLink>
          </div>

          {/* 4. CONNECT (Socials) */}
          <div className="footer-section social-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a
                href="https://www.linkedin.com/in/badaltomar/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://x.com/"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:tomarbadal9@gmail.com"
                aria-label="Email"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="footer-bottom">
          <p>© {currentYear} Eterris CRM Pvt. Ltd. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
