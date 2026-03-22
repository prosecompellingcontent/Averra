// This endpoint is imported and used in the main server
import { createClient } from "jsr:@supabase/supabase-js@2";

export async function handleSendPurchaseEmail(c: any) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY not configured");
      return c.json({ 
        error: "RESEND_API_KEY not configured in Supabase secrets" 
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
      // DIGITAL PRODUCT MAPPING (BY PRICE ID)
      // ============================================
      const DIGITAL_PRODUCT_MAP: Record<string, { name: string; url: string }> = {
        'price_1T6jvhKLeJj1g28UvIxFbI3O': {
          name: 'The Map Pack',
          url: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-map-pack/the-map-pack.zip'
        },
        'price_1T6jvrKLeJj1g28URaMIEaL3': {
          name: 'The Base Bundle',
          url: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-base-bundle/the-base-bundle.zip'
        },
        'price_1T6jvyKLeJj1g28UVyqmrr5U': {
          name: 'The Cuticle Collection',
          url: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-cuticle-collection/the-cuticle-collection.zip'
        },
        'price_1T6jw5KLeJj1g28UcpqJcnvL': {
          name: 'You Glow Girl Bundle',
          url: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/you-glow-girl-bundle/you-glow-girl-bundle.zip'
        },
        'price_1TCQF9KLeJj1g28Ui7ESZUAF': {
          name: 'Fresh Out The Chair',
          url: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/fresh-out-the-chair/fresh-out-the-chair.zip'
        },
        'price_1TCQGHKLeJj1g28UJqHVf7wl': {
          name: 'The Lash Collection',
          url: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip'
        }
      };

      // TEST MARKER - Change subject for ONE test
      subject = "DIGITAL DELIVERY TEST 123";
      
      // Match digital products by PRICE ID
      console.log("📦 Matching digital products by PRICE ID...");
      console.log("📦 Items received:", JSON.stringify(items, null, 2));
      
      const matchedProducts: any[] = [];
      const unmatchedPriceIds: string[] = [];
      
      for (const item of items) {
        if (item.priceId) {
          console.log(`🔍 Checking price ID: ${item.priceId}`);
          
          if (DIGITAL_PRODUCT_MAP[item.priceId]) {
            const productInfo = DIGITAL_PRODUCT_MAP[item.priceId];
            matchedProducts.push({
              productName: productInfo.name,
              downloadUrl: productInfo.url,
              quantity: item.quantity || 1,
              price: item.price
            });
            console.log(`✅ MATCHED: ${item.priceId} → ${productInfo.name}`);
          } else {
            unmatchedPriceIds.push(item.priceId);
            console.warn(`⚠️ NO MATCH for price ID: ${item.priceId}`);
          }
        }
      }
      
      console.log(`📊 Matched ${matchedProducts.length} digital products`);
      if (unmatchedPriceIds.length > 0) {
        console.warn(`⚠️ Unmatched price IDs:`, unmatchedPriceIds.join(', '));
      }
      
      // Build download buttons HTML
      let downloadLinksHtml = '';
      
      if (matchedProducts.length > 0) {
        downloadLinksHtml = matchedProducts.map((product: any) => {
          const quantityLabel = product.quantity > 1 ? ` (x${product.quantity})` : '';
          return `
            <div style="margin-bottom: 20px; text-align: center;">
              <h4 style="color: #DCDACC; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">${product.productName}${quantityLabel}</h4>
              <a href="${product.downloadUrl}" 
                 style="display: inline-block; background: #E91E63; color: white; padding: 16px 32px; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 4px; text-align: center;">
                📥 DOWNLOAD
              </a>
            </div>
          `;
        }).join('');
        
        console.log(`✅ Generated downloadButtonsHtml: ${downloadLinksHtml.length} characters`);
      } else {
        // FAILSAFE: No products matched
        console.error(`❌ NO PRODUCTS MATCHED! downloadLinksHtml will be empty.`);
        downloadLinksHtml = `
          <div style="background: rgba(255, 193, 7, 0.1); padding: 20px; border-left: 3px solid #FFC107; text-align: center;">
            <p style="color: #301710; margin: 0; font-size: 16px;">
              Your download links are being prepared. Reply to this email and we'll send them immediately.
            </p>
          </div>
        `;
      }
      
      const itemsList = matchedProducts.map((item: any) => {
        const quantityLabel = item.quantity > 1 ? ` (x${item.quantity})` : '';
        return `<li style="margin-bottom: 10px; color: #301710;">${item.productName}${quantityLabel} - $${item.price}</li>`;
      }).join('');

      emailHtml = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F7F3EF; padding: 40px 20px;">
          <div style="background: white; padding: 40px; border: 1px solid rgba(48, 23, 16, 0.1);">
            <p style="color: red; font-weight: bold; text-align: center; margin: 0 0 20px 0;">DOWNLOADTEST123</p>
            
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
            
            <div style="background: #301710; padding: 30px; margin: 30px 0;">
              <h2 style="color: #DCDACC; font-size: 22px; margin: 0 0 15px 0; font-weight: 400; text-align: center;">
                📥 Download Your Files
              </h2>
              <p style="color: #BFBBA7; line-height: 1.8; margin-bottom: 20px; text-align: center;">
                Click below to download your files. Each collection is a ZIP file with images and commercial license.
              </p>
              ${downloadLinksHtml}
            </div>
            
            <div style="background: rgba(183, 110, 121, 0.1); padding: 25px; margin: 30px 0;">
              <h3 style="color: #301710; font-size: 18px; margin: 0 0 15px 0; font-weight: 500;">
                ✓ Commercial License Included
              </h3>
              <p style="color: #654331; line-height: 1.8; margin: 0;">
                All images come with a full commercial license. Use them freely in your marketing, website, social media, client presentations, and any professional materials.
              </p>
            </div>
            
            <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(183, 110, 121, 0.4), transparent); margin: 30px 0;"></div>
            
            <p style="color: #301710; line-height: 1.8; text-align: center; margin: 20px 0;">
              Questions? Reach out to <a href="mailto:info@averraaistudio.com" style="color: #b76e79; text-decoration: none;">info@averraaistudio.com</a>
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
        from: "AVERRA Deliveries <deliveries@averraaistudio.com>",
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