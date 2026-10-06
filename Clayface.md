# PROJECT SUMMARY

This section defines what Clayface is, who it serves, the principles that constrain product decisions, and the boundaries of the first MVP. Read this before architecture or implementation sections.

# MAIN IDEA

Clayface is a design-system-driven UI builder that creates polished, structured interfaces from controlled components rather than free-form generated markup.

It can interpret supported Figma frames through Figma MCP, start from Clayface's own design system, accept manually configured design-system values, import structured design-system JSON, and recreate compatible external design systems. The active design system and project structure determine how the same component library can produce visually different interfaces.

Clayface's core advantage is not AI. Its default generation process is defined and deterministic: it selects from a large versioned registry of primitives, components, and higher-level compositions, validates the result, stores it as Clayface IR, and renders it through the same component system used by the editor.

AI is optional and only provides deeper interpretation or refinement. It cannot bypass the component registry, design-system rules, validation layer, or Clayface IR.

For MVP, each user can have one project and up to three design directions. Directions should store compact composition/configuration data and references instead of duplicated application code so generation, loading, storage, and editing remain efficient.

Clayface itself must set the design standard it promises to users. The product UI should be calm, precise, highly usable, accessible, fast, and structurally clear, taking interaction inspiration from tools such as Notion and Airtable without copying their visual identity.

# PRODUCT DEFINITION

Clayface is a design-system-driven UI generation platform. Its job is to convert structured design intent into polished, production-ready interfaces without relying on free-form AI generation.

Clayface accepts multiple sources of intent: Figma frames through Figma MCP, a Clayface-native design system, manually supplied design-system values, uploaded JSON design-system definitions, and optional natural-language refinement instructions.

The defining idea is that Clayface does not invent arbitrary UI from scratch. It assembles, configures, and renders interfaces from a controlled registry of versioned primitives, components, and compositions. Every generated interface is represented internally using the Clayface Intermediate Representation (Clayface IR) and is constrained by the active project design system.

AI is optional. The default generation path must remain deterministic enough to produce reliable results without an LLM. AI may interpret ambiguity, suggest refinements, or propose valid Clayface operations, but it must not bypass the component registry, design-system rules, validation layer, or IR.

The product promise is simple: users should be able to produce interfaces that look intentionally designed, not improvised or “vibe coded,” while retaining enough structure for editing, reuse, export, and future regeneration  
DEEP REVIEW

Core product thesis  
Clayface is only valuable if constrained generation creates better outcomes than unconstrained generation while still feeling flexible enough to be useful. This is the central product hypothesis and should be tested explicitly.

What Clayface is not  
Clayface is not:  
• a code-completion assistant,  
• a general website builder,  
• a Figma-to-HTML converter,  
• a no-code CMS,  
• a raw visual editor,  
• or an LLM wrapper.

These categories can overlap with individual features, but they must not determine the internal architecture.

Primary product loop  
The smallest complete Clayface loop is:  
1\. Establish design rules.  
2\. Supply page intent/content/source.  
3\. Produce one design direction.  
4\. Inspect why that direction exists.  
5\. Edit through structured controls.  
6\. Persist the structured result.  
7\. Create another direction that is materially different while still belonging to the same project system.

If any of those steps requires unrestricted generated code, the product thesis has weakened.

Quality definition  
“Good design” cannot mean only “valid HTML” or “looks modern.” For Clayface, quality should be evaluated against:  
• hierarchy,  
• spacing rhythm,  
• information density,  
• component consistency,  
• readability,  
• responsive behavior,  
• accessibility,  
• visual distinctiveness,  
• fit with the design system,  
• and absence of accidental-looking composition.

The MVP needs an internal visual review rubric. Even if scoring remains human at first, the team should evaluate generated directions against the same dimensions repeatedly.

Main product risk  
The largest risk is not technical feasibility. It is that constrained components produce repetitive template-like outputs. The component system must therefore optimize for compositional breadth, token expressiveness, and meaningful structural variants—not merely a large count of components.

Revision trigger  
Revisit the product model if early users consistently ask for arbitrary CSS/code escape hatches to achieve normal interface requirements. That would indicate the schema or component vocabulary is too weak, not necessarily that Clayface should become unrestricted.  
.

# PRODUCT PRINCIPLES

1\. Design quality over unlimited flexibility. Clayface should refuse or constrain combinations that are likely to produce poor UI.  
2\. Deterministic by default. Core generation must work without AI.  
3\. One pipeline. Figma, manual setup, imported systems, templates, and AI refinements all resolve into Clayface IR.  
4\. Components are the source of visual reliability. Generated UI must use registered, versioned Clayface components or explicitly imported project components.  
5\. Every project has a design system. No design is generated without token, layout, typography, and component rules.  
6\. AI cannot bypass structure. AI proposes validated Clayface operations instead of writing unrestricted application code.  
7\. Generated interfaces remain editable. Users can modify page structure, component choice, content, variants, and design-system values.  
8\. Store composition, not duplicated code. Projects reference shared components and assets instead of persisting full application copies.  
9\. Version behavior that can affect output. Components, design systems, schemas, and generation rules require versioning.  
10\. Clayface must demonstrate its own promise. Its product UI must be exceptionally clear, polished, accessible, and consistent.  
11\. Progressive disclosure. Advanced capability should not make the default workflow feel complicated.  
12\. Fast feedback. Most project interactions must feel immediate; long work must provide useful progress states rather than blocking the workspace.

# USERS & USE CASES

Primary users  
• Frontend engineers who want a strong visual starting point without surrendering code quality.  
• Product designers who want to turn Figma structure into working UI.  
• Design engineers working between Figma and implementation.  
• Small product teams that need repeatable interfaces without maintaining a large internal design-engineering team.  
• Agencies that need multiple polished directions while staying inside client design systems.

Core MVP use cases  
• Start a project from the Clayface default system and generate a polished interface direction.  
• Import a Figma frame and map its structure into Clayface components.  
• Enter or upload design tokens and component preferences.  
• Recreate the visual rules of an existing design system.  
• Produce up to three design directions for one project.  
• Inspect and edit the selected design through structured UI controls.  
• Adjust project-level tokens and see supported components update.  
• Export or hand off a stable representation of the design.

Important non-goals for MVP  
• Replacing Figma as a general-purpose vector design tool.  
• Producing arbitrary pixel-perfect artwork.  
• Becoming a general autonomous coding agent.  
• Supporting unlimited projects or unlimited generations.  
• Supporting every framework and design library on day one.

# MVP CONSTRAINTS

Account and project limits  
• One project per user.  
• Maximum three design directions in that project.  
• A user can delete a direction and create another.  
• Keep collaboration, teams, billing tiers, and multi-workspace organization outside the initial MVP unless required for testing.

Product constraints  
• Web application first.  
• Desktop-first editor experience; responsive enough for account/project navigation on smaller screens, but the primary creation surface targets desktop.  
• Clayface-native rendering is the canonical output path.  
• Figma import is scoped to structures Clayface can map reliably.  
• AI refinement is optional and can be feature-gated during early MVP work.  
• Every generated direction must reference a design-system version and component versions.  
• Generated design data should remain compact; full duplicated codebases are not persisted as the canonical project state.

Quality bar  
• Clayface itself must look production-grade before public MVP testing.  
• Generated designs must pass structural validation before the user sees them as completed.  
• Empty, loading, error, import, generation, retry, deletion, and limit states must be designed rather than added as afterthoughts.

# FEATURES

This section separates what must exist in the MVP from capabilities intentionally deferred until the core generation, editing, design-system, and Figma workflows are proven.

# MVP FEATURES

Project  
• Sign in and create the single allowed project.  
• Project name, project type, source, and design-system setup.  
• Project-level assets and metadata.

Design system  
• Start from Clayface default.  
• Manually edit core tokens.  
• Import a validated JSON design-system definition.  
• Store versioned design-system snapshots.  
• Apply token changes to compatible rendered components.

Generation  
• Create up to three design directions.  
• Generate from structured project inputs.  
• Optional Figma source.  
• Deterministic component/composition selection.  
• Generation status and retry behavior.  
• Validation before a direction is marked complete.

Editor  
• Page tree.  
• Canvas/preview.  
• Inspector for selected component.  
• Variant selection.  
• Content editing.  
• Supported layout controls.  
• Project design-system access.  
• Direction switcher.  
• Undo/redo for local editor operations if feasible within MVP architecture.

Figma  
• Connect through Figma MCP.  
• Read selected supported frames.  
• Normalize frame data.  
• Extract usable layout, hierarchy, text, assets, and token hints.  
• Map known structures to Clayface components.  
• Surface unsupported structures instead of silently producing inaccurate results.

AI  
• Optional refinement request.  
• AI returns allowed Clayface operations.  
• Operations are schema validated.  
• User sees results through the same renderer as deterministic generation.

Platform  
• Authentication.  
• PostgreSQL persistence.  
• Object storage for assets.  
• Background jobs for imports/generation.  
• Observability and error reporting.  
• Basic rate and abuse controls.

# POST-MVP FEATURES

Potential later work  
• Multiple projects and workspaces.  
• Team collaboration and permissions.  
• Shared project libraries.  
• Real-time multiplayer editing.  
• Comments and review mode.  
• Community or marketplace component packs.  
• Additional code-output targets.  
• Git synchronization and pull-request workflows.  
• Visual diffing between design directions.  
• Automatic responsive breakpoint exploration.  
• Component generation from approved source designs.  
• Full design-system importers for more external systems.  
• Organization-level design-system governance.  
• Component analytics and usage insights.  
• Version migration tools.  
• Plugin/extension architecture.  
• More sophisticated AI art direction and content generation.  
• Batch generation across multiple page families.

Rule: these features should not distort MVP architecture unless a future requirement would be expensive or impossible to add without planning for it now.

# PRODUCT UX

This section defines how users move from first-run project setup to generation, editing, design-system management, and error recovery. The product should rely on structured workflows rather than a prompt-first experience.

# INFORMATION ARCHITECTURE

Primary hierarchy

Account  
→ Project  
→ Design Directions  
→ Pages  
→ Component Instances

Project-level resources  
→ Design System  
→ Components / Registry view  
→ Assets  
→ Source / Figma  
→ Project Settings

Recommended primary navigation  
• Project  
• Designs  
• Pages  
• Components  
• Design System  
• Assets

Contextual areas  
• Canvas / preview in the center.  
• Inspector on the right.  
• Page and project tree on the left.  
• Top bar for project identity, preview, export, status, and account actions.  
• Bottom/status area only for useful editor state such as viewport, zoom, sync, or generation status.

Design principle  
Navigation should expose the structure of the project without exposing implementation complexity. Users should understand where they are, what they are changing, whether the change affects a component instance or the entire design system, and which design direction is currently active.

# ONBOARDING & PROJECT SETUP

Step 1 — Account  
User signs in and lands on a focused empty state. Because MVP supports one project, the primary action is Create project rather than a multi-project dashboard.

Step 2 — Project identity  
Collect project name and broad product type such as marketing site, web application, dashboard, ecommerce, documentation, or other. Product type influences composition eligibility, not the visual brand.

Step 3 — Choose design-system source  
Options:  
• Start from Clayface.  
• Import from Figma.  
• Upload design-system JSON.  
• Configure manually.  
• Recreate an existing supported design system.

Step 4 — Establish foundations  
Confirm typography, core color roles, spacing/density preference, radius family, container behavior, and basic component character. Defaults should be usable without requiring every field.

Step 5 — Add source material  
Optional Figma frame selection, content, assets, page requirements, and project intent.

Step 6 — Review generation brief  
Clayface summarizes the structured inputs it will use. The user should be able to correct obvious interpretation mistakes before consuming a design-direction slot.

Step 7 — Generate first direction  
Create a background job, show meaningful progress, validate the result, persist the IR, and open the editor on success.

Onboarding rule  
Do not begin with an open-ended chatbot. Structured choices establish reliable project state; a natural-language direction field can remain optional  
DEEP REVIEW

Onboarding objective  
Onboarding should not attempt to collect everything. It should collect only the information required to produce a first direction that feels intentional.

Minimum viable context  
For the first direction Clayface needs:  
• what is being designed,  
• which pages/sections are required,  
• the source of visual rules,  
• available content/assets,  
• and whether a Figma source should influence structure.

Everything else should have a useful default.

Progressive setup  
The user should be able to begin from a strong Clayface default and refine later. Requiring users to configure twenty design tokens before seeing value would make Clayface feel like design-system administration software rather than a generator.

Import review  
Imported design-system or Figma data should never become canonical immediately. Use a staged model:  
Detected → Proposed → Reviewed → Activated.

The review step should show meaningful interpretation, not raw implementation data. Example:  
“Primary accent: \#5F5CE6”  
“Heading family: Inter”  
“Card radius: medium”  
“Content width: wide”  
“Detected navigation pattern: horizontal top navigation”

This gives users a chance to correct interpretation before generation.

First-generation slot protection  
Because MVP has three directions, the system should not consume a slot before the user confirms the summarized generation brief. Failed generation also should not consume a permanent slot.

Abandon/re-entry  
Every onboarding step should be resumable. A user should be able to leave after importing Figma and return without repeating the import.

Review questions  
• Can a user who does not understand design tokens complete setup?  
• Can an expert inspect what Clayface inferred?  
• Can wrong imported assumptions be corrected before generation?  
• Is there a clear difference between project-level rules and one-direction creative direction?  
• Does setup feel shorter than the perceived value of the output?

Revision trigger  
If users repeatedly skip or misunderstand the review brief, reduce it to the smallest set of decisions that materially affect generation rather than adding explanation.  
.

# GENERATION & EDITING FLOW

Generation  
1\. User chooses New Design Direction.  
2\. Clayface validates remaining direction capacity.  
3\. User chooses source pages/content and optional creative direction.  
4\. System resolves active design-system version.  
5\. Generator builds a composition plan.  
6\. Registry filters incompatible components and variants.  
7\. Generator creates Clayface IR.  
8\. Validation checks schema, component compatibility, required content, responsive rules, and references.  
9\. Renderer creates preview output.  
10\. Direction is stored and marked ready.  
11\. User enters editor.

Editing  
• Selecting an element selects a Clayface node, not raw DOM.  
• Inspector edits validated props, variants, and supported overrides.  
• Structural changes produce IR operations.  
• Project design-system edits create or update a design-system version according to the chosen versioning policy.  
• The user can switch among up to three directions without duplicating shared assets or component implementations.

AI refinement  
1\. User enters a refinement request.  
2\. AI receives a constrained project summary and tool/operation schema.  
3\. AI proposes operations.  
4\. Operations are validated.  
5\. Invalid operations are rejected or repaired.  
6\. Valid operations update the IR.  
7\. Renderer produces the same result path as a manual edit.

Deletion  
Deleting a direction releases the slot after dependent temporary outputs and orphaned assets are safely cleaned up.

# STATES & FEEDBACK

Clayface requires designed states for:  
• First-run empty project.  
• No pages.  
• No design direction.  
• 1/3, 2/3, and 3/3 direction capacity.  
• Figma connection missing.  
• Figma import in progress.  
• Partial Figma mapping.  
• Generation queued.  
• Generation running.  
• Validation running.  
• Rendering.  
• Success.  
• Recoverable generation failure.  
• Permanent/unsupported input failure.  
• Offline or lost connection.  
• Unsaved local editor operation.  
• Save/sync failure.  
• Asset upload.  
• Asset processing failure.  
• AI unavailable while deterministic tools remain available.  
• Direction deletion confirmation.  
• Project deletion confirmation.

Feedback rules  
• Never use an indefinite spinner for multi-step generation if stage information is available.  
• Preserve the editor when a non-critical background action fails.  
• Error messages should identify what failed, whether data is safe, and the next action.  
• Use toasts for transient confirmations, inline messages for local problems, and dedicated error states for workflow-blocking failures.  
• Destructive actions must clearly communicate scope.

# CLAYFACE DESIGN SYSTEM

This is the design standard for Clayface itself. Because Clayface sells design quality, its own interface must be a reference implementation of clarity, restraint, accessibility, hierarchy, and system consistency.

# DESIGN PHILOSOPHY

Clayface should feel like quiet, precise, professional design software.

Reference qualities to borrow conceptually from products such as Notion and Airtable:  
• Clear hierarchy without excessive chrome.  
• Dense information that still scans easily.  
• Progressive disclosure.  
• Strong navigation and workspace organization.  
• Contextual actions instead of permanent button clutter.  
• Restrained use of borders, elevation, color, and radius.  
• Fast keyboard-friendly interactions.

Clayface must not visually resemble a generic AI generator. Avoid oversized prompt-first layouts, novelty gradients, decorative glass effects, excessive rounded cards, and empty marketing-style space inside the working editor.

Product personality  
• Calm.  
• Exact.  
• Functional.  
• Modern.  
• Confident.  
• Neutral enough that user designs remain the visual focus.

The interface should communicate that Clayface understands systems, not merely prompts.

# FOUNDATIONS

Typography  
• Choose a highly legible UI sans-serif for the product.  
• Use a restrained type scale optimized for application density.  
• Hierarchy should rely on weight, size, spacing, and placement rather than decorative color.

Color  
• Neutral application surfaces dominate.  
• Accent color is reserved for selection, primary actions, focus, and meaningful status.  
• Semantic colors must be tokenized.  
• Generated-design colors must never leak into the product chrome.

Spacing  
• Use a consistent base spacing scale.  
• Editor chrome may use tighter spacing than documentation/settings views.  
• Avoid arbitrary one-off gaps.

Radius and borders  
• Prefer modest radius.  
• Use borders and tonal surface shifts before shadows.  
• Reserve elevation for overlays, floating menus, and surfaces that truly sit above others.

Layout  
• Stable top bar.  
• Left navigation/tree.  
• Expandable central canvas.  
• Contextual right inspector.  
• Screens such as Design System may replace the canvas with full-width structured views.

Icons  
• One coherent icon family.  
• Icons support labels; they should not create ambiguous icon-only workflows.

Tokens  
All Clayface product styling must be expressed through the Clayface product design-system tokens so the product itself becomes a reference implementation.

# ACCESSIBILITY & MOTION

