// This endpoint is imported and used in the main server
export async function handleSendPurchaseEmail(c: any) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      return c.json({ 
        error: "RESEND_API_KEY not configured in Supabase secrets" 
      }, 500);
    }

    const { to, customerName, items, total, calendlyLink } = await c.req.json();

    console.log("📧 Testing purchase email...");
    console.log("To:", to);
    console.log("Items:", items);

    // Check if this is a service tier or digital product
    const hasServiceTier = items.some((item: any) => item.type === 'service');
    const hasDigitalProduct = items.some((item: any) => item.type === 'digital');

    let emailHtml = '';
    let subject = '';

    if (hasServiceTier) {
      // Service Tier Email
      subject = "Welcome to AVERRA - Your Branding Journey Begins";
      
      // Determine timeline based on tier
      const tier = items.find((item: any) => item.type === 'service')?.name || '';
      let timeline = '7-10 business days';
      if (tier.includes('Signature')) {
        timeline = '10-12 business days';
      } else if (tier.includes('Muse')) {
        timeline = '12-14 business days';
      }
      
      const itemsList = items.map((item: any) => 
        `<li style="margin-bottom: 10px; color: #301710;">${item.name} - $${item.price}</li>`
      ).join('');

      emailHtml = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F7F3EF; padding: 40px 20px;">
          <div style="background: white; padding: 40px; border: 1px solid rgba(48, 23, 16, 0.1);">
            <h1 style="color: #301710; font-size: 42px; font-weight: 300; font-style: italic; margin: 0 0 10px 0; text-align: center;">
              Welcome to AVERRA
            </h1>
            <p style="text-align: center; color: #654331; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 30px 0;">
              Your Journey Begins Here
            </p>
            
            <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(183, 110, 121, 0.4), transparent); margin: 30px 0;"></div>
            
            <p style="color: #301710; font-size: 18px; line-height: 1.8; margin-bottom: 20px;">
              Dear ${customerName},
            </p>
            
            <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
              Thank you for choosing AVERRA. We're thrilled to partner with you in elevating your brand presence to reflect the caliber of work you create.
            </p>
            
            <div style="background: rgba(48, 23, 16, 0.05); padding: 25px; margin: 30px 0; border-left: 3px solid #b76e79;">
              <h2 style="color: #301710; font-size: 20px; margin: 0 0 15px 0; font-weight: 400;">
                Your Order Summary
              </h2>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${itemsList}
              </ul>
              <p style="color: #301710; font-size: 20px; font-weight: 600; margin: 20px 0 0 0; padding-top: 15px; border-top: 1px solid rgba(48, 23, 16, 0.2);">
                Total: $${total}
              </p>
            </div>
            
            <div style="background: #301710; padding: 30px; margin: 30px 0; text-align: center;">
              <h2 style="color: #DCDACC; font-size: 22px; margin: 0 0 15px 0; font-weight: 400;">
                📅 Next Step: Schedule Your Strategy Session
              </h2>
              <p style="color: #BFBBA7; line-height: 1.8; margin-bottom: 20px;">
                Before we begin creating your custom brand visuals, we'll align on your vision, aesthetic direction, and brand goals.
              </p>
              <a href="${calendlyLink}" style="display: inline-block; background: #DCDACC; color: #301710; padding: 15px 40px; text-decoration: none; font-weight: 600; letter-spacing: 0.2em; font-size: 12px; text-transform: uppercase; margin-top: 10px;">
                Book Your Session →
              </a>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #301710; font-size: 18px; margin: 0 0 15px 0; font-weight: 500;">
                What Happens Next:
              </h3>
              <div style="margin-bottom: 15px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #b76e79; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; font-weight: 600;">1</span>
                <span style="color: #301710; font-weight: 600;">Click the link above</span> to schedule your strategy session at a time that works for you.
              </div>
              <div style="margin-bottom: 15px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #b76e79; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; font-weight: 600;">2</span>
                We'll discuss your brand vision, target audience, and aesthetic preferences.
              </div>
              <div style="margin-bottom: 15px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #b76e79; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; font-weight: 600;">3</span>
                Within ${timeline}, you'll receive your custom AI brand models and visual assets.
              </div>
              <div>
                <span style="display: inline-block; width: 24px; height: 24px; background: #b76e79; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; font-weight: 600;">4</span>
                Begin creating stunning, on-brand content that elevates your professional presence.
              </div>
            </div>
            
            <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(183, 110, 121, 0.4), transparent); margin: 30px 0;"></div>
            
            <p style="color: #301710; line-height: 1.8; font-style: italic; text-align: center; font-size: 18px; margin: 30px 0;">
              "Your brand should feel like the work you create—intentional, refined, unmistakably yours."
            </p>
            
            <p style="text-align: center; color: #654331; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 20px 0 0 0; opacity: 0.7;">
              — The AVERRA Philosophy
            </p>
          </div>
        </div>
      `;
    } else if (hasDigitalProduct) {
      // Digital Product Email
      subject = "Your AVERRA Digital Products Are Ready";
      const itemsList = items.map((item: any) => 
        `<li style="margin-bottom: 10px; color: #301710;">${item.name} - $${item.price}</li>`
      ).join('');

      emailHtml = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F7F3EF; padding: 40px 20px;">
          <div style="background: white; padding: 40px; border: 1px solid rgba(48, 23, 16, 0.1);">
            <h1 style="color: #301710; font-size: 42px; font-weight: 300; font-style: italic; margin: 0 0 10px 0; text-align: center;">
              Your Assets Are Ready
            </h1>
            <p style="text-align: center; color: #654331; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 30px 0;">
              Download & Create
            </p>
            
            <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(183, 110, 121, 0.4), transparent); margin: 30px 0;"></div>
            
            <p style="color: #301710; font-size: 18px; line-height: 1.8; margin-bottom: 20px;">
              Dear ${customerName},
            </p>
            
            <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
              Thank you for your purchase! Your digital brand visuals are ready for immediate download and use.
            </p>
            
            <div style="background: rgba(48, 23, 16, 0.05); padding: 25px; margin: 30px 0; border-left: 3px solid #b76e79;">
              <h2 style="color: #301710; font-size: 20px; margin: 0 0 15px 0; font-weight: 400;">
                Your Order
              </h2>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${itemsList}
              </ul>
              <p style="color: #301710; font-size: 20px; font-weight: 600; margin: 20px 0 0 0; padding-top: 15px; border-top: 1px solid rgba(48, 23, 16, 0.2);">
                Total: $${total}
              </p>
            </div>
            
            <div style="background: #301710; padding: 30px; margin: 30px 0; text-align: center;">
              <h2 style="color: #DCDACC; font-size: 22px; margin: 0 0 15px 0; font-weight: 400;">
                📥 Download Your Files
              </h2>
              <p style="color: #BFBBA7; line-height: 1.8; margin-bottom: 20px;">
                Click below to access your high-resolution editorial images (3 files included).
              </p>
              <a href="#" style="display: inline-block; background: #DCDACC; color: #301710; padding: 15px 40px; text-decoration: none; font-weight: 600; letter-spacing: 0.2em; font-size: 12px; text-transform: uppercase; margin-top: 10px;">
                Download Files →
              </a>
              <p style="color: #BFBBA7; font-size: 11px; margin-top: 15px; opacity: 0.7;">
                (Test mode - In production, these would be real download links)
              </p>
            </div>
            
            <div style="background: rgba(183, 110, 121, 0.1); padding: 25px; margin: 30px 0;">
              <h3 style="color: #301710; font-size: 18px; margin: 0 0 15px 0; font-weight: 500;">
                ✓ Commercial License Included
              </h3>
              <p style="color: #654331; line-height: 1.8; margin: 0;">
                All images come with a full commercial license. Use them freely in your marketing, website, social media, client presentations, and any professional materials.
              </p>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #301710; font-size: 18px; margin: 0 0 15px 0; font-weight: 500;">
                File Details:
              </h3>
              <ul style="color: #654331; line-height: 2; margin: 0; padding-left: 20px;">
                <li>Format: High-resolution JPG & PNG</li>
                <li>Resolution: Optimized for web & print</li>
                <li>Files: 3 unique images</li>
                <li>License: Full commercial use</li>
              </ul>
            </div>
            
            <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(183, 110, 121, 0.4), transparent); margin: 30px 0;"></div>
            
            <p style="color: #301710; line-height: 1.8; text-align: center; margin: 20px 0;">
              Questions? Reply to this email—we're here to help.
            </p>
          </div>
        </div>
      `;
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AVERRA AI Model Studio <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: emailHtml,
      }),
    });

    const responseData = await emailResponse.json();
    
    console.log("📥 Response status:", emailResponse.status);
    console.log("📥 Response data:", JSON.stringify(responseData));

    if (emailResponse.ok) {
      console.log("✅ Purchase email sent successfully!");
      return c.json({ 
        success: true, 
        message: "Purchase email sent! Check your inbox.",
        emailId: responseData.id,
        details: responseData
      });
    } else {
      console.error("❌ Resend API error:", responseData);
      
      let suggestion = "";
      if (emailResponse.status === 403) {
        suggestion = "API key is invalid. Check your Resend dashboard.";
      } else if (emailResponse.status === 422) {
        suggestion = "Email validation failed. Check the 'to' address.";
      }
      
      return c.json({ 
        error: "Resend API call failed", 
        details: responseData,
        statusCode: emailResponse.status,
        suggestion: suggestion || "Check Resend API documentation."
      }, 400);
    }
  } catch (error) {
    console.error("❌ Purchase email error:", error);
    return c.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      type: error instanceof Error ? error.name : typeof error
    }, 500);
  }
}