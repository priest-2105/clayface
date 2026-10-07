-- Direction rows are the canonical editable project documents. The aggregate
-- snapshot remains temporarily for rollback and legacy backfill only.
ALTER TABLE direction
  ADD COLUMN description varchar(500) NOT NULL DEFAULT '',
  ADD CONSTRAINT direction_document_size_limit
  CHECK (octet_length(document::text) <= 2097152);

CREATE INDEX IF NOT EXISTS direction_project_updated_idx
  ON direction(project_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS project_active_updated_idx
  ON project(user_id, updated_at DESC)
  WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS asset_project_checksum_idx
  ON asset(project_id, checksum);
