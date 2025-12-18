'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CheckCircle2, 
  ArrowRight,
  Building2,
  Ruler,
  FileText,
  Users
} from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [variant, setVariant] = useState<'A' | 'B'>('A')
  const [wantsLeadMagnet, setWantsLeadMagnet] = useState(false)

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

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Nike Style Minimal */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] border-l-2 border-t-2 border-black/5"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] border-r-2 border-b-2 border-black/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-12 lg:px-16 w-full">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center">
            
            {/* Left Column - Typography */}
            <div className="space-y-6 md:space-y-8 lg:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-block">
                  <span className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-black/60">Maroc</span>
                </div>
                
                <h1 className="text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tighter">
                  <span className="block text-black">ARCHI</span>
                  <span className="block text-black">TECH</span>
                </h1>
                
                <div className="w-16 md:w-24 h-1 bg-black"></div>
              </div>

              <p className="text-base md:text-2xl lg:text-3xl font-light text-black/70 leading-relaxed max-w-xl">
                La plateforme 100% marocaine qui transforme la gestion de vos projets immobiliers.
              </p>

              <p className="text-base md:text-lg text-black/50 font-light max-w-lg leading-relaxed">
                Conçue pour les architectes et promoteurs qui exigent précision, efficacité et excellence.
              </p>
            </div>

            {/* Right Column - Form */}
            <div className="lg:pl-8 mt-8 lg:mt-0">
              {isSuccess ? (
                <div className="bg-black text-white p-6 md:p-12 space-y-4 md:space-y-6">
                  <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12" />
                  <h2 className="text-2xl md:text-3xl font-bold">Merci.</h2>
                  <p className="text-white/80 text-base md:text-lg">
                    Vous recevrez nos nouveautés dès qu'Architech sera prêt.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-4 md:space-y-6"
                  aria-label="Inscription newsletter"
                >
                  <div className="space-y-4">
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email professionnel"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      aria-required="true"
                      aria-invalid={!!error}
                      aria-describedby={error ? 'email-error' : 'email-help'}
                      className="w-full h-12 md:h-16 px-4 md:px-6 text-sm md:text-lg bg-white border-2 border-black/10 focus:border-black transition-all rounded-none font-light tracking-wide placeholder:text-black/30"
                      onFocus={() => trackEvent('email_input_focus', { variant })}
                    />
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      onClick={() => trackEvent('cta_click', { variant, location: 'hero' })}
                      className="w-full h-12 md:h-16 bg-black text-white hover:bg-black/90 rounded-none text-sm md:text-lg font-medium tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                      {isLoading ? (
                        'Envoi en cours...'
                      ) : (
                        <>
                          Rejoindre la liste d'attente
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <div 
                      role="alert" 
                      aria-live="polite" 
                      className="text-sm text-red-600 font-medium"
                      id="email-error"
                    >
                      {error}
                    </div>
                  )}

                  <label className="flex items-start gap-2 md:gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={wantsLeadMagnet}
                      onChange={(e) => {
                        setWantsLeadMagnet(e.target.checked)
                        trackEvent('lead_magnet_toggle', { checked: e.target.checked, variant })
                      }}
                      className="mt-1 w-4 h-4 rounded-none border-2 border-black/20 text-black focus:ring-0 focus:ring-offset-0 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-xs md:text-sm text-black/60 font-light leading-relaxed">
                      Je souhaite recevoir des ressources exclusives pour architectes et promoteurs
                    </span>
                  </label>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE - Minimal Grid */}
      <section className="py-12 md:py-24 lg:py-32 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
            {[
              { icon: Building2, label: 'Architectes', description: 'Conception & Design' },
              { icon: Ruler, label: 'Chefs de Projet', description: 'Gestion & Coordination' },
              { icon: FileText, label: 'Promoteurs', description: 'Développement Immobilier' },
              { icon: Users, label: 'Bureaux d\'Études', description: 'Ingénierie & Expertise' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white p-6 md:p-8 lg:p-12 space-y-3 md:space-y-4 group hover:bg-black transition-colors duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 border-black/10 group-hover:border-white transition-colors">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-black/60 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black group-hover:text-white transition-colors mb-1">
                    {item.label}
                  </h3>
                  <p className="text-xs md:text-sm text-black/50 group-hover:text-white/70 transition-colors font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION - Sharp Typography */}
      <section className="py-12 md:py-24 lg:py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
          <div className="space-y-8 md:space-y-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-6 md:mb-8">
                Précision.
                <br />
                Performance.
                <br />
                Excellence.
              </h2>
              <div className="w-32 h-1 bg-white"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
              <div className="space-y-3 md:space-y-4">
                <div className="text-3xl md:text-5xl font-black text-white/20">01</div>
                <h3 className="text-xl md:text-2xl font-bold">Gestion Intégrale</h3>
                <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                  Tous vos projets en un seul endroit. De la conception à la livraison.
                </p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="text-3xl md:text-5xl font-black text-white/20">02</div>
                <h3 className="text-xl md:text-2xl font-bold">Collaboration Fluide</h3>
                <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                  Travaillez avec votre équipe et vos partenaires en temps réel.
                </p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="text-3xl md:text-5xl font-black text-white/20">03</div>
                <h3 className="text-xl md:text-2xl font-bold">100% Marocain</h3>
                <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                  Conçu pour le marché marocain, conforme aux normes locales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - Ultra Minimal */}
      <footer className="border-t border-black/10 py-8 md:py-12 px-4 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="text-xl md:text-2xl font-black tracking-tight">ARCHITECH</div>
              <p className="text-xs md:text-sm text-black/50 font-light">
                © 2025 Architech. Données hébergées en UE. Conforme RGPD.
              </p>
            </div>
            <div className="text-xs md:text-sm text-black/40 font-light tracking-wide uppercase">
              Made for Morocco
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
