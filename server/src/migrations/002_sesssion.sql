CREATE TABLE IF NOT EXISTS session (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    ip_address VARCHAR(20),
    user_agent TEXT,
    device_name VARCHAR(255),
    is_active BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);