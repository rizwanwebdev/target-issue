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