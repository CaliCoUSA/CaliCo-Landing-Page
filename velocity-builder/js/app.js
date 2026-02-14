import { PROMPT_TEMPLATES } from './templates.js';

// 1. SETUP: Select DOM Elements
const generateBtn = document.getElementById('generate-btn');
const outputArea = document.getElementById('output-area');
const outputText = outputArea.querySelector('textarea');
const layoutContainer = document.getElementById('layout-container');

// 2. DRAG-AND-DROP LOGIC
let draggedItem = null;

function makeDraggable(el) {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', (e) => {
        draggedItem = el;
        e.dataTransfer.effectAllowed = 'move';
        el.classList.add('opacity-40');
    });
    el.addEventListener('dragend', () => {
        draggedItem = null;
        el.classList.remove('opacity-40');
    });
}

layoutContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(layoutContainer, e.clientY);
    if (afterElement == null) {
        layoutContainer.appendChild(draggedItem);
    } else {
        layoutContainer.insertBefore(draggedItem, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.layout-block:not(.opacity-40)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Initialize existing blocks for reordering
document.querySelectorAll('.layout-block').forEach(makeDraggable);

// 3. LAYOUT EXPANSION (+ Buttons)
const addButtons = document.querySelectorAll('button[class*="hover:bg-white/10"]');

addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.innerText.replace('+ ', '');
        const newBlock = document.createElement('div');
        newBlock.className = 'layout-block group';
        // FIXED: Restored missing backticks for template literal [cite: 84]
        newBlock.innerHTML = `
            <span class="text-sm font-bold font-heading text-gray-300">${type} Section</span>
            <i class="fa-solid fa-grip-lines text-gray-600 group-hover:text-white"></i>
        `;
        makeDraggable(newBlock); // Make the new block draggable immediately
        layoutContainer.appendChild(newBlock);
    });
});



// 4. LOGIC: Gather Data from the Form
function buildManifest() {
    // A. Scraping the Layout Map
    const layout = [];
    document.querySelectorAll('.layout-block span').forEach(block => {
        layout.push(block.innerText);
    });

    // B. Scraping Tool Selections
    const selectedTools = {};
    document.querySelectorAll('.tool-card.selected').forEach(card => {
        // FIXED: Targeting the correct span (the tool name, not the tooltip) 
        const toolName = card.querySelector('span:last-child').innerText;
        selectedTools[toolName] = true;
    });

    // C. Construct the Single Source of Truth [cite: 30, 92]
    return {
        project_metadata: {
            name: document.getElementById('project-name').value || "Untitled Vibe",
            framework: "Vanilla HTML/Tailwind/JS",
            file_structure: "modular-folder-system",
            business_niche: document.getElementById('business-niche').value,
            target_audience: document.getElementById('target-audience').value
        },
        vibe_identity: {
            aesthetic_archetype: document.getElementById('aesthetic').value,
            color_palette: {
                primary: document.getElementById('color-primary').value,
                accent: document.getElementById('color-accent').value,
                background: "#0F0518",
                surface: "rgba(255, 255, 255, 0.05)"
            },
            typography: {
                heading_font: document.getElementById('font-heading').value || "Montserrat",
                body_font: document.getElementById('font-body').value || "Open Sans"
            },
            marketing_dna: {
                pain_points: document.getElementById('pain-points').value,
                conversion_goal: document.getElementById('conversion-goal').value,
                keywords: document.getElementById('keywords').value,
                core_solutions: document.getElementById('core-solutions').value
            }
        },
        layout_blueprint: layout,
        tool_integrations: selectedTools,
        red_team_constraints: {
            feature_count: document.getElementById('feature-count').value || 6,
            audits: {
                mobile: document.getElementById('audit-mobile').checked,
                validation: document.getElementById('audit-validation').checked,
                wcag: document.getElementById('audit-wcag').checked
            }
        }
    };
}

// 5. EVENT: Click "INITIALIZE" [cite: 93]
generateBtn.addEventListener('click', () => {
    try {
        const manifest = buildManifest();
        const jsonString = JSON.stringify(manifest, null, 2);

        // Stage 1: The Architect injection [cite: 15, 38]
        let fullPrompt = PROMPT_TEMPLATES.architect.replace('{{PROJECT_JSON}}', jsonString);

        fullPrompt += "\n\n--- NEXT STEPS PREVIEW ---\n";
        fullPrompt += "Once the repository is initialized, we move to Stage 2: The Stylist (Design System).";

        outputArea.classList.remove('hidden');
        outputText.value = fullPrompt;
        
        // FIXED: Restored missing backticks for template literal [cite: 93]
        generateBtn.innerHTML = `<i class="fa-solid fa-check"></i> PROMPT GENERATED`;
        setTimeout(() => {
            generateBtn.innerHTML = `<i class="fa-solid fa-code"></i> INITIALIZE`;
        }, 2000);
    } catch (error) {
        console.error("Critical Engine Error:", error);
        alert("The engine crashed. Please ensure all form fields in index.html have the correct IDs.");
    }
});