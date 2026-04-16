'use client'
/**
 * PropertyGallery — Galería de imágenes con lightbox
 *
 * Grid: foto principal grande (2x2) + hasta 4 thumbnails.
 * Click en cualquier foto abre el lightbox con navegación completa.
 * En mobile muestra solo la foto principal + botón "Ver todas".
 */

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { TokkoPhoto } from '@/lib/tokko/types'

interface Props {
  photos: TokkoPhoto[]
  title: string
}

export function PropertyGallery({ photos, title }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (!photos?.length) return null

  const main = photos[0]
  const thumbs = photos.slice(1, 5)     // hasta 4 thumbnails visibles
  const remaining = photos.length - 5   // "+N fotos" en el último thumb

  const slides = photos.map((p) => ({
    src: p.image,
    alt: `${title} — foto`,
  }))

  function open_at(i: number) {
    setIndex(i)
    setOpen(true)
  }

  return (
    <>
      {/* ── DESKTOP: grid 2+2 ───────────────────────── */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[520px]">

        {/* Foto principal — 2 columnas, 2 filas */}
        <button
          className="col-span-2 row-span-2 relative overflow-hidden cursor-zoom-in group"
          onClick={() => open_at(0)}
          aria-label="Ver foto principal"
        >
          <Image
            src={main.image}
            alt={`${title} — foto principal`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
            sizes="(max-width: 1280px) 50vw, 600px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </button>

        {/* Thumbnails */}
        {thumbs.map((photo, i) => {
          const isLast = i === thumbs.length - 1 && remaining > 0
          return (
            <button
              key={i}
              className="relative overflow-hidden cursor-zoom-in group"
              onClick={() => open_at(i + 1)}
              aria-label={`Ver foto ${i + 2}`}
            >
              <Image
                src={photo.image}
                alt={`${title} — foto ${i + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-400"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              {/* Overlay "+N fotos" en el último thumb si hay más */}
              {isLast && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    +{remaining + 1} fotos
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* ── MOBILE: solo foto principal ─────────────── */}
      <div className="md:hidden relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={main.image}
          alt={`${title} — foto principal`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {photos.length > 1 && (
          <button
            onClick={() => open_at(0)}
            className="absolute bottom-4 right-4 bg-black/60 text-white text-[11px] font-bold tracking-[0.1em] uppercase px-3 py-2"
          >
            Ver {photos.length} fotos
          </button>
        )}
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────── */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        styles={{ root: { '--yarl__color_backdrop': 'rgba(0,0,0,0.92)' } }}
      />
    </>
  )
}
