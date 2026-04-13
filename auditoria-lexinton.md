# Auditoría Técnica Completa — Lexinton Propiedades
### lexinton.com.ar · Abril 2026 · Elaborado por: Desarrollador Freelance

---

## 1. Executive Summary

Lexinton Propiedades opera actualmente sobre un sitio web en **WordPress 6.9.4** con el tema premium **Houzez v4.1.0**, un tema real estate de ThemeForest. El sitio fue desarrollado por la agencia **Optium (optium.com.ar)** y se mantiene alojado en un servidor Apache sin CDN, lo cual explica las velocidades de carga por encima del promedio esperado para una inmobiliaria de su nivel.

La integración con **Tokko Broker** (su CRM inmobiliario) se realiza a través de un plugin de sincronización que importa las propiedades de Tokko como Custom Post Types (CPTs) de WordPress dentro del sistema Houzez. Esto crea una cadena de dependencias frágil: Tokko → plugin de sync → Houzez CPT → Elementor. Cada actualización de WordPress, Houzez o el plugin de sync puede romper la visualización de propiedades.

**Hallazgo clave:** El sitio **NO utiliza Cliengo**. Usa en cambio **JoinChat** (plugin de WhatsApp), que es un botón flotante de WhatsApp, no un chatbot con captura de leads. No se detectaron Google Analytics, Google Tag Manager ni Facebook Pixel activos, lo que representa un punto ciego total en analítica de conversiones.

La recomendación principal es **migrar a Next.js 14** con integración directa a la API REST de Tokko, aprovechando el trabajo previo ya construido (leads Meta Ads → Sheets, WhatsApp API, agenda). La nueva web daría performance, SEO y experiencia de usuario considerablemente superiores, con posibilidad de escalar funcionalidades sin depender de plugins de terceros.

---

## 2. Stack Tecnológico Actual

| Tecnología | Versión | Rol | Estado |
|---|---|---|---|
| **WordPress** | 6.9.4 | CMS base | ⚠️ Activo, versión reciente |
| **Houzez Theme** | 4.1.0 | Tema real estate + CPTs propiedades | ⚠️ Premium, ~$69 ThemeForest, actualizaciones de pago |
| **Elementor** | 3.35.5 | Page builder (layout de páginas) | ⚠️ Carga pesada de JS/CSS |
| **Houzez Theme Functionality** | N/D | Plugin companion del tema (widgets, CPTs) | ⚠️ Acoplado al tema |
| **Yoast SEO** | 27.1 | SEO on-page, sitemap XML | ✅ Activo, configurado |
| **JoinChat** | 6.0.10 | Botón flotante WhatsApp (creame-whatsapp-me) | ✅ Activo |
| **Tokko Broker Sync** | N/D | Importador de propiedades Tokko → WordPress CPT | ⚠️ Plugin de terceros, crítico |
| **reCAPTCHA** | v2 | Protección de formularios | ✅ Activo |
| **Leaflet.js** | N/D | Mapas de propiedades (OpenStreetMap) | ✅ Activo, gratuito |
| **jQuery UI** | 1.13.3 | Componentes UI interactivos | ⚠️ Dependencia legacy |
| **Apache** | N/D | Servidor web | ⚠️ Sin CDN |
| **Google Analytics / GTM** | — | Analytics | ❌ NO DETECTADO |
| **Facebook Pixel** | — | Tracking conversiones ads | ❌ NO DETECTADO |
| **CDN / Cloudflare** | — | Cache y entrega de assets | ❌ NO DETECTADO |
| **WP Rocket / W3TC** | — | Plugin de caché | ❌ NO DETECTADO (Cache-Control max-age=10) |
| **Cliengo** | — | Chatbot / captura de leads | ❌ NO INSTALADO |

### Notas del stack

- **WordPress 6.9.4** es una versión relativamente reciente. La ausencia de generador expuesto en meta es positivo desde el punto de vista de seguridad.
- El **Link header** `<https://lexinton.com.ar/wp-json/>; rel="https://api.w.org/"` expone que es WordPress, un vector estándar de reconocimiento.
- `Cache-Control: max-age=10` indica prácticamente **cero caching** a nivel servidor/plugin. Cada request genera PHP + base de datos desde cero.
- El servidor **Apache sin CDN** en Argentina (probablemente hosting compartido o VPS local) introduce latencia para usuarios fuera de Buenos Aires.
- **JoinChat** es un plugin WordPress popular para WhatsApp con 400k+ instalaciones activas. Su rol es solo mostrar el botón de WhatsApp, no captura leads estructurados.

---

## 3. Inventario de Páginas

