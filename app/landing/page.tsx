'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Users, 
  TrendingUp,
  ArrowRight,
  ChevronDown
} from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [variant, setVariant] = useState<'A' | 'B'>('A')
  const [wantsLeadMagnet, setWantsLeadMagnet] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    // A/B test: random variant
    setVariant(Math.random() > 0.5 ? 'A' : 'B')
    
    // Track page view
    trackEvent('page_view', { variant })
  }, [])

  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params)
    }
    console.log('📊 Event:', eventName, params)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Merci de renseigner une adresse valide')
      trackEvent('form_error', { type: 'invalid_email', variant })
      return
    }

    setIsLoading(true)
    trackEvent('form_submit_attempt', { variant, leadMagnet: wantsLeadMagnet })

    try {
      const response = await fetch('/api/landing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          variant,
          wantsLeadMagnet 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setIsSuccess(true)
      setEmail('')
      trackEvent('form_submit_success', { variant, leadMagnet: wantsLeadMagnet })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      trackEvent('form_error', { type: 'api_error', message: errorMessage, variant })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent > 50 && scrollPercent < 55) {
        trackEvent('scroll_50', { variant })
      }
      if (scrollPercent > 90) {
        trackEvent('scroll_90', { variant })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [variant])


  const content = {
      title: "ARCHITECH arrive.",
      titleAccent: "Vous êtes architecte ou porteur d’un projet immobilier au Maroc?",
      subtitle: "Rejoignez la première plateforme 100 % marocaine pensée pour la création et à la gestion intégrale de vos projets."
    }

  return (
    <div className="min-h-screen bg-white">
      
      {/* HERO / ABOVE THE FOLD */}
      <section className="relative flex items-center justify-center px-4 pt-16 pb-8 overflow-hidden" style={{ minHeight: '60vh' }}>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white to-stone-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-400/15 to-yellow-600/15 rounded-full blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
            <span className="bg-gradient-to-r from-zinc-900 via-stone-900 to-zinc-800 bg-clip-text text-transparent">
              {content.title}
            </span>
            <br/>
            <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">{content.titleAccent}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
          
          {/* Formulaire */}
          {isSuccess ? (
            <div className="max-w-md mx-auto py-8 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <p className="text-2xl font-semibold text-gray-900">
                  Merci, vous êtes inscrit !
                </p>
              </div>
              <p className="text-gray-600">
                Vous recevrez nos nouveautés dès qu'Architech sera prêt.
              </p>
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit} 
              className="max-w-md mx-auto mb-8"
              aria-label="Inscription newsletter"
            >
              <div className="flex flex-col gap-3 mb-4">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'email-error' : 'email-help'}
                  className="w-full h-14 px-6 text-lg bg-white border-2 border-gray-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 rounded-lg transition-all shadow-sm"
                  onFocus={() => trackEvent('email_input_focus', { variant })}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => trackEvent('cta_click', { variant, location: 'hero' })}
                  className="w-full h-14 px-8 text-lg font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-all focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Envoi en cours...' : 'Restez informé'}
                </Button>
              </div>

              {/* Lead Magnet */}
              <label className="flex items-center justify-center gap-2 mb-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={wantsLeadMagnet}
                  onChange={(e) => {
                    setWantsLeadMagnet(e.target.checked)
                    trackEvent('lead_magnet_toggle', { checked: e.target.checked, variant })
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                />
              </label>
              
              {error && (
                <div 
                  role="alert" 
                  aria-live="polite" 
                  className="text-sm text-red-600 mt-2"
                  id="email-error"
                >
                  {error}
                </div>
              )}
            </form>
          )}

          {/* Scroll indicator removed for compact view */}
        </div>
      </section>

      {/* PREUVES RAPIDES */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-base text-gray-600 mb-10 font-medium">
            Conçu pour les professionnels de l'immobilier
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16">
            <div className="text-amber-700 font-bold text-lg">ARCHITECTES</div>
            <div className="text-amber-700 font-bold text-lg">CHEFS DE PROJET</div>
            <div className="text-amber-700 font-bold text-lg">PROMOTEURS</div>
            <div className="text-amber-700 font-bold text-lg">BUREAUX D'ÉTUDES</div>
          </div>
        </div>
      </section>

      {/* FOOTER MINIMAL */}
      <footer className="bg-zinc-900 text-amber-50 border-t border-amber-900/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-stone-400">
          <p>© 2025 Architech. Données hébergées en UE. Conforme RGPD.</p>
        </div>
      </footer>

    </div>
  )
}
