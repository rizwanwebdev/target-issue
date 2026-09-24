CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(id),
    project_id INTEGER NOT NULL REFERENCES project(id),
    issue_id INTEGER NOT NULL REFERENCES issues(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20)
        NOT NULL
        DEFAULT 'orphan'
        CHECK (status IN ('orphan','assigned', 'completed', 'archive')),
    priority VARCHAR(20)
        NOT NULL
        DEFAULT 'low'
        CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE TABLE IF NOT EXISTS todo_assignees(
    id SERIAL PRIMARY KEY,
    todo_id INTEGER NOT NULL REFERENCES todos(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (todo_id, user_id)
);
