'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'bot' | 'user'

interface Msg {
  id: number
  role: Role
  text: string
}

type StepKey =
  | 'WELCOME'
  | 'OPERACION'
  | 'TIPO'
  | 'ZONA'
  | 'PRESUPUESTO'
  | 'ASK_NAME'
  | 'ASK_PHONE'
  | 'ASK_EMAIL'
  | 'DONE'

interface Step {
  key: StepKey
  botText: string
  options?: string[]          // quick-reply chips
  inputType?: 'text' | 'tel' | 'email'
  inputPlaceholder?: string
  next: StepKey | null
  metaKey?: string            // field key in meta object
}

// ─── Chatbot flow ─────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    key: 'WELCOME',
    botText: '¡Hola! 👋 Soy el asistente de Lexinton Propiedades.\n¿Qué estás buscando?',
    options: ['Comprar', 'Alquilar', 'Tasar / Vender', 'Consulta general'],
    next: 'TIPO',
    metaKey: 'operacion',
  },
  {
    key: 'OPERACION',   // placeholder — handled inline
    botText: '',
    next: 'TIPO',
  },
  {
    key: 'TIPO',
    botText: '¿Qué tipo de propiedad te interesa?',
    options: ['Departamento', 'Casa / PH', 'Local comercial', 'Oficina', 'Terreno'],
    next: 'ZONA',
    metaKey: 'tipo',
  },
  {
    key: 'ZONA',
    botText: '¿En qué zona preferís?',
    options: ['Palermo', 'Belgrano', 'Recoleta', 'Villa Crespo', 'Nuñez / Saavedra', 'Otra zona'],
    next: 'PRESUPUESTO',
    metaKey: 'zona',
  },
  {
    key: 'PRESUPUESTO',
    botText: '¿Cuál es tu presupuesto aproximado?',
    options: ['Hasta USD 80.000', 'USD 80k – 150k', 'USD 150k – 300k', 'Más de USD 300k', 'No definido'],
    next: 'ASK_NAME',
    metaKey: 'presupuesto',
  },
  {
    key: 'ASK_NAME',
    botText: '¡Genial! 😊 Para enviarte opciones personalizadas, ¿me decís tu nombre?',
    inputType: 'text',
    inputPlaceholder: 'Tu nombre...',
    next: 'ASK_PHONE',
    metaKey: 'name',
  },
  {
    key: 'ASK_PHONE',
    botText: '¿Y tu número de WhatsApp o teléfono?',
    inputType: 'tel',
    inputPlaceholder: '+54 11 ...',
    next: 'ASK_EMAIL',
    metaKey: 'phone',
  },
  {
    key: 'ASK_EMAIL',
    botText: '¿Tu email? (opcional — podés saltear)',
    inputType: 'email',
    inputPlaceholder: 'correo@ejemplo.com',
    next: 'DONE',
    metaKey: 'email',
  },
  {
    key: 'DONE',
    botText: '¡Perfecto! 🏠 Un asesor de Lexinton se va a comunicar contigo a la brevedad.\n¿Necesitás algo más?',
    options: ['Ver propiedades', 'Quiero tasar', 'No, gracias'],
    next: null,
  },
]

