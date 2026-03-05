import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import Stripe from "npm:stripe@17.6.0";

const app = new Hono();

// Initialize Stripe with your secret key
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-12-18.acacia",
});

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-61755bec/health", (c) => {
  return c.json({ status: "ok" });
});

// Get Stripe publishable key
app.get("/make-server-61755bec/stripe-config", (c) => {
  try {
    const publishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
    const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!publishableKey) {
      console.error("STRIPE_PUBLISHABLE_KEY environment variable not set");
      return c.json({ error: "Stripe publishable key not configured" }, 500);
    }
    
    // Validate that it's actually a publishable key (starts with pk_)
    if (!publishableKey.startsWith("pk_")) {
      console.error("STRIPE_PUBLISHABLE_KEY is set but appears to be a secret key (starts with sk_) instead of a publishable key (should start with pk_)");
      console.error("Current value starts with:", publishableKey.substring(0, 5));
      return c.json({ 
        error: "Stripe publishable key is incorrect - it should start with 'pk_' not 'sk_'. Please update STRIPE_PUBLISHABLE_KEY environment variable with your publishable key." 
      }, 500);
    }
    
    // Validate that both keys are in the same mode (test or live)
    const publishableIsTest = publishableKey.startsWith("pk_test_");
    const secretIsTest = secretKey?.startsWith("sk_test_");
    
    if (publishableIsTest !== secretIsTest) {
      console.error("======================================");
      console.error("STRIPE KEY MISMATCH ERROR");
      console.error("======================================");
      console.error("STRIPE_PUBLISHABLE_KEY mode:", publishableIsTest ? "TEST" : "LIVE");
      console.error("STRIPE_SECRET_KEY mode:", secretIsTest ? "TEST" : "LIVE");
      console.error("");
      console.error("SOLUTION:");
      if (publishableIsTest) {
        console.error("Your publishable key is TEST mode (pk_test_...)");
        console.error("You need to update STRIPE_SECRET_KEY to TEST mode (sk_test_...)");
        console.error("");
        console.error("Steps:");
        console.error("1. Go to Stripe Dashboard → Developers → API Keys");
        console.error("2. Turn ON 'Test mode' toggle (top right)");
        console.error("3. Copy your 'Secret key' (starts with sk_test_)");
        console.error("4. Update the STRIPE_SECRET_KEY environment variable");
      } else {
        console.error("Your publishable key is LIVE mode (pk_live_...)");
        console.error("You need to update STRIPE_PUBLISHABLE_KEY to TEST mode (pk_test_...)");
        console.error("");
        console.error("Steps:");
        console.error("1. Go to Stripe Dashboard → Developers → API Keys");
        console.error("2. Turn ON 'Test mode' toggle (top right)");
        console.error("3. Copy your 'Publishable key' (starts with pk_test_)");
        console.error("4. Update the STRIPE_PUBLISHABLE_KEY environment variable");
        console.error("5. Or switch STRIPE_SECRET_KEY to LIVE mode if you want live payments");
      }
      console.error("======================================");
      
      return c.json({ 
        error: `🔑 Stripe Key Mismatch\n\nYour STRIPE_PUBLISHABLE_KEY is in ${publishableIsTest ? "TEST" : "LIVE"} mode, but your STRIPE_SECRET_KEY is in ${secretIsTest ? "TEST" : "LIVE"} mode.\n\nBoth keys must match:\n• For testing: Use pk_test_... AND sk_test_...\n• For live payments: Use pk_live_... AND sk_live_...\n\nPlease update your Stripe environment variables to use matching keys.` 
      }, 500);
    }
    
    console.log("Stripe config requested, publishable key exists and is valid:", publishableKey.substring(0, 15) + "...");
    console.log("Key mode:", publishableIsTest ? "TEST" : "LIVE");
    return c.json({ publishableKey });
  } catch (error) {
    console.error("Error in stripe-config endpoint:", error);
    return c.json({ error: "Failed to retrieve Stripe configuration" }, 500);
  }
});

