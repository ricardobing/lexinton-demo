# Propuesta de Desarrollo Web
## Lexinton Real Estate — Nuevo sitio en Next.js + Tokko Broker

---

**Preparada para:** Equipo Lexinton Real Estate  
**Fecha:** Julio 2025  
**Válida hasta:** 60 días desde la fecha de emisión

---

## El punto de partida

Hoy el sitio de Lexinton funciona. Tiene propiedades, tiene buscador, recibe consultas. Pero fue construido con una plantilla de WordPress hace ya varios años y eso se nota: carga lenta, diseño estándar que no los diferencia del resto, y limitaciones para crecer o adaptarse a lo que van necesitando.

La buena noticia es que el sistema que usan para gestionar sus propiedades, **Tokko Broker**, ya tiene todo lo que necesitamos. La base de datos de propiedades, las imágenes, las consultas de clientes: todo está ahí. Sólo hay que construir encima de eso una experiencia de usuario que esté a la altura de la trayectoria de Lexinton.

Ya tenemos un demo funcionando. Podés verlo ahora mismo.

---

## Qué vamos a construir

Un sitio web nuevo, moderno y rápido para Lexinton. No una plantilla, no un template: un desarrollo hecho a medida, con el diseño y la identidad visual que Lexinton merece.

### Las páginas que va a tener el sitio

#### 🏠 Inicio
La puerta de entrada. Un video de la ciudad de Buenos Aires de fondo, los números que avalan la trayectoria de Lexinton, las propiedades destacadas del momento, cómo trabajamos, testimonios de clientes, y un formulario para solicitar tasaciones. Ya está construida y puede verse en el demo.

#### 🔍 Buscador de propiedades
El corazón del sitio. Los visitantes van a poder buscar por:
- **Tipo de operación:** Venta o Alquiler
- **Tipo de propiedad:** Departamento, casa, PH, local, etc.
- **Barrio o zona**
- **Precio mínimo y máximo**
- **Cantidad de ambientes**

Los resultados se actualizan mientras navegás. La URL cambia con cada búsqueda, así que los visitantes pueden compartir directamente un resultado de búsqueda por WhatsApp o guardar el link.

#### 📋 Ficha de cada propiedad
Cada propiedad tiene su propia página con:
- Todas las fotos en galería
- Descripción completa
- Características (ambientes, baños, superficie, expensas, etc.)
- Ubicación en mapa
- Formulario de contacto que llega **directamente a su panel de Tokko**

#### 🏗️ Emprendimientos
Una sección dedicada a los proyectos nuevos en construcción o pozo, con fichas propias y formulario de contacto integrado al CRM.

#### 📞 Contacto
Datos completos, formulario de contacto, mapa de las sucursales.

---

## Cómo funciona por dentro (sin tecnicismos)

El sitio nuevo **se conecta directamente a su cuenta de Tokko Broker**. Eso significa:

- ✅ Cuando carguen una propiedad nueva en Tokko, aparece en el sitio **automáticamente**. Sin hacer nada extra.
- ✅ Cuando un visitante completa el formulario de contacto, la consulta llega al **panel de Tokko** identificada con la propiedad que consultó, igual que si hubiera llegado por cualquier portal.
- ✅ Si bajan el precio de una propiedad en Tokko, el sitio lo muestra actualizado en **minutos**.
- ✅ Si una propiedad se vende y la dan de baja en Tokko, desaparece del sitio también.

**No van a necesitar hacer mantenimiento del sitio para mantener las propiedades actualizadas.** Tokko es su herramienta, y el sitio nuevo la aprovecha al máximo.

---

## Por qué esto es mejor que lo que tienen hoy

| | Sitio actual (WordPress) | Sitio nuevo (Next.js) |
|---|---|---|
| **Velocidad** | 4–8 segundos de carga | < 2 segundos |
| **Diseño** | Plantilla genérica | 100% personalizado para Lexinton |
| **Actualización de propiedades** | Manual o via plugin | Automática desde Tokko |
| **Leads en Tokko** | Funciona parcialmente | Totalmente integrado |
| **SEO** | Básico | Optimizado (Google indexa más rápido) |
| **Mobile** | Funciona | Diseñado primero para celular |
| **Dependencia de terceros** | Plugin de Tokko para WP (Optimun) | Ninguna: código propio |

---

## Por qué esto es mejor que contratar un servicio mensual

Hay plataformas como **Brokian** que ofrecen sitios web para inmobiliarias con planes mensuales. Son una buena opción para quien empieza, pero tienen un techo claro.

Con un plan mensual de esas plataformas:
- Pagan todos los meses para tener el sitio activo
- El código no es de ustedes: si se van, pierden todo
- El diseño es un template que usan decenas de otras inmobiliarias
- No pueden pedirle al sitio algo que la plataforma no previó

Con nuestro desarrollo:
- **Pago único.** No hay cuota mensual por la existencia del sitio.
- **El código es de Lexinton.** Les entregamos todo, incluyendo el repositorio.
- **El hosting es gratuito** (usamos Vercel, la plataforma estándar del sector, con plan gratuito más que suficiente para el tráfico de Lexinton).
- **Pueden pedirle cambios o mejoras** cuando quieran, con total libertad.

---

## La propuesta económica

### Paquete completo — USD 3.400

Incluye todo lo detallado arriba: 8 semanas de trabajo, todas las páginas, buscador completo, integración con Tokko, SEO, analytics, deploy en el dominio de Lexinton y una sesión de capacitación.

