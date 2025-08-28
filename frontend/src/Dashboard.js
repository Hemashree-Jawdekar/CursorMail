import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import './App.css';

export default function Dashboard({ setIsAuth }) {
  const [emailId, setEmailId] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [csv, setCsv] = useState(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [cc, setCc] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [msg, setMsg] = useState('');
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleCreds = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBulkMail = async (e) => {
    e.preventDefault();
    if (!csv) return setMsg('Please upload a CSV file.');
    const formData = new FormData();
    formData.append('csv', csv);
    formData.append('subject', subject);
    formData.append('body', body);
    formData.append('email_id', emailId);
    formData.append('app_password', appPassword);
    if (cc) formData.append('cc', cc);
    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }
    try {
      const res = await axios.post('http://localhost:5000/send-bulk-emails', formData);
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
    <div>
      <h2>Dashboard</h2>
      {step === 1 ? (
        <form className="creds-form" onSubmit={handleCreds}>
          <h3>Enter Email Credentials for Sending</h3>
          <input placeholder="Gmail Email ID" type="email" value={emailId} onChange={e => setEmailId(e.target.value)} required />
          <input placeholder="App Password" type="password" value={appPassword} onChange={e => setAppPassword(e.target.value)} required />
          <button type="submit">Continue</button>
        </form>
      ) : (
        <form className="bulkmail-form" onSubmit={handleBulkMail}>
          <h3>Send Bulk Emails</h3>
          
          <input type="file" accept=".csv" onChange={e => setCsv(e.target.files[0])} required />
          <input placeholder="CC (comma separated emails)" value={cc} onChange={e => setCc(e.target.value)} />
          <input type="file" multiple onChange={e => setAttachments(Array.from(e.target.files))} />
          <input placeholder="Subject (use {{name}} for personalization)" value={subject} onChange={e => setSubject(e.target.value)} required />
          <textarea placeholder="Body (use {{name}} for personalization)" value={body} onChange={e => setBody(e.target.value)} required />
          <button type="button" onClick={handlePreview} style={{marginBottom: '0.5rem'}}>Preview Email</button>
          <button type="submit">Send Emails</button>
        </form>
      )}
      {preview && (
        <div className="email-preview" style={{background:'#fffbe6',border:'1px solid #ffe082',borderRadius:8,padding:'1rem',marginTop:'1rem',textAlign:'left'}}>
          <h4>Email Preview (for: {preview.name} &lt;{preview.email}&gt;)</h4>
          <strong>Subject:</strong> {preview.subject}<br/>
          <strong>Body:</strong>
          <pre style={{whiteSpace:'pre-wrap',margin:0}}>{preview.body}</pre>
        </div>
      )}
      {msg && <div style={{ color: msg.includes('success') ? 'green' : 'red', fontWeight: 500, marginTop: 10 }}>{msg}</div>}
    </div>
  );
}