Accessibility requirements  
• Keyboard navigation for primary workflows.  
• Visible focus states.  
• Semantic controls before custom div-based interactions.  
• Accessible labels for icon buttons.  
• Sufficient text/background contrast.  
• Do not encode meaning through color alone.  
• Support reduced-motion preferences.  
• Menus, dialogs, comboboxes, tabs, tooltips, tree navigation, and selection surfaces must follow accessible interaction patterns.  
• Canvas selection must have an alternate navigable representation in the page/component tree where practical.

Motion  
• Motion explains state or relationship; it is not decoration.  
• Keep editor transitions short and predictable.  
• Avoid movement that shifts the canvas unexpectedly.  
• Generation progress can animate subtly but must remain readable as static state.  
• Respect prefers-reduced-motion globally.

Quality rule  
Accessibility is part of the product design standard Clayface claims to provide, not a post-MVP cleanup task.

# VISUAL SYSTEM V1

Status: Working baseline for Clayface product UI. This is not a finished brand guide; it is the minimum concrete system required before rebuilding high-fidelity screens.

Design intent  
Clayface should feel like a serious design/productivity application: calm, dense, structured, and exceptionally deliberate. The visual system should support long working sessions without competing with the user's generated designs.

Reference direction  
Borrow interaction principles from Notion and Airtable:  
• restrained surfaces,  
• clear hierarchy,  
• compact controls,  
• strong information architecture,  
• predictable panels,  
• contextual actions.

Do not copy their branding, exact colors, typography, or component shapes.

Typography  
Recommended product UI family:  
Inter, Geist, or another neutral high-legibility variable sans. Pick one and use it consistently before visual implementation expands.

Baseline type roles:  
• Product/page title: 24–28px, medium/semibold.  
• Section heading: 18–20px, medium.  
• Panel heading: 13–14px, medium/semibold.  
• Default UI/body: 13–14px.  
• Supporting/metadata: 12px.  
• Compact control label: 12–13px.

Principles:  
• Avoid oversized marketing typography inside the application.  
• Use line-height that favors scanability.  
• Keep weights restrained; do not make every label semibold.

Spacing  
Use a 4px base scale.

Suggested semantic steps:  
2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48\.

Typical usage:  
• compact icon/control gap: 4–6.  
• control internal gap: 6–8.  
• panel row spacing: 8–12.  
• section spacing inside settings views: 20–24.  
• large workspace separation: 32+.

Surfaces  
Suggested roles:  
• app background,  
• panel background,  
• elevated/popover background,  
• canvas surround,  
• selected/active surface,  
• hover surface,  
• muted surface.

Clayface should rely primarily on subtle tonal differences and borders rather than card shadows.

Borders  
• Default: 1px neutral border.  
• Strong divider only where hierarchy genuinely needs it.  
• Selection border uses accent.  
• Avoid wrapping every settings group in a bordered card.

Radius  
Keep radii modest.  
Suggested families:  
• small: 4px,  
• control: 6px,  
• medium: 8px,  
• overlay: 10–12px.

Do not default to large 16–24px SaaS card radii.

Color model  
Product chrome should be predominantly neutral.

Token roles:  
• bg.canvas  
• bg.app  
• bg.panel  
• bg.elevated  
• fg.primary  
• fg.secondary  
• fg.muted  
• border.default  
• border.strong  
• accent.primary  
• accent.hover  
• accent.subtle  
• state.success  
• state.warning  
• state.danger  
• state.info

The actual accent should be chosen during brand refinement, but it should not dominate the editor.

Panel geometry  
Desktop starting assumptions:  
• top bar: approximately 44–52px.  
• left sidebar: approximately 220–260px, collapsible.  
• right inspector: approximately 280–340px, collapsible.  
• canvas uses remaining space.  
• minimum useful editor width should be defined during prototype review.

Controls  
• Default controls should be compact.  
• Primary buttons are visually clear but not oversized.  
• Secondary actions should often be text/icon or neutral buttons.  
• Destructive actions use explicit danger treatment only at the action point.  
• Icon-only buttons require tooltip/accessible name.

Selection  
Canvas selection should use a dedicated editor accent treatment that never becomes part of the rendered design.

Dark mode  
Do not make dark mode an MVP blocker unless the existing product already depends on it. Architect tokens so it can be added later without component rewrites.

Implementation requirement  
Clayface product UI itself must use tokens, shared primitives, and documented states. One-off style values should be treated as a design-system defect unless justified.

Review requirement  
Before high-fidelity rebuild:  
• implement the app shell,  
• one settings/design-system screen,  
• one populated inspector,  
• one empty state,  
• one destructive dialog,  
then review visual consistency before expanding the UI.

# DESIGN QUALITY RUBRIC

Purpose  
Schema validity is not design quality. Every benchmark generation should receive a repeatable visual review.

Scoring  
Each category is scored from 1 to 5\.

1 \= unacceptable / clearly broken.  
2 \= weak / requires major redesign.  
3 \= competent / usable but ordinary.  
4 \= strong / polished and intentional.  
5 \= exceptional / reference-quality for supported scope.

A direction must not ship internally if any critical category scores below 3\.

1\. Visual hierarchy  
Review:  
• Is the primary message/action obvious?  
• Are headings, supporting content, and secondary actions clearly differentiated?  
• Does the page have intentional focal points?

Failure examples:  
everything has equal weight; too many competing CTAs; hierarchy depends only on font size.

2\. Spacing and rhythm  
Review:  
• Are section gaps intentional?  
• Are internal component gaps consistent?  
• Is density appropriate?  
• Does the page breathe without wasting space?

Failure examples:  
random gaps; repeated identical vertical spacing everywhere; overly loose AI-style layout.

3\. Typography  
Review:  
• Does type scale feel coherent?  
• Are line lengths appropriate?  
• Are weight and line-height controlled?  
• Does typography fit the project design system?

4\. Composition  
Review:  
• Are sections ordered logically?  
• Does the page vary rhythm without becoming chaotic?  
• Are components used in context rather than as isolated showcase blocks?  
• Does the composition fit the page intent?

5\. Component consistency  
Review:  
• Do controls/components feel from one system?  
• Do repeated elements use consistent patterns?  
• Are local overrides creating accidental visual drift?

6\. Content-to-layout fit  
Review:  
• Does the selected component fit the actual amount and type of content?  
• Is content unnaturally truncated or padded?  
• Are images/media used because they help rather than because a template expects them?

7\. Design-system fidelity  
Review:  
• Does the result clearly reflect the project's tokens and component rules?  
• Would a different design system produce a meaningfully different result?  
• Are unsupported local values leaking in?

8\. Responsiveness  
Review:  
• Does hierarchy survive smaller widths?  
• Do compositions adapt rather than merely shrink?  
• Are controls and media usable across supported breakpoints?

9\. Accessibility  
Review:  
• Contrast.  
• focus behavior.  
• semantic controls.  
• readable content.  
• keyboard interaction for functional UI.  
• no color-only meaning.

10\. Distinctiveness  
Review:  
• Does the direction have a coherent identity?  
• Is it materially different from the project's other directions?  
• Does variation extend beyond palette and border radius?

Direction-level pass criteria  
Recommended initial rule:  
• no critical category below 3,  
• average at least 3.5,  
• Design-system fidelity at least 4,  
• Component consistency at least 4,  
• Accessibility at least 3,  
• Distinctiveness between directions explicitly reviewed.

Benchmark process  
Maintain a stable set of generation briefs. For generator/component changes:  
1\. Generate benchmark directions.  
2\. Capture screenshots at supported breakpoints.  
3\. Review with this rubric.  
4\. Compare against previous output.  
5\. Record regressions.  
6\. Do not merge a generator change that improves one metric while materially degrading overall design quality without an explicit decision.

Future automation  
Some dimensions can later gain automated checks:  
• contrast,  
• spacing/token violations,  
• responsive overflow,  
• duplicate component patterns,  
• content length mismatch,  
• direction similarity.

Human visual review remains necessary for hierarchy, composition, and taste during MVP.

# INTERFACE

This section defines the stable app shell and the major product workspaces: the editor/canvas environment and the full Design System workspace.

# APP SHELL

Top bar  
• Clayface/product mark.  
• Project name.  
• Active direction.  
• Preview control.  
• Export/handoff control when available.  
• Overflow/project actions.  
• Account menu.

Left rail / sidebar  
• Pages.  
• Designs.  
• Components.  
• Design System.  
• Assets.  
• Optional source/import entry.  
• Collapsible to increase canvas space.

Center  
• Default editor canvas or the active full-screen project tool.

Right panel  
• Context-sensitive inspector.  
• Hidden or repurposed on screens that do not need node inspection.

Behavior  
• Navigation selection is persistent across reloads where reasonable.  
• Keyboard shortcuts should never conflict with browser-critical behavior.  
• Panels can collapse.  
• The canvas should not jump when a transient toast or status message appears.

The shell should feel stable. The content inside it changes; the workspace frame should rarely surprise the user.

# EDITOR WORKSPACE

Canvas  
• Render from Clayface IR through the same renderer used for final preview.  
• Support desktop viewport first, with additional viewport presets as MVP permits.  
• Zoom and fit-to-view controls.  
• Clear selected-node outline that is not part of exported UI.

Page tree  
• Shows page hierarchy and component/node structure at an understandable level.  
• Supports selection and basic reordering where the operation is valid.  
• Should not expose low-value implementation wrappers.

Inspector  
Primary groups:  
• Component.  
• Variant.  
• Content.  
• Layout.  
• Appearance / supported token overrides.  
• Responsive behavior when exposed.

Editing rules  
• Changes are expressed as typed IR operations.  
• Invalid combinations should be disabled or explained before submission.  
• Component swaps preserve compatible content where possible.  
• Unsupported arbitrary CSS is not the default editing surface.  
• Direction-level changes remain separate from project design-system changes.

The editor is a constrained system editor, not a browser devtools clone  
DEEP REVIEW

Editor mental model  
The editor is not a freeform graphics canvas. It is a structured composition editor. This distinction should be visible in interaction design.

Selection model  
Every visible editable region must map back to a stable Clayface node. Selection should work from:  
• canvas click,  
• page/component tree,  
• search/command palette when appropriate.

Selecting a node should make its scope obvious:  
• instance,  
• composition,  
• page,  
• or project design system.

Inspector architecture  
The inspector should derive controls from component metadata rather than hand-coding a unique settings form for every component. Registry metadata can expose:  
• editable props,  
• allowed variants,  
• token override groups,  
• content slots,  
• layout controls,  
• constraints,  
• help text.

This creates a scalable inspector system.

Change propagation  
Every edit needs a defined propagation scope.

Instance change:  
Only this node.

Direction change:  
Applies to the active direction where the structure is shared.

Project design-system change:  
Can affect multiple directions if they are updated to that design-system version.

The UI must never make a project-wide change feel like a local tweak.

Undo/redo  
Implement editor operations as commands with inverse operations where feasible. This gives a clean path to local undo/redo without storing entire IR snapshots for every keystroke.

Raw escape hatches  
Avoid raw CSS as a default control. If an expert escape hatch is introduced later, isolate it so:  
• generated output remains valid,  
• unsafe properties can be blocked,  
• migrations remain possible,  
• and Clayface can label the node as customized outside normal guarantees.

Review questions  
• Can a user understand why a control is unavailable?  
• Can content survive a component swap?  
• Can the editor represent all first-slice changes without touching raw DOM?  
• Does a project-wide edit clearly communicate impact?  
• Can a failed save recover without losing local state?

Revision trigger  
If the inspector becomes dominated by component-specific special cases, improve registry metadata/schema before adding more UI exceptions.  
.

# DESIGN SYSTEM WORKSPACE

Purpose  
Provide a first-class place to understand and manage the project's visual rules without squeezing everything into the node inspector.

Suggested internal navigation  
Overview | Foundations | Components | Patterns

Foundations  
• Colors.  
• Typography.  
• Spacing.  
• Sizing.  
• Radius.  
• Borders.  
• Shadows.  
• Breakpoints.  
• Motion.  
• Icon policy.

Components  
• Registered project components.  
• Default variants.  
• Allowed/blocked variants.  
• Token bindings.  
• Status and compatibility.

Patterns  
• Layout defaults.  
• Container rules.  
• Section spacing.  
• Density.  
• Page-family behavior.

UX rules  
• Show token names and useful human labels.  
• Preview effects before destructive propagation where needed.  
• Distinguish inherited values from local overrides.  
• Make project-wide impact obvious.  
• Keep advanced raw JSON available as an expert/import-export surface, not the primary editor.

# COMPONENT SYSTEM

This section defines the reusable primitives, components, compositions, registry metadata, and versioning rules that make high-quality constrained generation possible.

# COMPONENT TAXONOMY

Clayface components are organized in three layers.

Layer 1 — Primitives  
Examples: Button, Input, Text, Heading, Badge, Avatar, IconButton, Divider, Container, Stack, Grid.  
Purpose: small stable interaction and layout building blocks. Primitives are rarely selected directly by the generator for full-page composition.

Layer 2 — Components  
Examples: Navbar, Sidebar, Search Bar, Data Table, Product Card, Pricing Card, Filter Panel, Modal, Command Menu.  
Purpose: reusable interface structures with explicit props, variants, constraints, accessibility behavior, and responsive rules.

Layer 3 — Compositions  
Examples: SaaS hero, editorial hero, analytics dashboard header, ecommerce product grid, settings layout, checkout section.  
Purpose: higher-order assemblies that let Clayface create good pages without composing dozens of tiny primitives from scratch.

Additional classification metadata  
• Category.  
• Product/page family.  
• Content density.  
• Visual character.  
• Responsive suitability.  
• Required content.  
• Optional content.  
• Allowed children.  
• Compatible design-system capabilities.  
• Accessibility requirements.

Generation preference  
Prefer proven compositions for high-level page construction, then use components/primitives to adapt details. This reduces incoherent combinations and improves repeatability.

# REGISTRY & METADATA

The Component Registry is the authoritative catalog of everything the generator may use.

Each entry should include:  
• Stable component ID.  
• Semantic version.  
• Layer: primitive, component, composition.  
• Category.  
• Available variants.  
• Prop schema.  
• Required and optional content slots.  
• Supported token bindings.  
• Responsive behavior.  
• Compatibility rules.  
• Intended page/product types.  
• Accessibility guarantees.  
• Renderer reference.  
• Migration information when versions change.

Example conceptual entry

id: marketing.hero.split  
version: 4  
category: hero  
variants: balanced, editorial, image-heavy, minimal  
intendedFor: saas, agency, technology  
requiredContent: heading  
optionalContent: eyebrow, description, primaryAction, secondaryAction, media  
constraints: maximum two actions; heading length guidance  
supports: responsive, dark mode when design-system contrast rules pass

Registry rules  
• IDs never change silently.  
• A variant is not just a visual name; it must map to tested implementation behavior.  
• The registry must be queryable by the generation engine without loading every implementation bundle.  
• Metadata and implementation can be deployed separately as long as versions stay consistent.  
• Removed components remain resolvable for historical projects until migration is intentionally performed  
DEEP REVIEW

Registry architecture  
Separate registry metadata from component implementation. The generation engine should be able to answer “which components are valid?” without importing React bundles.

Recommended metadata dimensions  
Identity:  
• id,  
• version,  
• lifecycle status.

Semantics:  
• category,  
• page roles,  
• product families,  
• content roles.

Visual behavior:  
• density,  
• emphasis,  
• media balance,  
• alignment behavior,  
• supported design-system features.

Structural behavior:  
• child slots,  
• allowed child categories,  
• repetition rules,  
• maximum/minimum counts.

Content contract:  
• required fields,  
• optional fields,  
• recommended length ranges,  
• supported asset types.

Compatibility:  
• required tokens,  
• supported themes,  
• container requirements,  
• breakpoint behavior,  
• incompatible peers or layouts where necessary.

Quality metadata  
Eventually record:  
• internal quality status,  
• visual-review status,  
• accessibility status,  
• responsive test status,  
• production usage confidence.

Do not use a single vague “score” to hide unreviewed components.

Variant discipline  
A variant should represent a meaningful structural or behavioral alternative. If two variants differ only by token values that the design system already controls, they should probably be the same variant.

Search strategy  
Generation should query the registry in stages:  
1\. hard eligibility filters,  
2\. semantic fit,  
3\. design-system compatibility,  
4\. diversity rules,  
5\. optional ranking.

This is easier to debug than an opaque single recommendation score.

Registry review  
Before a component becomes generator-eligible:  
• implementation exists,  
• metadata validates,  
• responsive behavior is tested,  
• accessibility expectations pass,  
• at least one supported design system renders correctly,  
• and visual review confirms it meets Clayface quality.

Revision trigger  
If generation rules begin depending on many hard-coded component IDs, the metadata vocabulary is insufficient and the registry schema should be expanded.  
.

# COMPONENT VERSIONING

Why versioning is required  
A component implementation may change months after projects were generated. Old projects must not unexpectedly change or break because the global component library changed.

Canonical reference  
Each IR node references a stable component ID plus version and optional variant.

Example  
component: marketing.hero.split  
version: 4  
variant: editorial

Policy  
• Patch releases may fix non-visual bugs only when they preserve output contract.  
• Visual or behavioral changes that may alter existing output require a new compatible version.  
• Breaking prop/schema changes require migration logic or an intentionally separate major version.  
• Generated directions remain pinned to the component versions used when created.  
• Users may later opt into migrations; MVP does not need a complex migration UI.  
• Registry metadata must expose deprecated status without making historical projects invalid.

Storage  
Do not copy component source into every project. Store references and the small set of project-level props/overrides.

# CANONICAL COMPONENT CATALOG

Purpose

This catalog defines the reusable web-interface vocabulary Clayface should eventually understand. It is intentionally broader than the MVP component library. The MVP does not need to implement every item immediately, but the taxonomy should be designed so future components fit cleanly without inventing new architectural concepts.

Important distinction

This is not a flat list of React components.

