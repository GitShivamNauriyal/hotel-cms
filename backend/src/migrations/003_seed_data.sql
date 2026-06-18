-- 003_seed_data.sql

-- All users use 'password123' mapped to bcrypt: $2b$10$6rhCEvur48.QyxIkdvBWiueZFWhg/avGi7NDTEIqNHiovipDJJ8/C

-- 1. Insert Organizations (Hotels)
INSERT INTO organizations (id, name, subdomain) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Grand Plaza Hotel 1', 'grandplaza1'),
    ('22222222-2222-2222-2222-222222222222', 'Grand Plaza Hotel 2', 'grandplaza2');

-- 2. Insert Super Admin User (No organization bound)
INSERT INTO users (email, password_hash, is_root, is_super_admin) VALUES
    ('super@hotelcms.com', '$2b$10$6rhCEvur48.QyxIkdvBWiueZFWhg/avGi7NDTEIqNHiovipDJJ8/C', true, true);

-- 3. Insert Hotel 1 Root User
INSERT INTO users (organization_id, email, password_hash, is_root, is_super_admin) VALUES
    ('11111111-1111-1111-1111-111111111111', 'root@hotel1.com', '$2b$10$6rhCEvur48.QyxIkdvBWiueZFWhg/avGi7NDTEIqNHiovipDJJ8/C', true, false);

-- 4. Insert Hotel 2 Root User
INSERT INTO users (organization_id, email, password_hash, is_root, is_super_admin) VALUES
    ('22222222-2222-2222-2222-222222222222', 'root@hotel2.com', '$2b$10$6rhCEvur48.QyxIkdvBWiueZFWhg/avGi7NDTEIqNHiovipDJJ8/C', true, false);

-- 5. Insert Hotel 1 Staff User
INSERT INTO users (organization_id, email, password_hash, is_root, is_super_admin) VALUES
    ('11111111-1111-1111-1111-111111111111', 'staff@hotel1.com', '$2b$10$6rhCEvur48.QyxIkdvBWiueZFWhg/avGi7NDTEIqNHiovipDJJ8/C', false, false);
