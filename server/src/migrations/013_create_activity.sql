CREATE TABLE IF NOT EXISTS activity (
    id BIGSERIAL PRIMARY KEY,

    organization_id INTEGER NOT NULL
        REFERENCES organization(id)
        ON DELETE CASCADE,

    project_id INTEGER
        REFERENCES project(id)
        ON DELETE CASCADE,
    
    team_id INTEGER
        REFERENCES team(id)
        ON DELETE CASCADE,

    actor_id INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,


    message VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_organization
ON activity (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_project
ON activity (project_id, created_at DESC);