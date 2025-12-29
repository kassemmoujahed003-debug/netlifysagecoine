-- Migration: Create market_intelligence table
-- This table stores market news items with impact analysis for the Market Intelligence section

CREATE TABLE IF NOT EXISTS market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  impact TEXT NOT NULL CHECK (impact IN ('High', 'Medium', 'Low')),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  explanation TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_market_intelligence_active ON market_intelligence(is_active);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_display_order ON market_intelligence(display_order);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_date ON market_intelligence(date DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_market_intelligence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_market_intelligence_updated_at
  BEFORE UPDATE ON market_intelligence
  FOR EACH ROW
  EXECUTE FUNCTION update_market_intelligence_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read active items
CREATE POLICY "Public can read active market intelligence"
  ON market_intelligence
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users with admin role can do everything
CREATE POLICY "Admins can manage market intelligence"
  ON market_intelligence
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.user_type = 'admin' OR users.is_admin = true)
    )
  );

-- Insert some sample data (optional - can be removed)
INSERT INTO market_intelligence (title, impact, date, description, explanation, display_order, is_active) VALUES
  ('Federal Reserve Interest Rate Decision', 'High', '2024-01-15', 'Fed announces 25 basis point rate cut, signaling dovish monetary policy shift.', 'This rate cut typically weakens the USD as lower interest rates reduce foreign investment appeal. Expect increased volatility in EUR/USD, GBP/USD, and gold (XAU/USD) as traders reposition. The dovish stance may trigger risk-on sentiment, boosting equity indices and commodity currencies like AUD and NZD. Monitor central bank communications for forward guidance on future policy direction.', 1, true),
  ('OPEC+ Production Cut Extension', 'High', '2024-01-14', 'OPEC+ extends production cuts by 1 million barrels per day through Q2 2024.', 'Reduced supply typically drives crude oil prices higher, impacting energy-dependent currencies like CAD and NOK. Higher oil prices increase inflationary pressures globally, potentially forcing central banks to maintain or raise interest rates. This creates a complex dynamic where commodity currencies strengthen while major pairs experience increased volatility. Watch for correlation breakdowns between traditional safe-haven assets.', 2, true),
  ('European Central Bank Policy Meeting', 'Medium', '2024-01-13', 'ECB maintains current rates but hints at potential easing in upcoming meetings.', 'The dovish tone suggests EUR weakness against USD and GBP in the short term. However, if economic data improves, the ECB may pivot, creating trading opportunities. Monitor German manufacturing PMI and inflation data for confirmation signals. Cross-pairs like EUR/JPY may see increased volatility as traders assess relative monetary policy stances.', 3, true),
  ('US Non-Farm Payrolls Report', 'High', '2024-01-12', 'NFP shows stronger-than-expected job growth, indicating resilient labor market.', 'Strong employment data typically strengthens USD as it suggests the economy can handle higher interest rates. This often triggers USD/JPY rallies and puts downward pressure on gold. However, if wage growth is muted, the impact may be limited. Watch for revisions to previous months'' data and unemployment rate changes for complete picture.', 4, true),
  ('China Manufacturing PMI Release', 'Medium', '2024-01-11', 'Chinese manufacturing activity expands for third consecutive month.', 'Positive Chinese data typically boosts commodity currencies (AUD, NZD, CAD) and risk assets. It also supports EUR/CHF and EUR/JPY as global risk sentiment improves. However, if the expansion is driven by exports to struggling economies, the effect may be temporary. Monitor Australian and New Zealand trade data for confirmation.', 5, true),
  ('Bank of Japan Intervention Warning', 'Low', '2024-01-10', 'BOJ officials signal readiness to intervene if JPY weakens beyond 150.00.', 'Intervention threats create support zones around key psychological levels. USD/JPY may experience sharp reversals if intervention occurs, but the effect is often temporary unless backed by actual policy changes. Monitor BOJ meeting minutes and official statements for policy shift signals. This creates both risk and opportunity for JPY pairs.', 6, true)
ON CONFLICT DO NOTHING;