| # | URL | Título | Propósito | Formularios | Integraciones | Observaciones UX |
|---|---|---|---|---|---|---|
| 1 | `/` | Inmobiliaria en Palermo - Lexinton Propiedades | Home principal | Buscador de propiedades | Tokko CPTs, JoinChat | Hero con buscador Tab (Todo/Alquiler/Alquiler Temporal/Venta), carousel "Últimos Ingresos", testimonios Google |
| 2 | `/emprendimientos/` | Emprendimientos | Listado de desarrollos (4 activos) | — | Tokko CPTs | 4 emprendimientos: anónimo #70378, IBERA 2484, MANZANARES 3600, AV. RIVADAVIA 2100 |
| 3 | `/inversor/` | Vendé tu inmueble a un inversor | Lead de captación de vendedores | Nombre, Email, Celular, Mensaje | Destino desconocido (email/Tokko) | Lista de tipos de propiedad aceptados. Falta CTA claro de urgencia |
| 4 | `/contacto/` | Contactanos | Contacto general | Nombre, Email, Celular, Mensaje | Destino desconocido | Sucursales: Palermo (Migueletes 1183) y Vicente López (Madero 351) |
| 5 | `/tasar/` | Tasar Propiedades en Buenos Aires | Lead de tasaciones | ENVIAR MENSAJE (campos no visibles en HTML renderizado) | Desconocido | Promesa "tasación al instante", no hay indicador de tiempo real |
| 6 | `/quiero-vender/` | ¿Necesitás vender urgente? | Lead urgente de vendedores | Nombre, Teléfono, Email, ¿Qué desea vender? | Desconocido | Buena propuesta de valor de urgencia, formulario mínimo |
| 7 | `/propiedad/[ID]-2/` | [Dirección], [Barrio], Capital Federal | Ficha detalle de propiedad | Consulta por propiedad: WhatsApp prefilled + Email | JoinChat + Houzez form | Mapa Leaflet/OSM. Agente: DAYAN BRIAN. Actualizado al 2026-03-02 |
| 8 | `/estado/alquiler/` | Propiedades en Alquiler | Listado filtrado por estado | — | Tokko CPTs | Taxonomía de estado de Houzez |
| 9 | `/estado/venta/` | Propiedades en Venta | Listado filtrado por estado | — | Tokko CPTs | Taxonomía de estado de Houzez |
| 10 | `/estado/emprendimiento/` | Emprendimientos | Listado por estado emprendimiento | — | Tokko CPTs | Mismo contenido que /emprendimientos/ |
| 11 | `/etiqueta/[barrio]/` | Propiedades en [Barrio] | Filtrado por barrio (taxonomía label) | — | Tokko CPTs | Ej: /etiqueta/palermo/ |
| 12 | `/tipo-propiedad/[tipo]/` | PHs, Departamentos, Casas, etc. | Filtrado por tipo de propiedad | — | Tokko CPTs | Ej: /tipo-propiedad/ph/ |
| 13 | `/compare/` | Comparar listados | Comparar hasta 4 propiedades | — | Houzez built-in | Funcionalidad de Houzez, rara vez usada |

### Navegación confirmada

**Menú principal:** HOME · EMPRENDIMIENTOS · INVERSOR PARA TU PROPIEDAD · CONTACTO · TASAR HOY TU INMUEBLE · QUIERO VENDER URGENTE

**Pie de página:** Mapa del sitio (mismos links) + Redes sociales (LinkedIn, Instagram, Facebook, YouTube) + Asociados (CIA, CUCICBA/logo)

### URLs de propiedades individuales detectadas

- `/propiedad/3375900-2/` → Honduras 5794, Palermo (Alquiler, U$D 1.000)
- `/propiedad/4668868-2/` → Honduras 5621, Palermo (260m²)
- `/propiedad/70378-2/` → Emprendimiento EDIFICIO
- `/propiedad/35298-2/` → IBERA 2484 (Emprendimiento)
- `/propiedad/32374-2/` → MANZANARES 3600 (Emprendimiento)
- `/propiedad/7665-2/` → AV. RIVADAVIA 2100 (Edificio de oficinas)

---

## 4. Integraciones Actuales

### 4.1 Tokko Broker (CRM inmobiliario)

**Tipo de integración:** Plugin de sincronización WordPress. Las propiedades de Tokko se importan como CPTs (Custom Post Types) de Houzez. Los IDs de propiedad en la URL (`/propiedad/3375900-2/`) corresponden a los IDs de Tokko.

**Funcionamiento:**
1. Tokko Broker (CRM) gestiona el inventario de propiedades
2. Un plugin de sync (probablemente un desarrollo a medida o un plugin como "WP Tokko Sync") hace polling a la API de Tokko
3. Las propiedades se guardan en la base de datos de WordPress como CPT `property` (tipo nativo de Houzez)
4. Houzez renderiza las fichas a través de Elementor

**Riesgos identificados:**
- Si el plugin de sync falla, el inventario queda desactualizado sin alerta
- Duplicación de datos: Tokko tiene su DB y WordPress tiene otra copia
- El update del 2026-03-02 en la ficha de propiedad indica que la sincronización funciona activamente

**Lead desde ficha de propiedad:**
- Botón "Enviar Email" → probablemente envía al email de la agencia (no confirmado si va a Tokko)
- Botón "Llamar" → tel:47765003
- Mensaje WhatsApp prefilled: "Hola Lexinton, estoy interesado en la siguiente propiedad: [nombre]"

### 4.2 JoinChat (WhatsApp)

**Plugin:** creame-whatsapp-me v6.0.10

**Rol:** Botón flotante de WhatsApp en todas las páginas. Mensaje de bienvenida: "Somos Lexinton Propiedades 👋 ¿En qué podemos ayudarte?"

**Teléfono WhatsApp:** 1131519928 (confirmado en fichas de propiedades)

**Limitación:** JoinChat NO es un chatbot. Es solo un enlace directo a WhatsApp. No captura leads estructurados, no tiene flujos de conversación, no integra con Tokko.

### 4.3 Yoast SEO

**Versión:** 27.1

**Configuración detectada:**
- Schema.org `WebPage` + `WebSite` + `BreadcrumbList` + `ImageObject` generados automáticamente
- `SearchAction` configurado para búsqueda interna del sitio
- Sitemap XML con 11 sub-sitemaps (ver sección SEO)
- robots.txt básico: `User-agent: * / Disallow:` (sin restricciones)
- Open Graph y Twitter Card configurados
- Meta description: "Somos una empresa dedicada al asesoramiento y soluciones integrales del rubro inmobiliario con 20 años de trayectoria."

### 4.4 Integraciones AUSENTES detectadas

| Integración | Estado | Impacto |
|---|---|---|
| Google Analytics 4 / GTM | ❌ No detectado | Sin datos de tráfico, sin tracking de conversiones |
| Facebook Pixel | ❌ No detectado | Sin optimización de campañas Meta Ads |
| Google Ads Conversion Tracking | ❌ No detectado | Sin medición de ROI en Google Ads |
| Cliengo / Chatbot IA | ❌ No instalado | Sin captura automatizada de leads web |
| Heatmap / Hotjar / ClarityMS | ❌ No detectado | Sin datos de comportamiento de usuarios |
| WhatsApp Business API | ❌ No configurado | Solo link estático, sin automatización |

> ⚠️ **Punto crítico:** La ausencia de analítica implica que el cliente **no tiene ningún dato** sobre qué páginas visitan los usuarios, dónde abandonan, cuántos leads genera el sitio web, ni qué campañas de Meta/Google están funcionando.

---

## 5. Hallazgos Técnicos

### 5.1 Fortalezas del setup actual

- ✅ Dominio propio lexinton.com.ar con ~10 años de antigüedad (SEO authority acumulada)
- ✅ Yoast SEO configurado con schema.org, Open Graph, sitemap
- ✅ Propiedades organizadas en taxonomías correctas (barrio, tipo, estado)
- ✅ Sitemap con 11 sub-sitemaps bien estructurados por tipo de contenido
- ✅ robots.txt correcto (permite todo el crawleo)
- ✅ Leaflet.js para mapas (solución gratuita, funciona)
- ✅ Houzez v4.1.0 es versión reciente del tema
- ✅ Sincronización con Tokko activa (actualización 2026-03-02 confirmada)

### 5.2 Debilidades técnicas

| Problema | Severidad | Impacto |
|---|---|---|
| Sin CDN | 🔴 Alta | Latencia alta para usuarios fuera de Buenos Aires, TTFB elevado |
| Sin caché (max-age=10) | 🔴 Alta | Cada visita genera carga en el servidor, PHP+DB en cada request |
| Sin Analytics | 🔴 Alta | Ceguera total en datos de negocio, sin ROI de campañas |
| Sin Facebook Pixel | 🔴 Alta | Meta Ads sin datos de conversión (contraproducente con integración existente) |
| Elementor v3.35.5 | 🟡 Media | Genera CSS y JS excesivos (~300-400KB extra), perjudica Core Web Vitals |
| jQuery legacy | 🟡 Media | Dependencia innecesaria en 2026, añade ~90KB |
| Cadena Tokko→plugin→WP CPT | 🟡 Media | Punto único de falla, sync puede romperse silenciosamente |
| Sin HTTPS forzado en assets | 🟡 Media | Verificar que todos los assets usan HTTPS |
| WordPress expuesto via wp-json | 🟡 Media | Información de estructura expuesta |
| Tema premium de tercero | 🟡 Media | Actualizaciones de pago, riesgo de abandono del producto |
| Sin Google Ads / Pixel | 🔴 Alta | Leads Meta existentes sin conversión web trazada |

### 5.3 Análisis UX/UI

**Flujo de conversión actual:**

```
Visitante → Hero con buscador (Tab: Todo/Alquiler/Temporal/Venta)
          → Ficha de propiedad → Formulario email o botón WhatsApp
          ↓
          → Páginas de captación (/tasar/, /quiero-vender/, /inversor/)
          → Formularios simples → destino desconocido (email?)
```

**Puntos de fricción identificados:**

1. **Hero buscador sin resultados en tiempo real:** El buscador redirige a otra página con reload completo, no filtra dinámicamente. En 2026, los portales inmobiliarios de referencia (Zonaprop, Argenprop) filtran sin recarga.
2. **Formularios sin feedback de éxito:** No se puede confirmar si tienen mensaje de confirmación post-envío o a dónde van los datos.
3. **Sin WhatsApp pre-cargado en formularios de captación:** Las páginas /tasar/, /quiero-vender/, /inversor/ tienen formularios de email, no botón WhatsApp directo (pérdida de conversión).
4. **Testimonios hardcodeados:** No dinámicos desde Google Reviews, lo cual reduce la credibilidad.
5. **Sin precio en algunos listados:** Algunas propiedades muestran "Consulte precio" (es una limitación de Tokko para ciertos tipos).
6. **Mobile UX no verificada directamente:** El código incluye breakpoints responsive (Elementor) y menú mobile con offcanvas, pero la calidad depende de la implementación de Houzez.
7. **Carousel "Últimos Ingresos":** Solo 3 propiedades visibles (slides_to_show=3). En mobile se verá reducido.

