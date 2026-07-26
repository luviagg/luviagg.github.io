// ============================================================================
// CS GIF Generator Engine
// 100% Client-Side GIF Compiler and Scaler
// ============================================================================

// App State
const state = {
  frames: [], // Array of { id, name, img }
  gifWidth: 256,
  gifHeight: 256,
  scaleMode: 'cover',
  delay: 200, // ms per frame
  
  // Preview State
  previewIndex: 0,
  previewTimer: null,
  
  // Frame Counter ID
  nextFrameId: 0
};

// DOM Elements
const el = {
  dropZone: document.getElementById('drop-zone'),
  imageInput: document.getElementById('image-input'),
  framesSection: document.getElementById('frames-section'),
  framesGrid: document.getElementById('frames-grid'),
  frameCount: document.getElementById('frame-count'),
  settingsGroup: document.getElementById('settings-group'),
  aspectPreset: document.getElementById('aspect-preset'),
  widthInput: document.getElementById('width-input'),
  heightInput: document.getElementById('height-input'),
  scaleMode: document.getElementById('scale-mode'),
  delayRange: document.getElementById('delay-range'),
  delayVal: document.getElementById('delay-val'),
  btnExport: document.getElementById('btn-export'),
  canvas: document.getElementById('preview-canvas'),
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

// Update App Status
function updateStatus(text, indicatorClass) {
  if (!el.statusText || !el.statusDot) return;
  el.statusText.textContent = text;
  
  el.statusDot.className = 'status-indicator';
  if (indicatorClass === 'active') el.statusDot.classList.add('active');
  else if (indicatorClass === 'processing') el.statusDot.classList.add('processing');
}

// ── 1. FILE UPLOAD & LOADING ──

if (el.dropZone && el.imageInput) {
  el.dropZone.addEventListener('click', () => el.imageInput.click());
  
  el.imageInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) handleImageFiles(files);
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
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) handleImageFiles(files);
  });
}

function handleImageFiles(files) {
  updateStatus('Cargando imágenes...', 'processing');
  
  let loadedCount = 0;
  const totalToLoad = files.length;
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        state.frames.push({
          id: state.nextFrameId++,
          name: file.name,
          img: img
        });
        
        loadedCount++;
        if (loadedCount === totalToLoad) {
          onAllImagesLoaded();
        }
      };
      img.onerror = function() {
        loadedCount++;
        showToast(`Error al decodificar la imagen: ${file.name}`, 'error');
        if (loadedCount === totalToLoad) {
          onAllImagesLoaded();
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function onAllImagesLoaded() {
  el.frameCount.textContent = state.frames.length;
  
  if (state.frames.length > 0) {
    el.framesSection.classList.remove('hidden');
    el.settingsGroup.classList.remove('disabled');
    el.btnExport.classList.remove('disabled');
    
    // Sort / Rebuild grid
    renderFramesGrid();
    
    // Adjust Canvas Dimensions
    updateDimensionsFromPreset();
    
    // Start Animation Loop
    startPreviewLoop();
    
    showToast(`Se cargaron ${state.frames.length} imágenes correctamente.`, 'success');
    updateStatus('Animación lista', 'active');
  } else {
    updateStatus('Esperando imágenes...', 'unfilled');
  }
}

// ── 2. FRAMES MANAGER UI ──

function renderFramesGrid() {
  if (!el.framesGrid) return;
  el.framesGrid.innerHTML = '';
  
  state.frames.forEach((frame, idx) => {
    const card = document.createElement('div');
    card.className = 'frame-card';
    
    const img = document.createElement('img');
    img.src = frame.img.src;
    img.className = 'frame-thumb';
    card.appendChild(img);
    
    const num = document.createElement('span');
    num.className = 'frame-number';
    num.innerText = `F${idx + 1}`;
    card.appendChild(num);
    
    const delBtn = document.createElement('button');
    delBtn.className = 'frame-delete-btn';
    delBtn.innerText = '❌';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeFrame(frame.id);
    });
    card.appendChild(delBtn);
    
    el.framesGrid.appendChild(card);
  });
}

function removeFrame(id) {
  state.frames = state.frames.filter(f => f.id !== id);
  el.frameCount.textContent = state.frames.length;
  
  renderFramesGrid();
  
  if (state.frames.length === 0) {
    stopPreviewLoop();
    clearCanvas();
    el.framesSection.classList.add('hidden');
    el.settingsGroup.classList.add('disabled');
    el.btnExport.classList.add('disabled');
    updateStatus('Esperando imágenes...', 'unfilled');
  } else {
    // Reset loop boundaries
    state.previewIndex = 0;
    drawFrame(state.previewIndex);
  }
}

// ── 3. PRESETS & SCALING LOGIC ──

if (el.aspectPreset) {
  el.aspectPreset.addEventListener('change', () => {
    updateDimensionsFromPreset();
  });
}

if (el.widthInput && el.heightInput) {
  el.widthInput.addEventListener('change', () => {
    state.gifWidth = Math.max(32, Math.min(1024, parseInt(el.widthInput.value) || 256));
    el.widthInput.value = state.gifWidth;
    resizeCanvas();
    drawFrame(state.previewIndex);
  });
  
  el.heightInput.addEventListener('change', () => {
    state.gifHeight = Math.max(32, Math.min(1024, parseInt(el.heightInput.value) || 256));
    el.heightInput.value = state.gifHeight;
    resizeCanvas();
    drawFrame(state.previewIndex);
  });
}

if (el.scaleMode) {
  el.scaleMode.addEventListener('change', () => {
    state.scaleMode = el.scaleMode.value;
    drawFrame(state.previewIndex);
  });
}

if (el.delayRange && el.delayVal) {
  el.delayRange.addEventListener('input', () => {
    state.delay = parseInt(el.delayRange.value);
    el.delayVal.textContent = state.delay + 'ms';
    
    // Restart loop to apply new interval
    if (state.frames.length > 0) {
      startPreviewLoop();
    }
  });
}

function updateDimensionsFromPreset() {
  const preset = el.aspectPreset.value;
  
  if (preset === 'square') {
    state.gifWidth = 256;
    state.gifHeight = 256;
    el.widthInput.disabled = true;
    el.heightInput.disabled = true;
  } else if (preset === 'vertical') {
    state.gifWidth = 240;
    state.gifHeight = 320;
    el.widthInput.disabled = true;
    el.heightInput.disabled = true;
  } else if (preset === 'horizontal') {
    state.gifWidth = 320;
    state.gifHeight = 240;
    el.widthInput.disabled = true;
    el.heightInput.disabled = true;
  } else {
    // Custom
    state.gifWidth = parseInt(el.widthInput.value) || 256;
    state.gifHeight = parseInt(el.heightInput.value) || 256;
    el.widthInput.disabled = false;
    el.heightInput.disabled = false;
  }
  
  el.widthInput.value = state.gifWidth;
  el.heightInput.value = state.gifHeight;
  
  resizeCanvas();
  drawFrame(state.previewIndex);
}

function resizeCanvas() {
  if (!el.canvas) return;
  el.canvas.width = state.gifWidth;
  el.canvas.height = state.gifHeight;
}

function clearCanvas() {
  if (!ctx || !el.canvas) return;
  ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);
}