Each entry can exist at one or more levels:  
• Primitive — atomic visual or interaction building block.  
• Component — reusable functional UI unit.  
• Composite component — multiple components operating as one reusable unit.  
• Section — page-level region with a clear semantic purpose.  
• Pattern — recurring multi-section or application workflow.  
• Domain component — specialized component for a particular business/product category.

Clayface should distinguish semantic identity from implementation. For example:  
“Search” is a semantic capability.  
It may render as a search field, command palette, global search overlay, mobile search sheet, or filterable search toolbar depending on context.

Coverage rule

The catalog should cover:  
• structural layout,  
• navigation,  
• text/content,  
• media,  
• forms,  
• data display,  
• feedback,  
• overlays,  
• commerce,  
• identity/account,  
• marketing,  
• application UI,  
• communication,  
• scheduling,  
• maps/location,  
• files,  
• developer/productivity interfaces,  
• accessibility/utility surfaces,  
• and domain-specific extensions.

The generator should never assume that every component is valid for every project. Registry metadata determines eligibility.

Component maturity states

Proposed — known component family but not implemented.  
Implemented — renderer exists.  
Reviewed — design and behavior reviewed.  
Generator-ready — registry metadata, responsiveness, accessibility, and quality checks pass.  
Deprecated — historical versions remain resolvable but should not be selected for new output.

Catalog principle

A component family should be added when it represents a reusable semantic pattern. Do not create separate catalog entries merely for cosmetic differences that belong to variants or design-system tokens.

The following subtabs define the canonical inventory.

# LAYOUT & FOUNDATIONS

Document / page foundations  
• Page  
• App shell  
• Document shell  
• Section  
• Region  
• Main content  
• Aside  
• Header region  
• Footer region  
• Content wrapper  
• Full-bleed wrapper  
• Viewport container  
• Safe-area container  
• Scroll container  
• Sticky region  
• Fixed region  
• Portal root  
• Layer / overlay root

Containers  
• Container  
• Max-width container  
• Fluid container  
• Centered container  
• Narrow reading container  
• Wide dashboard container  
• Bleed container  
• Inset container  
• Card container  
• Surface / panel  
• Well  
• Box  
• Frame

Layout primitives  
• Stack  
• Inline stack  
• Cluster  
• Row  
• Column  
• Flex container  
• Grid  
• Auto-grid  
• Masonry grid  
• Split layout  
• Sidebar layout  
• Holy-grail layout  
• Center layout  
• Cover layout  
• Switcher layout  
• Reel / horizontal scroller  
• Wrap layout  
• Aspect-ratio box  
• Spacer  
• Gap  
• Divider  
• Separator  
• Vertical rule  
• Horizontal rule

Responsive structures  
• Responsive container  
• Responsive stack  
• Responsive grid  
• Breakpoint switcher  
• Adaptive sidebar  
• Collapsible pane  
• Resizable pane  
• Split pane  
• Multi-pane layout  
• Master-detail layout  
• Drawer layout  
• Off-canvas layout  
• Mobile bottom sheet layout

Surfaces  
• Card  
• Elevated card  
• Outline card  
• Filled card  
• Interactive card  
• Selectable card  
• Expandable card  
• Stat card  
• Media card  
• Profile card  
• Setting card  
• Panel  
• Inspector panel  
• Sidebar panel  
• Toolbar surface  
• Floating surface  
• Dock  
• Tray

Spacing / visual structure  
• Divider with label  
• Section divider  
• Inset separator  
• Group  
• Field group  
• Control group  
• Button group  
• Segmented group  
• Toolbar group

Foundation primitives  
• Icon  
• Icon container  
• Avatar  
• Avatar group  
• Logo  
• Brand mark  
• Badge  
• Pill  
• Tag  
• Chip  
• Token / lozenge  
• Status dot  
• Presence dot  
• Counter badge  
• Notification badge  
• Keyboard key / kbd  
• Code token  
• Swatch  
• Color well  
• Handle / drag handle  
• Grip  
• Resize handle  
• Selection outline  
• Focus ring

Spatial compositions  
• Two-column content  
• Three-column content  
• Content \+ aside  
• Media \+ text split  
• Text \+ form split  
• Sidebar \+ workspace  
• Sidebar \+ table  
• Sidebar \+ detail  
• Toolbar \+ canvas \+ inspector  
• Header \+ body \+ footer  
• Dashboard grid  
• Bento grid  
• Comparison grid  
• Card deck  
• Feature grid  
• Logo grid  
• Gallery grid  
• Timeline layout  
• Feed layout

Generator notes

Layout primitives should carry semantic constraints, not raw CSS-only meaning. For example, “split layout” can resolve to grid/flex implementation but exposes content ratio, alignment, collapse behavior, and breakpoint rules in Clayface terms.

# NAVIGATION

Global navigation  
• Top navigation bar  
• App navbar  
• Marketing navbar  
• Transparent navbar  
• Sticky navbar  
• Floating navbar  
• Centered-logo navbar  
• Split navbar  
• Mega navigation  
• Utility navigation  
• Secondary navigation  
• Mobile navigation  
• Hamburger menu  
• Full-screen navigation  
• Bottom navigation  
• Mobile tab bar  
• Dock navigation

Side navigation  
• Sidebar  
• Collapsible sidebar  
• Icon sidebar  
• Rail navigation  
• Nested sidebar  
• Sectioned sidebar  
• Workspace switcher sidebar  
• Project navigator  
• File/page tree  
• Folder tree  
• Tree navigation  
• Navigation drawer

Local navigation  
• Tabs  
• Underline tabs  
• Pill tabs  
• Vertical tabs  
• Scrollable tabs  
• Closable tabs  
• Browser-style tabs  
• Segmented control  
• View switcher  
• Subnavigation  
• Section navigation  
• Anchor navigation  
• Table of contents  
• On-page navigation  
• Scrollspy navigation

Path / hierarchy  
• Breadcrumbs  
• Collapsed breadcrumbs  
• Path bar  
• Location bar  
• Parent link  
• Back link  
• Back button  
• Up-one-level control

Pagination  
• Pagination  
• Compact pagination  
• Cursor pagination  
• Load more  
• Infinite-scroll sentinel  
• Previous / next navigation  
• Step pagination  
• Carousel pagination dots  
• Page-size control

Search / discovery navigation  
• Global search  
• Search bar  
• Search trigger  
• Search overlay  
• Command palette  
• Command menu  
• Spotlight search  
• Omnibox  
• Quick switcher  
• Jump-to menu  
• Recent items menu

Menus  
• Menu  
• Dropdown menu  
• Context menu  
• Action menu  
• Overflow menu  
• Kebab menu  
• User/account menu  
• Split-button menu  
• Mega menu  
• Submenu  
• Nested menu  
• Navigation menu  
• Radial menu (specialized)  
• Menubar

Progress navigation  
• Stepper  
• Wizard steps  
• Progress steps  
• Checkout steps  
• Onboarding progress  
• Form progress navigation  
• Timeline navigation

Content navigation  
• Previous article / next article  
• Related content navigation  
• Category navigation  
• Topic chips  
• Tag navigation  
• Alphabet index  
• Archive navigation  
• Faceted category navigation

Media navigation  
• Carousel controls  
• Gallery thumbnails  
• Thumbnail rail  
• Lightbox navigation  
• Media playlist  
• Chapter navigation

Special navigation  
• Map navigation controls  
• Calendar view switcher  
• Dashboard view switcher  
• Board/list/grid switcher  
• Workspace switcher  
• Organization switcher  
• Language switcher  
• Currency switcher  
• Theme switcher  
• Density switcher  
• Device/viewport switcher

Navigation state requirements  
Every navigation component should define:  
• active state,  
• hover/focus,  
• disabled state where valid,  
• collapsed state where valid,  
• mobile behavior,  
• overflow behavior,  
• keyboard behavior,  
• current-page semantics,  
• badge/count support where relevant.

# TYPOGRAPHY & CONTENT

Text primitives  
• Text  
• Paragraph  
• Lead paragraph  
• Small text  
• Caption  
• Overline  
• Eyebrow  
• Label  
• Helper text  
• Muted text  
• Strong text  
• Emphasis  
• Highlight / mark  
• Inline code  
• Code block  
• Preformatted text  
• Keyboard shortcut  
• Superscript  
• Subscript

Headings  
• Display heading  
• H1  
• H2  
• H3  
• H4  
• H5  
• H6  
• Section title  
• Card title  
• Panel title  
• Page title  
• Dialog title  
• Empty-state title

Rich content  
• Rich text  
• Markdown renderer  
• Article body  
• Prose renderer  
• Blockquote  
• Pull quote  
• Citation  
• Footnote  
• Definition list  
• Ordered list  
• Unordered list  
• Nested list  
• Checklist  
• Task list  
• Description list

Content metadata  
• Author byline  
• Author card  
• Publish date  
• Updated date  
• Reading time  
• Category label  
• Tag list  
• Topic list  
• View count  
• Comment count  
• Share count  
• Reaction count  
• Status label  
• Version label  
• Last-updated indicator

Content units  
• Article card  
• Blog card  
• News card  
• Story card  
• Resource card  
• Documentation card  
• Link preview  
• Bookmark card  
• Quote card  
• Testimonial quote  
• Review excerpt  
• FAQ item  
• Accordion content item  
• Glossary term  
• Definition item

Editorial structures  
• Article header  
• Article footer  
• Author bio  
• Related articles  
• Related resources  
• Recommended content  
• Contents summary  
• Key takeaways  
• Summary box  
• Note  
• Tip  
• Warning note  
• Important callout  
• Info callout  
• Example block  
• Aside note

Code/documentation  
• Syntax-highlighted code block  
• Copy-code button  
• Line-number gutter  
• Code diff  
• File tree  
• API endpoint block  
• Request example  
• Response example  
• Property table  
• Parameter table  
• Version badge  
• Method badge  
• Interactive code sample  
• Terminal block  
• Package-install command  
• Language/framework tabs

Social/content engagement  
• Like button  
• Reaction picker  
• Share button  
• Share menu  
• Bookmark/save button  
• Follow button  
• Subscribe control  
• Comment thread  
• Comment  
• Reply  
• Mention  
• Hashtag  
• Social proof line  
• Rating summary

Text overflow / disclosure  
• Truncated text  
• Read more  
• Expand/collapse text  
• Clamp  
• Spoiler  
• Redacted text  
• Sensitive-content reveal

# MEDIA & VISUALS

Images  
• Image  
• Responsive image  
• Background image  
• Hero image  
• Thumbnail  
• Avatar image  
• Product image  
• Cover image  
• Banner image  
• Logo image  
• Icon image  
• Decorative image  
• Figure  
• Figure caption  
• Image with overlay  
• Image comparison  
• Before/after slider  
• Zoomable image  
• Pan-and-zoom image

Image collections  
• Gallery  
• Masonry gallery  
• Grid gallery  
• Carousel gallery  
• Thumbnail gallery  
• Lightbox gallery  
• Product media gallery  
• Slideshow  
• Image stack  
• Collage  
• Contact sheet

Video  
• Video player  
• Autoplay background video  
• Inline video  
• Hero video  
• Video thumbnail  
• Video poster  
• Video modal  
• Playlist  
• Chapter list  
• Captions/subtitles  
• Playback controls  
• Picture-in-picture control  
• Live stream player  
• Recorded stream player

Audio  
• Audio player  
• Podcast player  
• Waveform  
• Audio timeline  
• Playlist  
• Volume control  
• Playback speed control  
• Transcript  
• Mini player

Documents/files preview  
• PDF viewer  
• Document viewer  
• Spreadsheet preview  
• Presentation preview  
• File preview card  
• Attachment preview  
• Code file preview  
• Image file preview

Graphics  
• Illustration  
• SVG graphic  
• Decorative shape  
• Pattern  
• Gradient field  
• Background texture  
• Diagram  
• Flowchart  
• Org chart  
• Mind map  
• Network graph  
• Timeline visualization  
• Process diagram

Data visualization  
• Line chart  
• Area chart  
• Bar chart  
• Column chart  
• Stacked bar  
• Stacked area  
• Pie chart  
• Donut chart  
• Scatter plot  
• Bubble chart  
• Histogram  
• Box plot  
• Heatmap  
• Treemap  
• Funnel chart  
• Waterfall chart  
• Gauge  
• Sparkline  
• Radar chart  
• Sankey diagram  
• Cohort chart  
• Candlestick chart  
• Range chart  
• Geographic chart  
• Choropleth  
• Map pins/marker visualization

3D / advanced media  
• 3D model viewer  
• Product 3D viewer  
• Panorama / 360 viewer  
• AR launch control  
• WebGL canvas  
• Interactive scene  
• Model control toolbar

Media utility  
• Download media  
• Fullscreen control  
• Zoom control  
• Rotate control  
• Crop preview  
• Media metadata  
• Upload progress  
• Media processing state  
• Broken-media fallback  
• Alt-text display/edit control

# FORMS & INPUTS

Basic controls  
• Button  
• Primary button  
• Secondary button  
• Tertiary button  
• Ghost button  
• Destructive button  
• Link button  
• Icon button  
• Floating action button  
• Split button  
• Loading button  
• Toggle button

Text input  
• Text field  
• Textarea  
• Password field  
• Email field  
• URL field  
• Telephone field  
• Search field  
• Number field  
• Currency field  
• Percentage field  
• Masked input  
• OTP input  
• PIN input  
• Verification-code input  
• Tag input  
• Token input  
• Mention input  
• Command input  
• Autocomplete text field

Choice controls  
• Checkbox  
• Checkbox group  
• Radio  
• Radio group  
• Switch  
• Toggle  
• Segmented control  
• Select  
• Native select  
• Custom select  
• Multi-select  
• Combobox  
• Autocomplete  
• Listbox  
• Transfer list  
• Tree select  
• Cascader / hierarchical select

Date/time  
• Date input  
• Date picker  
• Date range picker  
• Calendar picker  
• Month picker  
• Year picker  
• Time picker  
• Date-time picker  
• Timezone selector  
• Duration input  
• Recurrence editor  
• Availability picker

Numeric / range  
• Slider  
• Range slider  
• Stepper input  
• Quantity stepper  
• Rating input  
• Dial/knob  
• Price-range input

File/media input  
• File input  
• File uploader  
• Drag-and-drop upload  
• Multi-file uploader  
• Image uploader  
• Avatar uploader  
• Media uploader  
• Camera capture  
• Document scanner input  
• Upload queue

Color/style inputs  
• Color picker  
• Color swatch picker  
• Gradient picker  
• Opacity control  
• Font selector  
• Font-size selector  
• Weight selector  
• Alignment selector  
• Radius selector  
• Icon picker  
• Emoji picker

Location/contact  
• Address input  
• Country selector  
• Region/state selector  
• City selector  
• Postal-code input  
• Phone country-code selector  
• Location autocomplete  
• Coordinates input

Rich input  
• Rich text editor  
• Markdown editor  
• Code editor  
• JSON editor  
• WYSIWYG editor  
• Formula editor  
• Query editor  
• SQL editor  
• Prompt editor  
• Key-value editor  
• Schema editor

Form structure  
• Form  
• Field  
• Field label  
• Field description  
• Help text  
• Validation message  
• Required indicator  
• Optional indicator  
• Fieldset  
• Form section  
• Form group  
• Inline form  
• Multi-step form  
• Wizard  
• Form summary  
• Review step  
• Save bar  
• Sticky form actions

Special controls  
• Signature pad  
• Captcha  
• Consent checkbox  
• Terms acceptance  
• Human-verification challenge  
• Biometric trigger  
• Passkey trigger  
• QR scanner  
• Barcode scanner  
• Voice input  
• Dictation control

Form states  
• Valid  
• Invalid  
• Warning  
• Disabled  
• Read-only  
• Loading  
• Saving  
• Saved  
• Dirty/unsaved  
• Partially complete

# DATA DISPLAY

Tables  
• Table  
• Data table  
• Simple table  
• Comparison table  
• Pricing comparison table  
• Responsive table  
• Virtualized table  
• Editable table  
• Sortable table  
• Filterable table  
• Selectable table  
• Expandable-row table  
• Grouped table  
• Tree table  
• Pivot table  
• Matrix  
• Cross-tab  
• Spreadsheet/grid  
• Data grid  
• Frozen-column grid

Table controls  
• Column header  
• Sort control  
• Filter control  
• Column visibility control  
• Column reorder  
• Column resize  
• Row selection  
• Bulk actions  
• Table toolbar  
• Table pagination  
• Page-size selector  
• Density control  
• Export control

Lists  
• List  
• Simple list  
• Stacked list  
• Divided list  
• Media list  
• Action list  
• Selectable list  
• Reorderable list  
• Virtualized list  
• Ranked list  
• Definition list  
• User list  
• Product list  
• Transaction list  
• Notification list  
• Activity list

Cards/data summaries  
• Stat  
• KPI  
• Metric  
• Metric card  
• Trend card  
• Score card  
• Progress card  
• Summary card  
• Detail card  
• Property list  
• Key-value list  
• Description list  
• Metadata panel  
• Entity summary  
• Record preview

Indicators  
• Progress bar  
• Progress ring  
• Meter  
• Gauge  
• Status badge  
• Status indicator  
• Health indicator  
• SLA indicator  
• Trend indicator  
• Delta indicator  
• Positive/negative change  
• Confidence indicator  
• Risk indicator

Timelines / activity  
• Timeline  
• Vertical timeline  
• Horizontal timeline  
• Activity feed  
• Audit log  
• Event log  
• Changelog  
• Version history  
• History panel  
• Step history

Trees / hierarchy  
• Tree  
• Tree view  
• File tree  
• Folder tree  
• Org tree  
• Nested list  
• Hierarchy browser  
• Dependency tree  
• Outline  
• Document outline

Boards / workflow  
• Kanban board  
• Board column  
• Swimlane  
• Task card  
• Pipeline board  
• Status board  
• Roadmap board  
• Backlog list  
• Sprint board

Calendar/schedule display  
• Calendar  
• Month view  
• Week view  
• Day view  
• Agenda  
• Schedule  
• Resource calendar  
• Timeline calendar  
• Gantt chart  
• Booking calendar  
• Availability grid

