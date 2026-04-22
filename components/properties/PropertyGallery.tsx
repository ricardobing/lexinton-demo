'use client'
/**
 * PropertyGallery — Galería estilo ZonaProp
 *
 * Desktop: foto principal (2/3 ancho, 480px) + grid 2×2 de thumbs (1/3)
 * Mobile: foto principal + botón "Ver todas"
 * Click → lightbox con navegación completa.
 */

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
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
  const thumbs = photos.slice(1, 5)   // up to 4 thumbnails
  const slides = photos.map((p) => ({ src: p.image, alt: `${title} — foto` }))

  function open_at(i: number) { setIndex(i); setOpen(true) }

  return (
    <>
      {/* ── DESKTOP: 2/3 main + 1/3 grid 2×2 ────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:grid grid-cols-[2fr_1fr] gap-2 h-[480px] rounded-xl overflow-hidden"
      >
        {/* Foto principal */}
        <div
          className="relative overflow-hidden cursor-zoom-in group"
          onClick={() => open_at(0)}
        >
          <Image
            src={main.image}
            alt={`${title} — foto principal`}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            priority
            sizes="(max-width: 1280px) 55vw, 700px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Grid 2×2 */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {[0, 1, 2, 3].map((i) => {
            const photo = thumbs[i]
            if (!photo) return <div key={i} className="bg-gray-100" />
            const isLast = i === 3 && photos.length > 5
            return (
              <div
                key={i}
                className="relative overflow-hidden cursor-zoom-in group"
                onClick={() => open_at(i + 1)}
              >
                <Image
                  src={photo.image}
                  alt={`${title} — foto ${i + 2}`}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-400"
                  sizes="20vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                {isLast && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      <Icon icon="solar:camera-bold" className="w-4 h-4" />
                      +{photos.length - 4} fotos
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ── MOBILE: foto principal + botón ────────────── */}
      <div className="md:hidden relative w-full aspect-[4/3] overflow-hidden rounded-xl">
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
            className="absolute bottom-4 right-4 bg-black/60 text-white text-[11px] font-semibold tracking-[0.08em] uppercase px-4 py-2 rounded-full flex items-center gap-1.5"
          >
            <Icon icon="solar:camera-bold" className="w-3.5 h-3.5" />
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
