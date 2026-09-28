ALTER TABLE IF EXISTS issue_assignees
CREATE INDEX IF NOT EXISTS idx_issue_assignees_user
ON issue_assignees (user_id, issue_id);

CREATE TABLE issue_teams (
    issue_id INTEGER NOT NULL
        REFERENCES issues(id) ON DELETE CASCADE,

    team_id INTEGER NOT NULL
        REFERENCES team(id) ON DELETE CASCADE,

    assigned_by INTEGER NOT NULL
        REFERENCES users(id) ON DELETE SET NULL,

    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (issue_id, team_id)
);
