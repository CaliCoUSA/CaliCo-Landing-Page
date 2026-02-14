# Velocity Builder (The Prompt IDE)

**Velocity Builder** is a specialized "Prompt IDE" designed for Genre Architects and Digital Agency Owners. It converts aesthetic vibes, marketing strategy, and technical requirements into a structured, multi-stage prompt sequence. 

By utilizing a **Global Manifest (Project DNA)**, it prevents "prompt decay" and guides Large Language Models (LLMs) to build professional, artist-approved, file-based web projects.

**Live Demo:** [calico-usa.com/velocity-builder](https://calico-usa.com/velocity-builder)

---

## 🚀 Features (v1.1 Tactical Upgrade)

* **Tactical DNA Intake:** Captures deep business context—including **Business Niche**, **Target Audience**, and **Customer Pain Points**—to ensure AI-generated copy is high-converting and brand-aligned.
* **Visual Layout Expansion:** Dynamically add **CTA**, **Pricing**, and **Testimonial** sections to your Layout Map with a single click.
* **Explainer Tooltips:** Built-in guidance for the tech stack (React, Supabase, Auth, GSAP) to provide transparency and education for non-coder clients.
* **Assumption Checkpoints:** New prompt architecture forces the AI to list its technical assumptions *before* writing code, eliminating "hallucination decay."
* **Three-File Design System:** Mandates the creation of `variables.css`, `global.css`, and `components.css` to ensure a premium, polished UI from the first run.

---

## 🧠 How It Works

The **Velocity Builder** functions as a strategic bridge between high-level creative vision and low-level code execution:

1.  **Strategic Input:** The user defines the project's "Soul" by entering the **Business Niche**, **Target Audience**, and **Marketing Goals**. This ensures the AI has the specific context needed to write copy that converts.
2.  **Visual Architecting:**
    * **Tech Stack:** Select professional tools like **React**, **Supabase**, or **GSAP**. Hover over any tool to see a tooltip explaining its value.
    * **Layout Map:** Visually stack the page structure. Use the dynamic expansion buttons to add specific sections on the fly.
3.  **Manifest Processing:** The `app.js` engine scrapes the dashboard and constructs a **Project DNA Manifest (JSON)**. This acts as the "Single Source of Truth."
4.  **Multi-Stage Generation:** The manifest is injected into a 5-Stage prompt sequence:
    * **Stage 1: The Architect** (Repository Setup & Assumptions)
    * **Stage 2: The Stylist** (Design System & Components)
    * **Stage 3: The Builder** (Semantic HTML Structure)
    * **Stage 4: The Logic** (JS Modules & API Integration)
    * **Stage 5: The Red Team** (QA, Accessibility, & Mobile Audit)
5.  **Output:** A context-aware prompt is generated for the user to copy-paste into Claude, ChatGPT, or Gemini.

---

## 🎨 Tech Stack

* **Core Framework:** **Vanilla HTML5 & JavaScript (ES6 Modules)** for maximum compatibility and zero build-step overhead.
* **Styling Engine:** **Tailwind CSS (via CDN)** for rapid UI development, augmented by **Custom CSS Variables** for the signature Glassmorphism aesthetic.
* **Iconography:** **FontAwesome 6.4.0** for a sharp, professional visual language.
* **Typography:** **Montserrat** (Headings) and **Open Sans** (Body) via Google Fonts for authority and readability.
* **Infrastructure:** Optimized for local serving via **VS Code Live Server** or static hosting on GitHub Pages/Vercel.

---

## 🛠️ Installation & Usage

Because this project uses **ES6 JavaScript Modules**, it must be served through a local or web server.

### Option 1: VS Code (Recommended)
1. Clone or download this repository.
2. Open the folder in **VS Code**.
3. Install the **"Live Server"** extension.
4. Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Web Hosting
Upload the entire folder structure to your web server (e.g., GitHub Pages, Vercel, or Netlify).

---

## 📂 Project Structure

It is critical to maintain this folder structure for the engine to function:

```text
velocity-builder/
├── index.html                 # The User Interface (Dashboard)
├── project-dna-schema.json    # Reference schema for the output data
└── js/                        # Logic Core
    ├── app.js                 # The Engine: DOM Scraping & Layout Logic
    └── templates.js           # The Brain: 5-Stage Prompt Library


---
**Status:** v1.0 Production Ready
**Author:** Calico USA
