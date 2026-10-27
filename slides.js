/**
 * ====================================================================
 * SLIDES.JS · CONTENIDO EDITORIAL Y SVGs (13 DIAPOSITIVAS)
 * ====================================================================
 * Proyecto: Migración de Base de Datos y Pruebas de Escalabilidad
 * Universidad Privada Domingo Savio — Proyecto Final de Grado
 * 
 * INSTRUCCIONES DE PERSONALIZACIÓN:
 * 1. Para cambiar integrantes, título o fecha de portada: ver SLIDE 1 (// EDITAR AQUÍ).
 * 2. Para cambiar textos de cada slide: edite los campos 'eyebrow', 'title', 'body' y 'list'.
 * 3. En los títulos, use <em>palabra</em> para aplicar el estilo editorial en cursiva violeta (--accent-2).
 * 4. Las propiedades 'svg' contienen los placeholders vectoriales interactivos.
 * ====================================================================
 */

const PRESENTATION_CONFIG = {
  // Configuración general de la presentación
  title: "Migración de Base de Datos y Pruebas de Escalabilidad",
  subtitle: "PostgreSQL a MySQL 8.0 · Integridad, Rendimiento y Seguridad",
  institution: "Universidad Privada Domingo Savio",
  degree: "Ingeniería en Sistemas",
  location: "Santa Cruz de la Sierra – Bolivia",
  date: "26 de octubre de 2026",
  durationMinutes: 15, // Duración recomendada de exposición
  
  // // EDITAR AQUÍ: Integrantes del equipo y docente
  authors: [
    { name: "Adriana Rodríguez Sotelo Gabriel", role: "Investigadora / Sistemas" },
    { name: "Kevin Alcon Maydana", role: "Investigador / Sistemas" }
  ],
  advisors: [
    { name: "Ing. Pablo Moscoso Zeballos", role: "Docente Revisor" }
  ]
};

/**
 * SVGS VECTORIALES INTERACTIVOS (12 ESTILOS DISTINTOS + PORTADA)
 * Cada SVG incluye clases CSS (.svg-dash, .svg-spin, .svg-float) para animaciones sutiles.
 */
