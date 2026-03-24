CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login         VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_admin      BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_login ON users (login);

-- ============================================================
-- entries  (user journal entries – not public in this phase)
-- ============================================================
CREATE TABLE IF NOT EXISTS entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL DEFAULT '',
  body       TEXT         NOT NULL DEFAULT '',
  status     VARCHAR(20)  NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','saved','archived')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries (user_id);
CREATE INDEX IF NOT EXISTS idx_entries_status  ON entries (status);

-- ============================================================
-- inspirations
-- ============================================================
CREATE TABLE IF NOT EXISTS inspirations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji              VARCHAR(10)  NOT NULL DEFAULT '',
  title              VARCHAR(200) NOT NULL DEFAULT '',
  content            TEXT         NOT NULL DEFAULT '',
  source             VARCHAR(20)  NOT NULL DEFAULT 'manual'
                       CHECK (source IN ('manual','generator')),
  status             VARCHAR(20)  NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft','published','archived')),
  created_by_user_id UUID         REFERENCES users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inspirations_status ON inspirations (status);

-- ============================================================
-- anonymous_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS anonymous_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body       TEXT         NOT NULL DEFAULT '',
  status     VARCHAR(20)  NOT NULL DEFAULT 'new'
               CHECK (status IN ('new','reviewed','archived')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_anonymous_messages_status ON anonymous_messages (status);

-- ============================================================
-- help_sections
-- ============================================================
CREATE TABLE IF NOT EXISTS help_sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category      VARCHAR(100) NOT NULL DEFAULT '',
  title         VARCHAR(200) NOT NULL DEFAULT '',
  body          TEXT         NOT NULL DEFAULT '',
  display_order INT          NOT NULL DEFAULT 0,
  status        VARCHAR(20)  NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','published')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_help_sections_status_order ON help_sections (status, display_order);
