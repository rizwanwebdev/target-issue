CREATE TABLE IF NOT EXISTS project_teams (
    id SERIAL PRIMARY KEY,

    project_id INTEGER NOT NULL
        REFERENCES project(id)
        ON DELETE CASCADE,

    team_id INTEGER NOT NULL
        REFERENCES team(id)
        ON DELETE CASCADE,

    assigned_by INTEGER NOT NULL
        REFERENCES users(id) ON DELETE SET NULL,

    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (project_id, team_id)
);