**Oportunidades de mejora UX:**
- Buscador con filtros instantáneos (sin recarga)
- Mapa interactivo de propiedades en el home
- Galería de fotos con lightbox de mejor calidad en fichas
- CTA más prominente para tasación online (ya existe el trabajo previo)
- Chat/WhatsApp integrado directamente en fichas con contexto de la propiedad

### 5.4 Análisis SEO técnico

**Estructura de URLs:**
- ✅ URLs amigables: `/propiedad/[slug]/`, `/estado/venta/`, `/etiqueta/palermo/`
- ✅ Sin parámetros GET en URLs de fichas
- ✅ Canonical tags presentes
- ⚠️ El sufijo `-2` en algunas propiedades (`/propiedad/3375900-2/`) sugiere conflictos de slug duplicados (puede crear issues con Tokko re-syncs)

**Schema.org:**
- ✅ `WebPage`, `WebSite`, `BreadcrumbList` generados por Yoast
- ❌ Sin `RealEstateListing` schema en fichas de propiedades (oportunidad perdida para rich snippets)
- ❌ Sin `LocalBusiness` schema estructurado

**Sitemap XML:**
```
https://lexinton.com.ar/sitemap_index.xml (índice)
├── page-sitemap.xml            (páginas estáticas)
├── fts_builder-sitemap.xml     (plantillas builder de Houzez)
├── property-sitemap.xml        (fichas de propiedades - actualización: 2026-04-13)
├── property_type-sitemap.xml   (tipos: departamento, casa, PH, etc.)
├── property_status-sitemap.xml (estado: venta, alquiler, temporal, emprendimiento)
├── property_feature-sitemap.xml
├── property_label-sitemap.xml  (barrios/etiquetas)
├── property_country-sitemap.xml
├── property_state-sitemap.xml
├── property_city-sitemap.xml
└── property_area-sitemap.xml
```
✅ Sitemap bien estructurado y actualizado automáticamente

**robots.txt:**
```
User-agent: *
Disallow:
Sitemap: https://lexinton.com.ar/sitemap_index.xml
```
✅ Correcto (permite todo)

**Canonicals:** Configurados correctamente por Yoast.

**Hreflang:** No detectado (solo es en español, OK).

---

## 6. Documentación API Tokko Broker

> Fuente: https://developers.tokkobroker.com/

### 6.1 Autenticación

- **Tipo:** API Key (query parameter)
- **Cómo obtenerla:** Admin de la agencia → tokkobroker.com → MI EMPRESA → PERMISOS → CLAVE API
- **Formato:** String alfanumérico único por agencia
- **API Key de prueba pública:** `4a4d4727-f26d-4ec0-b902-42be4a09a102`

### 6.2 Endpoints principales (REST API)

#### Listar propiedades (feed portal)
```
GET http://tokkobroker.com/portals/simple_portal/api/v1/freeportals/
    ?api_key=APIKEY
    &format=json
    &lang=es-AR
```

#### Listar propiedades (API directa con key)
```
GET https://www.tokkobroker.com/api/v1/property/
    ?format=json
    &key=API_KEY
    &lang=es_ar
    [&offset=0]           → paginación (máx 1000 por request, recomendado: 20)
    [&order_by=price]     → ordenar
    [&deleted_at__gte=YYYY-MM-DDTHH:MM:SS] → propiedades modificadas desde fecha
```

#### Listar desarrollos (emprendimientos)
```
GET https://www.tokkobroker.com/api/v1/development/
    ?format=json
    &lang=es_ar
    &key=API_KEY
    [&branch_id=ID_BRANCH]
```

#### Propiedades de emprendimientos
```
GET https://www.tokkobroker.com/api/v1/property/
    ?format=json
    &key=APIKEY
    &development__isnull=false    → solo unidades de emprendimientos
    [&deleted_at__gte=YYYY-MM-DDTHH:MM:SS]
```

#### Objetos eliminados (para sync incremental)
```
GET http://www.tokkobroker.com/portals/simple_portal/api/v1/freeportals/
    ?api_key=APIKEY
    &format=json
    &lang=es-AR
    &filter=deleted
    &date_from=YYYY-MM-DDTHH:MM:SS
```

#### Playground interactivo
```
http://www.tokkobroker.com/api/playground
```

### 6.3 Endpoint de Contacto / Lead

```
POST http://tokkobroker.com/portals/simple_portal/api/v1/contact/
Content-Type: application/json

{
  "publication_id": "2_1_693_101419",   // ID de la propiedad (formato Tokko)
  "api_key": "TU_API_KEY",
  "name": "Nombre del visitante",        // REQUERIDO
  "mail": "email@visitante.com",         // REQUERIDO
  "comment": "Mensaje del visitante",    // REQUERIDO
  "phone": "1142334455",                 // OPCIONAL
  "cellphone": "1161234567",             // OPCIONAL
  "company": "Empresa",                  // OPCIONAL
  "properties": ["ID_PROPIEDAD"],        // OPCIONAL: ligar a propiedad específica
  "developments": ["ID_DESARROLLO"],     // OPCIONAL: ligar a desarrollo específico
  "tags": ["lexinton.com.ar", "web", "buscador"]  // OPCIONAL: etiquetas de origen
}
```

**Respuestas:**

| Código | Significado |
|---|---|
| OK | Lead enviado correctamente |
| ERROR 100 | API key inválida |
| ERROR 200 | Propiedad no encontrada (publication_id incorrecto) |
| ERROR 201 | Empresa no tiene el portal activado |
| ERROR 300 | Argumentos JSON faltantes |

**Nota:** El `publication_id` tiene formato `2_1_XXX_XXXXX` (diferente del ID simple). Desde la API se obtiene como campo `publication_id` de cada propiedad.

### 6.4 Campos de una propiedad (JSON response)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | integer | ID interno de Tokko |
| `publication_id` | string | ID para portal (formato 2_1_XXX_XXX) |
| `publication_title` | string | Título de la publicación |
| `reference_code` | string | Código de referencia interno |
| `web_price` | boolean/float | Precio (false si "Consulte precio") |
| `address` | string | Dirección completa |
| `room_amount` | integer | Cantidad de ambientes |
| `bathroom_amount` | integer | Cantidad de baños |
| `surface` | float | Superficie del lote (m²) |
| `roofed_surface` | float | Superficie cubierta (m²) |
| `geo_lat` | float | Latitud |
| `geo_long` | float | Longitud |
| `description` | string | Descripción completa |
| `construction_date` | string | Año de construcción |
| `location` | object | Localización (barrio, ciudad, provincia) |
| `type` | object | Tipo de propiedad (nombre) |
| `photo` | array | Fotos (con .thumb y .image) |
| `operations` | array | Tipos de operación disponibles con precio |

### 6.5 Tipos de operación (operation_types)

| ID | Nombre |
|---|---|
| 1 | Venta |
| 2 | Alquiler |
| 3 | Alquiler Temporal |

### 6.6 Tipos de propiedad (property_types)

| ID | Nombre |
|---|---|
| 1 | Terreno |
| 2 | Departamento |
| 3 | Casa |
| 4 | Casa de fin de semana |
| 5 | Oficina |
| 6 | Embarcadero |
| 7 | Local Comercial |
| 8 | Edificio Comercial |

### 6.7 Consideraciones técnicas para Next.js

- **Rate limit:** No documentado explícitamente, pero se recomienda no más de 20 propiedades por request para evitar timeouts de 30s
- **Paginación:** Usar `offset` + `limit`, máximo 1000 por request
- **Sync incremental:** Usar `deleted_at__gte` para traer solo cambios desde última sync
- **ISR recomendado:** `revalidate: 3600` (1h) para páginas de listado, `revalidate: 900` (15min) para fichas activas
- **API HTTP, no HTTPS:** ⚠️ La base URL usa HTTP. Para producción, verificar si existe endpoint HTTPS disponible o usar proxy server-side en Next.js para no exponer API key en cliente.

---

## 7. Análisis de Cliengo y Alternativas

### 7.1 Estado actual en Lexinton

**Cliengo NO está instalado en lexinton.com.ar.** El widget de contacto live detectado es **JoinChat v6.0.10** (botón flotante de WhatsApp, sin capacidad de chatbot ni captura estructurada de leads).

### 7.2 ¿Qué es Cliengo?

Cliengo es una plataforma de chatbot con IA para LATAM, ahora rebranded como "Cliengo Hub". Funciona a través de un snippet JS insertado en el HTML del sitio. Sus capacidades actuales incluyen:
- Chatbot IA entrenado con contenido del sitio o FAQs
- Integración omnicanal: web, WhatsApp, Instagram, Facebook Messenger
- Inbox unificado para el equipo
- Campañas por WhatsApp (outbound)
- Copilot: resúmenes automáticos e insights

**Integración web:** Un script JS de unas pocas líneas es suficiente. Captura nombre, email, teléfono y mensaje dentro del chat.

**Integración con Tokko:** No hay integración nativa documentada. Los leads de Cliengo tendrían que pasar por webhook/Zapier/Make hacia la API de Tokko `/contact`.

**Pricing:** No publicado en la web actual (modelo "contactar ejecutivo"). Históricamente oscilaba entre USD 29-199/mes según plan.

### 7.3 Alternativas modernas a Cliengo

| Alternativa | Tipo | Costo aprox | Ventaja para Lexinton |
|---|---|---|---|
| **Tawk.to** | Live chat + basic bot | Gratis | Fácil instalación, sin costo |
| **WhatsApp Business API directa** | Mensajería | Costo por mensaje | Ya tienen infraestructura construida |
| **Chatwoot** | Omnichannel open source | ~USD 0-25/mes | Self-hosted, integraciones flexibles |
| **Custom chat en Next.js** | Chat custom | Desarrollo incluido | Integración total con Tokko y flujos existentes |
| **Botón WhatsApp enriquecido** | WhatsApp | Gratis | Aprovecha infraestructura existente |

### 7.4 Recomendación para la nueva web

