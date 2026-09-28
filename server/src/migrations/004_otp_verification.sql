CREATE TABLE IF NOT EXISTS otp_verification (
    otp_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    otp_hash TEXT NOT NULL,
    resent INTEGER  DEFAULT 0,
    attempts INTEGER DEFAULT 0, 
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);