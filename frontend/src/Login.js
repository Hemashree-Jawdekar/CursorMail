import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import './Login.css';
import Home from './Home';
import Aftersignup from './Aftersignup';
import girl from './images/sitting-2.png';
import image12 from './images/11.png';
import image13 from './images/Avatar Group.png';
import image1 from './images/1.png';
import image2 from './images/10.png';
import image3 from './images/12.png';
import image4 from './images/13.png';
import image5 from './images/14.png';
import image6 from './images/15.png';
import image7 from './images/16.png';
import image8 from './images/17.png';
import image9 from './images/20.png';
import image10 from './images/21.png';
import image11 from './images/23.png';
import ellipse from './images/Ellipse 1.png';
import line1 from './images/Line 1.png';
import line2 from './images/Line 8.png';
import line3 from './images/Line 3.png';
import line4 from './images/Line 4.png';
import line5 from './images/Line 5.png';
import line6 from './images/Line 6.png';
import line7 from './images/Line 7.png';
import line8 from './images/Line 8.png';
import image14 from './images/18.png';

export default function Login({ setIsAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      console.log('Login response:', res.data);
      localStorage.setItem('token', res.data.token);
      setIsAuth(true);
      navigate('/home');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-content">
          <h1 className="login-welcome-message">Welcome Back</h1>


          <div className="login-form-group">
            <div className="login-input-with-icon">
              <UserIcon className="register-input-icon" />
              <input
                id="Username"
                type="Username"
                placeholder="     Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <div className="login-input-with-icon">
              <LockClosedIcon className="login-input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}   // <-- use state here
                placeholder="     Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon className="eye-icon" /> : <EyeIcon className="eye-icon" />}
              </button>

            </div>
          </div>

          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>

          <button type="submit" className="login-btn" onClick={handleLogin}>Log in</button>


          <div className="signup-link">
            Don't Have an Account? <Link to="/register">Sign up</Link>
          </div>

          {msg && <div className="error-message">{msg}</div>}
        </div>
      </div>

      <div className="login-right">

        <div className="login-main-image">
          <div className="girl-image"><img src={girl} alt="Girl sitting" /></div>
          <div className="ellipse"><img src={ellipse} alt="Ellipse" /></div>
          <div className="floating-image fimage-1">
            <img src={image1} alt="Feature 1" />
          </div>
          <div className="floating-image fimage-2">
            <img src={image2} alt="Feature 2" />
          </div>
          <div className="floating-image fimage-3">
            <img src={image3} alt="Feature 3" />
          </div>
          <div className="floating-image fimage-4">
            <img src={image4} alt="Feature 4" />
          </div>
          <div className="floating-image fimage-5">
            <img src={image5} alt="Feature 5" />
          </div>
          <div className="floating-image fimage-6">
            <img src={image6} alt="Feature 6" />
          </div>
          <div className="floating-image fimage-7">
            <img src={image7} alt="Feature 7" />
          </div>
          <div className="floating-image fimage-8">
            <img src={image8} alt="Feature 8" />
          </div>
          <div className="floating-image fimage-9">
            <img src={image9} alt="Feature 9" />
          </div>
          <div className="floating-image fimage-10">
            <img src={image10} alt="Feature 10" />
          </div>
          <div className="floating-image fimage-11">
            <img src={image11} alt="Feature 11" />
          </div>
          <div className="floating-image fimage-12">
            <img src={image12} alt="Feature 12" />
          </div>
          <div className="floating-image fimage-13">
            <img src={image13} alt="Feature 13" />
          </div>
          <div className="floating-image fimage-14">
            <img src={image14} alt="Feature 14" />
          </div>
          <div className='connecting-lines line1'><img src={line1} alt="Feature 14" /></div>
          <div className='connecting-lines line2'><img src={line2} alt="Feature 15" /></div>
          <div className='connecting-lines line3'><img src={line3} alt="Feature 16" /></div>
          <div className='connecting-lines line4'><img src={line4} alt="Feature 17" /></div>
          <div className='connecting-lines line5'><img src={line5} alt="Feature 18" /></div>
          <div className='connecting-lines line6'><img src={line6} alt="Feature 19" /></div>
          <div className='connecting-lines line7'><img src={line7} alt="Feature 20" /></div>
          <div className='connecting-lines line8'><img src={line8} alt="Feature 21" /></div>
        </div>
      </div>

    </div>
  );
}
