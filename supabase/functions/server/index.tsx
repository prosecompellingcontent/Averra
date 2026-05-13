import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import Stripe from "npm:stripe@20.4.1";
import { handleSendPurchaseEmail } from "./send-purchase-email.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ============================================
// EBOOK ACCESS MANAGEMENT (Inlined)
// ============================================

interface EbookAccess {
  user_id: string;
  email: string;
  stripe_customer_id: string;
  stripe_payment_id: string;
  purchase_timestamp: string;
  access_granted: boolean;
}

interface ReadingProgress {
  email: string;
  current_section: string;
  scroll_position: number;
  last_updated: string;
}

interface DownloadRecord {
  email: string;
  device: string;
  download_timestamp: string;
}

async function grantEbookAccess(data: {
  email: string;
  stripe_customer_id: string;
  stripe_payment_id: string;
}): Promise<void> {
  const accessRecord: EbookAccess = {
    user_id: crypto.randomUUID(),
    email: data.email,
    stripe_customer_id: data.stripe_customer_id,
    stripe_payment_id: data.stripe_payment_id,
    purchase_timestamp: new Date().toISOString(),
    access_granted: true,
  };

  await kv.set(`ebook_access:${data.email}`, JSON.stringify(accessRecord));
  console.log(`✅ Ebook access granted to ${data.email}`);
}

async function verifyEbookAccess(email: string): Promise<EbookAccess | null> {
  const record = await kv.get(`ebook_access:${email}`);
  if (!record) return null;

  try {
    const accessData = JSON.parse(record) as EbookAccess;
    return accessData.access_granted ? accessData : null;
  } catch (error) {
    console.error("Error parsing ebook access record:", error);
    return null;
  }
}

async function recordDownload(email: string, device: string): Promise<void> {
  const downloadRecord: DownloadRecord = {
    email,
    device,
    download_timestamp: new Date().toISOString(),
  };

  const downloadKey = `ebook_download:${email}:${Date.now()}`;
  await kv.set(downloadKey, JSON.stringify(downloadRecord));
  console.log(`📥 Download recorded for ${email} on ${device}`);
}

async function saveReadingProgress(data: {
  email: string;
  current_section: string;
  scroll_position: number;
}): Promise<void> {
  const progressRecord: ReadingProgress = {
    email: data.email,
    current_section: data.current_section,
    scroll_position: data.scroll_position,
    last_updated: new Date().toISOString(),
  };

  await kv.set(`ebook_progress:${data.email}`, JSON.stringify(progressRecord));
  console.log(`💾 Progress saved for ${data.email}: ${data.current_section} @ ${data.scroll_position}px`);
}

async function getReadingProgress(email: string): Promise<ReadingProgress | null> {
  const record = await kv.get(`ebook_progress:${email}`);
  if (!record) return null;

  try {
    return JSON.parse(record) as ReadingProgress;
  } catch (error) {
    console.error("Error parsing reading progress:", error);
    return null;
  }
}

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
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.1"
  });
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

// Save diagnostic result from AVERRA Diagnostic System
app.post("/make-server-61755bec/save-diagnostic-result", async (c) => {
  try {
    const resultData = await c.req.json();

    const {
      session_id,
      primary_result,
      secondary_result,
      question_1_answer,
      question_2_answer,
      question_3_answer,
      question_4_answer,
      question_5_answer,
      question_6_answer,
      question_7_answer,
      question_8_answer,
      question_9_answer,
      question_10_answer,
      question_11_answer,
      question_12_answer,
      question_13_answer,
      question_14_answer,
      question_15_answer,
      traffic_source,
      device_type
    } = resultData;

    if (!session_id || !primary_result) {
      return c.json({ error: "Missing required fields: session_id and primary_result" }, 400);
    }

    // Store diagnostic result with session_id as key
    const diagnosticKey = `diagnostic_result_${session_id}`;

    await kv.set(diagnosticKey, {
      created_at: new Date().toISOString(),
      session_id,
      primary_result,
      secondary_result,
      question_1_answer,
      question_2_answer,
      question_3_answer,
      question_4_answer,
      question_5_answer,
      question_6_answer,
      question_7_answer,
      question_8_answer,
      question_9_answer,
      question_10_answer,
      question_11_answer,
      question_12_answer,
      question_13_answer,
      question_14_answer,
      question_15_answer,
      ebook_cta_clicked: false,
      ebook_purchased: false,
      traffic_source: traffic_source || null,
      device_type: device_type || null,
      type: "diagnostic_result"
    });

    console.log("Diagnostic result saved:", diagnosticKey, "Primary:", primary_result, "Secondary:", secondary_result);

    return c.json({ success: true, session_id });
  } catch (error) {
    console.error("Error saving diagnostic result:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to save diagnostic result" },
      500
    );
  }
});

