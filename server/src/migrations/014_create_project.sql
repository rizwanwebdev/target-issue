CREATE TABLE IF NOT EXISTS project(
    id SERIAL PRIMARY KEY,
    organization_id  INTEGER REFERENCES organization(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20)
        NOT NULL
        DEFAULT 'ongoing'
        CHECK (status IN ('new', 'ongoing', 'completed', 'archive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);