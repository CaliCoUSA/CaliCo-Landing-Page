import { PROMPT_TEMPLATES } from './templates.js';

[span_2](start_span)// 1. SETUP: Select DOM Elements[span_2](end_span)
const generateBtn = document.getElementById('generate-btn');
const outputArea = document.getElementById('output-area');
const outputText = outputArea.querySelector('textarea');

[span_3](start_span)// NEW: Layout Expansion Logic[span_3](end_span)
// This connects the dead buttons to the Layout Map
const layoutContainer = document.getElementById('layout-container');
const addButtons = document.querySelectorAll('button[class*="hover:bg-white/10"]');

addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.innerText.replace('+ ', ''); // Gets "CTA", "PRICING", or "TESTIMONIAL"
        
        const newBlock = document.createElement('div');
        newBlock.className = 'layout-block group';
        newBlock.innerHTML = `
            <span class="text-sm font-bold font-heading text-gray-300">${type} Section</span>
            <i class="fa-solid fa-grip-lines text-gray-600 group-hover:text-white"></i>
        `;
        
        layoutContainer.appendChild(newBlock);
    });
});



[span_4](start_span)// 2. LOGIC: Gather Data from the Form[span_4](end_span)
function buildManifest() {
    [span_5](start_span)// A. Basic Info & Strategy[span_5](end_span)
    const projectName = document.getElementById('project-name').value || "Untitled Vibe";
    const aesthetic = document.getElementById('aesthetic').value;
    const businessNiche = document.getElementById('business-niche').value;
    const targetAudience = document.getElementById('target-audience').value;
    const coreSolutions = document.getElementById('core-solutions').value;

    [span_6](start_span)// B. Marketing DNA[span_6](end_span)
    const painPoints = document.getElementById('pain-points').value;
    const conversionGoal = document.getElementById('conversion-goal').value;
    const keywords = document.getElementById('keywords').value;

    [span_7](start_span)// C. Tactical Specs & Typography[span_7](end_span)
    const headingFont = document.getElementById('font-heading').value || "Montserrat";
    const bodyFont = document.getElementById('font-body').value || "Open Sans";
    const featureCount = document.getElementById('feature-count').value || 6;

    [span_8](start_span)// D. Colors[span_8](end_span)
    const primaryColor = document.getElementById('color-primary').value;
    const accentColor = document.getElementById('color-accent').value;

    [span_9](start_span)// E. Tools (Scrape selected cards)[span_9](end_span)
    const selectedTools = {};
    document.querySelectorAll('.tool-card.selected').forEach(card => {
        const toolName = card.querySelector('span').innerText;
        selectedTools[toolName] = true;
    });

    [span_10](start_span)// F. Layout (Scrape visual blocks in order)[span_10](end_span)
    const layout = [];
    document.querySelectorAll('.layout-block span').forEach(block => {
        layout.push(block.innerText);
    });

    [span_11](start_span)// G. Construct the DNA (The Single Source of Truth)[span_11](end_span)
    return {
        project_metadata: {
            name: projectName,
            framework: "Vanilla HTML/Tailwind/JS",
            file_structure: "modular-folder-system",
            business_niche: businessNiche,
            target_audience: targetAudience
        },
        vibe_identity: {
            aesthetic_archetype: aesthetic,
            color_palette: {
                primary: primaryColor,
                accent: accentColor,
                background: "#0F0518",
                surface: "rgba(255, 255, 255, 0.05)"
            },
            typography: {
                heading_font: headingFont,
                body_font: bodyFont
            },
            marketing_dna: {
                pain_points: painPoints,
                conversion_goal: conversionGoal,
                keywords: keywords,
                core_solutions: coreSolutions
            }
        },
        layout_blueprint: layout,
        tool_integrations: selectedTools,
        red_team_constraints: {
            feature_count: featureCount,
            audits: {
                mobile: document.getElementById('audit-mobile').checked,
                validation: document.getElementById('audit-validation').checked,
                wcag: document.getElementById('audit-wcag').checked
            }
        }
    };
}

[span_12](start_span)// 3. EVENT: Click "INITIALIZE"[span_12](end_span)
generateBtn.addEventListener('click', () => {
    // A. Build the Data
    const manifest = buildManifest();
    const jsonString = JSON.stringify(manifest, null, 2);

    // B. Generate the Prompt (Using STAGE 1: Architect)
    let fullPrompt = PROMPT_TEMPLATES.architect.replace('{{PROJECT_JSON}}', jsonString);

    [span_13](start_span)// C. Next Steps Preview[span_13](end_span)
    fullPrompt += "\n\n--- NEXT STEPS PREVIEW ---\n";
    fullPrompt += "Once the repository is initialized, we move to Stage 2: The Stylist (Design System).";

    [span_14](start_span)// D. Display Output[span_14](end_span)
    outputArea.classList.remove('hidden');
    outputText.value = fullPrompt;
    
    [span_15](start_span)// E. Visual Feedback[span_15](end_span)
    generateBtn.innerHTML = `<i class="fa-solid fa-check"></i> PROMPT GENERATED`;
    setTimeout(() => {
        generateBtn.innerHTML = `<i class="fa-solid fa-code"></i> INITIALIZE`;
    }, 2000);
});


