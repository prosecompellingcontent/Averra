import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("DOWNLOADS HEALTH CHECK", new Date().toISOString());

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase credentials not configured");
      return res.status(500).json({ 
        status: 'error',
        error: 'Server configuration error',
        details: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing'
      });
    }

    console.log("Testing Supabase connection...");
    
    const queryUrl = `${supabaseUrl}/rest/v1/orders?select=session_id&limit=1`;
    const sanitizedUrl = queryUrl.replace(supabaseUrl, 'SUPABASE_URL');
    console.log("Query URL:", sanitizedUrl);
    
    const supabaseResponse = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      }
    });

    console.log("Supabase response status:", supabaseResponse.status);

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      console.error("SUPABASE_HEALTH_CHECK_FAIL", {
        status: supabaseResponse.status,
        statusText: supabaseResponse.statusText,
        body: errorText,
        url: sanitizedUrl
      });
      return res.status(500).json({ 
        status: 'error',
        error: 'Supabase query failed',
        supabase_status: supabaseResponse.status,
        detail: errorText 
      });
    }

    const data = await supabaseResponse.json();
    console.log("Supabase connection successful");

    return res.status(200).json({
      status: 'ok',
      message: 'Supabase connection successful',
      table: 'orders',
      records_found: Array.isArray(data) ? data.length : 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Health check error:", error);
    return res.status(500).json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Health check failed' 
    });
  }
}
