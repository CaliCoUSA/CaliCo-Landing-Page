import { loadEngine, renderClips, isEngineReady } from "./engine.js";

// --- STATE ---
let videos = [];
let clips = [];
let timelineClips = [];
let currentVideoIndex = null;
let currentUploadSlot = null;
let exportMode = 'separate';
const VIDEO_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
});

function initEventListeners() {
    document.querySelectorAll("[data-slot]").forEach(el => {
        el.addEventListener("click", () => {
            currentUploadSlot = Number(el.dataset.slot);
            document.getElementById('video-input').click();
        });
    });

    const videoTabs = document.getElementById('video-tabs');
    if (videoTabs) {
        videoTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (btn && btn.dataset.index !== undefined) {
                selectVideo(Number(btn.dataset.index));
            }
        });
    }

    document.getElementById('video-input').addEventListener('change', handleVideoUpload);
    document.getElementById('proceed-to-clips-btn').addEventListener('click', proceedToClips);
    document.getElementById('clear-all-btn').addEventListener('click', clearAllVideos);
    document.getElementById('mark-btn').addEventListener('click', addMark);
    
    document.getElementById('show-ai-btn').addEventListener('click', () => document.getElementById('ai-panel').classList.remove('hidden'));
    document.getElementById('hide-ai-btn').addEventListener('click', () => document.getElementById('ai-panel').classList.add('hidden'));
    document.getElementById('process-ai-btn').addEventListener('click', processAiTimestamps);
    
    document.getElementById('proceed-to-timeline-btn').addEventListener('click', proceedToTimeline);
    document.getElementById('proceed-to-export-btn').addEventListener('click', proceedToExport);
    
    document.getElementById('export-mode-separate').addEventListener('click', () => setExportMode('separate'));
    document.getElementById('export-mode-merged').addEventListener('click', () => setExportMode('merged'));
    document.getElementById('export-btn').addEventListener('click', handleExport);

    document.getElementById('clip-library').addEventListener('click', (e) => {
        if(e.target.closest('.remove-clip-btn')) removeClip(Number(e.target.closest('.remove-clip-btn').dataset.id));
    });
    document.getElementById('clip-library').addEventListener('change', (e) => {
        if(e.target.matches('input')) updateClip(Number(e.target.dataset.id), e.target.dataset.field, e.target.value);
    });
    document.getElementById('timeline-clips').addEventListener('click', (e) => {
        if(e.target.closest('.remove-timeline-btn')) {
            timelineClips = timelineClips.filter(c => c.id !== Number(e.target.closest('.remove-timeline-btn').dataset.id));
            renderTimeline();
            updateExportSummary();
        }
    });

    window.addEventListener('keydown', (e) => {
        if(e.key.toLowerCase()==='m' && !e.target.matches('input,textarea')) addMark();
    });
}

async function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('video/')) return;
    
    const tempVideo = document.createElement('video');
    tempVideo.src = URL.createObjectURL(file);
    tempVideo.onloadedmetadata = () => {
        videos[currentUploadSlot] = {
            id: Date.now(),
            file: file,
            url: tempVideo.src,
            name: file.name,
            duration: tempVideo.duration,
            color: VIDEO_COLORS[currentUploadSlot]
        };
        updateVideoSlotUI(currentUploadSlot);
        e.target.value = '';
        
        if (!isEngineReady()) {
            loadEngine((msg) => {
                const progText = document.getElementById('progress-text');
                if (progText) progText.innerText = msg;
            });
        }
    };
}

function updateVideoSlotUI(slot) {
    const video = videos[slot];
    const el = document.querySelector(`[data-slot="${slot}"]`);
    if(video) {
        el.innerHTML = `<div class="flex flex-col items-center justify-center w-full animate-fadeIn"><i class="fas fa-check-circle text-4xl text-calico-success mb-2"></i><p class="text-[10px] text-white font-bold truncate w-full text-center bg-black/50 rounded py-1">${video.name}</p></div>`;
        el.style.borderColor = video.color;
        document.getElementById('proceed-to-clips-btn').disabled = false;
    }
}

function proceedToClips() {
    updateStep(2);
    document.getElementById('import-section').classList.add('hidden');
    document.getElementById('clip-section').classList.remove('hidden');
    if(videos.some(v=>v)) selectVideo(videos.findIndex(v=>v));
}

function selectVideo(index) {
    if (!videos[index]) return;
    currentVideoIndex = index;
    const v = videos[index];
    const player = document.getElementById('player');
    player.src = v.url;
    document.getElementById('current-video-name').innerText = v.name;
    document.getElementById('current-duration').innerText = formatTime(v.duration);
    renderVideoTabs(); 
}

