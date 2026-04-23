'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { ContactModal } from '@/components/properties/ContactModal'

export function HomeContactCTA() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs text-[#C41230] uppercase tracking-[0.2em] mb-3">
              Contacto directo
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              ¿Necesitás hablar con un asesor?
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Respondemos en menos de 2 horas en horario comercial.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 bg-[#C41230] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#a30f28] transition-colors"
              >
                <Icon icon="solar:letter-bold" className="w-4 h-4" />
                Escribirnos ahora
              </button>

              <a
                href="https://wa.me/5491131519928?text=Hola%20Lexinton%2C%20me%20comunico%20desde%20la%20web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#25D366] text-[#25D366] px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <Icon icon="logos:whatsapp-icon" className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              011 4776-5003 · info@lexinton.com.ar
            </p>
          </motion.div>
        </div>
      </section>

      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
