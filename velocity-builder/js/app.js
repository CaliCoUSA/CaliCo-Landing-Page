import { PROMPT_TEMPLATES } from './templates.js';

// 1. SETUP: Select DOM Elements
const generateBtn = document.getElementById('generate-btn');
const outputArea = document.getElementById('output-area');
const outputText = outputArea.querySelector('textarea');

// 2. LOGIC: Gather Data from the Form
function buildManifest() {
    // A. Basic Info
    const projectName = document.getElementById('project-name').value || "Untitled Vibe";
    const aesthetic = document.getElementById('aesthetic').value;
    
    // B. Colors
    const primaryColor = document.getElementById('color-primary').value;
    const accentColor = document.getElementById('color-accent').value;

    // C. Tools (Scrape selected cards)
    const selectedTools = {};
    document.querySelectorAll('.tool-card.selected').forEach(card => {
        const toolName = card.querySelector('span').innerText;
        selectedTools[toolName] = true; 
    });

    // D. Layout (Scrape the visual blocks in order)
    const layout = [];
    document.querySelectorAll('.layout-block span').forEach(block => {
        layout.push(block.innerText);
    });

    // E. Construct the DNA (The JSON Object)
    return {
        project_metadata: {
            name: projectName,
            framework: "Vanilla HTML/Tailwind/JS",
            file_structure: "modular-folder-system"
        },
        vibe_identity: {
            aesthetic_archetype: aesthetic,
            color_palette: {
                primary: primaryColor,
                accent: accentColor,
                background: "#0F0518", // Hardcoded from your CSS
                surface: "rgba(255, 255, 255, 0.05)"
            },
            typography: {
                heading_font: "Montserrat",
                body_font: "Open Sans"
            }
        },
        layout_blueprint: layout, // ["Header", "Hero", "Grid", "Footer"]
        tool_integrations: selectedTools
    };
}

// 3. EVENT: Click "INITIALIZE"
generateBtn.addEventListener('click', () => {
    // A. Build the Data
    const manifest = buildManifest();
    const jsonString = JSON.stringify(manifest, null, 2);

    // B. Generate the Prompt (Using STAGE 1: Architect for now)
    // In the future, you can make buttons for Stage 2, 3, 4 etc.
    let fullPrompt = PROMPT_TEMPLATES.architect.replace('{{PROJECT_JSON}}', jsonString);

    // C. Add the instructions for the other stages as "Next Steps"
    fullPrompt += "\n\n--- NEXT STEPS PREVIEW ---\n";
    fullPrompt += "Once this is done, I will provide the CSS (Stage 2) and HTML (Stage 3).";

    // D. Display Output
    outputArea.classList.remove('hidden');
    outputText.value = fullPrompt;
    
    // E. Visual Feedback
    generateBtn.innerHTML = `<i class="fa-solid fa-check"></i> PROMPT GENERATED`;
    setTimeout(() => {
        generateBtn.innerHTML = `<i class="fa-solid fa-code"></i> INITIALIZE`;
    }, 2000);
});


