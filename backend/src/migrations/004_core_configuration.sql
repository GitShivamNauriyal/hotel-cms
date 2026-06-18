-- 004_core_configuration.sql

CREATE TABLE organization_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_org_profile UNIQUE(organization_id)
);

CREATE INDEX idx_org_profiles_settings ON organization_profiles USING GIN (settings);

CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    base_price_per_night NUMERIC(12, 2) NOT NULL,
    max_occupancy INT NOT NULL,
    amenities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    room_number VARCHAR(50) NOT NULL,
    housekeeping_status VARCHAR(50) NOT NULL DEFAULT 'CLEAN',
    CONSTRAINT unique_org_room_num UNIQUE(organization_id, room_number)
);

-- Apply Row Level Security
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_org_profiles ON organization_profiles
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );

CREATE POLICY tenant_isolation_room_types ON room_types
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );

CREATE POLICY tenant_isolation_rooms ON rooms
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );
