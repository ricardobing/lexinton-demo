# Roadmap Tecnológico — Lexinton Real Estate
## De la web al ecosistema digital · Fases 3 al 9

> **Documento interno** · Abril 2026  
> **Para usar en:** Conversaciones estratégicas con el cliente, no para enviar directamente

---

## El marco mental correcto

Lexinton no necesita "un desarrollador". Necesita alguien que entienda su negocio, sepa qué está roto, qué falta, y qué puede automatizarse — y que también sepa ejecutarlo.

La conversación que hay que tener no es "¿querés que te haga la web?". Es:

> "Tenés Tokko Broker sin usar el 70% de lo que pagás. Leads llegando a tres lugares distintos que no se hablan entre sí. Asesores respondiendo de su WhatsApp personal sin registro. Propietarios llamando para saber cómo va su propiedad. Y un dueño que toma decisiones de negocio sin datos.  
> Eso tiene solución. Y se puede hacer de forma ordenada, sin tirar todo y empezar de cero."

Eso es lo que ofrecemos.

---

## El estado actual de Lexinton (antes de nosotros)

```
META ADS                     PORTALES                   SITIO WEB VIEJO
     │                           │                              │
     ▼                           ▼                              ▼
Make → Google Sheets      Tokko (panel de           Email de la agencia
(Fase 1 ✅ done)          consultas, sin sistematizar) (sin registro)
     │                           │                              │
     └───────────────────────────┴──────────────────────────────┘
                                 │
                        NO hay un lugar central
                        CADA ASESOR hace lo suyo
                        SIN datos, SIN pipeline, SIN registro
```

---

## El estado objetivo (con el roadmap completo)

```
META ADS    PORTALES    SITIO WEB    WHATSAPP    CLIENGO    PHONE
    │           │           │            │           │         │
    └───────────┴───────────┴────────────┴───────────┴─────────┘
                                    │
                          ┌─────────▼──────────┐
                          │   TOKKO BROKER CRM  │
                          │  (fuente de verdad) │
                          └─────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────────┐
                    │                                   │
           ┌────────▼────────┐                ┌────────▼────────┐
           │ PANEL INTERNO   │                │  AUTOMATIZACIÓN │
           │ Next.js Custom  │                │  Make + WA API  │
           │ (Fases 4-6)     │                │  (Fases 3, 5)   │
           └────────┬────────┘                └────────┬────────┘
                    │                                   │
        ┌───────────┴───────────┐           ┌──────────┴──────────┐
        │                       │           │                     │
   Dashboard              Portal           Auto-responses    Follow-up
   KPIs/Equipo         Propietarios        en < 5 min        sequences
   (Fase 6)            (Fase 7)            (Fase 5)          (Fase 5)
```

---

## Fases completadas y en curso

| Fase | Descripción | Estado |
|---|---|---|
| **Fase 1** | Automatización de leads de tasación (Meta → Make → Sheets) | ✅ Completa |
| **Fase 2** | Nuevo sitio web Next.js + Tokko API | 🔄 En curso |

---

## Fase 3 — "La gran consolidación"
### Todos los leads, en un solo lugar, en Tokko

**El problema a resolver:**  
Hoy los leads viven en tres lugares: Tokko (propiedades desde portales), Google Sheets (Meta Ads), y el email/WhatsApp (resto). Nadie tiene una vista completa. Es imposible medir nada.

**El objetivo:**  
Cualquier persona que exprese interés en Lexinton — de donde sea — entra a Tokko Broker y tiene un dueño (un asesor asignado).

**Qué se hace:**

1. **Meta Leads → Tokko** (Make)  
   Ampliar la Fase 1: en lugar de guardar el lead en Sheets, Make lo envía a Tokko via API `/contact`. Tags automáticos según la campaña de origen (`#meta`, `#tasacion`, `#alquiler`, etc.). El lead sigue yendo a Sheets como backup si el cliente lo pide.

2. **Activar Tokko Chat WhatsApp**  
   Un número de WhatsApp Business dedicado para la agencia. Los chats entran al panel de Tokko. Los asesores responden desde Tokko, no desde su personal. Todo queda registrado. Queda vinculado al contacto.

