"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Save, MessageSquare, Plus } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function AnnotatePage() {
  const params = useParams()
  const router = useRouter()
  const [annotations, setAnnotations] = useState([
    { id: 1, x: 45, y: 30, content: "Attention à la hauteur de la fenêtre du 2ème étage" },
    { id: 2, x: 60, y: 50, content: "Vérifier l'alignement avec le plan structure" },
    { id: 3, x: 30, y: 70, content: "Modification validée par le client" },
  ])
  const [newAnnotation, setNewAnnotation] = useState("")
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false)

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingAnnotation) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    if (newAnnotation.trim()) {
      const newId = Math.max(...annotations.map((a) => a.id)) + 1
      setAnnotations([
        ...annotations,
        {
          id: newId,
          x,
          y,
          content: newAnnotation,
        },
      ])
      setNewAnnotation("")
      setIsAddingAnnotation(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex items-center justify-between p-4 md:p-6 bg-white border-b-2 border-black/10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-lg md:text-xl font-black tracking-tighter text-black">Annoter - Plans Facade - v2.3.dwg</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={isAddingAnnotation ? "default" : "outline"}
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            className={isAddingAnnotation ? "bg-black text-white rounded-none border-2 border-black font-medium tracking-wide" : "rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all font-medium tracking-wide"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAddingAnnotation ? "Annuler" : "Ajouter annotation"}
          </Button>
          <Button disabled className="bg-black/50 text-white rounded-none border-2 border-black/20 font-medium tracking-wide">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Main canvas */}
        <div className="flex-1 p-4 md:p-6">
          <div
            className="relative bg-white border-2 border-black/10 h-full flex items-center justify-center cursor-crosshair"
            onClick={handleImageClick}
          >
            <img
              src="/placeholder.svg?height=600&width=800&text=DWG+Annotation+View"
              alt="Document for annotation"
              className="max-w-full max-h-full object-contain"
            />

            {/* Annotation markers */}
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute w-6 h-6 bg-black border-2 border-white flex items-center justify-center text-white text-xs font-black cursor-pointer hover:bg-black/80 transition-all"
                style={{
                  left: `${annotation.x}%`,
                  top: `${annotation.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                title={annotation.content}
              >
                {annotation.id}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-4 md:p-6 bg-white border-l-2 border-black/10">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-black/60" />
              <h2 className="text-lg md:text-xl font-black tracking-tighter text-black">Annotations</h2>
              <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium">
                {annotations.length}
              </span>
            </div>

            {isAddingAnnotation && (
              <div className="border-2 border-black p-4 bg-white">
                <p className="text-sm text-black mb-3 font-light">
                  Écrivez votre annotation puis cliquez sur l'image pour la placer
                </p>
                <Textarea
                  placeholder="Votre annotation..."
                  value={newAnnotation}
                  onChange={(e) => setNewAnnotation(e.target.value)}
                  className="mb-2 rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                />
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {annotations.map((annotation) => (
                <div key={annotation.id} className="border-2 border-black/10 p-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-black text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                      {annotation.id}
                    </div>
                    <p className="text-sm text-black/60 font-light">{annotation.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