const SVGS = {
  // Slide 1: Sello arquitectónico / Constelación geométrica
  sealGeometry: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Geometría orbital representativa">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--accent)" />
          <stop offset="100%" stop-color="var(--accent-2)" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="250" r="190" stroke="var(--line)" stroke-width="1.5" fill="none" class="svg-dash" />
      <circle cx="250" cy="250" r="140" stroke="url(#grad1)" stroke-width="2" stroke-dasharray="6 8" fill="none" class="svg-spin" />
      <circle cx="250" cy="250" r="90" stroke="var(--line)" stroke-width="1.5" fill="none" />
      <circle cx="250" cy="250" r="45" fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)" stroke-width="2" />
      <circle cx="250" cy="250" r="12" fill="var(--accent-2)" class="svg-pulse" />
      <!-- Nodos satelitales -->
      <g class="svg-float">
        <circle cx="250" cy="60" r="8" fill="var(--accent)" />
        <circle cx="440" cy="250" r="8" fill="var(--accent-2)" />
        <circle cx="250" cy="440" r="8" fill="var(--gold)" />
        <circle cx="60" cy="250" r="8" fill="var(--ink-soft)" />
        <line x1="250" y1="60" x2="250" y2="440" stroke="var(--line)" stroke-dasharray="4 4" />
        <line x1="60" y1="250" x2="440" y2="250" stroke="var(--line)" stroke-dasharray="4 4" />
      </g>
    </svg>`,

  // Slide 2: Círculos concéntricos multicapa
  concentricCircles: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Círculos concéntricos de arquitectura de datos">
      <circle cx="250" cy="250" r="210" stroke="var(--line)" stroke-width="1" fill="none" />
      <circle cx="250" cy="250" r="175" stroke="var(--accent-2)" stroke-width="2" stroke-dasharray="8 6" fill="none" class="svg-spin" />
      <circle cx="250" cy="250" r="130" stroke="var(--accent)" stroke-width="1.8" fill="none" class="svg-dash" />
      <circle cx="250" cy="250" r="85" stroke="var(--gold)" stroke-width="2" stroke-dasharray="3 4" fill="none" />
      <circle cx="250" cy="250" r="40" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5" />
      <circle cx="250" cy="250" r="6" fill="var(--accent-2)" />
      <!-- Rayos decorativos -->
      <line x1="250" y1="40" x2="250" y2="90" stroke="var(--line)" stroke-width="2" />
      <line x1="250" y1="410" x2="250" y2="460" stroke="var(--line)" stroke-width="2" />
      <line x1="40" y1="250" x2="90" y2="250" stroke="var(--line)" stroke-width="2" />
      <line x1="410" y1="250" x2="460" y2="250" stroke="var(--line)" stroke-width="2" />
    </svg>`,

  // Slide 3: Triángulos y prismas isométricos
  isometricTriangles: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prisma geométrico y objetivos">
      <polygon points="250,70 410,380 90,380" stroke="var(--line)" stroke-width="1.5" fill="none" />
      <polygon points="250,130 370,360 130,360" stroke="var(--accent-2)" stroke-width="2" stroke-dasharray="6 4" fill="none" class="svg-dash" />
      <polygon points="250,190 330,340 170,340" stroke="var(--accent)" stroke-width="2" fill="var(--accent-soft)" />
      <circle cx="250" cy="70" r="7" fill="var(--accent)" class="svg-pulse" />
      <circle cx="410" cy="380" r="7" fill="var(--accent-2)" />
      <circle cx="90" cy="380" r="7" fill="var(--gold)" />
      <line x1="250" y1="70" x2="250" y2="340" stroke="var(--line)" stroke-dasharray="3 3" />
    </svg>`,

  // Slide 4: Blueprint esquemático y entidades relacionales
  blueprintGrid: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Esquema técnico relacional de tablas">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#smallGrid)" rx="12" />
      <!-- Tablas relacionales -->
      <rect x="70" y="80" width="140" height="90" rx="6" fill="var(--bg-2)" stroke="var(--accent-2)" stroke-width="2" />
      <text x="85" y="105" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="var(--ink)">CLIENTES</text>
      <line x1="70" y1="115" x2="210" y2="115" stroke="var(--line)" />
      <text x="85" y="132" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">PK: id_cliente</text>
      <text x="85" y="148" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">nombre, correo</text>

      <rect x="290" y="80" width="140" height="90" rx="6" fill="var(--bg-2)" stroke="var(--accent-2)" stroke-width="2" />
      <text x="305" y="105" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="var(--ink)">PRODUCTOS</text>
      <line x1="290" y1="115" x2="430" y2="115" stroke="var(--line)" />
      <text x="305" y="132" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">PK: id_producto</text>
      <text x="305" y="148" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">precio, stock</text>

      <rect x="180" y="230" width="140" height="90" rx="6" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2" />
      <text x="195" y="255" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="var(--accent)">VENTAS</text>
      <line x1="180" y1="265" x2="320" y2="265" stroke="var(--line)" />
      <text x="195" y="282" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">PK: id_venta</text>
      <text x="195" y="298" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">FK: id_cliente</text>

      <rect x="180" y="370" width="140" height="80" rx="6" fill="var(--bg-2)" stroke="var(--gold)" stroke-width="2" />
      <text x="195" y="395" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="var(--ink)">DETALLE_VENTA</text>
      <line x1="180" y1="405" x2="320" y2="405" stroke="var(--line)" />
      <text x="195" y="422" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">FKs: id_venta, id_prod</text>

      <!-- Conectores relacionales -->
      <path d="M 140 170 L 140 275 L 180 275" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-dasharray="4 3" class="svg-dash" />
      <path d="M 360 170 L 360 410 L 320 410" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-dasharray="4 3" class="svg-dash" />
      <line x1="250" y1="320" x2="250" y2="370" stroke="var(--accent)" stroke-width="2" />
    </svg>`,

  // Slide 5: Flechas de flujo y pipeline de migración
  flowPipeline: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pipeline de migración de datos">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--accent)" />
        </marker>
      </defs>
      <path d="M 80 120 C 200 120, 200 250, 250 250 C 300 250, 300 380, 420 380" fill="none" stroke="var(--accent)" stroke-width="3" marker-end="url(#arrow)" class="svg-dash" />
      <circle cx="80" cy="120" r="30" fill="var(--bg-2)" stroke="var(--ink)" stroke-width="2" />
      <text x="64" y="125" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="var(--ink)">PG 18</text>
      
      <circle cx="250" cy="250" r="36" fill="var(--bg-2)" stroke="var(--accent-2)" stroke-width="2" class="svg-spin" stroke-dasharray="6 4" />
      <text x="233" y="255" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="var(--accent-2)">ETL</text>
      
      <circle cx="420" cy="380" r="30" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2" />
      <text x="402" y="385" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="var(--accent)">MySQL</text>

      <rect x="180" y="70" width="140" height="34" rx="4" fill="var(--bg-2)" stroke="var(--line)" />
      <text x="195" y="92" font-family="Inter, sans-serif" font-size="11" fill="var(--ink-soft)">CSV / UTF-8</text>
      <rect x="180" y="390" width="140" height="34" rx="4" fill="var(--bg-2)" stroke="var(--line)" />
      <text x="195" y="412" font-family="Inter, sans-serif" font-size="11" fill="var(--ink-soft)">utf8mb4 DDL</text>
    </svg>`,

  // Slide 6: Ondas armónicas y conversión de tipos
  waveforms: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ondas de adaptación de sintaxis">
      <path d="M 40 180 Q 140 90, 250 180 T 460 180" fill="none" stroke="var(--accent-2)" stroke-width="3" class="svg-dash" />
      <path d="M 40 250 Q 140 160, 250 250 T 460 250" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="8 6" class="svg-float" />
      <path d="M 40 320 Q 140 230, 250 320 T 460 320" fill="none" stroke="var(--gold)" stroke-width="2" />
      <!-- Nodos de conversión -->
      <circle cx="145" cy="135" r="6" fill="var(--accent)" />
      <circle cx="355" cy="225" r="6" fill="var(--accent-2)" />
      <circle cx="250" cy="250" r="10" fill="var(--bg-2)" stroke="var(--ink)" stroke-width="2" />
    </svg>`,

  // Slide 7: Matriz de puntos y reconciliación de datos
  dotMatrix: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matriz de reconciliación de registros">
      <defs>
        <pattern id="matrixDots" width="36" height="36" patternUnits="userSpaceOnUse">
          <circle cx="18" cy="18" r="2.5" fill="var(--line)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#matrixDots)" />
      <!-- Cuadro de verificación 1:1 -->
      <rect x="110" y="110" width="280" height="280" rx="16" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-dasharray="6 6" class="svg-spin" />
      <rect x="140" y="140" width="220" height="220" rx="12" fill="var(--bg-2)" stroke="var(--line)" />
      <circle cx="250" cy="210" r="32" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" />
      <path d="M 238 210 L 246 218 L 264 200" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <text x="180" y="280" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="var(--ink)">100% CONCILIADO</text>
      <text x="165" y="305" font-family="Inter, sans-serif" font-size="11" fill="var(--ink-soft)">0 Registros Huérfanos</text>
    </svg>`,

  // Slide 8: Escudo criptográfico y mínimo privilegio
  securityShield: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Escudo de seguridad y control de acceso">
      <path d="M 250 80 L 390 140 V 270 C 390 360, 250 420, 250 420 C 250 420, 110 360, 110 270 V 140 Z" fill="var(--bg-2)" stroke="var(--accent-2)" stroke-width="2.5" />
      <path d="M 250 120 L 350 165 V 260 C 350 330, 250 380, 250 380 C 250 380, 150 330, 150 260 V 165 Z" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-dasharray="4 4" class="svg-dash" />
      <circle cx="250" cy="245" r="28" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="2" />
      <!-- Candado estilizado -->
      <path d="M 240 230 C 240 222, 260 222, 260 230 V 238 H 240 Z" fill="none" stroke="var(--ink)" stroke-width="2" />
      <rect x="236" y="238" width="28" height="22" rx="3" fill="var(--ink)" />
      <circle cx="250" cy="248" r="2.5" fill="var(--bg)" />
    </svg>`,

  // Slide 9: Barras funcionales y batería de pruebas
  functionalBars: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Batería de pruebas funcionales">
      <g transform="translate(70, 90)">
        <!-- Barra 1: PF-01 Auth -->
        <rect x="0" y="0" width="360" height="42" rx="6" fill="var(--bg-2)" stroke="var(--line)" />
        <rect x="0" y="0" width="360" height="42" rx="6" fill="var(--accent-soft)" />
        <text x="20" y="26" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">PF-01 Auth & Conexión</text>
        <circle cx="330" cy="21" r="9" fill="var(--accent)" />
        <text x="326" y="25" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#fff">✓</text>

        <!-- Barra 2: PF-02 Consulta -->
        <rect x="0" y="60" width="360" height="42" rx="6" fill="var(--bg-2)" stroke="var(--line)" />
        <text x="20" y="86" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">PF-02 Consulta Integrada</text>
        <circle cx="330" cy="81" r="9" fill="var(--accent-2)" />
        <text x="326" y="85" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#fff">✓</text>

        <!-- Barra 3: PF-03 Transacción Venta -->
        <rect x="0" y="120" width="360" height="42" rx="6" fill="var(--bg-2)" stroke="var(--accent-2)" stroke-width="1.5" />
        <text x="20" y="146" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--accent-2)">PF-03 Inserción Transaccional</text>
        <circle cx="330" cy="141" r="9" fill="var(--accent-2)" />
        <text x="326" y="145" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#fff">✓</text>

        <!-- Barra 4: PF-04 Modificación -->
        <rect x="0" y="180" width="360" height="42" rx="6" fill="var(--bg-2)" stroke="var(--line)" />
        <text x="20" y="206" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">PF-04 Persistencia de Cambios</text>
        <circle cx="330" cy="201" r="9" fill="var(--gold)" />
        <text x="326" y="205" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#fff">✓</text>

        <!-- Barra 5: PF-05 Validación Error -->
        <rect x="0" y="240" width="360" height="42" rx="6" fill="var(--bg-2)" stroke="var(--line)" />
        <text x="20" y="266" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">PF-05 Bloqueo de Inconsistencias</text>
        <circle cx="330" cy="261" r="9" fill="var(--accent)" />
        <text x="326" y="265" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#fff">✓</text>
      </g>
    </svg>`,

  // Slide 10: Canales paralelos de concurrencia (Benchmark)
  concurrencyPipeline: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Canales de concurrencia y escalabilidad">
      <line x1="80" y1="120" x2="420" y2="120" stroke="var(--line)" stroke-width="2" />
      <line x1="80" y1="180" x2="420" y2="180" stroke="var(--line)" stroke-width="2" />
      <line x1="80" y1="240" x2="420" y2="240" stroke="var(--accent)" stroke-width="3" class="svg-dash" />
      <line x1="80" y1="300" x2="420" y2="300" stroke="var(--line)" stroke-width="2" />
      <line x1="80" y1="360" x2="420" y2="360" stroke="var(--line)" stroke-width="2" />

      <!-- Paquetes de concurrencia flotantes -->
      <g class="svg-float">
        <circle cx="160" cy="120" r="10" fill="var(--ink-soft)" />
        <circle cx="280" cy="180" r="12" fill="var(--accent-2)" />
        <circle cx="220" cy="240" r="16" fill="var(--accent)" class="svg-pulse" />
        <circle cx="340" cy="300" r="12" fill="var(--accent-2)" />
        <circle cx="190" cy="360" r="10" fill="var(--gold)" />
      </g>

      <rect x="360" y="80" width="80" height="320" rx="8" fill="var(--bg-2)" stroke="var(--accent-2)" stroke-width="2" stroke-dasharray="4 4" />
      <text x="382" y="245" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="var(--accent-2)" transform="rotate(90, 382, 245)">mysqlslap 100u</text>
    </svg>`,

  // Slide 11: Órbita dual y balance comparativo
  dualOrbit: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparativa técnica PostgreSQL vs MySQL">
      <ellipse cx="250" cy="250" rx="190" ry="110" stroke="var(--line)" stroke-width="2" fill="none" transform="rotate(-25, 250, 250)" />
      <ellipse cx="250" cy="250" rx="190" ry="110" stroke="var(--accent-2)" stroke-width="1.8" stroke-dasharray="8 6" fill="none" transform="rotate(25, 250, 250)" class="svg-spin" />
      
      <!-- Nodo PostgreSQL -->
      <circle cx="110" cy="210" r="42" fill="var(--bg-2)" stroke="var(--ink)" stroke-width="2.5" />
      <text x="86" y="206" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="var(--ink)">PostgreSQL</text>
      <text x="98" y="224" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">Versión 18</text>

      <!-- Nodo MySQL -->
      <circle cx="390" cy="290" r="42" fill="var(--bg-2)" stroke="var(--accent)" stroke-width="2.5" />
      <text x="372" y="286" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="var(--accent)">MySQL</text>
      <text x="374" y="304" font-family="Inter, sans-serif" font-size="10" fill="var(--ink-soft)">Versión 8.0</text>

      <!-- Eje de equilibrio central -->
      <circle cx="250" cy="250" r="14" fill="var(--gold)" />
      <line x1="152" y1="220" x2="348" y2="280" stroke="var(--line)" stroke-width="2" stroke-dasharray="4 4" />
    </svg>`,

  // Slide 12: Espiral armónica áurea (Conclusiones)
  goldenSpiral: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Espiral de conclusiones y lecciones">
      <path d="M 250 250 A 20 20 0 0 1 270 250 A 40 40 0 0 1 230 250 A 80 80 0 0 1 310 250 A 140 140 0 0 1 170 250 A 210 210 0 0 1 380 250" fill="none" stroke="var(--accent-2)" stroke-width="2.5" stroke-dasharray="8 6" class="svg-dash" />
      <circle cx="250" cy="250" r="8" fill="var(--accent)" class="svg-pulse" />
      <circle cx="270" cy="250" r="5" fill="var(--gold)" />
      <circle cx="230" cy="250" r="6" fill="var(--ink-soft)" />
      <circle cx="310" cy="250" r="7" fill="var(--accent-2)" />
      <circle cx="170" cy="250" r="8" fill="var(--accent)" />
      <circle cx="380" cy="250" r="9" fill="var(--gold)" />
    </svg>`,

  // Slide 13: Mandala geométrico de cierre
  sacredMandala: `
    <svg viewBox="0 0 500 500" class="editorial-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Composición armónica final">
      <circle cx="250" cy="250" r="190" stroke="var(--line)" stroke-width="1.5" fill="none" />
      <circle cx="250" cy="250" r="150" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 6" fill="none" class="svg-spin" />
      <circle cx="250" cy="250" r="110" stroke="var(--accent-2)" stroke-width="2" fill="none" class="svg-dash" />
      <circle cx="250" cy="250" r="70" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="3 3" fill="none" />
      <circle cx="250" cy="250" r="30" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" />
      <polygon points="250,90 390,330 110,330" stroke="var(--line)" stroke-width="1.5" fill="none" class="svg-float" />
      <polygon points="250,410 390,170 110,170" stroke="var(--line)" stroke-width="1.5" fill="none" class="svg-float" />
      <circle cx="250" cy="250" r="8" fill="var(--accent-2)" />
    </svg>`
};

/**
 * DEFINICIÓN DE LAS 13 DIAPOSITIVAS
 * Cada slide contiene estructura editorial optimizada:
 * - eyebrow: categoría superior con letter-spacing amplio.
 * - title: titular con énfasis <em> en cursiva violeta.
 * - body: resumen conciso (< 80 palabras, lectura en <15s).
 * - list: puntos clave numerados o con viñeta editorial.
 * - layout: 'portada' | 'content' | 'cierre'
 * - reverse: boolean (true coloca la zona visual a la izquierda).
 * - svgPlaceholder: el arte vectorial correspondiente.
 */
const SLIDES = [
  // ==================================================================
  // SLIDE 1: PORTADA
  // ==================================================================
  {
    id: 1,
    type: "portada",
    eyebrow: "UNIVERSIDAD PRIVADA DOMINGO SAVIO · PROYECTO FINAL",
    title: "Migración de Base de Datos y <br><em>Pruebas de Escalabilidad</em>",
    subtitle: "De PostgreSQL a MySQL 8.0: Continuidad Operativa, Integridad y Rendimiento",
    body: "Defensa de grado que documenta la ejecución metódica de una migración heterogénea entre motores SQL, garantizando cero pérdida de información y evaluando la respuesta bajo concurrencia.",
    // // EDITAR AQUÍ: Información de autores y metadatos del proyecto
    authorsText: "Adriana Rodríguez Sotelo Gabriel · Kevin Alcon Maydana",
    advisorText: "Tutor: Ing. Pablo Moscoso Zeballos · Santa Cruz, Bolivia",
    dateText: "26 de octubre de 2026 · Ingeniería en Sistemas",
    svgPlaceholder: SVGS.sealGeometry,
    defaultAlt: "Sello geométrico representativo de la arquitectura de datos"
  },

  // ==================================================================
  // SLIDE 2: INTRODUCCIÓN Y RETO
  // ==================================================================
  {
    id: 2,
    type: "content",
    reverse: false,
    eyebrow: "01 · CONTEXTO Y DESAFÍO",
    title: "Más allá de una simple <em>copia de tablas</em>",
    body: "Mover datos entre gestores distintos no es solo un volcado sintáctico. Cuando una aplicación en producción depende de esa base de datos, el verdadero desafío radica en preservar la lógica relacional y la estabilidad funcional sin fisuras.",
    list: [
      "Transición heterogénea: PostgreSQL 18 a MySQL 8.0.",
      "Criterio de éxito: Continuidad del sistema sin alterar la información.",
      "Atención a discrepancias de dialecto, secuencias y accesos."
    ],
    svgPlaceholder: SVGS.concentricCircles,
    defaultAlt: "Círculos concéntricos de arquitectura de datos"
  },

  // ==================================================================
  // SLIDE 3: OBJETIVOS
  // ==================================================================
  {
    id: 3,
    type: "content",
    reverse: true, // Visual a la izquierda
    eyebrow: "02 · METAS DEL PROYECTO",
    title: "Integridad, seguridad y <em>rendimiento medible</em>",
    body: "Se definió un marco riguroso para comprobar que el nuevo motor soporte la demanda operativa real, manteniendo estándares estrictos de protección de información.",
    list: [
      "Migrar tablas, relaciones y restricciones sin huérfanos.",
      "Implementar principio de mínimo privilegio en credenciales.",
      "Evaluar la escalabilidad bajo estrés progresivo (1 a 100 usuarios)."
    ],
    svgPlaceholder: SVGS.isometricTriangles,
    defaultAlt: "Prisma isométrico de objetivos del proyecto"
  },

  // ==================================================================
  // SLIDE 4: ESCENARIO MIGRADO
  // ==================================================================
  {
    id: 4,
    type: "content",
    reverse: false,
    eyebrow: "03 · DOMINIO TRANSACCIONAL",
    title: "Estructura relacional de <em>alta dependencia</em>",
    body: "El caso práctico se construyó sobre un sistema de ventas con alta cohesión relacional, asegurando que las pruebas reflejen condiciones de producción.",
    list: [
      "Entidades maestras: 5,000 Clientes y 1,000 Productos.",
      "Entidades operativas: 20,000 Ventas y 20,007 Detalles de venta.",
      "Preservación estricta de PKs, FKs y restricciones de nulabilidad."
    ],
    svgPlaceholder: SVGS.blueprintGrid,
    defaultAlt: "Esquema relacional de tablas de la base de datos"
  },

  // ==================================================================
  // SLIDE 5: EJECUCIÓN TÉCNICA
  // ==================================================================
  {
    id: 5,
    type: "content",
    reverse: true, // Visual a la izquierda
    eyebrow: "04 · PIPELINE DE TRANSFERENCIA",
    title: "Extracción limpia y <em>orden de carga estricto</em>",
    body: "Para evitar fallas de integridad por claves foráneas, la carga de datos siguió una secuencia jerárquica obligatoria desde entidades independientes hacia las transaccionales.",
    list: [
      "Extracción en archivos planos CSV con codificación UTF-8.",
      "Carga inicial: Clientes y Productos (tablas maestras).",
      "Carga secundaria: Ventas y posteriormente Detalle de Venta."
    ],
    svgPlaceholder: SVGS.flowPipeline,
    defaultAlt: "Pipeline secuencial de transferencia de datos"
  },

  // ==================================================================
  // SLIDE 6: AJUSTES E INCOMPATIBILIDADES
  // ==================================================================
  {
    id: 6,
    type: "content",
    reverse: false,
    eyebrow: "05 · RESOLUCIÓN DE DISCREPANCIAS",
    title: "Adaptación técnica entre <em>motores SQL</em>",
    body: "Cada gestor implementa tipos y secuencias de manera particular. Se resolvieron diferencias de dialecto antes de la importación final.",
    list: [
      "SERIAL en PostgreSQL → INT AUTO_INCREMENT en MySQL 8.0.",
      "NUMERIC y TIMESTAMP → DECIMAL y DATETIME equivalentes.",
      "Collation destino: utf8mb4 para preservar caracteres del español."
    ],
    svgPlaceholder: SVGS.waveforms,
    defaultAlt: "Ondas armónicas de transformación técnica de tipos"
  },

  // ==================================================================
  // SLIDE 7: VALIDACIÓN DE INTEGRIDAD
  // ==================================================================
  {
    id: 7,
    type: "content",
    reverse: true, // Visual a la izquierda
    eyebrow: "06 · AUDITORÍA DE DATOS",
    title: "Reconciliación precisa: <em>cero registros huérfanos</em>",
    body: "La importación no se dio por válida hasta cotejar conteos exactos e integridad referencial contra la base de datos origen en PostgreSQL.",
    list: [
      "Conteo 1:1 confirmado en todas las tablas del sistema.",
      "Ausencia total de registros huérfanos en detalle_venta.",
      "Mapeo de integridad verificado con consultas directas en Workbench."
    ],
    svgPlaceholder: SVGS.dotMatrix,
    defaultAlt: "Matriz de verificación y reconciliación de datos"
  },

  // ==================================================================
  // SLIDE 8: CONFIDENCIALIDAD Y ACCESOS
  // ==================================================================
  {
    id: 8,
    type: "content",
    reverse: false,
    eyebrow: "07 · SEGURIDAD DEFENSIVA",
    title: "Principio de <em>mínimo privilegio</em>",
    body: "La seguridad fue tratada como pilar esencial: la aplicación jamás se conectó con credenciales administrativas, limitando la superficie de ataque.",
    list: [
      "Separación estricta: cuenta 'root' vs cuenta exclusiva de la app.",
      "Privilegios limitados a DML (SELECT, INSERT, UPDATE, DELETE).",
      "Prueba de intrusión controlada: rechazo de sentencias DDL desde la app."
    ],
    svgPlaceholder: SVGS.securityShield,
    defaultAlt: "Escudo de seguridad y control de acceso por roles"
  },

  // ==================================================================
  // SLIDE 9: PRUEBAS FUNCIONALES
  // ==================================================================
  {
    id: 9,
    type: "content",
    reverse: true, // Visual a la izquierda
    eyebrow: "08 · VALIDACIÓN OPERATIVA",
    title: "Comportamiento del sistema <em>extremo a extremo</em>",
    body: "Se ejecutó una batería de seis casos de prueba (PF-01 a PF-06) sobre los flujos neurálgicos, validando la interfaz y su impacto en la base de datos.",
    list: [
      "PF-01 a PF-03: Autenticación, consultas y registro de ventas completas.",
      "PF-04: Modificación persistente de información operativa.",
      "PF-05 & PF-06: Bloqueo de datos inválidos y anulación lógica de pedidos."
    ],
    svgPlaceholder: SVGS.functionalBars,
    defaultAlt: "Barras de comprobación de casos de prueba funcionales"
  },

  // ==================================================================
  // SLIDE 10: PRUEBAS DE ESCALABILIDAD
  // ==================================================================
  {
    id: 10,
    type: "content",
    reverse: false,
    eyebrow: "09 · BENCHMARK BAJO ESTRÉS",
    title: "Respuesta ante <em>incremento de concurrencia</em>",
    body: "Mediante la utilidad mysqlslap se evaluaron 5 escenarios de carga (E1 a E5) desde 1 hasta 100 usuarios simultáneos ejecutando consultas complejas con JOIN.",
    list: [
      "E1 a E3 (1 a 25 usuarios): Tiempos subsegundo y 0% tasa de error.",
      "E4 y E5 (50 a 100 usuarios): Degradación controlada sin bloqueos.",
      "Identificación precisa del umbral de saturación para optimización."
    ],
    svgPlaceholder: SVGS.concurrencyPipeline,
    defaultAlt: "Canales de flujo concurrente y carga de estrés"
  },

  // ==================================================================
  // SLIDE 11: COMPARACIÓN ORIGEN VS DESTINO
  // ==================================================================
  {
    id: 11,
    type: "content",
    reverse: true, // Visual a la izquierda
    eyebrow: "10 · MATRIZ COMPARATIVA",
    title: "PostgreSQL 18 vs <em>MySQL 8.0</em>",
    body: "El objetivo no fue declarar un ganador abstracto, sino constatar que el nuevo entorno preserva el rendimiento y la confiabilidad del negocio.",
    list: [
      "Disponibilidad e Integridad: Idéntica solidez referencial.",
      "Adaptación del software: Conexión transparente tras ajuste DDL.",
      "Seguridad y Rendimiento: Mínimo privilegio activo y respuesta ágil."
    ],
    svgPlaceholder: SVGS.dualOrbit,
    defaultAlt: "Órbita dual comparativa PostgreSQL y MySQL"
  },

  // ==================================================================
  // SLIDE 12: RESULTADOS Y CONCLUSIONES
  // ==================================================================
  {
    id: 12,
    type: "content",
    reverse: false,
    eyebrow: "11 · SÍNTESIS DEL PROYECTO",
    title: "Una migración <em>técnicamente utilizable</em>",
    body: "Tratar la base de datos y la aplicación como una unidad indivisible garantizó el éxito del proyecto, demostrando que una migración heterogénea es viable y segura.",
    list: [
      "100% de coherencia relacional sin registros descartados.",
      "Transición invisible y neutra para el usuario final del sistema.",
      "Línea base de escalabilidad validada empíricamente para producción."
    ],
    svgPlaceholder: SVGS.goldenSpiral,
    defaultAlt: "Espiral armónica de conclusiones y lecciones aprendidas"
  },

  // ==================================================================
  // SLIDE 13: RECOMENDACIONES Y CIERRE
  // ==================================================================
  {
    id: 13,
    type: "cierre",
    reverse: false,
    eyebrow: "12 · CIERRE Y BUENAS PRÁCTICAS",
    title: "Gracias por <em>su atención</em>",
    subtitle: "Ronda de preguntas y defensa técnica abierta",
    body: "Recomendaciones clave: conservar el respaldo del entorno anterior durante el periodo de estabilización, auditar índices de alto tráfico y aislar permanentemente las credenciales administrativas.",
    list: [
      "Adriana Rodríguez Sotelo Gabriel",
      "Kevin Alcon Maydana",
      "Ingeniería en Sistemas · Universidad Privada Domingo Savio"
    ],
    svgPlaceholder: SVGS.sacredMandala,
    defaultAlt: "Mandala armónico de cierre de presentación"
  }
];
