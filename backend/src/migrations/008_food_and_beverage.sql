-- 008_food_and_beverage.sql

CREATE TABLE food_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'GENERAL',
    price NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    folio_id UUID REFERENCES folios(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PREPARING, DELIVERED, BILLED, CANCELLED
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES food_orders(id) ON DELETE CASCADE,
    food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- Indexes
CREATE INDEX idx_food_orders_org ON food_orders(organization_id);
CREATE INDEX idx_food_orders_res ON food_orders(reservation_id);
CREATE INDEX idx_food_items_org ON food_items(organization_id);

-- Apply Row Level Security
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_food_items ON food_items
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );

CREATE POLICY tenant_isolation_food_orders ON food_orders
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );

-- food_order_items inherits isolation through order_id but needs its own policy for direct queries
CREATE POLICY tenant_isolation_food_order_items ON food_order_items
    USING (
        EXISTS (
            SELECT 1 FROM food_orders 
            WHERE id = food_order_items.order_id 
            AND (
                current_setting('app.is_super_admin', true) = 'true'
                OR 
                organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
            )
        )
    );
