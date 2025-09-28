import React, { useState, useEffect, useRef } from 'react';
import Typed from "typed.js";
import {
  faCircle,
  faUser,
  faGear,
  faMoon,
  faSignOutAlt,
  faInbox,
  faBan,
  faPaperPlane,
  faFileAlt,
  faBars,
  faTimes,
  faSearch,
  faBoxArchive,
  faUpload,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import logo from './images/mail.png';
import fileText from './images/File text.png';
import vector from './images/Vector.png';
import ellipse from './images/Ellipse 2.png';
import userCheck from './images/User check.png';
import t1 from './images/marketing.jfif';
import t2 from './images/meetings.jfif';
import t3 from './images/education.jfif';
import t4 from './images/welcome.jfif';
import t5 from './images/offers.jfif';
import t6 from './images/recruitment.jfif';
import t7 from './images/sales.jfif';
import t8 from './images/job.jfif';
import t9 from './images/work.jfif';
import t10 from './images/office.jfif';
import t11 from './images/party.jfif';
import t12 from './images/colleges.jfif';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const ICONS = [
  { icon: faPenToSquare, label: 'Compose', onClick: 'handleCompose' },
  { icon: faInbox, label: 'Inbox', onClick: 'handleInbox' },
  { icon: faBoxArchive, label: 'Archive', onClick: 'handleArchive' },
  { icon: faUpload, label: 'Upload', onClick: 'handleUploads' },
  { icon: faTrash, label: 'Trash', onClick: 'handleTrash' },
  { icon: faGear, label: 'Settings', onClick: 'handleSettings' },
];

const Home = ({ setIsAuth }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeNavButton, setActiveNavButton] = useState('home');
  const el = useRef(null); // element to inject typing into
  const typed = useRef(null); // store Typed instance

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuth(false);
        navigate('/login');
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

        // Check if app_password exists, if not redirect to register-ap page
        if (!data.user.app_password) {
          navigate('/register-ap');
          return;
        }

        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsAuth(false);
          navigate('/login');
        }
      }
    } catch (error) {
      // handle error
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

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

  useEffect(() => {
    // Combined string: type first line, break, type second line
    typed.current = new Typed(el.current, {
      strings: [`<span class="line"><h2>Send Bulk</h2></span><span class="line"><h1>Emails with Ease</h1></span>`],
      typeSpeed: 60,       // typing speed
      backSpeed: 0,        // no backspace
      showCursor: false,    // show cursor
      cursorChar: "|",     // custom cursor
      smartBackspace: false,
    });

    return () => {
      typed.current.destroy();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleCompose = () => { navigate('/dashboard'); };
  const handleInbox = () => { };
  const handleUploads = () => { };
  const handleArchive = () => { };
  const handleTrash = () => { };
  const handleSettings = () => { navigate('/settings'); };

  // Scroll functions
  const scrollToTemplates = () => {
    setActiveNavButton('templates');
    document.getElementById('templates-section')?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    setActiveNavButton('about');
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    setActiveNavButton('contact');
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setActiveNavButton('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Map icon click handlers
  const iconHandlers = {
    handleCompose,
    handleInbox,
    handleArchive,
    handleUploads,
    handleTrash,
    handleSettings,
  };

  // Example template data
  const templates = [
    { id: 1, title: 'Marketing', description: 'Send a welcome message to new users.', src: t1 },
    { id: 2, title: 'Meetings', description: 'Template for password reset instructions.', src: t2 },
    { id: 3, title: 'Education', description: 'Monthly newsletter template.', src: t3 },
    { id: 4, title: 'Welcome', description: 'Special promotion email template.', src: t4 },
    { id: 5, title: 'Offers', description: 'Event invitation template.', src: t5 },
    { id: 6, title: 'Recruitment', description: 'Feedback request email template.', src: t6 },
    { id: 7, title: 'Sales', description: 'Survey invitation template.', src: t7 },
    { id: 8, title: 'Job', description: 'Thank you email template.', src: t8 },
    { id: 9, title: 'Work', description: 'Holiday greeting email template.', src: t9 },
    { id: 10, title: 'Office', description: 'Weekly update email template.', src: t10 },
    { id: 11, title: 'Party', description: 'Follow-up email template.', src: t11 },
    { id: 12, title: 'Colleges', description: 'Product launch announcement template.', src: t12 },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} ${isSidebarVisible ? 'sidebar-open' : ''}`}>
      {/* Top Navigation Bar */}
      <nav className="navbar-home">
        <img src={logo} alt="CursorMail Logo" className="navbar-logo-home" />
        <h1 className="navbar-title">ElevateMail</h1>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search templates..."
              className="search-input"
            />
            <span className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
        </div>
        <button
          className="menu-btn"
          onClick={() => setIsSidebarVisible((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="navbar-buttons">
          <button
            className={`home-btn ${activeNavButton === 'home' ? 'active' : ''}`}
            onClick={handleHomeClick}
          >
            Home
          </button>
          <button
            className={`templates-btn ${activeNavButton === 'templates' ? 'active' : ''}`}
            onClick={scrollToTemplates}
          >
            Templates
          </button>
          <button
            className={`about-btn ${activeNavButton === 'about' ? 'active' : ''}`}
            onClick={scrollToAbout}
          >
            About
          </button>
          <button
            className={`contact-btn ${activeNavButton === 'contact' ? 'active' : ''}`}
            onClick={scrollToContact}
          >
            Contact Us
          </button>
          <div className="profile-container">
            <button title="Profile" onClick={() => setShowProfileMenu((prev) => !prev)} className="profile-icon-btn">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="profile-avatar" />
              ) : (
                <FontAwesomeIcon icon={faCircleUser} size="xl" />
              )}
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="profile-avatar" />
                  ) : (
                    <FontAwesomeIcon icon={faCircleUser} size="10x" />
                  )}
                  <span className="profile-name">{username || 'User'}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleEditProfile}>
                  <FontAwesomeIcon icon={faUser} color='grey'/>
                  <span>Profile</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => setDarkMode((prev) => !prev)}>
                  <FontAwesomeIcon icon={faMoon} color='grey'/>
                  <span>Dark mode</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} color='grey'/>
                  <span>Logout</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => navigate('/report')}>
                  <FontAwesomeIcon icon={faBan} color='grey'/>
                  <span>Report</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </nav>

      {/* Left Sliding Bar */}
      <div className={`left-bar${darkMode ? ' dark' : ''} ${isSidebarVisible ? 'open' : ''}`}>

        {ICONS.map(({ icon, label, onClick }) => (
          <button
            key={label}
            title={label}
            onClick={iconHandlers[onClick]}
            className="icon-btn"
          >
            <FontAwesomeIcon icon={icon} size="lg" />
            <span className="icon-label">{label}</span>
          </button>
        ))}
      </div>


      {/* Banner above templates */}
      <div className="bulk-banner">
        <div className="bulk-banner-left"><span ref={el} className="typed-wrapper"></span></div>
        <div className="bulk-banner-right">
          <img src={ellipse} alt="Ellipse" className="ellipse" />
          <img src={fileText} alt="File Text" className="file-text" />
          <img src={vector} alt="Vector" className="vector" />
          <img src={userCheck} alt="User Check" className="user-check" />
          <FontAwesomeIcon icon={faCircle} beatFade style={{ color: "#a8d5f2", }} />
          <FontAwesomeIcon icon={faCircle} beatFade style={{ color: "#a8d5f2", }} />
          <FontAwesomeIcon icon={faCircle} beatFade style={{ color: "#a8d5f2", }} />
          <FontAwesomeIcon icon={faCircle} beatFade style={{ color: "#a8d5f2", }} />
          <FontAwesomeIcon icon={faCircle} beatFade style={{ color: "#a8d5f2", }} />
          <FontAwesomeIcon icon={faCircle} beatFade style={{ color: "#a8d5f2", }} />
        </div>
      </div>

      {/* Template Boxes */}
      <div id="templates-section" className="templates-container">
        {templates.map((template) => (
          <div className="template-group" key={template.id}>
            <div className="template-box">
              <img src={template.src} alt={template.title} className="template-image" />
            </div>
            <div className="template-title">{template.title}</div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div id="about-section" className="about-section">
        <div className="about-content">
          <h2>About ElevateMail</h2>
          <p>
            ElevateMail is a powerful bulk email marketing platform designed to help businesses
            and individuals send personalized emails to large audiences efficiently. Our platform
            combines ease of use with powerful features to streamline your email marketing campaigns.
          </p>
          <div className="about-features">
            <div className="feature">
              <h3>Bulk Email Sending</h3>
              <p>Send personalized emails to thousands of recipients with just a few clicks.</p>
            </div>
            <div className="feature">
              <h3>Template Library</h3>
              <p>Choose from our extensive collection of professionally designed email templates.</p>
            </div>
            <div className="feature">
              <h3>Easy Integration</h3>
              <p>Seamlessly integrate with your existing workflow and email systems.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section - Footer */}
      <footer id="contact-section" className="contact-section">
        <div className="contact-content">
          <div className="contact-info">
            <h3>Contact Us</h3>
            <p>Get in touch with our team for support, questions, or feedback.</p>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Email:</strong> vinayak.jadhav_comp23@pccoer.in
              </div>
              <div className="contact-item">
                <strong>Phone:</strong> +91 7498564907
              </div>
              <div className="contact-item">
                <strong>Address:</strong> Pimpri Chinchwad College of Engineering and Research, Ravet, Pune
              </div>
              <div className="contact-item">
                <strong>Pincode:</strong> 412101
              </div>
            </div>
          </div>
          <div className="contact-form">
            <h4>Send us a Message</h4>
            <form>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" rows="4" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ElevateMail. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
