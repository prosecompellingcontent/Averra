import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import Stripe from "npm:stripe@20.4.1";
import { handleSendPurchaseEmail } from "./send-purchase-email.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Stripe with your secret key
const stripe = new Stripe(Deno.env.get("Stripe_Secret_Key") || "", {
  apiVersion: "2026-02-25.clover",
});

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: [
      "Content-Type", 
      "Authorization", 
      "stripe-signature",  // Add Stripe signature header
      "Stripe-Signature"   // Stripe uses capital S sometimes
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-61755bec/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// TEST RESEND EMAIL ENDPOINT
// ============================================
app.post("/make-server-61755bec/test-email", async (c) => {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      return c.json({ 
        error: "RESEND_API_KEY not configured in Supabase secrets" 
      }, 500);
    }

    const body = await c.req.json();
    const testEmail = body.to || "test@example.com";

    console.log("🧪 Testing Resend API...");
    console.log("📧 Sending test email to:", testEmail);
    console.log("🔑 API Key present:", resendApiKey ? "Yes (length: " + resendApiKey.length + ")" : "No");

    const emailPayload = {
      from: "AVERRA AI Model Studio <onboarding@resend.dev>",
      to: [testEmail],
      subject: "🧪 Test Email from AVERRA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #301710;">✅ Resend API is Working!</h1>
          <p style="color: #301710; line-height: 1.8;">
            This is a test email from your AVERRA backend. If you see this, your Resend API key is configured correctly!
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    };

    console.log("📤 Sending to Resend API...");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await emailResponse.json();
    
    console.log("📥 Resend response status:", emailResponse.status);
    console.log("📥 Resend response data:", JSON.stringify(responseData));

    if (emailResponse.ok) {
      console.log("✅ Test email sent successfully!");
      return c.json({ 
        success: true, 
        message: "Test email sent! Check your inbox.",
        emailId: responseData.id,
        details: responseData
      });
    } else {
      console.error("❌ Resend API error:", responseData);
      
      // Provide helpful error messages based on status code
      let suggestion = "";
      if (emailResponse.status === 403) {
        suggestion = "API key is invalid or doesn't have permission. Please check your Resend dashboard and verify the API key.";
      } else if (emailResponse.status === 422) {
        suggestion = "Email validation failed. Make sure the 'to' address is valid. If using a custom 'from' domain, verify it in Resend first.";
      } else if (emailResponse.status === 429) {
        suggestion = "Rate limit exceeded. Wait a few minutes before trying again.";
      }
      
      return c.json({ 
        error: "Resend API call failed", 
        details: responseData,
        statusCode: emailResponse.status,
        suggestion: suggestion || "Check the Resend API documentation for more details."
      }, 400);
    }
  } catch (error) {
    console.error("❌ Test email error:", error);
    return c.json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// ============================================
// DIAGNOSTIC ENDPOINT - Check API Keys
// ============================================
app.get("/make-server-61755bec/check-config", (c) => {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const stripeSecret = Deno.env.get("Stripe_Secret_Key");
  const stripePublishable = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  return c.json({
    resend: {
      configured: !!resendKey,
      keyLength: resendKey ? resendKey.length : 0,
      keyPreview: resendKey ? `${resendKey.substring(0, 7)}...${resendKey.substring(resendKey.length - 4)}` : null
    },
    stripe: {
      secretKey: !!stripeSecret,
      publishableKey: !!stripePublishable,
      webhookSecret: !!webhookSecret
    },
    environment: Deno.env.get("DENO_DEPLOYMENT_ID") ? "production" : "development"
  });
});

// Test purchase email endpoint
app.post("/make-server-61755bec/send-purchase-email", handleSendPurchaseEmail);

// Debug route to check storage folders
app.get('/make-server-61755bec/debug/storage', async (c) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // List all folders in digital-products bucket
  const { data: folders, error } = await supabase
    .storage
    .from('digital-products')
    .list('', {
      limit: 100,
      offset: 0,
    });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  // For each folder, list the files inside
  const folderContents: any = {};
  for (const folder of folders || []) {
    if (folder.name) {
      const { data: files } = await supabase
        .storage
        .from('digital-products')
        .list(folder.name, {
          limit: 100,
          offset: 0,
        });
      folderContents[folder.name] = files?.map(f => f.name) || [];
    }
  }

  return c.json({
    folders: folders?.map(f => f.name) || [],
    folderContents
  });
});

// Download product files as ZIP
app.get('/make-server-61755bec/download-product/:productName', async (c) => {
  const productName = c.req.param('productName');
  
  console.log(`📦 Creating ZIP for product: ${productName}`);
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // List files INSIDE the product folder
  const { data: productFiles, error: listError } = await supabase
    .storage
    .from('digital-products')
    .list(productName, {
      limit: 100,
      offset: 0,
    });
  
  if (listError) {
    console.error(`❌ Error listing files in ${productName}/:`, listError);
    return c.json({ error: listError.message }, 500);
  }
  
  if (!productFiles || productFiles.length === 0) {
    return c.json({ error: 'No files found for this product' }, 404);
  }
  
  console.log(`📁 Found ${productFiles.length} files to zip`);
  
  // Import JSZip
  const JSZip = (await import('npm:jszip@3.10.1')).default;
  const zip = new JSZip();
  
  // Download each file and add to ZIP
  for (const file of productFiles) {
    const filePath = `${productName}/${file.name}`;
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('digital-products')
      .download(filePath);
    
    if (downloadError) {
      console.error(`❌ Error downloading ${filePath}:`, downloadError);
      continue;
    }
    
    if (fileData) {
      // Convert Blob to ArrayBuffer
      const arrayBuffer = await fileData.arrayBuffer();
      zip.file(file.name, arrayBuffer);
      console.log(`✅ Added ${file.name} to ZIP`);
    }
  }
  
  // Generate ZIP file
  const zipBlob = await zip.generateAsync({ type: 'uint8array' });
  
  console.log(`✅ Created ZIP file (${zipBlob.length} bytes)`);
  
  // Return ZIP file
  return new Response(zipBlob, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${productName}.zip"`,
      'Content-Length': zipBlob.length.toString(),
    },
  });
});