3. **Configurar auto-derivación en Tokko**  
   Definir reglas: ¿quién recibe un lead de tasación? ¿Quién recibe uno de alquiler? ¿Round-robin entre asesores? ¿Por zona? Esto se configura en el panel de Tokko (no requiere código).

4. **Activar WhatsApp Assistant**  
   Respuesta automática inicial cuando llega un mensaje a cualquier hora: "Recibimos tu consulta, en breve un asesor te contacta." Evita leads perdidos fuera del horario laboral.

5. **Tags de origen para todos los leads**  
   Etiquetar en Tokko todos los contactos con su fuente: `#meta-ads`, `#zonaprop`, `#argenprop`, `#sitio-web`, `#whatsapp`, `#referido`. Esto permite luego medir qué canal convierte mejor.

**Esfuerzo:** 2–3 semanas (principalmente Make + configuración de Tokko + capacitación)  
**Requiere código:** Mínimo (ajuste en Make scenarios)  
**Precio sugerido:** USD 600–900 (fijo por configuración + capacitación)

**Por qué es crítico:**  
Sin este paso, todo lo que construimos después (panel, analytics, automatización) funciona con datos incompletos. Esta fase es el cimiento.

---

## Fase 4 — "El panel propio"
### Un command center a medida para Lexinton

**El problema a resolver:**  
Tokko tiene un panel de CRM, pero es genérico para cualquier inmobiliaria. Lexinton tiene necesidades específicas que Tokko no cubre: saber si un lead fue respondido en menos de 1 hora, ver en un solo pantallazo todos los leads de hoy por canal, asignar un lead urgente a un asesor específico con un click, ver quién está respondiendo y quién no.

**El objetivo:**  
Una aplicación web interna (acceso con usuario y contraseña) que funciona como sala de control. El dueño/coordinador la abre cada mañana y sabe exactamente el estado de todo.

**Cómo se construye:**  
- **Frontend:** Next.js (misma tecnología del sitio)
- **Datos:** Leemos de Tokko API (GET `/contact`, GET `/user`, GET `/branch`, GET `/properties`, GET `/signed_operations`)
- **Base de datos propia (mínima):** Supabase free tier — guarda datos que Tokko no tiene: timestamp de primera respuesta, notas de asignación, SLA, escalaciones
- **Autenticación:** NextAuth.js con Google o email/password

**Funcionalidades del panel:**

### 4a. Inbox unificado de leads
```
┌─────────────────────────────────────────────────────┐
│ LEADS DE HOY (23)          Filtrar: [Todos ▼]       │
├─────────────────────────────────────────────────────┤
│ 🔴 URGENTE  Ana García     Meta Ads   hace 3h sin resp│
│ 🟡 SEGUIM.  Luis Martínez  Zonaprop   hace 45min      │  
│ 🟢 NUEVO    María López    Sitio Web  hace 5min        │
│ 🟢 NUEVO    Carlos Pérez   WhatsApp   hace 12min       │
└─────────────────────────────────────────────────────┘
```

- Color coding por SLA: 🟢 < 30 min, 🟡 30-120 min, 🔴 > 2 horas sin responder
- Click en el lead → ver historial completo + abrir en Tokko
- Asignar/reasignar a asesor con un dropdown
- Marcar como "contactado", "en seguimiento", "no interesado"

### 4b. Vista por asesor (para coordinador/dueño)
```
┌───────────────────────────────────────────────────┐
│ EQUIPO — Lunes 14 Abril                           │
├──────────────────┬──────┬────────┬────────────────┤
│ Asesor           │Leads │Resp<1h │ En seguimiento │
├──────────────────┼──────┼────────┼────────────────┤
│ 👤 Martina S.    │  8   │  7/8   │       5        │
│ 👤 Pablo R.      │  6   │  3/6 ⚠️│       2        │
│ 👤 Carolina M.   │  9   │  9/9 🏆│       7        │
└──────────────────┴──────┴────────┴────────────────┘
```

### 4c. Pipeline Kanban (por lead)
```
NUEVO → CONTACTADO → VISITA PROG. → VISITA OK → OFERTA → CERRADO
  12         8            5             3          2         1
```

Drag and drop para mover leads entre etapas. Se sincroniza con el módulo de oportunidades de Tokko.

