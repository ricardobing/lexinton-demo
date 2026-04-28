# Guía para agregar multimedia del cliente

## Videos (hero, emprendimientos)

### 1. Recibir el archivo del diseñador gráfico

Formatos aceptados: MP4, MOV, AVI.

### 2. Comprimir con ffmpeg

```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow \
  -an -vf "scale=1280:-2" output.mp4
```

Objetivo: **menos de 5MB** para el hero. Verificar con `ls -lh output.mp4`.

### 3. Subir a Cloudinary (free tier)

1. Crear cuenta en [cloudinary.com](https://cloudinary.com)
2. Dashboard → Media Library → Upload → seleccionar `output.mp4`
3. Copiar la URL pública del asset

En `HeroSection.tsx`, reemplazar el `src` del `<video>` por la URL de Cloudinary:

```tsx
<video
  src="https://res.cloudinary.com/TU_CLOUD/video/upload/q_auto/hero.mp4"
  autoPlay muted loop playsInline
  className="absolute inset-0 w-full h-full object-cover"
/>
```

### 4. Generar poster image del primer frame

```bash
ffmpeg -ss 00:00:01 -i output.mp4 -vframes 1 -q:v 2 hero-poster.jpg
```

Subir `hero-poster.jpg` a Cloudinary también, luego usarlo en:

```tsx
<Image
  src="https://res.cloudinary.com/TU_CLOUD/image/upload/w_1280,f_auto,q_auto/hero-poster.jpg"
  alt=""
  fill
  priority
  className="object-cover"
/>
```

---

## Imágenes (fondos de páginas, CTA sections)

### 1. Recibir imagen del diseñador

Formatos aceptados: JPG, PNG, WEBP. Resolución mínima recomendada: 1920×1080.

### 2. Subir a Cloudinary

Dashboard → Upload → copiar URL.

### 3. Usar URL con transformaciones automáticas

```
https://res.cloudinary.com/TU_CLOUD/image/upload/w_1200,f_auto,q_auto/nombre.jpg
```

- `f_auto` — formato óptimo según el browser (AVIF → WebP → JPG)
- `q_auto` — calidad optimizada automáticamente por Cloudinary
- `w_1200` — ancho máximo (ajustar según el componente)

En Next.js, agregar el dominio a `next.config.js`:

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' },
  ],
},
```

---

## Variables de entorno para Cloudinary (cuando se use)

Agregar a `.env.local`:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
```

Solo lectura — no se necesita API key para servir URLs públicas.

---

## Imágenes pendientes de reemplazar

| Componente | Placeholder actual | Descripción |
|---|---|---|
| `components/home/DualCTA.tsx` | `/home-buy-bg.jpg` | Foto de fondo card "Comprar" — debe ser interior de depto premium |
| `components/HeroSection.tsx` | Video local / poster | Video aéreo del corredor Palermo-Belgrano |
| `components/tasar/TasarHero.tsx` | `/hero-poster.jpg` | Foto del barrio Palermo/Belgrano para hero de /tasar |

---

## Notas de rendimiento

- Siempre usar `priority={true}` en imágenes above-the-fold (hero, primera card del grid)
- Siempre usar `sizes` en imágenes que cambian de tamaño con el viewport
- Los videos del hero deben tener `muted`, `autoPlay`, `loop`, `playsInline`
- Para videos, siempre proveer un `poster` para evitar flash de pantalla negra
