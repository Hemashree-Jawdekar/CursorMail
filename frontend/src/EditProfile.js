import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const EditProfile = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAppPassword, setShowAppPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [currentUser, setCurrentUser] = useState({
    username: '',
    senderEmail: '',
    appPassword: '',
    profilePhotoUrl: null
  });

  const [form, setForm] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    senderEmail: '',
    appPassword: '',
    profilePhoto: null,
    profilePhotoPreview: null,
  });

  // Fetch current user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        console.log('Fetching user data with token:', token);
        const response = await fetch('http://localhost:5000/api/profile/data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
          const data = await response.json();
          console.log('Received user data:', data);
          
          const profilePhotoUrl = data.user.profile_photo_url ? 
            `http://localhost:5000${data.user.profile_photo_url}` : null;
          
          setCurrentUser({
            username: data.user.username || '',
            senderEmail: data.user.sender_email || '',
            appPassword: data.user.app_password || '',
            profilePhotoUrl: profilePhotoUrl
          });
          
          setForm({
            ...form,
            username: data.user.username || '',
            senderEmail: data.user.sender_email || '',
            appPassword: data.user.app_password || '',
            profilePhotoPreview: profilePhotoUrl
          });
        } else if (response.status === 401) {
          console.log('Authentication failed - redirecting to login');
          localStorage.removeItem('token');
          setIsAuth(false);
          navigate('/');
        } else {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          setMessage({ type: 'error', text: errorData.message || 'Failed to load user data' });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ type: 'error', text: 'Error loading user data' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      setForm({
        ...form,
        profilePhoto: files[0],
        profilePhotoPreview: URL.createObjectURL(files[0]),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // Update profile information
      if (form.username || form.senderEmail || form.appPassword) {
        const profileResponse = await fetch('http://localhost:5000/api/profile/edit-profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: form.username,
            sender_email: form.senderEmail,
            app_password: form.appPassword
          })
        });

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.message || 'Failed to update profile');
        }
      }

      // Change password if provided
      if (form.currentPassword && form.newPassword) {
        if (form.newPassword !== form.confirmPassword) {
          throw new Error('New passwords do not match');
        }

        const passwordResponse = await fetch('http://localhost:5000/api/profile/change-password', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword
          })
        });

        if (!passwordResponse.ok) {
          const errorData = await passwordResponse.json();
          throw new Error(errorData.message || 'Failed to change password');
        }
      }

      // Upload profile photo if provided
      if (form.profilePhoto) {
        const formData = new FormData();
        formData.append('profilePhoto', form.profilePhoto);

        const photoResponse = await fetch('http://localhost:5000/api/profile/upload-photo', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!photoResponse.ok) {
          const errorData = await photoResponse.json();
          throw new Error(errorData.message || 'Failed to upload profile photo');
        }
      }

             setMessage({ type: 'success', text: 'Profile updated successfully!' });
       
       // Update current user data
       setCurrentUser({
         username: form.username,
         senderEmail: form.senderEmail,
         appPassword: form.appPassword,
         profilePhotoUrl: form.profilePhotoPreview
       });
       
       // Clear password fields and exit edit mode
       setForm({
         ...form,
         currentPassword: '',
         newPassword: '',
         confirmPassword: '',
         profilePhoto: null
       });
       
       setIsEditing(false);

    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Error updating profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      ...form,
      username: currentUser.username,
      senderEmail: currentUser.senderEmail,
      appPassword: currentUser.appPassword,
      profilePhotoPreview: currentUser.profilePhotoUrl,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      profilePhoto: null
    });
    setMessage({ type: '', text: '' });
  };

  if (isLoading) {
    return (
      <div className="edit-profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <h2>Profile Information</h2>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {!isEditing ? (
          // View Mode
          <div className="profile-view">
            <div className="profile-photo-section">
              <div className="current-photo">
                {currentUser.profilePhotoUrl ? (
                  <img 
                    src={currentUser.profilePhotoUrl} 
                    alt="Profile" 
                    className="profile-preview"
                  />
                ) : (
                  <FontAwesomeIcon 
                    icon={faCircleUser} 
                    className="profile-placeholder"
                  />
                )}
              </div>
              <div className="photo-info">
                <h3>Profile Photo</h3>
                <p>Click edit to change your profile photo</p>
              </div>
            </div>

            <div className="info-section">
              <div className="info-item">
                <label>Username</label>
                <div className="info-value">{currentUser.username}</div>
              </div>

              <div className="info-item">
                <label>Sender Email</label>
                <div className="info-value">{currentUser.senderEmail}</div>
              </div>

              <div className="info-item">
                <label>App Password</label>
                <div className="info-value">
                  <span className="password-dots">••••••••••••••••</span>
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowAppPassword(!showAppPassword)}
                  >
                    <FontAwesomeIcon icon={showAppPassword ? faEyeSlash : faEye} />
                  </button>
                  {showAppPassword && (
                    <span className="password-text">{currentUser.appPassword}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="view-actions">
              <button className="edit-button" onClick={handleEdit}>
                Edit Profile
              </button>
              <button className="back-button" onClick={handleBack}>
                ← Back to Home
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Profile Photo Section */}
          <div className="form-section">
            <label>Profile Photo</label>
            <div className="profile-photo-section">
              <div className="current-photo">
                {form.profilePhotoPreview ? (
                  <img 
                    src={form.profilePhotoPreview} 
                    alt="Profile" 
                    className="profile-preview"
                  />
                ) : (
                  <FontAwesomeIcon 
                    icon={faCircleUser} 
                    className="profile-placeholder"
                  />
                )}
              </div>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleChange}
                className="file-input"
              />
            </div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sender Email */}
          <div className="form-group">
            <label>Sender Email</label>
            <input
              type="email"
              name="senderEmail"
              value={form.senderEmail}
              onChange={handleChange}
              required
            />
          </div>

          {/* App Password */}
          <div className="form-group">
            <label>App Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="appPassword"
                value={form.appPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="form-section">
            <h3>Change Password (Optional)</h3>
            
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="password-input">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;