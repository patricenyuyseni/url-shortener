CREATE TABLE links {
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    code VARCHAR(16) NOT NULL UNIQUE,
    target_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    expires_at TIMESTAMP,
    click_count INTEGER NOT NULL DEFAULT 0
    CHECK (click_count >= 0)
};

CREATE TABLE clicks {
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    link_id INTEGER NOT NULL REFERENCES ldinks(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP NOT NULL DEFAULT now(),
    referrer TEXT,
    user_agent TEXT,
};

CREATE INDEX click_link_id_idx ON clicks(link_id, clicked_at);