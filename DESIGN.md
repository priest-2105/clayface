---
version: alpha
name: Clayface Material System
description: Design system guidelines for the Clayface AI frontend compiler.
colors:
  clay-porcelain: "#F6F3EE"
  clay-raw: "#E7DFD2"
  clay-compressed: "#D4C7B5"
  clay-leather: "#B8A58D"
  clay-kiln: "#2A2623"
  clay-bronze: "#75604A"
  accent-hover: "#8A7359"
  accent-light: "#A89178"
  text-secondary: "#4A433C"
  text-tertiary: "#7A7167"
  text-quaternary: "#A99E90"
  border-standard: "rgba(42, 38, 35, 0.14)"
  success: "#6E7A3E"
  warning: "#B4682B"
  error: "#B5502E"
  info: "#5C6570"
typography:
  hero:
    fontFamily: Instrument Serif
    fontSize: "clamp(3rem, 7vw, 5.75rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  display-xl:
    fontFamily: Instrument Serif
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  title-1:
    fontFamily: Geist
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-0.018em"
  title-2:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-0.018em"
  title-3:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: 500
    lineHeight: 1.22
    letterSpacing: "-0.01em"
  title-4:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: 500
    lineHeight: 1.28
    letterSpacing: "-0.01em"
  subheading:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0"
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  body:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
  body-sm:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0"
  label-sm:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  caption:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  micro:
    fontFamily: Geist
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0"
  caps:
    fontFamily: Geist
    fontSize: 0.6875rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.1em"
  code:
    fontFamily: IBM Plex Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  serif-note:
    fontFamily: Instrument Serif
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0"
rounded:
  pressed: 12px
  soft: 18px
  molded: 24px
  inflated: 32px
  melted: 40px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  xxl: 96px
components:
  button-primary:
    backgroundColor: "{colors.clay-bronze}"
    textColor: "{colors.clay-porcelain}"
    rounded: "{rounded.pressed}"
    height: 40px
  card:
    backgroundColor: "{colors.clay-raw}"
    textColor: "{colors.clay-kiln}"
    rounded: "{rounded.soft}"
  input:
    backgroundColor: "rgba(42, 38, 35, 0.03)"
    textColor: "{colors.clay-kiln}"
    rounded: "{rounded.pressed}"
    height: 40px
---
# Clayface Design System

## Overview

Clayface is a product-first design system for an AI frontend compiler. The default experience is a dense, trustworthy creation tool: familiar enough for users of Figma, Linear, Notion, and code editors to understand immediately, but with a distinct clay material identity.

The system is built on tactile surfaces rather than generic SaaS cards. Porcelain, raw clay, compressed clay, leather clay, kiln ink, and fired bronze create a restrained product palette. The app should feel like malleable material being shaped by precise compiler controls.

Use the landing page as the primary brand surface and authenticated screens as the primary product surface. Product UI wins by consistency, speed, and task clarity. Brand moments can use richer imagery, video, and Instrument Serif; app screens should mostly use Geist, restrained color, predictable controls, and direct workflow structure.

## Colors

The palette is intentionally narrow. Fired Bronze is the only primary chromatic accent and should carry primary actions, selected states, focus, and important AI moments. Avoid blue, purple, neon, and multi-color AI gradients unless a user-supplied design system explicitly requires them for generated output.

- **Porcelain `#F6F3EE`:** primary canvas for marketing and light product panels.
- **Raw Clay `#E7DFD2`:** standard surface for cards, side panels, and grouped content.
- **Compressed Clay `#D4C7B5`:** hover and elevated surface density.
- **Leather Clay `#B8A58D`:** deeper interaction and pressed surface tone.
- **Kiln `#2A2623`:** primary text and dark structure, never pure black.
- **Fired Bronze `#75604A`:** accent, primary actions, focus, current selection, and compiler moments.

Text levels must stay readable on tinted surfaces. Use Kiln for primary text, `#4A433C` for secondary text, `#7A7167` for tertiary text, and reserve `#A99E90` for disabled or very low-priority metadata. Placeholder text should not be lighter than the quaternary token unless the contrast has been checked.

Semantic colors are earth-derived: olive for success, burnt amber for warning, terracotta for error, and slate for information. Do not introduce saturated status colors that break the material palette.

## Typography

Geist is the interface font and should carry navigation, forms, chat UI, settings, projects, labels, tables, cards, and generated-code controls. IBM Plex Mono is the compiler voice for code previews, IDs, timestamps, technical metadata, and compact system labels. Instrument Serif is a display accent for hero headlines and editorial brand moments only.

Product screens should use the fixed role scale: `text-title-1`, `text-title-2`, `text-title-3`, `text-title-4`, `text-subheading`, `text-body-lg`, `text-body`, `text-body-sm`, `text-label`, `text-label-sm`, `text-caption`, `text-micro`, `text-caps`, `text-code`, and `text-code-sm`. The matching React helpers are `Heading`, `Text`, `Kicker`, and `CodeText` from `components/ui/Typography.tsx`.

Fluid type is allowed only for brand display roles: `text-hero`, `text-display-xl`, `text-display-lg`, and `text-display-md`. Avoid fluid hero-scale type inside authenticated app views, sidebars, settings, project pages, or chat controls. Use display type sparingly and never for UI labels, buttons, form controls, table headers, menus, or error text.

Instrument Serif is for hero, display, and occasional `text-serif-note` accents. Geist is the product interface voice. IBM Plex Mono is for code, IDs, timestamps, files, technical metadata, and compiler labels. Do not add a fourth type family without replacing one of these roles.

