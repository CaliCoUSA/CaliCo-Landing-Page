# Velocity Builder (The Prompt IDE)

**Velocity Builder** is a specialized "Prompt IDE" designed for Genre Architects and Vibe Coders. It converts aesthetic preferences ("vibes") and technical requirements into a structured, multi-stage prompt sequence that guides Large Language Models (LLMs) to build professional, file-based web projects.

**Live Demo:** [calico-usa.com/velocity-builder](https://calico-usa.com/velocity-builder)

## 🚀 Features

* **Visual Interface:** No more hand-typing JSON. Select aesthetics, colors, and tools using a "Glassmorphism" UI.
* **Vibe Identity Engine:** Automatically generates CSS variables and Design Tokens based on archetypes (e.g., Cyberpunk, Swiss Minimal).
* **Modular Prompt Engineering:** Generates a 5-Stage development plan:
    1.  **The Architect:** Repository & File Structure.
    2.  **The Stylist:** Design System & CSS Variables.
    3.  **The Builder:** Semantic HTML Layout.
    4.  **The Logic:** JavaScript Modules & Integrations.
    5.  **The Red Team:** QA, Accessibility & Mobile Responsiveness audits.
* **Line-Based Layout:** Visual drag-and-drop style lists to define page structure.

## 🛠️ Installation & Usage

Because this project uses **ES6 JavaScript Modules** (`type="module"`), you cannot simply double-click `index.html` to run it. You must serve it locally or host it.

### Option 1: VS Code (Recommended)
1.  Clone or download this repository.
2.  Open the folder in **VS Code**.
3.  Install the **"Live Server"** extension.
4.  Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Web Hosting
Upload the entire folder structure to your web server or GitHub Pages.

## 📂 Project Structure

It is critical to maintain this folder structure for the application to function:

velocity-builder/
├── index.html                 # The User Interface (Dashboard)
├── project-dna-schema.json    # Reference schema for the output data
└── js/                        # Logic Core
    ├── app.js                 # The Engine: Connects UI to Templates
    └── templates.js           # The Brain: Stores the Prompt Library

## 🧠 How It Works

1.  **Input:** The user selects a "Vibe" (e.g., Neo-Brutalism), picks a tech stack (e.g., React + Supabase), and defines the layout.
2.  **Processing:** `app.js` scrapes the DOM and constructs a `project-dna.json` object.
3.  **Generation:** This JSON is injected into the `architect` template from `templates.js`.
4.  **Output:** A highly specific, context-aware prompt is generated for the user to copy-paste into ChatGPT/Claude/Gemini.

## 🎨 Tech Stack

* **Framework:** Vanilla HTML5 & JavaScript (ES6 Modules)
* **Styling:** Tailwind CSS (via CDN) + Custom CSS Variables
* **Icons:** FontAwesome
* **Fonts:** Montserrat & Open Sans

---
**Status:** v1.0 Production Ready
**Author:** Calico USA
