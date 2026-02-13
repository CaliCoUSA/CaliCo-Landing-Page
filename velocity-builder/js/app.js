import { PROMPT_TEMPLATES } from './templates.js';

// 1. SETUP: Select DOM Elements
const generateBtn = document.getElementById('generate-btn');
const outputArea = document.getElementById('output-area');
const outputText = outputArea.querySelector('textarea');
const layoutContainer = document.getElementById('layout-container');

// 2. STAGE EVOLUTION: Create the Tab Switcher
const stageSwitcher = document.createElement('div');
stageSwitcher.className = "flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar";
stageSwitcher.innerHTML = `
    <button class="stage-btn active text-[10px] font-bold px-3 py-1 rounded-full border border-calico-accent bg-calico-accent/20" data-stage="architect">1. ARCHITECT</button>
    <button class="stage-btn text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5" data-stage="stylist">2. STYLIST</button>
    <button class="stage-btn text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5" data-stage="builder">3. BUILDER</button>
    <button class="stage-btn text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5" data-stage="logic">4. LOGIC</button>
    <button class="stage-btn text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5" data-stage="red_team">5. RED TEAM</button>
`;
outputArea.prepend(stageSwitcher);

let currentStage = "architect";

// 3. INTERACTIVE LAYOUT: Drag and Drop Engine
let draggedItem = null;

function makeBlockDraggable(block) {
    block.setAttribute('draggable', true);
    
    block.addEventListener('dragstart', () => {
        draggedItem = block;
        setTimeout(() => block.style.opacity = '0.5', 0);
    });

    block.addEventListener('dragend', () => {
        block.style.opacity = '1';
        draggedItem = null;
    });

    block.addEventListener('dragover', e => e.preventDefault());

    block.addEventListener('drop', e => {
        e.preventDefault();
        if (block !== draggedItem) {
            const allBlocks = [...layoutContainer.querySelectorAll('.layout-block')];
            const draggedIdx = allBlocks.indexOf(draggedItem);
            const droppedIdx = allBlocks.indexOf(block);

            if (draggedIdx < droppedIdx) {
                block.after(draggedItem);
            } else {
                block.before(draggedItem);
            }
        }
    });
}

// Initialize existing blocks
layoutContainer.querySelectorAll('.layout-block').forEach(makeBlockDraggable);

// 4. LAYOUT EXPANSION: Functional "+" Buttons
document.querySelectorAll('button[id^="add-"]').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.innerText.replace('+ ', '');
        const newBlock = document.createElement('div');
        newBlock.className = "layout-block group";
        newBlock.innerHTML = `
            <span class="text-sm font-bold font-heading text-gray-300">${type} Section</span>
            <i class="fa-solid fa-grip-lines text-gray-600 group-hover:text-white"></i>
        `;
        layoutContainer.appendChild(newBlock);
        makeBlockDraggable(newBlock);
    });
});

// 5. DATA GATHERING: Build Manifest
function buildManifest() {
    const selectedTools = {};
    document.querySelectorAll('.tool-card.selected').forEach(card => {
        selectedTools[card.querySelector('span').innerText] = true;
    });

    const layout = [];
    layoutContainer.querySelectorAll('.layout-block span').forEach(span => {
        layout.push(span.innerText);
    });

    return {
        project_metadata: {
            name: document.getElementById('project-name').value || "Untitled Project",
            framework: "Vanilla HTML/Tailwind/JS",
            file_structure: "modular-folder-system"
        },
        vibe_identity: {
            aesthetic_archetype: document.getElementById('aesthetic').value,
            color_palette: {
                primary: document.getElementById('color-primary').value,
                accent: document.getElementById('color-accent').value
            }
        },
        layout_blueprint: layout,
        tool_integrations: selectedTools
    };
}

// 6. EXECUTION: Generate Prompt
function updateOutput() {
    const manifest = buildManifest();
    const jsonString = JSON.stringify(manifest, null, 2);
    
    let template = PROMPT_TEMPLATES[currentStage];
    outputText.value = template.replace('{{PROJECT_JSON}}', jsonString);
}

// Event Listeners
generateBtn.addEventListener('click', () => {
    outputArea.classList.remove('hidden');
    updateOutput();
    
    // Visual Feedback
    generateBtn.innerHTML = `<i class="fa-solid fa-check"></i> PROMPT GENERATED`;
    setTimeout(() => {
        generateBtn.innerHTML = `<i class="fa-solid fa-code"></i> INITIALIZE`;
    }, 2000);
});

stageSwitcher.addEventListener('click', (e) => {
    if (e.target.classList.contains('stage-btn')) {
        document.querySelectorAll('.stage-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-calico-accent/20', 'border-calico-accent');
            btn.classList.add('bg-white/5', 'border-white/10');
        });
        e.target.classList.add('active', 'bg-calico-accent/20', 'border-calico-accent');
        currentStage = e.target.dataset.stage;
        updateOutput();
    }
});