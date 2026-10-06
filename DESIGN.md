---
name: Clayface Public + Workbench
description: An expressive product studio for turning clear ideas into connected websites.
colors:
  app-bg: "#f8f7fb"
  panel: "#ffffff"
  elevated: "#ffffff"
  canvas: "#eeedea"
  hover: "#f0efeb"
  muted-surface: "#f5f4f1"
  primary-text: "#19152f"
  secondary-text: "#68657a"
  muted-text: "#858198"
  border-default: "#e4e1ed"
  border-strong: "#cbc7d8"
  product-accent: "#635bff"
  accent-hover: "#4c44dd"
  accent-subtle: "#e4e0ff"
  accent-text: "#5149df"
  state-success: "#28664d"
  state-warning: "#b36b24"
  state-danger: "#c74351"
  danger-bg: "#fff1f4"
  hero-ink: "#19152f"
  hero-lime: "#d8ff75"
  hero-coral: "#ff766c"
  hero-cyan: "#7fe7e4"
typography:
  title:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "26px"
    fontWeight: 520
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  section:
    fontFamily: "'Geist Variable', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.35
  panel:
    fontFamily: "'Geist Variable', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 550
    lineHeight: 1.4
  body:
    fontFamily: "'Geist Variable', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Geist Variable', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  control: "6px"
  md: "8px"
  overlay: "12px"
spacing:
  base: "4px"
  xs: "4px"
  sm: "8px"
  row: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "40px"
  topbar: "48px"
components:
  button-primary:
    backgroundColor: "{colors.product-accent}"
    textColor: "#fffaf7"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
    height: "32px"
  button-secondary:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.primary-text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
    height: "32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
    height: "32px"
  button-danger:
    backgroundColor: "{colors.state-danger}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
    height: "32px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    size: "28px"
  input:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.primary-text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 9px"
    height: "33px"
  panel-heading:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.primary-text}"
    typography: "{typography.panel}"
    padding: "0 17px"
    height: "41px"
  canvas-paper:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.sm}"
  empty-state:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted-text}"
    typography: "{typography.body}"
    padding: "24px"
---

# Design System: Clayface Workbench

## Overview

**Creative North Star: "The Restrained Workbench"**

Clayface is a serious design and productivity workspace for long, focused sessions. Its product chrome is warm, neutral, compact, and structured so the generated website remains the visual focus. Geist provides a neutral, high-legibility voice; borders, modest radii, and small tonal shifts make the hierarchy clear without ornamental noise.

This is the current Operate direction for the fixture-driven workbench. It documents the implemented shell and its shared interaction language: a stable frame, explicit editing scope, browser-local save state, and a canvas rendered from the same source used by preview. Sample content and sample project state stay visibly labeled. Generated content may carry its own palette inside the canvas and preview.

**Key Characteristics:**

- Warm neutral chrome with a restrained clay accent (`#965B40`).
- Compact labels and controls built on a 4px spacing scale.
- Crisp 1px borders and tonal layering in place of heavy card shadows.
- Stable 48px top bar, 224px navigation rail, and 288px inspector on desktop.
- Responsive navigation drawer and inspector behavior with keyboard-safe focus and reduced motion.

## Colors

The workbench uses warm neutrals for structure and reserves the clay accent for identity, selection, and primary actions. The generated site is allowed to express its own design system within the shared renderer.

### Primary

- **Restrained Clay** (`#965B40`): Product mark, active selection, primary actions, and focused editor affordances. It should remain a supporting signal rather than fill the chrome.
- **Clay Hover** (`#7F4932`): Hover state for primary actions.
- **Clay Text** (`#854E35`): Accent text on light selected and active surfaces.

### Neutral

- **App Paper** (`#FAF9F7`): App-level background for full-width workspace views.
- **Panel Paper** (`#FDFCFB`): Top bar, navigation, and panel surfaces.
- **Elevated White** (`#FFFFFF`): Inputs, inspector controls, and raised utility surfaces.
- **Canvas Stone** (`#EEEDEA`): Editor canvas surround.
- **Hover Stone** (`#F0EFEB`): Neutral hover surface.
- **Muted Stone** (`#F5F4F1`): Quiet control and metadata surface.
- **Primary Ink** (`#302E2B`): Main text and high-contrast utility actions.
- **Secondary Ink** (`#67635E`): Supporting labels and normal navigation text.
- **Muted Ink** (`#77716A`): Metadata, hints, and low-emphasis copy.
- **Default Line** (`#E8E5DF`): Standard dividers and borders.
- **Strong Line** (`#D7D2C9`): Inputs, stronger dividers, and secondary button edges.