const stepByKey = (key: StepKey): Step => STEPS.find(s => s.key === key)!

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [currentStep, setCurrentStep] = useState<StepKey>('WELCOME')
  const [inputVal, setInputVal] = useState('')
  const [meta, setMeta] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [unread, setUnread] = useState(0)
  const [botTyping, setBotTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(0)

  const newId = () => ++idRef.current

  const scrollDown = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  // Auto-open after 8s + pulse animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPulse(true)
      setUnread(1)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  // Start chatbot when opened for the first time
  useEffect(() => {
    if (open && msgs.length === 0) {
      setUnread(0)
      setPulse(false)
      addBotMsg(stepByKey('WELCOME').botText)
    }
    if (open) {
      setUnread(0)
      setPulse(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => { scrollDown() }, [msgs, botTyping, scrollDown])

  function addBotMsg(text: string, delay = 600) {
    setBotTyping(true)
    setTimeout(() => {
      setBotTyping(false)
      setMsgs(prev => [...prev, { id: newId(), role: 'bot', text }])
    }, delay)
  }

  function addUserMsg(text: string) {
    setMsgs(prev => [...prev, { id: newId(), role: 'user', text }])
  }

  async function advance(userAnswer: string, metaKey?: string, skipTo?: StepKey) {
    addUserMsg(userAnswer)

    const newMeta = metaKey ? { ...meta, [metaKey]: userAnswer } : meta
    if (metaKey) setMeta(newMeta)

    const step = stepByKey(currentStep)
    const nextKey = skipTo ?? step.next

    if (!nextKey) return

    if (nextKey === 'DONE') {
      setCurrentStep('DONE')
      // Submit lead
      setSubmitting(true)
      addBotMsg('Un momento, estoy registrando tu consulta... ⏳', 800)
      try {
        const res = await fetch('/api/chat/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:    newMeta.name    || userAnswer,
            phone:   newMeta.phone  || '',
            email:   newMeta.email  || '',
            meta:    newMeta,
          }),
        })
        const json = await res.json()
        setSubmitted(true)
        console.info('[ChatWidget] lead submitted:', json)
      } catch (e) {
        console.warn('[ChatWidget] submit error:', e)
        setSubmitted(true) // still show success to user
      } finally {
        setSubmitting(false)
        setTimeout(() => {
          addBotMsg(stepByKey('DONE').botText, 400)
        }, 1200)
      }
      return
    }

    setCurrentStep(nextKey)
    const nextStep = stepByKey(nextKey)
    addBotMsg(nextStep.botText)
  }

  function handleOption(option: string) {
    const step = stepByKey(currentStep)
    // Special actions after DONE
    if (currentStep === 'DONE') {
      if (option === 'Ver propiedades') window.location.href = '/propiedades'
      if (option === 'Quiero tasar')    window.location.href = '/tasar'
      if (option === 'No, gracias')     setOpen(false)
      return
    }
    advance(option, step.metaKey)
  }

  function handleInputSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = inputVal.trim()
    if (!val || submitting) return
    setInputVal('')
    const step = stepByKey(currentStep)
    advance(val, step.metaKey)
  }

  const step = stepByKey(currentStep)
  const showInput  = !step.options && step.inputType && currentStep !== 'DONE'
  const showChips  = !!step.options && currentStep !== 'DONE' || (currentStep === 'DONE' && submitted)

  return (
    <>
      {/* ── Floating button ────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
        className={[
          'fixed bottom-6 left-5 z-50',
          'w-14 h-14 rounded-full shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-300',
          open
            ? 'bg-[#3d5a6c] rotate-0 scale-100'
            : 'bg-[#3d5a6c] hover:scale-110',
          pulse && !open ? 'animate-bounce' : '',
        ].join(' ')}
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* ── Chat window ────────────────────────────────────────────────── */}
      <div
        className={[
          'fixed bottom-24 left-5 z-50',
          'w-[340px] max-w-[calc(100vw-2rem)]',
          'bg-white rounded-2xl shadow-2xl',
          'flex flex-col overflow-hidden',
          'transition-all duration-300 origin-bottom-left',
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none',
        ].join(' ')}
        style={{ height: '480px' }}
      >
        {/* Header */}
        <div className="bg-[#3d5a6c] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">Lexinton Propiedades</p>
            <p className="text-white/70 text-xs">Asistente online · Responde al instante</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-[#f0ede6]">
          {msgs.map(msg => (
            <div
              key={msg.id}
              className={['flex', msg.role === 'user' ? 'justify-end' : 'justify-start'].join(' ')}
            >
              <div
                className={[
                  'max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-snug whitespace-pre-wrap',
                  msg.role === 'bot'
                    ? 'bg-white text-[#111] rounded-tl-sm shadow-sm'
                    : 'bg-[#3d5a6c] text-white rounded-tr-sm',
                ].join(' ')}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {botTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick-reply chips */}
        {showChips && !botTyping && (
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-2">
            {(currentStep === 'DONE' ? stepByKey('DONE').options! : step.options!).map(opt => (
              <button
                key={opt}
                onClick={() => handleOption(opt)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#3d5a6c] text-[#3d5a6c] hover:bg-[#3d5a6c] hover:text-white transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Text input */}
        {showInput && !botTyping && (
          <form onSubmit={handleInputSubmit} className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2">
            <input
              ref={inputRef}
              type={step.inputType}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={step.inputPlaceholder}
              disabled={submitting}
              className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-[#3d5a6c] bg-gray-50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || submitting}
              className="w-9 h-9 rounded-full bg-[#3d5a6c] text-white flex items-center justify-center hover:bg-[#2d4a5c] disabled:opacity-40 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        )}
      </div>
    </>
  )
}
