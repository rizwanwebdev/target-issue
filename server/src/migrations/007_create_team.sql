CREATE TABLE IF NOT EXISTS team(
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL,
    organization_id  INTEGER NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(8) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, slug)
);
CREATE TABLE IF NOT EXISTS team_members(
   id SERIAL PRIMARY KEY,
   team_id INTEGER NOT NULL REFERENCES team(id) ON DELETE CASCADE,
   user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   role VARCHAR(20)
        NOT NULL
        DEFAULT 'member'
        CHECK (role IN ('member', 'admin', 'viewer')),
   joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   UNIQUE (team_id, user_id)
);
