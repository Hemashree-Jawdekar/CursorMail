import React, { useState } from 'react';
import axios from 'axios';
import RegisterAP from './RegisterAP';
import { useNavigate, Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import google from './images/google.png';
import './Register.css';
import image5 from "./images/smiley.jpeg";
import image6 from "./images/medal.jpeg";
import image1 from "./images/standing-9@2x.png";
import image2 from "./images/standing-10.png";
import image3 from "./images/Message circle.png";
import image4 from "./images/Message square.png";

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Check if username exists
  const checkUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/check-username/${username}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  // Validate password confirmation
  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Handle username change and check existence
  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setUsernameError('');

    if (newUsername.length >= 3) {
      const exists = await checkUsername(newUsername);
      if (exists) {
        setUsernameError('Username already exists');
      }
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('');

    // Validate password confirmation
    if (!validatePassword()) {
      return;
    }

    // Check if username exists
    if (usernameError) {
      setMsg('Please choose a different username');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/register', { username, password, email });
      setMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after registration
      }, 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="register-content">
          <h1 className="register-welcome-message">Create Your Account</h1>


          <div className="register-input-with-icon">
            <UserIcon className="register-input-icon" />
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          {usernameError && <div className="field-error">{usernameError}</div>}

          <div className="register-input-with-icon">
            <EnvelopeIcon className="register-input-icon" />
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="register-input-with-icon">
            <LockClosedIcon className="register-input-icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="register-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <EyeSlashIcon className="eye-icon" /> : <EyeIcon className="eye-icon" />}
            </button>
          </div>

          <div className="register-input-with-icon">
            <FontAwesomeIcon icon={ faCircleCheck} className='register-input-icon' />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <button
              type="button"
              className="register-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {!showConfirmPassword ? <EyeSlashIcon className="eye-icon" /> : <EyeIcon className="eye-icon" />}
            </button>
          </div>
          {passwordError && <div className="field-error">{passwordError}</div>}

          <button type="submit" className="register-btn" onClick={handleRegister}>Sign in</button>


          <div className="divider">
            <span>or</span>
          </div>

          <button className="google-btn">
            <img src={google} alt="Google" className='google-icon' />
            Sign up with Google
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login">Log in here</Link>
          </div>

          {msg && <div className={`message ${msg.includes('successfully') ? 'success-message' : 'error-message'}`}>{msg}</div>}
        </div>
      </div>

      <div className="register-right">
        <div className="register-main-image">
          <div className='image-4'><img src={image4} alt="Feature 3" /></div>
          <div className='emoji-1'><img src={image5} alt="Feature 4" /></div>
          <div className="standing-image"><img src={image1} alt="Standing person" /></div>
          <div className='image-2'><img src={image2} alt="Feature 1" /></div>
          <div className='image-3'><img src={image3} alt="Feature 2" /></div>
          <div className='emoji-2'><img src={image6} alt="Feature 4" /></div>

        </div>
    </div>
    </div>
  );
}
