-- Create brand_intakes table
CREATE TABLE IF NOT EXISTS brand_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Service tier
  tier TEXT NOT NULL,
  
  -- Customer information
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  instagram_handle TEXT,
  website TEXT,
  
  -- Business details
  services TEXT NOT NULL,
  business_stage TEXT NOT NULL,
  brand_misalignment TEXT NOT NULL,
  brand_feel TEXT NOT NULL,
  ideal_client TEXT NOT NULL,
  plans_6_12_months TEXT NOT NULL,
  ai_stance TEXT NOT NULL,
  urgent_notes TEXT,
  
  -- Payment tracking
  payment_status TEXT DEFAULT 'submitted' CHECK (payment_status IN ('submitted', 'paid', 'failed')),
  stripe_session_id TEXT,
  stripe_customer_email TEXT
);

-- Create index on payment status for faster queries
CREATE INDEX IF NOT EXISTS idx_brand_intakes_payment_status ON brand_intakes(payment_status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_brand_intakes_created_at ON brand_intakes(created_at DESC);

-- Create index on stripe_session_id for payment webhook lookup
CREATE INDEX IF NOT EXISTS idx_brand_intakes_stripe_session_id ON brand_intakes(stripe_session_id);
