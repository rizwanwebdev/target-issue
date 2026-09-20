CREATE TABLE IF NOT EXISTS project(
    id SERIAL PRIMARY KEY,
    organization_id  INTEGER NOT NULL REFERENCES organization(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20)
        NOT NULL
        DEFAULT 'ongoing'
        CHECK (status IN ('new', 'ongoing', 'completed', 'archive')),
    start_date TIMESTAMPTZ,
    target_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);