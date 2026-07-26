// ============================================================================
// CS Audio Trimmer Engine
// 100% Client-Side Web Audio API Editor
// ============================================================================

// App State
const state = {
  audioCtx: null,
  audioBuffer: null,
  sourceNode: null,
  gainNode: null,
  isPlaying: false,
  startTime: 0,
  endTime: 0,
  duration: 0,
  playhead: 0,
  playStartTime: 0,
  playOffset: 0,
  
  // Downsampled peaks for quick waveform drawing
  peaks: [],
  
  // Dragging states
  isDraggingStart: false,
  isDraggingEnd: false,
  isSelecting: false,
  
  // File detail
  fileName: 'audio.wav'
};

// DOM Elements
const el = {
  dropZone: document.getElementById('drop-zone'),
  audioInput: document.getElementById('audio-input'),
  fileInfoCard: document.getElementById('file-info-card'),
  infoName: document.getElementById('info-name'),
  infoDuration: document.getElementById('info-duration'),
  infoChannels: document.getElementById('info-channels'),
  settingsGroup: document.getElementById('settings-group'),
  startInput: document.getElementById('start-input'),
  endInput: document.getElementById('end-input'),
  selectedDuration: document.getElementById('selected-duration'),
  volumeRange: document.getElementById('volume-range'),
  volumeVal: document.getElementById('volume-val'),
  chkFadein: document.getElementById('chk-fadein'),
  chkFadeout: document.getElementById('chk-fadeout'),
  playbackGroup: document.getElementById('playback-group'),
  btnPlay: document.getElementById('btn-play'),
  btnPause: document.getElementById('btn-pause'),
  btnStop: document.getElementById('btn-stop'),
  btnExport: document.getElementById('btn-export'),
  canvas: document.getElementById('waveform-canvas'),
  timelineRuler: document.getElementById('timeline-ruler'),
  statusDot: document.getElementById('status-dot'),
  statusText: document.getElementById('status-text'),
  toastContainer: document.getElementById('toast-container')
};

// Canvas Context
let ctx = null;
if (el.canvas) {
  ctx = el.canvas.getContext('2d');
}

// Initialize Toast notifications
function showToast(message, type = 'info') {
  if (!el.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  el.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  setTimeout(() => {
    toast.style.transform = 'translateY(-20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── 1. FILE UPLOAD & DECODING ──

// Setup drag and drop
if (el.dropZone && el.audioInput) {
  el.dropZone.addEventListener('click', () => el.audioInput.click());
  
  el.audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleAudioFile(file);
  });
  
  el.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    el.dropZone.classList.add('dragover');
  });
  
  el.dropZone.addEventListener('dragleave', () => {
    el.dropZone.classList.remove('dragover');
  });
  
  el.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    el.dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleAudioFile(file);
  });
}

function handleAudioFile(file) {
  state.fileName = file.name;
  updateStatus('Cargando archivo...', 'active');
  
  const reader = new FileReader();
  reader.onload = function(e) {
    decodeAudio(e.target.result);
  };
  reader.onerror = function() {
    showToast('Error al leer el archivo.', 'error');
    updateStatus('Error al leer archivo', 'unfilled');
  };
  reader.readAsArrayBuffer(file);
}

function decodeAudio(arrayBuffer) {
  updateStatus('Decodificando audio (PCM)...', 'active');
  
  // Initialize Audio Context on demand
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  state.audioCtx.decodeAudioData(arrayBuffer)
    .then(decodedBuffer => {
      state.audioBuffer = decodedBuffer;
      state.duration = decodedBuffer.duration;
      state.startTime = 0;
      state.endTime = decodedBuffer.duration;
      
      // Update UI File Cards
      el.infoName.textContent = state.fileName;
      el.infoDuration.textContent = state.duration.toFixed(2) + 's';
      el.infoChannels.textContent = decodedBuffer.numberOfChannels === 1 ? 'Mono' : 'Estéreo';
      el.fileInfoCard.classList.remove('hidden');
      
      // Setup inputs
      el.startInput.value = '0.00';
      el.startInput.max = state.duration.toFixed(2);
      el.endInput.value = state.duration.toFixed(2);
      el.endInput.max = state.duration.toFixed(2);
      updateDurationDisplay();
      
      // Enable settings & play controls
      el.settingsGroup.classList.remove('disabled');
      el.playbackGroup.classList.remove('disabled');
      el.btnExport.classList.remove('disabled');
      
      // Process waveform peaks
      computeWaveformPeaks(decodedBuffer, 800);
      
      // Resize & Draw Canvas
      resizeCanvas();
      drawWaveform();
      drawTimeline();
      
      showToast('Audio decodificado correctamente.', 'success');
      updateStatus('Listo', 'active');
    })
    .catch(err => {
      console.error(err);
      showToast('No se pudo decodificar el audio. Formato no compatible.', 'error');
      updateStatus('Error de decodificación', 'unfilled');
    });
}

function updateStatus(text, indicatorClass) {
  if (!el.statusText || !el.statusDot) return;
  el.statusText.textContent = text;
  
  el.statusDot.className = 'status-indicator';
  if (indicatorClass === 'active') el.statusDot.classList.add('active');
  else if (indicatorClass === 'paused') el.statusDot.classList.add('paused');
}

// ── 2. WAVEFORM PROCESSING & DRAWING ──

function computeWaveformPeaks(buffer, width) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const totalSamples = buffer.length;
  const samplesPerPixel = Math.floor(totalSamples / width);
  
  state.peaks = [];
  
  // Combine all channels by averaging them
  const channelData = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(buffer.getChannelData(c));
  }
  
  for (let i = 0; i < width; i++) {
    const startSample = i * samplesPerPixel;
    const endSample = Math.min(startSample + samplesPerPixel, totalSamples);
    
    let maxVal = 0;
    let minVal = 0;
    
    // Find min and max peaks in this chunk
    for (let s = startSample; s < endSample; s += Math.max(1, Math.floor(samplesPerPixel / 10))) {
      let val = 0;
      for (let c = 0; c < numChannels; c++) {
        val += channelData[c][s];
      }
      val /= numChannels;
      
      if (val > maxVal) maxVal = val;
      if (val < minVal) minVal = val;
    }
    
    state.peaks.push({ max: maxVal, min: minVal });
  }
}

function resizeCanvas() {
  if (!el.canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const width = el.canvas.parentElement.clientWidth;
  const height = el.canvas.parentElement.clientHeight - 24; // substract timeline ruler
  
  el.canvas.width = width * dpr;
  el.canvas.height = height * dpr;
  el.canvas.style.width = `${width}px`;
  el.canvas.style.height = `${height}px`;
  
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', () => {
  if (state.audioBuffer) {
    resizeCanvas();
    drawWaveform();
    drawTimeline();
  }
});

function drawWaveform() {
  if (!ctx || !el.canvas || !state.audioBuffer) return;
  
  const width = el.canvas.width / (window.devicePixelRatio || 1);
  const height = el.canvas.height / (window.devicePixelRatio || 1);
  const centerY = height / 2;
  
  // Clear
  ctx.fillStyle = '#0a0f16';
  ctx.fillRect(0, 0, width, height);
  
  // Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
  
  // Convert times to pixels
  const startX = (state.startTime / state.duration) * width;
  const endX = (state.endTime / state.duration) * width;
  
  // Draw Peaks (Optimized: 2 stroke calls instead of 1000)
  ctx.lineWidth = 1.5;
  
  // 1. Draw Unselected peaks (left and right of selection)
  ctx.strokeStyle = '#1b2a3c'; // muted dark blue-gray
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    if (x < startX || x > endX) {
      const peakIndex = Math.floor((x / width) * state.peaks.length);
      const peak = state.peaks[peakIndex] || { max: 0, min: 0 };
      const maxH = peak.max * centerY * 0.9;
      const minH = peak.min * centerY * 0.9;
      ctx.moveTo(x, centerY - maxH);
      ctx.lineTo(x, centerY - minH);
    }
  }
  ctx.stroke();

  // 2. Draw Selected peaks (inside selection)
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.75)'; // vibrant neon green selection
  ctx.beginPath();
  const startInt = Math.ceil(startX);
  const endInt = Math.floor(endX);
  for (let x = startInt; x <= endInt; x++) {
    const peakIndex = Math.floor((x / width) * state.peaks.length);
    const peak = state.peaks[peakIndex] || { max: 0, min: 0 };
    const maxH = peak.max * centerY * 0.9;
    const minH = peak.min * centerY * 0.9;
    ctx.moveTo(x, centerY - maxH);
    ctx.lineTo(x, centerY - minH);
  }
  ctx.stroke();
  
  // Draw Selected Highlight overlay
  ctx.fillStyle = 'rgba(0, 255, 136, 0.04)';
  ctx.fillRect(startX, 0, endX - startX, height);
  
  // Draw Playhead line if playing
  if (state.isPlaying) {
    const playheadX = (state.playhead / state.duration) * width;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
  }
  
  // Draw Start Handle (Green)
  ctx.strokeStyle = '#00ff88';
  ctx.fillStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0, 255, 136, 0.4)';
  ctx.shadowBlur = 4;
  
  ctx.beginPath();
  ctx.moveTo(startX, 0);
  ctx.lineTo(startX, height);
  ctx.stroke();
  
  // Start Handle Top Flag
  ctx.shadowBlur = 0;
  ctx.fillRect(startX - 5, 0, 10, 8);
  
  // Draw End Handle (Red)
  ctx.strokeStyle = '#ff4b4b';
  ctx.fillStyle = '#ff4b4b';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(255, 75, 75, 0.4)';
  ctx.shadowBlur = 4;
  
  ctx.beginPath();
  ctx.moveTo(endX, 0);
  ctx.lineTo(endX, height);
  ctx.stroke();
  
  // End Handle Top Flag
  ctx.shadowBlur = 0;
  ctx.fillRect(endX - 5, 0, 10, 8);
}

function drawTimeline() {
  if (!el.timelineRuler || !state.audioBuffer) return;
  
  el.timelineRuler.innerHTML = '';
  const width = el.timelineRuler.clientWidth;
  const duration = state.duration;
  
  // Determine tick intervals
  let interval = 1; // 1s
  if (duration > 300) interval = 30;
  else if (duration > 120) interval = 15;
  else if (duration > 60) interval = 10;
  else if (duration > 30) interval = 5;
  else if (duration > 15) interval = 2;
  else if (duration > 5) interval = 1;
  else interval = 0.5;
  
  const numTicks = Math.floor(duration / interval);
  
  for (let i = 0; i <= numTicks; i++) {
    const time = i * interval;
    const pct = time / duration;
    const x = pct * width;
    
    const tick = document.createElement('div');
    tick.style.left = `${x}px`;
    
    // Major vs Minor tick
    if (i % 2 === 0 || interval < 1) {
      tick.className = 'time-tick major';
      
      const label = document.createElement('span');
      label.className = 'time-label';
      label.style.left = `${x}px`;
      label.innerText = time.toFixed(1) + 's';
      el.timelineRuler.appendChild(label);
    } else {
      tick.className = 'time-tick';
    }
    
    el.timelineRuler.appendChild(tick);
  }
}

// ── 3. CANVAS INTERACTION (MOUSE DRAGGING) ──

if (el.canvas) {
  // Click on timeline ruler to navigate and play immediately
  if (el.timelineRuler) {
    el.timelineRuler.addEventListener('click', (e) => {
      if (!state.audioBuffer) return;
      
      const rect = el.timelineRuler.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const width = rect.width;
      const clickTime = (x / width) * state.duration;
      
      // Set playhead and start playing immediately
      state.playOffset = clickTime;
      state.playhead = clickTime;
      startPlayback();
    });
  }

  el.canvas.addEventListener('mousedown', (e) => {
    if (!state.audioBuffer) return;
    
    const rect = el.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const clickTime = (x / width) * state.duration;
    
    // Check if clicked near start or end handles
    const startX = (state.startTime / state.duration) * width;
    const endX = (state.endTime / state.duration) * width;
    
    if (Math.abs(x - startX) < 12) {
      state.isDraggingStart = true;
    } else if (Math.abs(x - endX) < 12) {
      state.isDraggingEnd = true;
    } else {
      // Anchor for click-to-play vs drag-to-select
      state.isSelecting = true;
      state.clickX = x;
      state.tempSelectionStart = clickTime;
      state.hasMovedSelection = false;
      
      // Store current selection in case we click-to-play (so we can restore it)
      state.prevStartTime = state.startTime;
      state.prevEndTime = state.endTime;
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.audioBuffer) return;
    if (!state.isDraggingStart && !state.isDraggingEnd && !state.isSelecting) return;
    
    const rect = el.canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const width = rect.width;
    const hoverTime = (x / width) * state.duration;
    
    if (state.isDraggingStart) {
      state.startTime = Math.min(hoverTime, state.endTime - 0.05); // margin of 50ms
      el.startInput.value = state.startTime.toFixed(2);
      updateDurationDisplay();
      drawWaveform();
    } else if (state.isDraggingEnd) {
      state.endTime = Math.max(hoverTime, state.startTime + 0.05);
      el.endInput.value = state.endTime.toFixed(2);
      updateDurationDisplay();
      drawWaveform();
    } else if (state.isSelecting) {
      // Check threshold (drag vs simple click)
      if (Math.abs(x - state.clickX) > 6) {
        state.hasMovedSelection = true;
      }
      
      if (state.hasMovedSelection) {
        // Drag-to-select: update start and end times dynamically
        state.startTime = Math.min(state.tempSelectionStart, hoverTime);
        state.endTime = Math.max(state.tempSelectionStart, hoverTime);
        
        // Keep spacing of at least 50ms
        if (state.endTime - state.startTime < 0.05) {
          state.endTime = state.startTime + 0.05;
        }
        
        el.startInput.value = state.startTime.toFixed(2);
        el.endInput.value = state.endTime.toFixed(2);
        updateDurationDisplay();
        drawWaveform();
      }
    }
  });

  window.addEventListener('mouseup', () => {
    if (state.isSelecting) {
      if (!state.hasMovedSelection) {
        // It was a simple click: restore selection range and start playing from click point!
        state.startTime = state.prevStartTime;
        state.endTime = state.prevEndTime;
        
        // Set playhead and start playing
        state.playOffset = state.tempSelectionStart;
        state.playhead = state.tempSelectionStart;
        startPlayback();
      }
      state.isSelecting = false;
    }
    state.isDraggingStart = false;
    state.isDraggingEnd = false;
  });
}

// ── 4. CONTROL SETTINGS LISTENERS ──

if (el.startInput && el.endInput) {
  el.startInput.addEventListener('change', () => {
    let val = parseFloat(el.startInput.value) || 0;
    val = Math.max(0, Math.min(val, state.endTime - 0.05));
    state.startTime = val;
    el.startInput.value = val.toFixed(2);
    updateDurationDisplay();
    drawWaveform();
  });
  
  el.endInput.addEventListener('change', () => {
    let val = parseFloat(el.endInput.value) || state.duration;
    val = Math.max(state.startTime + 0.05, Math.min(val, state.duration));
    state.endTime = val;
    el.endInput.value = val.toFixed(2);
    updateDurationDisplay();
    drawWaveform();
  });
}

if (el.volumeRange && el.volumeVal) {
  el.volumeRange.addEventListener('input', () => {
    const val = el.volumeRange.value;
    el.volumeVal.textContent = val + '%';
  });
}

function updateDurationDisplay() {
  const diff = state.endTime - state.startTime;
  el.selectedDuration.textContent = diff.toFixed(2) + 's';
}

// ── 5. PLAYBACK CONTROLS ──

if (el.btnPlay) {
  el.btnPlay.addEventListener('click', () => {
    if (!state.audioBuffer) return;
    
    if (state.isPlaying) {
      // Pause
      pausePlayback();
    } else {
      // Play
      startPlayback();
    }
  });
}

if (el.btnPause) {
  el.btnPause.addEventListener('click', () => {
    if (state.isPlaying) pausePlayback();
  });
}

if (el.btnStop) {
  el.btnStop.addEventListener('click', () => {
    stopPlayback();
  });
}

function startPlayback() {
  if (!state.audioBuffer) return;
  
  // Stop existing first
  stopPlaybackSource();
  
  state.audioCtx.resume();
  
  // Determine starting point
  let offset = state.playOffset;
  if (offset < state.startTime || offset >= state.endTime) {
    offset = state.startTime;
  }
  
  const durationToPlay = state.endTime - offset;
  
  // Setup source
  state.sourceNode = state.audioCtx.createBufferSource();
  state.sourceNode.buffer = state.audioBuffer;
  
  // Setup gain (volume)
  state.gainNode = state.audioCtx.createGain();
  const volumeMultiplier = parseFloat(el.volumeRange.value) / 100;
  state.gainNode.gain.value = volumeMultiplier;
  
  state.sourceNode.connect(state.gainNode);
  state.gainNode.connect(state.audioCtx.destination);
  
  // Run playhead animation tracking
  state.playhead = offset;
  state.playStartTime = state.audioCtx.currentTime;
  state.playOffset = offset;
  state.isPlaying = true;
  
  state.sourceNode.start(0, offset, durationToPlay);
  updateStatus('Reproduciendo', 'active');
  el.btnPlay.textContent = '⏸ Pausar';
  
  // On Playback Finished
  state.sourceNode.onended = function() {
    // If it played all the way to the end of the selection range, stop
    if (state.isPlaying && (state.audioCtx.currentTime - state.playStartTime + state.playOffset >= state.endTime - 0.05)) {
      stopPlayback();
    }
  };
  
  animatePlayhead();
}

function animatePlayhead() {
  if (!state.isPlaying) return;
  
  const elapsed = state.audioCtx.currentTime - state.playStartTime;
  state.playhead = state.playOffset + elapsed;
  
  if (state.playhead > state.endTime) {
    state.playhead = state.endTime;
  }
  
  drawWaveform();
  
  if (state.playhead < state.endTime) {
    requestAnimationFrame(animatePlayhead);
  }
}

function pausePlayback() {
  if (!state.isPlaying) return;
  
  const elapsed = state.audioCtx.currentTime - state.playStartTime;
  state.playOffset = state.playOffset + elapsed;
  state.playhead = state.playOffset;
  
  stopPlaybackSource();
  state.isPlaying = false;
  
  updateStatus('Pausado', 'paused');
  el.btnPlay.textContent = '▶ Reproducir';
  drawWaveform();
}

function stopPlayback() {
  state.playOffset = state.startTime;
  state.playhead = state.startTime;
  
  stopPlaybackSource();
  state.isPlaying = false;
  
  updateStatus('Detenido', 'active');
  el.btnPlay.textContent = '▶ Reproducir';
  drawWaveform();
}

function stopPlaybackSource() {
  if (state.sourceNode) {
    try {
      state.sourceNode.stop();
    } catch (e) {
      // Already stopped
    }
    state.sourceNode = null;
  }
  if (state.gainNode) {
    state.gainNode.disconnect();
    state.gainNode = null;
  }
}

// ── 6. WAV COMPILER / TRIMMING / EXPORT ──

if (el.btnExport) {
  el.btnExport.addEventListener('click', () => {
    if (!state.audioBuffer) return;
    
    // Stop playback first
    stopPlayback();
    
    updateStatus('Procesando audio...', 'active');
    showToast('Recortando y preparando audio para descarga...', 'info');
    
    // Set a slight timeout so UI updates before CPU blocks on trimming
    setTimeout(trimAndExportAudio, 50);
  });
}

function trimAndExportAudio() {
  const sampleRate = state.audioBuffer.sampleRate;
  const startSample = Math.floor(state.startTime * sampleRate);
  const endSample = Math.floor(state.endTime * sampleRate);
  const durationSamples = Math.max(1, endSample - startSample);
  const numChannels = state.audioBuffer.numberOfChannels;
  
  // 1. Create a new AudioBuffer of correct trimmed size
  const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(numChannels, durationSamples, sampleRate);
  
  // 2. Setup Source
  const source = offlineCtx.createBufferSource();
  source.buffer = state.audioBuffer;
  
  // 3. Setup Gain Node for Volume adjustment
  const gainNode = offlineCtx.createGain();
  const volumeMultiplier = parseFloat(el.volumeRange.value) / 100;
  gainNode.gain.setValueAtTime(volumeMultiplier, 0);
  
  // 4. Apply Fade Effects if checked
  const fadeDuration = 0.5; // 500ms
  const fadeSamples = Math.floor(fadeDuration * sampleRate);
  
  if (el.chkFadein.checked && durationSamples > fadeSamples) {
    gainNode.gain.setValueAtTime(0, 0);
    gainNode.gain.linearRampToValueAtTime(volumeMultiplier, fadeDuration);
  }
  
  if (el.chkFadeout.checked && durationSamples > fadeSamples) {
    const fadeStart = (durationSamples - fadeSamples) / sampleRate;
    gainNode.gain.setValueAtTime(volumeMultiplier, fadeStart);
    gainNode.gain.linearRampToValueAtTime(0, durationSamples / sampleRate);
  }
  
  source.connect(gainNode);
  gainNode.connect(offlineCtx.destination);
  
  // Start playing buffer at the relative offset
  source.start(0, state.startTime, durationSamples / sampleRate);
  
  // Render
  offlineCtx.startRendering()
    .then(renderedBuffer => {
      // Convert Rendered Buffer to a 16-bit WAV ArrayBuffer
      const wavArrayBuffer = bufferToWav(renderedBuffer);
      const wavBlob = new Blob([wavArrayBuffer], { type: 'audio/wav' });
      
      // Trigger download
      const downloadUrl = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      // Build clean output filename
      let baseName = state.fileName.substring(0, state.fileName.lastIndexOf('.')) || state.fileName;
      a.download = `${baseName}_recortado.wav`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      
      showToast('Audio exportado en formato WAV.', 'success');
      updateStatus('Exportación completa', 'active');
    })
    .catch(err => {
      console.error(err);
      showToast('Error al exportar audio.', 'error');
      updateStatus('Error de exportación', 'unfilled');
    });
}

// ── 7. WAV FORMAT COMPILER HELPERS ──
// Formats PCM buffer into a RIFF standard 16-bit WAV file

function bufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM (16-bit integer)
  const bitDepth = 16;
  
  let result;
  if (numOfChan === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }
  
  return writeWavFile(result, numOfChan, sampleRate, format, bitDepth);
}

function interleave(inputL, inputR) {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  
  let index = 0;
  let inputIndex = 0;
  
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function writeWavFile(samples, numChannels, sampleRate, format, bitDepth) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);
  
  // Write PCM audio samples (Float32 in range [-1.0, 1.0] to 16-bit Signed Integer [-32768, 32767])
  floatTo16BitPCM(view, 44, samples);
  
  return buffer;
}

function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
