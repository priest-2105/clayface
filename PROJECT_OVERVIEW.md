# Clayface

**Clayface** is an AI-powered "frontend compiler" — a web app where you describe a UI component or page in plain English and get back clean, production-ready, typed frontend code, generated in a way that respects your chosen stack and design system.

Tagline (from the landing page): *"Constrained frontend compiler powered by AI"*.

## What it does

- **Chat-driven generation** — Describe what you want in a chat interface; Clayface generates the corresponding frontend code.
- **Stack-aware output** — You choose the target stack (Next.js, React, or plain HTML/JS) and an optional design system (Shadcn UI, Material UI, or none), and generation adapts to those choices.
- **Design-system grounding via Figma** — Users can attach reference material to a project (a Figma file, a link, an uploaded asset, or free-form notes) so generated UI matches an existing design system. Figma integration includes OAuth connect/disconnect, reading file selections, and pulling file/node JSON via the Figma REST API.
- **Projects** — Work is organized into projects, each with its own chats, generated "designs" (page/component/flow/section/system), status tracking (active/review/ready/archived), and an activity log (created, updated, reference attached/detached, archived, etc.).
- **Accounts** — Standard email/password auth plus OAuth (via NextAuth + Prisma adapter), with password reset, change-password, and account-disable flows.

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Auth**: NextAuth 4 + `@auth/prisma-adapter`, bcrypt for password hashing
- **Database**: PostgreSQL via Prisma ORM (`@prisma/client`, `pg` driver adapter)
- **Validation**: Zod
- **External integration**: Figma REST API (OAuth2 + file/node access)

## Data model (Prisma)

- `User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken` — auth/identity (NextAuth-shaped)
- `DesignSystemReference` — a named reference (Figma file, link, upload, or notes) a user attaches to projects, optionally marked "primary"
- `Project` — a named workspace (with slug, description, status) that owns:
  - chats (`ProjectChatStatus`: active/draft/archived)
  - generated designs (`ProjectDesignType`: page/component/flow/section/system; `ProjectDesignStatus`: draft/review/ready/archived)
  - chat messages (`ProjectChatMessageRole`: user/assistant/system)
  - an activity feed (`ProjectActivityKind`)
  - links to `DesignSystemReference`s

## App structure

- `app/` — routes: landing page (`page.tsx`), `(auth)` group, `chat`, `chat/[id]`, `projects/[id]`, `profile`, `settings`, `help`, `privacy-policy`, `terms`, plus `api/` routes for auth, Figma OAuth/selection/status, design systems, projects, and project chats
- `components/` — `auth/`, `chat/`, `projects/`, `settings/`, `ui/`, plus `LandingNav` and `ThemeProvider`
- `lib/` — `auth.ts`/`auth-errors.ts`/`auth-security.ts`, `design-systems.ts`, `design-system-errors.ts`, `figma.ts`, `projects.ts`, `prisma.ts`, `fonts.ts`, `utils.ts`
- `prisma/schema.prisma` — the data model described above

## Notable repo files

- `figma-oauth.md`, `figmafiles.md` — reference notes/docs on the Figma REST API (OAuth flow and Files endpoints) used to build the Figma integration.

## Naming note

The project was previously named "Shiva" (the local folder and some file names like `shiva-ai-logo-lg.svg` still reflect this) and was renamed to **Clayface**; branding, `package.json`, and page metadata now consistently use "Clayface".
