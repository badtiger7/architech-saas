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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-lg font-medium">Annoter - Plans Facade - v2.3.dwg</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={isAddingAnnotation ? "default" : "outline"}
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAddingAnnotation ? "Annuler" : "Ajouter annotation"}
          </Button>
          <Button disabled>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Main canvas */}
        <div className="flex-1 p-4">
          <div
            className="relative bg-white rounded-lg shadow-lg h-full flex items-center justify-center cursor-crosshair"
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
                className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-red-600 transition-colors"
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
        <div className="w-80 p-4 bg-white border-l">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-lg font-medium">Annotations ({annotations.length})</h2>
            </div>

            {isAddingAnnotation && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-700 mb-2">
                    Écrivez votre annotation puis cliquez sur l'image pour la placer
                  </p>
                  <Textarea
                    placeholder="Votre annotation..."
                    value={newAnnotation}
                    onChange={(e) => setNewAnnotation(e.target.value)}
                    className="mb-2"
                  />
                </CardContent>
              </Card>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {annotations.map((annotation) => (
                <Card key={annotation.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {annotation.id}
                      </div>
                      <p className="text-sm text-gray-700">{annotation.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
