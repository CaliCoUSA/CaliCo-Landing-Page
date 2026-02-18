# Project: Velocity Builder (The Prompt IDE)

**Status:** v1.2 Dynamic Drawers — Fully Operational
**Date:** 2026

## 1. Project Vision

A specialized "Prompt IDE" that converts user "vibes" and technical requirements into a modular, multi-prompt development sequence. It prevents "prompt decay" by using a structured manifest to guide an LLM through a professional, file-based workflow.

Configurable layout sections (CTA, Pricing, Testimonial) carry their own data into the manifest as structured objects, ensuring the AI receives precise, actionable specs rather than inferring section content from context alone.

---

## 2. The Core Engine: Global Manifest (JSON)

This is the "Single Source of Truth" that the app populates based on user input. This data structure ensures the AI maintains context across multiple chat sessions.

Standard layout sections are serialized as strings. Configurable sections are serialized as objects with all drawer field values attached.

```json
{
  "project_metadata": {
    "name": "Project Name",
    "framework": "Vanilla HTML/Tailwind/JS",
    "file_structure": "modular-folder-system",
    "business_niche": "Captured from input",
    "target_audience": "Captured from input"
  },
  "vibe_identity": {
    "aesthetic_archetype": "Descriptive Style Name",
    "color_palette": {
      "primary": "#hex",
      "accent": "#hex",
      "background": "#0F0518",
      "surface": "rgba(255, 255, 255, 0.05)"
    },
    "typography": {
      "heading_font": "Captured from input",
      "body_font": "Captured from input"
    },
    "marketing_dna": {
      "pain_points": "Captured from input",
      "conversion_goal": "Captured from input",
      "keywords": "Captured from input",
      "core_solutions": "Captured from input"
    }
  },
  "layout_blueprint": [
    "Header / Nav",
    "Hero Section",
    {
      "section": "CTA",
      "cta_headline": "Captured from drawer",
      "cta_subheadline": "Captured from drawer",
      "cta_button_text": "Captured from drawer",
      "cta_button_action": "scroll-to-form | open-modal | external-link"
    },
    {
      "section": "Pricing",
      "pricing_tiers": "2 | 3",
      "pricing_billing": "monthly | annual | one-time",
      "pricing_tier_names": "Captured from drawer"
    },
    {
      "section": "Testimonial",
      "testimonial_count": "2 | 3 | 4",
      "testimonial_source": "placeholder | real",
      "testimonial_names": "Captured from drawer"
    },
    "Footer"
  ],
  "tool_integrations": {
    "React": "Boolean",
    "Supabase": "Boolean",
    "Auth": "Boolean",
    "GSAP": "Boolean"
  },
  "red_team_constraints": {
    "feature_count": "Captured from input",
    "audits": {
      "mobile": "Boolean",
      "validation": "Boolean",
      "wcag": "Boolean"
    }
  }
}
```

---

## 3. System Architecture

The application is built using a modular JavaScript approach to separate UI logic from prompt engineering templates.

**Current File Structure:**

* **index.html**: The UI Dashboard providing the visual controls for the project.
* **js/app.js**: The Engine handling DOM scraping, drag-and-drop layout logic, dynamic drawer rendering, manifest serialization, and prompt injection.
* **js/templates.js**: The Brain storing the 5-stage professional prompt library. All stages include a `{{PROJECT_JSON}}` placeholder for manifest slice injection.
* **project-dna-schema.json**: The static blueprint reference for developers and LLMs.

**Deployment Target:** calico-usa.com/velocity-builder

---

## 4. Dynamic Section Configuration (Drawers)

When a user adds a CTA, Pricing, or Testimonial block via the Layout Map expansion buttons, an inline configuration drawer is rendered beneath the block. The drawer opens automatically on add and can be toggled via a chevron control.

Drawer fields are scoped strictly to their section type. On manifest build, `app.js` detects the presence of a drawer and serializes all `data-field` values into a structured object rather than a plain string label.

