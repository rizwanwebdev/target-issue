CREATE TABLE IF NOT EXISTS organization(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_by  INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE (slug)
);
CREATE TABLE IF NOT EXISTS organization_members (
    id SERIAL PRIMARY KEY,

    organization_id INTEGER NOT NULL
        REFERENCES organization(id)
        ON DELETE CASCADE,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL DEFAULT 'member'
        CHECK (role IN ('member', 'admin', 'viewer')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    joined_at TIMESTAMPTZ,

    UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS organization_invitations (

    id SERIAL PRIMARY KEY,

    organization_id INTEGER NOT NULL
        REFERENCES organization(id)
        ON DELETE CASCADE,

    invited_by INTEGER NOT NULL
        REFERENCES users(id) ON DELETE SET NULL,

    email VARCHAR(255) NOT NULL,

    token_hash TEXT NOT NULL UNIQUE,

    role VARCHAR(20) NOT NULL DEFAULT 'member'
        CHECK (role IN ('member', 'admin', 'viewer')),

    expires_at TIMESTAMPTZ NOT NULL,

    accepted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_invitations_email
ON organization_invitations(email);

CREATE INDEX IF NOT EXISTS idx_org_invitations_organization
ON organization_invitations(organization_id);