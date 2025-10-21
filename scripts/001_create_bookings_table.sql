-- Create bookings table for Heavenly Soundscapes
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Booking Details
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  project_type TEXT NOT NULL,
  
  -- Selected Services (stored as JSONB for flexibility)
  selected_services JSONB NOT NULL,
  
  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Payment Status
  payment_status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Additional Information
  special_requests TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending',
  
  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert bookings (for new bookings)
CREATE POLICY "Allow public to create bookings" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow users to view their own bookings by email
CREATE POLICY "Allow users to view own bookings" ON bookings
  FOR SELECT
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Allow authenticated users (admins) to view all bookings
CREATE POLICY "Allow admins to view all bookings" ON bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
    )
  );

-- Policy: Allow authenticated users (admins) to update bookings
CREATE POLICY "Allow admins to update bookings" ON bookings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
    )
  );