**CTA Drawer Fields:**
- `cta_headline` — Section headline text
- `cta_subheadline` — Supporting copy beneath the headline
- `cta_button_text` — The button label
- `cta_button_action` — Behavior: `scroll-to-form`, `open-modal`, or `external-link`

**Pricing Drawer Fields:**
- `pricing_tiers` — Number of tiers: `2` or `3`
- `pricing_billing` — Cycle: `monthly`, `annual`, or `one-time`
- `pricing_tier_names` — Comma-separated tier names

**Testimonial Drawer Fields:**
- `testimonial_count` — Number of cards: `2`, `3`, or `4`
- `testimonial_source` — `placeholder` or `real`
- `testimonial_names` — Real names and roles if applicable

Drag-and-drop is preserved for blocks with drawers. Click events inside the drawer are stopped from propagating to prevent accidental drag initiation.

---

## 5. Prompt Engineering Strategy (The "Vending Machine")

All prompts are stored in `js/templates.js` as exportable constants. Each stage receives a trimmed manifest slice containing only the data relevant to its role. This prevents context clutter and keeps AI output focused.

| Stage | Role | Manifest Slice Received |
|---|---|---|
| Stage 1: The Architect | Repository Setup | Full manifest |
| Stage 2: The Stylist | Design System | Vibe identity only |
| Stage 3: The Builder | HTML Structure | Layout blueprint + marketing DNA |
| Stage 4: The Logic | JS & Integrations | Tool integrations + CTA configs |
| Stage 5: The Red Team | QA Audit | Constraints + target audience |

### Stage 1: The Architect (Repository Setup)
* **Goal**: Initialize the folder structure, scaffold empty files, and save `project-dna.json`.
* **Status**: ✅ Live

### Stage 2: The Stylist (Design System)
* **Goal**: Create `variables.css`, `global.css`, and `components.css` based on the Vibe Identity.
* **Status**: ✅ Live

### Stage 3: The Builder (Layout Engine)
* **Goal**: Construct semantic HTML structure (`index.html`) based on the ordered Layout Blueprint. Configurable sections include exact field values for copy and structure.
* **Status**: ✅ Live

### Stage 4: The Logic (Feature Integrations)
* **Goal**: Generate modular JavaScript for selected tools. CTA button actions are wired explicitly using the `cta_button_action` field from the manifest.
* **Status**: ✅ Live

### Stage 5: The Red Team (Security & UX Audit)
* **Goal**: Perform a QA audit on responsiveness, accessibility (WCAG), and form validation. Only audits flagged `true` in the manifest are run.
* **Status**: ✅ Live

---

## 6. Implementation Checklist

- [x] Define Global Manifest Schema (JSON)
- [x] Create Project Folder Structure
- [x] Build all 5 Prompt Stage Templates
- [x] Build Frontend Form (HTML/CSS)
- [x] Connect Form Data to Logic (`js/app.js`)
- [x] Implement Drag-and-Drop Layout Map
- [x] Fix CTA, Pricing, and Testimonial expansion buttons
- [x] Add Explainer Tooltips for Tech Stack items
- [x] Expand Project DNA inputs (niche, goals, audience)
- [x] Add Assumption Checkpoints to all 5 prompt stages
- [x] Implement context-aware manifest slicing per stage
- [x] Fix copy button (now uses `navigator.clipboard` with fallback)
- [x] Dynamic Configuration Drawers for CTA, Pricing, and Testimonial sections
- [x] Structured manifest serialization for configurable sections (object vs. string)
- [x] CTA config passed to Logic stage for button wiring

---

## 7. Final Project Status

**Status: v1.2 Dynamic Drawers — Fully Operational**

The Velocity Builder now captures section-level configuration data at the point of layout design. CTA, Pricing, and Testimonial sections carry their own structured specs into the manifest, eliminating the last major source of AI guesswork in the build pipeline. Every stage of the prompt sequence operates on precise, user-defined data from intake through QA.