Data exploration  
• Filter bar  
• Filter chip  
• Active filter summary  
• Facet list  
• Search results  
• Result count  
• Saved view  
• View preset  
• Group-by control  
• Sort menu  
• Query summary  
• Empty result state

Structured detail  
• Detail page  
• Record detail  
• Property panel  
• Inspector  
• Entity header  
• Summary header  
• Profile details  
• Definition grid

# FEEDBACK & OVERLAYS

Feedback  
• Alert  
• Inline alert  
• Banner alert  
• Success message  
• Error message  
• Warning message  
• Info message  
• Validation summary  
• Status message  
• System status  
• Maintenance banner  
• Announcement banner  
• Update available banner

Notifications  
• Toast  
• Snackbar  
• Notification  
• Notification center  
• Notification popover  
• Inbox notification  
• Push-permission prompt  
• Unread indicator

Loading  
• Spinner  
• Progress bar  
• Determinate progress  
• Indeterminate progress  
• Skeleton  
• Shimmer skeleton  
• Placeholder  
• Loading overlay  
• Lazy-load placeholder  
• Content loader  
• Button loading state  
• Page loading state  
• Route transition indicator

Empty/error  
• Empty state  
• First-use state  
• No-results state  
• No-permission state  
• Offline state  
• 404 state  
• 403 state  
• 500 state  
• Service unavailable state  
• Deleted-resource state  
• Expired-link state  
• Rate-limit state  
• Unsupported-browser state

Dialogs  
• Modal  
• Dialog  
• Alert dialog  
• Confirmation dialog  
• Destructive confirmation  
• Form dialog  
• Full-screen dialog  
• Multi-step dialog  
• Lightbox  
• Preview modal

Popovers  
• Popover  
• Tooltip  
• Hover card  
• Toggletip  
• Teaching bubble  
• Coach mark  
• Guided-tour step  
• Context panel  
• Flyout  
• Callout

Sheets / drawers  
• Drawer  
• Side sheet  
• Bottom sheet  
• Top sheet  
• Inspector drawer  
• Filter drawer  
• Mobile action sheet  
• Command sheet

Disclosure  
• Accordion  
• Disclosure  
• Expand/collapse  
• Details/summary  
• Collapsible section  
• Show more  
• Progressive disclosure  
• Expandable row

Progress / workflow feedback  
• Stepper  
• Completion indicator  
• Upload progress  
• Import progress  
• Background-job status  
• Sync status  
• Saving state  
• Saved state  
• Conflict state  
• Retry control  
• Cancel-job control

Consent / permissions  
• Cookie banner  
• Cookie preferences modal  
• Permission prompt  
• Location permission explanation  
• Camera/microphone permission prompt  
• Notification permission explanation  
• Age confirmation  
• Legal acceptance dialog

# COMMERCE

Catalog / discovery  
• Product card  
• Product tile  
• Product list item  
• Product grid  
• Product carousel  
• Collection card  
• Category card  
• Brand card  
• Featured-product card  
• Product comparison  
• Recently viewed  
• Recommended products  
• Related products  
• Frequently bought together  
• Bundle card

Product detail  
• Product header  
• Product media gallery  
• Product title  
• Price  
• Compare-at price  
• Sale price  
• Discount badge  
• Unit price  
• Availability  
• Stock status  
• SKU  
• Variant selector  
• Color swatches  
• Size selector  
• Quantity selector  
• Add-to-cart  
• Buy-now button  
• Wishlist control  
• Product description  
• Product specifications  
• Product options  
• Personalization fields  
• Product reviews  
• Rating summary  
• Shipping estimate  
• Pickup availability  
• Store availability  
• Size guide  
• Fit guide

Cart  
• Cart icon  
• Cart badge  
• Mini cart  
• Cart drawer  
• Cart page  
• Cart item  
• Cart summary  
• Quantity editor  
• Remove item  
• Save for later  
• Promo code field  
• Gift-card field  
• Shipping estimator  
• Tax estimate  
• Free-shipping progress  
• Upsell block  
• Cross-sell block

Checkout  
• Checkout shell  
• Checkout steps  
• Contact information  
• Shipping address  
• Billing address  
• Shipping method  
• Delivery option  
• Pickup option  
• Payment method  
• Card form  
• Wallet payment  
• Bank payment option  
• Buy-now-pay-later option  
• Gift message  
• Order notes  
• Order summary  
• Taxes/fees breakdown  
• Place-order button  
• Checkout validation  
• Order confirmation

Orders/account  
• Order list  
• Order card  
• Order details  
• Order timeline  
• Shipment tracking  
• Tracking map  
• Invoice  
• Receipt  
• Refund status  
• Return request  
• Return status  
• Reorder  
• Download invoice

Subscription commerce  
• Subscription selector  
• Delivery frequency  
• Subscription status  
• Pause subscription  
• Skip delivery  
• Change plan  
• Cancel subscription  
• Upcoming shipment

Marketplace  
• Seller card  
• Seller profile  
• Seller rating  
• Marketplace listing  
• Offer/bid control  
• Seller filters  
• Buyer/seller messaging  
• Escrow/payment status

Booking/services  
• Service card  
• Service selector  
• Staff/provider selector  
• Appointment calendar  
• Time-slot picker  
• Booking summary  
• Deposit payment  
• Booking confirmation  
• Reschedule/cancel controls

Pricing  
• Pricing card  
• Pricing table  
• Plan selector  
• Billing-frequency toggle  
• Feature comparison  
• Add-on selector  
• Usage pricing estimator  
• Enterprise contact CTA

# AUTH, ACCOUNT & SETTINGS

Authentication  
• Sign-in form  
• Sign-up form  
• Social sign-in buttons  
• SSO button  
• Email magic-link form  
• Passwordless login  
• Passkey login  
• OTP verification  
• MFA challenge  
• Authenticator setup  
• SMS verification  
• Recovery-code display/input  
• Forgot-password form  
• Reset-password form  
• Verify-email state  
• Invite acceptance  
• Session-expired state  
• Reauthentication prompt

Profile  
• User avatar  
• Profile header  
• Profile card  
• Profile form  
• Display-name field  
• Username field  
• Bio  
• Contact information  
• Social links  
• Profile completeness  
• Public/private profile toggle

Account  
• Account overview  
• Email management  
• Phone management  
• Password change  
• Passkey management  
• Connected accounts  
• Active sessions  
• Device list  
• Session revoke  
• Account export  
• Account deletion  
• Deactivation control

Preferences  
• General settings  
• Appearance settings  
• Theme selector  
• Language selector  
• Locale selector  
• Timezone selector  
• Date/time format  
• Density setting  
• Accessibility settings  
• Notification preferences  
• Email preferences  
• Privacy preferences

Security  
• Security overview  
• MFA settings  
• Login history  
• Security event list  
• API token list  
• API token create/revoke  
• Recovery methods  
• Trusted devices

Organization/workspace  
• Organization switcher  
• Workspace switcher  
• Member list  
• Invite member  
• Role selector  
• Permission matrix  
• Team list  
• Group management  
• Workspace settings  
• Organization settings  
• Ownership transfer

Billing/account plan  
• Plan summary  
• Billing overview  
• Usage meter  
• Invoice list  
• Payment methods  
• Billing address  
• Upgrade/downgrade  
• Cancel plan  
• Coupon/promo input  
• Tax details

Settings architecture  
• Settings sidebar  
• Settings section  
• Preference row  
• Toggle setting  
• Select setting  
• Destructive zone  
• Save bar  
• Unsaved-changes prompt

# MARKETING & CONTENT SECTIONS

Navigation / announcement  
• Announcement bar  
• Promo bar  
• Utility bar  
• Marketing navbar  
• Mega menu  
• Product navigation  
• Secondary nav

Hero families  
• Centered hero  
• Split hero  
• Image hero  
• Video hero  
• Product hero  
• App screenshot hero  
• Dashboard hero  
• Editorial hero  
• Minimal hero  
• Full-screen hero  
• Form hero  
• Search hero  
• Signup hero  
• Event hero  
• Ecommerce hero  
• Portfolio hero  
• Case-study hero

Trust / proof  
• Logo cloud  
• Customer logos  
• Partner logos  
• Certification badges  
• Security badges  
• Awards  
• Rating strip  
• Review summary  
• Testimonial  
• Testimonial grid  
• Testimonial carousel  
• Customer quote  
• Customer story  
• Case-study teaser  
• Metrics strip  
• Stats section  
• Social-proof banner

Features  
• Feature list  
• Feature grid  
• Feature cards  
• Alternating features  
• Feature tabs  
• Feature comparison  
• Feature spotlight  
• Icon features  
• Screenshot feature  
• Interactive feature demo  
• Capability matrix  
• Benefits section  
• Use-cases section  
• Solution cards

Product explanation  
• How-it-works  
• Process steps  
• Workflow diagram  
• Product tour  
• Interactive tour  
• Before/after  
• Problem/solution  
• Architecture overview  
• Integration overview  
• Ecosystem section

Audience/solutions  
• Persona section  
• Industry section  
• Use-case cards  
• Role-based solutions  
• Company-size solutions  
• Region/location solutions

Pricing/conversion  
• Pricing cards  
• Pricing comparison  
• Plan toggle  
• Feature comparison matrix  
• Free-trial CTA  
• Signup CTA  
• Contact-sales CTA  
• Demo-request form  
• Lead form  
• Newsletter signup  
• Waitlist signup  
• Download CTA  
• App-store badges

Integrations  
• Integration grid  
• Integration card  
• Partner ecosystem  
• API/developer CTA  
• Marketplace teaser

Content marketing  
• Blog listing  
• Featured article  
• Resource grid  
• Resource library  
• Whitepaper card  
• Ebook card  
• Webinar card  
• Podcast section  
• Video library  
• Guides  
• Documentation CTA  
• Newsletter section

Company  
• About section  
• Mission  
• Vision  
• Values  
• Team grid  
• Team member card  
• Leadership section  
• Culture gallery  
• Careers teaser  
• Offices/locations  
• Company timeline  
• Investor section

FAQ/support  
• FAQ section  
• FAQ accordion  
• Help-center search  
• Support CTA  
• Contact options  
• Knowledge-base teaser

Community  
• Community stats  
• Community posts  
• Events listing  
• Meetup card  
• Ambassador section  
• Contributor section

Footer  
• Simple footer  
• Multi-column footer  
• Mega footer  
• Product footer  
• Legal footer  
• Newsletter footer  
• Social links  
• App download links  
• Language/currency controls  
• Copyright/legal links

# APPLICATION PATTERNS

Dashboard  
• Dashboard shell  
• Dashboard header  
• KPI row  
• Analytics overview  
• Widget grid  
• Configurable dashboard  
• Dashboard filter bar  
• Time-range control  
• Drill-down panel

CRUD / records  
• Record list  
• Record table  
• Record detail  
• Create record  
• Edit record  
• Delete record  
• Bulk edit  
• Bulk delete  
• Import records  
• Export records  
• Duplicate record  
• Archive record  
• Restore record

Search / filtering  
• Search results page  
• Advanced search  
• Filter builder  
• Query builder  
• Faceted search  
• Saved search  
• Recent searches  
• Search suggestions  
• Filter presets

Productivity  
• Kanban  
• Task list  
• Task detail  
• Subtasks  
• Due date  
• Assignee control  
• Priority control  
• Labels/tags  
• Sprint board  
• Backlog  
• Roadmap  
• Timeline  
• Gantt  
• Milestone  
• Dependency view

Documents / knowledge  
• Document editor  
• Block editor  
• Page editor  
• Wiki page  
• Knowledge-base article  
• Table of contents  
• Page tree  
• Slash command menu  
• Block inserter  
• Comments  
• Inline comments  
• Mentions  
• Revision history  
• Share dialog  
• Permission dialog

Communication  
• Chat list  
• Conversation  
• Message bubble  
• Message composer  
• Typing indicator  
• Read receipt  
• Reaction  
• Thread  
• Channel list  
• Direct message  
• Voice message  
• Attachment  
• Call controls  
• Video-call tile  
• Participant grid

Email  
• Inbox  
• Mail list  
• Mail row  
• Mail viewer  
• Composer  
• Recipient chips  
• Attachment picker  
• Thread view  
• Labels/folders  
• Snooze  
• Archive/trash controls

Calendar / scheduling  
• Month calendar  
• Week calendar  
• Day calendar  
• Agenda  
• Event card  
• Event editor  
• Event details  
• Time-zone control  
• Availability  
• Scheduling poll  
• Booking link  
• Resource booking

File management  
• File browser  
• Folder browser  
• File row  
• File grid  
• Upload dropzone  
• File details  
• File preview  
• Rename  
• Move/copy  
• Share file  
• Permission control  
• Version history  
• Storage usage

Developer tools  
• API key management  
• API explorer  
• Endpoint list  
• Request builder  
• Response viewer  
• Log viewer  
• Console  
• Terminal  
• Code editor  
• Diff viewer  
• Git history  
• Commit list  
• Branch selector  
• Pull-request view  
• Issue tracker  
• Deployment list  
• Build log  
• Environment-variable editor  
• Webhook manager

Admin  
• Admin dashboard  
• User management  
• Role management  
• Permission matrix  
• Audit log  
• Feature flags  
• System settings  
• Moderation queue  
• Content moderation  
• Abuse reports  
• Support tickets  
• Impersonation banner/control

AI application UI  
• Chat prompt composer  
• Conversation history  
• Model selector  
• Tool-status indicator  
• Streaming response  
• Citation list  
• Sources panel  
• Regenerate control  
• Prompt template picker  
• Agent run timeline  
• Tool call card  
• Approval request  
• Human-in-the-loop confirmation  
• AI diff/review

# SPECIALIZED & UTILITY

Maps / location  
• Map  
• Map marker  
• Marker cluster  
• Info window  
• Route  
• Directions panel  
• Geocoder search  
• Location picker  
• Radius selector  
• Geofence editor  
• Store locator  
• Location card  
• Map/list split view  
• Street-view embed

Travel / hospitality  
• Hotel card  
• Room card  
• Availability calendar  
• Guest selector  
• Date-range picker  
• Fare selector  
• Flight card  
• Seat selector  
• Itinerary  
• Trip timeline  
• Booking summary  
• Reservation status

Food / delivery  
• Restaurant card  
• Menu  
• Menu category  
• Menu item  
• Modifier selector  
• Delivery address  
• Delivery tracker  
• Pickup selector  
• Tip selector  
• Order tracking

Healthcare  
• Provider card  
• Appointment slot  
• Patient summary  
• Medication list  
• Lab result  
• Vital-sign card  
• Health timeline  
• Insurance card  
• Consent form  
• Secure-message thread

Finance  
• Account balance  
• Transaction row  
• Transaction table  
• Spending category  
• Budget meter  
• Portfolio summary  
• Asset holding  
• Price ticker  
• Order ticket  
• Transfer form  
• Payment request  
• Bank-account selector  
• Card display  
• Fraud/security alert

Real estate  
• Property card  
• Property gallery  
• Property facts  
• Mortgage calculator  
• Agent card  
• Map search  
• Saved property  
• Viewing scheduler

Education  
• Course card  
• Lesson list  
• Lesson viewer  
• Progress tracker  
• Quiz  
• Question  
• Answer choice  
• Assignment  
• Grade display  
• Certificate  
• Discussion board  
• Classroom roster

Events  
• Event card  
• Event schedule  
• Speaker card  
• Venue card  
• Ticket selector  
• Attendee list  
• Check-in control  
• QR ticket  
• Event countdown

Social / community  
• Feed  
• Post  
• Story  
• Composer  
• Follow control  
• Friend request  
• Community/group card  
• Member card  
• Poll  
• Reaction bar  
• Share sheet  
• Moderation controls

Recruitment / HR  
• Job card  
• Job listing  
• Application form  
• Applicant card  
• Candidate pipeline  
• Resume viewer  
• Interview scheduler  
• Employee directory  
• Org chart  
• Time-off request  
• Timesheet

Legal / professional  
• Matter/case card  
• Document status  
• Signature request  
• Contract viewer  
• Clause navigator  
• Approval workflow  
• Client portal  
• Secure file exchange

Support / service  
• Ticket  
• Ticket list  
• Ticket detail  
• Priority/status controls  
• SLA timer  
• Customer profile  
• Knowledge suggestions  
• Chat support  
• Escalation control

Accessibility / utility  
• Skip link  
• Screen-reader-only label  
• Visually hidden helper  
• Focus trap  
• Focus sentinel  
• Live region  
• Accessible description  
• Keyboard shortcut help  
• Reduced-motion control  
• High-contrast control  
• Text-size control

Web platform utility  
• Cookie consent  
• Privacy preference center  
• Install-PWA prompt  
• Offline banner  
• Update-available prompt  
• Browser permission prompt  
• Share API trigger  
• Print control  
• Download control  
• Copy-to-clipboard  
• QR code  
• Barcode  
• Deep-link opener  
• External-link indicator

Internationalization  
• Language selector  
• Locale selector  
• Currency selector  
• Region selector  
• RTL-aware navigation  
• Translation status  
• Locale-specific date/time display

System / meta  
• Feature flag state  
• Beta badge  
• Experimental feature callout  
• Environment badge  
• Impersonation banner  
• Debug panel  
• Developer mode indicator  
• Version info  
• Release notes  
• Changelog

Domain extension rule

No catalog can literally pre-enumerate every future industry-specific interface. When a new semantic component is required, it should inherit the same registry contract:  
identity, category, props, content slots, states, variants, compatibility, accessibility, responsiveness, and versioning.

The catalog is exhaustive at the reusable web-interface family level, while remaining extensible for genuinely new domains.

# UNIVERSAL STATES & VARIANT DIMENSIONS

A component family is not complete until its valid states and variation axes are defined.

Universal interaction states  
Where semantically valid, components should define:  
• default,  
• hover,  
• focus,  
• focus-visible,  
• active / pressed,  
• selected,  
• unselected,  
• disabled,  
• read-only,  
• loading,  
• success,  
• warning,  
• error,  
• invalid,  
• pending,  
• completed,  
• destructive,  
• unavailable,  
• offline,  
• stale,  
• syncing,  
• saving,  
• saved,  
• dirty / unsaved.

