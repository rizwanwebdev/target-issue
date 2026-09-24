CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(id),
    project_id INTEGER NOT NULL REFERENCES project(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    reporter_id INTEGER NOT NULL REFERENCES users(id),
    issue_number INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20)
        NOT NULL
        DEFAULT 'orphan'
        CHECK (role IN ('orphan','assigned', 'completed', 'archive')),
    priority VARCHAR(20)
        NOT NULL
        DEFAULT 'low'
        CHECK (role IN ('low', 'medium', 'high')),
    severity VARCHAR(20)
        NOT NULL
        DEFAULT 'minor'
        CHECK (role IN ('critical', 'major', 'minor','trival')),
    due_date TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 minutes',
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (project_id, issue_number)
);
CREATE TABLE IF NOT EXISTS issue_comments(
    id SERIAL PRIMARY KEY,
    issue_id INTEGER NOT NULL REFERENCES issues(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    parent_comment_id INTEGER REFERENCES issue_comments(id),
    content TEXT,
    edited_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);
CREATE TABLE IF NOT EXISTS issue_activity(
    id SERIAL PRIMARY KEY,
    issue_id INTEGER NOT NULL REFERENCES issues(id),
    actor_id INTEGER NOT NULL REFERENCES users(id),
    content VARCHAR(20),
    field_name VARCHAR(20),
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

);
CREATE TABLE IF NOT EXISTS issue_assignees(
    id SERIAL PRIMARY KEY,
    issue_id INTEGER NOT NULL REFERENCES issues(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    assigned_by INTEGER NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (issue_id, user_id)
);

CREATE TABLE IF NOT EXISTS project_labels(
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES project(id),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(8) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE TABLE IF NOT EXISTS issue_labels(
    issue_id INTEGER NOT NULL REFERENCES issues(id),
    label_id INTEGER NOT NULL REFERENCES project_labels(id),
    PRIMARY KEY (issue_id, label_id)
);