// Draw a specific frame using the selected scale mode
function drawFrame(index) {
  if (!ctx || !el.canvas || state.frames.length === 0) return;
  
  const frame = state.frames[index];
  if (!frame) return;
  
  const img = frame.img;
  const w = state.gifWidth;
  const h = state.gifHeight;
  
  ctx.clearRect(0, 0, w, h);
  
  if (state.scaleMode === 'cover') {
    const scale = Math.max(w / img.width, h / img.height);
    const x = (w - img.width * scale) / 2;
    const y = (h - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  } else if (state.scaleMode === 'contain') {
    // Fill background black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    
    const scale = Math.min(w / img.width, h / img.height);
    const x = (w - img.width * scale) / 2;
    const y = (h - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  } else {
    // Stretch
    ctx.drawImage(img, 0, 0, w, h);
  }
}

// ── 4. PREVIEW TIMER LOOP ──

function startPreviewLoop() {
  stopPreviewLoop();
  
  if (state.frames.length === 0) return;
  
  function nextTick() {
    state.previewIndex = (state.previewIndex + 1) % state.frames.length;
    drawFrame(state.previewIndex);
    state.previewTimer = setTimeout(nextTick, state.delay);
  }
  
  // Draw immediately
  drawFrame(state.previewIndex);
  state.previewTimer = setTimeout(nextTick, state.delay);
}

function stopPreviewLoop() {
  if (state.previewTimer) {
    clearTimeout(state.previewTimer);
    state.previewTimer = null;
  }
}

// ── 5. COMPILER & EXPORT (WITH AD-WALL) ──

if (el.btnExport) {
  el.btnExport.addEventListener('click', () => {
    if (state.frames.length === 0) return;
    
    // Stop live preview loop during compilation
    stopPreviewLoop();
    
    updateStatus('Preparando fotogramas...', 'processing');
    
    // Pre-scale all frames onto a separate hidden canvas to match the preview exactly.
    // This reduces gifshot encoding work and keeps memory footprint low!
    const scaledDataUrls = [];
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = state.gifWidth;
    tempCanvas.height = state.gifHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    state.frames.forEach(frame => {
      const img = frame.img;
      const w = state.gifWidth;
      const h = state.gifHeight;
      tempCtx.clearRect(0, 0, w, h);
      
      if (state.scaleMode === 'cover') {
        const scale = Math.max(w / img.width, h / img.height);
        const x = (w - img.width * scale) / 2;
        const y = (h - img.height * scale) / 2;
        tempCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else if (state.scaleMode === 'contain') {
        tempCtx.fillStyle = '#000000';
        tempCtx.fillRect(0, 0, w, h);
        const scale = Math.min(w / img.width, h / img.height);
        const x = (w - img.width * scale) / 2;
        const y = (h - img.height * scale) / 2;
        tempCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        tempCtx.drawImage(img, 0, 0, w, h);
      }
      
      scaledDataUrls.push(tempCanvas.toDataURL('image/png'));
    });
    
    // Route download action through the parent window's ad-wall modal
    if (window.parent && window.parent.APP && typeof window.parent.APP.triggerAdAndDownload === 'function') {
      window.parent.APP.triggerAdAndDownload(
        'animacion.gif',
        `Imagen animada en formato GIF (${state.gifWidth}x${state.gifHeight} px) ideal para chats y perfiles.`,
        () => {
          compileAndDownloadGif(scaledDataUrls);
        },
        false // isCopy = false
      );
    } else {
      // Direct compile fallback if testing standalone
      compileAndDownloadGif(scaledDataUrls);
    }
  });
}

function compileAndDownloadGif(imagesArray) {
  updateStatus('Codificando GIF...', 'processing');
  showToast('Codificando GIF. Esto puede tomar unos segundos...', 'info');
  
  gifshot.createGIF({
    images: imagesArray,
    gifWidth: state.gifWidth,
    gifHeight: state.gifHeight,
    interval: state.delay / 1000, // delay in seconds
    numWorkers: 2
  }, function(obj) {
    if (obj.error) {
      console.error(obj.error);
      showToast('Error al codificar GIF.', 'error');
      updateStatus('Error de exportación', 'unfilled');
      startPreviewLoop();
    } else {
      // Download Base64 GIF URL
      const a = document.createElement('a');
      a.href = obj.image;
      a.download = 'cs_maker.gif';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      showToast('GIF descargado correctamente.', 'success');
      updateStatus('Exportación completa', 'active');
      
      // Resume preview loop
      startPreviewLoop();
    }
  });
}