Content states  
• empty,  
• partially populated,  
• fully populated,  
• overflow,  
• truncated,  
• expanded,  
• collapsed,  
• missing asset,  
• broken asset,  
• long content,  
• short content,  
• internationalized/long translated content,  
• RTL.

Responsive states  
• mobile,  
• tablet,  
• desktop,  
• wide desktop,  
• compact density,  
• comfortable density,  
• touch-target mode,  
• collapsed navigation,  
• wrapped content,  
• overflow/scroll mode.

Theme states  
• light,  
• dark,  
• high contrast,  
• custom brand theme,  
• inverted-on-media,  
• transparent/overlay.

Common variant dimensions  
Visual emphasis:  
• primary,  
• secondary,  
• tertiary,  
• subtle,  
• ghost,  
• outline,  
• filled,  
• elevated,  
• flat,  
• destructive,  
• success,  
• warning.

Size:  
• xs,  
• sm,  
• md,  
• lg,  
• xl,  
with exact sizes determined by the active design system.

Shape:  
• square,  
• rounded,  
• pill,  
• circular,  
• sharp,  
• soft.

Density:  
• compact,  
• standard,  
• spacious.

Alignment:  
• start,  
• center,  
• end,  
• distributed,  
• justified.

Orientation:  
• horizontal,  
• vertical,  
• responsive/switching.

Media relationship:  
• no media,  
• icon-leading,  
• icon-trailing,  
• image-leading,  
• image-trailing,  
• image-above,  
• full-bleed media,  
• background media.

Container behavior:  
• contained,  
• full width,  
• full bleed,  
• floating,  
• sticky,  
• fixed,  
• inline.

Content amount:  
• minimal,  
• standard,  
• rich,  
• dense.

Interaction model:  
• static,  
• clickable,  
• selectable,  
• multi-selectable,  
• draggable,  
• reorderable,  
• editable,  
• expandable,  
• dismissible.

Data state:  
• live,  
• cached,  
• stale,  
• delayed,  
• partial,  
• empty,  
• error.

Variant rule

Not every component supports every dimension. The registry entry explicitly declares supported dimensions and valid combinations.

Do not multiply component IDs for token-level cosmetic differences. Example:  
“blue button” is not a component variant if color comes from semantic tokens.  
“icon-only destructive button” can be a meaningful variant because it changes content structure, semantics, and accessibility requirements.

Combinatorial control

Clayface must prevent impossible variant explosions. Use constraints such as:  
• mutually exclusive variant axes,  
• default combinations,  
• prohibited combinations,  
• context-specific presets,  
• generator-safe combinations,  
• manually available but generator-excluded combinations.

Generator-safe variants

Some valid component states may be too risky for automatic generation. Registry metadata should distinguish:  
• supported by renderer,  
• editable by user,  
• generator eligible.

This lets Clayface expose flexibility without allowing the generator to produce weak or inappropriate combinations automatically.

# REGISTRY ENTRY CONTRACT

Every generator-aware component must have a structured registry record.

Identity  
• id  
• name  
• semantic name  
• version  
• lifecycle status  
• layer: primitive / component / composite / section / pattern / domain  
• category  
• subcategory

Purpose  
• semantic role  
• user problem solved  
• common use cases  
• contexts where it should not be used

Implementation  
• renderer key  
• implementation package  
• lazy-load chunk identifier where relevant  
• server/client rendering requirements  
• external dependency requirements

Content contract  
• required slots  
• optional slots  
• slot type  
• min/max repetitions  
• recommended content lengths  
• fallback content behavior  
• asset requirements  
• localization behavior

Props  
For each editable prop:  
• key  
• type  
• required/default  
• accepted values  
• user-editable?  
• generator-editable?  
• AI-editable?  
• validation constraints  
• inspector control type

Variants  
• supported variants  
• supported variant dimensions  
• default variant  
• generator-safe variants  
• incompatible combinations  
• migration aliases from older names

States  
• interaction states  
• data states  
• loading/empty/error handling  
• selected/disabled behavior

Structure  
• allowed children  
• required children  
• slot relationships  
• parent restrictions  
• allowed nesting  
• max depth/repetition where relevant

Layout  
• intrinsic sizing behavior  
• min/max width  
• container expectations  
• alignment rules  
• responsive collapse behavior  
• overflow behavior  
• sticky/fixed capability

Design-system contract  
• required semantic tokens  
• optional tokens  
• component token aliases  
• fallback token behavior  
• dark/high-contrast requirements  
• density compatibility

Accessibility  
• semantic element/role  
• keyboard interaction  
• focus behavior  
• accessible-name requirement  
• ARIA requirements  
• screen-reader behavior  
• reduced-motion behavior  
• contrast requirements

Responsive  
• supported breakpoints  
• transformation rules  
• mobile-specific variants  
• touch requirements  
• content-priority rules

Generator metadata  
• supported page families  
• supported product types  
• semantic tags  
• visual-character tags  
• density score/category  
• content emphasis  
• media emphasis  
• conversion emphasis  
• eligibility constraints  
• incompatible neighbors  
• preferred neighbors  
• diversity group  
• ranking hints

Figma mapping metadata  
• likely Figma component names/aliases  
• structural fingerprints  
• layout fingerprints  
• content-slot signatures  
• confidence rules

Quality  
• implementation status  
• design-reviewed status  
• accessibility-tested status  
• responsive-tested status  
• visual-regression status  
• generator-ready status  
• known limitations

Versioning  
• introduced version  
• deprecated version  
• replacement component if any  
• migration function/reference  
• breaking-change notes

Observability  
Optional future metadata:  
• generation usage count  
• user replacement rate  
• edit distance  
• failure rate  
• acceptance/retention signal.

Example conceptual record

id: marketing.hero.split  
version: 4  
layer: section  
category: marketing.hero  
purpose: primary landing-page introduction  
requiredSlots: heading  
optionalSlots: eyebrow, body, primaryAction, secondaryAction, media  
variants: balanced, editorial, product-led, minimal  
generatorSafeVariants: balanced, editorial, product-led  
designSystemRequires: typography.display, color.background, color.foreground, space.section  
responsive: stacks media below or above according to variant  
accessibility: heading hierarchy \+ accessible media requirements  
diversityGroup: hero.split  
figmaFingerprints: two-column auto-layout with dominant heading/text region and media region

Registry acceptance rule

A component may exist in the implementation library before it becomes generator-ready.

Generator-ready requires:  
1\. Registry contract complete.  
2\. Props/schema validation complete.  
3\. Required states implemented.  
4\. Responsive behavior tested.  
5\. Accessibility behavior tested.  
6\. At least two materially different design systems render correctly where applicable.  
7\. Visual review passes.  
8\. Generator metadata is sufficient to select it without hard-coded special logic.

# GENERATION ENGINE

This section defines the deterministic pipeline from project inputs to validated Clayface IR, then to rendered, editable UI. AI and Figma are adapters into this same pipeline rather than separate generators.

# GENERATION PIPELINE

Canonical pipeline

1\. Collect project context.  
Project type, required pages, content, assets, active design-system version, optional Figma source, and optional user direction.

2\. Normalize inputs.  
Convert external source data into Clayface-understood concepts. Do not allow Figma-specific or AI-specific structures to leak into the generator core.

3\. Build page intent.  
Determine page family, content hierarchy, functional requirements, and structural slots.

4\. Retrieve eligible compositions.  
Query registry metadata by page type, content needs, design-system capabilities, density, and compatibility.

5\. Create composition plan.  
Choose page-level structures and major component relationships.

6\. Resolve component variants.  
Select variants according to design-system rules and content requirements.

7\. Populate content.  
Bind user/imported content to supported slots. Preserve real content where supplied; use clearly identified placeholders only when necessary.

8\. Produce Clayface IR.  
The generator outputs structured nodes, references, props, asset IDs, and version metadata.

9\. Validate.  
Schema validation, registry references, required content, component relationships, token compatibility, responsive rules, and asset references.

10\. Render preview.  
Renderer reads the validated IR and produces the interface.

11\. Persist.  
Store compact IR plus references and metadata; do not persist a duplicated full application as canonical state.

12\. Open editor.  
The user edits the same IR through typed operations  
DEEP REVIEW

Generation must be explainable  
For a generated direction, Clayface should be able to reconstruct at least a lightweight explanation:  
• which design-system version was used,  
• which page intent was inferred,  
• which compositions were selected,  
• which major constraints affected selection,  
• and whether AI or Figma influenced the result.

Diversity strategy  
Three directions should not be created by randomizing components independently. That risks incoherent pages.

Prefer direction-level strategy profiles, for example:  
• editorial / content-led,  
• product-led / visual,  
• minimal / conversion-focused.

A strategy influences:  
• composition candidates,  
• density,  
• media ratio,  
• alignment,  
• section rhythm,  
• variant families.

This creates coherent variation.

Determinism  
For identical normalized input, system/version/seed should be able to reproduce the same direction. Store enough generation metadata to debug surprising results.

Candidate selection  
Recommended pattern:  
1\. Generate candidate page plan.  
2\. Resolve required semantic slots.  
3\. Get compatible composition candidates.  
4\. Reject hard constraint failures.  
5\. Rank remaining candidates.  
6\. Apply diversity constraints against existing directions.  
7\. Assemble page.  
8\. Validate full document.  
9\. Repair only through known deterministic rules.  
10\. Fail cleanly if no valid result exists.

Do not create an endless auto-repair loop. A generator that repeatedly patches invalid output is harder to trust than one with stricter planning.

Quality review  
Build a fixed benchmark set of project briefs. Every significant generator change should run against that set and be visually reviewed for regressions.

Metrics to capture:  
• successful validation rate,  
• generation stage duration,  
• component diversity,  
• direction similarity,  
• user edit distance before acceptance,  
• regeneration/deletion rate.

Revision trigger  
If most users immediately replace the same generated section type, that is evidence of a generator/component-quality problem and should influence ranking or component review.  
.

# CLAYFACE INTERMEDIATE REPRESENTATION (IR)

The IR is the central product contract. It separates input interpretation from rendering and keeps Figma, AI, React, and future output targets from becoming the product architecture.

Conceptual model

ClayfaceDocument  
• schemaVersion.  
• designSystemId.  
• designSystemVersion.  
• pages.  
• asset references.  
• generation metadata.

ClayfacePage  
• id.  
• name.  
• route.  
• root node.  
• page metadata.

ClayfaceNode  
• id.  
• component ID.  
• component version.  
• variant.  
• validated props.  
• child nodes where allowed.  
• supported token overrides.  
• layout metadata where required.

Operation model  
Edits should use typed operations such as:  
• insertNode.  
• removeNode.  
• moveNode.  
• replaceComponent.  
• setVariant.  
• setProp.  
• updateContent.  
• setTokenOverride.  
• changeDesignSystemReference.

IR requirements  
• JSON serializable.  
• Schema validated.  
• Versioned.  
• Deterministic enough to reproduce a rendered direction.  
• No raw arbitrary JavaScript.  
• No unrestricted CSS blobs as the default escape hatch.  
• External source IDs may be retained as metadata, not as structural dependencies.

The IR is the canonical project design state; rendered DOM and exported code are derived outputs  
DEEP REVIEW

IR design goals  
The IR must balance three competing needs:  
• expressive enough for real interfaces,  
• constrained enough to validate,  
• simple enough to edit and migrate.

Avoid encoding presentation implementation too early. For example, “display:flex” is a renderer detail; “horizontal stack with gap token space.4” is a Clayface layout concept.

Identity rules  
Every node needs a stable unique ID within the direction. IDs should survive ordinary prop/content edits. Replacing a component may create a new node identity unless content-preservation semantics explicitly retain it.

References  
Prefer references over duplication for:  
• assets,  
• design-system versions,  
• component definitions,  
• shared content structures where future reuse is required.

Operations  
Operations should be small enough for undo, validation, collaboration later, and AI use, but not so low-level that a simple component move requires dozens of commands.

Examples of appropriate operations:  
• replace component,  
• change variant,  
• set prop,  
• update content slot,  
• insert/remove/move node,  
• set allowed override,  
• update page metadata.

Transactions  
Some edits require multiple operations to remain valid. Support transactional operation batches so intermediate invalid states are not persisted.

Validation stages  
Validate:  
1\. syntactic schema,  
2\. reference resolution,  
3\. component contract,  
4\. tree structure,  
5\. design-system compatibility,  
6\. product constraints.

Migration  
Each schema version should define:  
• what changed,  
• forward migration,  
• whether backward conversion is possible,  
• visual-risk classification,  
• fixture coverage.

Prototype requirement  
Before freezing IR v1, create fixtures for:  
• marketing homepage,  
• pricing page,  
• dashboard shell,  
• settings form,  
• ecommerce product listing.

Even if only one family ships in MVP, these fixtures reveal whether the model is too narrowly designed.

Revision trigger  
If a common supported interface requires arbitrary renderer-specific fields, pause implementation and reconsider the IR rather than accumulating exceptions.  
.

# RULES & VALIDATION

Clayface quality comes from constraints as much as from components.

Validation layers

Schema validation  
• Required document/page/node fields.  
• Correct prop types.  
• Known component/version/variant references.

Structural validation  
• Allowed parent-child relationships.  
• Maximum/minimum children.  
• Required page sections.  
• Valid ordering rules where a composition defines them.

Content validation  
• Required slots present.  
• Content length guidance.  
• Asset type and aspect-ratio requirements where necessary.  
• Action/button count constraints.

Design-system validation  
• Required token roles exist.  
• Contrast-sensitive combinations can be resolved.  
• Component-required tokens are supported.  
• Local overrides remain inside allowed boundaries.

Responsive validation  
• Components declare supported breakpoints/behaviors.  
• Generator does not create layouts known to fail at supported viewport sizes.

Operational validation  
• Asset IDs resolve.  
• Component versions are available.  
• Design-system version resolves.  
• User remains within project/direction limits.

Failure policy  
Never silently “fix” a major unsupported structure into something unrelated. When Clayface cannot satisfy an input safely, surface the unsupported piece and provide the closest valid action.

# RENDERING

Renderer responsibilities  
• Accept only validated Clayface IR.  
• Resolve exact component versions.  
• Bind design-system tokens.  
• Resolve assets.  
• Produce preview UI.  
• Preserve stable node IDs for editor selection.  
• Support viewport simulation.  
• Exclude editor-only chrome from exported/rendered output.

Recommended separation  
renderer-core: framework-agnostic interpretation rules and component resolution contracts.  
React renderer: actual web implementation for MVP.  
Preview host: isolates project preview from Clayface application chrome where appropriate.

Performance  
• Lazy-load component implementation bundles where practical.  
• Cache component metadata separately from heavy implementation code.  
• Do not rerun the whole generation engine for a small inspector edit.  
• Re-render only the affected React tree using normal React reconciliation.  
• Use deterministic asset URLs and optimized image handling.

Security  
Treat rendered project content as untrusted project data. Do not allow arbitrary user JavaScript execution in the Clayface app context.

# DESIGN SYSTEMS

This section defines how project-level visual rules are represented, imported, recreated, versioned, and applied across shared Clayface components.

# DESIGN SYSTEM SCHEMA & TOKENS

A project design system defines the visual and behavioral rules applied to Clayface components.

Token groups  
• Color roles: background, surface, foreground, muted, border, accent, semantic states.  
• Typography: families, sizes, weights, line heights, tracking.  
• Spacing scale.  
• Sizing and control heights.  
• Radius scale.  
• Border widths/styles.  
• Shadows/elevation.  
• Containers and grid.  
• Breakpoints.  
• Motion durations/easing.  
• Icon sizing/stroke policy.

Component-level rules  
• Default variants.  
• Allowed/blocked variants.  
• Component token mappings.  
• Density.  
• Shape/treatment preferences.  
• Section/page family preferences.

Schema rules  
• Separate semantic roles from raw values.  
• Support aliases/references where useful.  
• Validate all imported values.  
• Unknown keys are preserved only in a namespaced extension area, not mixed into canonical fields.  
• System must be serializable to JSON for import/export.

A design system is more than a palette. It is the project-level contract that determines how the same components can produce visibly different brands.

# IMPORT & RECREATION

Supported design-system sources

Clayface default  
Start with an opinionated complete system that can immediately generate acceptable UI.

Manual  
User edits foundations and supported component rules through the Design System workspace.

JSON upload  
1\. Upload.  
2\. Validate file type and size.  
3\. Parse JSON.  
4\. Validate schema.  
5\. Show import issues.  
6\. Normalize aliases/references.  
7\. Create design-system version.  
8\. Preview representative components.  
9\. Activate after confirmation.

Figma-derived  
Extract token hints, typography, color styles/variables where available, spacing/layout patterns, and known component signals. Figma extraction should create a proposed Clayface design system that can be reviewed before becoming canonical.

Existing/popular design system recreation  
Use an adapter/template that maps known system concepts into Clayface tokens and component preferences. “Copy” means reproduce compatible design rules, not copy proprietary source code.

Import principle  
External formats are adapters. Once imported, the canonical representation is the Clayface design-system schema.

# DESIGN SYSTEM VERSIONING

Every generated direction stores the exact design-system version it used.

Why  
Changing typography, spacing, component defaults, or color roles can alter every page. Versioning prevents historical directions from mutating unpredictably.

MVP policy  
• Initial project setup creates version 1\.  
• Meaningful project-wide design-system updates create a new snapshot/version.  
• The editor may preview unsaved changes locally before commit.  
• Directions can either stay pinned to their original version or be explicitly updated to the latest version.  
• Keep the first MVP migration interaction simple: “Update this direction to current system” rather than building a complex branch graph.

Store versions efficiently  
Use structured token/rule JSON plus metadata. Consider snapshot storage first because project count and direction limits are small; optimize to deltas only if real scale data justifies complexity.

# FIGMA INTEGRATION

This section defines how Figma MCP data is normalized and interpreted into Clayface-native structures, including mapping confidence and explicit handling of unsupported design features.

# FIGMA MCP IMPORT PIPELINE

Goal  
Interpret supported Figma frames and convert them into Clayface project inputs and IR-compatible structure.

