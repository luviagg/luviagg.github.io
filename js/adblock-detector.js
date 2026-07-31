/* =====================================================================
   ADBLOCK DETECTOR & RESTRICTION SYSTEM (ULTRA STRICT)
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
      // Test 1: Verificar la variable global del script ads.js
      if (window.canRunAds !== true) {
        return resolve(true);
      }

      // Test 2: Crear un elemento trampa con clases e IDs extremadamente atractivos para bloqueadores
      const fakeAd = document.createElement('div');
      fakeAd.id = 'ad-banner-top';
      fakeAd.className = 'adsbygoogle ad-banner pub_300x250 text-ad ad_box ad-slot google-auto-placed';
      fakeAd.style.cssText = 'width: 100px !important; height: 100px !important; position: absolute !important; left: -9999px !important; top: -9999px !important; display: block !important; visibility: visible !important;';
      fakeAd.innerHTML = '&nbsp;';
      document.body.appendChild(fakeAd);

      // Evaluar inmediatamente y a los 100ms
      setTimeout(() => {
        const style = window.getComputedStyle(fakeAd);
        const isBlocked =
          fakeAd.offsetParent === null ||
          fakeAd.offsetHeight === 0 ||
          fakeAd.offsetWidth === 0 ||
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0';

        fakeAd.remove();
        resolve(isBlocked);
      }, 100);
    });
  }

  async function runDetector() {
    const detected = await checkAdBlocker();
    applyAdBlockState(detected);
  }

  // Ejecutar inmediatamente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDetector);
  } else {
    runDetector();
  }

  // Ejecución de respaldo a los 500ms por si el adblocker tardó en inyectar sus reglas
  setTimeout(runDetector, 500);

  // Configurar listeners una vez listo el DOM
  document.addEventListener('DOMContentLoaded', () => {
    const btnRecheck = document.getElementById('btn-recheck-adblock');
    if (btnRecheck) {
      btnRecheck.addEventListener('click', async () => {
        btnRecheck.innerText = '⏳ Verificando...';
        btnRecheck.disabled = true;

        // Limpiar variable para probar si ahora sí carga
        window.canRunAds = undefined;

        // Intentar recargar el script de anuncios
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

  // Re-verificar si la ventana gana el foco
  window.addEventListener('focus', () => {
    runDetector();
  });

})();
