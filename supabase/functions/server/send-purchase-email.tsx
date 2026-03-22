// This endpoint is imported and used in the main server
import { createClient } from "jsr:@supabase/supabase-js@2";

export async function handleSendPurchaseEmail(c: any) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendTemplateId = Deno.env.get("RESEND_TEMPLATE_ID");
    const emailFrom = Deno.env.get("EMAIL_FROM") || "AVERRA Deliveries <deliveries@averraaistudio.com>";
    const publicSiteUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://www.averraaistudio.com";
    
    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY not configured");
      return c.json({ 
        error: "RESEND_API_KEY not configured in Supabase secrets" 
      }, 500);
    }

    if (!resendTemplateId) {
      console.error("❌ RESEND_TEMPLATE_ID not configured");
      return c.json({ 
        error: "RESEND_TEMPLATE_ID not configured in Supabase secrets" 
      }, 500);
    }

    // Initialize Supabase client for Storage access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await c.req.json();
    console.log("📧 Received request body:", JSON.stringify(body, null, 2));

    const { sessionId, customerEmail, customerName, items, amountTotal, metadata } = body;
    
    if (!customerEmail) {
      console.error("❌ No customer email provided");
      return c.json({ error: "Customer email is required" }, 400);
    }

    // Determine what type of purchase this is
    const hasServiceTier = metadata?.hasServiceTier === 'true';
    const hasDigitalProduct = metadata?.hasDigitalProduct === 'true';
    
    console.log("📊 Purchase type:", { hasServiceTier, hasDigitalProduct });
    console.log("📧 Sending email to:", customerEmail);
    console.log("💰 Amount total:", amountTotal);

    // Format the total correctly (convert from cents to dollars)
    const total = (amountTotal || 0) / 100;

    let emailHtml = '';
    let subject = '';

    if (hasServiceTier) {
      // Service Tier Email (unchanged - keeping existing logic)
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
              <a href="${metadata?.calendlyLink || 'https://calendly.com/averraaistudio-info'}" style="display: inline-block; background: #DCDACC; color: #301710; padding: 15px 40px; text-decoration: none; font-weight: 600; letter-spacing: 0.2em; font-size: 12px; text-transform: uppercase; margin-top: 10px;">
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
            
            <p style="color: #301710; line-height: 1.8; text-align: center; font-size: 18px; margin: 30px 0;">
              "Your brand should feel like the work you create—intentional, refined, unmistakably yours."
            </p>
            
            <p style="text-align: center; color: #654331; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 20px 0 0 0; opacity: 0.7;">
              — The AVERRA Philosophy
            </p>
          </div>
        </div>
      `;
    } else if (hasDigitalProduct) {
      // ============================================
      // DIGITAL PRODUCT EMAIL - USING RESEND TEMPLATE
      // ============================================
      
      console.log("📧 Digital product purchase detected - using Resend template");
      console.log("📦 Items received:", JSON.stringify(items, null, 2));
      
      // Build ORDER_ITEMS_HTML from items
      const orderItemsHtml = items.map((item: any) => {
        const quantityLabel = item.quantity > 1 ? ` (x${item.quantity})` : '';
        const itemPrice = typeof item.price === 'number' ? item.price.toFixed(2) : '0.00';
        return `<li style="margin-bottom: 10px; color: #301710;">${item.name}${quantityLabel} - $${itemPrice}</li>`;
      }).join('');
      
      console.log("📝 ORDER_ITEMS_HTML:", orderItemsHtml);
      
      // Build DOWNLOAD_URL
      const downloadUrl = `${publicSiteUrl}/downloads?session_id=${sessionId}`;
      console.log("🔗 DOWNLOAD_URL:", downloadUrl);
      
      // Format TOTAL as string with 2 decimals
      const totalFormatted = total.toFixed(2);
      console.log("💰 TOTAL:", totalFormatted);
      
      // Prepare template variables
      const templateVariables = {
        CUSTOMER_NAME: customerName || 'Valued Customer',
        ORDER_ITEMS_HTML: orderItemsHtml,
        TOTAL: totalFormatted,
        DOWNLOAD_URL: downloadUrl
      };
      
      console.log("📋 Template variables:", JSON.stringify(templateVariables, null, 2));
      
      // Send email using Resend template
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [customerEmail],
          template: {
            id: resendTemplateId,
            variables: templateVariables
          }
        }),
      });

      const responseData = await emailResponse.json();
      
      console.log("📥 Response status:", emailResponse.status);
      console.log("📥 Response data:", JSON.stringify(responseData));

      if (emailResponse.ok) {
        console.log("✅ Digital product email sent successfully using template!");
        return c.json({ 
          success: true, 
          message: "Digital product email sent! Check your inbox.",
          emailId: responseData.id,
          details: responseData
        });
      } else {
        console.error("❌ Resend API error:", responseData);
        
        let suggestion = "";
        if (emailResponse.status === 403) {
          suggestion = "API key is invalid. Check your Resend dashboard.";
        } else if (emailResponse.status === 422) {
          suggestion = "Email validation or template error. Check template ID and variables.";
        } else if (emailResponse.status === 404) {
          suggestion = "Template not found. Verify RESEND_TEMPLATE_ID in Supabase secrets.";
        }
        
        return c.json({ 
          error: "Resend API call failed", 
          details: responseData,
          statusCode: emailResponse.status,
          suggestion: suggestion || "Check Resend API documentation."
        }, 400);
      }
    }

    // If neither service tier nor digital product, send generic confirmation
    subject = "Thank you for your purchase";
    const itemsList = items.map((item: any) => 
      `<li style="margin-bottom: 10px; color: #301710;">${item.name} - $${item.price}</li>`
    ).join('');

    emailHtml = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F7F3EF; padding: 40px 20px;">
        <div style="background: white; padding: 40px; border: 1px solid rgba(48, 23, 16, 0.1);">
          <h1 style="color: #301710; font-size: 42px; font-weight: 300; font-style: italic; margin: 0 0 10px 0; text-align: center;">
            Thank You
          </h1>
          
          <p style="color: #301710; font-size: 18px; line-height: 1.8; margin-bottom: 20px;">
            Dear ${customerName},
          </p>
          
          <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
            Thank you for your purchase from AVERRA AI MODEL STUDIO.
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
        </div>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [customerEmail],
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