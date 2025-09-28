import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './RegisterAP.css';
import logo from './images/mail.png';
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot } from "@fortawesome/free-solid-svg-icons";

export default function RegisterAP() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [step2FormData, setStep2FormData] = useState({
    newEmail: "",
    newPassword: "",
  });
  const [senderEmail, setSenderEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Fetch previous email and app password from backend
    const fetchEmail = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/home', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSenderEmail(data.user?.email || "");
        setFormData(f => ({ ...f, email: data.user?.email || "" }));
        // Check if app password exists
        if (data.user?.app_password) {
          navigate('/home');
        }
      }
    };
    fetchEmail();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStep2Change = (e) => {
    setStep2FormData({
      ...step2FormData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const goToLogin = () => navigate('/login');
  const goToStep2 = () => setStep(2);
  const goBackToStep1 = () => setStep(1);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/register-ap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_email: formData.email,
          app_password: formData.password,
        }),
      });
      if (res.ok) {
        // Optionally check response data for success
        // const data = await res.json();
        // if (data.success) {
        //   navigate('/home');
        // }
        navigate('/home');
      } else {
        // Handle error (show message, etc.)
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/register-ap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_email: step2FormData.newEmail,
          app_password: step2FormData.newPassword,
        }),
      });
      if (res.ok) {
        navigate('/home');
      } else {
        // Handle error (show message, etc.)
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="register-ap-container">
      {step === 1 && (
        <>
          <div className="register-ap-left">
            <img src={logo} alt="CursorMail Logo" className="register-ap-logo" />
            <h2>ElevateMail</h2>
          </div>
          <div className="register-ap-form">
            <label>
              <input
                type="email"
                name="email"
                value={senderEmail}
                readOnly
              />
            </label>
            <label className="register-ap-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter App Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="app-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? <EyeSlashIcon className="eye-icon" /> : <EyeIcon className="eye-icon" />}
              </button>
            </label>
            <button type="button" onClick={goToStep2} className="change_sender">
            Do you want to change Sender Email?
          </button>
            <div className="register-ap-actions">
              <button type="button" onClick={goToLogin}><FontAwesomeIcon icon={faCircleDot} className="help-dot"/> Help</button>
              <button type="submit" onClick={handleSubmit}>Register</button>
            </div>
            
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="register-ap-left">
            <img src={logo} alt="CursorMail Logo" className="register-ap-logo" />
            <h2>ElevateMail</h2>
          </div>
          <div className="register-ap-form">

            <label>
              <input
                type="email"
                name="newEmail"
                placeholder="Enter new sender email"
                value={step2FormData.newEmail}
                onChange={handleStep2Change}
                required
              />
            </label>
            <label className="register-ap-password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new app password"
                value={step2FormData.newPassword}
                onChange={handleStep2Change}
                required
              />
              <button
                type="button"
                className="app-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? <EyeSlashIcon className="eye-icon" /> : <EyeIcon className="eye-icon" />}
              </button>
            </label>
            <div className="register-ap-actions">
              <button type="button"><FontAwesomeIcon icon={faCircleDot} className="help-dot"/> Help</button>
              <button type="submit">Register</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