### 4d. Alertas automáticas
- Slack/WhatsApp al coordinador: "⚠️ Pablo tiene 3 leads sin responder hace más de 2 horas"
- Resumen diario automático por email al dueño
- Alerta cuando lead de tasación llega (alta prioridad)

**¿Qué viene de Tokko vs qué es custom?**

| Dato | Fuente |
|---|---|
| Leads (nombre, email, teléfono, propiedad) | Tokko API GET `/contact` |
| Agentes del equipo | Tokko API GET `/user` |
| Propiedades | Tokko API GET `/properties` |
| Operaciones cerradas | Tokko API GET `/signed_operations` |
| Timestamp de primera respuesta | Custom DB (Supabase) |
| SLA / colores de urgencia | Custom logic |
| Notas de asignación | Custom DB |
| Historial de etapas | Custom DB + Tokko oportunidades |

**La clave conceptual:** No reemplazamos Tokko. Tokko sigue siendo el CRM. Nosotros construimos una **capa de visibilidad y gestión** encima que Tokko no ofrece de manera nativa para las necesidades específicas de Lexinton.

**Esfuerzo:** 4–6 semanas  
**Precio sugerido:** USD 2,800–3,500 (fijo)

---

## Fase 5 — "La máquina de respuesta"
### WhatsApp automation que multiplica conversiones

**El problema a resolver:**  
En Argentina, el lead tiene una ventana de atención de 15 minutos. Si no lo llaman o escriben en ese tiempo, ya está hablando con otra inmobiliaria. Lexinton no puede tener a alguien disponible las 24 horas para responder.

**El objetivo:**  
Cualquier lead nuevo recibe una respuesta personalizada en menos de 2 minutos, a cualquier hora del día, los 7 días de la semana. Sin intervención humana.

**Cómo funciona:**

**5a. Primera respuesta automática por origen**

Cuando llega un lead nuevo a Tokko (detectado via polling o webhook de Make):

- Si vino de Meta Ads "Venta Palermo":  
  → "Hola [Nombre] 👋 Gracias por tu interés en propiedades en venta en Palermo. ¿Tenés un presupuesto estimado? Nuestro equipo está revisando tu consulta y te contacta en minutos."

- Si vino del sitio web, ficha de departamento específico:  
  → "Hola [Nombre] 👋 Vimos que te interesó el depto en [dirección]. ¿Querés coordinar una visita esta semana?"

- Si vino de Zonaprop, propiedad de alquiler:  
  → "Hola [Nombre] 👋 Recibimos tu consulta sobre el alquiler en [dirección]. ¿Cuándo te vendría bien verlo?"

**5b. Secuencia de nurturing si no responden**

```
Lead llega → Auto-respuesta inmediata
    │
    ├── Responde → Asesor toma la conversación en Tokko
    │
    └── No responde en 2 horas →
              Make espera 24hs → WA: "Hola [Nombre], ¿pudiste ver la info que te mandamos?"
                  │
                  └── No responde en 48hs →
                        Make espera → WA: "Entendemos que quizás no es el momento. Si en el futuro buscás algo, estamos acá 🏠"
                            │
                            └── Marcar como "cold" en custom DB
```

**5c. Templates específicos por tipo de propiedad**

Cuando un asesor quiere compartir una propiedad a un cliente:
- Click en botón "Compartir por WA" en panel interno
- Se genera un mensaje pre-formado con: foto principal, precio, link a la ficha del sitio, nombre del asesor
- Asesor lo envía con un tap desde Tokko Chat

**Qué se usa:**
- Make.com (orquestación de flujos)
- WhatsApp Business API (via Tokko Chat nativo o Meta API directa para mayor control)
- Tokko API (detectar leads nuevos, leer data del contacto)
- Custom DB (registrar estado de secuencia, evitar envíos duplicados)

**Esfuerzo:** 3–4 semanas (principalmente Make scenarios + templates + testing)  
**Precio sugerido:** USD 1,200–1,800 (fijo, incluye 20 templates personalizados)  
**Costo mensual de Make:** USD 20–30/mes (plan actual o upgrade mínimo)

**ROI estimado:** Si el tiempo de respuesta pasa de 2 horas a 2 minutos, y eso aumenta la conversión del 5% al 12%, en una base de 100 leads/mes con ticket de USD 5,000 de comisión... se justifica en el primer mes.

---

## Fase 6 — "Los datos que importan"
### Analytics que entiende la dirección

**El problema a resolver:**  
El dueño no sabe qué está pasando en su negocio hasta que algo sale mal. Las decisiones se toman por intuición. No sabe qué canal trae los mejores leads, qué asesor está sobrecargado, ni qué propiedades generan interés pero no cierran.

**El objetivo:**  
Un dashboard ejecutivo que el dueño revisa cada lunes en 10 minutos y toma 3 decisiones de negocio con datos reales.

**Qué se mide:**

### KPIs de leads y marketing

| Métrica | Fuente | Qué revela |
|---|---|---|
| Leads totales por semana/mes | Tokko + Custom DB | Volumen general del negocio |
| Leads por canal (Meta, Zonaprop, sitio, WA, referidos) | Tags en Tokko | Dónde invertir en publicidad |
| Tasa de respuesta en < 1 hora | Custom DB | Eficiencia del equipo |
| Leads que progresaron (lead → visita) | Tokko oportunidades | Calidad de seguimiento |
| Leads que cerraron operación | Tokko `/signed_operations` | Conversión real |
| Costo por lead (si conocemos el spend de Meta) | Meta API + custom | ROI de publicidad |

### KPIs de equipo

| Métrica | Lo que muestra |
|---|---|
| Tiempo promedio primera respuesta por asesor | Quién responde rápido y quién no |
| Leads activos por asesor | Quién está sobrecargado |
| Operaciones cerradas por asesor (mes) | Performance real |
| Propiedad más consultada (sin cerrar) | Problema de precio o descripción |
| Lead más antiguo sin resolver | Alerta de abandono |

### KPIs de propiedades

| Métrica | Lo que revela |
|---|---|
| Propiedades con más consultas | Alta demanda, posible subprecio |
| Propiedades publicadas > 90 días sin consultas | Problema: precio, fotos, descripción |
| Propiedades con consultas pero sin visitas | Problema de seguimiento o calificación |

**Cómo se construye:**

- Dashboard Next.js (mismo stack del sitio)
- Combina datos de: Tokko API + Custom DB (fases 3 y 4) + opcionalmente Meta Ads API
- Gráficos con Recharts o Chart.js
- Acceso: solo el dueño/gerencia (autenticación separada del panel de asesores)
- **Bonus:** Reporte PDF/email automático semanal generado por Make y enviado todos los lunes a las 8am

**Esfuerzo:** 3–4 semanas  
**Precio sugerido:** USD 1,800–2,400 (fijo)

**Diferenciador:** Ninguna agencia mediana de Buenos Aires tiene esto. Tienen Tokko y quizás un Excel. Un dashboard real de negocio es algo que la competencia de Lexinton no va a tener en los próximos 3 años.

---

## Fase 7 — "El portal del propietario"
### Retener a quienes les confían sus inmuebles

**El problema a resolver:**  
Los propietarios que le confían sus propiedades a Lexinton no tienen visibilidad. Llaman constantemente. A veces se van a otra inmobiliaria porque sienten que no les prestan atención. El asesor pierde tiempo en actualizaciones manuales que no agregan valor.

**El contexto:**  
Tokko ya tiene Propietar.io — un portal básico para propietarios. Pero requiere activación especial, es genérico, y depende 100% de que los agentes carguen todo en Tokko.

**El objetivo:**  
Portal web con la marca de Lexinton donde el propietario ve todo sobre su propiedad, en tiempo real, sin llamar.

**Funcionalidades:**

### Lo que el propietario ve cuando entra

```
Bienvenido, Roberto Sánchez
Su propiedad: Echeverría 1234, Piso 3° B, Palermo

┌─────────────────────────────────────────────────────┐
│ RESUMEN DEL MES                                     │
│ 👁️  247 vistas en portales                         │
│ 📩  12 consultas recibidas                          │
│ 🚶 3 visitas realizadas                             │
│ 💬 2 propuestas en evaluación                       │
└─────────────────────────────────────────────────────┘

PUBLICADA EN:   Zonaprop ✅  Argenprop ✅  MercadoLibre ✅  Web Lexinton ✅

ÚLTIMA ACTIVIDAD:
• Hoy    - Consulta recibida por WhatsApp (interesado en visita)
• Lunes  - Visita realizada con familia García  
• Viernes pasado - Precio revisado según mercado

¿Querés actualizar algo? [Solicitar cambio de precio] [Subir nuevas fotos] [Contactar a mi asesor]
```

**Diferencial vs Propietar.io nativo de Tokko:**
- Tiene la marca y diseño de Lexinton (no el genérico de Tokko)
- Incluye notificaciones por WhatsApp cuando llega una consulta nueva
- El propietario puede solicitar cambios directamente (se genera un ticket interno)
- Reporte mensual automático que se le envía por email con resumen del período
- No requiere que los agentes estén en Tokko para activarlo (lo controlamos nosotros)

**Cómo se construye:**
- Next.js (misma base)
- Lee datos de Tokko API (propiedades, estadísticas)
- Custom DB: credenciales de propietarios, solicitudes, historial
- Autenticación simple: email + magic link (sin contraseña)
- Notificaciones WhatsApp via Make cuando hay actividad nueva

**Esfuerzo:** 4–5 semanas  
**Precio sugerido:** USD 2,200–2,800 (fijo)

**Business case para el cliente:** Retener a un propietario vale más que captar uno nuevo. Si este portal les permite retener 3 propietarios que de otra forma se irían, el retorno es inmediato. Una exclusiva de venta promedio en Lexinton... hacé las cuentas.

---

## Fase 8 — "El matching automático"
### La propiedad correcta para el cliente correcto, antes de que la vea

**El problema a resolver:**  
Cuando Lexinton carga una propiedad nueva, hay decenas de leads en su base que pueden estar interesados. Pero nadie los llama. No hay sistema. La propiedad espera que los leads vengan a ella.

**El objetivo:**  
Cuando se publica una propiedad nueva en Tokko, el sistema automáticamente identifica qué leads de la base tienen criterios compatibles y les manda un WhatsApp personalizado.

**Cómo funciona:**

```
Nuevo depto cargado en Tokko
    │  (detectado por Make via polling cada 15 min)
    ▼
Make extrae: zona, tipo, precio, ambientes
    │
    ▼
Busca en Custom DB: leads con búsqueda compatibles
    │  (ej: buscan 2 ambientes en Palermo, presupuesto USD 150k-200k)
    ▼
Para cada match:
  → WA automático: "Hola [Nombre] 👋 Recién sumamos un depto que creemos
    que se ajusta a lo que buscabas. 2 ambientes, Palermo, USD 165k.
    [Ver fotos] ¿Te parece que lo veamos?"
    │
    └─ Si responde → asesor asignado recibe notificación y toma la conversación
```

**La base de datos de búsqueda de leads** se construye a partir de:
- Lo que completó en el formulario del sitio (Fase 2)
- Lo que dijo en el chat de WhatsApp (taggeado por asesor)
- Lo que buscó en el buscador del sitio (analytics)
- Lo que preguntó en Meta Ads (por campaign target)

**Esfuerzo:** 3–4 semanas  
**Precio sugerido:** USD 1,200–1,500 (fijo, sobre la base de Fases 3 y 4)

---

## Fase 9 — "La firma digital"
### De la operación cerrada a la firma del contrato, sin papel

**El problema a resolver:**  
El cierre de una operación en Argentina todavía implica impresiones, escaneos, viajes, escribanos, y semanas de ida y vuelta. En alquileres especialmente, hay una ventana de 48-72 horas donde el inquilino puede cambiar de opinión o el propietario encontrar otro interesado.

**El objetivo:**  
Cuando se marca una operación como cerrada en Tokko, el sistema genera y envía el pre-contrato de reserva en minutos, y ambas partes pueden firmarlo desde el celular.

**Cómo funciona:**
- Operación cerrada en Tokko → Make detecta evento
- Make genera un documento PDF a partir de template (datos del inmueble + comprador/inquilino)
- Envía al servicio de firma digital (DocuSign, HelloSign, o FirmaOnline.ar para Argentina)
- Propietario e interesado reciben link por email/WA para firmar
- Firma completa → PDF guardado en Google Drive linkeado al contacto en Tokko
- Notificación al asesor: "✅ Reserva firmada por ambas partes"

**Regulación en Argentina:** La firma electrónica tiene validez legal según la Ley 25.506. El adelanto de reserva puede instrumentarse con este método; la escritura pública sigue siendo presencial por ley, pero el pre-acuerdo y la reserva son firmables digitalmente.

**Servicios sugeridos:**
- **Signer.ar** — solución local, precio ARS razonable
- **DocuSign** — precio USD, más costoso pero muy conocido
- **HelloSign (Dropbox)** — opción intermedia

**Esfuerzo:** 2–3 semanas  
**Precio sugerido:** USD 800–1,200 (fijo) + costo mensual del servicio de firma (Lexinton lo paga directamente)

---

## Resumen del roadmap completo

| Fase | Nombre | Precio (USD) | Duración | Prioridad |
|---|---|---|---|---|
| 1 | Automatización tasaciones (✅ hecho) | — | — | — |
| 2 | Sitio web Next.js (🔄 en curso) | 3,400 | 8 sem | — |
| **3** | **Consolidación de leads en Tokko** | **600–900** | **2–3 sem** | 🔥 Alta |
| **4** | **Panel interno (command center)** | **2,800–3,500** | **4–6 sem** | 🔥 Alta |
| **5** | **WhatsApp automation** | **1,200–1,800** | **3–4 sem** | 🔥 Alta |
| 6 | Dashboard analytics ejecutivo | 1,800–2,400 | 3–4 sem | ⚡ Media |
| 7 | Portal del propietario custom | 2,200–2,800 | 4–5 sem | ⚡ Media |
| 8 | Matching automático lead-propiedad | 1,200–1,500 | 3–4 sem | 🟡 Baja |
| 9 | Firma digital en operaciones | 800–1,200 | 2–3 sem | 🟡 Baja |
| | **TOTAL Fases 3–9** | **~14,000** | **~2 años** | |

---

## Cómo presentar esto al cliente

No mostrar todo el roadmap de golpe. La forma correcta es:

**Reunión post-sitio (cuando la web esté lista):**

> "Ahora que el sitio está listo, quiero mostrarte algo. Revisé en detalle todo lo que Tokko te ofrece y no estás usando. No te digo esto para venderte más trabajo — te lo digo porque hay cosas que podrías activar mañana y que cambiarían cómo opera tu equipo.
>
> El problema más urgente que veo: tus leads viven en tres lugares distintos y ningún asesor tiene la foto completa. Y cuando llega un lead de Meta a las 11 de la noche, nadie lo ve hasta el día siguiente.
>
> ¿Querés que te cuente cómo lo resolvemos?"

Luego presentar Fase 3 (consolidación de leads) como el siguiente paso natural. Es de bajo costo, alto impacto y resultado rápido. Eso genera confianza para las fases más grandes.

**La progresión ideal:**
```
Fase 2 (sitio) → Fase 3 (leads unificados, ~1 mes después) → 
Fase 4+5 (panel + WA automation, ~3 meses después) → 
Fase 6+7 (analytics + propietarios, ~6 meses después)
```

---

## El modelo de relación que queremos

No somos "el que les hizo la web". Somos **el CTO externo de Lexinton**.

Eso implica:
- Reunión mensual de revisión de KPIs (incluida en retainer)
- Sugerencias proactivas cuando vemos algo que se puede mejorar
- Capacitar al equipo cuando lanzamos algo nuevo
- Ser el primer contacto cuando algo falla (antes que Tokko soporte)
- Traducir lo que hacemos en lenguaje de negocio, no técnico

**Propuesta de retainer mensual (post Fase 3):** USD 250–350/mes  
Incluye:
- Mantenimiento del sitio y automatizaciones existentes
- 1 reunión mensual de revisión con el dueño
- Ajustes menores a los Make scenarios
- Soporte técnico prioritario (< 4 hrs de respuesta)
- 2 horas de desarrollo incluidas (cambios chicos, ajustes de panel)

Esto nos da predictibilidad de ingresos y a ellos les da un socio real.

---

*Documento interno · Revisión periódica recomendada cada 6 meses según avance del proyecto*