// Create payment intent
app.post("/make-server-61755bec/create-payment-intent", async (c) => {
  try {
    const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    // Better error message if key is invalid
    if (!secretKey || secretKey === "Lovemenot1.") {
      console.error("STRIPE_SECRET_KEY is not set correctly. Current value:", secretKey);
      return c.json({ 
        error: "Stripe is not configured correctly. Please update STRIPE_SECRET_KEY environment variable with your actual Stripe secret key (starts with sk_test_...)",
        currentKey: secretKey?.substring(0, 10) + "..." // Show first 10 chars for debugging
      }, 500);
    }

    const { amount, customerInfo, items } = await c.req.json();

    if (!amount || !customerInfo || !items) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || "",
        items: JSON.stringify(items.map((item: any) => ({
          name: item.name,
          price: item.price,
          type: item.type,
        }))),
      },
    });

    console.log("Payment intent created:", paymentIntent.id);

    return c.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Payment setup failed" },
      500
    );
  }
});

// ============================================
// STRIPE CHECKOUT SESSION
// ============================================
app.post("/make-server-61755bec/create-checkout-session", async (c) => {
  try {
    const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!secretKey || secretKey === "Lovemenot1.") {
      console.error("STRIPE_SECRET_KEY is not set correctly");
      return c.json({ 
        error: "Stripe is not configured correctly. Please update STRIPE_SECRET_KEY environment variable."
      }, 500);
    }

    const { items, customerInfo, successUrl, cancelUrl, brandIntakeData } = await c.req.json();

    if (!items || !items.length) {
      return c.json({ error: "No items in cart" }, 400);
    }

    // Validate items to prevent crashes
    const validItems = items.filter((item: any) => {
      return item && 
             typeof item.name === 'string' && 
             typeof item.price === 'number' && 
             item.price > 0;
    });

    if (validItems.length === 0) {
      return c.json({ error: "No valid items in cart" }, 400);
    }

    // Convert cart items to Stripe line items with validation
    const lineItems = validItems.map((item: any) => {
      const unitAmount = Math.round(item.price * 100);
      
      // Stripe minimum is $0.50
      if (unitAmount < 50) {
        console.error(`Item ${item.name} price too low: $${item.price}`);
        throw new Error(`Price must be at least $0.50`);
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || '',
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      };
    });

    // Prepare metadata with brand intake data if available
    const metadata: any = {
      customerName: customerInfo?.name || '',
      customerEmail: customerInfo?.email || '',
      customerPhone: customerInfo?.phone || '',
      items: JSON.stringify(validItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        type: item.type,
      }))),
    };

    // Add brand intake data to metadata if provided
    if (brandIntakeData) {
      metadata.brandIntakeData = JSON.stringify(brandIntakeData);
    }

    // Create Stripe Checkout Session with timeout protection
    const sessionPromise = stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerInfo?.email || undefined,
      metadata,
    });

    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Stripe request timeout')), 25000);
    });

    const session = await Promise.race([sessionPromise, timeoutPromise]);

    console.log("✅ Checkout session created:", session.id);

    return c.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    
    // Provide detailed error info for debugging
    const errorMessage = error instanceof Error ? error.message : "Checkout session creation failed";
    console.error("Error details:", errorMessage);
    
    return c.json(
      { error: errorMessage },
      500
    );
  }
});