Process  
1\. User connects/selects Figma source through supported MCP flow.  
2\. User selects one or more supported frames.  
3\. Adapter reads frame hierarchy, auto-layout information, dimensions, text, reusable components, assets, styles/variables available through the integration, and relevant metadata.  
4\. Normalize Figma-specific concepts into a neutral import model.  
5\. Detect major regions and content hierarchy.  
6\. Match known structures to Clayface component/composition candidates.  
7\. Extract proposed design-system values.  
8\. Score mapping confidence.  
9\. Surface ambiguous or unsupported regions.  
10\. Create a reviewed import plan.  
11\. Convert accepted mappings into Clayface IR/design-system data.  
12\. Validate through the normal Clayface pipeline.  
13\. Render using Clayface components.

Important  
Clayface should interpret Figma, not attempt to reproduce every arbitrary vector/node exactly. When the frame contains structures outside Clayface's supported design vocabulary, the UI must say so  
DEEP REVIEW

Figma import is interpretation, not transcription.

Import stages should remain distinct:  
Connection → Selection → Extraction → Normalization → Detection → Mapping → Review → Conversion → Validation.

Normalization model  
Create an intermediate FigmaImportModel containing only information Clayface needs:  
• hierarchy,  
• layout direction,  
• spacing,  
• dimensions,  
• text/content,  
• assets,  
• component-instance identity,  
• style/variable hints,  
• visibility,  
• constraints.

Do not pass raw Figma payloads throughout the product.

Pattern detection  
Detection should identify higher-level regions before component matching:  
• navigation,  
• hero,  
• repeated card grid,  
• form,  
• sidebar,  
• content section,  
• footer.

A large visual frame should not be matched to components node-by-node without page-level context.

Confidence  
Mapping confidence should be based on explainable signals such as:  
• structural similarity,  
• reusable component identity,  
• content-slot fit,  
• layout match,  
• token compatibility.

Low confidence must affect the UI. Example:  
“Clayface is unsure whether this region is a feature grid or pricing comparison.”

Evaluation corpus  
Create a Figma test corpus including:  
• clean auto-layout files,  
• messy real-world files,  
• design-system-heavy files,  
• custom layouts,  
• unsupported illustration-heavy frames.

Measure mapping quality by category rather than quoting one overall accuracy number.

Fallback hierarchy  
1\. Exact known component mapping.  
2\. Compatible Clayface composition.  
3\. Generic supported layout composition.  
4\. Flattened asset when semantically acceptable.  
5\. Explicit unsupported region.

Revision trigger  
If mapping quality is only good on artificially clean files, narrow the marketed support instead of hiding limitations with AI.  
.

# FIGMA MAPPING RULES

Mapping priorities  
1\. Semantic purpose when it can be inferred reliably.  
2\. Structural layout.  
3\. Reusable Figma component/instance identity.  
4\. Content hierarchy.  
5\. Visual tokens.  
6\. Exact local decoration.

Examples  
• Repeated card-like frames with consistent structure can map to a registered card component.  
• Auto-layout direction/gap/padding informs Clayface layout props.  
• Text style hierarchy informs typography role mapping.  
• Figma variables/styles can propose semantic tokens but require normalization.  
• Repeated navigation patterns can map to known navbar/sidebar compositions.

Confidence  
Each mapping should carry confidence and source evidence. Low-confidence mappings should be reviewable rather than silently accepted.

Asset handling  
Raster/vector assets are extracted as project assets with references in IR. Avoid embedding duplicate binary assets into each design direction.

Do not  
• Preserve Figma node IDs as the canonical Clayface hierarchy.  
• Convert every frame directly into arbitrary divs.  
• Treat pixel coordinates as the primary responsive layout model.  
• Claim unsupported effects are faithfully reproduced when they are not.

# FIGMA LIMITATIONS

MVP limitations should be explicit.

Likely unsupported or partially supported  
• Arbitrary vector illustration recreation.  
• Complex masks and boolean vector operations as editable Clayface components.  
• Advanced prototyping interactions.  
• Highly custom canvas positioning that conflicts with responsive web layout.  
• Every third-party Figma plugin artifact.  
• Unknown custom components without mappings.  
• Complex motion definitions.  
• Non-web interface patterns that do not map to supported Clayface primitives.

Fallback behavior  
• Preserve usable assets as flattened/exported assets when appropriate.  
• Keep unmatched regions as an explicit import issue.  
• Offer replacement with the closest compatible Clayface composition only with user awareness.  
• Never present low-confidence approximations as exact imports.

The Figma importer succeeds when it produces a strong Clayface-native interface, not when it recreates every internal Figma node.

# AI LAYER

This section defines AI as an optional constrained refinement layer. AI proposes validated Clayface operations; it does not become the canonical UI generator or write arbitrary project code.

# AI RESPONSIBILITIES

AI is an optional interpretation/refinement layer.

Good AI responsibilities  
• Interpret ambiguous natural-language art direction.  
• Suggest component/variant replacements.  
• Propose valid layout refinements.  
• Summarize imported design intent.  
• Help map unusual Figma structures to known Clayface concepts.  
• Suggest content hierarchy improvements.  
• Explain why a generated layout may be constrained.  
• Generate or refine text content when the user explicitly requests it.

AI should not  
• Generate arbitrary JSX as the canonical result.  
• Write unrestricted CSS into the project state.  
• bypass component/version constraints.  
• invent unavailable component capabilities.  
• directly mutate the database.  
• determine security-sensitive authorization.  
• silently alter project-wide design-system values.

Availability principle  
If AI is down, users should still be able to generate, edit, import supported sources, and work with the deterministic core.

# AI OPERATION MODEL

AI receives a constrained representation of:  
• Project intent.  
• Active design-system summary.  
• Relevant page/node context.  
• Eligible registry components/variants.  
• Allowed operation schema.  
• User request.

AI returns proposed Clayface operations, for example:  
• replaceComponent.  
• setVariant.  
• updateContent.  
• moveNode.  
• insertNode using eligible registry entry.  
• update supported local token override.  
• propose project design-system change for explicit confirmation.

Processing  
1\. Parse model output against strict schema.  
2\. Reject unknown operation types.  
3\. Validate component/version references.  
4\. Validate permissions and scope.  
5\. Run normal structural/design-system validation.  
6\. Apply operations transactionally when possible.  
7\. Render.  
8\. If result fails validation, do not persist a corrupted state.

Provider abstraction  
Keep model provider and prompting behind a dedicated package/service so Clayface can switch providers without changing the product state model.

# AI GUARDRAILS

Security  
• Treat project content and Figma text as untrusted input.  
• Do not allow prompt content to grant capabilities.  
• Use tool/operation allowlists.  
• Keep model credentials server-side.  
• Minimize data sent to providers.  
• Log safe operational metadata rather than sensitive raw project content where possible.

Product quality  
• AI can only select from known compatible structures or propose reviewable changes.  
• Large project-wide changes require clear scope.  
• Destructive operations require the same confirmation rules as manual actions.  
• AI suggestions should not consume a design-direction slot unless they actually create a new direction.

Reliability  
• Timeouts and provider errors must not damage project state.  
• Use bounded retries.  
• Apply idempotency keys to background refinement jobs.  
• Persist operation intent/result separately enough to diagnose failures.  
• Always validate before commit.

Trust  
Clayface should be able to explain whether a result came from deterministic generation, Figma mapping, manual edits, or AI refinement.

# TECHNICAL ARCHITECTURE

This section defines the recommended TypeScript-first stack, package boundaries, service shape, deployment approach, and rules that keep the MVP modular without premature microservices.

# TECHNICAL STACK

Language  
TypeScript end-to-end for the MVP core.

Frontend  
• Next.js.  
• React.  
• Tailwind CSS with CSS variables for product UI.  
• React Aria for accessible interaction primitives.  
• Selective Radix primitives where they reduce implementation risk.  
• Zustand for editor-local state.  
• TanStack Query for server state.  
• React Hook Form \+ Zod for structured forms.

Backend  
• Fastify.  
• Zod at API boundaries.  
• PostgreSQL.  
• Drizzle ORM.  
• Redis or Valkey for caching, locks, rate-control support, and job infrastructure.  
• BullMQ initially for background jobs.  
• Cloudflare R2 or S3-compatible object storage for project assets and generated artifacts.  
• Better Auth or an equivalent server-owned auth layer.

Observability  
• Sentry.  
• OpenTelemetry.  
• Structured application logs with request/job correlation IDs.

Testing  
• Vitest for units and package-level tests.  
• Playwright for critical product flows.  
• Component visual/regression testing where practical.

Why TypeScript  
The difficult part of Clayface is shared contracts across schema, generator, registry, renderer, editor, and imports. A single language reduces translation errors and makes the schema directly usable across packages. Go/Rust can be introduced later for proven bottlenecks without shaping the initial product around hypothetical scale  
ARCHITECTURE REVIEW

Why this stack  
The selected stack is optimized for shared contracts and iteration speed. It is not a claim that every subsystem should remain JavaScript forever.

Boundary decisions  
Next.js owns product rendering and application routes, not generation jobs.  
Fastify owns durable API boundaries and authorization.  
Workers own long-running/expensive operations.  
PostgreSQL owns canonical relational state.  
Object storage owns binary/large artifacts.  
Redis/Valkey owns transient coordination/caching, never irreplaceable canonical project state.

Failure isolation  
A worker crash must not corrupt a direction. Use job lifecycle states such as:  
queued → running → validating → rendering → completed  
and explicit failed/cancelled states.

Persist result only after validation passes, or persist drafts under a non-active state.

API style  
Use conventional resource endpoints or typed RPC as long as boundaries remain explicit. Avoid coupling frontend state directly to database tables.

Concurrency  
Use optimistic concurrency/version fields for direction/design-system edits where collisions are possible. Even before multiplayer, the same user can have multiple tabs open.

Caching  
Cache:  
• registry metadata,  
• resolved component manifests,  
• safe normalized design-system computations.

Do not cache authorization decisions across contexts in a way that risks tenant leakage.

Operational simplicity  
Start with one API deployment and one worker deployment if needed. Package boundaries are not service boundaries.

When to consider Go/Rust  
Only after profiling shows a specific workload—e.g. heavy parsing, render orchestration, or CPU-intensive analysis—is materially bottlenecked and worth operational complexity.

Architecture review trigger  
Revisit service boundaries when:  
• workers need independent scaling,  
• queue latency dominates generation,  
• web/API deployments interfere with long jobs,  
• or security isolation requires a separate execution boundary.  
.

# MONOREPO

Recommended structure

apps/  
• web — Clayface product UI.  
• api — Fastify HTTP/API service.  
• worker — background job processors.  
• renderer — isolated preview/export host if separation is useful.

packages/  
• clayface-schema — IR types, Zod schemas, migrations.  
• design-tokens — shared token primitives and utilities.  
• design-system — project design-system schema/logic.  
• component-registry — component metadata and lookup.  
• component-library — implementation packages.  
• generator — deterministic generation engine.  
• renderer-core — IR interpretation contracts.  
• figma-adapter — Figma/MCP normalization.  
• ai — provider abstraction and AI operation planning.  
• editor — reusable editor/state operations.  
• shared — small genuinely shared utilities.

tooling/  
• TypeScript config.  
• ESLint.  
• test configuration.  
• build scripts.

Rules  
• Packages depend inward toward stable contracts; avoid circular dependencies.  
• clayface-schema should not import the app.  
• generator must not depend on Next.js.  
• component registry metadata should be consumable without loading every component implementation.  
• external integrations remain adapters.  
• all packages expose intentional public APIs rather than deep imports.

# SERVICES & DEPLOYMENT

MVP service shape

Web  
Next.js application serving account, project, editor, and settings experiences.

API  
Fastify service for authenticated project, design-system, direction, asset, import, and generation APIs.

Worker  
Processes background jobs such as:  
• Figma imports.  
• generation.  
• AI refinement.  
• heavy asset processing.  
• export preparation.

Data  
• Managed PostgreSQL.  
• Managed Redis/Valkey.  
• R2/S3-compatible object storage.

Suggested deployment approach  
Keep operational complexity low during MVP.  
• Web can run on Vercel or an equivalent Node-capable platform.  
• API/worker can run on Railway, Fly.io, Render, or an AWS/container platform.  
• Use one region initially where possible to reduce DB/cache latency.  
• Move to more specialized infrastructure only when product usage justifies it.

Job principles  
• Idempotency key for repeatable operations.  
• Explicit job states.  
• Retry only safe/recoverable failures.  
• Dead-letter/failure visibility.  
• User project state must remain valid if a worker crashes halfway through.

Deployment principle  
Clayface should be architecturally separable but operationally simple. Do not create microservices for every package during MVP.

# DATA MODEL

This section defines the canonical entities, storage strategy, and versioning needed to keep one-project/three-direction accounts compact, reproducible, and safe to evolve.

# DATA MODEL — CORE ENTITIES

User  
• id.  
• identity/auth references.  
• created/updated timestamps.

Project  
• id.  
• userId.  
• name.  
• productType.  
• status.  
• activeDesignSystemVersionId.  
• created/updated timestamps.

DesignSystem  
• id.  
• projectId.  
• canonical identity.

DesignSystemVersion  
• id.  
• designSystemId.  
• version.  
• tokens JSONB.  
• componentRules JSONB.  
• layoutRules JSONB.  
• createdBy/source metadata.  
• created timestamp.

DesignDirection  
• id.  
• projectId.  
• name.  
• status.  
• schemaVersion.  
• designSystemVersionId.  
• IR JSONB or document reference.  
• source metadata.  
• created/updated timestamps.

Page  
MVP may store pages inside IR for simplicity. Split into a normalized table only when query/edit needs justify it.

Asset  
• id.  
• projectId.  
• storage key.  
• media type.  
• dimensions/metadata.  
• checksum.  
• source.  
• created timestamp.

GenerationJob / ImportJob  
• id.  
• projectId.  
• directionId where applicable.  
• type.  
• status.  
• progress stage.  
• error code/detail.  
• idempotency key.  
• created/started/completed timestamps.

Optional audit/operation records  
Useful for debugging editor/AI operations, but avoid overbuilding a full event-sourced system for MVP.

# STORAGE STRATEGY

Canonical state  
Store compact structured project state, not duplicated generated application repositories.

Database  
Use PostgreSQL for identity, relationships, limits, statuses, versions, and structured JSONB state.

Object storage  
Use R2/S3 for:  
• imported images.  
• uploaded assets.  
• generated preview artifacts if needed.  
• exports.  
• large source artifacts that should not live in PostgreSQL.

Deduplication  
• Assets can use checksums to avoid repeated storage inside the same project/account where appropriate.  
• Design directions reference shared assets.  
• Components are global/versioned implementations and are never copied into each project.

IR size  
Keep IR semantic. Avoid storing computed CSS, duplicated token expansions, rendered HTML, or full component source inside each direction.

Cleanup  
• Deleting a direction removes direction-owned temporary artifacts after reference checks.  
• Shared assets remain while referenced.  
• Failed jobs should have retention/cleanup policies.  
• Exports can be regenerated and may use shorter retention than canonical project data.

Backup  
Database backup and object-storage durability policies must be enabled before real user data is invited.

# DATA VERSIONING

Versioned concerns  
• Clayface IR schema.  
• Design-system schema.  
• Design-system versions.  
• Component versions.  
• Generation-engine version/metadata where reproducibility matters.

IR schema  
Every stored document contains schemaVersion. Schema migrations should be explicit and testable.

Design directions  
A direction is pinned to:  
• IR schema version.  
• design-system version.  
• exact component versions referenced by nodes.

Generator metadata  
Record enough information to diagnose how a direction was created:  
• generation engine version.  
• source type.  
• optional seed/selection metadata where meaningful.  
• import version.  
• AI provider/model metadata only when AI participated and privacy policy permits.

Rule  
Never perform a silent global migration that changes the visual output of existing directions. Migration should create a new valid state or be opt-in where output can materially change.

# PERFORMANCE & SECURITY

This section defines the non-functional bar: responsive editor interactions, measurable generation stages, efficient storage/rendering, tenant isolation, safe imports, controlled rendering, and secure integration handling.

# PERFORMANCE TARGETS

The product must feel fast because users are evaluating Clayface partly by the quality of its own interface.

Interactive product targets  
• Navigation and local panel switching should feel immediate.  
• Local inspector edits should not trigger server-side regeneration when the change can be applied to IR locally and persisted asynchronously.  
• Keep editor interactions near 60fps during normal use.  
• Lazy-load large workspace tools and component implementation bundles.

API  
• Common authenticated reads/writes should target low hundreds of milliseconds under normal regional conditions.  
• Cache component-registry metadata and other high-read stable data.  
• Avoid N+1 project loading paths.

Generation  
• Separate queue time, planning, validation, and rendering so users see real progress.  
• Cache reusable registry/design-system computations.  
• Do not ask AI for work the deterministic engine can perform.  
• Figma normalization should run once per source revision/import, not on every editor interaction.

Rendering  
• Only load components used by the active page/direction where practical.  
• Optimize image assets.  
• Avoid generating enormous DOM trees from one-to-one Figma nodes.

Measurement  
Instrument:  
• project load.  
• editor ready.  
• generation total and stage duration.  
• Figma import duration.  
• render failures.  
• API latency.  
• worker queue delay.  
• bundle size.  
• client errors.

Actual thresholds should be tuned from production telemetry, but regressions should be visible from the beginning  
DEEP REVIEW

Define performance budgets before optimizing.

Suggested early budgets  
These are targets to validate, not promises:  
• project shell interactive quickly on normal broadband,  
• local inspector changes visible within a single animation frame where no async work is required,  
• persistence happens in the background without blocking local interaction,  
• navigation/panel changes should not show loading for already-known data,  
• generation progress should update at meaningful stage transitions.

Measure percentiles rather than averages once real traffic exists.

Editor stress fixtures  
Test:  
• 100 nodes,  
• 500 nodes,  
• 1,000+ nodes,  
• asset-heavy page,  
• deeply nested composition,  
• rapid inspector edits.

Determine where selection, tree rendering, preview, and persistence degrade.

