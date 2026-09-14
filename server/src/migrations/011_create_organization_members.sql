CREATE TABLE IF NOT EXISTS organization_members(
    id SERIAL PRIMARY KEY,
    organization_id REFERENCES organization(id),
    user_id  INTEGER REFERENCES users(id),
    role VARCHAR(20)
        NOT NULL
        DEFAULT 'member'
        CHECK (role IN ('member', 'leader', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    joined_at TIMESTAMPTZ 
);
