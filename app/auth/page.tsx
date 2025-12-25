"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Building2, Mail, Lock, Rocket } from "lucide-react"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    router.push("/dashboard")
  }

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)

    // Simulate demo login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsDemoLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border-l-2 border-t-2 border-black/5"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] border-r-2 border-b-2 border-black/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
      </div>

      <Card className="w-full max-w-md border-2 border-black/10 bg-white relative z-10 rounded-none">
        <CardHeader className="space-y-6 text-center p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 border-2 border-black flex items-center justify-center">
              <Building2 className="h-8 w-8 text-black" />
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-black tracking-tighter text-black">ARCHITECH</CardTitle>
          <div className="w-16 h-1 bg-black mx-auto"></div>
          <CardDescription className="text-black/60 font-light">Connectez-vous à votre espace de gestion de projets architecturaux</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black uppercase tracking-wide">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 h-4 w-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="pl-10 rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-black uppercase tracking-wide">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 h-4 w-4" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light" 
                  required 
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-black/90 rounded-none border-2 border-black font-medium tracking-wide h-12 transition-all" 
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-black/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-black/60 font-medium tracking-wide">Ou</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all font-medium tracking-wide h-12"
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
          >
            <Rocket className="mr-2 h-4 w-4" />
            {isDemoLoading ? "Connexion démo..." : "Accès démo"}
          </Button>

          <div className="text-center text-sm text-black/60 font-light">
            <p>
              Mot de passe oublié ?{" "}
              <a href="#" className="text-black hover:underline font-medium">
                Réinitialiser
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
