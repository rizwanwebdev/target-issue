CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(25) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status VARCHAR(20)
        NOT NULL
        DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'suspended')),
    avatar_url TEXT,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

ALTER TABLE users
ADD CONSTRAINT users_username_format
CHECK (
    username ~ '^[a-z0-9_]{3,25}$'
);