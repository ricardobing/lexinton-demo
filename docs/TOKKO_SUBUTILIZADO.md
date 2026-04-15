# Tokko Broker — Lo que ofrece vs. lo que usa Lexinton
> **Documento interno** · Análisis de brecha tecnológica · Abril 2026  
> **Propósito:** Identificar todo lo que Tokko ya incluye en el plan de Lexinton y que no están aprovechando. Cada módulo no activado es una conversación posible.

---

## TL;DR

Lexinton paga Tokko Broker y lo usa como **catálogo de propiedades**. Es como tener una Ferrari y usarla para ir al kiosco de la esquina.

Tokko es un CRM inmobiliario completo con WhatsApp nativo, pipeline de ventas, portal para propietarios, publicación masiva a 50+ portales, reportes de equipo, red de colaboración entre agencias y más. **Nada de eso está activado en Lexinton.**

Lo que sigue es un inventario módulo a módulo.

---

## Mapa completo de módulos de Tokko

```
TOKKO BROKER
│
├── 🏠 PROPIEDADES
│   ├── Alta/baja/edición de propiedades         ✅ USO ACTIVO
│   ├── Emprendimientos/desarrollos               ⚠️ USO PARCIAL
│   ├── Módulo de difusión (50+ portales)         ❌ NO ACTIVO / SUBUTILIZADO
│   ├── Property tags y custom tags               ❌ NO CONFIGURADO
│   └── Publicación en Instagram                  ❌ NO ACTIVO (nuevo)
│
├── 👥 CONTACTOS / LEADS
│   ├── Panel de consultas (inbox de leads)       ⚠️ USO PARCIAL (sólo web/portales)
│   ├── Contactos desde Meta Ads                  ❌ NO CONECTADO → van a Sheets
│   ├── Tokko Chat - WhatsApp nativo              ❌ NO ACTIVADO
│   ├── WhatsApp Assistant                        ❌ NO ACTIVADO
│   ├── Cliengo (chatbot web)                     ⚠️ EXISTE PERO NO INTEGRADO A TOKKO
│   └── Contact tags (etiquetas)                  ❌ NO CONFIGURADO
│
├── 🎯 CRM / OPORTUNIDADES
│   ├── Módulo de oportunidades (pipeline)        ❌ NO ACTIVADO
│   ├── Seguimiento de leads con recordatorios    ❌ NO ACTIVADO
│   ├── Asignación de leads a agentes             ❌ MANUAL / NO SISTEMÁTICO
│   ├── Historial de interacciones por contacto   ❌ NO USADO SISTEMÁTICAMENTE
│   └── Cruce de demanda y oferta                 ❌ NO ACTIVADO
│
├── 📊 REPORTES Y MÉTRICAS
│   ├── Performance del equipo                    ❌ NO CONSULTADO
│   ├── Estadísticas por propiedad                ❌ NO CONSULTADO
│   ├── Fuentes de leads (origen)                 ❌ NO MEDIDO
│   └── Funnel de conversión                      ❌ NO MEDIDO
│
├── 🌐 RED TOKKO BROKER
│   └── Compartir propiedades con otras agencias  ❌ NO ACTIVADO
│
├── 🏢 PROPIETAR.IO
│   └── Portal para propietarios (estado prop)    ❌ NO ACTIVADO
│
├── 👔 USUARIOS Y PERMISOS
│   ├── Gestión de agentes/usuarios               ⚠️ BÁSICO
│   ├── Permisos por rol                          ⚠️ BÁSICO
│   └── Gestión de sucursales                     ⚠️ BÁSICO
│
└── 🔗 INTEGRACIONES (App-Exchange)
    ├── Email marketing (Mailchimp, etc.)          ❌ NO CONECTADO
    ├── Cliengo (chatbot)                          ❌ NO INTEGRADO A CRM
    └── API keys para integraciones custom         ❌ NO APROVECHADA
```

---

## Análisis módulo a módulo

### 🏠 Módulo de difusión — "Publicar es gratis si ya lo pagás"

**Qué hace:** Desde Tokko cargás una propiedad una sola vez y se publica automáticamente en todos los portales que tengás contratados: Zonaprop, Argenprop, MercadoLibre, Properati, y más de 50 portales nacionales e internacionales. Cambios de precio, fotos o descripción se replican en todos a la vez.

**Qué hace Lexinton hoy:** Carga propiedades en Tokko ✅. Pero probablemente gestiona publicaciones de portal de forma manual o las tiene configuradas parcialmente.

**El problema:** Si el asesor sube la propiedad a Tokko pero no activa la difusión correctamente, la propiedad existe en el CRM pero no está en Zonaprop. O si cambian el precio en Tokko pero no actualizan los portales, Zonaprop muestra un precio desactualizado y el cliente llama confundido.

**Oportunidad:** Auditar la configuración de difusión actual. Asegurarse que todas las propiedades activas estén bien publicadas y que los niveles de publicación (básico/premium) estén optimizados. Esto no requiere código: requiere configuración + proceso.

---

### 👥 Tokko Chat — "WhatsApp con esteroides que ya pagaron"

**Qué hace:** Tokko tiene integración nativa con WhatsApp Business. Los clientes pueden escribirle al WhatsApp de la agencia y el mensaje entra **directamente al panel de Tokko** como una consulta nueva. El asesor responde desde Tokko, puede compartir fichas de propiedades dentro del chat, y todo queda registrado en el historial del contacto.

También hay un **WhatsApp Assistant** — un sistema de respuestas automáticas iniciales para no dejar al lead esperando.

**Qué hace Lexinton hoy:** Tienen un número de WhatsApp (el del MobileSticky del sitio), pero los mensajes no entran a Tokko. Cada asesor gestiona su WhatsApp personal. No hay registro, no hay asignación, no hay historial centralizado. Si el asesor se va, el historial de conversaciones se va con él.

**El problema:** 
- Un lead escribe por WhatsApp → el asesor que estaba disponible responde desde su personal → esa conversación NO queda en Tokko → si mañana ese lead llama a la agencia, nadie sabe que ya habló.
- Sin registro centralizado no hay forma de saber cuántos leads llegan por WhatsApp ni si se les respondió a tiempo.

**Oportunidad:** Activar Tokko Chat. Esto requiere:
1. Tener una cuenta de WhatsApp Business con un número dedicado de la agencia
2. Vincular ese número a Tokko desde Configuración → WhatsApp
3. Configurar reglas de asignación automática (o manual para el coordinador)
4. Capacitar al equipo en responder desde Tokko en vez de desde el personal

**Esto es configuración, no código.** Pero alguien lo tiene que hacer y capacitar. Ahí entramos nosotros.

---

### 🎯 Módulo de Oportunidades — "El corazón del CRM que nunca abrieron"

**Qué hace:** Es el pipeline de ventas de Tokko. Cada lead puede avanzar por etapas definidas:
- Lead nuevo → Contactado → Visita programada → Visita realizada → Propuesta enviada → Negociación → Cerrado

Tokko lleva el historial, permite programar recordatorios ("llamar a Juan el lunes"), registrar notas de cada interacción, y asignar el lead a un asesor específico.

**Qué hace Lexinton hoy:** Los leads de Meta van a Google Sheets. Los leads del sitio van al email de la agencia. No hay pipeline. No hay etapas. No hay recordatorios. No hay historial centralizado. Cada asesor lleva su propio seguimiento (o no lo lleva).

**El problema:** 
- La respuesta promedio al lead en Argentina es > 2 horas. Estadísticas del sector dicen que si respondés en < 5 minutos, la tasa de conversión es 9x mayor que si respondés después de 30 minutos.
- Sin pipeline, nadie sabe en qué etapa está cada prospecto.
- Si un asesor tiene 40 leads en seguimiento, ¿cómo sabe a quién llamar hoy?
- La dirección no puede ver la performance del equipo.

**Oportunidad:** Activar el módulo de oportunidades y capacitar al equipo en usarlo. Esto requiere:
1. Definir con el cliente cuáles son las etapas de su proceso de venta
2. Configurarlas en Tokko
3. Asegurar que todos los leads entran a Tokko (ver Fase 3 del roadmap)
4. Capacitación del equipo (2-3 sesiones)
5. Definir KPIs que el dueño va a revisar cada semana

**Esto es consultoría de procesos + configuración**, no solo código.

---

### 📊 Reportes y Estadísticas — "Los números que nadie mira"

**Qué hace:** Tokko genera reportes de:
- Propiedades más consultadas (cuántas veces se vio cada ficha)
- Performance por asesor (cuántos leads atendieron, cuántos operaciones cerraron)
- Fuentes de leads (de dónde vienen: portales, web, WA, etc.)
- Evolución de consultas en el tiempo

**Qué hace Lexinton hoy:** Probablemente nadie revisa los reportes de Tokko regularmente. No hay dashboard de negocio. Las decisiones se toman por intuición.

**El problema:**
- ¿Cuántos leads llegaron este mes? Respuesta: "más o menos unos cuantos"
- ¿Cuál portal les trae más leads de calidad? Respuesta: "y... Zonaprop supongo"
- ¿Cuánto tarda cada asesor en responder? Respuesta: "depende"
- ¿Qué propiedades generan más consultas pero no cierran? Nadie sabe

**Oportunidad:** Interpretar los datos de Tokko para el cliente. Hacer una **reunión mensual de KPIs** con el dueño. No solo pasarle los gráficos: decirle qué significan y qué cambiaría. Esto es trabajo de alto valor con cero código extra.

---

### 🏢 Propietar.io — "El regalo que tiene Tokko para los propietarios"

**Qué hace:** Es un portal donde el propietario de una propiedad puede entrar con sus credenciales y ver:
- En qué portales está publicada su propiedad
- Cuántas visitas recibió
- Qué consultas llegaron
- El historial de visitas y ofertas que cargaron los agentes

Es una herramienta de transparencia y confianza para fidelizar a los propietarios que les confían sus inmuebles.

**Qué hace Lexinton hoy:** No lo tienen activado. La relación con propietarios se maneja por WhatsApp, llamadas, o reuniones presenciales.

**El problema:**
- El propietario llama cada dos días preguntando "¿cómo va?" porque no tiene visibilidad.
- El asesor pierde tiempo en actualizaciones manuales.
- El propietario se puede ir a otra inmobiliaria por falta de comunicación.

**Oportunidad:** Activar Propietar.io y ofrecerlo como diferencial de servicio. Requiere: 
1. Solicitar activación a Tokko (pedido al soporte)
2. Vincular a cada propietario a sus propiedades en Tokko
3. Enviarle el acceso (Tokko tiene una plantilla de email para esto)
4. Que los agentes carguen visitas y actualizaciones sistemáticamente (cambio de proceso)

**Para nosotros:** Podemos ir más allá y construir un **portal propio** con la marca de Lexinton que lea esa misma data de Tokko y le agregue notificaciones WhatsApp automatizadas al propietario. Pero primero hay que activar Propietar.io como quick win.

---

### 🌐 Red Tokko Broker — "Conectados con otras 2000+ inmobiliarias"

**Qué hace:** Red de colaboración entre todas las agencias que usan Tokko en Argentina. Podés buscar propiedades de otras agencias que estén disponibles para compartir comisión, y otras agencias pueden compartir tus propiedades.

**Oportunidad para Lexinton:** Si un cliente busca algo que Lexinton no tiene en su cartera, en vez de perderlo pueden ofrecerle opciones de la Red Tokko. Aumenta la capacidad de oferta sin aumentar el stock propio.

---

### 📧 Integraciones — "Email marketing que no saben que tienen"

**Qué dice el help center:** Tokko permite integrar con herramientas de email marketing (Mailchimp y similares). Esto permite:
- Exportar la base de contactos de Tokko a una herramienta de email
- Enviar newsletters o campañas segmentadas (ej: "propietarios buscando 3 ambientes en Palermo")

**Oportunidad:** Lexinton seguramente tiene una base de contactos en Tokko que nunca usaron para marketing proactivo. Una campaña de email mensual a leads que no cerraron ("¿seguís buscando? Tenemos algo nuevo que puede interesarte") podría generar conversiones sin costo de adquisición.

---

## Resumen de oportunidades por esfuerzo

| Módulo | Esfuerzo | Impacto | ¿Requiere código? |
|---|---|---|---|
| Difusión (auditar config) | Bajo | Alto | ❌ No |
| Módulo de oportunidades (activar) | Medio | Muy alto | ❌ No |
| Tokko Chat WhatsApp (activar) | Medio | Muy alto | ❌ No |
| Propietar.io (activar) | Bajo | Alto | ❌ No |
| Reportes (revisar + interpretar) | Bajo | Alto | ❌ No |
| Red Tokko (activar) | Bajo | Medio | ❌ No |
| Email marketing (conectar) | Medio | Medio | ❌ No |
| Meta Leads → Tokko (Make) | Medio | Muy alto | ⚠️ Make (mínimo) |
| Portal propietarios custom | Alto | Muy alto | ✅ Sí |
| WhatsApp automation sequences | Alto | Muy alto | ✅ Sí (Make) |
| Dashboard analytics custom | Alto | Alto | ✅ Sí |

---

## El diagnóstico honesto

Lexinton tiene herramientas de clase mundial que no usa. Antes de construir algo nuevo, hay trabajo de configuración y proceso que puede generar retorno inmediato con inversión mínima.

**La estrategia correcta es:**

1. Activar lo que ya tienen en Tokko (quick wins, bajo costo, alto impacto)
2. Conectar todos los canales de leads a Tokko (unificación)
3. Agregar la capa custom encima: automatización, dashboards, portales propios

No se trata de reemplazar Tokko. Se trata de **usarlo bien y construir encima de lo que ya funciona.**

---

*Documento interno · No distribuir al cliente en este formato · Ver ROADMAP_SOCIO_TECNOLOGICO.md para la estrategia de presentación*
