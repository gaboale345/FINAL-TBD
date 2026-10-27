# 🏛️ Presentación Web Editorial · Migración de Base de Datos y Escalabilidad

Una presentación web de grado académico y diseño editorial de agencia construida con **HTML5, CSS3 y Vanilla JavaScript**, inspirada en la tipografía editorial suiza y diagramas técnicos modernos. 

Funciona de forma **100% autónoma en el navegador**, sin frameworks pesados, sin herramientas de compilación (`build steps`), y sin requerir conexión a internet una vez cargadas las fuentes de Google Fonts.

---

## 🚀 Inicio Rápido

1. **Abrir directamente:**
   Haga doble clic en `index.html` en su explorador de archivos. Se abrirá en cualquier navegador moderno (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
2. **Servidor local opcional (si se prefiere):**
   ```bash
   # En Windows PowerShell o terminal:
   npx serve .
   # o con Python:
   python -m http.server 8000
   ```

---

## 📁 Estructura del Proyecto

```text
/presentacion
├── index.html        # Estructura semántica, HUD, modales y overlays
├── styles.css        # Dirección de arte editorial, tokens CSS, responsive y temas
├── slides.js         # Contenido temático (13 slides extraídas del PDF) y SVGs
├── script.js         # Motor de navegación, gestor de compresión y persistencia local
└── README.md         # Guía de uso, personalización y soporte técnico
```

---

## 🎨 Personalización Editorial

### 1. Modificar Integrantes, Título y Textos
Abra el archivo `slides.js`. Al inicio encontrará el objeto de configuración:

```javascript
// EDITAR AQUÍ: Información de autores y metadatos del proyecto
const PRESENTATION_CONFIG = {
  title: "Migración de Base de Datos y Pruebas de Escalabilidad",
  institution: "Universidad Privada Domingo Savio",
  degree: "Ingeniería en Sistemas",
  authors: [
    { name: "Adriana Rodríguez Sotelo Gabriel", role: "Investigadora / Sistemas" },
    { name: "Kevin Alcon Maydana", role: "Investigador / Sistemas" }
  ],
  advisors: [
    { name: "Ing. Pablo Moscoso Zeballos", role: "Docente Revisor" }
  ]
};
```

Para cada una de las 13 diapositivas en el arreglo `SLIDES`:
- `eyebrow`: Categoría superior (ej. `01 · CONTEXTO Y DESAFÍO`).
- `title`: Título principal. Puede envolver palabras clave con `<em>palabra</em>` para activar la cursiva editorial violeta.
- `body`: Texto explicativo (mantener `< 80 palabras` para preservar el tiempo de lectura `< 15 segundos`).
- `list`: Arreglo de cadenas de texto que se renderizan con numeración itálica `01`, `02`, etc.

### 2. Cambiar la Paleta de Colores
En `styles.css`, la paleta se rige por variables CSS en `:root`:

```css
:root {
  --bg: #f4eee5;           /* Crema cálido de fondo */
  --bg-2: #ede4d4;         /* Crema tonal para paneles y tarjetas */
  --ink: #1c1530;          /* Midnight plum para tipografía de alto contraste */
  --ink-soft: #4a3f5c;     /* Plum suave para cuerpos de texto */
  --accent: #d43b2c;       /* Coral calibrado para cumplir WCAG AA >= 4.5:1 */
  --accent-2: #6c4ab6;     /* Violeta editorial */
  --gold: #966712;         /* Acento dorado */
  --line: rgba(28, 21, 48, 0.14); /* Líneas de división sutiles */
}
```

> **Nota de Accesibilidad:** El color `--accent` original `#ff5b4a` ha sido calibrado a `#d43b2c` sobre fondo crema para superar el ratio de contraste exigido por **WCAG 2.1 AA** (4.65:1).

### 3. Reemplazar o Personalizar los SVGs
En `slides.js`, el objeto `SVGS` contiene los 13 gráficos vectoriales en línea. Cada uno implementa animaciones CSS sutiles mediante las clases:
- `.svg-dash`: efecto de trazado dinámico con `stroke-dashoffset`.
- `.svg-spin`: rotación orbital lenta.
- `.svg-float`: levitación vertical suave.

Puede insertar cualquier código SVG estándar reemplazando el string correspondiente.

---

## 📤 Sistema de Imágenes Locales (100% en Navegador)

Cada una de las diapositivas (de la 1 a la 13) cuenta con una zona visual interactiva donde puede subir capturas del PDF (`presentacion.pdf`), diagramas de MySQL Workbench, salidas de `mysqlslap` o tablas de reconciliación.

### Tres formas de subir imágenes:
1. **Click en la zona:** Abre el cuadro de selección de archivos del sistema operativo.
2. **Arrastrar y soltar (Drag & Drop):** Arrastre un archivo sobre la zona. Se activará un borde punteado coral y fondo translúcido.
3. **Pegar con `Ctrl + V` o `Cmd + V`:** Tome una captura de pantalla con su herramienta habitual y simplemente presione pegar mientras visualiza la diapositiva activa.

### Características del Motor de Imágenes:
- **Compresión Automática con `<canvas>`:** Las imágenes raster (PNG, JPG, WebP) se redimensionan proporcionalmente a un ancho máximo de **1600 px** y se comprimen en formato JPEG al **85% de calidad**, reduciendo el tamaño en ~80% sin pérdida visual perceptible.
- **Sanitización de SVGs:** Los archivos `.svg` subidos son analizados por un `DOMParser` para eliminar etiquetas `<script>`, iframes y controladores de eventos (`onload`, `onclick`, `javascript:`), blindando la aplicación contra inyecciones XSS.
- **Persistencia en `localStorage`:** Las imágenes se guardan bajo las claves `deck_img_0` a `deck_img_12`. Permanecen disponibles al recargar la página o presionar F5.
- **Control de Cuota:** El sistema vigila el uso del almacenamiento local y emite una alerta si se supera el 80% del límite del navegador.
- **Botonera Flotante:** Al pasar el cursor sobre una imagen cargada, puede:
  - **Cambiar:** Seleccionar un nuevo archivo.
  - **Ajustar:** Alternar entre los modos `cover` (llenar), `contain` (ajustar completa) y `center` (escala 1:1).
  - **Meta:** Definir el texto alternativo `alt` (obligatorio para accesibilidad) y un pie de foto visible (`caption`).
  - **Quitar (✕):** Eliminar la imagen y restaurar el placeholder vectorial ilustrado.

### Exportación e Importación JSON:
- **Exportar:** Descarga un archivo `.json` estructurado con todas las imágenes en base64 y sus metadatos.
- **Importar:** Permite cargar este archivo `.json` en otra computadora o navegador, restaurando de inmediato todas las ilustraciones de la presentación.
- **Limpiar:** Abre un modal de confirmación seguro para eliminar todas las claves de imágenes en un solo paso.

> 🔒 **Declaración de Privacidad:**  
> Las imágenes y datos jamás salen del navegador. No existe ningún servidor, base de datos externa ni telemetría. Toda la compresión, guardado y transferencia mediante JSON ocurre estrictamente en el entorno local del usuario.

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
| :--- | :--- |
| `→`, `Espacio`, `AvPág` | Siguiente diapositiva |
| `←`, `RePág` | Diapositiva anterior |
| `Home` | Ir a la primera diapositiva (Portada) |
| `End` | Ir a la última diapositiva (Cierre) |
| `O` | Abrir / Cerrar el **Índice general** |
| `G` | Alternar la **Vista en Cuadrícula** (13 slides) |
| `P` | Abrir la **Consola del Presentador** con cronómetro |
| `F` | Alternar pantalla completa nativa |
| `Esc` | Cerrar cualquier overlay o modal activo |
| `Ctrl + V` / `Cmd + V` | Pegar imagen en la diapositiva actual |

---

## 📱 Soporte y Compatibilidad Responsive

- **Desktop (≥ 1280px):** Layout asimétrico en 2 columnas con dots de navegación rápida y atajos en pantalla. Aspect ratio 16:9 con letterboxing.
- **Tablet (768px – 1279px):** Reducción de márgenes y tipografía escalada mediante funciones `clamp()`.
- **Móvil (< 768px / 375px):** Colapso a una sola columna vertical, navegación táctil por deslizamiento (`swipe`), dots ocultos para evitar distracciones y altura máxima de imagen limitada a `34vh` para no desplazar el contenido.
- **Accesibilidad:** Soporta `prefers-reduced-motion: reduce` (desactivación inmediata de rotaciones, destellos y transiciones), navegación 100% operable por teclado con `Tab` y `:focus-visible` de alto contraste, y anuncios en el contador mediante `aria-live="polite"`.

---

## 🌐 Navegadores Certificados

- **Google Chrome** 90+ (Windows, macOS, Linux, Android)
- **Mozilla Firefox** 90+ (Windows, macOS, Linux)
- **Apple Safari** 14+ (macOS, iOS, iPadOS)
- **Microsoft Edge** 90+ (Windows, macOS)
