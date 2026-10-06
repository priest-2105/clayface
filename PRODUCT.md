# Clayface

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Confirmed in planning: pnpm/Turborepo, Next.js/React, Fastify, PostgreSQL/Drizzle, background workers, shared TypeScript contracts. The first milestone uses fixture data and browser-local persistence. Production services follow the shell review.

## Users

Frontend engineers, design engineers, product designers, and small teams creating coherent responsive marketing/product websites.

## Product Purpose

Create, compare, edit, preview, and hand off interfaces assembled from a versioned component registry and project design system. Clayface IR is canonical; rendered markup and exports are derived.

## Capabilities and Constraints

One active project per user, at most three active directions. Initial page families: Home, Features, Pricing, About, Contact. Deterministic generation first; AI is optional. The editor is desktop first; smaller screens retain navigation and preview access.

First milestone confirmed by the user: polished fixture-driven shell. Sample data must be labeled. It must not imply live auth, Figma connection, server generation, or Next.js export.

## Brand Commitments

Follow Clayface.md Visual System v1: calm, compact, structured, predominantly neutral. Notion/Airtable are interaction references, not branding to copy. User approved building directly from this specification and requested continued implementation without further planning stops.

## Data Preservation

Preserve existing accounts and projects. Archive extra projects read-only, and hide legacy design records after verified backup. Never invent IR for old metadata-only design rows. Existing database access and migration execution are outside this fixture milestone.

## Evidence on Hand

Clayface.md is the product and architecture authority. Git commit 9efa234 holds the previous application for selective reuse. Forma is explicitly fictional demonstration content, not a customer or commercial claim.

## Product Principles

Structured generation; explicit editing scope; versioned reproducibility; accessible interactions; compact canonical state.

## Priority after the current milestone

### Public status page

Build a public status page for Clayface as a first-class product surface. It should show service health, incidents, maintenance windows, and incident history in a clear, trustworthy format. The page should be independently reachable when the main app is degraded, use the same Clayface visual system, and connect to the API and database health checks without exposing private infrastructure details.
