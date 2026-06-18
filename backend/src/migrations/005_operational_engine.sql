-- 005_operational_engine.sql

CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    id_proof_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: room_id can be NULL if the booking is purely for a room_type_id and not physically allocated yet.
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'UPCOMING', -- UPCOMING, CHECKED_IN, CHECKED_OUT, CANCELLED
    source VARCHAR(100) DEFAULT 'DIRECT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
);

-- Add indexes for common operational lookups
CREATE INDEX idx_reservations_dates ON reservations (check_in_date, check_out_date);
CREATE INDEX idx_reservations_status ON reservations (status);
CREATE INDEX idx_guests_email ON guests (email);

-- Apply Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_guests ON guests
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );

CREATE POLICY tenant_isolation_reservations ON reservations
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );
