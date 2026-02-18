import { PROMPT_TEMPLATES } from './templates.js';

// 1. SETUP: Select DOM Elements
const generateBtn = document.getElementById('generate-btn');
const outputArea = document.getElementById('output-area');
const outputText = outputArea.querySelector('textarea');
const layoutContainer = document.getElementById('layout-container');
const stageTitle = document.getElementById('stage-title');
const copyIcon = document.querySelector('.fa-copy');

// Store generated prompts for switching
let activePrompts = {
    architect: "",
    stylist: "",
    builder: "",
    logic: "",
    red_team: ""
};


// 2. DRAG-AND-DROP LOGIC
let draggedItem = null;

function makeDraggable(el) {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', (e) => {
        if (e.target.closest('.config-drawer')) {
            e.preventDefault();
            return;
        }
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
    if (!draggedItem) return;
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

document.querySelectorAll('.layout-block').forEach(makeDraggable);


// 3. CONFIG DRAWER TEMPLATES
const drawerTemplates = {
    CTA: `
        <div class="config-drawer mt-3 pt-3 border-t border-white/10 space-y-2">
            <p class="text-[9px] font-black text-calico-accent uppercase tracking-widest mb-2">⚙ CTA Config</p>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Headline</label>
                    <input type="text" data-field="cta_headline" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none" placeholder="e.g. Ready to Scale?">
                </div>
                <div>
                    <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Sub-Headline</label>
                    <input type="text" data-field="cta_subheadline" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none" placeholder="e.g. No contracts. Cancel anytime.">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Button Text</label>
                    <input type="text" data-field="cta_button_text" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none" placeholder="e.g. Book a Free Audit">
                </div>
                <div>
                    <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Button Action</label>
                    <select data-field="cta_button_action" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none">
                        <option value="scroll-to-form">Scroll to Form</option>
                        <option value="open-modal">Open Modal</option>
                        <option value="external-link">External Link</option>
                    </select>
                </div>
            </div>
        </div>`,

    Pricing: `
        <div class="config-drawer mt-3 pt-3 border-t border-white/10 space-y-2">
            <p class="text-[9px] font-black text-calico-accent uppercase tracking-widest mb-2">⚙ Pricing Config</p>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">No. of Tiers</label>
                    <select data-field="pricing_tiers" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none">
                        <option value="2">2 Tiers</option>
                        <option value="3" selected>3 Tiers</option>
                    </select>
                </div>
                <div>
                    <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Billing Cycle</label>
                    <select data-field="pricing_billing" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none">
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                        <option value="one-time">One-Time</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Tier Names (comma-separated)</label>
                <input type="text" data-field="pricing_tier_names" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none" placeholder="e.g. Starter, Pro, Agency">
            </div>
        </div>`,

    Testimonial: `
        <div class="config-drawer mt-3 pt-3 border-t border-white/10 space-y-2">
            <p class="text-[9px] font-black text-calico-accent uppercase tracking-widest mb-2">⚙ Testimonial Config</p>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">No. of Cards</label>
                    <select data-field="testimonial_count" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none">
                        <option value="2">2 Cards</option>
                        <option value="3" selected>3 Cards</option>
                        <option value="4">4 Cards</option>
                    </select>
                </div>
                <div>
                    <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Name Source</label>
                    <select data-field="testimonial_source" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none">
                        <option value="placeholder">Use Placeholders</option>
                        <option value="real">I'll Provide Real Names</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Real Names / Roles (if applicable)</label>
                <input type="text" data-field="testimonial_names" class="drawer-input w-full bg-black/40 border border-white/10 text-white text-xs p-2 rounded-lg focus:border-calico-accent focus:outline-none" placeholder="e.g. Jane Doe, CEO at Acme Co.">
            </div>
        </div>`
};


// 4. LAYOUT EXPANSION — Creates block with attached config drawer
document.querySelectorAll('[data-add-block]').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-add-block');
        const newBlock = document.createElement('div');
        newBlock.className = 'layout-block group flex-col items-start';
        newBlock.innerHTML = `
            <div class="w-full flex justify-between items-center">
                <span class="text-sm font-bold font-heading text-gray-300">${type} Section</span>
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-chevron-down text-calico-accent/60 hover:text-calico-accent cursor-pointer toggle-drawer transition-transform duration-200 text-xs"></i>
                    <i class="fa-solid fa-grip-lines text-gray-600 group-hover:text-white"></i>
                </div>
            </div>
            ${drawerTemplates[type] || ''}
        `;

        const chevron = newBlock.querySelector('.toggle-drawer');
        const drawer = newBlock.querySelector('.config-drawer');
        if (chevron && drawer) {
            chevron.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = !drawer.classList.contains('hidden');
                drawer.classList.toggle('hidden', isOpen);
                chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            });
            // Start open
            chevron.style.transform = 'rotate(180deg)';
        }

        makeDraggable(newBlock);
        layoutContainer.appendChild(newBlock);
    });
});


