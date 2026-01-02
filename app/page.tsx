import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Zap,
  Star,
  Play,
  Shield,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border-l-2 border-t-2 border-black/5"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] border-r-2 border-b-2 border-black/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="border-b-2 border-black/10 sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-black flex items-center justify-center">
                <span className="text-black font-black text-sm md:text-base">A</span>
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-black">
                ARCHITECH
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-black/60 hover:text-black transition-colors font-medium tracking-wide text-sm">
                Fonctionnalités
              </Link>
              <Link href="#testimonials" className="text-black/60 hover:text-black transition-colors font-medium tracking-wide text-sm">
                Témoignages
              </Link>
              <Link href="#pricing" className="text-black/60 hover:text-black transition-colors font-medium tracking-wide text-sm">
                Tarifs
              </Link>
            </nav>
            <Link href="/auth">
              <Button className="bg-black text-white hover:bg-black/90 rounded-lg border-2 border-black font-medium tracking-wide text-sm px-6 h-10">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 md:px-12 lg:px-16 py-16 md:py-24 text-center">
          <div className="mb-6 inline-block">
            <span className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-black/60 px-4 py-2 border-2 border-black/10">
              Nouveau : Timeline collaborative en temps réel
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tighter mb-6">
            <span className="block text-black">ARCHI</span>
            <span className="block text-black">TECH</span>
          </h1>
          
          <div className="w-20 md:w-32 h-1 bg-black mx-auto mb-8"></div>

          <p className="text-xl md:text-2xl lg:text-3xl text-black/70 mb-4 font-light">L'outil de gestion pensé pour les</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-black mb-8">
            architectes exigeants
          </p>

          <p className="text-base md:text-lg lg:text-xl text-black/60 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transformez votre gestion de projets architecturaux avec notre plateforme tout-en-un de documentation,
            collaboration, suivi et validation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-black/90 rounded-lg border-2 border-black text-base md:text-lg font-medium tracking-wide px-8 py-6 h-auto transition-all"
              >
                Créer un projet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="rounded-lg border-2 border-black/20 hover:bg-black hover:text-white hover:border-black text-base md:text-lg font-medium tracking-wide px-8 py-6 h-auto transition-all"
            >
              <Play className="mr-2 h-5 w-5" />
              Voir la démo
            </Button>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative bg-white border-2 border-black/10 overflow-hidden">
              <div className="bg-white px-6 py-4 border-b-2 border-black/10 flex items-center space-x-2">
                <div className="w-3 h-3 bg-black/20"></div>
                <div className="w-3 h-3 bg-black/20"></div>
                <div className="w-3 h-3 bg-black/20"></div>
                <div className="ml-4 text-sm text-black/60 font-medium">Architech Dashboard</div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
                  <div className="bg-white p-6 border-2 border-transparent hover:border-black/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wide">Timeline Projet</h3>
                      <div className="w-2 h-2 bg-black"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-black" />
                          <span className="text-sm font-medium text-black">Esquisse</span>
                        </div>
                        <span className="text-xs px-2 py-1 border-2 border-black/20 text-black font-medium">100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-black/60" />
                          <span className="text-sm font-medium text-black">APS</span>
                        </div>
                        <span className="text-xs px-2 py-1 border-2 border-black/20 text-black font-medium">65%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-4 w-4 border-2 border-black/20"></div>
                          <span className="text-sm text-black/60">APD</span>
                        </div>
                        <span className="text-xs px-2 py-1 border-2 border-black/20 text-black/60 font-medium">En attente</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 border-2 border-transparent hover:border-black/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wide">Documents</h3>
                      <span className="text-xs px-2 py-1 border-2 border-black/20 text-black font-medium">+3 nouveaux</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black">Plans.dwg</span>
                        <span className="text-xs px-2 py-1 bg-black text-white font-medium">Annoté</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black">Facade.pdf</span>
                        <span className="text-xs px-2 py-1 border-2 border-black/20 text-black font-medium">En cours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black">Structure.xlsx</span>
                        <span className="text-xs px-2 py-1 border-2 border-black/20 text-black font-medium">Validé</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 border-2 border-transparent hover:border-black/10 transition-all">
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wide">Équipe</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex -space-x-2 mb-3">
                        <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center text-xs font-black">
                          JD
                        </div>
                        <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center text-xs font-black">
                          ML
                        </div>
                        <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center text-xs font-black">
                          PL
                        </div>
                        <div className="w-8 h-8 border-2 border-black/20 bg-white text-black flex items-center justify-center text-xs font-black">
                          +5
                        </div>
                      </div>
                      <div className="text-xs text-black/50 font-light">8 collaborateurs actifs</div>
                      <div className="h-1 bg-black/10 w-full">
                        <div className="h-full bg-black" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-16 md:py-24 lg:py-32 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 text-black">
              Pourquoi choisir
              <br />
              Architech ?
            </h2>
            <div className="w-24 md:w-32 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-black/60 max-w-3xl mx-auto font-light">
              Découvrez comment notre plateforme révolutionne la gestion de projets architecturaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            <div className="bg-white p-8 md:p-12 border-2 border-transparent hover:border-black/10 transition-all group">
              <div className="w-16 h-16 border-2 border-black/10 flex items-center justify-center mb-6 group-hover:border-black group-hover:bg-black transition-all">
                <Zap className="h-8 w-8 text-black/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-4">Gain de temps</h3>
              <p className="text-black/60 text-base md:text-lg leading-relaxed mb-6 font-light">
                Automatisez vos workflows et réduisez les tâches répétitives de 60% grâce à notre IA intégrée
              </p>
              <div className="flex items-center space-x-2 text-sm text-black font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>+60% d'efficacité</span>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 border-2 border-transparent hover:border-black/10 transition-all group">
              <div className="w-16 h-16 border-2 border-black/10 flex items-center justify-center mb-6 group-hover:border-black group-hover:bg-black transition-all">
                <FileText className="h-8 w-8 text-black/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-4">Centralisation totale</h3>
              <p className="text-black/60 text-base md:text-lg leading-relaxed mb-6 font-light">
                Tous vos documents au même endroit avec versioning intelligent et annotations collaboratives
              </p>
              <div className="flex items-center space-x-2 text-sm text-black font-medium">
                <Shield className="w-4 h-4" />
                <span>100% sécurisé</span>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 border-2 border-transparent hover:border-black/10 transition-all group">
              <div className="w-16 h-16 border-2 border-black/10 flex items-center justify-center mb-6 group-hover:border-black group-hover:bg-black transition-all">
                <Users className="h-8 w-8 text-black/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-4">Collaboration fluide</h3>
              <p className="text-black/60 text-base md:text-lg leading-relaxed mb-6 font-light">
                Travaillez en temps réel avec vos équipes et intervenants, où qu'ils soient
              </p>
              <div className="flex items-center space-x-2 text-sm text-black font-medium">
                <Globe className="w-4 h-4" />
                <span>Temps réel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 lg:py-32 border-t border-black/10 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6">
              Comment ça marche
            </h2>
            <div className="w-24 md:w-32 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-light">
              Trois étapes simples pour révolutionner votre gestion de projets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 border-2 border-white/20 flex items-center justify-center text-white text-3xl md:text-4xl font-black mb-8 mx-auto hover:bg-white hover:text-black transition-all cursor-pointer">
                01
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Créez votre projet</h3>
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-light">
                Définissez les étapes de votre timeline personnalisée et invitez votre équipe en quelques clics
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 border-2 border-white/20 flex items-center justify-center text-white text-3xl md:text-4xl font-black mb-8 mx-auto hover:bg-white hover:text-black transition-all cursor-pointer">
                02
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Collaborez en temps réel</h3>
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-light">
                Partagez documents, annotations et suivez l'avancement avec une synchronisation instantanée
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 border-2 border-white/20 flex items-center justify-center text-white text-3xl md:text-4xl font-black mb-8 mx-auto hover:bg-white hover:text-black transition-all cursor-pointer">
                03
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Validez et livrez</h3>
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-light">
                Archivez automatiquement, générez vos livrables et célébrez la réussite de votre projet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24 lg:py-32 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 text-black">
              Ils nous font
              <br />
              confiance
            </h2>
            <div className="w-24 md:w-32 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-black/60 max-w-3xl mx-auto font-light">
              Plus de 500 agences d'architecture utilisent déjà Architech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
            <div className="bg-white p-8 md:p-10 border-2 border-transparent hover:border-black/10 transition-all">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-black text-black" />
                ))}
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 border-2 border-black bg-black text-white flex items-center justify-center font-black">
                  MA
                </div>
                <div>
                  <h4 className="text-lg font-black text-black">Agence Martin & Associés</h4>
                  <p className="text-sm text-black/50 font-light">Paris, France</p>
                </div>
              </div>
              <p className="text-black/70 text-base md:text-lg leading-relaxed mb-4 font-light">
                "Architech a révolutionné notre façon de gérer les projets. Le gain de temps est énorme sur la
                documentation et la collaboration."
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-black/60 font-medium">- Jean Martin, Architecte</p>
                <Award className="w-5 h-5 text-black/40" />
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 border-2 border-transparent hover:border-black/10 transition-all">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-black text-black" />
                ))}
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 border-2 border-black bg-black text-white flex items-center justify-center font-black">
                  BD
                </div>
                <div>
                  <h4 className="text-lg font-black text-black">Bureau d'études Dupont</h4>
                  <p className="text-sm text-black/50 font-light">Lyon, France</p>
                </div>
              </div>
              <p className="text-black/70 text-base md:text-lg leading-relaxed mb-4 font-light">
                "La timeline collaborative nous permet de mieux coordonner avec les architectes. Interface intuitive
                et puissante !"
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-black/60 font-medium">- Marie Dupont, Ingénieur</p>
                <Award className="w-5 h-5 text-black/40" />
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 border-2 border-transparent hover:border-black/10 transition-all">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-black text-black" />
                ))}
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 border-2 border-black bg-black text-white flex items-center justify-center font-black">
                  AM
                </div>
                <div>
                  <h4 className="text-lg font-black text-black">Atelier Architecture Moderne</h4>
                  <p className="text-sm text-black/50 font-light">Marseille, France</p>
                </div>
              </div>
              <p className="text-black/70 text-base md:text-lg leading-relaxed mb-4 font-light">
                "Les annotations en temps réel ont transformé notre collaboration avec les clients. Résultats
                spectaculaires !"
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-black/60 font-medium">- Paul Leroy, Architecte</p>
                <Award className="w-5 h-5 text-black/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-black text-white border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6">
            Prêt à transformer votre
            <br />
            gestion de projets ?
          </h2>
          <div className="w-24 md:w-32 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl mb-12 text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
            Rejoignez plus de 500 agences d'architecture qui utilisent Architech pour révolutionner leur workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-lg border-2 border-white text-base md:text-lg font-medium tracking-wide px-10 py-6 h-auto transition-all"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="rounded-lg border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-white text-base md:text-lg font-medium tracking-wide px-10 py-6 h-auto transition-all"
            >
              <Play className="mr-2 h-5 w-5" />
              Voir la démo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/10 pt-16">
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2">500+</div>
              <div className="text-sm text-white/60 font-light">Agences clientes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2">10k+</div>
              <div className="text-sm text-white/60 font-light">Projets gérés</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2">99.9%</div>
              <div className="text-sm text-white/60 font-light">Uptime</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2">24/7</div>
              <div className="text-sm text-white/60 font-light">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-12 md:py-16 px-4 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                  <span className="text-black font-black text-lg">A</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-black">ARCHITECH</span>
              </div>
              <p className="text-black/60 text-base leading-relaxed mb-6 max-w-md font-light">
                L'outil de gestion pensé pour les architectes exigeants. Transformez votre workflow dès aujourd'hui.
              </p>
              <div className="flex space-x-2">
                <div className="w-10 h-10 border-2 border-black/20 hover:border-black hover:bg-black hover:text-white flex items-center justify-center transition-all cursor-pointer">
                  <span className="text-sm font-black">f</span>
                </div>
                <div className="w-10 h-10 border-2 border-black/20 hover:border-black hover:bg-black hover:text-white flex items-center justify-center transition-all cursor-pointer">
                  <span className="text-sm font-black">t</span>
                </div>
                <div className="w-10 h-10 border-2 border-black/20 hover:border-black hover:bg-black hover:text-white flex items-center justify-center transition-all cursor-pointer">
                  <span className="text-xs font-black">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-black text-lg mb-6 text-black uppercase tracking-wide">Produit</h3>
              <ul className="space-y-3 text-black/60">
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Sécurité
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-black text-lg mb-6 text-black uppercase tracking-wide">Support</h3>
              <ul className="space-y-3 text-black/60">
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Formation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Communauté
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-black text-lg mb-6 text-black uppercase tracking-wide">Entreprise</h3>
              <ul className="space-y-3 text-black/60">
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Presse
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black transition-colors font-light">
                    Partenaires
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-black/50 font-light">&copy; 2025 Architech. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-black/50 hover:text-black transition-colors font-light">
                Mentions légales
              </Link>
              <Link href="#" className="text-black/50 hover:text-black transition-colors font-light">
                Confidentialité
              </Link>
              <Link href="#" className="text-black/50 hover:text-black transition-colors font-light">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