### Named Rules

**The Quiet Chrome Rule.** Keep product chrome predominantly neutral; use the product accent where an action, selection, or identity needs to be found.

**The Two Palettes Rule.** The workbench owns the editor chrome. Rendered/generated content keeps its own palette and must not be recolored to match the shell.

## Typography

**Display Font:** Geist Variable (with Geist, system sans fallbacks)

**Body Font:** Geist Variable (with Geist, system sans fallbacks)

**Label/Mono Font:** Geist Variable for labels; monospace is reserved for route and numeric indicators.

**Character:** Neutral, restrained, and highly legible. Weight is controlled so hierarchy comes from role, size, and placement rather than making every label bold.

### Hierarchy

- **Title** (520, `26px`, `1.25` line-height, `-0.04em`): Workspace and page titles.
- **Section** (500, `18px`, `1.35` line-height): Settings and major content sections.
- **Panel** (550, `13px`, `1.4` line-height): Top-level panel headings and inspector groups.
- **Body** (400, `13px`, `1.5` line-height): Default product UI copy and controls.
- **Label** (400–500, `12px`, `1.4` line-height): Compact navigation, fields, buttons, and metadata labels.

### Named Rules

**The Scanability Rule.** Keep product UI in the compact 11–14px range and use line-height that supports fast scanning. Do not turn the application shell into a marketing headline canvas.

## Layout

The desktop shell is a two-axis frame: a full-width 48px top bar, a 224px left navigation rail, a flexible center workspace, and a 288px right inspector. The editor center contains a compact toolbar, the canvas surround, and a status bar; the canvas paper is centered inside the remaining width and scrolls independently. Full-screen project tools can replace the canvas while preserving the shell frame.

The spacing rhythm starts at 4px, with observed steps of 4, 8, 12, 16, 20, 24, 32, 40, and 48px. Use 4–6px for icon gaps, 6–8px inside controls, 8–12px for panel rows, 20–24px inside settings sections, and 32px or more for large workspace separation.

At widths below 1100px the inspector is hidden until requested and opens as an overlay drawer from the right. Below 760px the navigation rail becomes an accessible drawer, the top bar simplifies, and preview controls adapt to the narrower viewport. The canvas remains usable in the available width; panels must not create trapped scrolling.

## Elevation & Depth

Depth is primarily tonal and structural. Warm neutral surfaces, 1px borders, selected backgrounds, and the canvas surround establish hierarchy. Shadows are reserved for overlays, toasts, the canvas paper, and mobile drawers; they should not turn every settings group into a floating card.

### Shadow Vocabulary

- **Overlay:** `0 18px 65px #30251b26` for dialogs and substantial overlays.
- **Toast:** `0 5px 22px #33251a14` for transient status messages.
- **Canvas paper:** `0 2px 12px #3e342210` to separate the rendered paper from the canvas surround.
- **Mobile drawer:** `10px 0 40px #302b251f` for the open navigation drawer and a restrained directional shadow for the inspector drawer.

### Named Rules

**The Tonal Layering Rule.** Use surface changes and borders before adding shadow. A shadow should explain a temporary layer or a canvas boundary.

## Shapes

The shape language is modest and geometric: 4px for tags, page rows, and small icon buttons; 6px for controls and fields; 8px for cards and medium containers; 12px for overlays and dialogs. Use 1px neutral borders by default and the accent border for active selection. Avoid defaulting to large 16–24px SaaS radii.

Focus is visible and consistent: buttons and links receive a 2px accent outline with a 3px offset; fields and selects shift to an accent border with a 2px subtle accent ring. Selection outlines belong to the editor layer and never enter exported rendered UI.

## Components

