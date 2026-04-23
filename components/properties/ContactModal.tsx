'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { TokkoProperty } from '@/lib/tokko/types'
import { ContactForm } from './ContactForm'

interface Props {
  open: boolean
  onClose: () => void
  property?: TokkoProperty
}

export function ContactModal({ open, onClose, property }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl
              rounded-t-2xl max-h-[90vh] overflow-y-auto
              md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
              md:rounded-2xl md:w-[90vw] md:max-w-[480px]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <Icon icon="solar:close-circle-linear" className="w-6 h-6" />
            </button>
            <ContactForm property={property} onSuccess={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

