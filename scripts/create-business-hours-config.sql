-- Create business_hours_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS business_hours_config (
  id SERIAL PRIMARY KEY,
  allow_orders_when_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration if no records exist
INSERT INTO business_hours_config (allow_orders_when_closed)
SELECT true
WHERE NOT EXISTS (SELECT 1 FROM business_hours_config);
