export const PROMPT_TEMPLATES = {
  architect: `
You are now acting as the **Senior Solutions Architect** for a new web project.

**Project Goal:** Build a high-performance, modular website based on the "Vibe Manifest" provided below.
**Constraint:** DO NOT write any HTML, CSS, or UI logic yet. Your only goal right now is **Repository Initialization**.

### Step 1: Analyze the DNA
Read this JSON Manifest carefully. It is the Single Source of Truth for this project.

\`\`\`json
{{PROJECT_JSON}}
\`\`\`

### Step 2: Create the File Structure
Based on the manifest, create the following file structure. Use valid terminal commands (like \`mkdir\` and \`touch\`) or strictly formatted text to show the tree:

- root/
  - assets/
  - css/
    - variables.css
    - global.css
  - js/
    - modules/
    - main.js
  - index.html
  - project-dna.json
  - README.md

### Step 3: Confirmation
Confirm when the structure is ready and the \`project-dna.json\` is saved. 
**STOP** after this step. Await my command to begin the "Design System" phase.
  `,

  stylist: `
You are now acting as the **Lead UI/UX Designer**.

**Goal:** Translate the "Vibe Identity" from the \`project-dna.json\` file into a scalable CSS/Tailwind design system.

### Step 1: Load the DNA
Review the \`project-dna.json\` file again. Focus specifically on the \`vibe_identity\` section (Colors, Typography, Visual Cues).

### Step 2: Create the Design Tokens
Generate the code for \`css/variables.css\`. You must define:
1.  **Color Palette:** Map the primary, secondary, and accent colors to CSS variables (e.g., \`--color-primary\`).
2.  **Typography:** Import the fonts specified in the DNA (use Google Fonts import URLs) and map them to variables (e.g., \`--font-heading\`).
3.  **Vibe Physics:** Define the specific visual cues.
    * If "Glassmorphism": Define \`--glass-surface\` with backdrop-filter.
    * If "Neo-brutalism": Define \`--hard-shadow\` (e.g., \`4px 4px 0px #000\`).
    * If "Minimalist": Define \`--spacing-unit\`.

### Step 3: Global Reset
Generate the code for \`css/global.css\`.
* Import \`variables.css\`.
* Apply a modern reset (box-sizing: border-box).
* Apply the \`--font-body\` and \`--color-background\` to the \`body\` tag.

**Output:** Provide the full CSS for both files.
**STOP** after this step. Await my command to begin the "Layout Builder" phase.
  `,

  builder: `
You are now acting as the **Senior Frontend Developer**.

**Goal:** Build the semantic HTML structure for \`index.html\` based on the "Layout Blueprint" in our DNA file.

### Step 1: Analyze the Layout
Review the \`layout_blueprint\` array in \`project-dna.json\`. 
* **Strict Adherence:** You must create a semantic HTML section for *every single item* listed in that array, in that exact order.

### Step 2: Construct the HTML
Write the complete code for \`index.html\`.
* **Head:** Link \`css/global.css\` and \`css/variables.css\`. Add the \`js/main.js\` script with \`defer\`.
* **Body Structure:**
    * Use semantic tags: \`<header>\`, \`<main>\`, \`<section>\`, \`<footer>\`.
    * **Classes:** Use utility classes that match the Vibe (e.g., if "Brutalist", use simple container names like \`.block-container\`).
* **Content Injection:**
    * Do not use "Lorem Ipsum". Generate placeholder copy that matches the \`vibe_identity\` (e.g., if "Cyberpunk", use "System Online" instead of "Welcome").

### Step 3: The Wireframe Logic
For every section, add a comment block explaining which component from the blueprint it represents:
\`\`

**Output:** The full, valid HTML5 code for \`index.html\`.
**STOP** after this step. Await my command to begin the "Logic Integration" phase.
  `,

  logic: `
You are now acting as the **Lead JavaScript Engineer**.

**Goal:** Implement the interactive functionality and tool integrations defined in the "Tool Integrations" section of our DNA file.

### Step 1: Analyze the Stack
Review the \`tool_integrations\` object in \`project-dna.json\`. Identify which external libraries or logic patterns are required (e.g., Auth, Database, Animations, Forms).

### Step 2: Initialize the Core Logic
Generate the code for \`js/main.js\`.
* **Imports:** Import necessary modules from the \`js/modules/\` folder.
* **Initialization:** Create an \`init()\` function that runs on DOMContentLoaded.
* **Global Listeners:** Set up any global event listeners (like mobile menu toggles or theme switching).

### Step 3: Build the Modules
Based on the tools selected, create specific files in the \`js/modules/\` folder.
* **If Forms:** Create \`js/modules/forms.js\` to handle validation and submission.
* **If Auth:** Create \`js/modules/auth.js\` (stub out the login/signup functions).
* **If Animations:** Create \`js/modules/ui.js\` to handle GSAP or CSS class toggles.
* **If Database:** Create \`js/modules/api.js\` to handle fetch requests.

**Output:** Provide the full JavaScript code for \`main.js\` and any required module files. Use modern ES6 syntax (const/let, async/await, modules).
**STOP** after this step.
  `,

  red_team: `
You are now acting as the **QA Engineer & Red Team Lead**.

**Goal:** Audit the code we just built for common errors, accessibility issues, and responsiveness.

### Step 1: The Audit
Review the HTML, CSS, and JS code generated in previous steps. Check for:
1.  **Mobile Responsiveness:** Do the grid layouts stack correctly on mobile?
2.  **Accessibility:** Do all images have alt tags? Do buttons have aria-labels?
3.  **Error Handling:** Does the JS handle failed API requests or empty form submissions?

### Step 2: The Fix Report
If you find any issues, list them as a bulleted "Bug Report".
Then, provide the **Corrected Code Snippets** to fix them.

**Output:** A brief audit report followed by any necessary code patches.
**STOP.** The Project Initialization is complete.
  `
};

