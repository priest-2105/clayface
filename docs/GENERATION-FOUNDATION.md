# Deterministic generation foundation

This slice proves the first generation path without AI, Figma, a database, or a background worker.

## Inputs

`generateDirection` accepts a project brief, product type, brand, bounded page list, strategy, and design-system pin. The page planner deduplicates and bounds page requests to the schema limit, assigning each page a small intent and required component set.

## Output

The generator reuses the versioned registry fixtures as the initial composition vocabulary, binds the project brief and brand into the generated content, pins the document to the requested design-system version, and validates the resulting document with the same registry validator used by the editor and renderer.

A generation result includes:

- the validated editable `Direction`;
- the page intent plan used to compose it;
- warnings for bounded input that was truncated.

The function is deterministic: identical inputs produce identical IR. Invalid registry variants, page structure, and design-system pins fail before the result is returned.

## Product integration

Project setup and the add-direction flow now call this generator. The browser still saves locally, so this is a vertical prototype of the generation contract rather than a hosted job system. The future API transaction can persist the result and the worker can execute the same contract behind an idempotent job.

## Deliberate limits

- The initial composition set is the registry's small marketing/product vocabulary.
- Content binding is brief-first and bounded; it does not invent arbitrary code.
- No AI provider, Figma input, asset upload, or durable job queue is involved.
- Expanding the registry requires new fixtures and visual review before broadening planner rules.