Storage budgeting  
Estimate real IR size using fixtures. With one project and three directions, storage cost is likely dominated by assets rather than JSON. Do not prematurely compress IR at the cost of debuggability.

Generation performance  
Break total latency into:  
• queue,  
• input normalization,  
• planning,  
• registry queries,  
• assembly,  
• validation,  
• rendering,  
• persistence.

Optimization should target the measured largest contributors.

Security review depth  
Threat-model at least:  
• cross-tenant ID guessing,  
• malicious uploaded JSON,  
• malicious SVG/assets,  
• Figma content containing prompt injection,  
• AI operation escalation,  
• stored XSS in project text,  
• arbitrary URL fetch/SSRF if remote assets are supported,  
• job replay,  
• oversized payload/resource exhaustion,  
• leaked signed asset URLs.

Abuse controls  
Expensive generation and AI routes should have quotas/rate controls independent from cheap editor saves.

Recovery  
Before external testing, demonstrate:  
• database restore,  
• object asset recovery assumptions,  
• failed-job retry,  
• corrupted/invalid IR rejection,  
• rollback to last valid direction state.

Revision trigger  
If maintaining low-latency local editing conflicts with server persistence, prioritize local responsiveness and strengthen synchronization architecture rather than turning every interaction into a blocking request.  
.

# SECURITY MODEL

Tenant isolation  
Every project resource must be authorized against the authenticated user/account on the server. Client-side IDs are never authorization.

Authentication/session  
• Secure HTTP-only session strategy where applicable.  
• CSRF protection according to auth architecture.  
• Session rotation/revocation support.  
• Rate limits for authentication and expensive actions.

Uploads/assets  
• Validate file type and size.  
• Store with generated storage keys.  
• Do not trust filename or MIME header alone.  
• Scan or sandbox risky file types if introduced.  
• Signed/private URLs where appropriate.

Rendering  
• Never execute arbitrary JavaScript supplied in design input.  
• Treat imported Figma text, JSON fields, and AI content as untrusted.  
• Escape/sanitize rendered content according to context.  
• Isolate preview surfaces where needed.

Integrations  
• Keep Figma/AI/API credentials server-side.  
• Least-privilege scopes.  
• Encrypt secrets at rest using platform secret management.  
• Do not expose provider secrets to browser code.

Jobs  
• Verify authorization/context before enqueue.  
• Workers operate on server-resolved project IDs.  
• Idempotency prevents duplicate destructive operations.

Observability/privacy  
• Do not log secrets.  
• Avoid logging full project content by default.  
• Apply retention policies to sensitive request/job payloads.  
• Record audit-relevant destructive operations.

Before public MVP  
Perform dependency scanning, authorization tests, upload abuse tests, basic threat modeling, and recovery/backup checks.

# MVP PLAN

This section is the implementation path from the current project to a real MVP. It defines phases, dependency order, acceptance criteria, and explicit out-of-scope items so the rebuild does not drift.

# MVP BUILD PHASES

Phase 0 — Reset and specification  
Goal: stop extending the wrong Clayface structure.  
Deliverables:  
• Confirm this product specification.  
• Audit existing repository.  
• Mark reusable code vs code to replace.  
• Define new app information architecture.  
• Create package boundaries.  
• Establish product design-system foundations.  
Exit: team can explain Clayface architecture consistently and knows which old modules survive.

Phase 1 — Foundations  
Deliverables:  
• Turborepo/pnpm workspace.  
• shared TypeScript config, lint, tests.  
• PostgreSQL \+ Drizzle.  
• auth.  
• project model and one-project limit.  
• design-direction 3-slot enforcement.  
• object storage setup.  
• base product shell.  
Exit: authenticated user can create/open the single project and the new Clayface shell is stable.

Phase 2 — Clayface schemas  
Deliverables:  
• IR v1.  
• design-system schema v1.  
• component registry schema.  
• operation schema.  
• Zod validation.  
• migration/version strategy.  
Exit: test fixtures can represent full pages and reject invalid states.

Phase 3 — Product design system & component library  
Deliverables:  
• Clayface product tokens.  
• accessible application primitives.  
• generator component primitives/components/compositions.  
• initial registry metadata.  
• preview harness / Storybook-like internal catalog if useful.  
Exit: enough high-quality registered compositions exist to generate one complete target product type.

Phase 4 — Renderer & editor  
Deliverables:  
• IR renderer.  
• page tree.  
• canvas.  
• selection.  
• inspector.  
• basic component/variant/content/layout operations.  
• persistence.  
Exit: a handcrafted IR document can be opened, edited, saved, reloaded, and rendered reliably.

Phase 5 — Deterministic generation  
Deliverables:  
• page-intent planner.  
• registry filtering.  
• composition selection.  
• content binding.  
• validation pipeline.  
• background job.  
• progress UI.  
Exit: user can create a direction without AI and receive valid editable UI.

Phase 6 — Design-system workflows  
Deliverables:  
• Clayface default system.  
• manual token editor.  
• JSON import.  
• preview/activation.  
• version snapshots.  
• apply/update direction behavior.  
Exit: visually distinct projects can be produced from the same component library using different systems.

Phase 7 — Figma MCP  
Deliverables:  
• source connection.  
• frame selection.  
• normalization.  
• mapping confidence.  
• asset extraction.  
• proposed tokens.  
• unsupported-state UI.  
Exit: supported Figma frames can become valid Clayface-native editable directions.

Phase 8 — Optional AI refinement  
Deliverables:  
• provider abstraction.  
• constrained context builder.  
• operation schema/tool contract.  
• validation and transactional apply.  
• AI failure states.  
Exit: AI can refine a direction without generating canonical raw code or corrupting IR.

Phase 9 — Hardening  
Deliverables:  
• performance profiling.  
• security review.  
• retry/idempotency.  
• observability.  
• critical Playwright flows.  
• backup/restore check.  
• accessibility pass.  
• empty/loading/error states.  
Exit: internal/public MVP acceptance criteria pass.

Phase 10 — MVP release  
Limited user cohort, telemetry, bug triage, quality evaluation of generated output, and feedback on workflow clarity  
PHASE REVIEW DISCIPLINE

Each phase has three states:  
• Not started.  
• Implementation active.  
• Review-passed.

Do not mark a phase complete merely because code was merged.

For every phase record:  
• deliverables,  
• assumptions tested,  
• evidence collected,  
• failures found,  
• decisions changed,  
• unresolved questions,  
• review outcome.

Prototype before scale  
When a phase contains a risky unknown, implement the smallest vertical prototype that can disprove the approach.

Examples:  
• Before building 100 components, prove 10–20 components can create genuinely different directions.  
• Before a full Figma importer, map a deliberately varied test set.  
• Before sophisticated AI prompting, prove the operation model.  
• Before aggressive storage optimization, measure fixture sizes.

Rework allowance  
The plan explicitly expects revision. A failed review gate is not schedule failure; it is cheaper than discovering the same problem after dependent systems are built.

MVP readiness review should include three independent judgments:  
1\. Product completeness — the promised workflow exists.  
2\. System correctness — state, security, and failure behavior are safe.  
3\. Design credibility — Clayface and its generated outputs look good enough that the product claim is believable.

No single judgment can substitute for the others.  
.

# MVP BUILD ORDER

Dependency order

1\. Product architecture and UI foundations.  
2\. Auth, project, limits, persistence.  
3\. IR/design-system/component registry schemas.  
4\. Product shell and reusable product UI primitives.  
5\. Generator component library \+ registry metadata.  
6\. Renderer.  
7\. Editor state/operations.  
8\. Deterministic generation engine.  
9\. Design-system editing/import/versioning.  
10\. Figma adapter.  
11\. Optional AI.  
12\. Hardening, tests, performance, security.  
13\. MVP release.

Why this order  
The renderer and editor must exist before generation becomes useful. The generation engine should prove it can create strong UI without AI before Figma or AI add ambiguity. Design-system behavior should be validated against real components before building extensive import tooling.

Vertical slices  
Do not build every component before testing the full pipeline. Use one product type and a small high-quality set of compositions to prove:  
Project → Design System → Generate → Validate → Render → Edit → Persist.

Then expand breadth.

Suggested first vertical slice  
A SaaS/marketing page is a good initial slice because it exercises navigation, hero, content sections, cards, CTA, footer, responsive rules, assets, typography, and design-system variation without requiring complex application data interactions.

# MVP ACCEPTANCE CRITERIA

Product  
• User can authenticate.  
• User can have exactly one active project.  
• Project can hold no more than three active design directions.  
• Limit states are explained and enforced server-side.

Design quality  
• Clayface application UI is consistent across main workflows.  
• Core flows are keyboard accessible.  
• All major empty/loading/error states are designed.  
• Generated test fixtures meet internal visual-quality review rather than merely rendering without errors.

Design system  
• User can start with Clayface default.  
• User can edit core supported tokens.  
• User can import valid design-system JSON.  
• Invalid imports receive useful validation messages.  
• Directions store/pin design-system versions.

Components  
• Registry contains versioned metadata.  
• Generator only chooses eligible components.  
• Historical direction references resolve after registry updates.

Generation  
• Deterministic generation works with AI disabled.  
• Result is valid Clayface IR.  
• Invalid output cannot be marked complete.  
• Generation progress and failure states are visible.  
• A completed direction opens directly in editor.

Editor  
• User can select a node.  
• Change supported content.  
• Change eligible variant.  
• Make supported layout changes.  
• Save/reload without structural corruption.  
• Switch among existing directions.

Figma  
• User can select a supported frame.  
• Import produces reviewable mapping.  
• Unsupported structures are surfaced.  
• Assets are not unnecessarily duplicated.  
• Accepted import becomes valid editable Clayface state.

AI  
• MVP may ship AI disabled; if enabled, it returns validated operations only.  
• Provider failure leaves project state intact.

Performance/reliability  
• Normal editor interactions do not require a generation round trip.  
• Background jobs are retry-safe/idempotent where necessary.  
• Critical flows have automated end-to-end coverage.  
• Production errors can be traced to request/job IDs.

Security  
• Cross-user resource access is blocked by server authorization tests.  
• Secrets are server-side.  
• Arbitrary imported JavaScript cannot execute inside the product.

Release gate  
Do not call the product MVP-ready solely because features exist. The above must work as one coherent workflow.

# OUT OF SCOPE FOR MVP

• Multiple projects per user.  
• Organizations/workspaces.  
• Granular team permissions.  
• Real-time collaborative editing.  
• Comments/review threads.  
• Marketplace/community component submissions.  
• Arbitrary third-party JavaScript components.  
• Full Figma feature parity.  
• Pixel-perfect recreation of unsupported Figma artwork.  
• Unlimited design directions.  
• Native mobile editor.  
• Many framework export targets.  
• GitHub synchronization.  
• Automatic PR creation.  
• Complex component-version migration UI.  
• Full event-sourced editing history.  
• Enterprise SSO.  
• Advanced billing tiers.  
• Plugin SDK.  
• Public API.  
• Component marketplace.  
• Full design-system governance/admin suite.

Architecture should not make these impossible, but MVP work should not be delayed to fully implement them.

# LOCKED MVP SCOPE

This section turns previously ambiguous scope into explicit decisions.

1\. First supported generation family  
Decision:  
Clayface MVP will optimize first for responsive marketing/product websites.

Initial product types:  
• software/SaaS,  
• technology product,  
• digital agency/studio,  
• startup/service business.

Initial page families:  
• Home.  
• Features / Product.  
• Pricing.  
• About.  
• Contact.

Why  
This family exercises the core Clayface thesis—typography, navigation, hierarchy, content sections, media, cards, CTAs, forms, footers, responsive structure, and meaningful design-system variation—without requiring application-specific data infrastructure.

Not initially optimized for:  
• complex dashboards,  
• ecommerce checkout/product management,  
• documentation systems,  
• social feeds,  
• data-heavy enterprise applications.

The IR should not prevent those categories later, but component-library breadth and generation benchmarks should focus on the locked MVP family.

2\. First component-library target  
Do not target a numeric library size.

MVP readiness is based on coverage:  
• navigation,  
• hero families,  
• logos/social proof,  
• feature sections,  
• content/media splits,  
• card grids,  
• stats,  
• testimonials,  
• comparison/pricing,  
• FAQ,  
• forms/contact,  
• CTAs,  
• footer,  
• basic utility/feedback components.

Each important category should have enough genuinely different structural variants to support meaningful direction diversity.

3\. Design directions  
Decision:  
One project, maximum three active design directions.

A direction is a coherent alternative composition strategy, not a random regeneration.

Recommended initial strategy families:  
• editorial/content-led,  
• product/visual-led,  
• minimal/conversion-led.

The generator may choose other labels internally, but the three directions must demonstrate deliberate global differences.

4\. MVP output / developer handoff  
Decision:  
Canonical state remains Clayface IR.

User-facing MVP outputs:  
• editable Clayface project,  
• hosted/interactive preview,  
• one developer-oriented React/Next.js export path.

Export principle  
Export is a derived artifact and can be regenerated from IR. The exported app must not become the source of truth.

Recommended export target  
A self-contained Next.js \+ React project using the exact component versions represented by the direction, with project design tokens emitted in a stable format.

The first export does not need:  
• multiple framework targets,  
• automatic GitHub sync,  
• pull requests,  
• arbitrary build-system choice.

Export review requirement  
A generated export should:  
• install successfully,  
• build successfully,  
• preserve supported responsive behavior,  
• preserve visual parity within defined tolerance,  
• contain no editor-only code,  
• include readable project structure,  
• include only required component implementations where feasible.

5\. Figma support claim  
MVP supports a bounded web-layout subset.

Supported target:  
• frame hierarchy,  
• auto layout,  
• common web sections,  
• standard text,  
• basic images/icons/assets,  
• reusable component instances when structure is interpretable,  
• layout/spacing/token hints.

Partial:  
• absolute positioning,  
• heavily customized components,  
• uncommon visual effects,  
• mixed-quality frame organization.

Unsupported as editable Clayface structure:  
• complex vector art,  
• sophisticated illustration construction,  
• advanced prototype behavior,  
• non-web canvases.

6\. AI  
Decision:  
AI is not required for MVP release.

AI may ship experimentally only after deterministic generation and operation validation are strong enough.

7\. Public MVP definition  
Clayface MVP is successful when a user can:  
1\. create the single project,  
2\. establish/import a design system,  
3\. optionally import a supported Figma frame,  
4\. generate up to three materially different valid directions,  
5\. edit a direction structurally,  
6\. preview it,  
7\. export the chosen direction as the supported developer artifact,  
8\. return later without losing or corrupting state.

This workflow is the scope anchor. Features that do not materially improve it should generally be deferred.

# ARCHITECTURE DECISIONS

These ADRs record decisions that should not be casually reopened during implementation. Revisit an ADR only when new evidence changes its assumptions or makes the trade-off invalid.

# ADR-001 — CLAYFACE IR

Status: Accepted.

Decision  
All source paths and editing paths converge into a versioned Clayface Intermediate Representation. The IR is canonical project design state.

Reason  
Without an intermediate representation, Figma, AI, React, and manual editing would each create different data models. That would make validation, editing, versioning, and future render targets brittle.

Consequences  
• Requires early schema design.  
• All adapters must normalize into IR.  
• Renderer consumes IR rather than Figma/AI output directly.  
• Editor actions become typed operations.  
• Enables deterministic persistence and migrations.

# ADR-002 — TYPESCRIPT CORE

Status: Accepted for MVP.

Decision  
Use TypeScript across the product app, API, schemas, generator, adapters, editor, and initial workers.

Reason  
Clayface's primary complexity is shared typed contracts, not raw compute throughput. TypeScript allows Zod/schema definitions, registry contracts, and editor/generator types to move across package boundaries with less duplication.

Consequences  
• Faster initial development.  
• Easier cross-layer refactors.  
• Heavy services may later move to Go/Rust if profiling proves a need.  
• Performance-sensitive code must still be measured rather than assumed acceptable.

# ADR-003 — COMPONENT REGISTRY

Status: Accepted.

Decision  
Generated interfaces can only use versioned components/compositions registered in Clayface or explicitly imported into a compatible project registry.

Reason  
The component registry is the main control against incoherent vibe-coded UI. It provides known structure, variants, constraints, accessibility behavior, and predictable rendering.

Consequences  
• Significant investment in component metadata and quality.  
• Generator becomes selection/composition rather than arbitrary code synthesis.  
• Registry search/filter performance matters.  
• Historical component versions require retention/deprecation policy.

# ADR-004 — DESIGN SYSTEM MODEL

Status: Accepted.

Decision  
Every project has a canonical Clayface design system containing semantic tokens and component/layout rules. Generated directions reference exact design-system versions.

Reason  
Visual difference should come from systematic rules rather than duplicating components for every brand.

Consequences  
• Component implementations must bind to semantic tokens.  
• Importers must normalize external systems.  
• Design-system edits need project-wide impact awareness.  
• Versioning is mandatory to avoid silently altering historical directions.

# ADR-005 — AI IS OPTIONAL

Status: Accepted.

Decision  
Core generation and editing must function without an LLM. AI is an optional refinement/interpretation layer that emits validated Clayface operations.

Reason  
Clayface's advantage is reliable design-system-driven generation, not dependence on probabilistic code generation.

Consequences  
• More up-front deterministic engine work.  
• AI outages do not block the core product.  
• AI context and outputs remain constrained.  
• Product messaging should not position Clayface as merely another prompt-to-code tool.

# ADR-006 — VERSION EVERYTHING THAT CAN CHANGE OUTPUT

Status: Accepted.

Decision  
Version the IR schema, project design systems, components, and relevant generation behavior.

Reason  
A design saved today must not silently change because Clayface updates a global component or schema later.

Consequences  
• Version metadata is present in project state.  
• Deprecated versions remain resolvable until migrated.  
• Migrations are explicit/tested.  
• Storage increases slightly in exchange for predictable historical output.

# REVIEW & REVISION PROCESS

Clayface should not be implemented from a static specification. The product is complex enough that assumptions must be reviewed after each major architectural or UX milestone.

This section defines how the specification itself evolves.

