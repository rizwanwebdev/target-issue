CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(id),
    project_id INTEGER NOT NULL REFERENCES project(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    -- reporter_id INTEGER NOT NULL REFERENCES users(id),
    issue_number INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20)
        NOT NULL
        DEFAULT 'orphan'
        CHECK (status IN ('orphan','assigned', 'resolved', 'archived', 'closed')),
    priority VARCHAR(20)
        NOT NULL
        DEFAULT 'low'
        CHECK (priority IN ('low', 'medium', 'high')),
    severity VARCHAR(20)
        NOT NULL
        DEFAULT 'minor'
        CHECK (severity IN ('critical', 'major', 'minor','trivial')),
    due_date TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (project_id, issue_number)
);

ALTER TABLE project
ADD COLUMN next_issue_number INTEGER NOT NULL DEFAULT 1;