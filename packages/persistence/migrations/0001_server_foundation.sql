create extension if not exists pgcrypto;
create type project_status as enum ('ACTIVE', 'ARCHIVED');
create type direction_status as enum ('DRAFT', 'GENERATING', 'READY', 'FAILED', 'ARCHIVED');
create type direction_strategy as enum ('PRODUCT', 'EDITORIAL', 'MINIMAL');
create type job_status as enum ('QUEUED', 'RUNNING', 'VALIDATING', 'COMPLETED', 'FAILED', 'CANCELLED');
create type product_type as enum ('SOFTWARE_SAAS', 'AGENCY_STUDIO', 'SERVICE_BUSINESS');

create table app_user (
  id uuid primary key default gen_random_uuid(), legacy_user_id text unique,
  email varchar(320) not null unique, name varchar(120), password_hash text,
  auth_version integer not null default 0, disabled_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table project (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references app_user(id) on delete cascade,
  legacy_project_id text unique, name varchar(80) not null,
  product_type product_type not null, brief text not null default '',
  status project_status not null default 'ACTIVE', active_design_system_version_id uuid,
  project_version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index one_active_project_per_user_idx on project(user_id) where status = 'ACTIVE';
create index project_user_id_idx on project(user_id);
create table design_system (
  id uuid primary key default gen_random_uuid(), project_id uuid not null unique references project(id) on delete cascade,
  name varchar(80) not null, created_at timestamptz not null default now()
);
create table design_system_version (
  id uuid primary key default gen_random_uuid(), design_system_id uuid not null references design_system(id) on delete cascade,
  version integer not null, tokens jsonb not null, source varchar(32) not null default 'clayface', created_at timestamptz not null default now(),
  unique(design_system_id, version)
);
alter table project add constraint project_active_system_fk foreign key (active_design_system_version_id) references design_system_version(id);
create table direction (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references project(id) on delete cascade,
  design_system_version_id uuid not null references design_system_version(id), legacy_design_id text unique,
  name varchar(80) not null, strategy direction_strategy not null, status direction_status not null default 'DRAFT',
  schema_version integer not null default 1, document jsonb not null, source varchar(32) not null default 'deterministic',
  direction_version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index direction_project_status_idx on direction(project_id, status);
create table asset (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references project(id) on delete cascade,
  storage_key text not null unique, media_type varchar(120) not null, checksum varchar(128) not null, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table generation_job (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references project(id) on delete cascade,
  direction_id uuid references direction(id) on delete set null, idempotency_key varchar(180) not null unique,
  type varchar(32) not null, status job_status not null default 'QUEUED', stage varchar(32), error_code varchar(64), error_detail text,
  created_at timestamptz not null default now(), started_at timestamptz, completed_at timestamptz
);