### Forma de pago

| Momento | Porcentaje | USD |
|---|---|---|
| **Al firmar la propuesta** (+ entrega de la API KEY de Tokko) | 30% | $1.020 |
| **Al entregar el buscador en vivo** | 30% | $1.020 |
| **Al tener todas las fichas y formularios funcionando** | 25% | $850 |
| **Al lanzar en el dominio definitivo** | 15% | $510 |

### ¿Qué incluye?

✅ Diseño completo y a medida  
✅ Homepage + buscador + fichas + emprendimientos + contacto  
✅ Integración total con Tokko Broker  
✅ Formularios de contacto y tasación conectados al CRM  
✅ SEO técnico (Google va a empezar a indexarlos mejor)  
✅ Google Analytics configurado (van a poder ver cuántas visitas, qué buscan, etc.)  
✅ Chatbot Cliengo integrado (si quieren mantenerlo)  
✅ Deploy en `lexinton.com.ar` con SSL  
✅ Una sesión de capacitación (video call de 1 hora)  
✅ Manual de uso simple, sin tecnicismos  
✅ Repositorio de código entregado a ustedes  

### ¿Qué no incluye?

❌ Vista de mapa con pins de propiedades (se puede agregar como extra)  
❌ Blog o sección de noticias  
❌ Hosting (Vercel es gratuito para este uso)  
❌ Dominio (ya lo tienen)  
❌ Correos corporativos  

---

## Lo que necesitamos de su parte

Para arrancar necesitamos tres cosas:

1. **La API KEY de Tokko Broker** — La consiguen en el panel de su cuenta de Tokko: *Configuración → Integraciones → API*. Es un código de texto. Nos lo mandan y nosotros hacemos el resto.

2. **El logo de Lexinton en formato SVG o PNG de alta resolución.**

3. **Textos de "quiénes somos"**, descripción de las sucursales, y 3–5 testimonios de clientes (nombre + texto corto, con o sin foto).

Eso es todo lo que necesitan de su parte para que podamos arrancar.

---

## El proceso, semana a semana

| Semana | Qué pasa |
|---|---|
| 1 | Recibimos la API KEY, verificamos la integración, definimos últimos detalles |
| 2 | La homepage queda conectada a sus propiedades reales de Tokko |
| 3–4 | El buscador de propiedades queda en vivo (pueden compartirlo internamente para revisión) |
| 5 | Las fichas individuales de cada propiedad están funcionando |
| 6 | Los emprendimientos y los formularios de contacto quedan completos |
| 7 | SEO, analytics, chatbot, últimos ajustes |
| 8 | QA final, apuntamos el dominio, capacitación, entrega |

Durante todo el proceso van a poder ver el avance en un link de preview antes del lanzamiento oficial.

---

## Mantenimiento después del lanzamiento (opcional)

El sitio una vez lanzado funciona solo. No necesitan hacer nada para que las propiedades se actualicen: todo va desde Tokko.

Si en algún momento quieren hacer cambios, agregar secciones nuevas, o simplemente tener a alguien disponible ante cualquier imprevisto, podemos ofrecer un **servicio de mantenimiento mensual** por **USD 180/mes**.

Incluye:
- Actualizaciones de seguridad del sitio
- Soporte técnico ante cualquier problema
- Pequeños cambios de contenido (textos, banners, etc.)

Es completamente opcional y pueden contratarlo o cancelarlo cuando quieran.

---

## Preguntas frecuentes

**¿El sitio nuevo va a bajar el posicionamiento en Google que tenemos hoy?**  
No. Vamos a hacer una migración cuidadosa que conserva todas las URLs importantes y agrega redirecciones donde corresponda. Con el tiempo el sitio nuevo va a rankear mejor, no peor.

**¿Qué pasa si Tokko tiene una caída?**  
El sitio guarda una copia de las propiedades en caché. Si Tokko tiene una caída momentánea, el sitio sigue funcionando con la información de los últimos minutos. Es como cuando un diario tiene la edición impresa aunque la web esté caída.

**¿Pueden pedir cambios durante el desarrollo?**  
Sí. Durante el proceso de desarrollo es normal ajustar detalles de diseño, textos o funcionalidades menores. Cambios grandes que alteren el alcance del proyecto se evalúan caso a caso.

**¿Cuánto tiempo después del lanzamiento pueden pedirnos cambios?**  
Sin cargo adicional, hasta 30 días después del lanzamiento cubrimos los ajustes que surjan de la revisión final. Después de ese período, cualquier cambio se maneja via retainer o cotización puntual.

**¿Qué pasa si Lexinton cambia de CRM y deja de usar Tokko?**  
El código del sitio es de ustedes. Un desarrollador puede adaptar la integración a cualquier otro CRM o fuente de datos. No quedan atados a ninguna plataforma.

---

## Próximos pasos

Si la propuesta les parece bien, el proceso es simple:

1. **Confirmación por escrito** (respuesta a este documento o email)
2. **Pago del anticipo** (30% → USD 1.020) para reservar el inicio
3. **Envío de la API KEY de Tokko** y el logo
4. **Arrancamos la semana siguiente**

---

Quedamos a disposición para cualquier consulta o para armar una videollamada y repasar la propuesta juntos.

---

*Esta propuesta fue preparada exclusivamente para Lexinton Real Estate. Los precios y condiciones son confidenciales.*
