CREATE TABLE IF NOT EXIST project (
    id SERIAL PRIMARY KEY,
    organization_id  INTEGER REFERENCES organization(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    status VARCHAR(20)
        NOT NULL
        DEFAULT 'ongoing'
        CHECK (status IN ('ongoing', 'paused', 'completed', 'suspended', 'archived')),

);

CREATE TABLE IF NOT EXISTS project_members(
   id SERIAL PRIMARY KEY,
   project_id INTEGER REFERENCES team(id),
   user_id  INTEGER REFERENCES users(id),
   role VARCHAR(20)
        NOT NULL
        DEFAULT 'member'
        CHECK (role IN ('member', 'admin', 'viewer')),
   joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);




