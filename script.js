/**
 * ====================================================================
 * SCRIPT.JS · MOTOR DE NAVEGACIÓN Y GESTIÓN DE IMÁGENES LOCALES
 * ====================================================================
 * Características:
 * 1. imageManager: Compresión canvas (1600px, 0.85q), sanitización SVG anti-XSS,
 *    persistencia en localStorage (deck_img_*), control de cuota 80%, export/import JSON.
 * 2. Navegación completa: Teclado (←, →, Espacio, RePág, AvPág, Home, End),
 *    Atajos (O=Índice, G=Cuadrícula, F=Fullscreen, P=Presentador, Esc=Cerrar),
 *    Click flechas, dots laterales, swipe táctil y wheel con debounce de 900ms.
 * 3. Deep-linking URL hash (#slide-1 .. #slide-13) y sincronización con aria-live.
 * 4. Cero dependencias externas, cero console.log en producción, sin alert() nativos.
 * ====================================================================
 */

(function () {
  'use strict';

  // ==================================================================
  // ESTADO GLOBAL DE LA APLICACIÓN
  // ==================================================================
  const STATE = {
    currentIndex: 0,
    totalSlides: SLIDES.length,
    isTransitioning: false,
    wheelDebounceTimer: null,
    touchStartX: 0,
    touchStartY: 0,
    presenterTimerInterval: null,
    presenterSecondsElapsed: 0,
    currentModal: null
  };

  // ==================================================================
  // SISTEMA DE NOTIFICACIONES TOAST (Reemplazo accesible de alert())
  // ==================================================================
  const Toast = {
    show(message, type = 'info', duration = 4000) {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');

      const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
      toast.innerHTML = `<span style="font-weight:700;">${icon}</span><span>${message}</span>`;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 320);
      }, duration);
    }
  };

  // ==================================================================
  // MODAL CUSTOM DE DIÁLOGO Y CONFIRMACIÓN (Reemplazo de confirm/prompt)
  // ==================================================================
  const Modal = {
    open(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      STATE.currentModal = modalId;

      // Focus trap
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) focusable[0].focus();
    },

    close(modalId) {
      const targetId = modalId || STATE.currentModal;
      if (!targetId) return;
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
      STATE.currentModal = null;
    },

    confirm(title, message, onConfirm, isDanger = false) {
      const overlay = document.getElementById('dialog-overlay');
      const titleEl = document.getElementById('dialog-title');
      const bodyEl = document.getElementById('dialog-body');
      const confirmBtn = document.getElementById('dialog-confirm-btn');

      titleEl.textContent = title;
      bodyEl.innerHTML = `<p style="font-size:0.95rem; color:var(--ink);">${message}</p>`;

      confirmBtn.className = isDanger ? 'btn-danger' : 'btn-primary';
      confirmBtn.textContent = 'Confirmar';

      const handleConfirm = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        Modal.close('dialog-overlay');
        if (typeof onConfirm === 'function') onConfirm();
      };

      confirmBtn.onclick = handleConfirm;
      Modal.open('dialog-overlay');
    }
  };

  // ==================================================================
  // MÓDULO IMAGE MANAGER (AISLADO, PERSISTENTE, COMPRESIÓN CANVAS)
  // ==================================================================
  const imageManager = {
    KEY_PREFIX: 'deck_img_',
    MAX_FILE_SIZE: 8 * 1024 * 1024, // 8 Megabytes límite
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'],

    /**
     * Calcula el porcentaje aproximado de uso de localStorage
     */
    checkStorageQuota() {
      try {
        let totalBytes = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const val = localStorage.getItem(key);
          totalBytes += (key.length + val.length) * 2; // UTF-16
        }
        const quotaEstimate = 5 * 1024 * 1024; // ~5MB estándar
        const ratio = totalBytes / quotaEstimate;
        if (ratio >= 0.8) {
          Toast.show(`Alerta de almacenamiento: localStorage superó el ${(ratio * 100).toFixed(0)}% del límite típico. Exporte sus imágenes a JSON.`, 'warning', 6000);
        }
      } catch (e) {
        // Ignorar si falla cálculo
      }
    },

    /**
     * Sanitiza SVG para remover scripts y handlers antes de renderizar (Prevención XSS)
     */
    sanitizeSVG(rawSvgString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawSvgString, 'image/svg+xml');
      
      // Remover etiquetas <script> y elementos maliciosos
      const scripts = doc.querySelectorAll('script, foreignObject, iframe, object, embed');
      scripts.forEach(el => el.remove());

      // Remover atributos de eventos on* y javascript: en enlaces
      const allElements = doc.querySelectorAll('*');
      allElements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith('on')) {
            el.removeAttribute(attr.name);
          }
          if ((attr.name === 'href' || attr.name === 'xlink:href') && attr.value.trim().toLowerCase().startsWith('javascript:')) {
            el.removeAttribute(attr.name);
          }
        });
      });

      return new XMLSerializer().serializeToString(doc.documentElement);
    },

    /**
     * Comprime imágenes raster con <canvas> (max 1600px ancho, JPEG 0.85)
     */
    compressRasterImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const maxWidth = 1600;
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Generar JPEG comprimido con calidad 0.85
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(compressedDataUrl);
          };
          img.onerror = () => reject(new Error('No se pudo procesar la imagen raster.'));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Error al leer el archivo local.'));
        reader.readAsDataURL(file);
      });
    },

    /**
     * Guarda una imagen para una diapositiva dada
     */
    async setImage(slideIndex, file, meta = {}) {
      if (!file) return;

      // Validación de tamaño (máximo 8 MB)
      if (file.size > this.MAX_FILE_SIZE) {
        Toast.show('El archivo excede el tamaño máximo permitido de 8 MB.', 'error');
        return;
      }

      // Validación de formato
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        Toast.show('Formato no soportado. Suba PNG, JPG, JPEG, WEBP, GIF o SVG.', 'error');
        return;
      }

      this.showLoader(slideIndex, true);

      try {
        let finalDataUrl = '';

        if (file.type === 'image/svg+xml') {
          // Procesar y sanitizar SVG
          const svgText = await file.text();
          const cleanSvg = this.sanitizeSVG(svgText);
          finalDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cleanSvg);
        } else {
          // Comprimir mediante canvas
          finalDataUrl = await this.compressRasterImage(file);
        }

        const imageRecord = {
          index: slideIndex,
          data: finalDataUrl,
          alt: meta.alt || `Diagrama o captura correspondiente al tema ${SLIDES[slideIndex].eyebrow}`,
          caption: meta.caption || '',
          fit: meta.fit || 'cover'
        };

        // Guardar en localStorage
        try {
          localStorage.setItem(`${this.KEY_PREFIX}${slideIndex}`, JSON.stringify(imageRecord));
        } catch (quotaError) {
          Toast.show('Error: Almacenamiento local lleno (QuotaExceededError). Exporte o limpie imágenes.', 'error', 6000);
          this.showLoader(slideIndex, false);
          return;
        }

        // Reflejar en la UI
        this.renderImageInSlide(slideIndex, imageRecord);
        this.checkStorageQuota();
        Toast.show(`Imagen para Slide ${slideIndex + 1} cargada con éxito.`, 'success');
      } catch (err) {
        Toast.show('Error al procesar la imagen: ' + (err.message || 'Desconocido'), 'error');
      } finally {
        this.showLoader(slideIndex, false);
      }
    },

    /**
     * Elimina la imagen de una diapositiva y restaura el placeholder SVG
     */
    removeImage(slideIndex) {
      localStorage.removeItem(`${this.KEY_PREFIX}${slideIndex}`);
      const slideEl = document.getElementById(`slide-${slideIndex}`);
      if (!slideEl) return;

      const previewWrapper = slideEl.querySelector('.image-preview-wrapper');
      const svgWrapper = slideEl.querySelector('.svg-wrapper');
      const captionEl = slideEl.querySelector('.image-caption');

      if (previewWrapper) previewWrapper.classList.remove('is-visible');
      if (svgWrapper) svgWrapper.style.display = 'flex';
      if (captionEl) captionEl.textContent = '';

      Toast.show(`Imagen de Slide ${slideIndex + 1} retirada. Placeholder restaurado.`, 'info');
    },

    /**
     * Obtiene el registro guardado de una diapositiva
     */
    getImage(slideIndex) {
      try {
        const item = localStorage.getItem(`${this.KEY_PREFIX}${slideIndex}`);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        return null;
      }
    },

    /**
     * Renderiza una imagen cargada en el DOM de la diapositiva
     */
    renderImageInSlide(slideIndex, record) {
      const slideEl = document.getElementById(`slide-${slideIndex}`);
      if (!slideEl) return;

      const previewWrapper = slideEl.querySelector('.image-preview-wrapper');
      const imgEl = slideEl.querySelector('.uploaded-image');
      const svgWrapper = slideEl.querySelector('.svg-wrapper');
      const captionEl = slideEl.querySelector('.image-caption');

      if (!previewWrapper || !imgEl) return;

      imgEl.src = record.data;
      imgEl.alt = record.alt || `Imagen de la diapositiva ${slideIndex + 1}`;
      imgEl.className = `uploaded-image fit-${record.fit || 'cover'}`;
      
      imgEl.onload = () => {
        imgEl.classList.add('is-loaded');
        previewWrapper.classList.add('is-visible');
        if (svgWrapper) svgWrapper.style.display = 'none';
      };

      if (captionEl) {
        captionEl.textContent = record.caption || '';
      }
    },

    /**
     * Muestra u oculta el spinner skeleton
     */
    showLoader(slideIndex, isVisible) {
      const slideEl = document.getElementById(`slide-${slideIndex}`);
      if (!slideEl) return;
      const loader = slideEl.querySelector('.skeleton-loader');
      if (loader) {
        loader.classList.toggle('is-loading', isVisible);
      }
    },

    /**
     * Restaura todas las imágenes guardadas al iniciar
     */
    restoreAll() {
      for (let i = 0; i < STATE.totalSlides; i++) {
        const record = this.getImage(i);
        if (record && record.data) {
          this.renderImageInSlide(i, record);
        }
      }
    },

    /**
     * Exporta todas las imágenes guardadas a un archivo JSON descargable
     */
    exportAll() {
      const exportData = {
        version: 1,
        appName: "Editorial Deck Presenter",
        exportedAt: new Date().toISOString(),
        slides: []
      };

      for (let i = 0; i < STATE.totalSlides; i++) {
        const item = this.getImage(i);
        if (item) {
          exportData.slides.push(item);
        }
      }

      if (exportData.slides.length === 0) {
        Toast.show('No hay imágenes cargadas para exportar.', 'warning');
        return;
      }

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presentacion-imagenes-deck-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Toast.show(`Exportación completada: ${exportData.slides.length} imagen(es) descargadas en JSON.`, 'success');
    },

    /**
     * Importa imágenes desde un archivo JSON
     */
    importAll(jsonString) {
      try {
        const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        
        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.slides)) {
          Toast.show('El archivo JSON no tiene un formato válido o la versión no es compatible.', 'error');
          return;
        }

        let count = 0;
        parsed.slides.forEach(item => {
          if (typeof item.index === 'number' && item.data) {
            localStorage.setItem(`${this.KEY_PREFIX}${item.index}`, JSON.stringify(item));
            this.renderImageInSlide(item.index, item);
            count++;
          }
        });

        this.checkStorageQuota();
        Toast.show(`Importación exitosa: ${count} imagen(es) restauradas correctamente.`, 'success');
      } catch (err) {
        Toast.show('Error al importar el archivo JSON. Archivo dañado o corrupto.', 'error');
      }
    },

    /**
     * Limpia todas las imágenes previa confirmación modal
     */
    clearAll() {
      Modal.confirm(
        '¿Eliminar todas las imágenes?',
        'Esta acción borrará todas las imágenes locales subidas a las diapositivas y restaurará los placeholders vectoriales. Esta acción no se puede deshacer.',
        () => {
          for (let i = 0; i < STATE.totalSlides; i++) {
            localStorage.removeItem(`${this.KEY_PREFIX}${i}`);
            const slideEl = document.getElementById(`slide-${i}`);
            if (slideEl) {
              const previewWrapper = slideEl.querySelector('.image-preview-wrapper');
              const svgWrapper = slideEl.querySelector('.svg-wrapper');
              const captionEl = slideEl.querySelector('.image-caption');
              if (previewWrapper) previewWrapper.classList.remove('is-visible');
              if (svgWrapper) svgWrapper.style.display = 'flex';
              if (captionEl) captionEl.textContent = '';
            }
          }
          Toast.show('Todas las imágenes fueron eliminadas del almacenamiento local.', 'info');
        },
        true // Botón de peligro rojo
      );
    }
  };

  // ==================================================================
  // MOTOR DE NAVEGACIÓN Y SINCRONIZACIÓN DE DIAPOSITIVAS
  // ==================================================================
  const PresentationEngine = {
    /**
     * Inicializa el deck y renderiza las diapositivas
     */
    init() {
      this.renderSlides();
      this.renderLateralDots();
      this.renderIndexOverlay();
      this.renderGridView();
      this.bindEvents();
      this.bindImageDropzones();

      // Restaurar imágenes guardadas
      imageManager.restoreAll();

      // Deep linking por hash URL (#slide-1 .. #slide-13)
      const hash = window.location.hash;
      let initialSlide = 0;
      if (hash && hash.startsWith('#slide-')) {
        const parsed = parseInt(hash.replace('#slide-', ''), 10) - 1;
        if (!isNaN(parsed) && parsed >= 0 && parsed < STATE.totalSlides) {
          initialSlide = parsed;
        }
      }

      this.goToSlide(initialSlide, false);
      this.initTheme();
    },

    /**
     * Renderiza las 13 diapositivas dinámicamente en el DOM
     */
    renderSlides() {
      const container = document.getElementById('slide-deck-container');
      if (!container) return;
      container.innerHTML = '';

      SLIDES.forEach((slide, index) => {
        const slideEl = document.createElement('section');
        slideEl.id = `slide-${index}`;
        slideEl.className = `slide ${slide.type === 'portada' ? 'slide--portada' : ''} ${slide.reverse ? 'slide--reverse' : ''}`;
        slideEl.setAttribute('role', 'region');
        slideEl.setAttribute('aria-label', `Diapositiva ${index + 1}: ${slide.eyebrow}`);

        if (slide.type === 'portada') {
          // Layout editorial de portada
          slideEl.innerHTML = `
            <div class="slide-content">
              <span class="eyebrow reveal">${slide.eyebrow}</span>
              <h1 class="title-portada reveal">${slide.title}</h1>
              <p class="slide-subtitle reveal">${slide.subtitle}</p>
              <p class="slide-body reveal">${slide.body}</p>
              
              <div class="portada-meta reveal">
                <div class="portada-meta-block">
                  <h4>Autores</h4>
                  <p>${slide.authorsText}</p>
                </div>
                <div class="portada-meta-block">
                  <h4>Tutor & Fecha</h4>
                  <p>${slide.advisorText}<br><span style="font-size:0.8rem; opacity:0.85;">${slide.dateText}</span></p>
                </div>
              </div>
            </div>

            <div class="slide-visual-zone reveal">
              <div class="dropzone-container" data-slide-index="${index}" tabindex="0" role="button" aria-label="Subir captura o gráfico para Portada">
                <div class="svg-wrapper">
                  ${slide.svgPlaceholder}
                </div>
                <div class="image-preview-wrapper">
                  <img class="uploaded-image" alt="${slide.defaultAlt}" />
                  <div class="image-toolbar">
                    <button class="toolbar-btn btn-change" title="Cambiar imagen">Cambiar</button>
                    <button class="toolbar-btn btn-fit" title="Ajuste Cover/Contain">Ajustar</button>
                    <button class="toolbar-btn btn-meta" title="Editar Alt y Pie">Meta</button>
                    <button class="toolbar-btn btn-remove" title="Quitar imagen">✕</button>
                  </div>
                  <div class="image-status-badge">✓ Imagen cargada</div>
                </div>
                <div class="dropzone-overlay">
                  <span class="dropzone-overlay-icon">＋</span>
                  <span>Subir imagen local</span>
                  <span class="dropzone-overlay-hint">Click, arrastre o pegue con Ctrl+V</span>
                </div>
                <div class="skeleton-loader"><div class="spinner"></div></div>
              </div>
              <p class="image-caption"></p>
            </div>
          `;
        } else {
          // Layout de contenido (Slides 2 a 13)
          const listHtml = slide.list && slide.list.length > 0 ? `
            <ul class="editorial-list reveal">
              ${slide.list.map((item, i) => `
                <li class="editorial-item">
                  <span class="editorial-num">0${i + 1}</span>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          ` : '';

          slideEl.innerHTML = `
            <div class="slide-content">
              <span class="eyebrow reveal">${slide.eyebrow}</span>
              <h2 class="title-content reveal">${slide.title}</h2>
              <p class="slide-body reveal">${slide.body}</p>
              ${listHtml}
            </div>

            <div class="slide-visual-zone reveal">
              <div class="dropzone-container" data-slide-index="${index}" tabindex="0" role="button" aria-label="Zona de imagen para diapositiva ${index + 1}">
                <div class="svg-wrapper">
                  ${slide.svgPlaceholder}
                </div>
                <div class="image-preview-wrapper">
                  <img class="uploaded-image" alt="${slide.defaultAlt}" />
                  <div class="image-toolbar">
                    <button class="toolbar-btn btn-change" title="Cambiar imagen">Cambiar</button>
                    <button class="toolbar-btn btn-fit" title="Ajuste Cover/Contain">Ajustar</button>
                    <button class="toolbar-btn btn-meta" title="Editar Alt y Pie">Meta</button>
                    <button class="toolbar-btn btn-remove" title="Quitar imagen">✕</button>
                  </div>
                  <div class="image-status-badge">✓ Imagen cargada</div>
                </div>
                <div class="dropzone-overlay">
                  <span class="dropzone-overlay-icon">＋</span>
                  <span>Subir imagen local</span>
                  <span class="dropzone-overlay-hint">Click, arrastre o pegue con Ctrl+V</span>
                </div>
                <div class="skeleton-loader"><div class="spinner"></div></div>
              </div>
              <p class="image-caption"></p>
            </div>
          `;
        }

        container.appendChild(slideEl);
      });
    },

    /**
     * Renderiza los dots laterales de navegación
     */
    renderLateralDots() {
      const container = document.getElementById('lateral-dots');
      if (!container) return;
      container.innerHTML = '';

      SLIDES.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot-btn';
        dot.setAttribute('data-index', index);
        dot.setAttribute('data-title', `${index + 1}. ${slide.eyebrow}`);
        dot.setAttribute('aria-label', `Ir a diapositiva ${index + 1}: ${slide.eyebrow}`);
        dot.onclick = () => this.goToSlide(index);
        container.appendChild(dot);
      });
    },

    /**
     * Renderiza el listado del overlay de índice
     */
    renderIndexOverlay() {
      const list = document.getElementById('index-list-container');
      if (!list) return;
      list.innerHTML = '';

      SLIDES.forEach((slide, index) => {
        const itemBtn = document.createElement('button');
        itemBtn.className = 'index-item-btn';
        itemBtn.setAttribute('data-index', index);
        itemBtn.innerHTML = `
          <div>
            <span class="index-num">0${index + 1 < 10 ? '0' + (index + 1) : index + 1}</span>
            <span style="font-weight:600;">${slide.eyebrow}</span>
          </div>
          <span style="font-size:0.85rem; opacity:0.75; font-style:italic;">Slide ${index + 1}</span>
        `;
        itemBtn.onclick = () => {
          this.goToSlide(index);
          Modal.close('index-overlay');
        };
        list.appendChild(itemBtn);
      });
    },

    /**
     * Renderiza las miniaturas de la vista en cuadrícula (Grid View G)
     */
    renderGridView() {
      const container = document.getElementById('grid-slides-wrapper');
      if (!container) return;
      container.innerHTML = '';

      SLIDES.forEach((slide, index) => {
        const card = document.createElement('button');
        card.className = 'grid-card';
        card.setAttribute('data-index', index);
        card.innerHTML = `
          <div class="grid-card-num">0${index + 1 < 10 ? '0' + (index + 1) : index + 1}</div>
          <div class="grid-card-title">${slide.eyebrow}</div>
        `;
        card.onclick = () => {
          this.goToSlide(index);
          Modal.close('grid-overlay');
        };
        container.appendChild(card);
      });
    },

    /**
     * Navegación a diapositiva con forzado de reflow para animaciones limpias
     */
    goToSlide(index, updateHash = true) {
      if (index < 0 || index >= STATE.totalSlides) return;
      if (STATE.isTransitioning) return;

      const previousIndex = STATE.currentIndex;
      STATE.currentIndex = index;

      const allSlides = document.querySelectorAll('.slide');
      const allDots = document.querySelectorAll('.dot-btn');
      const indexButtons = document.querySelectorAll('.index-item-btn');
      const gridCards = document.querySelectorAll('.grid-card');

      // Actualizar clases de diapositivas
      allSlides.forEach((slideEl, i) => {
        if (i === index) {
          slideEl.classList.add('is-active');
          // Forzar reflow CSS (void el.offsetWidth) para reiniciar transiciones stagger limpiamente
          void slideEl.offsetWidth;
        } else {
          slideEl.classList.remove('is-active');
        }
      });

      // Actualizar dots laterales
      allDots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });

      // Actualizar índice y cuadrícula
      indexButtons.forEach((btn, i) => btn.classList.toggle('is-current', i === index));
      gridCards.forEach((card, i) => card.classList.toggle('is-current', i === index));

      // Actualizar barra de progreso superior
      const progressBar = document.getElementById('top-progress-bar');
      if (progressBar) {
        const percentage = ((index + 1) / STATE.totalSlides) * 100;
        progressBar.style.width = `${percentage}%`;
      }

      // Actualizar contador con aria-live
      const currentCounter = document.getElementById('current-slide-num');
      if (currentCounter) {
        const formatted = index + 1 < 10 ? `0${index + 1}` : index + 1;
        currentCounter.textContent = formatted;
      }

      // Actualizar estado de botones de navegación
      const prevBtn = document.getElementById('nav-prev-btn');
      const nextBtn = document.getElementById('nav-next-btn');
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === STATE.totalSlides - 1;

      // Actualizar hash para deep-linking
      if (updateHash) {
        window.history.replaceState(null, '', `#slide-${index + 1}`);
      }
    },

    next() {
      if (STATE.currentIndex < STATE.totalSlides - 1) {
        this.goToSlide(STATE.currentIndex + 1);
      }
    },

    prev() {
      if (STATE.currentIndex > 0) {
        this.goToSlide(STATE.currentIndex - 1);
      }
    },

    /**
     * Alternar pantalla completa nativa
     */
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    },

    /**
     * Modo presentador (P): inicia cronómetro y abre notas
     */
    togglePresenterMode() {
      const overlay = document.getElementById('presenter-overlay');
      if (overlay.classList.contains('is-open')) {
        Modal.close('presenter-overlay');
        clearInterval(STATE.presenterTimerInterval);
        STATE.presenterTimerInterval = null;
      } else {
        Modal.open('presenter-overlay');
        if (!STATE.presenterTimerInterval) {
          STATE.presenterTimerInterval = setInterval(() => {
            STATE.presenterSecondsElapsed++;
            const mins = Math.floor(STATE.presenterSecondsElapsed / 60);
            const secs = STATE.presenterSecondsElapsed % 60;
            const timerEl = document.getElementById('presenter-stopwatch');
            if (timerEl) {
              timerEl.textContent = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
            }
          }, 1000);
        }
      }
    },

    /**
     * Gestión del modo oscuro/claro
     */
    initTheme() {
      const savedTheme = localStorage.getItem('deck_theme');
      let activeTheme = 'light';

      if (savedTheme === 'dark' || savedTheme === 'light') {
        activeTheme = savedTheme;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        activeTheme = 'dark';
      }

      this.applyTheme(activeTheme);

      // Escuchar cambios de preferencia del sistema si el usuario no ha forzado un tema manual
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem('deck_theme')) {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (document.body) {
        document.body.setAttribute('data-theme', theme);
      }
      this.updateThemeButton(theme);
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('deck_theme', next);
      this.applyTheme(next);
      Toast.show(`Modo ${next === 'dark' ? 'oscuro' : 'claro'} activado.`, 'info');
    },

    updateThemeButton(theme) {
      const iconEl = document.getElementById('theme-btn-icon');
      const textEl = document.getElementById('theme-btn-text');
      if (iconEl && textEl) {
        if (theme === 'dark') {
          iconEl.textContent = '🌙';
          textEl.textContent = 'Oscuro';
        } else {
          iconEl.textContent = '☀️';
          textEl.textContent = 'Claro';
        }
      }
    },

    /**
     * Vinculación de eventos de navegación (Teclado, Mouse, Touch, Rueda)
     */
    bindEvents() {
      // 1. Controles de pantalla
      const prevBtn = document.getElementById('nav-prev-btn');
      const nextBtn = document.getElementById('nav-next-btn');
      if (prevBtn) prevBtn.onclick = () => this.prev();
      if (nextBtn) nextBtn.onclick = () => this.next();

      // 2. HUD Buttons
      const indexBtn = document.getElementById('btn-hud-index');
      const gridBtn = document.getElementById('btn-hud-grid');
      const fullscreenBtn = document.getElementById('btn-hud-fullscreen');
      const presenterBtn = document.getElementById('btn-hud-presenter');
      const themeBtn = document.getElementById('btn-hud-theme');
      const exportBtn = document.getElementById('btn-hud-export');
      const importBtn = document.getElementById('btn-hud-import');
      const clearBtn = document.getElementById('btn-hud-clear');

      if (indexBtn) indexBtn.onclick = () => Modal.open('index-overlay');
      if (gridBtn) gridBtn.onclick = () => Modal.open('grid-overlay');
      if (fullscreenBtn) fullscreenBtn.onclick = () => this.toggleFullscreen();
      if (presenterBtn) presenterBtn.onclick = () => this.togglePresenterMode();
      if (themeBtn) themeBtn.onclick = () => this.toggleTheme();
      if (exportBtn) exportBtn.onclick = () => imageManager.exportAll();
      if (clearBtn) clearBtn.onclick = () => imageManager.clearAll();

      // Input de archivo para importar JSON
      if (importBtn) {
        importBtn.onclick = () => {
          const jsonInput = document.getElementById('import-json-input');
          if (jsonInput) jsonInput.click();
        };
      }

      const jsonFileInput = document.getElementById('import-json-input');
      if (jsonFileInput) {
        jsonFileInput.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            imageManager.importAll(evt.target.result);
            jsonFileInput.value = '';
          };
          reader.readAsText(file);
        };
      }

      // 3. Navegación por Teclado
      window.addEventListener('keydown', (e) => {
        // Si hay un modal abierto, verificar Esc
        if (STATE.currentModal) {
          if (e.key === 'Escape') {
            Modal.close();
            e.preventDefault();
          }
          return;
        }

        // Si el usuario está escribiendo en un input, ignorar atajos de slide
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          return;
        }

        switch (e.key) {
          case 'ArrowRight':
          case 'PageDown':
          case ' ': // Barra espaciadora
            this.next();
            e.preventDefault();
            break;
          case 'ArrowLeft':
          case 'PageUp':
            this.prev();
            e.preventDefault();
            break;
          case 'Home':
            this.goToSlide(0);
            e.preventDefault();
            break;
          case 'End':
            this.goToSlide(STATE.totalSlides - 1);
            e.preventDefault();
            break;
          case 'o':
          case 'O':
            Modal.open('index-overlay');
            e.preventDefault();
            break;
          case 'g':
          case 'G':
            Modal.open('grid-overlay');
            e.preventDefault();
            break;
          case 'f':
          case 'F':
            this.toggleFullscreen();
            e.preventDefault();
            break;
          case 'p':
          case 'P':
            this.togglePresenterMode();
            e.preventDefault();
            break;
          case 't':
          case 'T':
            this.toggleTheme();
            e.preventDefault();
            break;
        }
      });

      // 4. Soporte para pegar imágenes desde el portapapeles (Ctrl+V / Cmd+V)
      window.addEventListener('paste', (e) => {
        if (!document.hasFocus()) return;
        if (STATE.currentModal) return;

        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              imageManager.setImage(STATE.currentIndex, file);
              e.preventDefault();
              break;
            }
          }
        }
      });

      // 5. Swipe táctil en móviles y tablets
      window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          STATE.touchStartX = e.touches[0].clientX;
          STATE.touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchend', (e) => {
        if (!STATE.touchStartX) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = STATE.touchStartX - touchEndX;
        const diffY = STATE.touchStartY - touchEndY;

        // Umbral de 50px horizontal predominante
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) this.next();
          else this.prev();
        }
        STATE.touchStartX = 0;
        STATE.touchStartY = 0;
      }, { passive: true });

      // 6. Rueda del mouse con debounce estricto de 900ms
      window.addEventListener('wheel', (e) => {
        if (STATE.currentModal) return;
        if (STATE.wheelDebounceTimer) return;

        if (Math.abs(e.deltaY) > 25) {
          if (e.deltaY > 0) this.next();
          else this.prev();

          STATE.wheelDebounceTimer = setTimeout(() => {
            STATE.wheelDebounceTimer = null;
          }, 900);
        }
      }, { passive: true });

      // 7. Cierre de modales al clickear fuera del panel
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.onclick = (e) => {
          if (e.target === overlay) {
            Modal.close(overlay.id);
          }
        };
      });

      // 8. Botones de cerrar en modales
      document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.onclick = () => {
          const parentOverlay = btn.closest('.modal-overlay');
          if (parentOverlay) Modal.close(parentOverlay.id);
        };
      });
    },

    /**
     * Vinculación de zonas interactivas de subida de imagen (Click, Drag&Drop)
     */
    bindImageDropzones() {
      const hiddenInput = document.getElementById('slide-image-file-input');
      let activeTargetSlideIndex = 0;

      // Delegación de eventos en dropzones
      document.querySelectorAll('.dropzone-container').forEach(dropzone => {
        const slideIndex = parseInt(dropzone.getAttribute('data-slide-index'), 10);

        // Click en dropzone abre explorador de archivos si no es botón de toolbar
        dropzone.addEventListener('click', (e) => {
          if (e.target.closest('.image-toolbar')) return;
          activeTargetSlideIndex = slideIndex;
          if (hiddenInput) {
            hiddenInput.value = '';
            hiddenInput.click();
          }
        });

        // Drag & Drop
        dropzone.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('is-dragover');
        });

        dropzone.addEventListener('dragleave', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('is-dragover');
        });

        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('is-dragover');

          const files = e.dataTransfer.files;
          if (files && files[0]) {
            imageManager.setImage(slideIndex, files[0]);
          }
        });

        // Botones de la barra flotante sobre la imagen
        const changeBtn = dropzone.querySelector('.btn-change');
        const fitBtn = dropzone.querySelector('.btn-fit');
        const metaBtn = dropzone.querySelector('.btn-meta');
        const removeBtn = dropzone.querySelector('.btn-remove');

        if (changeBtn) {
          changeBtn.onclick = (e) => {
            e.stopPropagation();
            activeTargetSlideIndex = slideIndex;
            if (hiddenInput) {
              hiddenInput.value = '';
              hiddenInput.click();
            }
          };
        }

        if (fitBtn) {
          fitBtn.onclick = (e) => {
            e.stopPropagation();
            const record = imageManager.getImage(slideIndex);
            if (!record) return;

            // Ciclo de ajuste: cover -> contain -> center -> cover
            const modes = ['cover', 'contain', 'center'];
            const currentIndex = modes.indexOf(record.fit || 'cover');
            const nextMode = modes[(currentIndex + 1) % modes.length];
            record.fit = nextMode;

            localStorage.setItem(`${imageManager.KEY_PREFIX}${slideIndex}`, JSON.stringify(record));
            imageManager.renderImageInSlide(slideIndex, record);
            Toast.show(`Modo de ajuste cambiado a: ${nextMode}`, 'info');
          };
        }

        if (metaBtn) {
          metaBtn.onclick = (e) => {
            e.stopPropagation();
            this.openMetaDialog(slideIndex);
          };
        }

        if (removeBtn) {
          removeBtn.onclick = (e) => {
            e.stopPropagation();
            imageManager.removeImage(slideIndex);
          };
        }
      });

      // Manejador del input de archivo oculto
      if (hiddenInput) {
        hiddenInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            imageManager.setImage(activeTargetSlideIndex, file);
          }
        });
      }
    },

    /**
     * Abre el modal para editar texto alternativo (alt) y pie de foto (caption)
     */
    openMetaDialog(slideIndex) {
      const record = imageManager.getImage(slideIndex) || { alt: '', caption: '', fit: 'cover' };
      const dialogOverlay = document.getElementById('dialog-overlay');
      const titleEl = document.getElementById('dialog-title');
      const bodyEl = document.getElementById('dialog-body');
      const confirmBtn = document.getElementById('dialog-confirm-btn');

      titleEl.textContent = `Ajustar Metadata · Slide ${slideIndex + 1}`;
      bodyEl.innerHTML = `
        <div class="dialog-form-group">
          <label class="dialog-label" for="meta-alt-input">Texto Alternativo (Alt obligatorio para accesibilidad):</label>
          <input type="text" id="meta-alt-input" class="dialog-input" value="${record.alt || ''}" placeholder="Descripción de la imagen o diagrama..." />
        </div>
        <div class="dialog-form-group">
          <label class="dialog-label" for="meta-caption-input">Pie de Foto (Opcional, visible bajo la imagen):</label>
          <input type="text" id="meta-caption-input" class="dialog-input" value="${record.caption || ''}" placeholder="Ej: Figura 1. Esquema de replicación" />
        </div>
        <div class="dialog-form-group">
          <label class="dialog-label" for="meta-fit-select">Ajuste de Visualización:</label>
          <select id="meta-fit-select" class="dialog-select">
            <option value="cover" ${record.fit === 'cover' ? 'selected' : ''}>Cover (Llenar contenedor)</option>
            <option value="contain" ${record.fit === 'contain' ? 'selected' : ''}>Contain (Ajustar completa con márgenes)</option>
            <option value="center" ${record.fit === 'center' ? 'selected' : ''}>Center (Escala 1:1 centrada)</option>
          </select>
        </div>
      `;

      confirmBtn.className = 'btn-primary';
      confirmBtn.textContent = 'Guardar Cambios';

      confirmBtn.onclick = () => {
        const altVal = document.getElementById('meta-alt-input').value.trim();
        const captionVal = document.getElementById('meta-caption-input').value.trim();
        const fitVal = document.getElementById('meta-fit-select').value;

        record.alt = altVal || `Imagen diapositiva ${slideIndex + 1}`;
        record.caption = captionVal;
        record.fit = fitVal;

        localStorage.setItem(`${imageManager.KEY_PREFIX}${slideIndex}`, JSON.stringify(record));
        imageManager.renderImageInSlide(slideIndex, record);
        Modal.close('dialog-overlay');
        Toast.show('Metadatos actualizados correctamente.', 'success');
      };

      Modal.open('dialog-overlay');
    }
  };

  // Inicializar al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    PresentationEngine.init();
  });

})();
