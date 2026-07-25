/* =====================================================================
   UI.JS — Component Renderers for all Module Panels
   ===================================================================== */

// ================================================================
// UTILITY: Build a control row
// ================================================================
function buildControlRow(varDef, value, moduleId, platform) {
  const steamOnly  = varDef.steamOnly  || (!varDef.nosteam && varDef.steam);
  const nosteamOnly= varDef.nosteamOnly|| (!varDef.steam   && varDef.nosteam);
  const hide = (steamOnly && platform === 'nosteam') || (nosteamOnly && platform === 'steam');
  if (hide) return '';

  const badgeHtml = steamOnly  ? '<span class="steam-only-badge">Solo Steam</span>'  : '';
  const nsBadge   = nosteamOnly? '<span class="nosteam-badge">No-Steam</span>' : '';

  const inputHtml = buildInput(varDef, value, moduleId);
  const cvarTag   = `<span class="cvar-tag">${varDef.cvar}</span>`;

  return `
    <div class="control-row" id="row-${moduleId}-${varDef.cvar.replace(/[\s.]/g,'_')}">
      <div class="control-info">
        <div class="control-name">${varDef.label} ${cvarTag} ${badgeHtml}${nsBadge}</div>
        <div class="control-desc">${varDef.desc}</div>
        ${buildPresets(varDef, moduleId, value)}
      </div>
      <div class="control-input">${inputHtml}</div>
    </div>`;
}

function buildPresets(varDef, moduleId, value) {
  if (!varDef.presets || varDef.type === 'crosshair_color') return '';
  const btns = varDef.presets.map(p => {
    const isNum = !isNaN(Number(p.value)) && String(p.value).trim() !== '';
    const arg = isNum ? p.value : `'${String(p.value).replace(/'/g, "\\'")}'`;
    const isSelected = String(value) === String(p.value);
    return `<button class="action-btn ${isSelected ? 'selected' : ''}" data-preset-val="${p.value}" onclick="applyPresetVal('${moduleId}','${varDef.cvar}',${arg})">${p.label}</button>`;
  }).join('');
  return `<div class="action-btns" style="margin-top:6px;">${btns}</div>`;
}

function buildInput(varDef, value, moduleId) {
  const id = `var-${moduleId}-${varDef.cvar.replace(/[\s.]/g,'_')}`;
  const safe = (v) => String(v ?? varDef.default ?? '').replace(/"/g, '&quot;');

  switch (varDef.type) {
    case 'text':
      return `<input class="cfg-input w-lg" type="text" id="${id}"
                value="${safe(value)}"
                placeholder="${varDef.placeholder || ''}"
                onchange="setCvar('${moduleId}','${varDef.cvar}',this.value)"
                oninput="setCvar('${moduleId}','${varDef.cvar}',this.value)">`;

    case 'number':
      return `<input class="cfg-input w-sm" type="text" id="${id}"
                value="${safe(value)}"
                placeholder="${varDef.placeholder || ''}"
                onchange="setCvar('${moduleId}','${varDef.cvar}',this.value)"
                oninput="setCvar('${moduleId}','${varDef.cvar}',this.value)">`;

    case 'toggle': {
      const checked = (Number(value ?? varDef.default) === 1) ? 'checked' : '';
      return `<label class="toggle">
        <input type="checkbox" id="${id}" ${checked}
          onchange="setCvar('${moduleId}','${varDef.cvar}',this.checked?1:0)">
        <span class="toggle-track"></span>
      </label>`;
    }

    case 'range': {
      const val = Number(value ?? varDef.default ?? 0);
      const decimals = varDef.step < 0.1 ? 2 : (varDef.step < 1 ? 1 : 0);
      const dispVal = parseFloat(val).toFixed(decimals);
      return `<div class="range-wrap">
        <input type="range" class="cfg-range" id="${id}"
          min="${varDef.min}" max="${varDef.max}" step="${varDef.step}"
          value="${val}"
          oninput="setCvar('${moduleId}','${varDef.cvar}',parseFloat(this.value)); document.getElementById('${id}-val').textContent=parseFloat(this.value).toFixed(${decimals})">
        <span class="range-val" id="${id}-val">${dispVal}</span>
      </div>`;
    }

    case 'select': {
      const opts = varDef.options.map(o =>
        `<option value="${o.value}" ${String(value ?? varDef.default) === o.value ? 'selected' : ''}>${o.label}</option>`
      ).join('');
      return `<select class="cfg-select" id="${id}"
        onchange="setCvar('${moduleId}','${varDef.cvar}',this.value)">${opts}</select>`;
    }

    case 'crosshair_color': {
      const presets = (varDef.presets || []).map(p =>
        `<div class="color-swatch ${String(value ?? varDef.default) === p.value ? 'active' : ''}"
          style="background:rgb(${p.value.replace(/ /g,',')})"
          title="${p.label}"
          onclick="setChColor('${moduleId}','${varDef.cvar}','${p.value}',this)"></div>`
      ).join('');
      return `<div class="flex flex-col gap-8">
        <div class="color-palettes">${presets}</div>
        <input class="cfg-input w-md" type="text" id="${id}"
          value="${safe(value)}" placeholder="255 255 255"
          oninput="setCvar('${moduleId}','${varDef.cvar}',this.value); updateCrosshairPreview()"
          onchange="setCvar('${moduleId}','${varDef.cvar}',this.value); updateCrosshairPreview()">
      </div>`;
    }

    default:
      return `<input class="cfg-input w-md" type="text" id="${id}"
                value="${safe(value)}"
                onchange="setCvar('${moduleId}','${varDef.cvar}',this.value)">`;
  }
}

function formatRangeVal(input, varDef) {
  const val = parseFloat(input.value);
  if (varDef.step < 0.01) return val.toFixed(3);
  if (varDef.step < 0.1)  return val.toFixed(2);
  if (varDef.step < 1)    return val.toFixed(1);
  return Math.round(val).toString();
}

// ================================================================
// RENDER: Standard CVARs panel
// ================================================================
function renderCvarModule(mod, state) {
  const modState = state.modules[mod.id] || {};
  const vars     = modState.vars || {};
  const game     = state.game || 'cs16';

  let html = '';
  for (const section of mod.sections) {
    if (section.games && !section.games.includes(game)) continue;

    let sectionHtml = '';
    for (const varDef of section.vars) {
      if (varDef.games && !varDef.games.includes(game)) continue;
      sectionHtml += buildControlRow(varDef, vars[varDef.cvar] ?? varDef.default, mod.id, state.platform);
    }

    if (sectionHtml) {
      html += `<div class="cfg-section">`;
      if (section.title) html += `<div class="cfg-section-title">${section.title}</div>`;
      html += sectionHtml;
      html += `</div>`;
    }
  }
  return html;
}

// ================================================================
// COMPONENT: Full Desktop Keyboard Layout Renderer (Main + Nav + Numpad side-by-side)
// ================================================================
function renderFullDesktopKeyboardHTML(onClickFnName, bindsMap = {}, showPreviews = true) {
  function renderRow(rowKeys) {
    return rowKeys.map(k => {
      if (k.spacer) return `<div style="width:12px;flex-shrink:0"></div>`;
      const hasBind = bindsMap && !!bindsMap[k.key];
      const bindPreview = (hasBind && showPreviews) ? abbreviateBind(bindsMap[k.key]) : '';
      return `<div class="key-cap ${k.class || ''} ${hasBind ? 'has-bind' : ''}"
                onclick="${onClickFnName}('${k.key}')"
                title="${k.key}${hasBind ? ': ' + bindsMap[k.key] : ' — Sin bind'}">
        <span class="key-name">${k.label}</span>
        ${bindPreview ? `<span class="key-bind-preview">${escHtml(bindPreview)}</span>` : ''}
      </div>`;
    }).join('');
  }

  const mainKb = KEYBOARD_LAYOUT.map(row =>
    `<div class="kb-row">${renderRow(row)}</div>`
  ).join('');

  const navKb = NAV_KEYS.map(row => {
    const content = row.map(k => {
      if (k.spacer) return `<div style="width:46px;height:50px"></div>`;
      const hasBind = bindsMap && !!bindsMap[k.key];
      const bp = (hasBind && showPreviews) ? abbreviateBind(bindsMap[k.key]) : '';
      return `<div class="key-cap key-sm ${hasBind ? 'has-bind' : ''}"
                onclick="${onClickFnName}('${k.key}')"
                title="${k.key}${hasBind ? ': '+bindsMap[k.key] : ''}">
        <span class="key-name">${k.label}</span>
        ${bp ? `<span class="key-bind-preview">${escHtml(bp)}</span>` : ''}
      </div>`;
    }).join('');
    return `<div class="kb-row">${content}</div>`;
  }).join('');

  const numKb = NUMPAD_KEYS.map(k => {
    if (k.spacer) return `<div class="numpad-spacer"></div>`;
    const hasBind = bindsMap && !!bindsMap[k.key];
    const bp = (hasBind && showPreviews) ? abbreviateBind(bindsMap[k.key]) : '';
    return `<div class="key-cap ${k.class || ''} ${hasBind ? 'has-bind' : ''}"
              onclick="${onClickFnName}('${k.key}')"
              title="${k.key}${hasBind ? ': '+bindsMap[k.key] : ''}">
      <span class="key-name">${k.label}</span>
      ${bp ? `<span class="key-bind-preview">${escHtml(bp)}</span>` : ''}
    </div>`;
  }).join('');

  return `
    <div class="keyboard-desktop" style="overflow-x:auto;padding-bottom:8px;">
      <div class="keyboard-desktop-main">
        ${mainKb}
      </div>
      <div class="keyboard-desktop-nav">
        ${navKb}
      </div>
      <div class="keyboard-desktop-num">
        <div class="numpad-grid">
          ${numKb}
        </div>
      </div>
    </div>`;
}

// ================================================================
// RENDER: Keyboard Module
// ================================================================
function renderKeyboardModule(state) {
  const binds = state.keybinds || {};

  const mouseHtml = MOUSE_KEYS.map(mk => {
    const hasBind = !!binds[mk.key];
    const bp = hasBind ? abbreviateBind(binds[mk.key]) : '';
    return `<div class="mouse-key ${hasBind ? 'has-bind' : ''}" onclick="openBindEditor('${mk.key}')" title="${mk.key}${hasBind ? ': '+binds[mk.key] : ''}">
      <span>${mk.icon}</span>
      <span>${mk.label}</span>
      ${hasBind ? `<span class="mouse-key-bind">${escHtml(bp)}</span>` : ''}
    </div>`;
  }).join('');

  return `
    <div class="tip-box" style="margin-bottom:16px;">
      <span class="tip-box-icon">💡</span>
      <span>Hacé clic en cualquier tecla para asignarle un comando. Las teclas resaltadas en <b style="color:var(--accent2)">cyan</b> ya tienen un bind. Podés encadenar múltiples comandos con <b style="color:var(--accent)">;</b></span>
    </div>
    <div class="kb-section-title">⌨️ Distribución de Teclado Completa</div>
    ${renderFullDesktopKeyboardHTML('openBindEditor', binds, false)}
    
    <div class="kb-section-title" style="margin-top:16px;">🖱️ Botones de Mouse</div>
    <div class="mouse-keys">${mouseHtml}</div>
    <div class="divider"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <button class="btn-secondary" onclick="resetDefaultBinds()" style="font-size:12px;">↺ Defaults CS 1.6</button>
      <button class="btn-secondary" onclick="clearAllBinds()" style="font-size:12px;border-color:var(--red);color:var(--red)">🗑️ Limpiar Todo</button>
      <span style="font-size:11px;color:var(--text-3);margin-left:8px;">
        ${Object.keys(binds).length} bind(s) asignados
      </span>
    </div>`;
}

// ================================================================
// RENDER: Buy Menu Module
// ================================================================
function renderBuyMenuModule(state) {
  const buyBinds = state.buyBinds || [];

  let slotsHtml = buyBinds.map((slot, idx) => {
    const itemsCmd = slot.items.join('; ');
    const extraCmd = slot.extra ? `; ${slot.extra}` : '';
    const previewCmd = (itemsCmd + extraCmd).replace(/^;\s*/, '') || '— vacío —';
    const hasItems = slot.items.length > 0 || !!slot.extra;

    let itemsGrid = '';
    for (const catKey of Object.keys(BUY_ITEMS)) {
      const cat = BUY_ITEMS[catKey];
      const itemsHtml = cat.items.map(item => {
        const selected = slot.items.includes(item.cmd);
        return `<div class="buy-item-btn ${selected ? 'selected' : ''}"
                  onclick="toggleBuyItem(${idx},'${item.cmd}',this)"
                  title="${item.desc}">
          <span class="buy-item-icon">${item.icon}</span>
          ${item.label}
        </div>`;
      }).join('');
      itemsGrid += `<div style="margin-bottom:8px;">
        <div class="cfg-section-title" style="margin-bottom:6px;">${cat.label}</div>
        <div class="buy-items-grid">${itemsHtml}</div>
      </div>`;
    }

    return `
      <div class="buy-bind-slot" id="buy-slot-${idx}">
        <div class="buy-slot-header">
          <button class="buy-slot-key-btn" onclick="pickBuySlotKey(${idx})"
            title="Clic para cambiar la tecla">${escHtml(slot.key)}</button>
          <span class="buy-slot-name">Slot ${idx + 1}: ${slot.label}</span>
          <input class="cfg-input w-md" type="text" value="${escHtml(slot.label)}"
            placeholder="Nombre del slot"
            oninput="renameBuySlot(${idx},this.value)" style="max-width:140px;">
          <button class="btn-secondary" onclick="removeBuySlot(${idx})"
            style="font-size:11px;border-color:var(--red);color:var(--red);padding:5px 8px;">✕</button>
        </div>
        <div class="buy-slot-preview ${hasItems ? 'has-items' : ''}" id="buy-preview-${idx}">
          ${escHtml(previewCmd)}
        </div>
        <details>
          <summary style="cursor:pointer;font-size:12px;color:var(--text-2);padding:4px 0;user-select:none;">
            ${hasItems ? `✅ ${slot.items.length} item(s) seleccionado(s)` : '➕ Seleccionar items'} — clic para expandir
          </summary>
          <div style="margin-top:12px;">${itemsGrid}</div>
        </details>
      </div>`;
  }).join('');

  return `
    <div class="tip-box" style="margin-bottom:16px;">
      <span class="tip-box-icon">💡</span>
      <span>Cada slot crea un comando <b style="color:var(--accent)">bind</b> que compra múltiples items de una vez. Hacé clic en la tecla para cambiarla. Los items se compran en orden (el juego ignora los que no podés comprar).</span>
    </div>
    <div class="buy-builder" id="buy-builder">
      ${slotsHtml}
    </div>
    <button class="buy-add-slot" onclick="addBuySlot()" style="margin-top:12px;">
      ➕ Agregar Nuevo Slot de Compra
    </button>`;
}

// ================================================================
// RENDER: Aliases Module
// ================================================================
function renderAliasesModule(state) {
  const aliasState = state.aliases || {};

  const html = PREDEFINED_ALIASES.map(alias => {
    const saved = aliasState[alias.id] || {};
    const enabled = saved.enabled ?? alias.enabled ?? false;
    const preview = alias.generate({ ...alias, ...saved }).join('\n');

    // Build configurable fields per alias
    let configHtml = '';
    if (alias.keyDown !== undefined) {
      configHtml += `<div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Tecla Bajar FPS</div></div>
        <div class="control-input">
          <button class="buy-slot-key-btn" onclick="pickAliasKey('${alias.id}','keyDown')">${escHtml(saved.keyDown || alias.keyDown)}</button>
        </div></div>
      <div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Tecla Subir FPS</div></div>
        <div class="control-input">
          <button class="buy-slot-key-btn" onclick="pickAliasKey('${alias.id}','keyUp')">${escHtml(saved.keyUp || alias.keyUp)}</button>
        </div></div>
      <div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">FPS Mínimo</div></div>
        <div class="control-input">
          <input class="cfg-input w-sm" type="number" value="${saved.minFps ?? alias.minFps}" min="1" max="300"
            onchange="setAliasVal('${alias.id}','minFps',parseInt(this.value))">
        </div></div>
      <div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">FPS Máximo</div></div>
        <div class="control-input">
          <input class="cfg-input w-sm" type="number" value="${saved.maxFps ?? alias.maxFps}" min="1" max="300"
            onchange="setAliasVal('${alias.id}','maxFps',parseInt(this.value))">
        </div></div>`;
    }
    if (alias.bindKey !== undefined && alias.graphLevel !== undefined) {
      configHtml += `<div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Tecla del Scoreboard</div></div>
        <div class="control-input">
          <button class="buy-slot-key-btn" onclick="pickAliasKey('${alias.id}','bindKey')">${escHtml(saved.bindKey || alias.bindKey)}</button>
        </div></div>
      <div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Nivel de Net Graph</div></div>
        <div class="control-input">
          <select class="cfg-select" onchange="setAliasVal('${alias.id}','graphLevel',this.value)">
            <option value="1" ${(saved.graphLevel||alias.graphLevel)==='1'?'selected':''}>1 — Básico</option>
            <option value="2" ${(saved.graphLevel||alias.graphLevel)==='2'?'selected':''}>2 — Medio</option>
            <option value="3" ${(saved.graphLevel||alias.graphLevel)==='3'?'selected':''}>3 — Completo</option>
          </select>
        </div></div>`;
    }
    if (alias.bindKey !== undefined && alias.graphLevel === undefined && alias.keyMute === undefined && alias.rateAwp === undefined && alias.cfgName === undefined) {
      configHtml += `<div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Tecla del Toggle</div></div>
        <div class="control-input">
          <button class="buy-slot-key-btn" onclick="pickAliasKey('${alias.id}','bindKey')">${escHtml(saved.bindKey || alias.bindKey)}</button>
        </div></div>`;
    }
    if (alias.keyMute !== undefined) {
      configHtml += `<div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Tecla Mutear</div></div>
        <div class="control-input">
          <button class="buy-slot-key-btn" onclick="pickAliasKey('${alias.id}','keyMute')">${escHtml(saved.keyMute||alias.keyMute)}</button>
        </div></div>
      <div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Tecla Desmutear</div></div>
        <div class="control-input">
          <button class="buy-slot-key-btn" onclick="pickAliasKey('${alias.id}','keyUnmute')">${escHtml(saved.keyUnmute||alias.keyUnmute)}</button>
        </div></div>
      <div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Volumen al Desmutear</div></div>
        <div class="control-input">
          <input class="cfg-input w-sm" type="text" value="${saved.volumeOn??alias.volumeOn}"
            oninput="setAliasVal('${alias.id}','volumeOn',this.value)">
        </div></div>`;
    }
    if (alias.rateAwp !== undefined) {
      configHtml += `<div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Tecla de Cambio</div></div>
        <div class="control-input">
          <button class="buy-slot-key-btn" onclick="pickAliasKey('${alias.id}','keyNormal')">${escHtml(saved.keyNormal||alias.keyNormal)}</button>
        </div></div>
      <div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Rate Normal</div></div>
        <div class="control-input">
          <input class="cfg-input w-sm" type="text" value="${saved.rateNormal??alias.rateNormal}"
            oninput="setAliasVal('${alias.id}','rateNormal',this.value)">
        </div></div>
      <div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Rate AWP</div></div>
        <div class="control-input">
          <input class="cfg-input w-sm" type="text" value="${saved.rateAwp??alias.rateAwp}"
            oninput="setAliasVal('${alias.id}','rateAwp',this.value)">
        </div></div>`;
    }
    if (alias.cfgName !== undefined) {
      configHtml += `<div class="control-row" style="border-bottom:none;padding:8px 0;">
        <div class="control-info"><div class="control-name">Nombre de la CFG</div></div>
        <div class="control-input">
          <input class="cfg-input w-md" type="text" value="${saved.cfgName??alias.cfgName}"
            oninput="setAliasVal('${alias.id}','cfgName',this.value)">
        </div></div>`;
    }

    return `
      <div class="alias-item" id="alias-${alias.id}">
        <div class="alias-header">
          <span class="alias-icon">${alias.icon}</span>
          <span class="alias-name">${alias.label}</span>
          <label class="toggle">
            <input type="checkbox" ${enabled ? 'checked' : ''}
              onchange="toggleAlias('${alias.id}',this.checked)">
            <span class="toggle-track"></span>
          </label>
        </div>
        <div class="alias-desc">${alias.desc}</div>
        ${enabled ? `
        <div style="margin-top:10px;">${configHtml}</div>
        <div class="alias-preview" id="alias-preview-${alias.id}">${escHtml(preview)}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="tip-box" style="margin-bottom:16px;">
      <span class="tip-box-icon">⚡</span>
      <span>Los aliases son <b>scripts avanzados</b> de CS 1.6. Permiten encadenar acciones, crear toggles y automatizar comportamientos complejos que no son posibles con un bind simple.</span>
    </div>
    <div class="alias-list" id="alias-list">${html}</div>`;
}

// ================================================================
// RENDER: Crosshair Preview (HUD module extra)
// ================================================================
function renderCrosshairPreview(state) {
  const bg = state.crosshairBg || 'dark';
  const maps = [
    { id: 'dark', label: '⬛ Oscuro' },
    { id: 'light', label: '⬜ Claro' },
    { id: 'dust2', label: '🏜️ Dust2' },
    { id: 'inferno', label: '🧱 Inferno' },
    { id: 'aztec', label: '🌿 Aztec' }
  ];
  
  const buttonsHtml = maps.map(m => `
    <button class="ch-bg-btn ${bg === m.id ? 'active' : ''}" 
      onclick="setCrosshairBg('${m.id}')">
      ${m.label}
    </button>
  `).join('');

  return `
    <div style="margin-bottom:16px; display:flex; flex-direction:column; align-items:center;">
      <div class="crosshair-preview-wrap" id="crosshair-preview-wrap" style="width:100%; max-width:400px; height:120px; overflow:hidden;">
        <canvas id="crosshair-canvas" width="300" height="120" style="width:100%; height:100%; border-radius:var(--r-md); display:block;"></canvas>
      </div>
      <div style="display:flex; align-items:center; justify-content:center; margin-top:8px; flex-wrap:wrap; gap:6px;">
        <span style="font-size:10px; color:var(--text-3); font-weight:600;">Fondo:</span>
        ${buttonsHtml}
      </div>
    </div>`;
}

// ================================================================
// HELPERS
// ================================================================
function abbreviateBind(cmd) {
  if (!cmd) return '';
  if (cmd.length <= 12) return cmd;
  // Show first command if chained
  const first = cmd.split(';')[0].trim();
  const parts = cmd.split(';');
  return parts.length > 1 ? first + '+' + (parts.length - 1) : first.substring(0, 12);
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
