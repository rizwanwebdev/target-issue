CREATE TABLE IF NOT EXISTS organization_invitations (
    id SERIAL PRIMARY KEY,

    organization_id INTEGER NOT NULL
        REFERENCES organization(id)
        ON DELETE CASCADE,

    invited_by INTEGER NOT NULL
        REFERENCES users(id),

    email VARCHAR(255) NOT NULL,

    token_hash TEXT NOT NULL UNIQUE,

    role VARCHAR(20) NOT NULL DEFAULT 'member'
        CHECK (role IN ('member', 'admin', 'viewer')),

    expires_at TIMESTAMPTZ NOT NULL,

    accepted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);