import { useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function TestEmail() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [email, setEmail] = useState('');

  const testEmail = async () => {
    if (!email) {
      setResult('❌ Please enter your email address');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/test-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ 
            to: email 
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ ${data.message}\n\nEmail ID: ${data.emailId}\n\nCheck your inbox at: ${email}`);
      } else {
        setResult(`❌ Error: ${data.error}\n\nDetails: ${JSON.stringify(data.details, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '30px', 
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#301710', marginBottom: '20px' }}>🧪 Test Resend Email</h1>
      
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This will send a test email to verify your RESEND_API_KEY is configured correctly.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#301710', fontWeight: 600 }}>
          Your Email Address:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <button
        onClick={testEmail}
        disabled={loading}
        style={{
          background: loading ? '#999' : '#301710',
          color: '#fff',
          padding: '12px 30px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: result.includes('✅') ? '#e7f5e7' : '#fdecea',
          border: `1px solid ${result.includes('✅') ? '#4caf50' : '#f44336'}`,
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          {result}
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        fontSize: '13px',
        color: '#666'
      }}>
        <strong>What happens:</strong>
        <ol style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Clicks "Send Test Email"</li>
          <li>Backend reads RESEND_API_KEY from Supabase secrets</li>
          <li>Calls Resend API to send email</li>
          <li>Email appears in Resend dashboard</li>
          <li>You receive the email</li>
        </ol>
      </div>
    </div>
  );
}
