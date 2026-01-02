"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Download, Share, MessageSquare, Eye, FileText, Clock, Send, Edit3 } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function FileDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  // Mock file data
  const file = {
    id: params.fileId,
    name: "Plans Facade - v2.3.dwg",
    type: "dwg",
    size: "2.4 MB",
    uploadedBy: "Jean Dupont",
    uploadedAt: "2024-01-15T10:30:00",
    lastModified: "2024-01-20T14:30:00",
    annotations: 3,
    shared: true,
    status: "En révision",
    thumbnail: "/placeholder.svg?height=400&width=600&text=DWG+Preview",
    description: "Plans de façade pour la résidence Les Jardins - Version 2.3 avec corrections architecte",
  }

  const annotations = [
    {
      id: 1,
      author: "Marie Leroy",
      content: "Attention à la hauteur de la fenêtre du 2ème étage",
      createdAt: "2024-01-18T10:30:00",
      position: { x: 45, y: 30 },
    },
    {
      id: 2,
      author: "Paul Martin",
      content: "Vérifier l'alignement avec le plan structure",
      createdAt: "2024-01-19T15:20:00",
      position: { x: 60, y: 50 },
    },
    {
      id: 3,
      author: "Jean Dupont",
      content: "Modification validée par le client",
      createdAt: "2024-01-20T09:15:00",
      position: { x: 30, y: 70 },
    },
  ]

  const comments = [
    {
      id: 1,
      author: "Marie Leroy",
      content: "Les modifications sont conformes aux demandes du client. Prêt pour validation.",
      createdAt: "2024-01-20T11:30:00",
      avatar: "ML",
    },
    {
      id: 2,
      author: "Paul Martin",
      content: "J'ai vérifié la compatibilité avec les plans structure, tout est OK.",
      createdAt: "2024-01-20T14:15:00",
      avatar: "PM",
    },
  ]

  const recentViewers = [
    { name: "Marie Leroy", avatar: "ML", viewedAt: "2024-01-20T16:30:00" },
    { name: "Paul Martin", avatar: "PM", viewedAt: "2024-01-20T15:45:00" },
    { name: "Sophie Dubois", avatar: "SD", viewedAt: "2024-01-20T14:20:00" },
    { name: "Jean Dupont", avatar: "JD", viewedAt: "2024-01-20T13:10:00" },
  ]

  const contributors = [
    { name: "Jean Dupont", role: "Architecte", avatar: "JD" },
    { name: "Marie Leroy", role: "Ingénieur", avatar: "ML" },
    { name: "Paul Martin", role: "Dessinateur", avatar: "PM" },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment("")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border-l-2 border-t-2 border-black/5"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] border-r-2 border-b-2 border-black/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
      </div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 md:px-12 lg:px-16 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-12 space-y-4 sm:space-y-0 border-b-2 border-sand-200 pb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()} className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-black mb-2">{file.name}</h1>
              <p className="text-base md:text-lg text-black/60 font-light">{file.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => router.push(`/drive/${file.id}/preview`)} className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all font-medium tracking-wide">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button variant="outline" onClick={() => router.push(`/drive/${file.id}/annotate`)} className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all font-medium tracking-wide">
              <Edit3 className="h-4 w-4 mr-2" />
              Annoter
            </Button>
            <Button variant="outline" disabled className="rounded-lg border-2 border-sand-200 font-medium tracking-wide">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500 font-medium tracking-wide">
                  <Share className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-lg border-2 border-sand-200">
                <DialogHeader>
                  <DialogTitle className="font-black tracking-tighter text-black">Partager le fichier</DialogTitle>
                  <div className="w-12 h-0.5 bg-sand-500 mb-3"></div>
                  <DialogDescription className="text-sand-600 font-light">Invitez des collaborateurs à accéder à ce fichier</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Nom complet</Label>
                    <Input id="fullName" placeholder="Nom et prénom" className="rounded-lg border-2 border-sand-200 focus:border-sand-500 transition-all bg-white text-black font-light text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Email</Label>
                    <Input id="email" type="email" placeholder="email@exemple.com" className="rounded-lg border-2 border-sand-200 focus:border-sand-500 transition-all bg-white text-black font-light text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permissions" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Permissions</Label>
                    <Select>
                      <SelectTrigger className="rounded-lg border-2 border-sand-200 focus:border-sand-500">
                        <SelectValue placeholder="Sélectionner les permissions" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-2 border-sand-200">
                        <SelectItem value="read" className="rounded-lg hover:bg-sand-500 hover:text-white">Lecture seule</SelectItem>
                        <SelectItem value="comment" className="rounded-lg hover:bg-sand-500 hover:text-white">Commentaires</SelectItem>
                        <SelectItem value="upload" className="rounded-lg hover:bg-sand-500 hover:text-white">Téléversement</SelectItem>
                        <SelectItem value="edit" className="rounded-lg hover:bg-sand-500 hover:text-white">Édition complète</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4 border-t border-sand-200">
                    <Button variant="outline" onClick={() => setShareDialogOpen(false)} className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all">
                      Annuler
                    </Button>
                    <Button onClick={() => setShareDialogOpen(false)} className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500 font-medium tracking-wide">
                      Envoyer l'invitation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-sand-200">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white p-5 md:p-6 space-y-6">
            {/* File Preview */}
            <div className="border-2 border-sand-200 p-5 rounded-xl">
              <div className="aspect-video bg-sand-50 border-2 border-sand-200 flex items-center justify-center mb-4 relative rounded-lg overflow-hidden">
                <img
                  src={file.thumbnail || "/placeholder.svg"}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                {/* Annotation markers */}
                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="absolute w-6 h-6 bg-sand-500 border-2 border-white flex items-center justify-center text-white text-xs font-black cursor-pointer hover:bg-sand-600 transition-all rounded-full"
                    style={{
                      left: `${annotation.position.x}%`,
                      top: `${annotation.position.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title={annotation.content}
                  >
                    {annotation.id}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5 text-sand-400" />
                  <div>
                    <p className="font-medium text-black">{file.name}</p>
                    <p className="text-sm text-sand-600 font-light">{file.size}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 border border-sand-200 bg-sand-50 text-sand-700 text-xs font-medium uppercase tracking-wide rounded-md">
                  {file.status}
                </span>
              </div>
            </div>

            {/* Annotations */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-lg md:text-xl font-black tracking-tighter text-black mr-2">Annotations</h2>
                <span className="px-2.5 py-1 border border-sand-200 bg-sand-50 text-sand-700 text-xs font-medium rounded-md">
                  {annotations.length}
                </span>
                <div className="flex-1 w-12 md:w-16 h-0.5 bg-sand-500 ml-4"></div>
              </div>
              <div className="space-y-3">
                {annotations.map((annotation) => (
                  <div key={annotation.id} className="flex space-x-3 p-3 border border-sand-200 rounded-lg hover:border-sand-300 transition-all">
                    <div className="w-6 h-6 bg-sand-500 text-white flex items-center justify-center text-xs font-black flex-shrink-0 rounded-full">
                      {annotation.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-black">{annotation.author}</span>
                        <span className="text-xs text-sand-600 font-light">{formatDate(annotation.createdAt)}</span>
                      </div>
                      <p className="text-sm text-black/60 font-light">{annotation.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-lg md:text-xl font-black tracking-tighter text-black mr-2">Commentaires</h2>
                <span className="px-2.5 py-1 border border-sand-200 bg-sand-50 text-sand-700 text-xs font-medium rounded-md">
                  {comments.length}
                </span>
                <div className="flex-1 w-12 md:w-16 h-0.5 bg-sand-500 ml-4"></div>
              </div>
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8 border border-sand-200 rounded-full">
                      <AvatarFallback className="bg-sand-500 text-white rounded-full font-black text-xs">
                        {comment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-black">{comment.author}</span>
                        <span className="text-xs text-sand-600 font-light">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-black/60 font-light">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-sand-200 mb-4" />

              <div className="flex space-x-3">
                <Avatar className="w-8 h-8 border border-sand-200 rounded-full">
                  <AvatarFallback className="bg-sand-500 text-white rounded-full font-black text-xs">Vous</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] rounded-lg border-2 border-sand-200 focus:border-sand-500 transition-all bg-white text-black font-light text-sm"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()} className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500 font-medium tracking-wide disabled:opacity-50">
                      <Send className="h-4 w-4 mr-2" />
                      Commenter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white p-5 md:p-6 space-y-6">
            {/* File Info */}
            <div>
              <h3 className="text-base md:text-lg font-black tracking-tighter text-black mb-2">Informations</h3>
              <div className="w-12 h-0.5 bg-sand-500 mb-4"></div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-black/60 font-light uppercase tracking-wide mb-1">Créé par</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="w-6 h-6 border border-sand-200 rounded-full">
                      <AvatarFallback className="bg-sand-500 text-white rounded-full font-black text-xs">JD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-black font-light">{file.uploadedBy}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-black/60 font-light uppercase tracking-wide mb-1">Créé le</p>
                  <p className="text-sm text-black font-light mt-1">{formatDate(file.uploadedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-black/60 font-light uppercase tracking-wide mb-1">Dernière modification</p>
                  <p className="text-sm text-black font-light mt-1">{formatDate(file.lastModified)}</p>
                </div>
                <div>
                  <p className="text-xs text-black/60 font-light uppercase tracking-wide mb-1">Taille</p>
                  <p className="text-sm text-black font-light mt-1">{file.size}</p>
                </div>
              </div>
            </div>

            {/* Contributors */}
            <div>
              <h3 className="text-base md:text-lg font-black tracking-tighter text-black mb-2">Contributeurs</h3>
              <div className="w-12 h-0.5 bg-sand-500 mb-4"></div>
              <div className="space-y-3">
                {contributors.map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8 border border-sand-200 rounded-full">
                      <AvatarFallback className="bg-sand-500 text-white rounded-full font-black text-xs">{contributor.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-black">{contributor.name}</p>
                      <p className="text-xs text-sand-600 font-light">{contributor.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Viewers */}
            <div>
              <h3 className="text-base md:text-lg font-black tracking-tighter text-black mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Vues récentes
              </h3>
              <div className="w-12 h-0.5 bg-sand-500 mb-4"></div>
              <div className="space-y-3">
                {recentViewers.map((viewer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6 border border-sand-200 rounded-full">
                        <AvatarFallback className="text-xs bg-sand-500 text-white rounded-full font-black">{viewer.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-black font-light">{viewer.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-sand-600 font-light">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(viewer.viewedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