Para la Opción B (Next.js), la solución óptima es **no usar un chatbot de terceros** sino:
1. **Widget WhatsApp propio** con mensaje pre-cargado según la página/propiedad actual
2. **Formulario de contacto inline** en cada ficha con envío directo a API de Tokko + webhook al flujo de WhatsApp ya construido
3. En una fase posterior: implementar un bot simple con la WhatsApp Business API ya existente

---

## 8. Escenario A vs Escenario B

### Tabla Comparativa

| Criterio | Opción A: Mejorar WordPress | Opción B: Next.js 14 (Recomendado) |
|---|---|---|
| **Performance (LCP)** | ⚠️ Mejorable pero limitado por Elementor | ✅ Excelente (SSG + ISR, sin PHP runtime) |
| **Core Web Vitals** | ⚠️ Difícil pasar CLS/LCP con Elementor | ✅ Control total del render |
| **SEO técnico** | ✅ Adecuado con Yoast | ✅ Superior (schema custom, SSG, metadata API) |
| **Buscador en tiempo real** | ❌ Requiere plugin extra + recarga | ✅ Filtros client-side sin recarga |
| **Integración Tokko** | ⚠️ Doble fuente de verdad (WP DB + Tokko) | ✅ API directa, fuente única |
| **Dependencia de plugins** | 🔴 Alta (Houzez, Elementor, Tokko sync, Yoast) | ✅ Ninguna (excepto APIs externas) |
| **Escalabilidad** | ⚠️ Limitada por ecosistema WP | ✅ Total (agregar módulos con código) |
| **Costo de mantenimiento** | 🔴 Alto (renovar licencias, actualizar plugins) | ✅ Bajo (sin licencias de tema/plugins) |
| **Integración con trabajo previo** | ❌ Difícil sin plugin/webhook custom | ✅ Nativa (mismo stack, API calls directas) |
| **Mobile UX** | ⚠️ Depende de Houzez responsive | ✅ Control total del diseño responsive |
| **Analytics / Pixels** | ⚠️ Se pueden agregar manualmente | ✅ GTM + Pixel integrados desde el inicio |
| **Tiempo de desarrollo** | 1-3 semanas | 4-8 semanas (ver plan) |
| **Costo estimado** | USD 800-1500 | USD 3.000-6.000 |
| **Resultado a 12 meses** | Sitio mejorado pero con deuda técnica | Activo digital propio, escalable, sin deuda |

### Opción A: Mejora del WordPress actual

**Qué se haría:**
- Agregar CDN (Cloudflare gratis o similar)
- Instalar WP Rocket o LiteSpeed Cache
- Agregar Google Tag Manager + Analytics 4 + Facebook Pixel
- Optimizar imágenes (WebP, lazy loading)
- Agregar schema RealEstateListing en fichas de propiedades

**Qué NO se puede mejorar fácilmente:**
- La dependencia de Elementor (JS/CSS pesado)
- La cadena Tokko → plugin → WP CPT → Houzez
- El buscador en tiempo real (requeriría plugin de $100+/año o desarrollo custom)
- La integración profunda con los flujos de WhatsApp/leads ya construidos

**Por qué es la opción limitada:** Se está mejorando un sistema que fundamentalmente tiene deuda técnica estructural. El tema Houzez y Elementor imponen techo duro en performance. Y en cada actualización de WordPress se corre el riesgo de romper la sincronización con Tokko.

### Opción B: Next.js 14 (Recomendado)

**Arquitectura propuesta:**
```
Next.js 14 App Router + TypeScript
├── /app
│   ├── page.tsx                    → Home con buscador
│   ├── propiedades/
│   │   ├── page.tsx                → Listado con filtros
│   │   └── [slug]/page.tsx         → Ficha (SSG + ISR)
│   ├── emprendimientos/
│   │   ├── page.tsx                → Listado de desarrollos
│   │   └── [slug]/page.tsx         → Detalle emprendimiento
│   ├── contacto/page.tsx
│   ├── tasar/page.tsx
│   ├── quiero-vender/page.tsx
│   └── inversor/page.tsx
├── /lib
│   └── tokko.ts                    → Cliente API de Tokko (server-side)
├── /components
│   ├── SearchBar.tsx               → Buscador con filtros en tiempo real
│   ├── PropertyCard.tsx
│   ├── PropertyMap.tsx             → Mapas con Leaflet o Mapbox
│   └── ContactForm.tsx             → Formulario → Tokko API
└── vercel.json + next.config.ts
```

**Cómo se integraría Tokko:**
- `lib/tokko.ts` encapsula todos los fetches a la API de Tokko (server-side, la API key nunca llega al cliente)
- `generateStaticParams()` en `[slug]/page.tsx` genera todas las fichas en build time
- `revalidate = 3600` actualiza las fichas cada hora automáticamente (ISR)
- Un webhook de Tokko (o cron job en Vercel) puede triggear `revalidatePath` para actualización on-demand

**Buscador de propiedades:**
- Carga inicial: lista de propiedades con SSR/SSG
- Filtros (tipo, operación, barrio, ambientes): client-side con URL params (para SEO)
- Paginación: servidor-side con searchParams en App Router

**Leads a Tokko:**
```typescript
// app/api/contact/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const response = await fetch('http://tokkobroker.com/portals/simple_portal/api/v1/contact/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...body,
      api_key: process.env.TOKKO_API_KEY,
      tags: ['lexinton.com.ar', 'web']
    })
  })
  // Además: trigger webhook → WhatsApp API existente
  return Response.json({ ok: true })
}
```

**Deploy:** Vercel (free plan suficiente para empezar, ~$20/mes Pro si necesario)

---

## 9. Plan de Desarrollo — Opción B (Next.js 14)

### Estimaciones con workflow Next.js + Claude en VSCode

#### Fase 1: Estructura base + Integración Tokko (Buscador + Detalle)

| Módulo | Descripción | Tiempo estimado |
|---|---|---|
| Setup proyecto Next.js 14 + TS + Tailwind | Scaffold, config, deploy inicial en Vercel | 0.5 días |
| `lib/tokko.ts` — cliente API | Tipado TypeScript de respuesta Tokko, funciones: getProperties, getProperty, getDevelopments | 1 día |
| Componente SearchBar | Filtros: operación (venta/alquiler/temporal), tipo, barrio, ambientes, dormitorios | 1.5 días |
| Página listado `/propiedades` | SSR con searchParams, pagination, PropertyCard grid | 1 día |
| Página detalle `/propiedades/[slug]` | SSG + ISR, galería fotos, Leaflet map, ContactForm → Tokko | 2 días |
| Migración de URLs SEO | `/propiedad/[ID]-2/` → redirect 301 a `/propiedades/[slug]` | 0.5 días |
| **Subtotal Fase 1** | | **~6.5 días** |

#### Fase 2: Páginas institucionales + Formularios + Leads a Tokko

| Módulo | Descripción | Tiempo estimado |
|---|---|---|
| Header + Footer + Layout | Navbar, footer con links, responsive | 1 día |
| Home page completo | Hero, buscador, últimos ingresos, testimonios, CTA | 1.5 días |
| `/emprendimientos/` + detalle | Listado + ficha de desarrollo | 1 día |
| `/contacto/` + `/tasar/` + `/quiero-vender/` + `/inversor/` | Formularios → Tokko API + trigger WhatsApp | 1.5 días |
| API Route `/api/contact` | Server action para leads: Tokko + webhook existente | 0.5 días |
| WhatsApp flotante con contexto | Botón WA con mensaje pre-cargado según página | 0.5 días |
| GTM + Meta Pixel + GA4 | Setup completo de analytics y tracking de conversiones | 0.5 días |
| **Subtotal Fase 2** | | **~6.5 días** |

#### Fase 3: SEO técnico + Optimizaciones + Deploy

| Módulo | Descripción | Tiempo estimado |
|---|---|---|
| Metadata API Next.js | `generateMetadata()` dinámico por propiedad | 0.5 días |
| Schema.org `RealEstateListing` | JSON-LD en cada ficha | 0.5 días |
| Sitemap dinámico `/sitemap.xml` | Generado desde Tokko API, auto-actualizado | 0.5 días |
| robots.txt + redirects 301 | Migración SEO desde URLs de WordPress | 0.5 días |
| Optimización imágenes | next/image, WebP automático, lazy loading | 0.5 días |
| ISR + Revalidación | Webhook o cron para invalidar caché en cambios Tokko | 0.5 días |
| Testing + QA | Revisar mobile, performance, formularios, leads en Tokko | 1 día |
| Deploy final + DNS switch | Apuntar lexinton.com.ar al nuevo sitio en Vercel | 0.5 días |
| **Subtotal Fase 3** | | **~5 días** |

#### Fase 4 (Opcional): Integración con trabajo previo

| Módulo | Descripción | Tiempo estimado |
|---|---|---|
| Tasación online integrada | Formulario → API/Sheet existente → respuesta automática WA | 1.5 días |
| Agenda de visitas web | Calendario inline en fichas de propiedad | 2 días |
| Dashboard básico de leads | Vista de leads recibidos con estado (nuevo/en proceso/cerrado) | 2 días |
| **Subtotal Fase 4** | | **~5.5 días** |

### Resumen de tiempos

| Fase | Días de desarrollo | Observaciones |
|---|---|---|
| Fase 1: Core Tokko + buscador | ~6.5 días | Entregable funcional mínimo |
| Fase 2: Páginas + formularios | ~6.5 días | Sitio completo sin optimizaciones |
| Fase 3: SEO + deploy | ~5 días | Listo para go-live |
| **Total Fases 1-3** | **~18 días** | **4-5 semanas** |
| Fase 4 (opcional) | ~5.5 días | Sprint adicional post-lanzamiento |

> **Nota de estimación:** Los tiempos asumen trabajo efectivo con el workflow Next.js + Claude en VSCode. Días "de desarrollo" = aproximadamente 5-6h de trabajo productivo. Los tiempos pueden variar ±30% según complejidad del diseño final acordado con el cliente.

---

## 10. Diferenciadores Competitivos — Opción B

### Lo que tendría esta web que NO puede tener WordPress + Houzez

| Diferenciador | WordPress + Houzez | Next.js 14 |
|---|---|---|
| **Performance LCP** | 3-6s (con Elementor + sin CDN) | <1.5s (SSG + Vercel Edge) |
| **Core Web Vitals** | Difícil pasar (CLS por Elementor) | Control total, fácil >90 en Lighthouse |
| **Búsqueda en tiempo real** | Solo con plugins extra o recarga | Nativo, sin recarga de página |
| **Integración whatsapp contextual** | Plugin genérico | Por propiedad, pre-carga contexto exacto |
| **Analytics + Pixel** | Agregar manualmente (ya debería estar) | Integrado desde día 1 con events personalizados |
| **ISR para propiedades** | Sin equivalente en WP | Actualización automática sin reconstrucción total |
| **Escalabilidad de features** | Limitada por ecosistema de plugins | Código propio, sin límites |
| **Costo de operación anual** | Hosting + renovación Houzez (~$200+/año) + actualizaciones | Vercel (~$0-240/año) + desarrollo |
| **Seguridad** | Superficie de ataque WordPress típica | Sin /wp-admin, sin wp-json expuesto |
| **Tiempo de recuperación ante error** | Deploy manual + rollback complejo | Preview deploys + rollback instantáneo en Vercel |

---

## 11. Recomendación Final

### Para el cliente: migrar a Next.js en Fases 1-3

La web actual de Lexinton cumple su función mínima (mostrar propiedades y recibir contactos) pero está construida sobre una pila tecnológica con fragilidad estructural. La cadena **Tokko → plugin de sync → WordPress CPT → Houzez → Elementor** es un sistema de 5 componentes donde cualquiera puede fallar y afectar el negocio.

La ausencia total de analíticas (sin GA, sin Pixel, sin GTM) es el hallazgo más crítico: el cliente tiene campañas activas en Meta Ads y Google Ads potencialmente, y no puede medir el ROI de la web en ningún canal. Esto es un problema que existe hoy, independientemente de la decisión de migrar.

**La migración a Next.js 14 es recomendada porque:**

1. **Aprovecha infraestructura ya construida**: La API de WhatsApp, la integración de leads Meta Ads → Sheets, y la agenda ya existen. En Next.js se conectan nativamente como API routes; en WordPress requieren plugins o workarounds.

2. **Elimina la deuda técnica**: Sin Houzez, sin Elementor, sin plugin de sync. Una fuente de verdad: la API de Tokko.

3. **Performance incomparablemente superior**: En el mercado inmobiliario, 1 segundo de diferencia en carga equivale a ~7% menos conversiones. Con ISR y Vercel Edge, las fichas cargan en menos de 1.5s.

4. **SEO superior**: Schema.org `RealEstateListing` personalizado, URLs optimizadas, sitemap dinámico actualizado con el inventario real, y metadata per-propiedad generada desde Tokko.

5. **El cliente queda dueño del código**: No depende de Optium (la agencia que hizo el sitio actual), no paga licencias de Houzez, no está atado a ThemeForest. El código es suyo.

6. **Propuesta de valor para el cliente no técnico**: "Hacemos una web que carga en menos de 1 segundo, aparece mejor en Google, y conecta directamente con tu sistema de propiedades sin intermediarios que pueden romperse."

### Para la propuesta comercial

**Presentar el proyecto en dos etapas:**
- **Etapa 1 (Fases 1-3):** Web nueva completa con Tokko integrado, SEO, analytics. Precio de referencia: **USD 3.000-4.500**.
- **Etapa 2 (Fase 4):** Módulos de tasación integrada, agenda, dashboard leads. Precio de referencia: **USD 1.000-1.500 adicionales**.

**Incluir en la propuesta:**
- Los analytics y Pixel como un "regalo" / parte del proyecto (son 0.5 días de trabajo pero tienen alto valor percibido para el cliente)
- Mencionar explícitamente que la web actual NO tiene Google Analytics (el cliente no lo sabe y esto genera impacto inmediato)
- Hacer énfasis en la continuidad con el trabajo previo ya hecho

---

## Apéndice: Recursos técnicos

### Links clave del proyecto

| Recurso | URL |
|---|---|
| Sitio actual | https://lexinton.com.ar/ |
| Tokko API Playground | http://www.tokkobroker.com/api/playground |
| Tokko Dev Docs | https://developers.tokkobroker.com/ |
| Tokko API Base URL | https://www.tokkobroker.com/api/v1/ |
| Houzez Theme (ThemeForest) | https://themeforest.net/item/houzez-real-estate-wordpress-theme/15752549 |
| JoinChat plugin | https://wordpress.org/plugins/creame-whatsapp-me/ |

### Comandos de verificación rápida para futuras audits

```bash
# Verificar headers HTTP
curl -sI https://lexinton.com.ar/

# Verificar versión WordPress (wp-json)
curl -s https://lexinton.com.ar/wp-json/ | python -m json.tool | head -30

# Verificar sitemap
curl -s https://lexinton.com.ar/sitemap_index.xml

# Verificar robots
curl -s https://lexinton.com.ar/robots.txt

# Probar endpoint Tokko con API key pública de prueba
curl -s "http://www.tokkobroker.com/api/v1/property/?format=json&key=4a4d4727-f26d-4ec0-b902-42be4a09a102&limit=5"
```

---

*Documento generado el 13/04/2026. Datos obtenidos mediante análisis del código fuente HTML, headers HTTP, y documentación oficial de Tokko Broker. Los tiempos de desarrollo son estimaciones basadas en experiencia con el stack Next.js + Claude Copilot en VSCode.*
