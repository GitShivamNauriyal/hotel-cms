-- 007_super_users_isolation.sql

-- 1. Create the isolated super_users table
CREATE TABLE super_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed the master Super Admin credentials
-- We use the same bcrypt hash for 'password123' as requested
INSERT INTO super_users (email, password_hash) VALUES
    ('super@hotelcms.com', '$2b$10$6rhCEvur48.QyxIkdvBWiueZFWhg/avGi7NDTEIqNHiovipDJJ8/C');

-- 3. Remove the super admin record from the main users table
DELETE FROM users WHERE email = 'super@hotelcms.com';

-- 4. Drop the is_super_admin column and its constraints from the main users table
ALTER TABLE users DROP CONSTRAINT check_org_id;
ALTER TABLE users DROP COLUMN is_super_admin;
ALTER TABLE users ADD CONSTRAINT check_org_id CHECK (organization_id IS NOT NULL);