The component language is compact, semantic, and stateful. Shared primitives in `apps/web/src/components/ui.tsx` provide buttons, icon buttons, the Clayface mark, accessible navigation and modal dialogs, and an explicit empty state. Product chrome is token-driven in `globals.css`; rendered website components use the shared renderer styles from `packages/component-library/src/styles.ts`.

### Buttons

- **Character:** Compact controls with clear action hierarchy and no oversized marketing treatment.
- **Primary:** Clay background (`#965B40`), near-white text, 6px radius, `7px 12px` padding, and a 32px minimum height. Hover uses `#7F4932`.
- **Secondary:** White elevated surface, strong neutral border, primary ink, same geometry and padding.
- **Ghost:** Transparent at rest, secondary ink, and a neutral hover surface.
- **Danger:** `#B64036` with white text, reserved for the explicit destructive action point.
- **Focus:** Use the shared visible focus treatment; icon-only buttons always provide an accessible name and tooltip title.

### Chips

- **Style:** Small 4px radius, 1px default border, muted ink, and compact padding. Sample chips identify fixture content such as “Sample project” and “Sample preview.”
- **State:** Chips label context; they do not carry the only indication of a state.

### Cards / Containers

- **Corner Style:** 8px for direction cards and medium containers.
- **Background:** Elevated white or panel paper against app paper or canvas stone.
- **Shadow Strategy:** Flat at rest, with borders doing most of the work; use the elevation vocabulary only for temporary layers or canvas paper.
- **Border:** 1px default line; dashed strong line for an add-new placeholder.
- **Internal Padding:** Use the 4px scale, commonly 12–17px in compact cards and 17px in inspector groups.

### Inputs / Fields

- **Style:** Elevated white background, 1px strong border, 6px control radius, `8px 9px` padding, 33px input height, and 13px body text.
- **Focus:** Accent border plus a 2px `#F2E9E2` ring.
- **Error / Disabled:** Danger uses explicit danger color and danger background; disabled controls reduce opacity and keep their geometry readable.

### Navigation

- **Desktop:** 224px panel-paper rail with 12px labels, 34px minimum navigation rows, and 3px vertical row gaps. Active rows use the subtle accent surface and accent text.
- **Page tree:** 12px rows with 4px radius, a restrained connector line, and an accent selection dot.
- **Mobile:** The rail becomes a 244–260px drawer over a scrim below 760px. The drawer preserves the same hierarchy and exposes an explicit close control.

### Workbench Frame

The top bar keeps project, active direction, preview, export availability, browser save status, and account actions visible. The inspector groups component, variant, content, layout, and appearance controls; an empty inspector gives a direct route to selecting the hero. The canvas selection treatment is editor-only.

### Dialogs and Empty States

Dialogs use the 12px overlay radius, modal shadow, a clear heading/description pair, and a labeled close icon button. Empty states use a geometric symbol, concise explanation, and a direct next action. Error, limit, delete, and browser-storage states retain the same calm hierarchy and explain recovery.

## Do's and Don'ts

### Do:

- **Do** use the warm neutral product surfaces and exact shared tokens for new workbench UI.
- **Do** build spacing from the 4px base and preserve the 4/6/8/12px radius family.
- **Do** keep labels compact, weights restrained, and controls semantic.
- **Do** keep the 48px top bar, 224px navigation, and 288px inspector proportions unless a responsive rule applies.
- **Do** use the shared renderer for editor canvas and preview so the visible design stays consistent.
- **Do** provide keyboard access, named icon buttons, visible focus, and `prefers-reduced-motion` behavior.
- **Do** label fixture content and browser-local state clearly.

### Don't:

- **Don't** introduce a separate brand visual workshop or imply a visual direction beyond the current Operate workbench.
- **Don't** use large 16–24px radii, oversized UI typography, or decorative gradients in the product chrome.
- **Don't** wrap every settings group in a bordered or shadowed card.
- **Don't** let the clay accent dominate the editor or recolor generated site content.
- **Don't** imply live auth, Figma connection, server generation, or Next.js export in fixture UI.
- **Don't** make color the sole carrier of selection, status, danger, or success.
- **Don't** add motion that shifts the canvas unexpectedly; remove transitions and animation under reduced-motion preferences.
