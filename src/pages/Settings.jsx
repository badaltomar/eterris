import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Monitor,
  AlertTriangle,
  Smartphone,
  Globe,
  Save
} from "lucide-react";
import { toast } from "react-toastify";
import "../components/common/Settings.css"; 

export default function Settings() {
  const [demoPassword, setDemoPassword] = useState("");

  const handleDemoAction = (action) => {
    toast.info(`Demo Mode: ${action} simulated!`);
  };

  return (
    <div className="settings-page-container pageLoadAnimation">
      
      {/* HEADER */}
      <div className="settings-header">
        <div>
           <h2>Security & Access</h2>
           <p>Manage your security preferences (Demo Mode).</p>
        </div>
        {/* Fake Save Button */}
        <button className="btn-primary-small" onClick={() => handleDemoAction("Settings Saved")}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* RESPONSIVE GRID WRAPPER */}
      <div className="settings-grid-layout">
        
        {/* LEFT COLUMN */}
        <div className="grid-column">
          
          {/* 1. PASSWORD (Interactive Now) */}
          <div className="settings-card">
            <div className="card-top">
              <div className="card-icon-wrapper bg-blue"><Lock size={20} /></div>
              <div className="card-header-text">
                <h3>Password</h3>
              </div>
            </div>
            
            <p className="card-desc">Set a unique password to protect your account.</p>

            <div className="form-stack">
              <div className="input-group">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="card-footer">
              <button className="btn-primary-outline" onClick={() => handleDemoAction("Password Update")}>
                Update Password
              </button>
            </div>
          </div>

          {/* 2. SESSIONS */}
          <div className="settings-card">
            <div className="card-top">
              <div className="card-icon-wrapper bg-purple"><Monitor size={20} /></div>
              <div className="card-header-text">
                <h3>Active Sessions</h3>
              </div>
            </div>

            <div className="session-list">
              <div className="session-item">
                <div className="session-icon"><Globe size={18} /></div>
                <div className="session-details">
                  <strong>Chrome on Windows</strong>
                  <span>New Delhi, India • Active now</span>
                </div>
                <span className="current-badge">This Device</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid-column">
          
          {/* 3. 2FA (Interactive Toggles) */}
          <div className="settings-card">
            <div className="card-top">
              <div className="card-icon-wrapper bg-green"><ShieldCheck size={20} /></div>
              <div className="card-header-text">
                <h3>Two-Factor Authentication</h3>
              </div>
            </div>

            <p className="card-desc">Secure your account with 2FA.</p>

            <div className="toggles-container">
              <div className="toggle-row">
                <div className="toggle-info">
                  <strong>Authenticator App</strong>
                  <span>Google Auth / Authy</span>
                </div>
                <label className="switch">
                  <input type="checkbox" onChange={() => handleDemoAction("2FA Toggled")} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* 4. DANGER ZONE */}
          <div className="settings-card danger-zone">
            <div className="card-top">
              <div className="card-icon-wrapper bg-red"><AlertTriangle size={20} /></div>
              <div className="card-header-text">
                <h3 className="text-red">Danger Zone</h3>
              </div>
            </div>
            <p className="card-desc">Irreversible actions.</p>
            <div className="danger-actions">
              <div className="danger-row">
                <strong>Delete Account</strong>
                <button className="btn-danger-solid" onClick={() => handleDemoAction("Delete Account Blocked")}>
                  Delete
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}