// TEST ENDPOINT - List all files in storage
app.get("/make-server-61755bec/test-storage", async (c) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: folders, error } = await supabase
    .storage
    .from('digital-products')
    .list('', {
      limit: 100,
    });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const result: any = { folders: [] };

  for (const folder of folders || []) {
    const { data: files } = await supabase
      .storage
      .from('digital-products')
      .list(folder.name, { limit: 100 });
    
    result.folders.push({
      name: folder.name,
      files: files?.map(f => f.name) || []
    });
  }

  return c.json(result);
});

// Get Stripe publishable key
app.get("/make-server-61755bec/stripe-config", (c) => {
  try {
    const publishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
    const secretKey = Deno.env.get("Stripe_Secret_Key");
    
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
    const secretKey = Deno.env.get("Stripe_Secret_Key");
    
    // Better error message if key is invalid
    if (!secretKey) {
      console.error("STRIPE_SECRET_KEY is not set");
      return c.json({ 
        error: "Stripe is not configured. Please contact support."
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
    const secretKey = Deno.env.get("Stripe_Secret_Key");
    
    if (!secretKey) {
      console.error("STRIPE_SECRET_KEY is not set");
      return c.json({ 
        error: "Stripe is not configured. Please contact support."
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

      // Build product_data - only include description if it exists and is non-empty
      const productData: any = {
        name: item.name,
      };
      
      // Only add description if it exists and is not empty
      if (item.description && item.description.trim() !== '') {
        productData.description = item.description;
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    // Prepare metadata with brand intake data if available
    // NOTE: Stripe limits metadata values to 500 characters
    const metadata: any = {
      customerName: customerInfo?.name || '',
      customerEmail: customerInfo?.email || '',
      customerPhone: customerInfo?.phone || '',
      // Store item count and types instead of full items array to avoid 500 char limit
      itemCount: validItems.length.toString(),
      itemTypes: validItems.map((item: any) => item.type).join(','),
      hasServiceTier: validItems.some((item: any) => item.type === 'service') ? 'true' : 'false',
      hasDigitalProduct: validItems.some((item: any) => item.type === 'digital') ? 'true' : 'false',
    };

    // Add brand intake data to metadata if provided
    if (brandIntakeData) {
      // Store a reference ID instead of full data to avoid character limit
      const intakeRefId = `intake_${Date.now()}`;
      metadata.intakeRefId = intakeRefId;
      
      // Store the full brand intake data in KV store
      await kv.set(intakeRefId, brandIntakeData);
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
    console.error("❌ Error creating checkout session:");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", JSON.stringify(error, null, 2));
    
    // Stripe errors have specific structure
    if (error && typeof error === 'object' && 'type' in error) {
      console.error("Stripe error type:", (error as any).type);
      console.error("Stripe error code:", (error as any).code);
      console.error("Stripe error param:", (error as any).param);
    }
    
    // Provide detailed error info for debugging
    const errorMessage = error instanceof Error ? error.message : "Checkout session creation failed";
    
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

// Get pending client onboarding tasks (for Calendly automation)
app.get("/make-server-61755bec/pending-onboarding", async (c) => {
  try {
    // Get all sales from Supabase KV
    const sales = await kv.getByPrefix("sale_");
    
    // Filter to sales that haven't booked strategy session yet
    const pendingOnboarding = sales
      .filter((item: any) => 
        item.type === "sale" && 
        item.onboardingStatus === "payment_complete" &&
        !item.strategySessionBooked
      )
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });

    console.log("Pending onboarding tasks:", pendingOnboarding.length);

    return c.json({
      pendingClients: pendingOnboarding,
      totalPending: pendingOnboarding.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error retrieving pending onboarding:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve pending onboarding" },
      500
    );
  }
});

// Update client onboarding status (called when Calendly booking is confirmed)
app.post("/make-server-61755bec/update-onboarding-status", async (c) => {
  try {
    const { saleId, strategySessionBooked, calendlyEventId, onboardingStatus } = await c.req.json();

    if (!saleId) {
      return c.json({ error: "Missing saleId" }, 400);
    }

    // Get existing sale record
    const existingSale = await kv.get(saleId);
    
    if (!existingSale) {
      return c.json({ error: "Sale not found" }, 404);
    }

    // Update the sale record
    const updatedSale = {
      ...existingSale,
      strategySessionBooked: strategySessionBooked ?? existingSale.strategySessionBooked,
      calendlyEventId: calendlyEventId ?? existingSale.calendlyEventId,
      onboardingStatus: onboardingStatus ?? existingSale.onboardingStatus,
      updatedAt: new Date().toISOString()
    };

    await kv.set(saleId, updatedSale);

    console.log("✅ Onboarding status updated:", saleId);

    return c.json({ 
      success: true, 
      saleId,
      updatedSale 
    });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to update onboarding status" },
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
            to: ["prosecompellingcontent@gmail.com"],
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
    console.log("🔔 WEBHOOK RECEIVED FROM STRIPE!", new Date().toISOString());
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET not configured in Supabase!");
      return c.json({ error: "Webhook secret not configured" }, 500);
    }
    
    console.log("✅ Webhook secret found, verifying signature...");

    if (!signature) {
      console.error("No Stripe signature found in request");
      console.log("Headers:", c.req.header());
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
        
        // Note: Items are stored in checkout session, not payment intent
        // For payment_intent.succeeded without checkout, items won't be available
        const items = [];

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
        const startTime = Date.now();
        console.log("🛒 Checkout completed:", session.id);
        console.log("⏰ Webhook received at:", new Date().toISOString());
        console.log("💳 Processing payment immediately - NO DELAYS!");
        
        // Retrieve line items from Stripe (contains product details AND price IDs)
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product'],
        });
        
        // Convert line items to our items format (including price ID for digital product matching)
        const items = lineItems.data.map((lineItem: any) => ({
          name: lineItem.description || lineItem.price?.product?.name || 'Unknown Product',
          price: lineItem.amount_total / 100,
          quantity: lineItem.quantity,
          priceId: lineItem.price?.id || '', // CRITICAL: Store price ID for matching
        }));
        
        console.log("📦 Line items retrieved:", items.length, "items");
        
        // Extract metadata
        const customerName = session.customer_details?.name || session.metadata?.customerName || "N/A";
        const customerEmail = session.customer_details?.email || session.metadata?.customerEmail || "N/A";
        const customerPhone = session.customer_details?.phone || session.metadata?.customerPhone || "N/A";
        
        // Retrieve brand intake data from KV store if reference ID exists
        let brandIntakeData = null;
        if (session.metadata?.intakeRefId) {
          brandIntakeData = await kv.get(session.metadata.intakeRefId);
          console.log("📋 Brand intake data retrieved from KV store");
        }
        
        // Determine service tier from items
        const serviceTier = items.find((item: any) => 
          item.name.includes('Essentials') || item.name.includes('Signature') || item.name.includes('Muse')
        )?.name || "N/A";
        
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
        
        // Store complete sale data in Supabase KV for analytics and client onboarding
        const saleRecord = {
          saleId,
          orderId: session.id,
          customerName,
          customerEmail,
          customerPhone,
          items: items.map((item: any) => item.name).join(", "),
          itemsArray: items, // Store full items array for automation
          totalPrice: (session.amount_total / 100).toFixed(2),
          paymentId: session.payment_intent || session.id,
          serviceTier, // For routing to correct Calendly link
          // Brand intake form data
          brandName: brandIntakeData?.businessName || "N/A",
          industry: brandIntakeData?.servicesOffering || "N/A",
          targetAudience: brandIntakeData?.idealClient || "N/A",
          goals: Array.isArray(brandIntakeData?.futureGoals) 
            ? brandIntakeData.futureGoals.join(", ") 
            : brandIntakeData?.futureGoals || "N/A",
          instagramHandle: brandIntakeData?.instagramHandle || "N/A",
          website: brandIntakeData?.website || "N/A",
          businessStage: Array.isArray(brandIntakeData?.businessStage)
            ? brandIntakeData.businessStage.join(", ")
            : brandIntakeData?.businessStage || "N/A",
          brandPerception: brandIntakeData?.brandPerception || "N/A",
          misalignedAspects: Array.isArray(brandIntakeData?.misalignedAspects)
            ? brandIntakeData.misalignedAspects.join(", ")
            : brandIntakeData?.misalignedAspects || "N/A",
          aiStance: brandIntakeData?.aiStance || "N/A",
          urgentNotes: brandIntakeData?.urgentNotes || "N/A",
          // Full brand intake data for reference
          fullBrandIntakeData: brandIntakeData,
          // Client onboarding status
          onboardingStatus: "payment_complete",
          strategySessionBooked: false,
          calendlyEventId: null,
          // Timestamps
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          type: "sale"
        };
        
        await kv.set(saleId, saleRecord);
        
        console.log("✅ Sale record stored in Supabase:", saleId);
        console.log("📊 Customer:", customerName, "|", customerEmail);
        console.log("💰 Amount:", (session.amount_total / 100).toFixed(2));
        console.log("🎨 Service Tier:", serviceTier);
        
        // ============================================
        // EMAIL AUTOMATION BASED ON PURCHASE TYPE
        // ============================================
        
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        
        if (!resendApiKey) {
          console.log("⚠️ RESEND_API_KEY not configured - skipping emails");
        } else {
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

          // Separate items into categories
          const serviceTiers = items.filter((item: any) => 
            item.name.includes('Essentials') || 
            item.name.includes('Signature') || 
            item.name.includes('Muse')
          );
          
          // Match digital products by PRICE ID (stable identifier)
          const digitalProducts = items
            .filter((item: any) => DIGITAL_PRODUCT_MAP[item.priceId])
            .map((item: any) => ({
              ...item,
              productName: DIGITAL_PRODUCT_MAP[item.priceId].name,
              downloadUrl: DIGITAL_PRODUCT_MAP[item.priceId].url
            }));
          
          console.log(`📦 Order contains: ${serviceTiers.length} service tier(s), ${digitalProducts.length} digital product(s)`);
          
          // ============================================
          // EMAIL #1: SERVICE TIER WELCOME + CALENDLY
          // ============================================
          if (serviceTiers.length > 0) {
            try {
              console.log(`🚀 INSTANT DELIVERY: Sending service tier email to ${customerEmail} NOW!`);
              const tierEmailStartTime = Date.now();
              
              const tierName = serviceTiers[0].name; // Get first tier name
              const tiersList = serviceTiers.map((item: any) => 
                `<li style="margin-bottom: 10px; color: #301710;">${item.name} - $${item.price}</li>`
              ).join('');
              
              // Map tier names to their specific Calendly links
              const calendlyLink = tierName.includes('Essentials') 
                ? "https://calendly.com/averraaistudio-info/averra-s-essential-strategy-session"
                : tierName.includes('Signature')
                ? "https://calendly.com/averraaistudio-info/averra-s-essential-strategy-session-clone"
                : "https://calendly.com/averraaistudio-info/averra-s-signature-strategy-session-clone";

              const emailResponse = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${resendApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "AVERRA AI Model Studio <hello@averraaistudio.com>",
                  to: [customerEmail],
                  subject: "Your AVERRA Brand Journey Begins Now ✨",
                  html: `
                    <div style="font-family: 'Cormorant', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: #DCDACC;">
                      <!-- AVERRA Logo Header -->
                      <div style="background: #301710; padding: 30px 20px; text-align: center;">
                        <h1 style="font-family: 'Cormorant', Georgia, serif; font-size: 42px; font-weight: 300; color: #DCDACC; margin: 0; letter-spacing: 0.15em;">
                          AVERRA
                        </h1>
                        <p style="color: rgba(220, 218, 204, 0.8); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin: 10px 0 0 0;">
                          AI Model Studio
                        </p>
                      </div>
                      
                      <!-- Main Content -->
                      <div style="background: rgba(255, 255, 255, 0.95); padding: 40px; border-left: 1px solid rgba(48, 23, 16, 0.2); border-right: 1px solid rgba(48, 23, 16, 0.2);">
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
                          <h3 style="font-size: 18px; color: #301710; margin-bottom: 15px;">Service Package</h3>
                          <ul style="list-style: none; padding: 0; margin: 0;">
                            ${tiersList}
                          </ul>
                        </div>
                        
                        <div style="background: rgba(48, 23, 16, 0.05); padding: 25px; margin: 30px 0; border-left: 3px solid #654331;">
                          <h3 style="font-size: 20px; color: #301710; margin-bottom: 15px;">📅 Next Step: Book Your Strategy Session</h3>
                          
                          <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                            Your strategy session ensures visuals are built with intention before production starts. This is where we define your direction together.
                          </p>
                          
                          <div style="text-align: center; margin: 25px 0;">
                            <a href="${calendlyLink}" 
                               style="display: inline-block; padding: 15px 40px; background: #301710; color: #DCDACC; text-decoration: none; font-size: 14px; letter-spacing: 0.3em; text-transform: uppercase;">
                              Schedule Now
                            </a>
                          </div>
                          
                          <p style="color: rgba(48, 23, 16, 0.7); font-size: 14px; text-align: center;">
                            Or copy this link: ${calendlyLink}
                          </p>
                        </div>
                        
                        <div style="background: rgba(48, 23, 16, 0.05); padding: 25px; margin: 30px 0; border-left: 3px solid #301710;">
                          <h3 style="font-size: 18px; color: #301710; margin-bottom: 15px;">What Happens Next</h3>
                          
                          <div style="margin-bottom: 15px;">
                            <strong style="color: #301710;">1. Schedule Your Strategy Session</strong><br/>
                            <span style="color: rgba(48, 23, 16, 0.7);">Click the button above to pick your preferred time.</span>
                          </div>
                          
                          <div style="margin-bottom: 15px;">
                            <strong style="color: #301710;">2. Define Your Direction</strong><br/>
                            <span style="color: rgba(48, 23, 16, 0.7);">We'll discuss your brand vision, target audience, and visual direction.</span>
                          </div>
                          
                          <div>
                            <strong style="color: #301710;">3. Receive Your Brand System</strong><br/>
                            <span style="color: rgba(48, 23, 16, 0.7);">Custom visuals delivered within 7-10 business days after strategy session.</span>
                          </div>
                        </div>
                        
                        <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                          Your project ID: <strong>${saleId}</strong>
                        </p>
                        
                        <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                          We're excited to work with you!
                        </p>
                        
                        <p style="color: #301710; line-height: 1.8;">
                          — The AVERRA Team
                        </p>
                      </div>
                      
                      <!-- Footer with Social Links -->
                      <div style="background: #301710; padding: 30px 20px; text-align: center; border-top: 1px solid rgba(220, 218, 204, 0.2);">
                        <p style="color: rgba(220, 218, 204, 0.7); font-size: 13px; margin-bottom: 20px;">
                          Questions? Reply to this email or visit <a href="https://www.averraaistudio.com" style="color: #DCDACC; text-decoration: none;">averraaistudio.com</a>
                        </p>
                        
                        <p style="color: rgba(220, 218, 204, 0.8); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 15px;">
                          Follow Us
                        </p>
                        
                        <!-- Social Media Icons -->
                        <div style="text-align: center;">
                          <!-- Instagram -->
                          <a href="https://www.instagram.com/averraaistudio" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#DCDACC"/>
                            </svg>
                          </a>
                          
                          <!-- TikTok -->
                          <a href="https://www.tiktok.com/@averraaistudio" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="#DCDACC"/>
                            </svg>
                          </a>
                        </div>
                        
                        <p style="color: rgba(220, 218, 204, 0.5); font-size: 11px; margin-top: 20px;">
                          © ${new Date().getFullYear()} AVERRA AI Model Studio. All rights reserved.
                        </p>
                      </div>
                    </div>
                  `,
                }),
              });

              const tierEmailEndTime = Date.now();
              const tierEmailDuration = (tierEmailEndTime - tierEmailStartTime) / 1000;
              
              if (emailResponse.ok) {
                const resendData = await emailResponse.json();
                console.log(`✅ Service tier email sent to: ${customerEmail}`);
                console.log(`⚡ Sent in ${tierEmailDuration.toFixed(2)} seconds`);
                console.log(`📬 Resend Email ID: ${resendData.id}`);
              } else {
                const errorData = await emailResponse.json();
                console.error("❌ Service tier email failed:", errorData);
                console.error(`⏱️ Failed after ${tierEmailDuration.toFixed(2)} seconds`);
              }
            } catch (emailError) {
              console.error("❌ Error sending service tier email:", emailError);
            }
          }
          
          // ============================================
          // EMAIL #2: DIGITAL PRODUCTS INSTANT DELIVERY
          // ============================================
          if (digitalProducts.length > 0) {
            try {
              console.log(`🚀 INSTANT DELIVERY: Sending digital products to ${customerEmail} NOW!`);
              console.log(`📦 Digital products matched by PRICE ID:`, digitalProducts.map((p: any) => `${p.productName} (x${p.quantity})`).join(', '));
              
              // Build download buttons HTML - ONE button per product (with quantity)
              const downloadButtonsHtml = digitalProducts.map((product: any) => {
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

              const productsList = digitalProducts.map((item: any) => {
                const quantityLabel = item.quantity > 1 ? ` (x${item.quantity})` : '';
                return `<li style="margin-bottom: 10px; color: #301710;">${item.productName}${quantityLabel} - $${item.price}</li>`;
              }).join('');

              const emailStartTime = Date.now();
              
              const emailResponse = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${resendApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "AVERRA Deliveries <deliveries@averraaistudio.com>",
                  to: [customerEmail],
                  subject: `Your download is ready (Order ${saleId})`,
                  html: `
                    <div style="font-family: 'Cormorant', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: #DCDACC;">
                      <!-- AVERRA Logo Header -->
                      <div style="background: #301710; padding: 30px 20px; text-align: center;">
                        <h1 style="font-family: 'Cormorant', Georgia, serif; font-size: 42px; font-weight: 300; color: #DCDACC; margin: 0; letter-spacing: 0.15em;">
                          AVERRA
                        </h1>
                        <p style="color: rgba(220, 218, 204, 0.8); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin: 10px 0 0 0;">
                          AI Model Studio
                        </p>
                      </div>
                      
                      <!-- Main Content -->
                      <div style="background: rgba(255, 255, 255, 0.95); padding: 40px; border-left: 1px solid rgba(48, 23, 16, 0.2); border-right: 1px solid rgba(48, 23, 16, 0.2);">
                        <h2 style="font-size: 24px; font-weight: 400; color: #301710; margin-bottom: 30px; text-align: center;">
                          Your Digital Products Are Ready
                        </h2>
                        
                        <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                          Hi ${customerName},
                        </p>
                        
                        <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                          Thank you for your purchase! Your digital brand visuals are ready for immediate download.
                        </p>
                        
                        <div style="background: rgba(48, 23, 16, 0.05); padding: 25px; margin: 30px 0; border-left: 3px solid #301710;">
                          <h3 style="font-size: 18px; color: #301710; margin-bottom: 15px;">Your Purchase</h3>
                          <ul style="list-style: none; padding: 0; margin: 0;">
                            ${productsList}
                          </ul>
                        </div>
                        
                        <div style="background: #301710; padding: 30px; margin: 30px 0;">
                          <h3 style="font-size: 22px; color: #DCDACC; margin-bottom: 15px; text-align: center;">📥 Download Your Files</h3>
                          
                          <p style="color: #BFBBA7; line-height: 1.8; margin-bottom: 25px; text-align: center;">
                            Click below to download your files. Each collection is a ZIP file with images and commercial license.
                          </p>
                          
                          ${downloadButtonsHtml}
                          
                          <div style="background: rgba(220, 218, 204, 0.1); padding: 20px; margin-top: 25px; border-radius: 4px;">
                            <p style="color: #DCDACC; font-size: 14px; font-weight: 600; margin-bottom: 10px;">📂 How to unzip:</p>
                            <ul style="color: #BFBBA7; font-size: 13px; line-height: 1.8; padding-left: 20px; margin: 0;">
                              <li>iPhone/iPad: Tap link → Files app → Downloads → tap ZIP to unzip</li>
                              <li>Android: Tap link → Files/Downloads → Extract</li>
                              <li>Mac: Double-click ZIP in Downloads</li>
                              <li>Windows: Right-click ZIP → Extract All</li>
                              <li>Chromebook: Files app → Downloads → Extract</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div style="background: rgba(48, 23, 16, 0.05); padding: 25px; margin: 30px 0; border-left: 3px solid #301710;">
                          <h3 style="font-size: 18px; color: #301710; margin-bottom: 15px;">📄 Commercial License Included</h3>
                          
                          <p style="color: #301710; line-height: 1.8; margin-bottom: 15px;">
                            Your purchase includes full commercial rights to use these images for:
                          </p>
                          
                          <ul style="color: rgba(48, 23, 16, 0.8); line-height: 2; padding-left: 20px;">
                            <li>Social media marketing</li>
                            <li>Website and portfolio</li>
                            <li>Print marketing materials</li>
                            <li>Client presentations</li>
                            <li>Advertising campaigns</li>
                          </ul>
                          
                          <p style="color: rgba(48, 23, 16, 0.7); font-size: 13px; margin-top: 15px;">
                            License certificate is included in the ZIP file.
                          </p>
                        </div>
                        
                        <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                          Order ID: <strong>${saleId}</strong>
                        </p>
                        
                        <p style="color: #301710; line-height: 1.8;">
                          — The AVERRA Team
                        </p>
                      </div>
                      
                      <!-- Footer -->
                      <div style="background: #301710; padding: 30px 20px; text-align: center; border-top: 1px solid rgba(220, 218, 204, 0.2);">
                        <p style="color: rgba(220, 218, 204, 0.7); font-size: 13px; margin-bottom: 0;">
                          Questions? Reach out to <a href="mailto:info@averraaistudio.com" style="color: #DCDACC; text-decoration: none;">info@averraaistudio.com</a>
                        </p>
                        
                        <p style="color: rgba(220, 218, 204, 0.5); font-size: 11px; margin-top: 20px;">
                          © ${new Date().getFullYear()} AVERRA AI Model Studio. All rights reserved.
                        </p>
                      </div>
                    </div>
                  `,
                }),
              });

              const emailEndTime = Date.now();
              const emailDuration = (emailEndTime - emailStartTime) / 1000;
              
              if (emailResponse.ok) {
                const resendData = await emailResponse.json();
                console.log(`✅ INSTANT DELIVERY SUCCESS!`);
                console.log(`📧 Digital products email sent to ${customerEmail}`);
                console.log(`⚡ Email sent in ${emailDuration.toFixed(2)} seconds`);
                console.log(`📬 Resend Email ID: ${resendData.id}`);
                console.log(`🎯 Total webhook processing time: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
              } else {
                const errorData = await emailResponse.json();
                console.error("❌ Digital products email failed:", errorData);
                console.error(`⏱️ Failed after ${emailDuration.toFixed(2)} seconds`);
              }
            } catch (emailError) {
              console.error("❌ Error sending digital products email:", emailError);
            }
          }
        }
        
        console.log(`🏁 Webhook completed in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
        
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

// Custom Deno server that bypasses Supabase auth for webhook endpoints
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // Check if this is a webhook request
  if (url.pathname.includes('/webhooks/stripe')) {
    console.log("🎯 Webhook request detected - bypassing auth requirement");
    
    // For webhook requests, we don't need the Authorization header
    // because we verify using Stripe's signature instead
    // Just pass the request directly to Hono
    return await app.fetch(req);
  }
  
  // For all other requests, pass through normally
  return await app.fetch(req);
});