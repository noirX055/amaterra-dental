-- Add doctor_id column to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor_id TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
