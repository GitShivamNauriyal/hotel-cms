-- 009_staff_management.sql

-- Delete existing staff users so we can start fresh for the demo
DELETE FROM users WHERE is_root = false;

-- Add new columns for staff management
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN staff_category VARCHAR(100) DEFAULT 'GENERAL';
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