Headings use tight but safe letter spacing, never below `-0.04em`. Body copy uses normal letter spacing. Long prose should stay under 75 characters per line; dense data and code panels may run wider when the task requires it. Use `measure-prose` and `measure-compact` to cap readable text blocks.

## Layout

Use an 8-point spacing system with larger product rhythm steps: 8, 16, 24, 40, 64, and 96px. Product UI should feel dense but not cramped. Prefer clear structural layouts: fixed sidebars, top bars, split panes, project lists, settings grids, chat workspaces, and code panels.

Authenticated screens should prioritize task continuity. Keep primary navigation stable, preserve workspace context, and avoid landing-page section patterns in app views. For onboarding, capture user type, stack, preferred design-system mode, Figma/reference availability, and output expectations as a focused setup flow rather than a marketing questionnaire.

Responsive behavior should be structural: sidebars collapse, split panes stack, tables become lists or scroll containers, and toolbars wrap predictably. Do not rely on viewport-scaled typography to solve product layout.

## Elevation & Depth

Elevation is material density, not decorative drop shadow. Use tonal shifts, borders, inset highlights, and surface compression before shadows. Shadows are reserved for floating elements, menus, popovers, dialogs, and brand preview objects.

Standard cards should usually use a clay surface plus border, not a large soft shadow. Avoid pairing a 1px border with a wide decorative shadow on the same repeated product card. If an element floats, the shadow should be purposeful and restrained.

Chat and generation states can use material changes: a prompt surface can compress on focus, an attached reference can fuse into a project, and AI thinking can stretch or pulse gently. The state must be understandable without motion.

## Shapes

Clayface uses a five-step Morph Scale:

- **Pressed `12px`:** inputs, buttons, selects, compact controls.
- **Soft `18px`:** cards, panels, repeated items.
- **Molded `24px`:** chat bubbles, larger grouped controls.
- **Inflated `32px`:** AI generation surfaces and special states.
- **Melted `40px`:** hero sections or large brand moments.

Use the tokenized scale instead of arbitrary radius values. Product cards should normally stay at Pressed or Soft. Larger radii are reserved for surfaces where the material metaphor has a real role.

## Components

Implemented primitives live in `components/ui` and are re-exported from `components/ui/index.ts`. The current shared layer includes Button, Input, Textarea, Select, Checkbox, Switch, Label, Badge, Card, Alert, Skeleton, EmptyState, Separator, Tabs, Tooltip, Dialog, Popover, DropdownMenu, Toast, FormSection, FormField, FormLabel, FormDescription, FormError, FormActions, Heading, Text, Kicker, CodeText, and Avatar.

Clayface-specific components live in `components/clayface` and are re-exported from `components/clayface/index.ts`. The current product layer includes PromptBox, CodePreview, GenerationPreview, ProjectCard, DesignSystemReferenceCard, OnboardingStep, OnboardingFlow, MetricTile, StatusPill, PageHeader, ProjectHeader, ActivityTimeline, ChatMessage, ChatMetaBadge, ConfirmDialog, and ReferenceInspector.

The live component inventory is available at `/design-system`. Use it as the visual QA surface when adding or changing components.

Buttons use familiar shapes and clear hierarchy. Primary buttons use Fired Bronze material treatment and should be limited to the most important action in a local workflow. Secondary, outline, ghost, and destructive variants should preserve size, radius, and motion vocabulary. Every button needs default, hover, focus, active, disabled, and loading behavior.

Inputs and textareas are Pressed surfaces with clear labels, visible focus rings, and readable placeholders. Selects should look like part of the same control family. Use helper text and inline errors instead of hiding validation inside toasts.

Cards and panels group real workflow content. Avoid nested cards. Use cards for repeated items, forms, settings sections, project references, code previews, and modals. Full page sections should be layout bands or app regions, not floating card stacks.

Chat surfaces should keep the prompt as the dominant creation control. Attachment controls, stack selection, design-system selection, and send states must be compact, keyboard accessible, and visually subordinate to the prompt.

Project and design-system management screens should favor scannable lists, clear primary/reference states, and direct actions. Empty states should teach the next action, such as attaching a Figma file or creating a first project, without long explanatory copy.

Generated code previews should use IBM Plex Mono, strong overflow handling, and clear file/context labels. Generated UI previews should honor the user's chosen design system first; Clayface brand tokens are the shell, not a forced style for every output.

Motion should run 150-250ms for routine product interactions. Use the existing clay physics vocabulary: compress for buttons, imprint for surfaces entering, fuse for attachment/merge moments, stretch for AI thinking. Provide reduced-motion alternatives and never gate content visibility on animation.

## Do's and Don'ts

- Do keep product UI familiar, dense, and predictable.
- Do use Fired Bronze for primary actions, selected states, focus, and important AI moments.
- Do ask onboarding questions when user role, stack, and design-system preference matter.
- Do use Figma-like clarity where it helps: direct manipulation, stable panels, precise controls, and inspectable outputs.
- Do make generated outputs accessible, typed, and reviewable by default.
- Don't make Clayface look like a generic AI SaaS dashboard or a shadcn clone.
- Don't default to dark developer-tool UI unless a specific workflow earns it.
- Don't introduce blue, purple, neon, gradient text, or decorative multi-color AI effects into the Clayface shell.
- Don't use Instrument Serif inside app controls, labels, settings, tables, or code workflows.
- Don't use decorative motion, glassmorphism, nested cards, side-stripe card accents, or arbitrary large radii.