// Send order confirmation email (logs to console for now)
app.post("/make-server-61755bec/send-order-confirmation", async (c) => {
  try {
    const { customerInfo, items, totalPrice, paymentIntentId } = await c.req.json();

    // Store order in KV store for your records
    const orderId = `order_${Date.now()}`;
    await kv.set(orderId, {
      customerInfo,
      items,
      totalPrice,
      paymentIntentId,
      timestamp: new Date().toISOString(),
    });

    // Log order details (you'll receive this in your Supabase logs)
    console.log("=== NEW ORDER RECEIVED ===");
    console.log("Order ID:", orderId);
    console.log("Payment Intent:", paymentIntentId);
    console.log("\nCustomer Information:");
    console.log("Name:", customerInfo.name);
    console.log("Email:", customerInfo.email);
    console.log("Phone:", customerInfo.phone || "N/A");
    console.log("\nOrder Items:");
    items.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.name} - $${item.price} (${item.type})`);
    });
    console.log("\nTotal Amount: $" + totalPrice);
    console.log("===========================");

    return c.json({ success: true, orderId });
  } catch (error) {
    console.error("Error processing order confirmation:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Order confirmation failed" },
      500
    );
  }
});

// Apply discount code (placeholder - you can customize discount codes later)
app.post("/make-server-61755bec/apply-discount", async (c) => {
  try {
    const { discountCode } = await c.req.json();

    if (!discountCode) {
      return c.json({ error: "Discount code is required" }, 400);
    }

    // Define valid discount codes here
    const validDiscounts: { [key: string]: number } = {
      "LAUNCH10": 10,
      "LAUNCH25": 25,
      "LAUNCH50": 50,
    };

    const discountAmount = validDiscounts[discountCode.toUpperCase()] || 0;

    console.log("Discount code applied:", discountCode, "Amount:", discountAmount);

    return c.json({ discountAmount });
  } catch (error) {
    console.error("Error applying discount:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Discount application failed" },
      500
    );
  }
});

// Track quiz completion and results
app.post("/make-server-61755bec/track-quiz-completion", async (c) => {
  try {
    const { recommendedTier, answers, timestamp } = await c.req.json();

    if (!recommendedTier || !answers || !timestamp) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Generate unique ID for this quiz completion
    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the quiz data
    await kv.set(quizId, {
      recommendedTier,
      answers,
      timestamp,
      type: "quiz_completion"
    });

    console.log("Quiz completion tracked:", quizId, "Recommended tier:", recommendedTier);

    return c.json({ success: true, quizId });
  } catch (error) {
    console.error("Error tracking quiz completion:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to track quiz completion" },
      500
    );
  }
});

// Track button clicks and user actions
app.post("/make-server-61755bec/track-action", async (c) => {
  try {
    const { actionType, actionData, timestamp } = await c.req.json();

    if (!actionType || !timestamp) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Generate unique ID for this action
    const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the action data
    await kv.set(actionId, {
      actionType,
      actionData,
      timestamp,
      type: "user_action"
    });

    console.log("User action tracked:", actionType, actionData);

    return c.json({ success: true, actionId });
  } catch (error) {
    console.error("Error tracking action:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to track action" },
      500
    );
  }
});

// Get analytics summary
app.get("/make-server-61755bec/analytics-summary", async (c) => {
  try {
    // Get all quiz completions
    const quizCompletions = await kv.getByPrefix("quiz_");
    
    // Get all user actions
    const userActions = await kv.getByPrefix("action_");

    // Process quiz data
    const tierCounts: { [key: string]: number } = {};
    quizCompletions.forEach((item: any) => {
      if (item.type === "quiz_completion") {
        const tier = item.recommendedTier;
        tierCounts[tier] = (tierCounts[tier] || 0) + 1;
      }
    });

    // Process action data
    const actionCounts: { [key: string]: number } = {};
    userActions.forEach((item: any) => {
      if (item.type === "user_action") {
        const action = item.actionType;
        actionCounts[action] = (actionCounts[action] || 0) + 1;
      }
    });

    console.log("Analytics summary generated");

    return c.json({
      totalQuizCompletions: quizCompletions.filter((item: any) => item.type === "quiz_completion").length,
      tierRecommendations: tierCounts,
      totalActions: userActions.filter((item: any) => item.type === "user_action").length,
      actionBreakdown: actionCounts,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error generating analytics summary:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to generate analytics summary" },
      500
    );
  }
});

// Get sales data (all sales records with brand intake information)
app.get("/make-server-61755bec/sales-data", async (c) => {
  try {
    // Get all sales from Supabase KV
    const sales = await kv.getByPrefix("sale_");
    
    // Filter to only sale records and sort by date (newest first)
    const salesRecords = sales
      .filter((item: any) => item.type === "sale")
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });

    console.log("Sales data retrieved:", salesRecords.length, "records");

    return c.json({
      sales: salesRecords,
      totalSales: salesRecords.length,
      totalRevenue: salesRecords.reduce((sum: number, sale: any) => {
        return sum + parseFloat(sale.totalPrice || 0);
      }, 0),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error retrieving sales data:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve sales data" },
      500
    );
  }
});

// Contact form submission
app.post("/make-server-61755bec/contact-submission", async (c) => {
  try {
    const { name, email, phone, message } = await c.req.json();

    if (!name || !email || !message) {
      return c.json({ error: "Name, email, and message are required" }, 400);
    }

    // Store the contact submission in KV store
    const contactId = `contact_${Date.now()}`;
    await kv.set(contactId, {
      name,
      email,
      phone: phone || "N/A",
      message,
      timestamp: new Date().toISOString(),
    });

    // Log contact submission
    console.log("=== NEW CONTACT SUBMISSION ===" );
    console.log("Contact ID:", contactId);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone || "N/A");
    console.log("Message:", message);
    console.log("===========================");

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "AVERRA Contact Form <onboarding@resend.dev>",
            to: ["info@averraaistudio.com"],
            subject: `New Contact Inquiry from ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><small>Submitted on ${new Date().toLocaleString()}</small></p>
            `,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error sending email via Resend:", errorData);
        } else {
          console.log("Email sent successfully via Resend");
        }
      } catch (emailError) {
        console.error("Error sending email via Resend:", emailError);
      }
    } else {
      console.log("RESEND_API_KEY not configured - email not sent");
    }

    return c.json({ success: true, contactId });
  } catch (error) {
    console.error("Error processing contact submission:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Contact submission failed" },
      500
    );
  }
});

// Submit brand intake form
app.post("/make-server-61755bec/submit-brand-intake", async (c) => {
  try {
    const formData = await c.req.json();

    // Validate required fields
    const requiredFields = [
      'tier', 'fullName', 'businessName', 'servicesOffering',
      'businessStage', 'misalignedAspects', 'brandPerception',
      'idealClient', 'futureGoals', 'aiStance'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return c.json({ error: `Missing required field: ${field}` }, 400);
      }
    }

    // Connect to Supabase using service role key
    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert into brand_intakes table
    const { data, error } = await supabase
      .from('brand_intakes')
      .insert({
        tier: formData.tier,
        full_name: formData.fullName,
        business_name: formData.businessName,
        instagram_handle: formData.instagramHandle || null,
        website: formData.website || null,
        services: formData.servicesOffering,
        business_stage: Array.isArray(formData.businessStage) 
          ? formData.businessStage.join(', ') 
          : formData.businessStage,
        brand_misalignment: Array.isArray(formData.misalignedAspects)
          ? formData.misalignedAspects.join(', ')
          : formData.misalignedAspects,
        brand_feel: formData.brandPerception,
        ideal_client: formData.idealClient,
        plans_6_12_months: Array.isArray(formData.futureGoals)
          ? formData.futureGoals.join(', ')
          : formData.futureGoals,
        ai_stance: formData.aiStance,
        urgent_notes: formData.urgentNotes || null,
        payment_status: 'submitted',
        stripe_customer_email: formData.customerEmail || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting brand intake:', error);
      return c.json({ error: 'Failed to save brand intake form' }, 500);
    }

    console.log('✅ Brand intake form saved:', data.id);

    return c.json({ 
      success: true, 
      intakeId: data.id,
      message: 'Brand intake form submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting brand intake:', error);
    return c.json(
      { error: error instanceof Error ? error.message : 'Failed to submit brand intake' },
      500
    );
  }
});

// ============================================
// STRIPE WEBHOOK HANDLER
// ============================================
app.post("/make-server-61755bec/webhooks/stripe", async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return c.json({ error: "Webhook secret not configured" }, 500);
    }

    if (!signature) {
      console.error("No Stripe signature found in request");
      return c.json({ error: "No signature" }, 400);
    }

    // Verify webhook signature
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return c.json({ error: "Invalid signature" }, 400);
    }

    console.log(`✅ Webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("💰 Payment succeeded:", paymentIntent.id);

        // Extract metadata
        const customerName = paymentIntent.metadata?.customerName || "N/A";
        const customerEmail = paymentIntent.metadata?.customerEmail || "N/A";
        const customerPhone = paymentIntent.metadata?.customerPhone || "N/A";
        const items = paymentIntent.metadata?.items ? JSON.parse(paymentIntent.metadata.items) : [];

        // Create project record
        const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await kv.set(projectId, {
          projectId,
          status: "Awaiting Strategy Session",
          customerName,
          customerEmail,
          customerPhone,
          items,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convert from cents
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          type: "project"
        });

        console.log("📋 Project created:", projectId);

        // Send confirmation email via Resend
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        
        if (resendApiKey) {
          try {
            const itemsList = items.map((item: any) => 
              `<li style="margin-bottom: 10px;">${item.name} - $${item.price}</li>`
            ).join('');

            const emailResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "AVERRA AI Model Studio <onboarding@resend.dev>",
                to: [customerEmail],
                subject: "Welcome to AVERRA - Your Brand Journey Begins! 🎨",
                html: `
                  <div style="font-family: 'Cormorant', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #DCDACC;">
                    <div style="background: rgba(255, 255, 255, 0.95); padding: 40px; border: 1px solid rgba(48, 23, 16, 0.2);">
                      <h1 style="font-family: 'Cormorant', Georgia, serif; font-size: 36px; font-weight: 300; color: #301710; margin-bottom: 20px; text-align: center;">
                        AVERRA
                      </h1>
                      
                      <h2 style="font-size: 24px; font-weight: 400; color: #301710; margin-bottom: 30px; text-align: center;">
                        Payment Confirmed! ✨
                      </h2>
                      
                      <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                        Hi ${customerName},
                      </p>
                      
                      <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                        Thank you for choosing AVERRA! Your payment has been processed successfully.
                      </p>
                      
                      <div style="background: rgba(48, 23, 16, 0.05); padding: 25px; margin: 30px 0; border-left: 3px solid #301710;">
                        <h3 style="font-size: 18px; color: #301710; margin-bottom: 15px;">Order Summary</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                          ${itemsList}
                        </ul>
                        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(48, 23, 16, 0.2);">
                          <strong style="color: #301710;">Total Paid: $${(paymentIntent.amount / 100).toFixed(2)}</strong>
                        </div>
                      </div>
                      
                      <div style="background: rgba(48, 23, 16, 0.05); padding: 25px; margin: 30px 0; border-left: 3px solid #301710;">
                        <h3 style="font-size: 18px; color: #301710; margin-bottom: 15px;">What Happens Next</h3>
                        
                        <div style="margin-bottom: 15px;">
                          <strong style="color: #301710;">1. Schedule Your Strategy Session</strong><br/>
                          <span style="color: rgba(48, 23, 16, 0.7);">You'll receive a separate email with your booking link within 24 hours.</span>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                          <strong style="color: #301710;">2. Define Your Direction</strong><br/>
                          <span style="color: rgba(48, 23, 16, 0.7);">Your strategy session ensures visuals are built with intention before production starts.</span>
                        </div>
                        
                        <div>
                          <strong style="color: #301710;">3. Receive Your Brand System</strong><br/>
                          <span style="color: rgba(48, 23, 16, 0.7);">Custom visuals delivered within 7-10 business days!</span>
                        </div>
                      </div>
                      
                      <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                        Your project ID: <strong>${projectId}</strong>
                      </p>
                      
                      <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                        We're excited to work with you!
                      </p>
                      
                      <p style="color: #301710; line-height: 1.8;">
                        — The AVERRA Team
                      </p>
                      
                      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(48, 23, 16, 0.2); text-align: center;">
                        <p style="color: rgba(48, 23, 16, 0.6); font-size: 12px;">
                          Questions? Reply to this email or visit averraaistudio.com
                        </p>
                      </div>
                    </div>
                  </div>
                `,
              }),
            });

            if (emailResponse.ok) {
              console.log("📧 Confirmation email sent via Resend to:", customerEmail);
            } else {
              const errorData = await emailResponse.json();
              console.error("❌ Resend email failed:", errorData);
            }
          } catch (emailError) {
            console.error("❌ Error sending Resend email:", emailError);
          }
        } else {
          console.log("⚠️ RESEND_API_KEY not configured - skipping confirmation email");
        }

        // Send SMS confirmation via Twilio (if phone number provided)
        if (customerPhone && customerPhone !== "N/A") {
          const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
          const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
          const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
          
          if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
            try {
              const smsBody = `Hi ${customerName}! 🎨 Your AVERRA payment is confirmed! Check your email for next steps. Project ID: ${projectId}`;
              
              const credentials = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
              
              const smsResponse = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
                {
                  method: "POST",
                  headers: {
                    "Authorization": `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                    To: customerPhone,
                    From: twilioPhoneNumber,
                    Body: smsBody,
                  }).toString(),
                }
              );

              if (smsResponse.ok) {
                console.log("📱 SMS confirmation sent via Twilio to:", customerPhone);
              } else {
                const errorData = await smsResponse.json();
                console.error("❌ Twilio SMS failed:", errorData);
              }
            } catch (smsError) {
              console.error("❌ Error sending Twilio SMS:", smsError);
            }
          } else {
            console.log("⚠️ Twilio credentials not configured - skipping SMS confirmation");
          }
        }

        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("🛒 Checkout completed:", session.id);
        
        // Extract metadata
        const customerName = session.metadata?.customerName || "N/A";
        const customerEmail = session.metadata?.customerEmail || "N/A";
        const customerPhone = session.metadata?.customerPhone || "N/A";
        const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
        const brandIntakeData = session.metadata?.brandIntakeData ? JSON.parse(session.metadata.brandIntakeData) : null;
        
        // Update brand intake status in database if intake ID exists
        if (brandIntakeData && brandIntakeData.intakeId) {
          try {
            const { createClient } = await import("jsr:@supabase/supabase-js@2");
            const supabase = createClient(
              Deno.env.get('SUPABASE_URL') ?? '',
              Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            const { error } = await supabase
              .from('brand_intakes')
              .update({
                payment_status: 'paid',
                stripe_session_id: session.id,
                stripe_customer_email: customerEmail
              })
              .eq('id', brandIntakeData.intakeId);

            if (error) {
              console.error('Error updating brand intake payment status:', error);
            } else {
              console.log('✅ Brand intake marked as paid:', brandIntakeData.intakeId);
            }
          } catch (dbError) {
            console.error('Error connecting to database:', dbError);
          }
        }
        
        // Create sale record ID
        const saleId = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store complete sale data in Supabase KV
        await kv.set(saleId, {
          saleId,
          orderId: session.id,
          customerName,
          customerEmail,
          customerPhone,
          items: items.map((item: any) => item.name).join(", "),
          totalPrice: (session.amount_total / 100).toFixed(2),
          paymentId: session.payment_intent || session.id,
          // Brand intake form data
          brandName: brandIntakeData?.businessName || "N/A",
          industry: brandIntakeData?.servicesOffering || "N/A",
          targetAudience: brandIntakeData?.idealClient || "N/A",
          goals: brandIntakeData?.futureGoals?.join(", ") || "N/A",
          instagramHandle: brandIntakeData?.instagramHandle || "N/A",
          website: brandIntakeData?.website || "N/A",
          businessStage: brandIntakeData?.businessStage?.join(", ") || "N/A",
          brandPerception: brandIntakeData?.brandPerception || "N/A",
          // Full brand intake data for reference
          fullBrandIntakeData: brandIntakeData,
          createdAt: new Date().toISOString(),
          type: "sale"
        });
        
        console.log("✅ Sale record stored in Supabase:", saleId);
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      500
    );
  }
});

Deno.serve(app.fetch);