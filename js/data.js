/* =====================================================================
   JS DATA — All CS 1.6 CVARs, Actions, Keyboard Layout, Presets
   ===================================================================== */

// ================================================================
// KEYBOARD LAYOUT
// ================================================================
const KEYBOARD_LAYOUT = [
  // Row 0: Escape + F keys
  [
    { label: 'Esc',   key: 'ESCAPE',    class: 'key-sm' },
    { label: '', key: '', class: 'key-spacer', spacer: true },
    { label: 'F1',  key: 'F1' }, { label: 'F2',  key: 'F2' },
    { label: 'F3',  key: 'F3' }, { label: 'F4',  key: 'F4' },
    { label: '', key: '', class: 'key-spacer', spacer: true },
    { label: 'F5',  key: 'F5' }, { label: 'F6',  key: 'F6' },
    { label: 'F7',  key: 'F7' }, { label: 'F8',  key: 'F8' },
    { label: '', key: '', class: 'key-spacer', spacer: true },
    { label: 'F9',  key: 'F9' }, { label: 'F10', key: 'F10' },
    { label: 'F11', key: 'F11'}, { label: 'F12', key: 'F12' },
  ],
  // Row 1: Numbers & Symbols
  [
    { label: 'º\nª',   key: 'GRAVE'  },
    { label: '1\n!', key: '1' }, { label: '2\n"', key: '2' }, { label: '3\n·', key: '3' }, { label: '4\n$', key: '4' },
    { label: '5\n%', key: '5' }, { label: '6\n&', key: '6' }, { label: '7\n/', key: '7' }, { label: '8\n(', key: '8' },
    { label: '9\n)', key: '9' }, { label: '0\n=', key: '0' }, { label: '\'\n?', key: 'MINUS' }, { label: '¡\n¿', key: 'EQUALS' },
    { label: '←', key: 'BACKSPACE', class: 'key-wider' },
  ],
  // Row 2: QWERTY
  [
    { label: 'Tab',  key: 'TAB',      class: 'key-wide'  },
    { label: 'Q',    key: 'q'        }, { label: 'W', key: 'w' }, { label: 'E', key: 'e' }, { label: 'R', key: 'r' },
    { label: 'T',    key: 't'        }, { label: 'Y', key: 'y' }, { label: 'U', key: 'u' }, { label: 'I', key: 'i' },
    { label: 'O',    key: 'o'        }, { label: 'P', key: 'p' },
    { label: '^\n[', key: 'LEFTBRACKET'  }, { label: '*\n]', key: 'RIGHTBRACKET' },
  ],
  // Row 3: ASDF & ISO Enter
  [
    { label: 'Bloq\nMayús', key: 'CAPSLOCK', class: 'key-wider' },
    { label: 'A',    key: 'a'        }, { label: 'S', key: 's' }, { label: 'D', key: 'd' }, { label: 'F', key: 'f' },
    { label: 'G',    key: 'g'        }, { label: 'H', key: 'h' }, { label: 'J', key: 'j' }, { label: 'K', key: 'k' },
    { label: 'L',    key: 'l'        }, { label: 'Ñ', key: 'SEMICOLON'}, { label: '´\n¨', key: 'APOSTROPHE' }, { label: 'ç\n}', key: 'BACKSLASH' },
    { label: 'Enter ↵', key: 'ENTER', class: 'key-iso-enter' },
  ],
  // Row 4: ZXCV
  [
    { label: '⇧ Shift', key: 'SHIFT',   class: 'key-wide' },
    { label: '<\n>',    key: '<'       },
    { label: 'Z',        key: 'z'       }, { label: 'X', key: 'x' }, { label: 'C', key: 'c' }, { label: 'V', key: 'v' },
    { label: 'B',        key: 'b'       }, { label: 'N', key: 'n' }, { label: 'M', key: 'm' },
    { label: ',\n;',    key: 'COMMA'   }, { label: '.\n:', key: 'PERIOD' }, { label: '-\n_', key: 'SLASH' },
    { label: '⇧ Shift', key: 'RSHIFT',  class: 'key-widest' },
  ],
  // Row 5: Bottom row
  [
    { label: 'Ctrl',  key: 'CTRL',  class: 'key-wide' },
    { label: 'Start', key: 'LWIN',  class: 'key-wide' },
    { label: 'Alt',   key: 'ALT',   class: 'key-wide' },
    { label: 'Space', key: 'SPACE', class: 'key-space' },
    { label: 'AltGr', key: 'RALT',  class: 'key-wide' },
    { label: 'Start', key: 'RWIN',  class: 'key-wide' },
    { label: '▤',     key: 'MENU',  class: 'key-wide' },
    { label: 'Ctrl',  key: 'RCTRL', class: 'key-wide' },
  ],
];

// Navigation keys (separate cluster matching the photo layout)
const NAV_KEYS = [
  [
    { label: 'Impr',  key: 'PRINTSCREEN', class: 'key-sm' },
    { label: 'Bloq',  key: 'SCROLLLOCK',  class: 'key-sm' },
    { label: 'Pausa', key: 'PAUSE',       class: 'key-sm' },
  ],
  [
    { label: 'Insert',key: 'INS',  class: 'key-sm' },
    { label: 'Inicio',key: 'HOME', class: 'key-sm' },
    { label: 'RePág', key: 'PGUP', class: 'key-sm' },
  ],
  [
    { label: 'Supr',  key: 'DEL',  class: 'key-sm' },
    { label: 'Fin',   key: 'END',  class: 'key-sm' },
    { label: 'AvPág', key: 'PGDN', class: 'key-sm' },
  ],
  [
    { spacer: true },
  ],
  [
    { spacer: true }, { label: '↑',   key: 'UPARROW', class: 'key-sm' }, { spacer: true },
  ],
  [
    { label: '←',   key: 'LEFTARROW', class: 'key-sm' }, { label: '↓', key: 'DOWNARROW', class: 'key-sm' }, { label: '→', key: 'RIGHTARROW', class: 'key-sm' },
  ],
];

// Numpad keys matching Spanish keyboard labels (flat array for CSS Grid)
const NUMPAD_KEYS = [
  { label: 'Bloq\nNum', key: 'NUMLOCK', class: 'key-sm' },
  { label: '/', key: 'KP_SLASH', class: 'key-sm' },
  { label: '*', key: 'KP_MULTIPLY', class: 'key-sm' },
  { label: '-', key: 'KP_MINUS', class: 'key-sm' },

  { label: '7\nInicio', key: 'KP_HOME', class: 'key-sm' },
  { label: '8\n↑', key: 'KP_UPARROW', class: 'key-sm' },
  { label: '9\nRePág', key: 'KP_PGUP', class: 'key-sm' },
  { label: '+', key: 'KP_PLUS', class: 'key-sm key-tall' },

  { label: '4\n←', key: 'KP_LEFTARROW', class: 'key-sm' },
  { label: '5', key: 'KP_5', class: 'key-sm' },
  { label: '6\n→', key: 'KP_RIGHTARROW', class: 'key-sm' },

  { label: '1\nFin', key: 'KP_END', class: 'key-sm' },
  { label: '2\n↓', key: 'KP_DOWNARROW', class: 'key-sm' },
  { label: '3\nAvPág', key: 'KP_PGDN', class: 'key-sm' },
  { label: 'Intro', key: 'KP_ENTER', class: 'key-sm key-tall' },

  { label: '0\nIns', key: 'KP_INS', class: 'key-wide-numpad' },
  { label: '.\nSupr', key: 'KP_DEL', class: 'key-sm' }
];

// Mouse keys
const MOUSE_KEYS = [
  { label: '🖱️ Click Izq',   key: 'MOUSE1',      icon: '🖱️' },
  { label: '🖱️ Click Der',   key: 'MOUSE2',      icon: '🖱️' },
  { label: '🖱️ Click Mid',   key: 'MOUSE3',      icon: '🖲️' },
  { label: '🖱️ Rueda ↓',    key: 'MWHEELDOWN',  icon: '⬇️' },
  { label: '🖱️ Rueda ↑',    key: 'MWHEELUP',    icon: '⬆️' },
  { label: '🖱️ Botón 4',    key: 'MOUSE4',      icon: '🖱️' },
  { label: '🖱️ Botón 5',    key: 'MOUSE5',      icon: '🖱️' },
];

// ================================================================
// ALL CS 1.6 BIND ACTIONS
// ================================================================
const BIND_ACTIONS = {
  movement: {
    label: '🏃 Movimiento',
    actions: [
      { cmd: '+forward',   label: 'Avanzar',           desc: 'Moverse hacia adelante' },
      { cmd: '+back',      label: 'Retroceder',        desc: 'Moverse hacia atrás' },
      { cmd: '+moveleft',  label: 'Izquierda (strafe)',desc: 'Desplazarse a la izquierda' },
      { cmd: '+moveright', label: 'Derecha (strafe)',  desc: 'Desplazarse a la derecha' },
      { cmd: '+jump',      label: 'Saltar',            desc: 'Salto' },
      { cmd: '+duck',      label: 'Agacharse',         desc: 'Ponerse en cuclillas' },
      { cmd: '+speed',     label: 'Caminar (silencio)',desc: 'Caminar despacio sin hacer ruido (shift)' },
      { cmd: '+use',       label: 'Usar / Plantar C4', desc: 'Interactuar con objetos, plantar o desactivar bomba' },
      { cmd: '+reload',    label: 'Recargar',          desc: 'Recargar el arma actual' },
    ]
  },
  attack: {
    label: '🔫 Disparo',
    actions: [
      { cmd: '+attack',    label: 'Disparar (primario)',  desc: 'Fuego principal del arma' },
      { cmd: '+attack2',   label: 'Disparar (secundario)',desc: 'Fuego secundario (zoom en AWP, modo silenciador, etc.)' },
    ]
  },
  slots: {
    label: '🗡️ Slots de Armas',
    actions: [
      { cmd: 'slot1',    label: 'Arma Primaria (Slot 1)',  desc: 'Cambiar a arma primaria' },
      { cmd: 'slot2',    label: 'Arma Secundaria (Slot 2)',desc: 'Cambiar a pistola' },
      { cmd: 'slot3',    label: 'Cuchillo (Slot 3)',       desc: 'Cambiar al cuchillo' },
      { cmd: 'slot4',    label: 'Granada HE (Slot 4)',     desc: 'Cambiar a granada explosiva' },
      { cmd: 'slot5',    label: 'Flash / Humo (Slot 5)',   desc: 'Cambiar a granadas de destello o humo' },
      { cmd: 'slot6',    label: 'Slot 6',                  desc: 'Slot 6 (C4, Defuser, etc.)' },
      { cmd: 'lastinv',  label: 'Última Arma Usada',       desc: 'Volver al arma utilizada anteriormente' },
      { cmd: 'invprev',  label: 'Arma Anterior',           desc: 'Ciclar armas hacia atrás' },
      { cmd: 'invnext',  label: 'Arma Siguiente',          desc: 'Ciclar armas hacia adelante' },
    ]
  },
  weapons: {
    label: '🏹 Comprar Armas',
    actions: [
      // Rifles
      { cmd: 'ak47',   label: 'AK-47',   desc: 'Comprar AK-47 (solo T)' },
      { cmd: 'm4a1',   label: 'M4A1',    desc: 'Comprar M4A1 (solo CT)' },
      { cmd: 'awp',    label: 'AWP',     desc: 'Comprar AWP (francotirador)' },
      { cmd: 'scout',  label: 'Scout',   desc: 'Comprar Scout (francotirador ligero)' },
      { cmd: 'aug',    label: 'AUG',     desc: 'Comprar AUG (solo CT)' },
      { cmd: 'sg552',  label: 'SG-552',  desc: 'Comprar SG-552 (solo T)' },
      { cmd: 'famas',  label: 'FAMAS',   desc: 'Comprar FAMAS (solo CT)' },
      { cmd: 'galil',  label: 'Galil',   desc: 'Comprar Galil (solo T)' },
      { cmd: 'sg550',  label: 'SG-550',  desc: 'Comprar SG-550 (solo CT)' },
      { cmd: 'g3sg1',  label: 'G3SG1',   desc: 'Comprar G3SG1 (solo T)' },
      // SMGs
      { cmd: 'mp5',    label: 'MP5',     desc: 'Comprar MP5' },
      { cmd: 'tmp',    label: 'TMP',     desc: 'Comprar TMP (solo CT)' },
      { cmd: 'mac10',  label: 'MAC-10',  desc: 'Comprar MAC-10 (solo T)' },
      { cmd: 'ump45',  label: 'UMP-45',  desc: 'Comprar UMP-45' },
      { cmd: 'p90',    label: 'P90',     desc: 'Comprar P90' },
      // Pistols
      { cmd: 'deagle', label: 'Deagle',  desc: 'Comprar Desert Eagle' },
      { cmd: 'usp',    label: 'USP',     desc: 'Comprar USP (solo CT)' },
      { cmd: 'glock',  label: 'Glock',   desc: 'Comprar Glock (solo T)' },
      { cmd: 'p228',   label: 'P228',    desc: 'Comprar P228' },
      { cmd: 'elite',  label: 'Elite',   desc: 'Comprar Dual Berettas' },
      { cmd: 'fiveseven', label: 'Five-Seven', desc: 'Comprar Five-Seven (solo CT)' },
      // Shotguns
      { cmd: 'm3',     label: 'M3',      desc: 'Comprar M3 (escopeta)' },
      { cmd: 'xm1014', label: 'XM1014', desc: 'Comprar XM1014 (escopeta automática)' },
      // MG
      { cmd: 'm249',   label: 'M249',    desc: 'Comprar M249 (ametralladora)' },
      // Equipment
      { cmd: 'vest',   label: 'Chaleco', desc: 'Comprar chaleco antibalas (Kevlar)' },
      { cmd: 'vesthelm', label: 'Chaleco+Casco', desc: 'Comprar chaleco y casco (Kevlar+Helmet)' },
      { cmd: 'hegren', label: 'Granada HE', desc: 'Comprar granada explosiva' },
      { cmd: 'flash',  label: 'Flash',   desc: 'Comprar granada de destello (flashbang)' },
      { cmd: 'sgren',  label: 'Humo',    desc: 'Comprar granada de humo (smoke)' },
      { cmd: 'defuser',label: 'Defuser', desc: 'Comprar kit de desactivación (solo CT)' },
      { cmd: 'nvgs',   label: 'Gafas Nocturnas', desc: 'Comprar gafas de visión nocturna' },
      { cmd: 'primammo', label: 'Munición Primaria', desc: 'Comprar munición para arma primaria' },
      { cmd: 'secammo', label: 'Munición Secundaria', desc: 'Comprar munición para pistola' },
    ]
  },
  hud: {
    label: '📊 HUD / Información',
    actions: [
      { cmd: '+showscores',  label: 'Marcador (tab)',    desc: 'Mostrar tabla de puntuación' },
      { cmd: 'snapshot',     label: 'Captura de Pantalla', desc: 'Tomar screenshot' },
      { cmd: 'toggleconsole',label: 'Consola',           desc: 'Abrir/cerrar la consola' },
      { cmd: 'messagemode',  label: 'Chat Global',       desc: 'Abrir chat para todos' },
      { cmd: 'messagemode2', label: 'Chat de Equipo',    desc: 'Abrir chat solo para tu equipo' },
      { cmd: '+voicerecord', label: 'Hablar por Micro',  desc: 'Activar micrófono para chat de voz' },
      { cmd: 'radio1',       label: 'Radio 1',           desc: 'Menú de radio (comandos de equipo)' },
      { cmd: 'radio2',       label: 'Radio 2',           desc: 'Menú de radio 2' },
      { cmd: 'radio3',       label: 'Radio 3',           desc: 'Menú de radio 3' },
      { cmd: 'chooseteam',   label: 'Elegir Equipo',     desc: 'Abrir menú de selección de equipo' },
    ]
  },
  view: {
    label: '👁️ Vista',
    actions: [
      { cmd: 'cl_righthand 1',  label: 'Mano Derecha',   desc: 'Poner arma en mano derecha' },
      { cmd: 'cl_righthand 0',  label: 'Mano Izquierda', desc: 'Poner arma en mano izquierda' },
      { cmd: 'net_graph 3',     label: 'Net Graph ON',   desc: 'Mostrar gráfico de red (ping, loss, choke)' },
      { cmd: 'net_graph 0',     label: 'Net Graph OFF',  desc: 'Ocultar gráfico de red' },
    ]
  },
  misc: {
    label: '⚙️ Misceláneos',
    actions: [
      { cmd: 'kill',      label: 'Suicidarse',   desc: 'Morir inmediatamente (comando de consola)' },
      { cmd: 'clear',     label: 'Limpiar Consola', desc: 'Borrar el contenido de la consola' },
      { cmd: 'disconnect',label: 'Desconectarse', desc: 'Salir del servidor actual' },
      { cmd: 'quit',      label: 'Salir del Juego', desc: 'Cerrar Counter-Strike 1.6' },
    ]
  },
};

// ================================================================
// ALL CS 1.6 CVARS — Organized by module
// ================================================================
const MODULES_CONFIG = [
  // ───────────────────────────────────────────────────────────────
  {
    id: 'identity',
    label: 'Identidad',
    icon: '👤',
    color: '#a78bfa',
    subtitle: 'Nombre, equipo y contraseña',
    sections: [
      {
        title: 'Identidad del Jugador',
        vars: [
          {
            cvar: 'name',
            label: 'Nick / Nombre',
            type: 'text',
            default: 'Player',
            placeholder: 'Tu nickname',
            desc: 'Tu nombre visible en el servidor. Puede incluir caracteres especiales y colores con ^1-^9 (en algunos servidores).',
            steam: true, nosteam: true,
          },
          {
            cvar: 'team',
            label: 'Tag del Equipo',
            type: 'text',
            default: '',
            placeholder: '[TEAM]',
            desc: 'Tag o prefijo del clan/equipo que aparece antes de tu nick en algunos mods.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'setinfo _pw',
            label: 'Contraseña de Servidor',
            type: 'text',
            default: '',
            placeholder: 'password123',
            desc: 'Contraseña para conectarse a servidores privados. Útil en No-Steam para servidores con whitelist. <span class="warn">¡Cuidado con compartir tu CFG si usás esto!</span>',
            steam: true, nosteam: true,
          },
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'network',
    label: 'Red / Rates',
    icon: '🌐',
    color: '#60a5fa',
    subtitle: 'Optimización de conexión al servidor',
    sections: [
      {
        title: 'Configuración de Red',
        vars: [
          // --- CS 1.6 Network ---
          {
            cvar: 'rate',
            label: 'Rate (Velocidad de datos) - CS 1.6',
            type: 'range',
            default: 25000,
            min: 2500, max: 100000, step: 500,
            presets: [
              { label: 'ADSL', value: 9999 },
              { label: 'LAN / Fibra', value: 25000 },
              { label: '100K (AWP)', value: 100000 },
            ],
            desc: 'Velocidad máxima de transferencia para GoldSrc. LAN/Fibra recomendado: 25000.',
            games: ['cs15', 'cs16', 'cscz'],
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_cmdrate',
            label: 'Comandos por Segundo (cmdrate) - GoldSrc',
            type: 'range',
            default: 101,
            min: 30, max: 102, step: 1,
            desc: 'Cantidad de comandos enviados por segundo. Recomendado: 101.',
            games: ['cs15', 'cs16', 'cscz'],
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_updaterate',
            label: 'Actualizaciones del Servidor - GoldSrc',
            type: 'range',
            default: 101,
            min: 30, max: 102, step: 1,
            desc: 'Paquetes recibidos del servidor por segundo. Recomendado: 101.',
            games: ['cs15', 'cs16', 'cscz'],
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_cmdbackup',
            label: 'Backup de Comandos',
            type: 'range',
            default: 2,
            min: 1, max: 10, step: 1,
            desc: 'Comandos de respaldo enviados. Subir a 6 mejora el registro con pérdida de paquetes.',
            games: ['cs15', 'cs16', 'cscz'],
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_dlmax',
            label: 'Descarga Máxima (KB/s)',
            type: 'range',
            default: 1024,
            min: 0, max: 1024, step: 64,
            desc: 'Velocidad máxima de descarga de modelos/sonidos del servidor.',
            games: ['cs15', 'cs16', 'cscz'],
            steam: true, nosteam: true,
          },
          {
            cvar: 'ex_interp',
            label: 'Interpolación (ex_interp)',
            type: 'number',
            default: '0.01',
            placeholder: '0.01',
            desc: 'Interpolación de entidades. 0.01 es el valor más bajo y recomendado para LAN/Fibra.',
            games: ['cs15', 'cs16', 'cscz'],
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_lc',
            label: 'Compensación de Lag (cl_lc)',
            type: 'toggle',
            default: 1,
            desc: 'Compensación de lag del lado del cliente. Siempre en 1 para juego competitivo.',
            games: ['cs15', 'cs16', 'cscz'],
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_lw',
            label: 'Predicción de Armas (cl_lw)',
            type: 'toggle',
            default: 1,
            desc: 'Predicción de disparos del lado del cliente. Siempre en 1.',
            games: ['cs15', 'cs16', 'cscz'],
            steam: true, nosteam: true,
          },

          // --- CS:Source Network ---
          {
            cvar: 'rate',
            label: 'Rate (Velocidad de datos) - CS:S',
            type: 'range',
            default: 100000,
            min: 10000, max: 1048576, step: 10000,
            desc: 'Velocidad máxima de transferencia para Source Engine. El estándar es 100000.',
            games: ['css'],
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_cmdrate',
            label: 'Comandos por Segundo (cmdrate) - CS:S',
            type: 'range',
            default: 66,
            min: 10, max: 100, step: 1,
            desc: 'Comandos enviados al servidor. El tickrate estándar de CS:S es 66.',
            games: ['css'],
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_updaterate',
            label: 'Actualizaciones del Servidor - CS:S',
            type: 'range',
            default: 66,
            min: 10, max: 100, step: 1,
            desc: 'Paquetes recibidos del servidor. Sincronizar con cmdrate (66).',
            games: ['css'],
            steam: true, nosteam: false,
          },

          // --- CS2 Network ---
          {
            cvar: 'rate',
            label: 'Rate (Velocidad de datos) - CS2',
            type: 'range',
            default: 786432,
            min: 196608, max: 786432, step: 65536,
            presets: [
              { label: 'Mínimo Competitivo', value: 196608 },
              { label: 'Estándar CS2 (Máximo)', value: 786432 }
            ],
            desc: 'Velocidad máxima de transferencia en CS2 (786432 = 6 Mbps, recomendado).',
            games: ['cs2'],
            steam: true, nosteam: false,
          },
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'video',
    label: 'Video / FPS',
    icon: '🖥️',
    color: '#34d399',
    subtitle: 'Rendimiento, FPS y visibilidad',
    sections: [
      {
        title: 'FPS y Rendimiento',
        vars: [
          {
            cvar: 'fps_max',
            label: 'FPS Máximo',
            type: 'range',
            default: 101,
            min: 0, max: 300, step: 1,
            presets: [
              { label: '60 Hz', value: 60 },
              { label: '100 Hz', value: 101 },
              { label: '144 Hz', value: 144 },
              { label: 'Sin límite', value: 0 },
            ],
            desc: 'Límite máximo de fotogramas por segundo. <span class="tip">101 es el valor mágico en CS 1.6: evita glitches de física y mantiene los bunny hops. Para 144Hz usar 145.</span> 0 = sin límite (puede causar bugs).',
            steam: true, nosteam: true,
          },
          {
            cvar: 'fps_modem',
            label: 'FPS Modem',
            type: 'range',
            default: 0,
            min: 0, max: 100, step: 1,
            desc: 'Límite de FPS cuando el juego detecta conexión tipo modem. 0 = desactivado. Usualmente en 0 para conexiones modernas.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'developer',
            label: 'Modo Desarrollador',
            type: 'toggle',
            default: 0,
            desc: 'Activa mensajes de depuración extra en consola. <span class="warn">Mantener en 0 para juego normal. Puede reducir performance.</span>',
            steam: true, nosteam: true,
          },
        ]
      },
      {
        title: 'Gráficos y Visibilidad',
        vars: [
          {
            cvar: 'brightness',
            label: 'Brillo',
            type: 'range',
            default: 2,
            min: 1, max: 3, step: 0.5,
            desc: 'Nivel de brillo del juego. Mayor = imagen más clara. Útil para mapas oscuros como cs_militia o de_cbble. <span class="tip">Valores entre 2 y 3 para mejor visibilidad.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gamma',
            label: 'Gamma (Corrección de Color)',
            type: 'range',
            default: 2.5,
            min: 1.8, max: 3, step: 0.1,
            desc: 'Corrección de gamma. Afecta la luminosidad general. Ajustar junto con el brillo del monitor.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_vsync',
            label: 'VSync',
            type: 'toggle',
            default: 0,
            desc: 'Sincronización vertical. <span class="warn">Siempre en 0 para gaming competitivo.</span> El VSync agrega input lag notable en CS 1.6.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_weather',
            label: 'Efectos Climáticos (Lluvia/Nieve)',
            type: 'toggle',
            default: 0,
            desc: 'Renderiza partículas de lluvia o nieve en mapas como de_aztec. <span class="tip">Desactivar para ganar FPS y reducir distracciones visuales.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_showfps',
            label: 'Mostrar FPS en Pantalla',
            type: 'select',
            options: [
              { value: '0', label: '0 — Oculto' },
              { value: '1', label: '1 — FPS Simple' },
              { value: '2', label: '2 — FPS Detallado' },
            ],
            default: '1',
            desc: 'Muestra un contador de FPS en la esquina. 0=nada, 1=solo FPS, 2=FPS + stats adicionales.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_corpsestay',
            label: 'Tiempo de Cadáveres (segundos)',
            type: 'range',
            default: 5,
            min: 0, max: 60, step: 1,
            desc: 'Segundos que permanecen los cadáveres en el suelo antes de desaparecer. 0 = desaparecen inmediatamente. Mayor = más información de dónde cayeron.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_shadows',
            label: 'Sombras de Jugadores',
            type: 'toggle',
            default: 1,
            desc: 'Sombras debajo de los modelos de jugadores. <span class="tip">Muy útil para anticipar enemigos al doblar esquinas. Activa siempre en juego competitivo.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'r_dynamic',
            label: 'Luces Dinámicas (Destello de Disparos)',
            type: 'toggle',
            default: 1,
            desc: 'Luces dinámicas generadas por disparos, explosiones y flashbangs reflejándose en paredes. <span class="tip">Desactivar da más FPS. Activar da más inmersión visual.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'fastsprites',
            label: 'Calidad del Humo',
            type: 'select',
            options: [
              { value: '0', label: '0 — Calidad Máxima (3D real)' },
              { value: '1', label: '1 — Calidad Media' },
              { value: '2', label: '2 — Calidad Baja (más FPS)' },
            ],
            default: '0',
            desc: 'Calidad de renderizado del humo (smoke grenade). 0=máxima calidad 3D, 2=sprites planos pixelados de muy baja calidad pero más FPS.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'mp_decals',
            label: 'Decals Máximos (mp_decals)',
            type: 'range',
            default: 300,
            min: 0, max: 300, step: 10,
            desc: 'Máximo de marcas en el mundo (impactos de bala, sangre, grafitis de spray). 0=ninguno. <span class="tip">300 para ver todos los impactos → esencial para spray control.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'r_decals',
            label: 'Decals del Cliente (r_decals)',
            type: 'range',
            default: 300,
            min: 0, max: 300, step: 10,
            desc: 'Cantidad máxima de decals renderizados por el cliente. Sincronizar con mp_decals.',
            steam: true, nosteam: true,
          },
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'graphics',
    label: 'Gráficos OpenGL',
    icon: '🎨',
    color: '#f59e0b',
    subtitle: 'Calidad de texturas y filtros GL',
    sections: [
      {
        title: 'Filtrado de Texturas',
        vars: [
          {
            cvar: 'gl_texturemode',
            label: 'Modo de Textura (Filtrado)',
            type: 'select',
            options: [
              { value: 'GL_NEAREST',               label: 'Nearest — Pixelado / Máximos FPS' },
              { value: 'GL_LINEAR',                label: 'Bilineal — Suave estándar' },
              { value: 'GL_LINEAR_MIPMAP_NEAREST',  label: 'Bilineal Mip — Equilibrado' },
              { value: 'GL_LINEAR_MIPMAP_LINEAR',   label: 'Trilineal — Máxima Calidad' },
              { value: 'GL_NEAREST_MIPMAP_NEAREST', label: 'Nearest Mip — Clásico / FPS' },
            ],
            default: 'GL_LINEAR_MIPMAP_LINEAR',
            desc: 'Algoritmo de filtrado para texturas. <span class="tip">GL_LINEAR_MIPMAP_LINEAR (Trilineal) da la mejor calidad visual. GL_NEAREST es el más rápido pero se ve pixelado.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_picmip',
            label: 'Resolución de Texturas (gl_picmip)',
            type: 'range',
            default: 0,
            min: 0, max: 4, step: 1,
            desc: 'Fuerza texturas de menor resolución. 0 = resolución máxima. 4 = muy baja resolución (blobby). <span class="tip">0 para máxima calidad. Algunos pro players usan 2-3 para mejor distinción de enemigos en texturas complejas.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_round_down',
            label: 'Round Down de Texturas',
            type: 'range',
            default: 3,
            min: 0, max: 6, step: 1,
            desc: 'Previene que el motor baje automáticamente la calidad de texturas. 0 = sin restricción. <span class="tip">Valor 3 equilibra calidad y uso de VRAM.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_max_size',
            label: 'Tamaño Máximo de Textura',
            type: 'select',
            options: [
              { value: '64',  label: '64 — Muy baja VRAM' },
              { value: '128', label: '128 — Baja' },
              { value: '256', label: '256 — Media' },
              { value: '512', label: '512 — Alta (recomendado)' },
            ],
            default: '512',
            desc: 'Límite de tamaño de texturas en VRAM. Mayor = mejor calidad de texturas grandes como mapas. <span class="tip">512 en GPUs modernas.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_ansio',
            label: 'Filtrado Anisotrópico',
            type: 'select',
            options: [
              { value: '0',  label: '0 — Desactivado' },
              { value: '2',  label: '2x' }, { value: '4', label: '4x' },
              { value: '8',  label: '8x' }, { value: '16', label: '16x — Máximo' },
            ],
            default: '0',
            desc: 'Filtrado anisotrópico para texturas vistas en ángulo. Mejora la nitidez en perspectiva. <span class="tip">Mínimo impacto en FPS en GPUs modernas. Usar 8x o 16x.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_ztrick',
            label: 'Z-Trick (Optimización de Profundidad)',
            type: 'toggle',
            default: 0,
            desc: 'Optimización de renderizado de profundidad. <span class="warn">Mantener en 0. En 1 puede causar parpadeos de texturas (z-fighting) en hardware moderno.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_polyoffset',
            label: 'Polygon Offset',
            type: 'number',
            default: '0.1',
            desc: 'Offset para texturas planas y decals sobre superficies. Valores entre 0.1-4.0. Afecta cómo se renderizan los decals sobre superficies.',
            steam: true, nosteam: true,
          },
        ]
      },
      {
        title: 'Modelos de Jugadores',
        vars: [
          {
            cvar: 'cl_himodels',
            label: 'Modelos de Alta Calidad',
            type: 'toggle',
            default: 1,
            desc: 'Activa los modelos de jugador en alta definición (HI-DEF). <span class="tip">Activar para la mejor apariencia visual de los personajes.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_minmodels',
            label: 'Modelos Mínimos (Forzar un solo modelo)',
            type: 'toggle',
            default: 0,
            desc: 'Fuerza todos los jugadores a usar el mismo modelo. Útil para identificar equipos más fácilmente y ganar FPS. <span class="tip">1 = todos usan el mismo skin definido en cl_min_ct / cl_min_t.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_min_ct',
            label: 'Modelo CT (con minmodels)',
            type: 'select',
            options: [
              { value: '1',  label: '1 — SEAL Team 6' },
              { value: '2',  label: '2 — GIGN' },
              { value: '3',  label: '3 — SAS' },
              { value: '4',  label: '4 — GSG-9' },
              { value: '10', label: '10 — Spetsnaz' },
            ],
            default: '4',
            desc: 'Modelo de jugador CT usado cuando cl_minmodels está activado. Solo tiene efecto si cl_minmodels = 1.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_min_t',
            label: 'Modelo T (con minmodels)',
            type: 'select',
            options: [
              { value: '1',  label: '1 — Leet Krew' },
              { value: '3',  label: '3 — Arctic Avenger' },
              { value: '4',  label: '4 — Guerrilla Warfare' },
              { value: '8',  label: '8 — Phoenix Connexion' },
              { value: '11', label: '11 — Militia' },
            ],
            default: '4',
            desc: 'Modelo de jugador T usado cuando cl_minmodels está activado.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_playermip',
            label: 'Detalle de Skins de Jugadores',
            type: 'range',
            default: 0,
            min: 0, max: 3, step: 1,
            desc: 'Nivel de detalle de las texturas de los modelos de jugadores. 0 = máximo detalle. <span class="tip">Mantener en 0 para ver claramente a los enemigos.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'r_mmx',
            label: 'Optimización MMX',
            type: 'toggle',
            default: 1,
            desc: 'Usa instrucciones MMX del procesador para optimizar el renderizado de texturas de modelos. Activar en hardware que lo soporte (prácticamente cualquier CPU moderno).',
            steam: true, nosteam: true,
          },
          {
            cvar: 'r_detailtextures',
            label: 'Texturas de Detalle',
            type: 'toggle',
            default: 1,
            desc: 'Renderiza una capa adicional de texturas de detalle sobre las superficies. Da más profundidad visual a pisos y paredes.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'gl_palette_tex',
            label: 'Paleta de Texturas',
            type: 'toggle',
            default: 1,
            desc: 'Optimiza el uso de paletas de colores para texturas. Puede mejorar la nitidez en algunas configuraciones.',
            steam: true, nosteam: true,
          },
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'mouse',
    label: 'Mouse / Aim',
    icon: '🖱️',
    color: '#f43f5e',
    subtitle: 'Sensibilidad, raw input y eje',
    sections: [
      {
        title: 'Configuración del Mouse',
        vars: [
          {
            cvar: 'sensitivity',
            label: 'Sensibilidad',
            type: 'range',
            default: 2.5,
            min: 0.1, max: 20, step: 0.1,
            desc: 'Sensibilidad del mouse en el juego. <span class="tip">Profesionales usan entre 1.5 y 4. Una sensibilidad más baja = más precisión con movimientos grandes de muñeca.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'm_rawinput',
            label: 'Raw Input (Directo del Mouse)',
            type: 'toggle',
            default: 1,
            steamOnly: true,
            desc: 'Recibe el input directamente del mouse sin pasar por el sistema operativo. <span class="tip">SIEMPRE activar en Steam: elimina la aceleración del mouse del SO y da máxima precisión.</span>',
            steam: true, nosteam: false,
          },
          {
            cvar: 'm_filter',
            label: 'Suavizado del Mouse (m_filter)',
            type: 'toggle',
            default: 0,
            desc: 'Promedia el movimiento del mouse entre frames para suavizarlo. <span class="warn">Mantener en 0 para gaming competitivo. El suavizado agrega micro-latencia e imprecisión.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'm_pitch',
            label: 'Velocidad Eje Vertical (m_pitch)',
            type: 'number',
            default: '0.022',
            placeholder: '0.022',
            desc: 'Factor de velocidad del movimiento vertical del mouse. El estándar de Quake/CS es 0.022. <span class="tip">No cambiar a menos que inviertas el eje Y. Para invertir Y: usar valor negativo.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'm_yaw',
            label: 'Velocidad Eje Horizontal (m_yaw)',
            type: 'number',
            default: '0.022',
            placeholder: '0.022',
            desc: 'Factor de velocidad del movimiento horizontal del mouse. Estándar: 0.022. No cambiar para mantener aspecto circular del aim.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'm_forward',
            label: 'Factor Forward (m_forward)',
            type: 'number',
            default: '0',
            placeholder: '0',
            desc: 'Factor de aceleración hacia adelante por movimiento del mouse. Mantener en 0 para desactivar este componente de movimiento.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'm_side',
            label: 'Factor Lateral (m_side)',
            type: 'number',
            default: '0',
            placeholder: '0',
            desc: 'Factor de aceleración lateral por movimiento del mouse. Mantener en 0.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'zoom_sensitivity_ratio',
            label: 'Sensibilidad en Zoom (AWP)',
            type: 'range',
            default: 1.2,
            min: 0.5, max: 3.0, step: 0.05,
            desc: 'Multiplicador de sensibilidad al hacer zoom con el AWP u otras miras. <span class="tip">1.0 = misma sensibilidad que sin zoom. Muchos AWPers prefieren 1.0-1.5 para mantener el muscle memory.</span>',
            steam: true, nosteam: true,
          },
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'keybinds',
    label: 'Keybinds',
    icon: '⌨️',
    color: '#00ff88',
    subtitle: 'Asignar acciones a cada tecla',
    special: 'keyboard',
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'buymenu',
    label: 'Compra Rápida',
    icon: '💰',
    color: '#fbbf24',
    subtitle: 'Bind de compra de armas y equipo',
    special: 'buymenu',
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'audio',
    label: 'Audio',
    icon: '🔊',
    color: '#8b5cf6',
    subtitle: 'Volumen, voz y efectos de sonido',
    sections: [
      {
        title: 'Volumen',
        vars: [
          {
            cvar: 'volume',
            label: 'Volumen Maestro',
            type: 'range',
            default: 0.4,
            min: 0, max: 1, step: 0.05,
            desc: 'Volumen general del juego. 0 = silencio, 1.0 = máximo. <span class="tip">0.3-0.5 es recomendado para escuchar pasos claramente sin que sea agresivo.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'bgmvolume',
            label: 'Volumen Música de Fondo',
            type: 'range',
            default: 0,
            min: 0, max: 1, step: 0.05,
            desc: 'Volumen de la música de fondo del menú y mapas especiales. 0 = desactivado (recomendado para no distraerse).',
            steam: true, nosteam: true,
          },
          {
            cvar: 'mp3volume',
            label: 'Volumen MP3',
            type: 'range',
            default: 0,
            min: 0, max: 1, step: 0.05,
            desc: 'Volumen de la música MP3 del juego (intros, menú). 0 = silencio.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'mp3fadeout',
            label: 'Fade Out MP3',
            type: 'range',
            default: 0,
            min: 0, max: 5, step: 0.5,
            desc: 'Tiempo de desvanecimiento de la música MP3 al finalizar. 0 = desactivado.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_tones',
            label: 'Tonos de Interfaz',
            type: 'toggle',
            default: 0,
            desc: 'Sonidos de UI secundarios. 0 = desactivados. No afecta los sonidos del juego.',
            steam: true, nosteam: true,
          },
        ]
      },
      {
        title: 'Chat de Voz',
        vars: [
          {
            cvar: 'voice_enable',
            label: 'Chat de Voz (voice_enable)',
            type: 'toggle',
            default: 0,
            desc: 'Activa el sistema de chat de voz. 0 = completamente desactivado. <span class="tip">Desactivar puede reducir distracciones y mejorar el enfoque en juego.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'voice_modenable',
            label: 'Voz en Mods de Servidor',
            type: 'toggle',
            default: 0,
            desc: 'Permite la voz en mods especiales de servidor. 0 = desactivado.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'voice_scale',
            label: 'Volumen de Voz Recibida',
            type: 'range',
            default: 0,
            min: 0, max: 1, step: 0.05,
            desc: 'Volumen de la voz de otros jugadores. 0 = silencio total. 1.0 = máximo.',
            steam: true, nosteam: true,
          },
        ]
      },
      {
        title: 'Efectos de Sala (Reverb)',
        vars: [
          {
            cvar: 'room_type',
            label: 'Tipo de Sala / Eco',
            type: 'select',
            options: [
              { value: '0', label: '0 — Sin eco (silencio limpio)' },
              { value: '1', label: '1 — Habitación pequeña' },
              { value: '2', label: '2 — Habitación mediana' },
              { value: '3', label: '3 — Habitación grande' },
              { value: '4', label: '4 — Hall/Pasillo' },
              { value: '8', label: '8 — Piedra/Cueva' },
              { value: '16', label: '16 — Exterior/Cielo abierto' },
            ],
            default: '0',
            desc: 'Tipo de efecto de reverberación del sonido. <span class="tip">0 = sin eco para escuchar los pasos más claramente. El eco puede enmascarar direcciones de sonido.</span>',
            steam: true, nosteam: true,
          },
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'hud',
    label: 'HUD / Mira',
    icon: '🎯',
    color: '#ec4899',
    subtitle: 'Crosshair, radar, HUD y mira',
    special: 'crosshair',
    sections: [
      {
        title: 'Crosshair (Mira)',
        games: ['cs15', 'cs16', 'cscz', 'css'],
        vars: [
          {
            cvar: 'cl_crosshair_size',
            label: 'Tamaño de la Mira',
            type: 'select',
            options: [
              { value: 'auto',   label: 'Auto — Variable según arma' },
              { value: 'small',  label: 'Pequeña' },
              { value: 'medium', label: 'Mediana' },
              { value: 'large',  label: 'Grande' },
            ],
            default: 'small',
            desc: 'Tamaño de la cruz de la mira. <span class="tip">Small es lo más común en jugadores competitivos: menos obstaculiza la visión del target.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_crosshair_color',
            label: 'Color de la Mira',
            type: 'crosshair_color',
            default: '255 255 255',
            presets: [
              { label: 'Blanco',     value: '255 255 255' },
              { label: 'Verde',      value: '0 255 0' },
              { label: 'Cyan',       value: '0 255 255' },
              { label: 'Amarillo',   value: '255 255 0' },
              { label: 'Rojo',       value: '255 0 0' },
              { label: 'Rosa',       value: '255 0 200' },
            ],
            desc: 'Color de la mira en formato RGB (rojo verde azul, 0-255 cada valor). Elegí un color que contraste bien con los mapas.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_dynamiccrosshair',
            label: 'Mira Dinámica',
            type: 'toggle',
            default: 0,
            desc: 'La mira se expande cuando te movés o disparás para indicar la dispersión. <span class="warn">Desactivar para tener mira estática: la expansión dinámica puede confundir el aim.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_crosshair_translucent',
            label: 'Mira Translúcida',
            type: 'toggle',
            default: 0,
            desc: 'Hace que la mira sea semitransparente. <span class="tip">0 = sólida. La mira sólida es más visible en fondos complejos.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'crosshair',
            label: 'Punto Rojo al Hacer Zoom (AWP)',
            type: 'toggle',
            default: 0,
            desc: 'Muestra un punto central en la mira al hacer zoom con el AWP. <span class="tip">Útil para quick-scope preciso. Activar si usás AWP frecuentemente.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'cl_observercrosshair',
            label: 'Mira al Observar (Spectate)',
            type: 'toggle',
            default: 1,
            desc: 'Muestra la mira cuando estás en modo observador/spectate.',
            steam: true, nosteam: true,
          },
        ]
      },
      {
        title: 'Crosshair en CS2 (Miras Modernas)',
        games: ['cs2'],
        vars: [
          {
            cvar: 'cl_crosshairsize',
            label: 'Tamaño de la Mira',
            type: 'range',
            default: 2,
            min: 0, max: 10, step: 0.5,
            desc: 'Longitud de las líneas de la mira.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshairthickness',
            label: 'Grosor de la Mira',
            type: 'range',
            default: 1,
            min: 0.1, max: 6, step: 0.1,
            desc: 'Espesor/grosor de las líneas de la mira.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshairgap',
            label: 'Abertura (Gap)',
            type: 'range',
            default: -1,
            min: -10, max: 10, step: 0.5,
            desc: 'Distancia entre las líneas de la mira.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshaircolor',
            label: 'Estilo de Color',
            type: 'select',
            options: [
              { value: '1', label: '1 — Verde' },
              { value: '2', label: '2 — Amarillo' },
              { value: '3', label: '3 — Azul' },
              { value: '4', label: '4 — Cyan' },
              { value: '5', label: '5 — Custom (RGB)' },
            ],
            default: '5',
            desc: 'Color predefinido de la mira. "Custom" usa los sliders RGB de abajo.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshaircolor_r',
            label: 'Canal Rojo (Custom)',
            type: 'range',
            default: 255,
            min: 0, max: 255, step: 5,
            desc: 'Cantidad de color rojo en la mira.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshaircolor_g',
            label: 'Canal Verde (Custom)',
            type: 'range',
            default: 255,
            min: 0, max: 255, step: 5,
            desc: 'Cantidad de color verde en la mira.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshaircolor_b',
            label: 'Canal Azul (Custom)',
            type: 'range',
            default: 255,
            min: 0, max: 255, step: 5,
            desc: 'Cantidad de color azul en la mira.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshairusealpha',
            label: 'Usar Opacidad (Alpha)',
            type: 'toggle',
            default: 1,
            desc: 'Activa la transparencia personalizada de la mira.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshairalpha',
            label: 'Opacidad (Alpha)',
            type: 'range',
            default: 200,
            min: 0, max: 255, step: 5,
            desc: 'Transparencia de la mira. 0 = invisible, 255 = completamente sólida.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshairdot',
            label: 'Punto Central (Dot)',
            type: 'toggle',
            default: 0,
            desc: 'Dibuja un punto en el centro de la mira.',
            steam: true, nosteam: false,
          },
          {
            cvar: 'cl_crosshair_drawoutline',
            label: 'Borde Negro (Outline)',
            type: 'toggle',
            default: 1,
            desc: 'Añade un borde negro alrededor de la mira para aumentar el contraste en fondos claros.',
            steam: true, nosteam: false,
          },
        ]
      },
      {
        title: 'HUD y Radar',
        vars: [
          {
            cvar: 'cl_radartype',
            label: 'Tipo de Radar',
            type: 'select',
            options: [
              { value: '0', label: '0 — Radar Translúcido' },
              { value: '1', label: '1 — Radar Sólido' },
            ],
            default: '1',
            desc: 'Tipo visual del radar del mapa. <span class="tip">Sólido (1) tiene máxima visibilidad y contraste — los enemigos y compañeros se ven mucho más claramente.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'hud_fastswitch',
            label: 'Cambio Rápido de Armas',
            type: 'toggle',
            default: 1,
            desc: 'Cambia el arma inmediatamente sin pasar por el menú de selección. <span class="tip">Siempre en 1 para juego competitivo: el menú de selección tarda demasiado.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'hud_centerid',
            label: 'ID de Jugador Centrado',
            type: 'toggle',
            default: 1,
            desc: 'Muestra el nombre del jugador al que apuntás en el centro-inferior de la pantalla (en lugar del costado). Más visible y cómodo.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'con_color',
            label: 'Color de Texto de Consola (RGB)',
            type: 'text',
            default: '255 255 255',
            placeholder: '255 255 255',
            desc: 'Color del texto en la consola del juego. Formato: R G B (0-255 cada uno). Por defecto blanco.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'net_graph',
            label: 'Gráfico de Red (net_graph)',
            type: 'select',
            options: [
              { value: '0', label: '0 — Oculto' },
              { value: '1', label: '1 — Básico (FPS, Ping)' },
              { value: '2', label: '2 — Medio' },
              { value: '3', label: '3 — Completo (FPS, Ping, Choke, Loss)' },
            ],
            default: '0',
            desc: 'Muestra estadísticas de red y FPS en pantalla. <span class="tip">Nivel 3 muestra toda la información: FPS, ping, choke (pérdida de comandos) y loss (pérdida de paquetes).</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'net_graphpos',
            label: 'Posición del Net Graph',
            type: 'select',
            options: [
              { value: '1', label: '1 — Derecha' },
              { value: '2', label: '2 — Centro' },
              { value: '3', label: '3 — Izquierda' },
            ],
            default: '1',
            desc: 'Posición horizontal del gráfico de red en la pantalla.',
            steam: true, nosteam: true,
          },
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'misc',
    label: 'Misceláneos',
    icon: '⚙️',
    color: '#6b7280',
    subtitle: 'Opciones varias del juego',
    sections: [
      {
        title: 'Configuración General',
        vars: [
          {
            cvar: '_cl_autowepswitch',
            label: 'Cambio Automático de Arma',
            type: 'toggle',
            default: 0,
            desc: 'Cambia automáticamente al arma recogida. <span class="warn">Desactivar (0) en juego competitivo: jamás querés que el juego te cambie el arma en medio de un combate.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'mp_startmoney',
            label: 'Dinero Inicial (partida local)',
            type: 'select',
            options: [
              { value: '800',   label: '$800 — Estándar competitivo' },
              { value: '1000',  label: '$1000' },
              { value: '2000',  label: '$2000' },
              { value: '4000',  label: '$4000' },
              { value: '8000',  label: '$8000 — Pistol Full Buy' },
              { value: '16000', label: '$16000 — Máximo' },
            ],
            default: '800',
            desc: 'Dinero inicial de cada jugador al comienzo de la partida. Solo tiene efecto en servidores donde tenés control de servidor o en partida local. El estándar competitivo es $800.',
            steam: true, nosteam: true,
          },
          {
            cvar: 'mp_consistency',
            label: 'Consistencia de Archivos (mp_consistency)',
            type: 'toggle',
            default: 1,
            desc: 'Verifica que los archivos del cliente coincidan con el servidor (anti-cheat básico). 1 = activado. <span class="warn">Algunos servidores requieren esto activado para conectarse.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'mp_chattime',
            label: 'Tiempo de Chat al Final de Ronda',
            type: 'range',
            default: 0,
            min: 0, max: 30, step: 1,
            desc: 'Segundos disponibles para chatear al finalizar la ronda. 0 = desactivado (pasa rápido a la siguiente ronda).',
            steam: true, nosteam: true,
          },
        ]
      },
      {
        title: 'Hardware y CPU',
        vars: [
          {
            cvar: 'ati_npatch',
            label: 'ATI N-Patch',
            type: 'toggle',
            default: 0,
            desc: 'Tecnología de suavizado de geometría de ATI. <span class="warn">Mantener en 0. Esta función es obsoleta y puede causar bugs visuales en hardware moderno.</span>',
            steam: true, nosteam: true,
          },
          {
            cvar: 'ati_subdiv',
            label: 'ATI Subdivisión',
            type: 'toggle',
            default: 0,
            desc: 'Subdivisión de polígonos de ATI. Mantener en 0 en hardware moderno.',
            steam: true, nosteam: true,
          },
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────
  {
    id: 'aliases',
    label: 'Aliases Avanzados',
    icon: '⚡',
    color: '#0affef',
    subtitle: 'Scripts y automatizaciones de CS 1.6',
    special: 'aliases',
  },
];

// ================================================================
// BUY MENU ITEMS
// ================================================================
const BUY_ITEMS = {
  pistols: {
    label: '🔫 Pistolas',
    items: [
      { cmd: 'glock',    label: 'Glock',   icon: '🔫', desc: 'Solo T. Pistola inicial T.' },
      { cmd: 'usp',      label: 'USP',     icon: '🔫', desc: 'Solo CT. Pistola inicial CT.' },
      { cmd: 'p228',     label: 'P228',    icon: '🔫', desc: '$600. Ambos equipos.' },
      { cmd: 'deagle',   label: 'Deagle',  icon: '🔫', desc: '$650. El más potente.' },
      { cmd: 'elite',    label: 'Dual',    icon: '🔫', desc: '$800. Dual Beretta (solo T).' },
      { cmd: 'fiveseven',label: 'FN 57',   icon: '🔫', desc: '$750. Solo CT.' },
    ]
  },
  smgs: {
    label: '💨 SMGs',
    items: [
      { cmd: 'mac10',  label: 'MAC-10', icon: '🔫', desc: '$1400. Solo T.' },
      { cmd: 'tmp',    label: 'TMP',    icon: '🔫', desc: '$1250. Solo CT.' },
      { cmd: 'mp5',    label: 'MP5',    icon: '🔫', desc: '$1500. Ambos.' },
      { cmd: 'ump45',  label: 'UMP-45', icon: '🔫', desc: '$1700. Ambos.' },
      { cmd: 'p90',    label: 'P90',    icon: '🔫', desc: '$2350. Ambos.' },
    ]
  },
  rifles: {
    label: '🎯 Rifles',
    items: [
      { cmd: 'galil',  label: 'Galil',  icon: '🎯', desc: '$2000. Solo T.' },
      { cmd: 'famas',  label: 'FAMAS',  icon: '🎯', desc: '$2250. Solo CT.' },
      { cmd: 'ak47',   label: 'AK-47',  icon: '🎯', desc: '$2500. Solo T.' },
      { cmd: 'm4a1',   label: 'M4A1',   icon: '🎯', desc: '$3100. Solo CT.' },
      { cmd: 'sg552',  label: 'SG-552', icon: '🎯', desc: '$3500. Solo T (zoom).' },
      { cmd: 'aug',    label: 'AUG',    icon: '🎯', desc: '$3500. Solo CT (zoom).' },
    ]
  },
  snipers: {
    label: '🔭 Snipers',
    items: [
      { cmd: 'scout',  label: 'Scout',  icon: '🔭', desc: '$2750. Ambos. Ligero.' },
      { cmd: 'awp',    label: 'AWP',    icon: '🔭', desc: '$4750. El dios de snipers.' },
      { cmd: 'sg550',  label: 'SG-550', icon: '🔭', desc: '$4200. Solo CT. Auto.' },
      { cmd: 'g3sg1',  label: 'G3SG1',  icon: '🔭', desc: '$5000. Solo T. Auto.' },
    ]
  },
  heavy: {
    label: '💥 Pesadas',
    items: [
      { cmd: 'm3',     label: 'M3',     icon: '💥', desc: '$1700. Escopeta pump.' },
      { cmd: 'xm1014', label: 'XM1014', icon: '💥', desc: '$3000. Escopeta auto.' },
      { cmd: 'm249',   label: 'M249',   icon: '💥', desc: '$5750. Ametralladora.' },
    ]
  },
  equipment: {
    label: '🛡️ Equipo',
    items: [
      { cmd: 'vest',    label: 'Kevlar',   icon: '🛡️', desc: '$650. Chaleco.' },
      { cmd: 'vesthelm',label: 'K+Casco',  icon: '⛑️', desc: '$1000. Chaleco + Casco.' },
      { cmd: 'hegren',  label: 'HE',       icon: '💣', desc: '$300. Granada explosiva.' },
      { cmd: 'flash',   label: 'Flash',    icon: '💥', desc: '$200. Flashbang.' },
      { cmd: 'sgren',   label: 'Humo',     icon: '💨', desc: '$300. Smoke grenade.' },
      { cmd: 'defuser', label: 'Defuser',  icon: '🔧', desc: '$200. Kit desactivación. Solo CT.' },
      { cmd: 'nvgs',    label: 'Gafas NV', icon: '👓', desc: '$1250. Visión nocturna.' },
    ]
  },
  ammo: {
    label: '🎱 Munición',
    items: [
      { cmd: 'primammo', label: 'Ammo P', icon: '🎱', desc: 'Munición primaria.' },
      { cmd: 'secammo',  label: 'Ammo S', icon: '🎯', desc: 'Munición secundaria.' },
    ]
  },
};

// ================================================================
// PREDEFINED ALIASES
// ================================================================
const PREDEFINED_ALIASES = [
  {
    id: 'fps_dynamic',
    label: 'Control Dinámico de FPS',
    icon: '📈',
    desc: 'Permite subir y bajar el límite de FPS de 1 en 1 durante el juego usando dos teclas. Útil para ajustar FPS en tiempo real sin abrir la consola.',
    keyDown: 'F7',
    keyUp: 'F8',
    minFps: 30,
    maxFps: 101,
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      const lines = [];
      lines.push(`alias "fps_down" "fps_step_${alias.minFps}"`);
      lines.push(`alias "fps_up" "fps_step_${alias.minFps + 1}"`);
      for (let f = alias.minFps; f <= alias.maxFps; f++) {
        const prev = f <= alias.minFps ? alias.minFps : f - 1;
        const next = f >= alias.maxFps ? alias.maxFps : f + 1;
        lines.push(`alias "fps_step_${f}" "fps_max ${f}; fps_modem ${f}; echo --- FPS: ${f} ---; alias fps_down fps_step_${prev}; alias fps_up fps_step_${next}"`);
      }
      lines.push(`bind "${alias.keyDown}" "fps_down"`);
      lines.push(`bind "${alias.keyUp}" "fps_up"`);
      return lines;
    }
  },
  {
    id: 'netgraph_tab',
    label: 'Net Graph al Presionar TAB',
    icon: '📊',
    desc: 'Muestra el net_graph (ping, FPS, choke) automáticamente cuando abrís el scoreboard con TAB, y lo oculta al soltar.',
    bindKey: 'TAB',
    graphLevel: '3',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `alias "+showscores_graph" "+showscores; net_graph ${alias.graphLevel}"`,
        `alias "-showscores_graph" "-showscores; net_graph 0"`,
        `bind "${alias.bindKey}" "+showscores_graph"`,
      ];
    }
  },
  {
    id: 'chat_toggle',
    label: 'Toggle de Chat Visible/Oculto',
    icon: '💬',
    desc: 'Alterna la visibilidad del chat en pantalla con una tecla. Útil para limpiar la vista durante combate sin perder el chat.',
    bindKey: 'F9',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `alias "togglechat" "chat_off"`,
        `alias "chat_off" "hud_saytext 0; echo --- CHAT OCULTO ---; alias togglechat chat_on"`,
        `alias "chat_on" "hud_saytext 1; echo --- CHAT VISIBLE ---; alias togglechat chat_off"`,
        `bind "${alias.bindKey}" "togglechat"`,
      ];
    }
  },
  {
    id: 'mute_toggle',
    label: 'Toggle Mute/Unmute de Audio',
    icon: '🔇',
    desc: 'Mutea y desmutea todo el audio del juego con dos teclas separadas.',
    keyMute:   'y',
    keyUnmute: 'u',
    volumeOn: '0.4',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `bind "${alias.keyMute}" "volume 0; echo --- SONIDO: MUTEAR ---"`,
        `bind "${alias.keyUnmute}" "volume ${alias.volumeOn}; echo --- SONIDO: ACTIVADO ---"`,
      ];
    }
  },
  {
    id: 'room_toggle',
    label: 'Toggle de Eco de Sala',
    icon: '🔈',
    desc: 'Alterna el efecto de eco/reverb del audio entre desactivado y activado con una tecla.',
    bindKey: 'KP_SLASH',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `alias "toggle_room" "room_off"`,
        `alias "room_off" "room_type 0; echo --- ECO: DESACTIVADO ---; alias toggle_room room_on"`,
        `alias "room_on" "room_type 2; echo --- ECO: ACTIVADO ---; alias toggle_room room_off"`,
        `bind "${alias.bindKey}" "toggle_room"`,
      ];
    }
  },
  {
    id: 'hand_slots',
    label: 'Mano Dinámica por Slot de Arma',
    icon: '🤲',
    desc: 'Cambia automáticamente el arma a mano derecha o izquierda según el slot. Cuchillo, granadas y C4 van a mano izquierda para mejorar la visión. Armas van a mano derecha.',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `bind "1" "slot1; cl_righthand 1"`,
        `bind "2" "slot2; cl_righthand 1"`,
        `bind "3" "slot3; cl_righthand 0"`,
        `bind "4" "slot4; cl_righthand 0"`,
        `bind "5" "slot5; cl_righthand 0"`,
        `bind "q" "lastinv; cl_righthand 1"`,
      ];
    }
  },
  {
    id: 'awp_profile',
    label: 'Perfil AWP ↔ Normal (con tecla)',
    icon: '🔭',
    desc: 'Permite cambiar entre una configuración normal y una optimizada para AWP (más rate, menos modelos, sin sombras) con una tecla. Ideal si cambias frecuentemente de rol.',
    keyNormal: 'kp_minus',
    rateNormal: '25000', rateAwp: '100000',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `alias "load_awp_settings" "rate ${alias.rateAwp}; cl_cmdbackup 6; cl_minmodels 1; cl_shadows 0; crosshair 1; bind ${alias.keyNormal} load_normal_settings; echo --- MODO AWP ACTIVADO ---"`,
        `alias "load_normal_settings" "rate ${alias.rateNormal}; cl_cmdbackup 2; cl_minmodels 0; cl_shadows 1; crosshair 0; bind ${alias.keyNormal} load_awp_settings; echo --- MODO NORMAL ACTIVADO ---"`,
        `bind "${alias.keyNormal}" "load_awp_settings"`,
      ];
    }
  },
  {
    id: 'clear_exec',
    label: 'Limpiar Consola al Cargar',
    icon: '🧹',
    desc: 'Limpia la consola y muestra un mensaje al cargar la CFG. Útil para confirmar que se cargó correctamente.',
    cfgName: 'config',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `clear`,
        `echo "--- CFG ${alias.cfgName} cargada correctamente ---"`,
      ];
    }
  },
  {
    id: 'duck_jump',
    label: 'Duck Jump (Salto con agachado)',
    icon: '🦘',
    desc: 'Salta y se agacha de forma automática con una sola tecla para alcanzar bordes y cajas más altas sin esfuerzo.',
    bindKey: 'SPACE',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `alias "+duckjump" "+jump; +duck"`,
        `alias "-duckjump" "-jump; -duck"`,
        `bind "${alias.bindKey}" "+duckjump"`
      ];
    }
  },
  {
    id: 'silent_run',
    label: 'Silent Run (Double Duck)',
    icon: '🥷',
    desc: 'Permite avanzar rápidamente en silencio haciendo agachados rápidos. Ideal para asignar a la rueda del mouse o Alt.',
    bindKey: 'ALT',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `alias "+silentrun" "+duck; wait; -duck; wait; +duck"`,
        `alias "-silentrun" "-duck"`,
        `bind "${alias.bindKey}" "+silentrun"`
      ];
    }
  },
  {
    id: 'vol_incremental',
    label: 'Control de Volumen Incremental',
    icon: '🔊',
    desc: 'Sube y baja el volumen en pasos de 0.05 usando dos teclas, informando el volumen actual por consola.',
    keyUp: 'KP_PLUS',
    keyDown: 'KP_MINUS',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `alias "vol_0" "volume 0.00; echo --- VOLUMEN: [MUTED] ---; alias vol_up vol_1; alias vol_down vol_0"`,
        `alias "vol_1" "volume 0.05; echo --- VOLUMEN: [0.05] ---; alias vol_up vol_2; alias vol_down vol_0"`,
        `alias "vol_2" "volume 0.10; echo --- VOLUMEN: [0.10] ---; alias vol_up vol_3; alias vol_down vol_1"`,
        `alias "vol_3" "volume 0.15; echo --- VOLUMEN: [0.15] ---; alias vol_up vol_4; alias vol_down vol_2"`,
        `alias "vol_4" "volume 0.20; echo --- VOLUMEN: [0.20] ---; alias vol_up vol_5; alias vol_down vol_3"`,
        `alias "vol_5" "volume 0.25; echo --- VOLUMEN: [0.25] ---; alias vol_up vol_6; alias vol_down vol_4"`,
        `alias "vol_6" "volume 0.30; echo --- VOLUMEN: [0.30] ---; alias vol_up vol_7; alias vol_down vol_5"`,
        `alias "vol_7" "volume 0.35; echo --- VOLUMEN: [0.35] ---; alias vol_up vol_8; alias vol_down vol_6"`,
        `alias "vol_8" "volume 0.40; echo --- VOLUMEN: [0.40] ---; alias vol_up vol_9; alias vol_down vol_7"`,
        `alias "vol_9" "volume 0.50; echo --- VOLUMEN: [0.50] ---; alias vol_up vol_10; alias vol_down vol_8"`,
        `alias "vol_10" "volume 0.60; echo --- VOLUMEN: [MAX] ---; alias vol_up vol_10; alias vol_down vol_9"`,
        `alias "vol_up" "vol_4"`,
        `alias "vol_down" "vol_2"`,
        `bind "${alias.keyUp}" "vol_up"`,
        `bind "${alias.keyDown}" "vol_down"`
      ];
    }
  },
  {
    id: 'hand_toggle',
    label: 'Cambio de Mano Rápido (L/R)',
    icon: '👋',
    desc: 'Alterna el arma entre la mano izquierda y la mano derecha con presionar una sola tecla.',
    bindKey: 'h',
    enabled: false,
    generate: (alias) => {
      if (!alias.enabled) return [];
      return [
        `alias "toggle_hand" "hand_left"`,
        `alias "hand_left" "cl_righthand 0; alias toggle_hand hand_right; echo --- MANO IZQUIERDA ---"`,
        `alias "hand_right" "cl_righthand 1; alias toggle_hand hand_left; echo --- MANO DERECHA ---"`,
        `bind "${alias.bindKey}" "toggle_hand"`
      ];
    }
  },
];

// ================================================================
// PRESETS
// ================================================================
const PRESETS = {
  blank: {
    label: 'Desde Cero',
    description: 'CFG en blanco con valores por defecto',
    modules: {},
  },
  competitive: {
    label: 'Competitivo Estándar',
    description: 'Configuración equilibrada para juego competitivo',
    modules: {
      identity:  { enabled: true, vars: { name: 'Player', team: '', 'setinfo _pw': '' } },
      network:   { enabled: true, vars: { rate: 25000, cl_cmdrate: 101, cl_updaterate: 101, cl_cmdbackup: 2, cl_dlmax: 1024, ex_interp: '0.01', cl_lc: 1, cl_lw: 1 } },
      video:     { enabled: true, vars: { fps_max: 101, fps_modem: 0, developer: 0, brightness: 2, gamma: 2.5, gl_vsync: 0, cl_weather: 0, cl_showfps: '1', cl_corpsestay: 5, cl_shadows: 1, r_dynamic: 1, fastsprites: '0', 'mp_decals': 200, r_decals: 200 } },
      graphics:  { enabled: true, vars: { gl_texturemode: 'GL_LINEAR_MIPMAP_LINEAR', gl_picmip: 0, gl_round_down: 3, gl_max_size: '512', gl_ansio: '0', gl_ztrick: 0, gl_polyoffset: '0.1', cl_himodels: 1, cl_minmodels: 0, cl_min_ct: '4', cl_min_t: '4', gl_playermip: 0, r_mmx: 1, r_detailtextures: 1 } },
      mouse:     { enabled: true, vars: { sensitivity: 2.5, m_rawinput: 1, m_filter: 0, m_pitch: '0.022', m_yaw: '0.022', m_forward: '0', m_side: '0', zoom_sensitivity_ratio: 1.2 } },
      audio:     { enabled: true, vars: { volume: 0.4, bgmvolume: 0, mp3volume: 0, mp3fadeout: 0, cl_tones: 0, voice_enable: 1, voice_modenable: 0, voice_scale: 0.5, room_type: '0' } },
      hud:       { enabled: true, vars: { cl_crosshair_size: 'small', cl_crosshair_color: '255 255 255', cl_dynamiccrosshair: 0, cl_crosshair_translucent: 0, crosshair: 0, cl_observercrosshair: 1, cl_radartype: '1', hud_fastswitch: 1, hud_centerid: 1, con_color: '255 255 255', net_graph: '0', net_graphpos: '1' } },
      misc:      { enabled: true, vars: { _cl_autowepswitch: 0, mp_startmoney: '800', mp_consistency: 1, mp_chattime: 0, ati_npatch: 0, ati_subdiv: 0 } },
    }
  },
  awp: {
    label: 'Pro AWP',
    description: 'Optimizado para jugar con AWP como arma principal',
    modules: {
      identity:  { enabled: true, vars: { name: 'AWPer', team: '' } },
      network:   { enabled: true, vars: { rate: 100000, cl_cmdrate: 101, cl_updaterate: 101, cl_cmdbackup: 6, cl_dlmax: 1024, ex_interp: '0.01', cl_lc: 1, cl_lw: 1 } },
      video:     { enabled: true, vars: { fps_max: 101, fps_modem: 0, developer: 0, brightness: 3, gamma: 3, gl_vsync: 0, cl_weather: 0, cl_showfps: '1', cl_corpsestay: 3, cl_shadows: 0, r_dynamic: 0, fastsprites: '2', 'mp_decals': 100, r_decals: 100 } },
      graphics:  { enabled: true, vars: { gl_texturemode: 'GL_NEAREST', gl_picmip: 2, gl_round_down: 3, gl_max_size: '256', gl_ansio: '0', gl_ztrick: 0, cl_himodels: 0, cl_minmodels: 1, cl_min_ct: '4', cl_min_t: '4', gl_playermip: 2 } },
      mouse:     { enabled: true, vars: { sensitivity: 1.8, m_rawinput: 1, m_filter: 0, m_pitch: '0.022', m_yaw: '0.022', zoom_sensitivity_ratio: 1.0 } },
      hud:       { enabled: true, vars: { cl_crosshair_size: 'small', cl_crosshair_color: '255 255 255', cl_dynamiccrosshair: 0, cl_crosshair_translucent: 0, crosshair: 1, cl_radartype: '1', hud_fastswitch: 1, hud_centerid: 1, net_graph: '0' } },
      misc:      { enabled: true, vars: { _cl_autowepswitch: 0, mp_startmoney: '800', mp_consistency: 1 } },
    }
  },
  cafe: {
    label: 'Café Internet / LAN',
    description: 'Para PCs modestas en café internet o LAN party',
    modules: {
      identity: { enabled: true, vars: { name: 'Player' } },
      network:  { enabled: true, vars: { rate: 25000, cl_cmdrate: 60, cl_updaterate: 60, cl_cmdbackup: 2, ex_interp: '0.01', cl_lc: 1, cl_lw: 1 } },
      video:    { enabled: true, vars: { fps_max: 60, fps_modem: 0, brightness: 3, gamma: 3, gl_vsync: 0, cl_weather: 0, cl_showfps: '1', cl_corpsestay: 2, cl_shadows: 0, r_dynamic: 0, fastsprites: '2', 'mp_decals': 50, r_decals: 50 } },
      graphics: { enabled: true, vars: { gl_texturemode: 'GL_NEAREST', gl_picmip: 4, gl_max_size: '128', cl_himodels: 0, cl_minmodels: 1, gl_playermip: 3, r_detailtextures: 0 } },
      mouse:    { enabled: true, vars: { sensitivity: 3, m_filter: 0, m_pitch: '0.022', m_yaw: '0.022' } },
      hud:      { enabled: true, vars: { cl_crosshair_size: 'medium', cl_crosshair_color: '255 255 0', cl_dynamiccrosshair: 0, cl_radartype: '1', hud_fastswitch: 1 } },
      misc:     { enabled: true, vars: { _cl_autowepswitch: 0, ati_npatch: 0, ati_subdiv: 0 } },
    }
  },
  performance: {
    label: 'Máximo Rendimiento',
    description: 'Sacrifica calidad visual por el máximo de FPS posible',
    modules: {
      network:  { enabled: true, vars: { rate: 25000, cl_cmdrate: 101, cl_updaterate: 101, cl_cmdbackup: 2, ex_interp: '0.01', cl_lc: 1, cl_lw: 1 } },
      video:    { enabled: true, vars: { fps_max: 0, fps_modem: 0, developer: 0, brightness: 3, gamma: 3, gl_vsync: 0, cl_weather: 0, cl_showfps: '1', cl_corpsestay: 0, cl_shadows: 0, r_dynamic: 0, fastsprites: '2', 'mp_decals': 0, r_decals: 0 } },
      graphics: { enabled: true, vars: { gl_texturemode: 'GL_NEAREST', gl_picmip: 4, gl_round_down: 6, gl_max_size: '64', gl_ansio: '0', gl_ztrick: 0, cl_himodels: 0, cl_minmodels: 1, cl_min_ct: '4', cl_min_t: '4', gl_playermip: 3, r_mmx: 1, r_detailtextures: 0 } },
      mouse:    { enabled: true, vars: { sensitivity: 3, m_rawinput: 1, m_filter: 0, m_pitch: '0.022', m_yaw: '0.022' } },
      hud:      { enabled: true, vars: { cl_crosshair_size: 'small', cl_dynamiccrosshair: 0, cl_crosshair_translucent: 0, cl_radartype: '1', hud_fastswitch: 1, net_graph: '0' } },
      misc:     { enabled: true, vars: { _cl_autowepswitch: 0, ati_npatch: 0, ati_subdiv: 0 } },
    }
  },
  quality: {
    label: 'Máxima Calidad',
    description: 'La mejor experiencia visual posible en CS 1.6',
    modules: {
      network:  { enabled: true, vars: { rate: 25000, cl_cmdrate: 101, cl_updaterate: 101, cl_cmdbackup: 2, ex_interp: '0.01', cl_lc: 1, cl_lw: 1 } },
      video:    { enabled: true, vars: { fps_max: 144, fps_modem: 0, developer: 0, brightness: 2, gamma: 2.5, gl_vsync: 0, cl_weather: 1, cl_showfps: '1', cl_corpsestay: 20, cl_shadows: 1, r_dynamic: 1, fastsprites: '0', 'mp_decals': 300, r_decals: 300 } },
      graphics: { enabled: true, vars: { gl_texturemode: 'GL_LINEAR_MIPMAP_LINEAR', gl_picmip: 0, gl_round_down: 0, gl_max_size: '512', gl_ansio: '16', gl_ztrick: 0, cl_himodels: 1, cl_minmodels: 0, gl_playermip: 0, r_mmx: 1, r_detailtextures: 1, gl_palette_tex: 1 } },
      mouse:    { enabled: true, vars: { sensitivity: 2.5, m_rawinput: 1, m_filter: 0, m_pitch: '0.022', m_yaw: '0.022' } },
      hud:      { enabled: true, vars: { cl_crosshair_size: 'small', cl_crosshair_color: '0 255 0', cl_dynamiccrosshair: 0, cl_crosshair_translucent: 0, cl_radartype: '1', hud_fastswitch: 1, hud_centerid: 1 } },
    }
  },
};

// Default keybinds
const DEFAULT_KEYBINDS = {
  'w': '+forward',
  's': '+back',
  'a': '+moveleft',
  'd': '+moveright',
  'SPACE': '+jump',
  'CTRL': '+duck',
  'SHIFT': '+speed',
  'MWHEELDOWN': '+jump',
  'MWHEELUP': '+duck',
  'MOUSE1': '+attack',
  'MOUSE2': '+attack2',
  'r': '+reload',
  'e': '+use',
  '1': 'slot1',
  '2': 'slot2',
  '3': 'slot3',
  '4': 'slot4',
  '5': 'slot5',
  'q': 'lastinv',
  'TAB': '+showscores',
  'ESCAPE': 'cancelselect',
  'ENTER': 'messagemode',
  'BACKSPACE': 'messagemode2',
  'F5': 'snapshot',
  '`': 'toggleconsole',
  'GRAVE': 'toggleconsole',
};

// Default buy binds
const DEFAULT_BUY_BINDS = [
  {
    id: 'buy_slot_0',
    key: 'UPARROW',
    label: 'Flecha Arriba',
    items: ['awp', 'primammo', 'secammo', 'vesthelm', 'hegren'],
  },
  {
    id: 'buy_slot_1',
    key: 'LEFTARROW',
    label: 'Flecha Izquierda',
    items: ['ak47', 'm4a1', 'primammo', 'secammo', 'vesthelm', 'hegren'],
  },
  {
    id: 'buy_slot_2',
    key: 'RIGHTARROW',
    label: 'Flecha Derecha',
    items: ['mp5', 'deagle', 'primammo', 'secammo', 'vesthelm', 'hegren'],
  },
  {
    id: 'buy_slot_3',
    key: 'DOWNARROW',
    label: 'Flecha Abajo',
    items: ['vesthelm', 'hegren', 'flash', 'flash', 'defuser', 'sgren'],
  },
];
