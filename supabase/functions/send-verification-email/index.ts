import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface VerificationRequest {
  email: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: VerificationRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Calculate expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Save to database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: dbError } = await supabase
      .from("email_verifications")
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt.toISOString(),
        verified: false,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save verification code" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send email via Resend
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - AVERRA</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lora:wght@300;400;500&family=Montserrat:wght@400;500;600;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      font-family: 'Lora', serif;
      background: linear-gradient(135deg, #fdf5f7 0%, #fbf0f3 50%, #f8e8ed 100%);
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .email-card {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(37, 18, 24, 0.08);
    }

    .header {
      background: linear-gradient(135deg, #c9969e 0%, #251218 100%);
      padding: 48px 40px;
      text-align: center;
    }

    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 400;
      color: #fdf5f7;
      letter-spacing: 0.02em;
      margin: 0;
    }

    .content {
      padding: 48px 40px;
    }

    .title {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 400;
      color: #251218;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .message {
      font-family: 'Lora', serif;
      font-size: 16px;
      font-weight: 300;
      color: #251218;
      opacity: 0.7;
      line-height: 1.8;
      margin: 0 0 32px 0;
    }

    .code-container {
      background: linear-gradient(135deg, #fdf5f7 0%, #fbf0f3 100%);
      border: 2px solid rgba(201, 150, 158, 0.2);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      margin: 32px 0;
    }

    .code-label {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #c9969e;
      margin: 0 0 16px 0;
    }

    .code {
      font-family: 'Montserrat', sans-serif;
      font-size: 48px;
      font-weight: 700;
      color: #251218;
      letter-spacing: 0.1em;
      margin: 0;
    }

    .expiry {
      font-family: 'Lora', serif;
      font-size: 13px;
      font-weight: 300;
      color: #251218;
      opacity: 0.5;
      margin: 16px 0 0 0;
    }

    .divider {
      height: 1px;
      background: rgba(37, 18, 24, 0.1);
      margin: 32px 0;
    }

    .footer-message {
      font-family: 'Lora', serif;
      font-size: 14px;
      font-weight: 300;
      color: #251218;
      opacity: 0.6;
      line-height: 1.7;
      margin: 0 0 24px 0;
    }

    .support-link {
      font-family: 'Lora', serif;
      font-size: 14px;
      font-weight: 400;
      color: #c9969e;
      text-decoration: none;
    }

    .footer {
      text-align: center;
      padding: 32px 40px;
      background: #fdf5f7;
    }

    .footer-text {
      font-family: 'Lora', serif;
      font-size: 12px;
      font-weight: 300;
      color: #251218;
      opacity: 0.5;
      margin: 0;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-card">
      <div class="header">
        <h1 class="logo">AVERRA</h1>
      </div>

      <div class="content">
        <h2 class="title">Verify Your Email</h2>
        <p class="message">
          Welcome to AVERRA. To complete your registration and access your membership, please enter the verification code below.
        </p>

        <div class="code-container">
          <p class="code-label">Your Verification Code</p>
          <p class="code">${code}</p>
          <p class="expiry">Expires in 15 minutes</p>
        </div>

        <div class="divider"></div>

        <p class="footer-message">
          If you didn't request this verification code, you can safely ignore this email. Your account will not be created without verification.
        </p>

        <p class="footer-message">
          Need help? Contact us at <a href="mailto:info@averraistudio.com" class="support-link">info@averraistudio.com</a>
        </p>
      </div>

      <div class="footer">
        <p class="footer-text">
          © ${new Date().getFullYear()} AVERRA. Building beyond the chair.<br>
          You received this email because you signed up for AVERRA.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AVERRA <noreply@averraistudio.com>",
        to: [email],
        subject: `Your AVERRA Verification Code: ${code}`,
        html: emailHTML,
      }),
    });

    if (!emailRes.ok) {
      const emailError = await emailRes.text();
      console.error("Resend API error:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send verification email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent successfully",
        expiresAt: expiresAt.toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
