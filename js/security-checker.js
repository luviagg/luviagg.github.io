/* =====================================================================
   ADBLOCK DETECTOR & RESTRICTION SYSTEM (BALANCED & ACCURATE)
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
      // Si js/ads.js cargó la variable global correctamente, asumimos inicialmente que no hay bloqueo de scripts
      let adBlockFound = false;

      if (window.canRunAds !== true) {
        adBlockFound = true;
      }

      // Crear elemento trampa visible (pero fuera de pantalla para el usuario)
      const fakeAd = document.createElement('div');
      fakeAd.id = 'ad-banner-top';
      fakeAd.className = 'adsbygoogle ad-banner pub_300x250 text-ad ad_box ad-slot';
      fakeAd.style.cssText = 'width: 100px !important; height: 100px !important; position: absolute !important; left: -9999px !important; top: -9999px !important; display: block !important; visibility: visible !important;';
      fakeAd.innerHTML = '&nbsp;';
      document.body.appendChild(fakeAd);

      setTimeout(() => {
        const style = window.getComputedStyle(fakeAd);
        const isDomHidden =
          fakeAd.offsetParent === null ||
          fakeAd.offsetHeight === 0 ||
          fakeAd.offsetWidth === 0 ||
          style.display === 'none' ||
          style.visibility === 'hidden';

        fakeAd.remove();

        if (isDomHidden) {
          adBlockFound = true;
        }

        resolve(adBlockFound);
      }, 120);
    });
  }

  async function runDetector() {
    const detected = await checkAdBlocker();
    applyAdBlockState(detected);
  }

  // Ejecutar una vez cargado el DOM para evitar falsos positivos por retardo en la carga de scripts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(runDetector, 300));
  } else {
    setTimeout(runDetector, 300);
  }

  // Configurar listeners del botón de re-verificación
  document.addEventListener('DOMContentLoaded', () => {
    const btnRecheck = document.getElementById('btn-recheck-adblock');
    if (btnRecheck) {
      btnRecheck.addEventListener('click', async () => {
        btnRecheck.innerText = '⏳ Verificando...';
        btnRecheck.disabled = true;

        window.canRunAds = undefined;

        // Intentar recargar js/partner-loader.js
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'js/partner-loader.js?t=' + Date.now();
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

  // Re-verificar solo cuando la ventana recupera el foco y si previamente estaba detectado
  window.addEventListener('focus', () => {
    if (isAdBlockDetected) {
      runDetector();
    }
  });

})();
