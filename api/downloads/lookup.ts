// FILE: /api/downloads/lookup.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.Stripe_Secret_Key || '', {
  apiVersion: '2026-02-25.clover',
});

export const config = {
  api: {
    bodyParser: true,
  },
};

type ProductInfo = { name: string; zipUrl: string };

const PRODUCT_MAP: Record<string, ProductInfo> = {
  // Digital productId -> ZIP URL (primary match)
  prod_U4tjELgIEdNp8R: {
    name: 'The Map Pack',
    zipUrl:
      'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-map-pack/the-map-pack.zip',
  },
  prod_U4tj3TpmVuEi6v: {
    name: 'The Base Bundle',
    zipUrl:
      'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-base-bundle/the-base-bundle.zip',
  },
  prod_U4tjFfvIwptjfn: {
    name: 'The Cuticle Collection',
    zipUrl:
      'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-cuticle-collection/the-cuticle-collection.zip',
  },
  prod_U4tjvZqmdppfZE: {
    name: 'You Glow Girl Bundle',
    zipUrl:
      'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/you-glow-girl-bundle/you-glow-girl-bundle.zip',
  },
  prod_UAlmvz04pAYbco: {
    name: 'Fresh Out The Chair',
    zipUrl:
      'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/fresh-out-the-chair/fresh-out-the-chair.zip',
  },
  prod_UAlnkF1MY2zjzW: {
    name: 'The Lash Collection',
    zipUrl:
      'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip',
  },
};

// PriceId fallback map (covers older order rows and Stripe price changes)
const PRICE_MAP: Record<string, ProductInfo> = {
  // Map Pack
  price_1T6jvhKLeJj1g28UvIxFbI3O: PRODUCT_MAP.prod_U4tjELgIEdNp8R,

  // Base Bundle
  price_1T6jvrKLeJj1g28URaMIEaL3: PRODUCT_MAP.prod_U4tj3TpmVuEi6v,

  // Cuticle Collection
  price_1T6jvyKLeJj1g28UVyqmrr5U: PRODUCT_MAP.prod_U4tjFfvIwptjfn,

  // You Glow Girl Bundle
  price_1T6jw5KLeJj1g28UcpqJcnvL: PRODUCT_MAP.prod_U4tjvZqmdppfZE,

  // Fresh Out The Chair
  price_1TCQF9KLeJj1g28Ui7ESZUAF: PRODUCT_MAP.prod_UAlmvz04pAYbco,

  // Lash Collection (include both known price IDs from your history/logs)
  price_1TCQGHKLeJj1g28UJqHVf7wl: PRODUCT_MAP.prod_UAlnkF1MY2zjzW,
  price_1TDI8QKLeJj1g28UjrrtR6In: PRODUCT_MAP.prod_UAlnkF1MY2zjzW,
};

function normalizeEmail(email: unknown): string {
  return String(email ?? '').trim().toLowerCase();
}

function safeQty(n: unknown): number {
  const v = Number(n ?? 1);
  return Number.isFinite(v) && v > 0 ? v : 1;
}

function getProductId(item: any): string | null {
  return (item?.productId ?? item?.product_id ?? null) ? String(item.productId ?? item.product_id) : null;
}

function getPriceId(item: any): string | null {
  return (item?.priceId ?? item?.price_id ?? null) ? String(item.priceId ?? item.price_id) : null;
}

function matchDigital(item: any): ProductInfo | null {
  const prodId = getProductId(item);
  if (prodId && PRODUCT_MAP[prodId]) return PRODUCT_MAP[prodId];

  const priceId = getPriceId(item);
  if (priceId && PRICE_MAP[priceId]) return PRICE_MAP[priceId];

  return null;
}

function buildDownloadsFromItems(items: any[]): Array<{ name: string; quantity: number; zipUrl: string }> {
  const acc = new Map<string, { name: string; quantity: number; zipUrl: string }>();

  for (const item of items) {
    const info = matchDigital(item);
    if (!info) continue;

    const qty = safeQty(item?.quantity);
    const existing = acc.get(info.zipUrl);
    if (existing) existing.quantity += qty;
    else acc.set(info.zipUrl, { name: info.name, quantity: qty, zipUrl: info.zipUrl });
  }

  return Array.from(acc.values());
}

async function supabaseSelectOrder(params: {
  supabaseUrl: string;
  supabaseServiceKey: string;
  sessionId: string;
}) {
  const { supabaseUrl, supabaseServiceKey, sessionId } = params;
  const queryUrl = `${supabaseUrl}/rest/v1/orders?session_id=eq.${encodeURIComponent(
    sessionId
  )}&select=session_id,customer_email,customer_name,items,has_service`;

  const supabaseResponse = await fetch(queryUrl, {
    method: 'GET',
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
    },
  });

  return { queryUrl, supabaseResponse };
}