The review process has four goals:  
• Catch weak assumptions before they become infrastructure.  
• Separate opinion from evidence.  
• Make major changes explicit and reversible.  
• Prevent implementation momentum from overriding design quality.

Every major area should move through:  
Draft → Review → Decision → Implementation → Validation → Revision if necessary.

A section is not considered “done” because it contains text. It is done when its assumptions have been reviewed, its dependencies are understood, and the implementation has evidence that the decision works.

Review roles  
Even if one person is building the first version, reviews should be performed from distinct perspectives:  
• Product: does this solve the intended problem?  
• UX/design: is the workflow understandable and high quality?  
• Architecture: does the model remain coherent and maintainable?  
• Engineering: is the implementation realistic?  
• Security/reliability: can it fail safely?  
• Performance: does the design create unnecessary latency or storage cost?  
• Generated-output quality: does this actually produce better UI?

A review can result in:  
• Accepted.  
• Accepted with changes.  
• Needs prototype.  
• Deferred.  
• Rejected.  
• Reopened after evidence.

The document should be revised when implementation evidence contradicts an earlier assumption. Architecture Decisions record major stable choices; the Revision Log records meaningful changes to the working specification.

# REVIEW FRAMEWORK

Each major review should answer the same core questions.

1\. Problem review  
• What problem is this section solving?  
• Is that problem real for the MVP user?  
• Are we solving it at the correct layer?  
• Is the solution broader than the actual requirement?

2\. Assumption review  
List the assumptions the solution depends on.  
Examples:  
• A component registry can provide enough variation.  
• Three design directions are sufficient for MVP.  
• Users will accept constrained editing instead of raw CSS.  
• Figma frames can be mapped semantically often enough to be useful.  
• TypeScript performance is sufficient for early generation workloads.

For each assumption, classify it:  
• Known from current product requirement.  
• Reasonable engineering assumption.  
• Needs prototype.  
• Needs user evidence.  
• Needs load/performance evidence.

3\. Alternatives review  
For decisions with meaningful cost, document at least the strongest alternative and why it was not selected.

Avoid fake alternatives. “Use the chosen option or build something obviously worse” is not a review.

4\. Failure-mode review  
Ask:  
• How can this fail technically?  
• How can this create bad UX?  
• How can it create poor generated designs?  
• How could it become expensive to operate?  
• What happens when an external provider is unavailable?  
• What state could become corrupted?  
• What happens when the user provides unexpected input?

5\. Dependency review  
Identify upstream and downstream dependencies.  
No phase should begin because the calendar says so; it should begin because its inputs are stable enough.

6\. Prototype requirement  
Any decision with high uncertainty and high cost should be prototyped before full implementation.

Typical prototype candidates:  
• Figma semantic mapping.  
• Component compatibility rules.  
• IR expressiveness.  
• Design-system propagation.  
• AI operation planning.  
• Renderer/editor performance on complex pages.

7\. Acceptance evidence  
Every review gate needs observable evidence:  
• working prototype,  
• test fixture,  
• performance measurement,  
• visual review,  
• schema validation,  
• automated test,  
• user workflow completion,  
or another concrete artifact.

8\. Revision trigger  
Define what evidence would cause the decision to be reopened.

Example:  
“Use PostgreSQL JSONB for IR until direction documents routinely become large enough that editing/query patterns prove a separate document model is necessary.”

That is stronger than saying “PostgreSQL is final forever.”

# PHASE REVIEW GATES

GATE 0 — Product Definition Review  
Before repository restructuring.

Review:  
• Is Clayface clearly differentiated from prompt-to-code tools?  
• Is design-system-driven generation the actual product thesis?  
• Are Figma, AI, component registry, and renderer responsibilities clearly separated?  
• Are one-project/three-direction constraints still intentional?  
• Is the MVP user identifiable?

Required evidence:  
• concise product definition,  
• principles,  
• core user workflows,  
• explicit MVP boundary.

Failure condition:  
The team cannot explain Clayface consistently without contradicting the spec.

GATE 1 — UX Architecture Review  
Before rebuilding major product screens.

Review:  
• Does navigation reflect the actual project mental model?  
• Does the editor distinguish project-wide vs direction-specific changes?  
• Is the Design System workspace understandable?  
• Does onboarding collect enough structure without becoming tedious?  
• Are all critical states designed?

Required evidence:  
• information architecture,  
• low/mid-fidelity flows,  
• app-shell prototype,  
• state inventory,  
• at least one complete first-run-to-editor walkthrough.

Failure condition:  
Users need to understand implementation concepts to complete basic tasks.

GATE 2 — Schema & IR Review  
Before generator or Figma implementation.

Review:  
• Can IR express every component/composition required by the first vertical slice?  
• Can it support editing without raw DOM knowledge?  
• Are versioning and migrations possible?  
• Are IDs stable?  
• Is the operation model sufficient?  
• Does the schema accidentally encode React/Figma-specific assumptions?

Required evidence:  
• real IR fixtures,  
• validator tests,  
• migration test,  
• renderer consuming fixtures,  
• editor operations modifying fixtures.

Failure condition:  
Common UI changes require escaping the schema with arbitrary code or untyped blobs.

GATE 3 — Component System Review  
Before expanding the library.

Review:  
• Does taxonomy make sense?  
• Is registry metadata sufficient for deterministic selection?  
• Are variants meaningfully different?  
• Can the same components support multiple design systems?  
• Are accessibility and responsive guarantees testable?  
• Is the library creating genuine variation or cosmetic duplication?

Required evidence:  
• first component catalog,  
• multiple design-system demos,  
• visual review,  
• compatibility tests.

Failure condition:  
Different “generated” directions still look like the same template with different colors.

GATE 4 — Deterministic Generation Review  
Before relying on AI.

Review:  
• Can strong pages be generated without AI?  
• Does component selection follow explainable rules?  
• Are outputs structurally valid?  
• Are failures recoverable?  
• Does generation create useful variation?

Required evidence:  
• repeatable generation fixtures,  
• multiple directions,  
• visual-quality review,  
• timing measurements,  
• invalid-input tests.

Failure condition:  
The product needs an LLM to hide weaknesses in its deterministic design system.

GATE 5 — Figma Review  
Before claiming Figma support broadly.

Review:  
• Which Figma patterns map reliably?  
• How often is semantic interpretation ambiguous?  
• Does mapping preserve intent better than raw DOM recreation?  
• Are low-confidence cases visible to users?  
• Are imported designs still editable as Clayface-native structures?

Required evidence:  
• diverse frame corpus,  
• mapping-confidence results,  
• failure examples,  
• before/after visual review.

Failure condition:  
Figma import silently creates misleading or brittle layouts.

GATE 6 — AI Review  
Before AI is enabled by default.

Review:  
• Does AI improve results beyond deterministic controls?  
• Can every AI action be validated?  
• Are prompts resistant to project-content injection?  
• Does failure leave state intact?  
• Can users understand what changed?

Required evidence:  
• operation-level tests,  
• malformed-output tests,  
• provider-failure tests,  
• side-by-side quality examples.

Failure condition:  
AI becomes a hidden unrestricted code path.

GATE 7 — Performance & Security Review  
Before external users.

Review:  
• Editor responsiveness.  
• Generation latency.  
• Queue behavior.  
• tenant isolation.  
• upload handling.  
• secret handling.  
• backups and recovery.  
• observability.

Required evidence:  
• measured performance,  
• authorization tests,  
• worker crash/retry tests,  
• restore test,  
• security checklist.

GATE 8 — MVP Release Review  
Release only when the complete workflow is coherent.

Required evidence:  
• acceptance criteria pass,  
• critical E2E tests,  
• visual review of Clayface itself,  
• generated-output review across supported input paths,  
• known limitations documented,  
• support/debugging path available.

A gate may be reopened whenever implementation evidence invalidates the assumptions under which it passed.

# REVISION LOG

Purpose  
Track meaningful changes to the specification and why they changed. This is not a commit log and should not record trivial wording edits.

Revision A — Initial structured specification  
Changes:  
• Converted the original Clayface idea into separate product, UX, design-system, component, generation, Figma, AI, architecture, data, performance/security, and MVP sections.  
• Established Clayface IR as the canonical state model.  
• Established deterministic generation as the default.  
• Established AI as optional.  
• Added a TypeScript-first technical architecture.  
• Added phased MVP implementation.

Reason:  
The original concept was correct but mixed product definition, implementation, and constraints in one description.

Revision B — Depth and review pass  
Changes:  
• Introduced formal review framework and phase gates.  
• Added decision rationale, failure modes, alternatives, and revision triggers to high-risk areas.  
• Expanded architecture from “technology list” toward runtime responsibilities and boundaries.  
• Expanded MVP planning from feature sequencing toward evidence-based exit conditions.

Reason:  
The first structured spec was too shallow to safely drive a rebuild. It described what to build but not enough of why, how to challenge decisions, or how to know a phase is actually ready.

Future revisions  
Each entry should record:  
• what materially changed,  
• why it changed,  
• what evidence triggered the change,  
• which sections/ADRs are affected,  
• whether existing implementation must migrate.

# OPEN QUESTIONS

These are intentionally unresolved questions. They should be closed through prototypes, evidence, or explicit product decisions—not guesses.

Product  
• Is the first target audience primarily design engineers/frontend developers, or should the MVP optimize equally for non-technical designers?  
• Is “three design directions” the best mental model, or will users expect branches/versions instead?  
• What exact export/handoff experience must exist in MVP?

Generated UI  
• How much structural variation is required before users perceive directions as meaningfully different?  
• How many high-quality compositions are needed for the first supported page/product family?  
• How should Clayface score design quality beyond schema validity?

Editor  
• How much layout freedom can be exposed before users can break design quality?  
• Which overrides are instance-level versus design-system-level?  
• Is undo/redo local-only sufficient for MVP, or should it survive reload?

Design systems  
• Should directions automatically follow the latest design-system version or remain pinned by default?  
• What compatibility rules are required when a design-system change invalidates a component?

Figma  
• What minimum Figma subset is reliable enough to market as supported?  
• How will mapping confidence be calculated and presented?  
• How should custom Figma components be handled when there is no Clayface equivalent?

AI  
• Which refinements genuinely benefit from AI rather than deterministic controls?  
• Which model/provider offers the best combination of structured-output reliability, latency, cost, and privacy?

Technical  
• Is a separate renderer application required for MVP, or can it begin as a package/sandbox inside the web architecture?  
• At what document size does JSONB IR become inconvenient?  
• Do generation jobs need BullMQ from the start, or can early internal prototypes run synchronously while keeping the same job abstraction?

Performance  
• What is the maximum acceptable first-generation time for early users?  
• What page/node complexity should the editor support at MVP launch?

These questions should be revisited at the review gate where they become decision-blocking.

# CURRENT SPEC REVIEW

Review status: Needs targeted revision before implementation begins.

Overall assessment  
The Clayface specification now has a coherent product architecture, but several areas still carry unresolved product risk. The strongest parts are the separation between deterministic generation, Clayface IR, the component registry, design-system versions, and optional AI. The weakest parts are where product quality must become measurable and where the MVP boundary still allows too many interpretations.

CRITICAL FINDING 1 — First supported product family is not locked  
Severity: High.

The build plan suggests a SaaS/marketing page as the first vertical slice, but this is still framed as a suggestion rather than a product decision.

Why it matters:  
Component taxonomy, page-intent planning, benchmark fixtures, Figma mapping, design-review criteria, and even onboarding all depend on knowing what kind of interface Clayface must generate well first.

Decision required:  
Choose one canonical MVP generation family.

Recommended decision:  
Start with responsive marketing/product websites for software/startup/agency-style products. Support a bounded set of page families such as Home, Pricing, Features, About, and Contact before expanding to dashboards/ecommerce.

Review outcome:  
Needs decision before Component System expansion.

CRITICAL FINDING 2 — “Good design” is still not operational enough  
Severity: High.

The spec defines qualitative dimensions—hierarchy, spacing, density, consistency, accessibility, responsiveness—but does not yet define an actual review rubric.

Required revision:  
Create a repeatable design-quality rubric scored during internal generation review.

Suggested dimensions:  
• hierarchy clarity,  
• spacing rhythm,  
• typography quality,  
• section sequencing,  
• component consistency,  
• brand/design-system fit,  
• responsive integrity,  
• accessibility,  
• content-to-layout fit,  
• visual distinctiveness.

A generated direction should not be accepted internally simply because validation passes.

Review outcome:  
Needs a Design Quality Review rubric before deterministic generator review.

CRITICAL FINDING 3 — Component count should not be a target  
Severity: High.

The original concept referenced hundreds or thousands of components. Treating library size as a target could create a large low-quality registry.

Required revision:  
Measure component-system maturity through coverage and compositional range, not raw count.

A smaller set of excellent components with meaningful variants and good token bindings is more valuable than a huge catalog of cosmetic duplicates.

Review outcome:  
Revise roadmap language if implementation planning begins to optimize for count.

CRITICAL FINDING 4 — MVP export/handoff remains underspecified  
Severity: High.

The spec repeatedly mentions export/handoff but does not define the MVP artifact.

Possible outcomes include:  
• preview-only Clayface project,  
• generated React/Next.js code,  
• copyable component code,  
• downloadable project,  
• Figma output,  
• hosted preview,  
• Git integration.

This affects architecture substantially.

Recommended MVP direction:  
Define the canonical MVP output as editable Clayface state \+ reliable hosted preview, then add one explicit developer handoff/export path. Do not promise multiple framework outputs initially.

Review outcome:  
Blocker for final MVP scope.

CRITICAL FINDING 5 — Figma support needs a marketed support contract  
Severity: High.

The architectural limitations are documented well, but there is no user-facing definition of what “Figma import supported” means.

Required revision:  
Create supported-input categories.

Example:  
Supported:  
• frames using auto layout,  
• standard text,  
• images/icons,  
• common responsive web sections,  
• reusable component instances.

Partially supported:  
• unusual absolute positioning,  
• custom complex components,  
• unusual effects.

Unsupported:  
• complex vector artwork as editable Clayface structure,  
• advanced prototype logic,  
• non-web canvases.

Review outcome:  
Required before Figma implementation is marketed or treated as complete.

IMPORTANT FINDING 6 — Clayface’s own visual design system is still conceptual  
Severity: Medium-High.

The spec says the product should feel like Notion/Airtable in clarity and restraint, but actual product tokens and component specifications are not yet defined.

Still needed:  
• exact typography system,  
• neutral palette,  
• accent behavior,  
• spacing scale,  
• radius values,  
• panel dimensions,  
• border rules,  
• elevation rules,  
• interaction states,  
• core app-shell component specs.

Review outcome:  
The UI rebuild should not begin from visual intuition alone. A concrete Clayface product design system must precede high-fidelity screen work.

IMPORTANT FINDING 7 — Renderer boundary is unresolved  
Severity: Medium.

The architecture allows a separate renderer app but does not decide whether MVP requires one.

Recommended approach:  
Begin with renderer-core \+ isolated preview surface within the product architecture. Split into a separately deployed renderer only when security, export, scaling, or runtime constraints justify it.

Review outcome:  
Can remain an implementation decision, but should not create duplicate rendering logic.

IMPORTANT FINDING 8 — AI should remain behind a release gate  
Severity: Medium.

The AI architecture is strong, but AI should not be scheduled automatically just because earlier phases finish.

Required evidence before enabling:  
• deterministic generation produces credible results,  
• operation model is stable,  
• AI produces measurable improvement,  
• failures remain safe.

Review outcome:  
Keep AI off by default until Gate 6 passes.

IMPORTANT FINDING 9 — Data model is appropriately simple, but page storage needs evidence  
Severity: Medium.

Storing pages inside IR/JSONB is reasonable for MVP, but editor/query patterns may later require normalization.

Review outcome:  
Do not normalize prematurely. Add telemetry/fixtures for document size and update patterns, then revisit.

IMPORTANT FINDING 10 — Codebase migration is missing from the spec  
Severity: High for immediate work.

The user already has an existing Clayface implementation that is considered structurally wrong. The spec defines the target architecture but does not yet map the current repository into:  
• keep,  
• refactor,  
• move,  
• replace,  
• delete.

Required next artifact:  
Existing Codebase Audit & Migration Plan.

It should identify:  
• current framework/packages,  
• current app routes,  
• current state/data model,  
• current component system,  
• current generation logic,  
• current Figma integration,  
• current styling/design tokens,  
• reusable utilities,  
• technical debt,  
• migration sequence.

FINAL REVIEW OUTCOME

The specification is now strong enough to guide architecture discussions, but it is not yet implementation-complete.

Before full rebuild begins, close these four blockers:  
1\. Lock the first supported product/page family.  
2\. Define the MVP export/handoff outcome.  
3\. Define the Clayface internal design-quality rubric.  
4\. Audit the existing repository against the target architecture.

After those are resolved, Gate 0 and Gate 1 can be reviewed properly.

Review verdict:  
Accepted as architecture baseline.  
Not yet accepted as implementation-ready specification  
REVIEW REVISION APPLIED

The review produced immediate specification changes rather than remaining advisory.

Resolved now:  
• First supported generation family is locked to responsive marketing/product websites.  
• Initial page families are locked.  
• Component-library success is defined by coverage and meaningful variation, not raw component count.  
• MVP handoff is defined as editable Clayface state \+ hosted preview \+ one Next.js/React export path.  
• Figma's MVP support boundary is now explicit.  
• Clayface Visual System v1 now establishes concrete typography, spacing, surfaces, borders, radius, color roles, panel geometry, and implementation rules.  
• A 10-category generated-design quality rubric now exists with explicit pass expectations.  
• AI remains behind its review gate and is not a release dependency.

Still unresolved:  
• Existing codebase migration, because it requires repository inspection.  
• Final brand accent/font choice after visual prototype review.  
• Exact renderer deployment boundary, which should be decided from prototype/security evidence.  
• Exact performance thresholds, which should be tuned from measured fixtures rather than guessed.

Updated review verdict:  
The product/architecture specification is now substantially deeper and suitable for beginning a controlled repository audit and early prototypes. Full implementation should still wait for the existing-code migration assessment and Gate 0/Gate 1 review evidence.  
.

