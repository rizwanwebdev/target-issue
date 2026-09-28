CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(id),
    project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    issue_id INTEGER REFERENCES issues(id) ON DELETE SET NULL,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,

    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'orphan'
        CHECK (status IN ('orphan', 'assigned', 'completed', 'archive')),

    priority VARCHAR(20)
        NOT NULL
        DEFAULT 'low'
        CHECK (priority IN ('low', 'medium', 'high')),

    due_date TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS todo_assignees (
    id SERIAL PRIMARY KEY,

    todo_id INTEGER NOT NULL
        REFERENCES todos(id)
        ON DELETE CASCADE,

    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE SET NULL,

    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (todo_id, user_id)
);