CREATE TABLE IF NOT EXISTS password_reset (
    reset_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token_hash TEXT,
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);