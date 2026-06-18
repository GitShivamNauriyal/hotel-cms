-- 002_rls_policies.sql

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- 1. Organization Boundaries
-- Sub-users can only view their own organization. Super admins can view all.
CREATE POLICY tenant_isolation_organizations ON organizations
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );

-- 2. User Isolation
-- Sub-users can only view/modify users within their own organization.
CREATE POLICY tenant_isolation_users ON users
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );

-- 3. Roles Isolation
CREATE POLICY tenant_isolation_roles ON roles
    USING (
        current_setting('app.is_super_admin', true) = 'true'
        OR 
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
    );
