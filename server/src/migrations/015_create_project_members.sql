CREATE TABLE IF NOT EXISTS project_members(
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20)
        NOT NULL
        DEFAULT 'member'
        CHECK (role IN ('member', 'admin', 'viewer')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (project_id, user_id)
);