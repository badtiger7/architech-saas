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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{file.name}</h1>
              <p className="text-gray-600 mt-1">{file.description}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => router.push(`/drive/${file.id}/preview`)}>
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button variant="outline" onClick={() => router.push(`/drive/${file.id}/annotate`)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Annoter
            </Button>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Share className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Partager le fichier</DialogTitle>
                  <DialogDescription>Invitez des collaborateurs à accéder à ce fichier</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input id="fullName" placeholder="Nom et prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@exemple.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permissions">Permissions</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner les permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Lecture seule</SelectItem>
                        <SelectItem value="comment">Commentaires</SelectItem>
                        <SelectItem value="upload">Téléversement</SelectItem>
                        <SelectItem value="edit">Édition complète</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={() => setShareDialogOpen(false)}>Envoyer l'invitation</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Preview */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative">
                  <img
                    src={file.thumbnail || "/placeholder.svg"}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* Annotation markers */}
                  {annotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-red-600 transition-colors"
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
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <Badge variant={file.status === "En révision" ? "secondary" : "default"}>{file.status}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Annotations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Annotations ({annotations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {annotations.map((annotation) => (
                  <div key={annotation.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {annotation.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{annotation.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(annotation.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{annotation.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Commentaires ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{comment.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>Vous</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Ajouter un commentaire..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Commenter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* File Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Créé par</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{file.uploadedBy}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Créé le</p>
                  <p className="text-sm mt-1">{formatDate(file.uploadedAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dernière modification</p>
                  <p className="text-sm mt-1">{formatDate(file.lastModified)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Taille</p>
                  <p className="text-sm mt-1">{file.size}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contributeurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contributors.map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{contributor.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{contributor.name}</p>
                      <p className="text-xs text-gray-500">{contributor.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Viewers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Vues récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentViewers.map((viewer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{viewer.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{viewer.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(viewer.viewedAt)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