function renderVideoTabs() {
    const container = document.getElementById('video-tabs');
    container.innerHTML = videos.map((v, i) => v ? `<button class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all ${i === currentVideoIndex ? 'border-calico-yellow scale-105' : 'border-white/20 opacity-70'}" data-index="${i}" style="background: ${v.color}20;">V${i+1}</button>` : '').join('');
}

function addMark() {
    if (currentVideoIndex === null) return alert("Select a video first.");
    const v = videos[currentVideoIndex];
    const t = document.getElementById('player').currentTime;
    
    const btn = document.getElementById('mark-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> MARKED';
    btn.classList.add('text-calico-success', 'border-calico-success');
    setTimeout(() => { btn.innerHTML = originalText; btn.classList.remove('text-calico-success', 'border-calico-success'); }, 500);

    clips.push({ id: Date.now(), videoIndex: currentVideoIndex, videoName: v.name, videoColor: v.color, file: v.file, start: Math.max(0, t - 5), end: Math.min(v.duration, t + 25) });
    renderClipLibrary();
}

function renderClipLibrary() {
    const lib = document.getElementById('clip-library');
    document.getElementById('clip-count').innerText = clips.length;
    document.getElementById('proceed-to-timeline-btn').disabled = clips.length === 0;

    if (clips.length === 0) {
        lib.innerHTML = `<div class="h-full flex flex-col items-center justify-center text-gray-500 opacity-50"><i class="fas fa-inbox text-4xl mb-3"></i><p class="text-xs uppercase">Library Empty</p></div>`;
        return;
    }
    lib.innerHTML = clips.map(c => `
        <div class="bg-black/40 p-3 rounded-xl border border-white/5 mb-2 group hover:border-calico-accent/50 transition-colors">
            <div class="flex justify-between mb-2">
                <div class="flex items-center gap-2"><span class="px-1.5 py-0.5 rounded text-[9px] font-black text-black" style="background: ${c.videoColor};">V${c.videoIndex + 1}</span><span class="text-[10px] text-gray-400 truncate w-24">${c.videoName}</span></div>
                <button class="remove-clip-btn text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" data-id="${c.id}"><i class="fas fa-times"></i></button>
            </div>
            <div class="flex gap-2 items-center">
                <input type="number" class="w-16 bg-black/40 border border-white/10 text-xs p-1 text-white text-center" value="${c.start}" data-id="${c.id}" data-field="start">
                <span class="text-gray-500">→</span>
                <input type="number" class="w-16 bg-black/40 border border-white/10 text-xs p-1 text-white text-center" value="${c.end}" data-id="${c.id}" data-field="end">
                <span class="text-[9px] text-calico-accent ml-auto">${formatTime(c.end - c.start)}</span>
            </div>
        </div>`).join('');
}

function updateClip(id, field, val) {
    const c = clips.find(x => x.id === id);
    if(c) { c[field] = parseFloat(val); if(field !== 'name') renderClipLibrary(); }
}

function removeClip(id) {
    clips = clips.filter(c => c.id !== id);
    renderClipLibrary();
}

function proceedToTimeline() {
    updateStep(3);
    timelineClips = [...clips];
    document.getElementById('clip-section').classList.add('hidden');
    document.getElementById('timeline-section').classList.remove('hidden');
    renderTimeline();
}

function renderTimeline() {
    const container = document.getElementById('timeline-clips');
    if(timelineClips.length === 0) {
        container.innerHTML = '<div class="text-center py-12 text-gray-500 opacity-50"><i class="fas fa-film text-4xl mb-3"></i><p class="text-xs uppercase">Timeline Empty</p></div>';
        return;
    }
    
    container.innerHTML = timelineClips.map((c, i) => `
        <div class="timeline-clip bg-black/40 p-4 rounded-xl border border-white/10 flex items-center gap-4 cursor-move" data-id="${c.id}">
            <div class="text-calico-yellow font-black text-xl opacity-50">#${String(i+1).padStart(2,'0')}</div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-1.5 py-0.5 rounded text-[9px] font-black text-black" style="background: ${c.videoColor};">V${c.videoIndex + 1}</span>
                    <p class="text-xs text-white font-bold truncate">${c.videoName}</p>
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-[10px] text-calico-accent font-mono bg-calico-accent/10 px-2 rounded">${formatTime(c.start)} → ${formatTime(c.end)}</p>
                    <p class="text-[10px] text-calico-yellow font-mono">${formatTime(c.end - c.start)}</p>
                </div>
            </div>
            <button class="remove-timeline-btn px-3 py-1 bg-red-900/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded text-[9px] font-bold uppercase" data-id="${c.id}">Remove</button>
        </div>
    `).join('');
    
    new Sortable(container, {
        animation: 150,
        ghostClass: 'opacity-50',
        onEnd: (evt) => {
            const moved = timelineClips.splice(evt.oldIndex, 1)[0];
            timelineClips.splice(evt.newIndex, 0, moved);
            renderTimeline();
        }
    });
}

function proceedToExport() {
    updateStep(4);
    document.getElementById('timeline-section').classList.add('hidden');
    document.getElementById('export-section').classList.remove('hidden');
    updateExportSummary();
}

function updateExportSummary() {
    document.getElementById('export-clip-count').innerText = timelineClips.length;
    const dur = timelineClips.reduce((acc, c) => acc + (c.end - c.start), 0);
    document.getElementById('export-duration').innerText = formatTime(dur);
}

function setExportMode(mode) {
    exportMode = mode;
    const separateEl = document.getElementById('export-mode-separate');
    const mergedEl = document.getElementById('export-mode-merged');
    
    [separateEl, mergedEl].forEach(el => {
        el.classList.remove('selected', 'border-calico-yellow');
        el.classList.add('border-white/10');
        const dot = el.querySelector('.w-2\\.5');
        const ring = el.querySelector('.w-5');
        if(dot) dot.classList.remove('bg-calico-yellow', 'bg-transparent');
        if(ring) ring.style.borderColor = 'rgba(255,255,255,0.3)';
    });

    const activeEl = mode === 'separate' ? separateEl : mergedEl;
    activeEl.classList.add('selected', 'border-calico-yellow');
    activeEl.classList.remove('border-white/10');
    
    const activeDot = activeEl.querySelector('.w-2\\.5');
    const activeRing = activeEl.querySelector('.w-5');
    
    if(activeDot) activeDot.classList.add('bg-calico-yellow');
    if(activeRing) activeRing.style.borderColor = '#FFD700';

    document.getElementById('export-text').innerText = mode === 'separate' ? 'RENDER CLIPS' : 'RENDER MERGED VIDEO';
}

async function handleExport() {
    if (!timelineClips.length) return alert("Timeline empty");
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const container = document.getElementById('progress-container');
    const btn = document.getElementById('export-btn');
    
    btn.disabled = true;
    container.classList.remove('hidden');
    
    try {
        if (!isEngineReady()) await loadEngine((msg) => progressText.innerText = msg);
        
        await renderClips({
            timelineClips, 
            exportMode, 
            onProgress: (msg) => {
                progressText.innerText = msg;
                if(msg.includes('Rendering')) progressBar.style.width = '60%';
                else if(msg.includes('Merging')) progressBar.style.width = '80%';
                else progressBar.style.width = '30%';
            }
        });
        progressBar.style.width = '100%';
        progressText.innerText = "Done!";
    } catch (err) {
        alert("Export Error: " + err.message);
    } finally {
        btn.disabled = false;
        setTimeout(() => { container.classList.add('hidden'); progressBar.style.width = '0'; }, 3000);
    }
}

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2,'0')}`;
}

function updateStep(step) {
    for(let i=1; i<=4; i++) {
        const el = document.getElementById(`step-${i}`);
        if(i <= step) {
            el.classList.add('active');
            el.querySelector('div').classList.replace('bg-white/10', 'bg-calico-yellow');
            el.querySelector('div').classList.replace('text-gray-400', 'text-black');
        } else {
            el.classList.remove('active');
        }
    }
}

function clearAllVideos() {
    if(confirm("Reset all?")) {
        videos = []; clips = []; timelineClips = [];
        document.querySelectorAll('.video-upload-slot').forEach((el, i) => {
             el.innerHTML = `<i class="fas fa-plus text-2xl text-gray-500 mb-2"></i><p class="text-xs text-gray-400 font-bold uppercase">Slot ${i+1}</p>`;
             el.style.borderColor = '';
        });
        updateStep(1);
        document.getElementById('import-section').classList.remove('hidden');
        document.getElementById('clip-section').classList.add('hidden');
    }
}

function processAiTimestamps() {
    const input = document.getElementById('ai-input').value;
    const regex = /(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*(\d{1,2}:\d{2}(?::\d{2})?)/g;
    let match;
    const v = videos[currentVideoIndex];
    if(!v) return alert("Select a video first");
    while ((match = regex.exec(input)) !== null) {
        const s = timeToSeconds(match[1]);
        const e = timeToSeconds(match[2]);
        clips.push({ id: Date.now() + Math.random(), videoIndex: currentVideoIndex, videoName: v.name, videoColor: v.color, file: v.file, start: s, end: Math.min(e, v.duration) });
    }
    renderClipLibrary();
    document.getElementById('ai-panel').classList.add('hidden');
}

function timeToSeconds(t) {
    const p = t.split(':').map(Number);
    if(p.length === 3) return p[0]*3600 + p[1]*60 + p[2];
    return p[0]*60 + p[1];
}