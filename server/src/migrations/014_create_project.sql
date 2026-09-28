CREATE TABLE IF NOT EXISTS project(
    id SERIAL PRIMARY KEY,
    organization_id  INTEGER NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    next_issue_number INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20)
        NOT NULL
        DEFAULT 'ongoing'
        CHECK (status IN ('new', 'ongoing', 'completed', 'archive')),
    start_date TIMESTAMPTZ,
    target_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);