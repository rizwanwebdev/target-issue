CREATE TABLE IF NOT EXISTS team_members(
   id SERIAL PRIMARY KEY,
   team_id INTEGER REFERENCES team(id),
   user_id  INTEGER REFERENCES users(id),
   role VARCHAR(20)
        NOT NULL
        DEFAULT 'member'
        CHECK (role IN ('member', 'admin', 'viewer')),
   joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);