// Update diagnostic result CTA click status
app.put("/make-server-61755bec/diagnostic-result/:sessionId/cta-click", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");

    if (!sessionId) {
      return c.json({ error: "Missing session_id parameter" }, 400);
    }

    const diagnosticKey = `diagnostic_result_${sessionId}`;

    // Get existing result
    const existingResult = await kv.get(diagnosticKey);

    if (!existingResult) {
      return c.json({ error: "Diagnostic result not found" }, 404);
    }

    // Update with CTA clicked flag
    await kv.set(diagnosticKey, {
      ...existingResult,
      ebook_cta_clicked: true,
      cta_clicked_at: new Date().toISOString()
    });

    console.log("Diagnostic CTA click tracked:", sessionId);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating diagnostic CTA click:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to update CTA click" },
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

// Get diagnostic analytics for admin dashboard
app.get("/make-server-61755bec/diagnostic-analytics", async (c) => {
  try {
    // Get all diagnostic results
    const diagnosticResults = await kv.getByPrefix("diagnostic_result_");

    // Filter to only diagnostic result records
    const results = diagnosticResults.filter((item: any) => item.type === "diagnostic_result");

    // Calculate primary diagnosis counts
    const primaryCounts: { [key: string]: number } = {};
    results.forEach((result: any) => {
      const primary = result.primary_result;
      primaryCounts[primary] = (primaryCounts[primary] || 0) + 1;
    });

    // Calculate secondary diagnosis counts
    const secondaryCounts: { [key: string]: number } = {};
    results.forEach((result: any) => {
      const secondary = result.secondary_result;
      if (secondary) {
        secondaryCounts[secondary] = (secondaryCounts[secondary] || 0) + 1;
      }
    });

    // Calculate answer patterns for each question
    const questionAnswers: { [key: string]: { [key: string]: number } } = {};
    for (let i = 1; i <= 15; i++) {
      questionAnswers[`question_${i}`] = {};
    }

    results.forEach((result: any) => {
      for (let i = 1; i <= 15; i++) {
        const answerKey = `question_${i}_answer`;
        const answer = result[answerKey];
        if (answer) {
          questionAnswers[`question_${i}`][answer] = (questionAnswers[`question_${i}`][answer] || 0) + 1;
        }
      }
    });

    // Calculate conversion metrics
    const totalResults = results.length;
    const ctaClicks = results.filter((r: any) => r.ebook_cta_clicked).length;
    const purchases = results.filter((r: any) => r.ebook_purchased).length;

    const ctaClickRate = totalResults > 0 ? (ctaClicks / totalResults) * 100 : 0;
    const purchaseRate = totalResults > 0 ? (purchases / totalResults) * 100 : 0;

    // Top diagnosis combinations (primary + secondary)
    const combinationCounts: { [key: string]: number } = {};
    results.forEach((result: any) => {
      const combo = `${result.primary_result}+${result.secondary_result || 'none'}`;
      combinationCounts[combo] = (combinationCounts[combo] || 0) + 1;
    });

    // Sort combinations by frequency
    const topCombinations = Object.entries(combinationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([combo, count]) => ({ combination: combo, count }));

    // Device type breakdown
    const deviceCounts: { [key: string]: number } = {};
    results.forEach((result: any) => {
      const device = result.device_type || 'unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    console.log("Diagnostic analytics generated for", totalResults, "results");

    return c.json({
      totalCompletions: totalResults,
      completionRate: 100, // This would need quiz start tracking to calculate accurately
      primaryDiagnoses: primaryCounts,
      secondaryDiagnoses: secondaryCounts,
      topCombinations,
      questionAnswerPatterns: questionAnswers,
      conversionMetrics: {
        totalResults,
        ctaClicks,
        ctaClickRate: ctaClickRate.toFixed(2),
        purchases,
        purchaseRate: purchaseRate.toFixed(2)
      },
      deviceBreakdown: deviceCounts,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error generating diagnostic analytics:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to generate diagnostic analytics" },
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

// ============================================
// CREATE USER WITH AUTO-CONFIRMED EMAIL
// ============================================
app.post("/make-server-61755bec/create-user", async (c) => {
  try {
    const { email, password, fullName, membershipType, isFounderPricing } = await c.req.json();

    if (!email || !password || !fullName || !membershipType) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("Creating user with auto-confirmed email:", email);

    // Create user with admin API (auto-confirms email)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError) {
      console.error("User creation error:", authError);
      return c.json({ error: authError.message }, 400);
    }

    if (!authData.user) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    console.log("User created successfully:", authData.user.id);

    // Create profile in database
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        membership_type: membershipType,
        membership_status: 'active',
        founder_pricing: isFounderPricing || false,
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return c.json({ error: "Failed to create profile: " + profileError.message }, 500);
    }

    console.log("Profile created successfully");

    return c.json({
      success: true,
      userId: authData.user.id,
      email: authData.user.email,
    });
  } catch (error) {
    console.error("Error in create-user endpoint:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "User creation failed" },
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
        
        // ============================================
        // MANDATORY DEBUG LOGGING (VERIFY LINE ITEMS)
        // ============================================
        console.log("SESSION ID:", session.id);
        console.log("LINE ITEMS COUNT:", lineItems.data.length);
        console.log("LINE ITEM PRICE IDS:", lineItems.data.map((li: any) => li.price?.id));
        console.log("LINE ITEM QUANTITIES:", lineItems.data.map((li: any) => li.quantity));
        
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
        // THE GOLD STANDARD EBOOK ACCESS GRANT
        // ============================================

        // Check if The Gold Standard was purchased
        const goldStandardItem = items.find((item: any) =>
          item.name.includes('The Gold Standard') ||
          item.name.includes('gold-standard-ebook') ||
          item.name.toLowerCase().includes('gold standard')
        );

        if (goldStandardItem && customerEmail !== "N/A") {
          try {
            console.log("📚 The Gold Standard ebook purchased - granting permanent access");

            await grantEbookAccess({
              email: customerEmail,
              stripe_customer_id: session.customer as string || '',
              stripe_payment_id: session.payment_intent as string || session.id
            });

            console.log("✅ Permanent ebook access granted to:", customerEmail);
          } catch (ebookError) {
            console.error("❌ Error granting ebook access:", ebookError);
          }
        }

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
            item.name.includes('Alignment System') ||
            item.name.includes('Brand Alignment') ||
            // Legacy support for old tier names
            item.name.includes('Essentials') ||
            item.name.includes('Signature') ||
            item.name.includes('Muse')
          );
          
          // Match digital products by PRICE ID (stable identifier)
          console.log("🔍 Matching digital products by PRICE ID...");
          
          const digitalProducts = items
            .filter((item: any) => DIGITAL_PRODUCT_MAP[item.priceId])
            .map((item: any) => ({
              ...item,
              productName: DIGITAL_PRODUCT_MAP[item.priceId].name,
              downloadUrl: DIGITAL_PRODUCT_MAP[item.priceId].url
            }));
          
          // Log matched and unmatched products
          const unmatchedPriceIds = items
            .filter((item: any) => !DIGITAL_PRODUCT_MAP[item.priceId] && item.priceId)
            .map((item: any) => item.priceId);
          
          if (digitalProducts.length > 0) {
            console.log(`✅ MATCHED ${digitalProducts.length} digital product(s):`);
            digitalProducts.forEach((p: any) => {
              console.log(`   - ${p.priceId} → ${p.productName} (x${p.quantity})`);
            });
          } else {
            console.log("⚠️ NO digital products matched!");
          }
          
          if (unmatchedPriceIds.length > 0) {
            console.warn(`⚠️ UNMATCHED PRICE IDs:`, unmatchedPriceIds.join(', '));
          }
          
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
          // EMAIL #2: THE GOLD STANDARD EBOOK ACCESS
          // ============================================
          if (goldStandardItem) {
            try {
              console.log(`📚 EBOOK ACCESS: Sending Gold Standard access email to ${customerEmail} NOW!`);
              const ebookEmailStartTime = Date.now();

              const origin = Deno.env.get("PUBLIC_SITE_URL") || "https://averraaistudio.com";

              const emailResponse = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${resendApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "AVERRA Studio <hello@averraaistudio.com>",
                  to: [customerEmail],
                  subject: "Your Gold Standard Access is Ready ✨",
                  html: `
                    <div style="font-family: 'Lora', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: #fdf5f7;">
                      <!-- AVERRA Header -->
                      <div style="background: #251218; padding: 40px 20px; text-align: center;">
                        <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 300; color: #fdf5f7; margin: 0; letter-spacing: 0.15em;">
                          AVERRA
                        </h1>
                        <p style="color: rgba(253, 245, 247, 0.7); font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; margin: 12px 0 0 0; font-family: 'Montserrat', sans-serif;">
                          Building Beyond The Chair
                        </p>
                      </div>

                      <!-- Main Content -->
                      <div style="background: #ffffff; padding: 50px 40px; border-left: 1px solid rgba(37, 18, 24, 0.1); border-right: 1px solid rgba(37, 18, 24, 0.1);">
                        <h2 style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 300; color: #251218; margin-bottom: 30px; text-align: center; line-height: 1.3;">
                          Welcome to<br/>The Gold Standard
                        </h2>

                        <p style="color: #251218; line-height: 1.9; margin-bottom: 24px; font-size: 16px;">
                          Hi ${customerName},
                        </p>

                        <p style="color: #251218; line-height: 1.9; margin-bottom: 24px; font-size: 16px;">
                          Your payment has been confirmed. You now have permanent access to The Gold Standard: Building Beyond The Chair.
                        </p>

                        <p style="color: #6b585d; line-height: 1.9; margin-bottom: 32px; font-size: 15px; font-style: italic;">
                          This is not just an ebook. It's the complete roadmap for understanding why your business feels the way it does—and what it takes to build beyond it.
                        </p>

                        <!-- Action Buttons -->
                        <div style="text-align: center; margin: 40px 0;">
                          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
                            <tr>
                              <td style="padding: 8px;">
                                <a href="https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/ebooks/the-gold-standard.pdf"
                                   style="display: inline-block; padding: 18px 42px; background: linear-gradient(135deg, rgba(201,150,158,0.9) 0%, rgba(201,150,158,0.7) 100%); color: #fdf5f7; text-decoration: none; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; font-family: 'Montserrat', sans-serif; font-weight: 500; border: 1px solid rgba(201,150,158,0.4);">
                                  Download PDF
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px;">
                                <a href="${origin}/checkout/success"
                                   style="display: inline-block; padding: 16px 38px; background: transparent; color: #251218; text-decoration: none; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; font-family: 'Montserrat', sans-serif; font-weight: 400; border: 1.5px solid #251218;">
                                  Return to AVERRA
                                </a>
                              </td>
                            </tr>
                          </table>
                        </div>

                        <div style="background: rgba(201,150,158,0.08); padding: 30px; margin: 40px 0; border-left: 3px solid #c9969e;">
                          <h3 style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; color: #251218; margin-bottom: 18px;">
                            Your Access Includes
                          </h3>

                          <ul style="color: #251218; line-height: 2; padding-left: 24px; margin: 0; font-size: 15px;">
                            <li><strong>Cross-Device Access</strong> — Read from any browser, phone, tablet, or desktop</li>
                            <li><strong>Auto-Saved Progress</strong> — Your chapter and scroll position sync across all devices</li>
                            <li><strong>Download PDF</strong> — Click "Download PDF" above to save a permanent copy to your device</li>
                            <li><strong>Permanent Lifetime Access</strong> — No expiration, no subscription, it's yours forever</li>
                            <li><strong>Premium Reading Experience</strong> — Beautiful typography, smooth navigation, audio playback</li>
                          </ul>
                        </div>

                        <div style="background: rgba(37,18,24,0.03); padding: 28px; margin: 30px 0; border-radius: 4px;">
                          <p style="color: #251218; font-size: 14px; font-weight: 600; margin-bottom: 16px;">
                            📖 How to Access Your Ebook
                          </p>
                          <p style="color: #6b585d; font-size: 14px; line-height: 1.9; margin: 0 0 12px 0;">
                            <strong>Download PDF:</strong> Click "Download PDF" above to save the complete ebook to your device
                          </p>
                          <p style="color: #6b585d; font-size: 14px; line-height: 1.9; margin: 0 0 12px 0;">
                            <strong>Read Online:</strong> Click "Return to AVERRA" then "Read Now" for the immersive web experience
                          </p>
                          <p style="color: #6b585d; font-size: 14px; line-height: 1.9; margin: 0 0 12px 0;">
                            <strong>Listen Aloud:</strong> Access the audio narration feature from your AVERRA library
                          </p>
                          <p style="color: #6b585d; font-size: 14px; line-height: 1.9; margin: 0;">
                            <strong>Returning Later:</strong> Visit ${origin}/checkout/success to access all reading options
                          </p>
                        </div>

                        <p style="color: #251218; line-height: 1.9; margin-top: 40px; font-size: 15px;">
                          Your business was never supposed to feel this heavy. This is how you change that.
                        </p>

                        <p style="color: #251218; line-height: 1.9; margin-top: 24px;">
                          — The AVERRA Team
                        </p>
                      </div>

                      <!-- Footer -->
                      <div style="background: #251218; padding: 30px 20px; text-align: center; border-top: 1px solid rgba(253, 245, 247, 0.1);">
                        <p style="color: rgba(253, 245, 247, 0.6); font-size: 13px; margin-bottom: 0;">
                          Questions? Reply to this email or visit <a href="${origin}" style="color: #c9969e; text-decoration: none;">averraaistudio.com</a>
                        </p>

                        <p style="color: rgba(253, 245, 247, 0.4); font-size: 11px; margin-top: 20px;">
                          © ${new Date().getFullYear()} AVERRA. All rights reserved.
                        </p>
                      </div>
                    </div>
                  `,
                }),
              });

              const ebookEmailEndTime = Date.now();
              const ebookEmailDuration = (ebookEmailEndTime - ebookEmailStartTime) / 1000;

              if (emailResponse.ok) {
                const resendData = await emailResponse.json();
                console.log(`✅ Gold Standard access email sent to: ${customerEmail}`);
                console.log(`⚡ Sent in ${ebookEmailDuration.toFixed(2)} seconds`);
                console.log(`📬 Resend Email ID: ${resendData.id}`);
              } else {
                const errorData = await emailResponse.json();
                console.error("❌ Gold Standard email failed:", errorData);
                console.error(`⏱️ Failed after ${ebookEmailDuration.toFixed(2)} seconds`);
              }
            } catch (emailError) {
              console.error("❌ Error sending Gold Standard email:", emailError);
            }
          }

          // ============================================
          // EMAIL #3: OTHER DIGITAL PRODUCTS INSTANT DELIVERY
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
              
              console.log(`✅ Generated downloadButtonsHtml: ${downloadButtonsHtml.length} characters`);
              
              if (downloadButtonsHtml.length === 0) {
                console.error("❌ WARNING: downloadButtonsHtml is EMPTY despite having digitalProducts!");
              }

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
                  subject: "DIGITAL DELIVERY TEST 123",
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
                        <p style="color: red; font-weight: bold; text-align: center; margin: 0 0 20px 0; font-size: 18px;">DOWNLOADTEST123</p>
                        
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
          } else {
            // FAILSAFE: Check if there were non-service items that didn't match
            const possibleDigitalProducts = items.filter((item: any) => 
              !item.name.includes('Essentials') && 
              !item.name.includes('Signature') && 
              !item.name.includes('Muse')
            );
            
            if (possibleDigitalProducts.length > 0) {
              console.warn("⚠️ FAILSAFE TRIGGERED: Items exist but NO digital products matched!");
              console.warn("⚠️ Possible digital products that didn't match:", possibleDigitalProducts.map((p: any) => `${p.name} (Price ID: ${p.priceId})`).join(', '));
              
              try {
                // Send failsafe email
                await fetch("https://api.resend.com/emails", {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${resendApiKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    from: "AVERRA Deliveries <deliveries@averraaistudio.com>",
                    to: [customerEmail],
                    subject: "Your AVERRA Download (Processing)",
                    html: `
                      <div style="font-family: 'Cormorant', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #F7F3EF;">
                        <h1 style="color: #301710; font-size: 32px; margin-bottom: 20px;">Thank You for Your Purchase</h1>
                        
                        <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                          Hi ${customerName},
                        </p>
                        
                        <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                          We could not automatically match your download. Reply to this email and we'll send it immediately.
                        </p>
                        
                        <p style="color: #301710; line-height: 1.8; margin-bottom: 20px;">
                          Order ID: <strong>${saleId}</strong>
                        </p>
                        
                        <p style="color: #301710; line-height: 1.8;">
                          Questions? Reply to <a href="mailto:info@averraaistudio.com" style="color: #654331;">info@averraaistudio.com</a>
                        </p>
                      </div>
                    `,
                  }),
                });
                
                console.log("✅ Failsafe email sent to:", customerEmail);
              } catch (failsafeError) {
                console.error("❌ Error sending failsafe email:", failsafeError);
              }
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

// ============================================
// ADMIN SETUP AND MANAGEMENT ENDPOINTS
// ============================================

// Set admin status for a user (run this once to make your account admin)
app.post("/make-server-61755bec/admin/set-admin", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First, ensure the is_admin column exists by trying to update
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('email', email);

    if (updateError) {
      console.error("Error setting admin status:", updateError);
      return c.json({ error: "Failed to set admin status: " + updateError.message }, 500);
    }

    console.log("Admin status set for:", email);

    return c.json({ success: true, email });
  } catch (error) {
    console.error("Error in set-admin endpoint:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Admin setup failed" },
      500
    );
  }
});

// ============================================
// ADMIN MESSAGING ENDPOINTS
// ============================================

// Send direct message to a member
app.post("/make-server-61755bec/admin/send-message", async (c) => {
  try {
    const { recipientId, message, senderId } = await c.req.json();

    if (!recipientId || !message || !senderId) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create message in database (you'll need to create a messages table)
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content: message,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return c.json({ error: "Failed to send message" }, 500);
    }

    console.log("Message sent:", data.id);

    return c.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error("Error in send-message endpoint:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Message send failed" },
      500
    );
  }
});

// Send notification to all members
app.post("/make-server-61755bec/admin/send-notification", async (c) => {
  try {
    const { title, message, senderId } = await c.req.json();

    if (!title || !message || !senderId) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all members
    const { data: members, error: membersError } = await supabase
      .from('profiles')
      .select('id');

    if (membersError) {
      console.error("Error loading members:", membersError);
      return c.json({ error: "Failed to load members" }, 500);
    }

    // Create notification for each member
    const notifications = members?.map(member => ({
      user_id: member.id,
      title,
      message,
      created_at: new Date().toISOString(),
      read: false,
    })) || [];

    const { error: notifError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (notifError) {
      console.error("Error creating notifications:", notifError);
      return c.json({ error: "Failed to create notifications" }, 500);
    }

    console.log("Notifications sent to", members?.length || 0, "members");

    return c.json({ success: true, recipientCount: members?.length || 0 });
  } catch (error) {
    console.error("Error in send-notification endpoint:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Notification send failed" },
      500
    );
  }
});

// Send mass email to members
app.post("/make-server-61755bec/admin/send-mass-email", async (c) => {
  try {
    const { subject, htmlContent, membershipType } = await c.req.json();

    if (!subject || !htmlContent) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get members to email
    let query = supabase.from('profiles').select('email');

    if (membershipType && membershipType !== 'all') {
      query = query.eq('membership_type', membershipType);
    }

    const { data: members, error: membersError } = await query;

    if (membersError) {
      console.error("Error loading members:", membersError);
      return c.json({ error: "Failed to load members" }, 500);
    }

    const emails = members?.map(m => m.email).filter(Boolean) || [];

    if (emails.length === 0) {
      return c.json({ error: "No members found" }, 400);
    }

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return c.json({ error: "Resend API key not configured" }, 500);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AVERRA <hello@averraaistudio.com>",
        to: emails,
        subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error sending mass email via Resend:", errorData);
      return c.json({ error: "Failed to send email" }, 500);
    }

    console.log("Mass email sent to", emails.length, "members");

    return c.json({ success: true, recipientCount: emails.length });
  } catch (error) {
    console.error("Error in send-mass-email endpoint:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Mass email send failed" },
      500
    );
  }
});

