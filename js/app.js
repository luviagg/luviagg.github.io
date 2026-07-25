/* =====================================================================
   APP.JS — Main Application Logic, State, Events, CFG Generation
   ===================================================================== */

// ================================================================
// STATE
// ================================================================
// Debounce timer for generateAndPreview
let _previewDebounceTimer = null;

const APP = {
  state: {
    platform: 'steam',
    activeModule: 'identity',
    // Module data: { enabled, vars }
    modules: {},
    // Keybinds: { KEY: 'command' }
    keybinds: { ...DEFAULT_KEYBINDS },
    // Buy bind slots
    buyBinds: JSON.parse(JSON.stringify(DEFAULT_BUY_BINDS)),
    // Aliases: { alias_id: { enabled, ...config } }
    aliases: {},
    // Filename
    filename: 'config',
    // Crosshair background
    crosshairBg: 'dark',
    // Active game
    game: 'cs16',
  },

  // ── Save full state to localStorage ──
  persistState() {
    try {
      const snapshot = {
        platform: this.state.platform,
        game: this.state.game || 'cs16',
        activeModule: this.state.activeModule,
        modules: this.state.modules,
        keybinds: this.state.keybinds,
        buyBinds: this.state.buyBinds,
        aliases: this.state.aliases,
        filename: this.state.filename,
        crosshairBg: this.state.crosshairBg,
      };
      localStorage.setItem('cs_cfg_state', JSON.stringify(snapshot));
    } catch(e) {}
  },

  // ── Restore full state from localStorage ──
  restoreState() {
    try {
      const raw = localStorage.getItem('cs_cfg_state');
      if (!raw) return false;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return false;
      if (saved.platform)    this.state.platform    = saved.platform;
      if (saved.game)        this.state.game        = saved.game;
      if (saved.activeModule)this.state.activeModule= saved.activeModule;
      if (saved.modules)     this.state.modules     = saved.modules;
      if (saved.keybinds)    this.state.keybinds    = saved.keybinds;
      if (saved.buyBinds)    this.state.buyBinds    = saved.buyBinds;
      if (saved.aliases)     this.state.aliases     = saved.aliases;
      if (saved.filename)    this.state.filename    = saved.filename;
      if (saved.crosshairBg) this.state.crosshairBg = saved.crosshairBg;
      return true;
    } catch(e) { return false; }
  },

  init() {
    this.initParticles();

    // Restore persisted state FIRST, then init missing defaults
    const hadSavedState = this.restoreState();
    this.initModuleState();

    this.initKeyCaptureListeners();
    this.renderSidebar();
    this.renderAllModules();
    this.attachEvents();
    this.renderUserPresets();

    // Set dynamic copyright year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Set theme on load
    const savedTheme = localStorage.getItem('cs_cfg_theme') || 'default';
    this.setTheme(savedTheme);

    // Sync UI with restored state (game + platform)
    if (hadSavedState) {
      const game = this.state.game || 'cs16';
      document.querySelectorAll('.game-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.game === game));
      const logoSub = document.getElementById('logo-sub');
      if (logoSub) {
        const names = { cs16: 'Counter-Strike 1.6', css: 'Counter-Strike: Source', cs2: 'Counter-Strike 2 / GO' };
        logoSub.textContent = names[game] || 'Counter-Strike 1.6';
      }
      const fnInput = document.getElementById('filename-input');
      if (fnInput) fnInput.value = this.state.filename || 'config';
    }


    // Initialize resizable splitter
    this.initSplitter();

    // Restore saved layout configurations
    const isVertical = localStorage.getItem('cs_cfg_layout_vertical') === 'true';
    if (isVertical) {
      const workspace = document.getElementById('main-workspace');
      if (workspace) workspace.classList.add('layout-vertical');
      const btn = document.getElementById('btn-toggle-orientation');
      if (btn) btn.classList.add('active');
      const savedHeight = localStorage.getItem('cs_cfg_preview_h') || '300px';
      const preview = document.getElementById('preview-panel');
      if (preview) {
        preview.style.height = savedHeight;
        preview.style.width = '100%';
        preview.style.flex = 'none';
      }
    } else {
      const savedWidth = localStorage.getItem('cs_cfg_preview_w');
      if (savedWidth) {
        const preview = document.getElementById('preview-panel');
        if (preview) {
          preview.style.width = savedWidth;
          preview.style.flex = 'none';
        }
      }
    }
    const isSwapped = localStorage.getItem('cs_cfg_layout_swapped') === 'true';
    if (isSwapped) {
      const workspace = document.getElementById('main-workspace');
      if (workspace) workspace.classList.add('layout-swapped');
    }
    const isOptionsCollapsed = localStorage.getItem('cs_cfg_options_collapsed') === 'true';
    if (isOptionsCollapsed) {
      const workspace = document.getElementById('main-workspace');
      if (workspace) workspace.classList.add('options-collapsed');
      const btn = document.getElementById('btn-toggle-options');
      if (btn) btn.classList.add('active');
    }
    const isPreviewCollapsed = localStorage.getItem('cs_cfg_preview_collapsed') === 'true';
    if (isPreviewCollapsed) {
      const workspace = document.getElementById('main-workspace');
      if (workspace) workspace.classList.add('preview-collapsed');
      const btn = document.getElementById('btn-toggle-preview');
      if (btn) btn.classList.add('active');
    }

    // Mobile sidebar toggle
    this.initMobileSidebar();

    this.generateAndPreview();
    this.initCrosshairCanvas();
    setTimeout(() => this.animatePanelsIn(), 100);

    if (hadSavedState) showToast('Sesión anterior restaurada ✓', 'success');
  },

  // ── Key capture listener setup ──
  initKeyCaptureListeners() {
    window.addEventListener('keydown', (e) => {
      if (!isListeningForKey) return;
      e.preventDefault();
      e.stopPropagation();
      const csKey = mapBrowserKeyToCS(e);
      if (csKey) handleCapturedKey(csKey);
    }, true);

    window.addEventListener('mousedown', (e) => {
      if (!isListeningForKey) return;
      const box = document.getElementById('key-listener');
      if (box && box.contains(e.target) && !box.classList.contains('active')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const mouseButtons = { 0: 'MOUSE1', 1: 'MOUSE3', 2: 'MOUSE2', 3: 'MOUSE4', 4: 'MOUSE5' };
      const csKey = mouseButtons[e.button];
      if (csKey) handleCapturedKey(csKey);
    }, true);

    window.addEventListener('wheel', (e) => {
      if (!isListeningForKey) return;
      e.preventDefault();
      e.stopPropagation();
      const csKey = e.deltaY > 0 ? 'MWHEELDOWN' : 'MWHEELUP';
      handleCapturedKey(csKey);
    }, true);
  },

  // ── Initialize module state from defaults ──
  initModuleState() {
    for (const mod of MODULES_CONFIG) {
      if (!this.state.modules[mod.id]) {
        this.state.modules[mod.id] = { enabled: false, vars: {} };
      }
    }
    // Init aliases
    for (const alias of PREDEFINED_ALIASES) {
      if (!this.state.aliases[alias.id]) {
        this.state.aliases[alias.id] = { enabled: false, ...alias };
      }
    }
  },

  // ── Render Sidebar Navigation ──
  renderSidebar() {
    const nav = document.getElementById('module-nav');
    nav.innerHTML = MODULES_CONFIG.map(mod => {
      const enabled  = this.state.modules[mod.id]?.enabled;
      const isActive = this.state.activeModule === mod.id;
      return `<li class="module-nav-item">
        <button class="module-nav-btn ${isActive ? 'active' : ''}"
          id="nav-${mod.id}"
          onclick="APP.scrollToModule('${mod.id}')">
          <span class="nav-icon">${mod.icon}</span>
          <span class="nav-label">${mod.label}</span>
          ${enabled ? `<span class="nav-enabled-badge">ON</span>` : ''}
        </button>
      </li>`;
    }).join('');
  },

  // ── Render ALL module panels ──
  renderAllModules() {
    const container = document.getElementById('module-panels');
    if (!container) return;
    const html = MODULES_CONFIG.map(mod => this.renderModulePanel(mod)).join('');
    container.innerHTML = html;
    this.refreshCrosshairPreview();
  },

  // ── Render a single module panel ──
  renderModulePanel(mod) {
    const modState = this.state.modules[mod.id] || {};
    const enabled  = modState.enabled ?? false;
    const isActive = this.state.activeModule === mod.id;

    // Pick accent color
    const iconStyle = `background:${mod.color}22;color:${mod.color};`;
    const activeGlow = isActive ? `box-shadow:0 0 0 1px ${mod.color}33;` : '';
    // Panel is open if it's the active module
    const isOpen = isActive;

    // Build enable toggle
    const toggleHtml = `
      <div class="module-enable-toggle" onclick="event.stopPropagation()">
        <span class="module-enable-label">${enabled ? '<span style="color:var(--accent)">Incluido</span>' : 'No incluido'}</span>
        <label class="toggle">
          <input type="checkbox" ${enabled ? 'checked' : ''}
            onchange="APP.toggleModule('${mod.id}',this.checked)">
          <span class="toggle-track"></span>
        </label>
      </div>`;

    // Build body content
    let bodyContent = '';
    if (mod.special === 'keyboard') {
      bodyContent = renderKeyboardModule(this.state);
    } else if (mod.special === 'buymenu') {
      bodyContent = renderBuyMenuModule(this.state);
    } else if (mod.special === 'aliases') {
      bodyContent = renderAliasesModule(this.state);
    } else if (mod.special === 'crosshair') {
      bodyContent = renderCrosshairPreview(this.state) + renderCvarModule(mod, this.state);
    } else if (mod.sections) {
      bodyContent = renderCvarModule(mod, this.state);
    }

    return `
      <div class="module-panel ${isActive ? 'active-module' : ''}" id="panel-${mod.id}" style="${activeGlow}">
        <div class="panel-header ${isOpen ? 'open' : ''}" id="header-${mod.id}"
          onclick="APP.togglePanelOpen('${mod.id}')">
          <div class="panel-icon" style="${iconStyle}">${mod.icon}</div>
          <div class="panel-title-wrap">
            <div class="panel-title">${mod.label}</div>
            <div class="panel-subtitle">${mod.subtitle}</div>
          </div>
          <div class="panel-toggle" onclick="event.stopPropagation()">${toggleHtml}</div>
          <svg class="panel-chevron" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="panel-body ${isOpen ? 'open' : ''}" id="body-${mod.id}">
          ${bodyContent}
        </div>
      </div>`;
  },

  // ── Toggle module panel open/close (animación fluida con scrollHeight real) ──
  togglePanelOpen(modId) {
    const header = document.getElementById(`header-${modId}`);
    const body   = document.getElementById(`body-${modId}`);
    if (!header || !body) return;
    const isOpen = header.classList.contains('open');

    if (!isOpen) {
      // ABRIR: activar la clase para que el DOM genere el contenido, luego medir
      body.classList.add('open');
      const targetH = body.scrollHeight;
      body.style.maxHeight = '0px';
      body.style.overflow  = 'hidden';
      body.style.paddingTop    = '0';
      body.style.paddingBottom = '0';
      // doble rAF: garantiza que el browser registra el estado base antes de animar
      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.style.transition    = 'max-height 340ms cubic-bezier(0.4,0,0.2,1), padding-top 240ms ease, padding-bottom 240ms ease';
        body.style.maxHeight     = targetH + 'px';
        body.style.paddingTop    = '';
        body.style.paddingBottom = '';
        const onEnd = (e) => {
          if (e.propertyName !== 'max-height') return;
          // Limpiar estilos inline para que el contenido pueda cambiar de tamaño después
          body.style.maxHeight  = '';
          body.style.overflow   = '';
          body.style.transition = '';
          body.removeEventListener('transitionend', onEnd);
        };
        body.addEventListener('transitionend', onEnd);
      }));
    } else {
      // CERRAR: fijar la altura actual antes de animar a 0
      body.style.overflow   = 'hidden';
      body.style.maxHeight  = body.scrollHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.style.transition    = 'max-height 280ms cubic-bezier(0.4,0,0.2,1), padding-top 200ms ease, padding-bottom 200ms ease';
        body.style.maxHeight     = '0px';
        body.style.paddingTop    = '0';
        body.style.paddingBottom = '0';
        const onEnd = (e) => {
          if (e.propertyName !== 'max-height') return;
          body.classList.remove('open');
          body.style.maxHeight     = '';
          body.style.overflow      = '';
          body.style.transition    = '';
          body.style.paddingTop    = '';
          body.style.paddingBottom = '';
          body.removeEventListener('transitionend', onEnd);
        };
        body.addEventListener('transitionend', onEnd);
      }));
    }

    header.classList.toggle('open', !isOpen);
    this.state.activeModule = modId;
    this.updateNavActive(modId);
  },

  // ── Enable/disable a module in the CFG ──
  toggleModule(modId, enabled) {
    if (!this.state.modules[modId]) this.state.modules[modId] = { vars: {} };
    this.state.modules[modId].enabled = enabled;
    // Update nav badge
    const navBtn = document.getElementById(`nav-${modId}`);
    if (navBtn) {
      const badge = navBtn.querySelector('.nav-enabled-badge');
      if (enabled && !badge) {
        navBtn.insertAdjacentHTML('beforeend', '<span class="nav-enabled-badge">ON</span>');
      } else if (!enabled && badge) {
        badge.remove();
      }
    }
    // Update panel header label and checkbox
    const header = document.getElementById(`header-${modId}`);
    if (header) {
      const label = header.querySelector('.module-enable-label');
      if (label) label.innerHTML = enabled
        ? '<span style="color:var(--accent)">Incluido</span>'
        : 'No incluido';
      const checkbox = header.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = enabled;
    }
    this.generateAndPreview();
  },

  // ── Set a cvar value ──
  setCvar(modId, cvarKey, value) {
    if (!this.state.modules[modId]) this.state.modules[modId] = { enabled: false, vars: {} };
    this.state.modules[modId].vars[cvarKey] = value;
    
    // Highlight suggestion buttons matching this value
    this.updatePresetActiveStates(modId, cvarKey, value);

    // Reset preset select to custom state
    this.dirtyPreset();

    // Automatically enable the module if it's not enabled yet
    if (!this.state.modules[modId].enabled) {
      this.toggleModule(modId, true);
    } else {
      this.generateAndPreview();
    }
  },

  updatePresetActiveStates(modId, cvarKey, value) {
    const rowId = `row-${modId}-${cvarKey.replace(/[\s.]/g,'_')}`;
    const row = document.getElementById(rowId);
    if (!row) return;
    row.querySelectorAll('.action-btn').forEach(btn => {
      const isPresetActive = String(btn.dataset.presetVal) === String(value);
      btn.classList.toggle('selected', isPresetActive);
    });
  },

  dirtyPreset() {
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) presetSelect.value = '';
  },

  // ── Update nav active state ──
  updateNavActive(modId) {
    document.querySelectorAll('.module-nav-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`nav-${modId}`);
    if (btn) btn.classList.add('active');
  },

  // ── Scroll to module panel ──
  scrollToModule(modId) {
    const panel = document.getElementById(`panel-${modId}`);
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Also open it if closed
      const body = document.getElementById(`body-${modId}`);
      if (!body.classList.contains('open')) this.togglePanelOpen(modId);
    }
    this.state.activeModule = modId;
    this.updateNavActive(modId);
  },

  // ── Load a preset ──
  loadPreset(presetKey) {
    if (!presetKey || presetKey === '') return;
    const preset = PRESETS[presetKey];
    if (!preset) return;

    if (presetKey === 'blank') {
      this.state.modules = {};
      this.state.keybinds = {};
      this.state.buyBinds = [];
      this.state.aliases  = {};
      this.initModuleState();
      
      // Reset filename to config
      this.state.filename = 'config';
      const fnInput = document.getElementById('filename-input');
      if (fnInput) fnInput.value = 'config';
      this.updateInstallPath();
    } else {
      // Reset all modules
      for (const mod of MODULES_CONFIG) {
        this.state.modules[mod.id] = { enabled: false, vars: {} };
      }
      this.state.aliases = {};
      this.initModuleState();
      // Apply preset
      for (const [modId, modData] of Object.entries(preset.modules || {})) {
        this.state.modules[modId] = {
          enabled: modData.enabled ?? true,
          vars: { ...(modData.vars || {}) },
        };
      }
      // Reset to default binds
      this.state.keybinds = { ...DEFAULT_KEYBINDS };
      this.state.buyBinds = JSON.parse(JSON.stringify(DEFAULT_BUY_BINDS));

      // Update filename to match preset key
      this.state.filename = presetKey;
      const fnInput = document.getElementById('filename-input');
      if (fnInput) fnInput.value = presetKey;
      this.updateInstallPath();
    }

    this.renderAllModules();
    this.renderSidebar();
    this.generateAndPreview();
    showToast(`Preset "${preset.label}" cargado`, 'success');
    
    // Maintain the active preset selection
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) presetSelect.value = presetKey;
  },

  // ── Generate CFG text ──
  generateCFG() {
    const lines = [];
    const p = this.state.platform;
    const addComment = (txt) => lines.push(`// ${txt}`);
    const addLine    = (txt) => lines.push(txt);
    const addBlank   = ()    => lines.push('');
    const addSection = (title) => {
      addBlank();
      addLine(`// ${'─'.repeat(50)}`);
      addLine(`// ${title}`);
      addLine(`// ${'─'.repeat(50)}`);
    };

    addLine(`//   _       _    _  _      _  _____   _____  `);
    addLine(`//  | |     | |  | || |    | ||_   _| /  _  \\ `);
    addLine(`//  | |     | |  | | \\ \\  / /   | |   | |_| | `);
    addLine(`//  | |___  | |__| |  \\ \\/ /   _| |_  |  _  | `);
    addLine(`//  |_____| \\____/     \\__/   |_____| |_| |_|`);
    addLine(`//  ================================================================`);
    addLine(`//  Configuración personalizada por LUVIA`);
    addLine(`//  Sitio Oficial: https://luviagg.github.io`);
    addLine(`//  `);
    addLine(`//  Plataforma: ${p === 'steam' ? 'Steam' : 'No-Steam'}`);
    addLine(`//  Fecha: ${new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric' })}`);
    addLine(`//  ================================================================`);

    const game = this.state.game || 'cs16';

    for (const mod of MODULES_CONFIG) {
      const modState = this.state.modules[mod.id] || {};
      if (!modState.enabled) continue;

      // Skip special modules here (handled separately)
      if (mod.special === 'keyboard') continue;
      if (mod.special === 'buymenu') continue;
      if (mod.special === 'aliases') continue;

      const visibleSections = (mod.sections || []).filter(section => {
        if (section.games && !section.games.includes(game)) return false;
        return true;
      });
      if (visibleSections.length === 0) continue;

      addSection(mod.label.toUpperCase() + ' — ' + mod.subtitle);
      const vars = modState.vars || {};

      for (const section of visibleSections) {
        for (const varDef of section.vars) {
          if (varDef.games && !varDef.games.includes(game)) continue;
          // Skip steam-only vars on nosteam
          if (varDef.steamOnly && p === 'nosteam') continue;
          if (varDef.nosteamOnly && p === 'steam') continue;

          const val = vars[varDef.cvar] ?? varDef.default;
          if (val === '' || val === null || val === undefined) continue;

          // Format value
          const formatted = String(val);
          const cvarCmd = varDef.cvar.split(' ')[0];
          const rest    = varDef.cvar.split(' ').slice(1).join(' ');

          addLine(`${cvarCmd}${rest ? ' ' + rest : ''} "${formatted}"`);
        }
      }
    }

    // Keybinds module
    const keybindsModState = this.state.modules['keybinds'] || {};
    const buyModState = this.state.modules['buymenu'] || {};
    const buyKeys = buyModState.enabled ? this.state.buyBinds.map(b => b.key.toUpperCase()) : [];

    if (keybindsModState.enabled) {
      addSection('KEYBINDS');
      for (const [key, cmd] of Object.entries(this.state.keybinds)) {
        if (!cmd) continue;
        if (buyKeys.includes(key.toUpperCase())) continue; // Skip: written under COMPRA RÁPIDA
        if (cmd.startsWith('un')) {
          addLine(`${cmd} "${key}"`);
        } else {
          addLine(`bind "${key}" "${cmd}"`);
        }
      }
    }

    // Buy binds module
    if (buyModState.enabled && this.state.buyBinds.length > 0) {
      addSection('COMPRA RÁPIDA');
      for (const slot of this.state.buyBinds) {
        if (!slot.key || slot.items.length === 0) continue;
        const itemsCmd = slot.items.join('; ');
        const extraCmd = slot.extra ? `; ${slot.extra}` : '';
        const cmd = itemsCmd + extraCmd;
        addLine(`// ${slot.label}`);
        addLine(`bind "${slot.key}" "${cmd}"`);
      }
    }

    // Aliases module
    const aliasModState = this.state.modules['aliases'] || {};
    if (aliasModState.enabled) {
      addSection('ALIASES Y SCRIPTS');
      for (const aliasDef of PREDEFINED_ALIASES) {
        const saved = this.state.aliases[aliasDef.id] || {};
        const merged = { ...aliasDef, ...saved };
        if (!merged.enabled) continue;
        const generated = aliasDef.generate(merged);
        if (generated.length === 0) continue;
        addLine(`// --- ${aliasDef.label} ---`);
        for (const l of generated) addLine(l);
        addBlank();
      }
    }

    addBlank();
    return lines;
  },

  // ── Generate and update preview (debounced 150ms) ──
  generateAndPreview() {
    clearTimeout(_previewDebounceTimer);
    _previewDebounceTimer = setTimeout(() => {
      const lines = this.generateCFG();
      const raw   = lines.join('\n');
      const codeEl = document.getElementById('cfg-code');
      if (codeEl) codeEl.innerHTML = syntaxHighlight(raw);

      const statLines = document.getElementById('stat-lines');
      if (statLines) statLines.textContent = `${lines.length} líneas`;

      // Scan for tandem config dependencies
      const tandemWarning = document.getElementById('tandem-warning');
      const tandemName    = document.getElementById('tandem-cfg-name');
      if (tandemWarning && tandemName) {
        const tandemFile = scanForTandemConfigs(raw);
        if (tandemFile) {
          tandemWarning.classList.remove('hidden');
          tandemName.textContent = tandemFile;
        } else {
          tandemWarning.classList.add('hidden');
        }
      }

      // Persist state after every change
      this.persistState();

      // Update install path
      this.updateInstallPath();
    }, 150);
  },

  updateInstallPath() {
    const p = this.state.platform;
    const game = this.state.game || 'cs16';
    const pathEl = document.getElementById('install-path');
    const cmdEl  = document.getElementById('exec-cmd');
    const fname  = this.state.filename || 'config';
    if (pathEl) {
      if (game === 'cs15') {
        pathEl.innerHTML = `<span class="path-label">Ruta CS 1.5 WON:</span><code>Sierra/Half-Life/cstrike/</code>`;
      } else if (game === 'cscz') {
        if (p === 'steam') {
          pathEl.innerHTML = `<span class="path-label">Steam:</span><code>Steam/steamapps/common/Half-Life/czero/</code>`;
        } else {
          pathEl.innerHTML = `<span class="path-label">No-Steam:</span><code>Condition Zero/czero/</code>`;
        }
      } else if (game === 'css') {
        pathEl.innerHTML = `<span class="path-label">CS:S Path:</span><code>Steam/steamapps/common/Counter-Strike Source/cstrike/cfg/</code>`;
      } else if (game === 'cs2') {
        pathEl.innerHTML = `<span class="path-label">CS2 Path:</span><code>Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/cfg/</code>`;
      } else {
        if (p === 'steam') {
          pathEl.innerHTML = `<span class="path-label">Steam:</span><code>Steam/steamapps/common/Half-Life/cstrike/</code>`;
        } else {
          pathEl.innerHTML = `<span class="path-label">No-Steam:</span><code>counter-strike/cstrike/</code> o <code>valve/cstrike/</code>`;
        }
      }
    }
    if (cmdEl) cmdEl.textContent = `exec ${fname}.cfg`;
  },

  // ── Download CFG ──
  downloadCFG() {
    const lines = this.generateCFG();
    const raw   = lines.join('\r\n');
    const fname = (this.state.filename || 'config') + '.cfg';
    const blob  = new Blob([raw], { type: 'text/plain;charset=utf-8' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href = url; a.download = fname;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`✅ Descargado: ${fname}`, 'success');
  },

  // ── Copy CFG to clipboard ──
  copyCFG() {
    const lines = this.generateCFG();
    const raw   = lines.join('\n');
    navigator.clipboard.writeText(raw).then(() => {
      showToast('📋 CFG copiado al portapapeles', 'success');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = raw; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 CFG copiado al portapapeles', 'success');
    });
  },

  // ── Switch platform ──
  setPlatform(platform) {
    this.state.platform = platform;

    this.updateInstallPath();
    // Re-render modules to show/hide platform-specific cvars
    this.renderAllModules();
    this.generateAndPreview();
    showToast(`Plataforma: ${platform === 'steam' ? '🎮 Steam' : '💀 No-Steam'}`, 'info');
  },

  // ── Import CFG ──
  importCFG(text) {
    const lines = text.split('\n');
    let imported = 0;
    
    // Clear and reset state on import to match the imported file
    this.state.buyBinds = [];
    this.state.keybinds = {};
    
    // Get all valid buy items from data
    const buyItemsList = [];
    for (const cat of Object.values(BUY_ITEMS)) {
      for (const item of cat.items) {
        buyItemsList.push(item.cmd);
      }
    }

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//')) continue;
      
      const lowerLine = line.toLowerCase();

      // Match: bind "KEY" "command"
      const bindMatch = line.match(/^bind\s+"?([^"\s]+)"?\s+"([^"]+)"/i);
      if (bindMatch) {
        const rawKey = bindMatch[1];
        const key = rawKey.toUpperCase();
        const cmd = bindMatch[2].trim();

        // Always save to the unified keybinds registry (for keyboard mapping visualizer)
        this.state.keybinds[key] = cmd;

        // Split command by semicolon to check for buy items
        const subCmds = cmd.split(';').map(s => s.trim());
        const buyItems = [];
        const extraCmds = [];

        for (const sub of subCmds) {
          if (buyItemsList.includes(sub.toLowerCase())) {
            buyItems.push(sub.toLowerCase());
          } else {
            extraCmds.push(sub);
          }
        }

        if (buyItems.length > 0) {
          // It's also a buy bind! Add it to the helper menu state
          const label = `Compra Rápida (${key})`;
          this.state.buyBinds.push({
            id: `buy_slot_${this.state.buyBinds.length}`,
            key: key,
            label: label,
            items: buyItems,
            extra: extraCmds.join('; ')
          });
          if (!this.state.modules.buymenu) this.state.modules.buymenu = { enabled: true, vars: {} };
          this.state.modules.buymenu.enabled = true;
        } else {
          if (!this.state.modules.keybinds) this.state.modules.keybinds = { enabled: true, vars: {} };
          this.state.modules.keybinds.enabled = true;
        }
        imported++;
        continue;
      }

      // Match: cvar "value"
      const cvarMatch = line.match(/^(\S+)\s+"([^"]*)"/);
      if (cvarMatch) {
        const key = cvarMatch[1];
        const val = cvarMatch[2];
        this.importCvarValue(key, val);
        imported++;
        continue;
      }

      // Match: cvar value (no quotes)
      const cvarNoQ = line.match(/^(\S+)\s+(\S+)/);
      if (cvarNoQ && !lowerLine.startsWith('alias') && !lowerLine.startsWith('echo') && !lowerLine.startsWith('exec') && !lowerLine.startsWith('bind')) {
        this.importCvarValue(cvarNoQ[1], cvarNoQ[2]);
        imported++;
      }
    }

    this.renderAllModules();
    this.renderSidebar();
    this.generateAndPreview();
    showToast(`CFG importada: ~${imported} líneas procesadas`, 'success');
  },

  importCvarValue(key, val) {
    // Find which module this cvar belongs to
    for (const mod of MODULES_CONFIG) {
      if (!mod.sections) continue;
      for (const section of mod.sections) {
        for (const varDef of section.vars) {
          if (varDef.cvar.split(' ')[0].toLowerCase() === key.toLowerCase()) {
            if (!this.state.modules[mod.id]) this.state.modules[mod.id] = { enabled: true, vars: {} };
            this.state.modules[mod.id].enabled = true;
            this.state.modules[mod.id].vars[varDef.cvar] = isNaN(Number(val)) ? val : Number(val);
            return;
          }
        }
      }
    }
  },

  // ── Init crosshair canvas ──
  initCrosshairCanvas() {
    this.refreshCrosshairPreview();
  },

  refreshCrosshairPreview() {
    const canvas = document.getElementById('crosshair-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hud = (this.state.modules.hud || {}).vars || {};
    const colorStr = hud['cl_crosshair_color'] || '255 255 255';
    const size     = hud['cl_crosshair_size']  || 'small';
    const translu  = Number(hud['cl_crosshair_translucent']) === 1;

    const [r, g, b] = colorStr.split(' ').map(Number);
    const color = `rgba(${r},${g},${b},${translu ? 0.5 : 1})`;
    const sizeMap = { small: 8, medium: 12, large: 18, auto: 10 };
    const half    = sizeMap[size] || 8;
    const gap     = 3;
    const thick   = 2;

    // Draw procedural background map
    this.drawCrosshairBg(ctx, canvas.width, canvas.height, this.state.crosshairBg || 'dark');

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.fillStyle = color;
    
    // Shadow outline for better contrast on light backgrounds (pro HUD style!)
    ctx.shadowBlur  = 2;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    
    // Top
    ctx.fillRect(cx - thick/2, cy - gap - half, thick, half);
    // Bottom
    ctx.fillRect(cx - thick/2, cy + gap, thick, half);
    // Left
    ctx.fillRect(cx - gap - half, cy - thick/2, half, thick);
    // Right
    ctx.fillRect(cx + gap, cy - thick/2, half, thick);
    // Dot if crosshair cvar is 1
    if (Number(hud['crosshair']) === 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  },

  drawCrosshairBg(ctx, width, height, type) {
    if (type === 'light') {
      ctx.fillStyle = '#eef2f3';
      ctx.fillRect(0, 0, width, height);
    } else if (type === 'dust2') {
      // Procedural Dust2 wall: sandy yellow with stones
      ctx.fillStyle = '#c5af8a';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#a48e69';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = 0; y <= height; y += 40) {
        ctx.moveTo(0, y); ctx.lineTo(width, y);
        const offset = (y / 40) % 2 === 0 ? 0 : 50;
        for (let x = offset; x <= width; x += 100) {
          ctx.moveTo(x, y); ctx.lineTo(x, y + 40);
        }
      }
      ctx.stroke();
      // Add a shadow overlay to simulate depth
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, width, height);
    } else if (type === 'inferno') {
      // Procedural Inferno tunnel: dark brown brick
      ctx.fillStyle = '#4e332c';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#321f1a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = 0; y <= height; y += 30) {
        ctx.moveTo(0, y); ctx.lineTo(width, y);
        const offset = (y / 30) % 2 === 0 ? 0 : 40;
        for (let x = offset; x <= width; x += 80) {
          ctx.moveTo(x, y); ctx.lineTo(x, y + 30);
        }
      }
      ctx.stroke();
    } else if (type === 'aztec') {
      // Procedural Aztec temple: mossy green stone blocks
      ctx.fillStyle = '#2b3f2b';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#1e2c1e'; // moss spots
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc((i * 80 + 40) % width, (i * 50 + 20) % height, 25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#111b11';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let y = 0; y <= height; y += 40) {
        ctx.moveTo(0, y); ctx.lineTo(width, y);
        const offset = (y / 40) % 2 === 0 ? 0 : 60;
        for (let x = offset; x <= width; x += 120) {
          ctx.moveTo(x, y); ctx.lineTo(x, y + 40);
        }
      }
      ctx.stroke();
    } else {
      // 'dark'
      ctx.fillStyle = '#111b1a';
      ctx.fillRect(0, 0, width, height);
    }
  },

  // ── Particles background ──
  initParticles() {
    const canvas = document.getElementById('bg-canvas');
    const ctx    = canvas.getContext('2d');
    let w, h, particles = [], animFrameId = null;
    const N = 60;

    function resize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function mkParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.4 + 0.05,
      };
    }
    for (let i = 0; i < N; i++) particles.push(mkParticle());

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Get accent color dynamically from CSS variables once per frame
      const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#00ff88';

      // Very subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.015)';
      ctx.lineWidth   = 1;
      const gs = 60;
      for (let x = 0; x < w; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.restore();
      }
      animFrameId = requestAnimationFrame(draw);
    }

    // Pause animation when tab is hidden (saves CPU/GPU)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
      } else {
        if (!animFrameId) draw();
      }
    });

    draw();
  },

  // ── Mobile sidebar toggle ──
  initMobileSidebar() {
    const btn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (!btn || !sidebar) return;

    btn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('mobile-open');
      btn.setAttribute('aria-expanded', isOpen);
      btn.classList.toggle('active', isOpen);
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 900) return;
      if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('active');
      }
    });
  },

  // ── Animate panels in ──
  animatePanelsIn() {
    const panels = document.querySelectorAll('.module-panel');
    panels.forEach((p, i) => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(20px)';
      setTimeout(() => {
        p.style.transition = 'opacity 400ms ease, transform 400ms ease';
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, i * 50);
    });
  },

  // ── Attach all event listeners ──
  attachEvents() {

    // Preset
    document.getElementById('preset-select').addEventListener('change', (e) => {
      this.loadPreset(e.target.value);
    });
    // Download
    document.getElementById('btn-download').addEventListener('click', () => this.downloadCFG());
    // Copy
    document.getElementById('btn-copy').addEventListener('click', () => this.copyCFG());
    // Reset
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm('¿Resetear toda la configuración?')) {
        this.state.modules  = {};
        this.state.keybinds = { ...DEFAULT_KEYBINDS };
        this.state.buyBinds = JSON.parse(JSON.stringify(DEFAULT_BUY_BINDS));
        this.state.aliases  = {};
        this.initModuleState();
        this.renderAllModules();
        this.renderSidebar();
        this.generateAndPreview();
        showToast('Configuración reseteada', 'info');
      }
    });
    // Import button
    document.getElementById('btn-import').addEventListener('click', () => {
      document.getElementById('import-modal').classList.remove('hidden');
    });
    document.getElementById('import-close').addEventListener('click', () => {
      document.getElementById('import-modal').classList.add('hidden');
    });
    document.getElementById('import-backdrop').addEventListener('click', () => {
      document.getElementById('import-modal').classList.add('hidden');
    });
    document.getElementById('import-cancel').addEventListener('click', () => {
      document.getElementById('import-modal').classList.add('hidden');
    });

    // File import upload zone listeners
    const uploadZone = document.getElementById('file-upload-zone');
    const fileInput  = document.getElementById('import-file-input');

    uploadZone.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        document.getElementById('import-textarea').value = evt.target.result;
        showToast(`Archivo "${file.name}" cargado en el editor`, 'success');
      };
      reader.readAsText(file);
    });

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--accent)';
      uploadZone.style.background = 'rgba(0, 255, 136, 0.05)';
    });

    uploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--border)';
      uploadZone.style.background = 'rgba(0, 0, 0, 0.2)';
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--border)';
      uploadZone.style.background = 'rgba(0, 0, 0, 0.2)';
      
      const file = e.dataTransfer.files[0];
      if (file) {
        if (file.name.endsWith('.cfg') || file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (evt) => {
            document.getElementById('import-textarea').value = evt.target.result;
            showToast(`Archivo "${file.name}" cargado en el editor`, 'success');
          };
          reader.readAsText(file);
        } else {
          showToast('El archivo debe ser un archivo de configuración .cfg', 'error');
        }
      }
    });

    document.getElementById('import-parse').addEventListener('click', () => {
      const text = document.getElementById('import-textarea').value;
      if (!text.trim()) { showToast('No hay contenido para cargar', 'error'); return; }
      this.importCFG(text);
      document.getElementById('import-modal').classList.add('hidden');
      // Clear values
      document.getElementById('import-textarea').value = '';
      fileInput.value = '';
    });

    // Filename input listeners
    const fnInput = document.getElementById('filename-input');
    if (fnInput) {
      fnInput.addEventListener('input', (e) => {
        this.state.filename = e.target.value.trim() || 'config';
        this.updateInstallPath();
      });
      fnInput.addEventListener('change', (e) => {
        let sanitized = e.target.value.replace(/[^a-zA-Z0-9_\-]/g, '');
        if (!sanitized) sanitized = 'config';
        e.target.value = sanitized;
        this.state.filename = sanitized;
        this.updateInstallPath();
      });
    }

    // Modal backdrop
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    document.getElementById('modal-close').addEventListener('click', closeModal);

    // User presets save button
    const savePresetBtn = document.getElementById('btn-save-preset');
    if (savePresetBtn) {
      savePresetBtn.addEventListener('click', () => this.saveUserPreset());
    }

    // Game selector buttons
    document.querySelectorAll('.game-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const game = btn.dataset.game;
        if (game === 'cs16' || game === 'cscz') {
          // Close all dropdowns except current
          document.querySelectorAll('.game-dropdown-menu').forEach(d => {
            if (d.id !== `${game}-dropdown`) d.classList.remove('open');
          });
          const dropdown = document.getElementById(`${game}-dropdown`);
          if (dropdown) {
            dropdown.classList.toggle('open');
            e.stopPropagation();
          }
        } else {
          // CS 1.5, CS:S and CS2 default to Steam/WON configuration paths
          this.state.platform = 'steam';
          this.setGame(game);
          // Close all dropdowns
          document.querySelectorAll('.game-dropdown-menu').forEach(d => d.classList.remove('open'));
        }
      });
    });

    // Close dropdown on click outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.game-dropdown-menu').forEach(d => d.classList.remove('open'));
    });

    // Neon copyright button to toggle views
    const copyrightBtn = document.getElementById('neon-copyright-btn');
    if (copyrightBtn) {
      copyrightBtn.addEventListener('click', () => {
        this.toggleSidebarView();
      });
    }

    // Back to builder button
    const backBtn = document.getElementById('btn-back-to-builder');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.toggleSidebarView('default');
      });
    }
  },

  setGame(game) {
    this.state.game = game;

    // Highlight active game button
    document.querySelectorAll('.game-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.game === game);
    });

    // Update logo subtitle
    const logoSub = document.getElementById('logo-sub');
    if (logoSub) {
      const names = {
        cs15: 'Counter-Strike 1.5',
        cs16: 'Counter-Strike 1.6',
        cscz: 'Counter-Strike: Condition Zero',
        css: 'Counter-Strike: Source',
        cs2: 'Counter-Strike 2 / GO'
      };
      logoSub.textContent = names[game] || 'Counter-Strike 1.6';
    }

    // Update installation instructions text
    this.updateInstallPath();

    // Re-render UI panels
    this.renderSidebar();
    this.renderAllModules();
    this.generateAndPreview();

    const toastNames = {
      cs15: '💾 CS 1.5',
      cs16: '🔫 CS 1.6',
      cscz: '☣️ CS:CZ',
      css: '🎯 CS:Source',
      cs2: '🔥 CS2'
    };
    showToast(`Modo de juego: ${toastNames[game] || game}`, 'info');
  },

  toggleSidebarView(view) {
    const defaultView = document.getElementById('sidebar-default-view');
    const networksView = document.getElementById('sidebar-networks-view');
    if (!defaultView || !networksView) return;

    if (view === 'networks' || (view === undefined && networksView.classList.contains('hidden'))) {
      defaultView.classList.add('hidden');
      networksView.classList.remove('hidden');
    } else {
      defaultView.classList.remove('hidden');
      networksView.classList.add('hidden');
    }
  },

  setTheme(themeName) {
    // Remove existing theme classes from body
    document.body.className = document.body.className.replace(/\btheme-[^\s]+\b/g, '').trim();
    // Add the new theme class if not default
    if (themeName !== 'default') {
      document.body.classList.add(`theme-${themeName}`);
    }
    // Save to localStorage
    localStorage.setItem('cs_cfg_theme', themeName);
    
    // Sync dropdown select if it exists
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) themeSelect.value = themeName;
  },

  // ── User Presets (LocalStorage) ──
  saveUserPreset() {
    const input = document.getElementById('new-preset-name');
    const name = input?.value?.trim();
    if (!name) {
      // Shake animation on empty input
      if (input) {
        input.classList.add('input-shake');
        setTimeout(() => input.classList.remove('input-shake'), 500);
      }
      showToast('Escribí un nombre para el preset', 'error');
      return;
    }
    
    const presetData = {
      modules: this.state.modules,
      keybinds: this.state.keybinds,
      buyBinds: this.state.buyBinds,
      aliases: this.state.aliases,
      filename: this.state.filename,
      platform: this.state.platform,
      game: this.state.game || 'cs16',
    };

    let saved = {};
    try {
      const raw = localStorage.getItem('cs_cfg_user_presets');
      if (raw) saved = JSON.parse(raw);
    } catch(e) {}

    saved[name] = presetData;
    localStorage.setItem('cs_cfg_user_presets', JSON.stringify(saved));
    
    if (input) input.value = '';
    showToast(`Preset "${name}" guardado con éxito`, 'success');
    this.renderUserPresets();
  },

  deleteUserPreset(name) {
    if (!confirm(`¿Eliminar el preset "${name}"?`)) return;
    let saved = {};
    try {
      const raw = localStorage.getItem('cs_cfg_user_presets');
      if (raw) saved = JSON.parse(raw);
    } catch(e) {}

    delete saved[name];
    localStorage.setItem('cs_cfg_user_presets', JSON.stringify(saved));
    
    showToast(`Preset "${name}" eliminado`, 'info');
    this.renderUserPresets();
  },

  loadUserPreset(name) {
    let saved = {};
    try {
      const raw = localStorage.getItem('cs_cfg_user_presets');
      if (raw) saved = JSON.parse(raw);
    } catch(e) {}

    const preset = saved[name];
    if (!preset) { showToast('No se encontró el preset', 'error'); return; }

    this.state.modules = preset.modules || {};
    this.state.keybinds = preset.keybinds || {};
    this.state.buyBinds = preset.buyBinds || [];
    this.state.aliases = preset.aliases || {};
    this.state.filename = preset.filename || 'config';
    this.state.platform = preset.platform || 'steam';
    this.state.game = preset.game || 'cs16';

    // Update UI elements
    const fnInput = document.getElementById('filename-input');
    if (fnInput) fnInput.value = this.state.filename;
    
    document.querySelectorAll('.game-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.game === this.state.game);
    });



    // Update logo subtitle
    const logoSub = document.getElementById('logo-sub');
    if (logoSub) {
      const names = {
        cs16: 'Counter-Strike 1.6',
        css: 'Counter-Strike: Source',
        cs2: 'Counter-Strike 2 / GO'
      };
      logoSub.textContent = names[this.state.game] || 'Counter-Strike 1.6';
    }

    this.updateInstallPath();
    this.renderAllModules();
    this.renderSidebar();
    this.generateAndPreview();
    
    showToast(`Preset "${name}" cargado`, 'success');
  },

  renderUserPresets() {
    const listEl = document.getElementById('user-presets-list');
    if (!listEl) return;

    let saved = {};
    try {
      const raw = localStorage.getItem('cs_cfg_user_presets');
      if (raw) saved = JSON.parse(raw);
    } catch(e) {}

    const names = Object.keys(saved);
    if (names.length === 0) {
      listEl.innerHTML = `<li style="font-size:10px;color:var(--text-3);padding:4px;text-align:center;">No hay presets guardados</li>`;
      return;
    }

    listEl.innerHTML = names.map(name => `
      <li class="user-preset-item">
        <span class="preset-load-link" onclick="APP.loadUserPreset('${escJs(name)}')">${escHtml(name)}</span>
        <button class="preset-delete-btn" onclick="APP.deleteUserPreset('${escJs(name)}')" title="Borrar preset">✕</button>
      </li>
    `).join('');
  },

  initSplitter() {
    const splitter = document.getElementById('layout-splitter');
    const workspace = document.getElementById('main-workspace');
    const content = document.getElementById('content-area');
    const preview = document.getElementById('preview-panel');
    if (!splitter || !workspace || !content || !preview) return;

    let isDragging = false;

    splitter.addEventListener('mousedown', (e) => {
      isDragging = true;
      splitter.classList.add('dragging');
      const isVertical = workspace.classList.contains('layout-vertical');
      document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const workspaceRect = workspace.getBoundingClientRect();
      const isSwapped = workspace.classList.contains('layout-swapped');
      const isVertical = workspace.classList.contains('layout-vertical');
      
      if (isVertical) {
        // Calculate vertical split ratio based on mouse position relative to workspace height
        let y = e.clientY - workspaceRect.top;
        if (isSwapped) {
          y = workspaceRect.height - y;
        }
        
        const minContentHeight = 180;
        const minPreviewHeight = 150;
        const totalHeight = workspaceRect.height;
        
        let previewHeight = totalHeight - y - 4; // 4px offset for splitter
        
        if (previewHeight < minPreviewHeight) previewHeight = minPreviewHeight;
        if (totalHeight - previewHeight < minContentHeight) previewHeight = totalHeight - minContentHeight;
        
        preview.style.height = `${previewHeight}px`;
        preview.style.width = '100%';
        preview.style.flex = 'none';
        content.style.flex = '1';
      } else {
        // Calculate horizontal split ratio based on mouse position relative to workspace width
        let x = e.clientX - workspaceRect.left;
        if (isSwapped) {
          x = workspaceRect.width - x;
        }
        
        const minContentWidth = 250;
        const minPreviewWidth = 280;
        const totalWidth = workspaceRect.width;
        
        let previewWidth = totalWidth - x - 4; // 4px offset for splitter
        
        if (previewWidth < minPreviewWidth) previewWidth = minPreviewWidth;
        if (totalWidth - previewWidth < minContentWidth) previewWidth = totalWidth - minContentWidth;
        
        preview.style.width = `${previewWidth}px`;
        preview.style.height = '';
        preview.style.flex = 'none';
        content.style.flex = '1';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        splitter.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        const isVertical = workspace.classList.contains('layout-vertical');
        if (isVertical) {
          localStorage.setItem('cs_cfg_preview_h', preview.style.height);
        } else {
          localStorage.setItem('cs_cfg_preview_w', preview.style.width);
        }
      }
    });
  },

  toggleLayoutOrientation() {
    const workspace = document.getElementById('main-workspace');
    const preview = document.getElementById('preview-panel');
    if (!workspace || !preview) return;

    const isVertical = workspace.classList.toggle('layout-vertical');
    localStorage.setItem('cs_cfg_layout_vertical', isVertical);

    const btn = document.getElementById('btn-toggle-orientation');
    if (btn) btn.classList.toggle('active', isVertical);

    // Reset styles to avoid stretching issues between grid directions
    if (isVertical) {
      preview.style.width = '100%';
      const savedHeight = localStorage.getItem('cs_cfg_preview_h') || '300px';
      preview.style.height = savedHeight;
      preview.style.flex = 'none';
      showToast('Diseño en Filas (Arriba/Abajo)', 'info');
    } else {
      preview.style.height = '';
      const savedWidth = localStorage.getItem('cs_cfg_preview_w') || '420px';
      preview.style.width = savedWidth;
      preview.style.flex = 'none';
      showToast('Diseño en Columnas (Izquierda/Derecha)', 'info');
    }
  },

  swapLayout() {
    const workspace = document.getElementById('main-workspace');
    if (!workspace) return;
    const isSwapped = workspace.classList.toggle('layout-swapped');
    localStorage.setItem('cs_cfg_layout_swapped', isSwapped);
    
    const isVertical = workspace.classList.contains('layout-vertical');
    if (isVertical) {
      showToast(isSwapped ? 'Opciones abajo' : 'Opciones arriba', 'info');
    } else {
      showToast(isSwapped ? 'Opciones a la derecha' : 'Opciones a la izquierda', 'info');
    }
  },

  toggleOptionsPanel() {
    const workspace = document.getElementById('main-workspace');
    if (!workspace) return;
    
    if (workspace.classList.contains('preview-collapsed')) {
      workspace.classList.remove('preview-collapsed');
      const btnP = document.getElementById('btn-toggle-preview');
      if (btnP) btnP.classList.remove('active');
    }
    
    const isCollapsed = workspace.classList.toggle('options-collapsed');
    localStorage.setItem('cs_cfg_options_collapsed', isCollapsed);
    
    const btn = document.getElementById('btn-toggle-options');
    if (btn) btn.classList.toggle('active', isCollapsed);
  },

  togglePreviewPanel() {
    const workspace = document.getElementById('main-workspace');
    if (!workspace) return;
    
    if (workspace.classList.contains('options-collapsed')) {
      workspace.classList.remove('options-collapsed');
      const btnO = document.getElementById('btn-toggle-options');
      if (btnO) btnO.classList.remove('active');
    }
    
    const isCollapsed = workspace.classList.toggle('preview-collapsed');
    localStorage.setItem('cs_cfg_preview_collapsed', isCollapsed);
    
    const btn = document.getElementById('btn-toggle-preview');
    if (btn) btn.classList.toggle('active', isCollapsed);
  },

  selectPlatformDropdown(game, platform) {
    this.setPlatform(platform);
    this.setGame(game);
    const dropdown = document.getElementById(`${game}-dropdown`);
    if (dropdown) dropdown.classList.remove('open');
  },
};

// ================================================================
// GLOBAL FUNCTIONS (called from HTML event handlers)
// ================================================================

function setCvar(modId, cvar, value) {
  APP.setCvar(modId, cvar, value);
  if (modId === 'hud') setTimeout(() => APP.refreshCrosshairPreview(), 50);
}

function setCrosshairBg(bg) {
  APP.state.crosshairBg = bg;
  const container = document.getElementById('body-hud');
  if (container && container.classList.contains('open')) {
    const hudMod = MODULES_CONFIG.find(m => m.id === 'hud');
    container.innerHTML = renderCrosshairPreview(APP.state) + renderCvarModule(hudMod, APP.state);
  }
  APP.refreshCrosshairPreview();
}

function applyPresetVal(modId, cvar, value) {
  APP.setCvar(modId, cvar, value);
  // Update the input field
  const id = `var-${modId}-${cvar.replace(/[\s.]/g,'_')}`;
  const el = document.getElementById(id);
  if (el) {
    if (el.type === 'range') {
      el.value = value;
      const valEl = document.getElementById(id + '-val');
      if (valEl) valEl.textContent = value;
    } else {
      el.value = value;
    }
  }
}

function setChColor(modId, cvar, value, swatch) {
  APP.setCvar(modId, cvar, value);
  // Update active swatch
  swatch.closest('.color-palettes').querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  // Update text input
  const id = `var-${modId}-${cvar.replace(/[\s.]/g,'_')}`;
  const el = document.getElementById(id);
  if (el) el.value = value;
  setTimeout(() => APP.refreshCrosshairPreview(), 50);
}

// ================================================================
// KEYBIND EDITOR
// ================================================================
let currentBindKey = null;

function openBindEditor(key) {
  currentBindKey = key;
  const current  = APP.state.keybinds[key] || '';

  // Make modal narrow
  const modalBox = document.querySelector('#modal .modal-box');
  if (modalBox) modalBox.classList.remove('wide');

  document.getElementById('modal-title').textContent = `Bind: ${key}`;

  let categoriesHtml = '';
  const searchId = 'bind-search-' + Date.now();

  for (const [catKey, cat] of Object.entries(BIND_ACTIONS)) {
    const btns = cat.actions.map(action => {
      const isSelected = current === action.cmd;
      return `<button class="action-btn ${isSelected ? 'selected' : ''}"
        onclick="selectAction('${escJs(action.cmd)}',this)"
        title="${escJs(action.desc)}">${action.label}</button>`;
    }).join('');
    categoriesHtml += `
      <div class="action-category" data-category="${catKey}">
        <div class="action-category-title">${cat.label}</div>
        <div class="action-btns">${btns}</div>
      </div>`;
  }

  document.getElementById('modal-body').innerHTML = `
    <div class="bind-editor">
      <div class="bind-editor-key">
        <span class="bind-editor-key-label">Tecla:</span>
        <span class="bind-editor-key-val">${key}</span>
        <span style="color:var(--text-2);font-size:12px;flex:1;">Bind actual:</span>
        <code class="bind-current" id="bind-current-display">${escHtml(current || '— sin bind —')}</code>
      </div>

      <div id="key-listener" class="key-listener-box" onclick="startKeyListener('editor')">
        <span class="pulse-dot"></span>
        <span id="key-listener-text">¿Cambiar tecla? Hace clic acá y presiona cualquier tecla física o mouse</span>
      </div>

      <div class="bind-search-wrap">
        <span class="bind-search-icon">🔍</span>
        <input class="bind-search" id="${searchId}" type="text"
          placeholder="Buscar acción... (ej: jump, shoot, ak47)"
          oninput="filterBindActions(this.value)">
      </div>

      <div class="action-categories" id="bind-action-cats">
        ${categoriesHtml}
      </div>

      <div class="bind-custom-wrap">
        <label class="bind-custom-label">📝 Comando personalizado (podés encadenar con <b style="color:var(--accent)">;</b>)</label>
        <input class="bind-custom-input" id="bind-custom-val" type="text"
          value="${escHtml(current)}"
          placeholder='Ej: ak47; primammo; vesthelm; hegren'
          oninput="updateBindPreview(this.value)"
          onchange="updateBindPreview(this.value)">
        <div class="info-box" style="margin-top:8px;">
          <span class="info-box-icon">💡</span>
          <span>Podés combinar varios comandos separados por <b>;</b> en un solo bind. Por ejemplo: <code style="color:var(--accent)">ak47; primammo; secammo; vesthelm; hegren</code> compra todo de una vez.</span>
        </div>
      </div>

      <div class="bind-editor-actions">
        <button class="btn-unbind" onclick="unbindKey()">🗑️ Quitar Bind</button>
        <button class="btn-save-bind" onclick="saveBind()">✅ Guardar Bind</button>
      </div>
    </div>`;

  document.getElementById('modal').classList.remove('hidden');
}

function filterBindActions(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.action-category').forEach(cat => {
    let visible = 0;
    cat.querySelectorAll('.action-btn').forEach(btn => {
      const match = btn.textContent.toLowerCase().includes(q) || btn.title.toLowerCase().includes(q);
      btn.style.display = match || !q ? '' : 'none';
      if (match || !q) visible++;
    });
    cat.style.display = visible > 0 ? '' : 'none';
  });
}

function selectAction(cmd, btn) {
  // Deselect all
  document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const customInput = document.getElementById('bind-custom-val');
  if (customInput) customInput.value = cmd;
  updateBindPreview(cmd);
}

function updateBindPreview(val) {
  const disp = document.getElementById('bind-current-display');
  if (disp) disp.textContent = val || '— sin bind —';
}

function saveBind() {
  const val = document.getElementById('bind-custom-val')?.value?.trim();
  if (!val) { unbindKey(); return; }
  APP.state.keybinds[currentBindKey] = val;
  closeModal();
  // Refresh keyboard panel
  refreshKeyboardPanel();
  APP.generateAndPreview();
  showToast(`Bind guardado: ${currentBindKey} → ${val}`, 'success');
}

function unbindKey() {
  delete APP.state.keybinds[currentBindKey];
  closeModal();
  refreshKeyboardPanel();
  APP.generateAndPreview();
  showToast(`Bind removido: ${currentBindKey}`, 'info');
}

function refreshKeyboardPanel() {
  const body = document.getElementById('body-keybinds');
  if (body && body.classList.contains('open')) {
    body.innerHTML = renderKeyboardModule(APP.state);
  }
}

function resetDefaultBinds() {
  APP.state.keybinds = { ...DEFAULT_KEYBINDS };
  refreshKeyboardPanel();
  APP.generateAndPreview();
  showToast('Binds reseteados a defaults de CS 1.6', 'info');
}

function clearAllBinds() {
  if (!confirm('¿Limpiar todos los binds?')) return;
  APP.state.keybinds = {};
  refreshKeyboardPanel();
  APP.generateAndPreview();
  showToast('Todos los binds eliminados', 'info');
}

// ================================================================
// BUY MENU FUNCTIONS
// ================================================================

function toggleBuyItem(slotIdx, itemCmd, btn) {
  const slot = APP.state.buyBinds[slotIdx];
  if (!slot) return;
  const idx = slot.items.indexOf(itemCmd);
  if (idx === -1) { slot.items.push(itemCmd); }
  else            { slot.items.splice(idx, 1); }
  btn.classList.toggle('selected', slot.items.indexOf(itemCmd) !== -1);
  // Update preview
  const previewEl = document.getElementById(`buy-preview-${slotIdx}`);
  if (previewEl) {
    const itemsCmd = slot.items.join('; ');
    const extraCmd = slot.extra ? `; ${slot.extra}` : '';
    const cmd = (itemsCmd + extraCmd).replace(/^;\s*/, '');
    previewEl.textContent = cmd || '— vacío —';
    previewEl.classList.toggle('has-items', slot.items.length > 0 || !!slot.extra);
    
    // Sync into the unified keyboard mapping registry
    if (slot.key) {
      APP.state.keybinds[slot.key.toUpperCase()] = cmd;
    }
  }
  APP.generateAndPreview();
}

function addBuySlot() {
  const idx = APP.state.buyBinds.length;
  APP.state.buyBinds.push({
    id: `buy_slot_${idx}`,
    key: 'KP_5',
    label: `Slot ${idx + 1}`,
    items: [],
    extra: ""
  });
  // Re-render buy panel
  const body = document.getElementById('body-buymenu');
  if (body) body.innerHTML = renderBuyMenuModule(APP.state);
  APP.generateAndPreview();
}

function removeBuySlot(idx) {
  const slot = APP.state.buyBinds[idx];
  if (slot && slot.key) {
    delete APP.state.keybinds[slot.key.toUpperCase()];
  }
  APP.state.buyBinds.splice(idx, 1);
  const body = document.getElementById('body-buymenu');
  if (body) body.innerHTML = renderBuyMenuModule(APP.state);
  APP.generateAndPreview();
  showToast('Slot de compra eliminado', 'info');
}

function renameBuySlot(idx, name) {
  if (APP.state.buyBinds[idx]) {
    APP.state.buyBinds[idx].label = name;
    APP.generateAndPreview();
  }
}

function pickBuySlotKey(idx) {
  openKeyPicker((key) => {
    const slot = APP.state.buyBinds[idx];
    if (slot) {
      // Remove old key from keybinds registry
      if (slot.key) {
        delete APP.state.keybinds[slot.key.toUpperCase()];
      }
      
      slot.key = key.toUpperCase();
      
      // Save new key mapping in keybinds registry
      const itemsCmd = slot.items.join('; ');
      const extraCmd = slot.extra ? `; ${slot.extra}` : '';
      const cmd = (itemsCmd + extraCmd).replace(/^;\s*/, '');
      APP.state.keybinds[slot.key] = cmd;
    }
    const body = document.getElementById('body-buymenu');
    if (body) body.innerHTML = renderBuyMenuModule(APP.state);
    APP.generateAndPreview();
  });
}

// ================================================================
// ALIAS FUNCTIONS
// ================================================================

function toggleAlias(aliasId, enabled) {
  if (!APP.state.aliases[aliasId]) APP.state.aliases[aliasId] = {};
  APP.state.aliases[aliasId].enabled = enabled;
  // Re-render aliases panel
  const body = document.getElementById('body-aliases');
  if (body) body.innerHTML = renderAliasesModule(APP.state);
  APP.generateAndPreview();
}

function setAliasVal(aliasId, field, value) {
  if (!APP.state.aliases[aliasId]) APP.state.aliases[aliasId] = {};
  APP.state.aliases[aliasId][field] = value;
  // Refresh preview for this alias
  const previewEl = document.getElementById(`alias-preview-${aliasId}`);
  if (previewEl) {
    const aliasDef = PREDEFINED_ALIASES.find(a => a.id === aliasId);
    if (aliasDef) {
      const merged = { ...aliasDef, ...APP.state.aliases[aliasId] };
      previewEl.textContent = aliasDef.generate(merged).join('\n');
    }
  }
  APP.generateAndPreview();
}

function pickAliasKey(aliasId, field) {
  openKeyPicker((key) => {
    setAliasVal(aliasId, field, key);
    const body = document.getElementById('body-aliases');
    if (body) body.innerHTML = renderAliasesModule(APP.state);
    APP.generateAndPreview();
  });
}

// ================================================================
// KEY CAPTURE AND LISTENERS
// ================================================================
let isListeningForKey = false;
let keyListenerTarget = null; // 'picker' or 'editor'

function startKeyListener(targetType) {
  isListeningForKey = true;
  keyListenerTarget = targetType;
  const box = document.getElementById('key-listener');
  if (box) {
    box.classList.add('active');
    document.getElementById('key-listener-text').textContent = '🎯 ESCUCHANDO... Presioná cualquier tecla física de tu teclado, mouse o rueda';
  }
}

function stopKeyListener() {
  isListeningForKey = false;
  const box = document.getElementById('key-listener');
  if (box) {
    box.classList.remove('active');
    if (keyListenerTarget === 'editor') {
      document.getElementById('key-listener-text').textContent = '¿Cambiar tecla? Hace clic acá y presiona cualquier tecla física o mouse';
    } else {
      document.getElementById('key-listener-text').textContent = 'Capturar tecla física: haz clic acá y presiona tu teclado/mouse/rueda';
    }
  }
}

function handleCapturedKey(key) {
  stopKeyListener();
  if (keyListenerTarget === 'picker') {
    selectPickedKey(key);
  } else if (keyListenerTarget === 'editor') {
    closeModal();
    openBindEditor(key);
    showToast(`Tecla capturada: ${key}`, 'success');
  }
}

function mapBrowserKeyToCS(e) {
  const code = e.code;
  const key = e.key;

  // F1-F12
  if (/^F[1-9]$/.test(code) || /^F1[0-2]$/.test(code)) {
    return code;
  }

  // Numpad key mapping
  const numpadMap = {
    Numpad0: 'KP_INS',
    Numpad1: 'KP_END',
    Numpad2: 'KP_DOWNARROW',
    Numpad3: 'KP_PGDN',
    Numpad4: 'KP_LEFTARROW',
    Numpad5: 'KP_5',
    Numpad6: 'KP_RIGHTARROW',
    Numpad7: 'KP_HOME',
    Numpad8: 'KP_UPARROW',
    Numpad9: 'KP_PGUP',
    NumpadDecimal: 'KP_DEL',
    NumpadDivide: 'KP_SLASH',
    NumpadMultiply: 'KP_MULTIPLY',
    NumpadSubtract: 'KP_MINUS',
    NumpadAdd: 'KP_PLUS',
    NumpadEnter: 'KP_ENTER',
  };
  if (numpadMap[code]) return numpadMap[code];

  // Arrow keys
  if (code === 'ArrowUp') return 'UPARROW';
  if (code === 'ArrowDown') return 'DOWNARROW';
  if (code === 'ArrowLeft') return 'LEFTARROW';
  if (code === 'ArrowRight') return 'RIGHTARROW';

  // Modifier/Special keys
  const specMap = {
    Space: 'SPACE',
    Escape: 'ESCAPE',
    Tab: 'TAB',
    ControlLeft: 'CTRL',
    ControlRight: 'RCTRL',
    ShiftLeft: 'SHIFT',
    ShiftRight: 'RSHIFT',
    AltLeft: 'ALT',
    AltRight: 'RALT',
    Enter: 'ENTER',
    Backspace: 'BACKSPACE',
    Insert: 'INS',
    Delete: 'DEL',
    Home: 'HOME',
    End: 'END',
    PageUp: 'PGUP',
    PageDown: 'PGDN',
    ScrollLock: 'SCROLLLOCK',
    Pause: 'PAUSE',
    Backquote: 'GRAVE',
    Minus: 'MINUS',
    Equal: 'EQUALS',
    BracketLeft: 'LEFTBRACKET',
    BracketRight: 'RIGHTBRACKET',
    Semicolon: 'SEMICOLON',
    Quote: 'APOSTROPHE',
    Comma: 'COMMA',
    Period: 'PERIOD',
    Slash: 'SLASH',
    Backslash: 'BACKSLASH',
    CapsLock: 'CAPSLOCK',
  };
  if (specMap[code]) return specMap[code];

  // Letter keys
  if (code.startsWith('Key')) {
    return code.substring(3).toLowerCase();
  }
  // Digit row keys
  if (code.startsWith('Digit')) {
    return code.substring(5);
  }

  // Fallback single characters (e.g. ñ, ç, etc.)
  if (key.length === 1) {
    return key.toLowerCase();
  }

  return null;
}

// ================================================================
// KEY PICKER (generic)
// ================================================================
let keyPickerCallback = null;

function openKeyPicker(callback) {
  keyPickerCallback = callback;

  // Make modal wide to fit the keyboard
  const modalBox = document.querySelector('#modal .modal-box');
  if (modalBox) modalBox.classList.add('wide');

  document.getElementById('modal-title').textContent = 'Elegir Tecla';

  const mouseHtml = MOUSE_KEYS.map(mk => {
    return `<div class="mouse-key" onclick="selectPickedKey('${mk.key}')">
      <span>${mk.icon}</span>
      <span>${mk.label}</span>
    </div>`;
  }).join('');

  document.getElementById('modal-body').innerHTML = `
    <div class="flex flex-col gap-12">
      <div id="key-listener" class="key-listener-box" onclick="startKeyListener('picker')">
        <span class="pulse-dot"></span>
        <span id="key-listener-text">Capturar tecla física: haz clic acá y presiona tu teclado/mouse/rueda</span>
      </div>

      <div class="kb-section-title">⌨️ O selecciona de la distribución visual:</div>
      ${renderFullDesktopKeyboardHTML('selectPickedKey', APP.state.keybinds, false)}

      <div class="kb-section-title" style="margin-top:8px;">🖱️ O selecciona un botón del Mouse:</div>
      <div class="mouse-keys">${mouseHtml}</div>
    </div>`;

  document.getElementById('modal').classList.remove('hidden');
}

function selectPickedKey(key) {
  closeModal();
  if (keyPickerCallback) { keyPickerCallback(key); keyPickerCallback = null; }
}

// ================================================================
// MODAL CLOSE
// ================================================================
function closeModal() {
  stopKeyListener();
  document.getElementById('modal').classList.add('hidden');
  
  // Reset modal width
  const modalBox = document.querySelector('#modal .modal-box');
  if (modalBox) modalBox.classList.remove('wide');
  
  currentBindKey = null;
}

// ================================================================
// CFG SYNTAX HIGHLIGHTING
// ================================================================
function syntaxHighlight(text) {
  const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return text.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('// ===') || trimmed.startsWith('// ───')) {
      return `<span class="cfg-section-hdr">${esc(line)}</span>`;
    }
    if (trimmed.startsWith('//')) {
      return `<span class="cfg-comment">${esc(line)}</span>`;
    }
    if (trimmed.startsWith('bind ')) {
      // bind "KEY" "cmd"
      return line.replace(/^(bind)\s+"([^"]+)"\s+"([^"]*)"(.*)$/, (_, b, key, cmd, rest) =>
        `<span class="cfg-bind">${esc(b)}</span> <span class="cfg-string">"${esc(key)}"</span> <span class="cfg-value">"${esc(cmd)}"</span>${esc(rest)}`
      );
    }
    if (trimmed.startsWith('alias ')) {
      return `<span class="cfg-cmd">${esc(line)}</span>`;
    }
    if (trimmed.startsWith('unbind ')) {
      return `<span class="cfg-bind">${esc(line)}</span>`;
    }
    // cvar "value"
    const m = line.match(/^(\s*\S+)\s+"([^"]*)"(.*)$/);
    if (m) {
      return `<span class="cfg-key">${esc(m[1])}</span> <span class="cfg-string">"</span><span class="cfg-value">${esc(m[2])}</span><span class="cfg-string">"</span>${esc(m[3])}`;
    }
    return esc(line);
  }).join('\n');
}

// ================================================================
// TOAST NOTIFICATIONS
// ================================================================
function showToast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warn: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${escHtml(msg)}</span>`;
  document.getElementById('toasts').appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ================================================================
// HELPERS
// ================================================================
function escJs(str) {
  return String(str || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"');
}
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function scanForTandemConfigs(cfgText) {
  const regex = /exec\s+["']?([^"\s;]+)(?:\.cfg)?["']?/i;
  const match = cfgText.match(regex);
  if (match) {
    return match[1] + '.cfg';
  }
  if (cfgText.includes('load_awp_settings') || cfgText.includes('load_normal_settings')) {
    return 'Luvia-awp.cfg / Luvia.cfg';
  }
  return null;
}

// Expose globally for HTML event handlers
window.setCvar         = setCvar;
window.applyPresetVal  = applyPresetVal;
window.setChColor      = setChColor;
window.openBindEditor  = openBindEditor;
window.selectAction    = selectAction;
window.filterBindActions = filterBindActions;
window.updateBindPreview= updateBindPreview;
window.saveBind        = saveBind;
window.unbindKey       = unbindKey;
window.resetDefaultBinds = resetDefaultBinds;
window.clearAllBinds   = clearAllBinds;
window.toggleBuyItem   = toggleBuyItem;
window.addBuySlot      = addBuySlot;
window.removeBuySlot   = removeBuySlot;
window.renameBuySlot   = renameBuySlot;
window.pickBuySlotKey  = pickBuySlotKey;
window.toggleAlias     = toggleAlias;
window.setAliasVal     = setAliasVal;
window.pickAliasKey    = pickAliasKey;
window.selectPickedKey = selectPickedKey;
window.closeModal      = closeModal;
window.formatRangeVal  = formatRangeVal;
window.startKeyListener = startKeyListener;
window.setCrosshairBg  = setCrosshairBg;
window.APP             = APP;

// ================================================================
// BOOT
// ================================================================
document.addEventListener('DOMContentLoaded', () => APP.init());
