import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import './Dashboard.css';

export default function Dashboard({ setIsAuth }) {
  const [csv, setCsv] = useState(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [cc, setCc] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleBulkMail = async (e) => {
    e.preventDefault();
    if (!csv) return setMsg('Please upload a CSV file.');
    
    const token = localStorage.getItem('token');
    if (!token) {
      setMsg('Please log in to send emails');
      return;
    }

    const formData = new FormData();
    formData.append('csv', csv);
    formData.append('subject', subject);
    formData.append('body', body);
    if (cc) formData.append('cc', cc);
    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }
    
    try {
      const res = await axios.post('http://localhost:5000/send-bulk-emails', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error sending emails');
    }
  };

  // Helper to render template
  function renderTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
  }

  // Preview handler
  const handlePreview = () => {
    if (!csv) {
      setMsg('Please upload a CSV file for preview.');
      return;
    }
    Papa.parse(csv, {
      header: true,
      complete: (results) => {
        const first = results.data[0];
        if (!first || !first.Name || !first.Email) {
          setMsg('CSV must have Name and Email columns.');
          return;
        }
        setPreview({
          subject: renderTemplate(subject, first),
          body: renderTemplate(body, first),
          name: first.Name,
          email: first.Email
        });
      },
      error: () => setMsg('Error parsing CSV for preview.')
    });
  };

  return (
    <div className="dashboard-container">
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <div className="header-left">
              <div className="header-icon">📤</div>
              <h2>Send Bulk Emails</h2>
            </div>
            <div className="header-right">
              <button className="header-btn close-btn" onClick={() => navigate('/home')}>✕</button>
            </div>
          </div>
          
          <div className="modal-body">
            <form className="bulkmail-form" onSubmit={handleBulkMail}>
              <div className="form-group">
                <label>Recipients CSV file (Email is Required)</label>
                <div className="file-upload-area">
                  <div className="file-upload-icon">📄</div>
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={e => setCsv(e.target.files[0])} 
                    required 
                    className="file-input"
                  />
                  <span className="file-upload-text">Choose CSV file with Name, Email etc. Columns</span>
                </div>
              </div>

              <div className="form-group">
                <label>Cc (Optional)</label>
                <input 
                  type="text"
                  placeholder="Comma separated emails" 
                  value={cc} 
                  onChange={e => setCc(e.target.value)} 
                  className="text-input"
                />
              </div>

              <div className="form-group">
                <label>Attachments (Optional)</label>
                <div className="file-upload-area">
                  <div className="file-upload-icon">📎</div>
                  <input 
                    type="file" 
                    multiple 
                    onChange={e => setAttachments(Array.from(e.target.files))} 
                    className="file-input"
                  />
                  <span className="file-upload-text">Choose attachment files</span>
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text"
                  placeholder="Eg. Welcome {{name}}!" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  required 
                  className="text-input"
                />
              </div>

              <div className="form-group">
                <label>Body</label>
                <textarea 
                  placeholder="Eg. Hii {{name}}!, \n\n Welcome to our service \n\n Best Regards!, \n Team" 
                  value={body} 
                  onChange={e => setBody(e.target.value)} 
                  required 
                  className="textarea-input"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handlePreview} className="preview-btn">Preview Email</button>
                <button type="submit" className="send-btn">Send Emails</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {preview && (
        <div className="email-preview">
          <h4>Email Preview (for: {preview.name} &lt;{preview.email}&gt;)</h4>
          <strong>Subject:</strong> {preview.subject}<br/>
          <strong>Body:</strong>
          <pre>{preview.body}</pre>
        </div>
      )}
      
      {msg && (
        <div className={`message ${msg.includes('success') ? 'success' : 'error'}`}>
          {msg}
        </div>
      )}
    </div>
  );
}
