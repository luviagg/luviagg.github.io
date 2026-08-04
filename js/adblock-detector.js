/* =====================================================================
   ADBLOCK DETECTOR & RESTRICTION SYSTEM (ROBUST & ACCURATE)
   ===================================================================== */

(function () {
  let isAdBlockDetected = false;

  function applyAdBlockState(active) {
    isAdBlockDetected = active;
    const modal = document.getElementById('adblock-modal');
    const appRoot = document.getElementById('app');

    if (active) {
      if (modal) {
        modal.style.display = 'flex';
      }
      if (appRoot) {
        appRoot.style.pointerEvents = 'none';
        appRoot.style.userSelect = 'none';
        appRoot.style.filter = 'blur(6px) grayscale(0.7)';
      }
      document.body.style.overflow = 'hidden';
    } else {
      if (modal) {
        modal.style.display = 'none';
      }
      if (appRoot) {
        appRoot.style.pointerEvents = '';
        appRoot.style.userSelect = '';
        appRoot.style.filter = '';
      }
      document.body.style.overflow = '';
    }
  }

  function checkAdBlocker() {
    return new Promise((resolve) => {
      let isBlocked = false;

      // 1. Verificar si el script ads.js fue bloqueado
      if (window.canRunAds !== true) {
        isBlocked = true;
      }

      // 2. Probar si el script de Google AdSense fue bloqueado o no existe la variable google_ad_client / adsbygoogle
      const adsScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (adsScript && (window.adsbygoogle === undefined || adsScript.getAttribute('data-adblock-blocked') === 'true')) {
        isBlocked = true;
      }

      // 3. Crear trampa de DOM visible en pantalla (dentro del flujo pero invisible para el usuario)
      const fakeAd = document.createElement('div');
      fakeAd.id = 'ad-banner-top';
      fakeAd.className = 'adsbygoogle ad-banner pub_300x250 text-ad ad_box ad-slot google-auto-placed';
      fakeAd.style.cssText = 'width: 1px !important; height: 1px !important; position: fixed !important; top: -10px !important; left: -10px !important; opacity: 0.01 !important; pointer-events: none !important;';
      fakeAd.setAttribute('data-ad-client', 'ca-pub-3295246390356947');
      fakeAd.innerHTML = '&nbsp;';
      document.body.appendChild(fakeAd);

      // Evaluar tras breve pausa para que los adblockers (uBlock, AdBlock, Brave, DuckDuckGo) actúen
      setTimeout(() => {
        const style = window.getComputedStyle(fakeAd);
        const domBlocked =
          fakeAd.offsetParent === null ||
          fakeAd.offsetHeight === 0 ||
          fakeAd.offsetWidth === 0 ||
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0';

        fakeAd.remove();

        if (domBlocked) {
          isBlocked = true;
        }

        // 4. Intentar fetch de prueba a script publicitario conocido
        fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3295246390356947', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store'
        }).then(() => {
          resolve(isBlocked);
        }).catch(() => {
          // Si el fetch falla (net::ERR_BLOCKED_BY_CLIENT / ERR_BLOCKED_BY_ADBLOCKER)
          resolve(true);
        });

      }, 150);
    });
  }

  async function runDetector() {
    const detected = await checkAdBlocker();
    applyAdBlockState(detected);
  }

  // Escuchar errores globales de carga de scripts (ej. adsbygoogle.js o ads.js bloqueados por la extensión)
  window.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'SCRIPT') {
      const src = e.target.src || '';
      if (src.includes('adsbygoogle') || src.includes('ads.js')) {
        applyAdBlockState(true);
      }
    }
  }, true);

  // Inicializar detector
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(runDetector, 200));
  } else {
    setTimeout(runDetector, 200);
  }

  // Chequeo de respaldo a los 800ms
  setTimeout(runDetector, 800);

  // Listener para el botón de re-verificación en el modal
  document.addEventListener('DOMContentLoaded', () => {
    const btnRecheck = document.getElementById('btn-recheck-adblock');
    if (btnRecheck) {
      btnRecheck.addEventListener('click', async () => {
        btnRecheck.innerText = '⏳ Verificando...';
        btnRecheck.disabled = true;

        window.canRunAds = undefined;

        // Intentar recargar el script de prueba ads.js
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'js/ads.js?t=' + Date.now();
          script.onload = () => resolve();
          script.onerror = () => resolve();
          document.head.appendChild(script);
        });

        const stillBlocked = await checkAdBlocker();
        applyAdBlockState(stillBlocked);

        btnRecheck.innerText = '🔄 Ya lo desactivé, verificar de nuevo';
        btnRecheck.disabled = false;

        if (!stillBlocked && typeof showToast === 'function') {
          showToast('¡Gracias por apoyar el sitio! Funcionalidad restaurada. ✓', 'success');
        }
      });
    }
  });

  // Re-verificar automáticamente cuando la ventana vuelve a tener foco
  window.addEventListener('focus', () => {
    runDetector();
  });

})();
