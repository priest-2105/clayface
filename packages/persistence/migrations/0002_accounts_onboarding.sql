ALTER TABLE app_user ADD COLUMN onboarding_step text NOT NULL DEFAULT 'name'
  CHECK (onboarding_step IN ('name', 'project', 'design', 'complete'));
ALTER TABLE app_user ADD COLUMN totp_secret text, ADD COLUMN totp_pending text,
  ADD COLUMN totp_pending_expires_at timestamptz, ADD COLUMN totp_last_step bigint NOT NULL DEFAULT -1;
ALTER TABLE project ADD COLUMN workspace_document jsonb, ADD COLUMN page_names jsonb NOT NULL DEFAULT '["Home", "Features", "Pricing", "About", "Contact"]';
CREATE TABLE auth_session (
  token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  auth_version integer NOT NULL, kind text NOT NULL CHECK (kind IN ('session','challenge')),
  expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX auth_session_user_idx ON auth_session(user_id);
CREATE TABLE password_reset (
  token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE recovery_code (
  user_id uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE, code_hash text NOT NULL,
  PRIMARY KEY(user_id, code_hash)
);
CREATE TABLE auth_rate_limit (key text PRIMARY KEY, count integer NOT NULL, reset_at timestamptz NOT NULL);