// ============================================
// EBOOK ACCESS MANAGEMENT ENDPOINTS
// ============================================

// Verify ebook access by email
app.post("/make-server-61755bec/ebook/verify-access", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: "Email required" }, 400);
    }

    const access = await verifyEbookAccess(email);

    if (access) {
      return c.json({
        hasAccess: true,
        user_id: access.user_id,
        email: access.email,
        purchase_date: access.purchase_timestamp
      });
    }

    return c.json({ hasAccess: false }, 200);
  } catch (error) {
    console.error("Error verifying ebook access:", error);
    return c.json({ error: "Access verification failed" }, 500);
  }
});

// Record ebook download
app.post("/make-server-61755bec/ebook/record-download", async (c) => {
  try {
    const { email, device } = await c.req.json();

    if (!email) {
      return c.json({ error: "Email required" }, 400);
    }

    await recordDownload(email, device || "unknown");

    return c.json({ success: true });
  } catch (error) {
    console.error("Error recording download:", error);
    return c.json({ error: "Failed to record download" }, 500);
  }
});

// Save reading progress
app.post("/make-server-61755bec/ebook/save-progress", async (c) => {
  try {
    const progressData = await c.req.json();

    if (!progressData.email) {
      return c.json({ error: "Email required" }, 400);
    }

    await saveReadingProgress(progressData);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving reading progress:", error);
    return c.json({ error: "Failed to save progress" }, 500);
  }
});

// Get reading progress
app.get("/make-server-61755bec/ebook/progress/:email", async (c) => {
  try {
    const email = c.req.param("email");

    if (!email) {
      return c.json({ error: "Email required" }, 400);
    }

    const progress = await getReadingProgress(email);

    return c.json({ progress: progress || null });
  } catch (error) {
    console.error("Error getting reading progress:", error);
    return c.json({ error: "Failed to get progress" }, 500);
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