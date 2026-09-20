CREATE TABLE IF NOT EXISTS otp_verification (
    otp_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    email VARCHAR(255) NOT NULL,
    otp_hash TEXT NOT NULL,
    attempts INTEGER DEFAULT 0, 
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);