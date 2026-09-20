CREATE TABLE IF NOT EXISTS team(
    id SERIAL PRIMARY KEY,
    organization_id  INTEGER NOT NULL REFERENCES organization(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(8) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
