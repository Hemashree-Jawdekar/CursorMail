import React, { useState, useEffect } from 'react';
import {
  faUser,
  faGear,
  faMoon,
  faSignOutAlt,
  faInbox,
  faBan,
  faPaperPlane,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import EditProfile from './EditProfile';
import './App.css';

const Home = ({ setIsAuth }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/home', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.user.username);
        if (data.user.profile_photo_filename) {
          setProfilePhoto(`http://localhost:5000/api/profile/photo/${data.user.id}`);
        } else {
          setProfilePhoto(null);
        }
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        setIsAuth(false);
        navigate('/');
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLogout && !event.target.closest('.profile-dropdown')) {
        setShowLogout(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogout]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        await fetchUserData();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        fetchUserData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUserData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleInbox = () => {};
  const handleSpam = () => {};
  const handleSent = () => {};
  const handleDrafts = () => {};

  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Top Navigation Bar */}
      <nav className="navbar" style={{ width: "100vw", left: 0, right: 0, position: "fixed", top: 0 }}>
        <span className="navbar-title">CursorMail</span>
      </nav>

      {/* Left Sliding Bar */}
      <div
        style={{
          position: "fixed",
          top: "4rem",
          left: 0,
          height: "calc(100vh - 4rem)",
          width: "4.5rem",
          background: darkMode ? "#222" : "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          zIndex: 100,
          padding: "1rem 0"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "1rem" }}>
          <button title="Inbox" onClick={handleInbox} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faInbox} size="lg" />
          </button>
          <button title="Spam" onClick={handleSpam} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faBan} size="lg" />
          </button>
          <button title="Sent" onClick={handleSent} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
          </button>
          <button title="Drafts" onClick={handleDrafts} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faFileAlt} size="lg" />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
          <button title="Profile" onClick={handleEditProfile} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faCircleUser} size="lg" />
          </button>
          <button title="Logout" onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c" }}>
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="search-bar" style={{ marginTop: "5rem", marginLeft: "5.5rem" }}>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
        <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md">Search</button>
      </div>
    </div>
  );
};

export default Home;
