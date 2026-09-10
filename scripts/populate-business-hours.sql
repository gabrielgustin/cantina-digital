-- Populate business hours for the week
-- This script adds default business hours for M&M Relojes

-- Delete existing hours if any
DELETE FROM business_hours;

-- Monday through Friday: 9:00 AM - 6:00 PM
INSERT INTO business_hours (day_of_week, open_time, close_time, is_open)
VALUES 
  ('Monday', '09:00', '18:00', true),
  ('Tuesday', '09:00', '18:00', true),
  ('Wednesday', '09:00', '18:00', true),
  ('Thursday', '09:00', '18:00', true),
  ('Friday', '09:00', '18:00', true);

-- Saturday: 9:00 AM - 1:00 PM
INSERT INTO business_hours (day_of_week, open_time, close_time, is_open)
VALUES ('Saturday', '09:00', '13:00', true);

-- Sunday: Closed
INSERT INTO business_hours (day_of_week, open_time, close_time, is_open)
VALUES ('Sunday', '00:00', '00:00', false);
