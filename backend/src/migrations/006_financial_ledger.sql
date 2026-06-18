-- 006_financial_ledger.sql

CREATE TABLE folios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, BILLED, SETTLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio_id UUID NOT NULL REFERENCES folios(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- CHARGE, PAYMENT, REFUND
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast balance calculations
CREATE INDEX idx_ledger_folio ON ledger_entries (folio_id);
CREATE INDEX idx_ledger_org ON ledger_entries (organization_id);

ALTER TABLE folios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_folios ON folios
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );

CREATE POLICY tenant_isolation_ledger ON ledger_entries
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );
