let ffmpeg = null;
let engineReady = false;

export async function loadEngine(progressCb) {
    if (engineReady) return;
    const { FFmpeg } = FFmpegWASM;
    ffmpeg = new FFmpeg();
    progressCb?.("Loading High-Performance Engine...");

    const baseURL = './ffmpeg';

    await ffmpeg.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
        workerURL: `${baseURL}/ffmpeg-core.worker.js`
    });

    engineReady = true;
    console.log("🚀 CaliCo Engine Ready (Multi-threaded)");
}

export function isEngineReady() {
    return engineReady;
}

export async function renderClips({ timelineClips, exportMode, onProgress }) {
    if (!engineReady) throw new Error("FFmpeg not ready");
    const { fetchFile } = FFmpegUtil;

    const written = new Set();
    
    onProgress?.("Loading source files...");
    for (const clip of timelineClips) {
        if (!written.has(clip.videoIndex)) {
            const data = await fetchFile(clip.file);
            await ffmpeg.writeFile(`input_${clip.videoIndex}.mp4`, data);
            written.add(clip.videoIndex);
        }
    }

    if (exportMode === "separate") {
        for (let i = 0; i < timelineClips.length; i++) {
            const c = timelineClips[i];
            onProgress?.(`Rendering clip ${i + 1}/${timelineClips.length}`);
            
            const outName = `clip_${i}.mp4`;
            await ffmpeg.exec([
                "-ss", c.start.toString(),
                "-i", `input_${c.videoIndex}.mp4`,
                "-t", (c.end - c.start).toString(),
                "-movflags", "+faststart",
                "-c", "copy",
                outName
            ]);

            const data = await ffmpeg.readFile(outName);
            downloadBlob(data, `VelocityClip_${i + 1}.mp4`);
            await ffmpeg.deleteFile(outName);
        }
    } else {
        onProgress?.("Preparing clips for merge...");
        let concatList = "";
        
        for (let i = 0; i < timelineClips.length; i++) {
            const c = timelineClips[i];
            onProgress?.(`Processing segment ${i + 1}/${timelineClips.length}`);
            
            const segmentName = `seg_${i}.mp4`;
            await ffmpeg.exec([
                "-ss", c.start.toString(),
                "-i", `input_${c.videoIndex}.mp4`,
                "-t", (c.end - c.start).toString(),
                "-c", "copy",
                segmentName
            ]);
            concatList += `file '${segmentName}'\n`;
        }

        await ffmpeg.writeFile("concat.txt", concatList);
        onProgress?.("Merging final output...");
        
        await ffmpeg.exec([
            "-f", "concat",
            "-safe", "0",
            "-i", "concat.txt",
            "-c", "copy",
            "merged_output.mp4"
        ]);

        const data = await ffmpeg.readFile("merged_output.mp4");
        downloadBlob(data, `VelocityMerged_${Date.now()}.mp4`);
        
        await ffmpeg.deleteFile("merged_output.mp4");
        await ffmpeg.deleteFile("concat.txt");
        for(let i=0; i<timelineClips.length; i++) await ffmpeg.deleteFile(`seg_${i}.mp4`);
    }
    
    onProgress?.("Export Complete!");
}

function downloadBlob(data, filename) {
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}