CREATE TABLE IF NOT EXISTS session (
    session_id SERIAL PRIMARY KEY,
    user_id REFERENCES users(id),
    ip_address VARCHAR(20)
    user_agent TEXT,
    device_name VARCHAR(255),
    is_active BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
);

CREATE TABLE IF NOT EXISTS refresh_token (
    token_id SERIAL PRIMARY KEY,
    user_id REFERENCES users(id),
    session_id REFERENCES sessions(session_id),
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE TABLE IF NOT EXISTS otp_verification (
    otp_id SERIAL PRIMARY KEY,
    user_id REFERENCES users(id),
    email VARCHAR(255) NOT NULL,
    otp_hash TEXT NOT NULL,
    attempts INTEGER DEFAULT 0, 
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE TABLE IF NOT EXISTS password_reset (
    reset_id SERIAL PRIMARY KEY,
    user_id REFERENCES users(id),
    token_hash TEXT,
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);