async function supabaseUpsertOrder(params: {
  supabaseUrl: string;
  supabaseServiceKey: string;
  payload: any;
}) {
  const { supabaseUrl, supabaseServiceKey, payload } = params;

  // Upsert by session_id so resends overwrite the row
  const upsertUrl = `${supabaseUrl}/rest/v1/orders?on_conflict=session_id`;

  const r = await fetch(upsertUrl, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(payload),
  });

  return r;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('DOWNLOAD LOOKUP REQUEST', new Date().toISOString());

  try {
    const { session_id, email } = req.body ?? {};
    const sessionId = String(session_id ?? '').trim();
    const providedEmail = normalizeEmail(email);

    if (!sessionId) return res.status(400).json({ error: 'session_id is required' });
    if (!providedEmail) return res.status(400).json({ error: 'email is required' });

    console.log('Lookup for email:', providedEmail);
    console.log('Session ID:', sessionId);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('Checking Supabase for existing order record...');

    const { queryUrl, supabaseResponse } = await supabaseSelectOrder({
      supabaseUrl,
      supabaseServiceKey,
      sessionId,
    });

    const sanitizedUrl = queryUrl.replace(supabaseUrl, 'SUPABASE_URL');
    console.log('Query URL:', sanitizedUrl);
    console.log('Supabase response status:', supabaseResponse.status);

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      console.error('SUPABASE_REST_FAIL', {
        status: supabaseResponse.status,
        statusText: supabaseResponse.statusText,
        body: errorText,
        url: sanitizedUrl,
      });
      return res.status(500).json({
        error: 'Supabase query failed',
        status: supabaseResponse.status,
        detail: errorText,
      });
    }

    const ordersArray = (await supabaseResponse.json()) as any[];
    let orderData = ordersArray?.[0] ?? null;

    // Stripe fallback (if order not in DB)
    if (!orderData) {
      console.log('No order found in Supabase, fetching from Stripe...');

      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) return res.status(404).json({ error: 'Order not found' });

        const stripeEmail = normalizeEmail(session.customer_details?.email);
        console.log('Stripe session retrieved. Email:', stripeEmail);

        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
          limit: 100,
          expand: ['data.price.product'],
        });

        const items = lineItems.data.map((item: any) => {
          const productId =
            typeof item.price?.product === 'object' ? item.price.product.id : item.price?.product ?? null;

          return {
            productId,
            priceId: item.price?.id ?? null,
            name:
              item.description ||
              (typeof item.price?.product === 'object' ? item.price.product.name : 'Unknown Product'),
            quantity: item.quantity ?? 1,
            price: (Number(item.amount_total ?? item.amount_subtotal ?? 0) / 100) || 0,
          };
        });

        console.log('Line items:', JSON.stringify(items, null, 2));

        const hasDigital = items.some((it: any) => {
          const pid = getProductId(it);
          const prid = getPriceId(it);
          return Boolean((pid && PRODUCT_MAP[pid]) || (prid && PRICE_MAP[prid]));
        });

        // Keep your existing service heuristic (unchanged)
        const hasService = items.some((it: any) => {
          const n = String(it?.name ?? '').toLowerCase();
          return n.includes('averra') && (n.includes('essentials') || n.includes('signature') || n.includes('muse'));
        });

        const upsertPayload = {
          session_id: sessionId,
          customer_email: stripeEmail || providedEmail,
          customer_name: session.customer_details?.name || 'Customer',
          items,
          has_digital: hasDigital,
          has_service: hasService,
          amount_total: session.amount_total ?? null,
          created_at: new Date().toISOString(),
        };

        const insertResponse = await supabaseUpsertOrder({
          supabaseUrl,
          supabaseServiceKey,
          payload: upsertPayload,
        });

        if (!insertResponse.ok) {
          const insertError = await insertResponse.text();
          console.error('Error storing order (upsert):', insertResponse.status, insertError);
        } else {
          const inserted = (await insertResponse.json()) as any[];
          orderData = inserted?.[0] ?? null;
          console.log('Order upserted in Supabase');
        }
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        return res.status(404).json({ error: 'Order not found' });
      }
    }

    if (!orderData) return res.status(404).json({ error: 'Order not found' });

    const orderEmail = normalizeEmail(orderData.customer_email);
    console.log('Email verification:', { orderEmail, providedEmail });

    if (!orderEmail || orderEmail !== providedEmail) {
      return res.status(403).json({ error: 'Email does not match order' });
    }

    const itemsArray = Array.isArray(orderData.items) ? orderData.items : [];
    const downloads = buildDownloadsFromItems(itemsArray);

    console.log(`Matched ${downloads.length} digital products`);
    console.log(
      'Product IDs found in items:',
      itemsArray.map((i: any) => getProductId(i) || 'NO_PRODUCT_ID')
    );
    console.log(
      'Price IDs found in items:',
      itemsArray.map((i: any) => getPriceId(i) || 'NO_PRICE_ID')
    );
    console.log('Downloads array:', JSON.stringify(downloads, null, 2));

    return res.status(200).json({
      customer_name: orderData.customer_name || 'Customer',
      downloads,
      has_service: Boolean(orderData.has_service),
    });
  } catch (error) {
    console.error('downloads/lookup error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  } finally {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}
