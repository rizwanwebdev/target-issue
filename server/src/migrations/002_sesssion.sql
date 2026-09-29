CREATE TABLE IF NOT EXISTS session (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    device_name VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

ALTER TABLE session
ALTER COLUMN ip_address TYPE INET
USING ip_address::INET;

ALTER TABLE session
ALTER COLUMN is_active SET DEFAULT TRUE;