// 5. MANIFEST BUILDER — Reads drawer fields alongside standard layout blocks
function buildManifest() {
    const layout = [];

    document.querySelectorAll('.layout-block').forEach(block => {
        const labelEl = block.querySelector('span');
        if (!labelEl) return;

        const label = labelEl.innerText.trim();
        const drawer = block.querySelector('.config-drawer');

        if (drawer) {
            const config = { section: label.replace(' Section', '').trim() };
            drawer.querySelectorAll('[data-field]').forEach(field => {
                const key = field.getAttribute('data-field');
                config[key] = field.value;
            });
            layout.push(config);
        } else {
            layout.push(label);
        }
    });

    const selectedTools = {};
    document.querySelectorAll('.tool-card.selected').forEach(card => {
        const toolName = card.querySelector('span:last-child').innerText;
        selectedTools[toolName] = true;
    });

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


// 6. EVENT: INITIALIZE
generateBtn.addEventListener('click', () => {
    try {
        const manifest = buildManifest();

        const slices = {
            architect: JSON.stringify(manifest, null, 2),

            stylist: JSON.stringify({
                project_metadata: { name: manifest.project_metadata.name },
                vibe_identity: manifest.vibe_identity
            }, null, 2),

            builder: JSON.stringify({
                project_metadata: manifest.project_metadata,
                layout_blueprint: manifest.layout_blueprint,
                vibe_identity: {
                    marketing_dna: manifest.vibe_identity.marketing_dna
                }
            }, null, 2),

            logic: JSON.stringify({
                project_metadata: { name: manifest.project_metadata.name },
                tool_integrations: manifest.tool_integrations,
                vibe_identity: {
                    marketing_dna: {
                        conversion_goal: manifest.vibe_identity.marketing_dna.conversion_goal
                    }
                },
                layout_blueprint: manifest.layout_blueprint.filter(
                    item => typeof item === 'object' && item.section === 'CTA'
                )
            }, null, 2),

            red_team: JSON.stringify({
                project_metadata: {
                    name: manifest.project_metadata.name,
                    target_audience: manifest.project_metadata.target_audience
                },
                vibe_identity: {
                    marketing_dna: {
                        conversion_goal: manifest.vibe_identity.marketing_dna.conversion_goal
                    }
                },
                red_team_constraints: manifest.red_team_constraints
            }, null, 2)
        };

        activePrompts.architect = PROMPT_TEMPLATES.architect.replace('{{PROJECT_JSON}}', slices.architect);
        activePrompts.stylist   = PROMPT_TEMPLATES.stylist.replace('{{PROJECT_JSON}}', slices.stylist);
        activePrompts.builder   = PROMPT_TEMPLATES.builder.replace('{{PROJECT_JSON}}', slices.builder);
        activePrompts.logic     = PROMPT_TEMPLATES.logic.replace('{{PROJECT_JSON}}', slices.logic);
        activePrompts.red_team  = PROMPT_TEMPLATES.red_team.replace('{{PROJECT_JSON}}', slices.red_team);

        outputArea.classList.remove('hidden');
        switchStage('architect');

        generateBtn.innerHTML = `<i class="fa-solid fa-check"></i> PROMPTS GENERATED`;
        setTimeout(() => {
            generateBtn.innerHTML = `<i class="fa-solid fa-code"></i> INITIALIZE`;
        }, 2000);

    } catch (error) {
        console.error("Critical Engine Error:", error);
        alert("The engine crashed. Check the console for ID mismatches.");
    }
});


// 7. STAGE SWITCHING
function switchStage(stageKey) {
    outputText.value = activePrompts[stageKey];
    const formattedTitle = stageKey.replace('_', ' ').toUpperCase();
    stageTitle.innerText = `CURRENT: ${formattedTitle}`;

    document.querySelectorAll('.stage-btn').forEach(btn => {
        if (btn.getAttribute('data-stage') === stageKey) {
            btn.classList.add('bg-calico-accent', 'text-calico-deepest');
            btn.classList.remove('bg-white/5', 'text-gray-400');
        } else {
            btn.classList.remove('bg-calico-accent', 'text-calico-deepest');
            btn.classList.add('bg-white/5', 'text-gray-400');
        }
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('stage-btn')) {
        switchStage(e.target.getAttribute('data-stage'));
    }
});


// 8. COPY BUTTON
if (copyIcon) {
    copyIcon.addEventListener('click', () => {
        if (!outputText.value) return;
        outputText.select();
        outputText.setSelectionRange(0, 99999);
        try {
            navigator.clipboard.writeText(outputText.value).then(() => {
                copyIcon.classList.replace('fa-copy', 'fa-check');
                copyIcon.classList.replace('text-gray-500', 'text-calico-accent');
                setTimeout(() => {
                    copyIcon.classList.replace('fa-check', 'fa-copy');
                    copyIcon.classList.replace('text-calico-accent', 'text-gray-500');
                }, 1500);
            });
        } catch {
            document.execCommand('copy');
        }
    });
}
