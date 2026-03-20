import { useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';

export default function WebhookTestPage() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  const webhookUrl = `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/webhooks/stripe`;

  const checkConfig = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-61755bec/check-config`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Config check failed:', error);
    }
  };

  useState(() => {
    checkConfig();
  });

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #DCDACC 0%, #F5F3E8 100%)',
      padding: '60px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(48, 23, 16, 0.2)',
          padding: '40px',
          marginBottom: '30px'
        }}>
          <h1 style={{ 
            fontFamily: 'Cormorant, Georgia, serif',
            fontSize: '42px',
            color: '#301710',
            marginBottom: '10px',
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}>
            Stripe Webhook Diagnostics
          </h1>
          <p style={{ color: 'rgba(48, 23, 16, 0.7)' }}>
            Use this page to verify your Stripe webhook configuration
          </p>
        </div>

        {/* Webhook URL */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(48, 23, 16, 0.2)',
          padding: '30px',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '18px',
            color: '#301710',
            marginBottom: '15px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Your Webhook Endpoint URL
          </h2>
          
          <div style={{
            background: '#301710',
            color: '#DCDACC',
            padding: '15px 20px',
            fontFamily: 'monospace',
            fontSize: '13px',
            borderRadius: '4px',
            wordBreak: 'break-all',
            marginBottom: '15px'
          }}>
            {webhookUrl}
          </div>

          <div style={{ 
            background: 'rgba(101, 67, 49, 0.1)',
            border: '1px solid rgba(101, 67, 49, 0.3)',
            padding: '20px',
            borderRadius: '4px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: '#301710' }}>
              📋 How to Configure in Stripe:
            </h3>
            <ol style={{ 
              marginLeft: '20px',
              color: 'rgba(48, 23, 16, 0.8)',
              lineHeight: '1.8'
            }}>
              <li>Go to <a href="https://dashboard.stripe.com/test/webhooks" target="_blank" rel="noopener noreferrer" style={{ color: '#654331', textDecoration: 'underline' }}>Stripe Dashboard → Webhooks</a></li>
              <li>Click "Add endpoint" or edit existing endpoint</li>
              <li>Paste the URL above into "Endpoint URL"</li>
              <li>Select events: <code style={{ background: 'rgba(48, 23, 16, 0.1)', padding: '2px 6px' }}>checkout.session.completed</code> and <code style={{ background: 'rgba(48, 23, 16, 0.1)', padding: '2px 6px' }}>payment_intent.succeeded</code></li>
              <li>Click "Add endpoint"</li>
              <li>Copy the "Signing secret" (starts with whsec_) to your Supabase env vars as <code style={{ background: 'rgba(48, 23, 16, 0.1)', padding: '2px 6px' }}>STRIPE_WEBHOOK_SECRET</code></li>
            </ol>
          </div>
        </div>

        {/* Configuration Status */}
        {config && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(48, 23, 16, 0.2)',
            padding: '30px',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              fontSize: '18px',
              color: '#301710',
              marginBottom: '15px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Configuration Status
            </h2>

            <div style={{ display: 'grid', gap: '15px' }}>
              {/* Stripe Keys */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                background: 'rgba(48, 23, 16, 0.05)',
                borderRadius: '4px'
              }}>
                {config.stripe?.secretKey ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, color: '#301710' }}>Stripe Secret Key</div>
                  <div style={{ fontSize: '13px', color: 'rgba(48, 23, 16, 0.7)' }}>
                    {config.stripe?.secretKey ? 'Configured ✓' : 'Missing ✗'}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                background: 'rgba(48, 23, 16, 0.05)',
                borderRadius: '4px'
              }}>
                {config.stripe?.webhookSecret ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, color: '#301710' }}>Stripe Webhook Secret</div>
                  <div style={{ fontSize: '13px', color: 'rgba(48, 23, 16, 0.7)' }}>
                    {config.stripe?.webhookSecret ? 'Configured ✓' : 'Missing ✗ - This is required for webhooks!'}
                  </div>
                </div>
              </div>

              {/* Resend */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                background: 'rgba(48, 23, 16, 0.05)',
                borderRadius: '4px'
              }}>
                {config.resend?.configured ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, color: '#301710' }}>Resend API Key</div>
                  <div style={{ fontSize: '13px', color: 'rgba(48, 23, 16, 0.7)' }}>
                    {config.resend?.configured ? 'Configured ✓' : 'Missing ✗'}
                  </div>
                </div>
              </div>
            </div>

            {!config.stripe?.webhookSecret && (
              <div style={{
                marginTop: '20px',
                padding: '20px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid #ef4444',
                borderRadius: '4px'
              }}>
                <div style={{ fontWeight: 600, color: '#dc2626', marginBottom: '10px' }}>
                  ⚠️ Webhook Secret Missing!
                </div>
                <div style={{ color: '#991b1b', lineHeight: '1.6' }}>
                  Your webhook secret is not configured. Emails will NOT be sent automatically after purchases. Follow the steps above to configure it in Stripe, then add the signing secret to your Supabase environment variables.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Test Instructions */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(48, 23, 16, 0.2)',
          padding: '30px'
        }}>
          <h2 style={{ 
            fontSize: '18px',
            color: '#301710',
            marginBottom: '15px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            How to Test
          </h2>

          <div style={{ 
            color: 'rgba(48, 23, 16, 0.8)',
            lineHeight: '1.8',
            marginBottom: '20px'
          }}>
            <strong>Option 1: Send Test Webhook from Stripe (Recommended)</strong>
            <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Go to <a href="https://dashboard.stripe.com/test/webhooks" target="_blank" rel="noopener noreferrer" style={{ color: '#654331', textDecoration: 'underline' }}>Stripe Webhooks</a></li>
              <li>Click on your webhook endpoint</li>
              <li>Click "Send test webhook"</li>
              <li>Select "checkout.session.completed"</li>
              <li>Click "Send test webhook"</li>
              <li>Check Supabase logs - you should see "🔔 WEBHOOK RECEIVED FROM STRIPE!"</li>
            </ol>
          </div>

          <div style={{ 
            color: 'rgba(48, 23, 16, 0.8)',
            lineHeight: '1.8'
          }}>
            <strong>Option 2: Make a Real Test Purchase</strong>
            <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Use test card: <code style={{ background: 'rgba(48, 23, 16, 0.1)', padding: '2px 6px' }}>4242 4242 4242 4242</code></li>
              <li>Any future expiry date, any CVC, any ZIP</li>
              <li>Complete checkout</li>
              <li>Check your email within 30 seconds</li>
              <li>Check Supabase Function Logs for webhook activity</li>
            </ol>
          </div>

          <div style={{
            marginTop: '25px',
            padding: '20px',
            background: 'rgba(220, 218, 204, 0.5)',
            borderLeft: '3px solid #654331'
          }}>
            <strong style={{ color: '#301710' }}>💡 Pro Tip:</strong>
            <p style={{ margin: '8px 0 0 0', color: 'rgba(48, 23, 16, 0.8)' }}>
              Keep Supabase Function Logs open while testing. You'll see real-time logs showing exactly when webhooks arrive and when emails are sent. This helps you verify the system is working instantly!
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
          <a 
            href="https://dashboard.stripe.com/test/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 20px',
              background: '#301710',
              color: '#DCDACC',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#654331'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#301710'}
          >
            <ExternalLink className="w-4 h-4" />
            OPEN STRIPE WEBHOOKS
          </a>

          <a 
            href={`https://supabase.com/dashboard/project/${projectId}/functions/server/logs`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 20px',
              background: '#654331',
              color: '#DCDACC',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#301710'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#654331'}
          >
            <ExternalLink className="w-4 h-4" />
            OPEN SUPABASE LOGS
          </a>
        </div>
      </div>
    </div>
  );
}
