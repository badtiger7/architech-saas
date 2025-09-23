"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
  Share2,
  Eye,
  Download,
  MessageSquare,
  Edit,
  Save,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { getStatusClasses } from "@/lib/utils"

export default function PhaseDetailPage({ params }: { params: { phaseId: string } }) {
  const router = useRouter()
  const phaseId = Number.parseInt(params.phaseId)
  const [isEditing, setIsEditing] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "",
    description: "",
  })
  const [shareForm, setShareForm] = useState({
    fullName: "",
    email: "",
    permission: "read",
  })

  // Données simulées pour la phase
  const phase = {
    id: phaseId,
    name:
      phaseId === 1
        ? "Esquisse"
        : phaseId === 2
          ? "APS (Avant-Projet Sommaire)"
          : phaseId === 3
            ? "APD (Avant-Projet Détaillé)"
            : phaseId === 4
              ? "Permis de Construire"
              : "EXE (Projet d'Exécution)",
    status: phaseId <= 2 ? "completed" : phaseId === 3 ? "in-progress" : "pending",
    startDate: "2024-03-21",
    endDate: "2024-04-25",
    progress: phaseId <= 2 ? 100 : phaseId === 3 ? 65 : 0,
    description:
      "Développement détaillé des solutions architecturales et techniques avec définition précise des matériaux, systèmes constructifs et équipements techniques.",
    validatedDocs: phaseId <= 2 ? 8 : phaseId === 3 ? 8 : 0,
    totalDocs: phaseId <= 2 ? 8 : phaseId === 3 ? 12 : 15,
    contributors: [
      { name: "Marie Dubois", role: "Architecte", avatar: "/placeholder-user.jpg" },
      { name: "Jean Martin", role: "Ingénieur", avatar: "/placeholder-user.jpg" },
      { name: "Sophie Laurent", role: "Designer", avatar: "/placeholder-user.jpg" },
      { name: "Pierre Moreau", role: "Consultant", avatar: "/placeholder-user.jpg" },
    ],
  }

  const documents = [
    {
      id: 1,
      name: "Plan masse APD.dwg",
      type: "Plan architectural",
      status: "validated",
      size: "2.4 MB",
      lastModified: "2024-03-20",
      validator: "Marie Dubois",
      comments: 3,
      views: 12,
    },
    {
      id: 2,
      name: "Façades principales.pdf",
      type: "Façade",
      status: "validated",
      size: "1.8 MB",
      lastModified: "2024-03-19",
      validator: "Jean Martin",
      comments: 1,
      views: 8,
    },
    {
      id: 3,
      name: "Coupes techniques.dwg",
      type: "Coupe",
      status: "in-review",
      size: "3.2 MB",
      lastModified: "2024-03-21",
      validator: null,
      comments: 5,
      views: 15,
    },
    {
      id: 4,
      name: "Détails constructifs.pdf",
      type: "Détail technique",
      status: "pending",
      size: "4.1 MB",
      lastModified: "2024-03-18",
      validator: null,
      comments: 0,
      views: 3,
    },
  ]

  const getStatusColor = (status: string) => {
    const classes = getStatusClasses(status as any)
    return classes.badge
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "in-review":
        return <Clock className="h-4 w-4 text-warning" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-danger" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "validated":
        return "Validé"
      case "in-review":
        return "En révision"
      case "pending":
        return "En attente"
      case "rejected":
        return "Rejeté"
      default:
        return "En attente"
    }
  }

  const handleDocumentClick = (docId: number) => {
    router.push(`/drive/${docId}`)
  }

  const handleUpload = () => {
    console.log("Téléversement:", uploadForm)
    setUploadDialogOpen(false)
    setUploadForm({ name: "", type: "", description: "" })
  }

  const handleShare = () => {
    console.log("Partage de l'étape:", shareForm)
    setShareDialogOpen(false)
    setShareForm({ fullName: "", email: "", permission: "read" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()} className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{phase.name}</h1>
              <p className="text-gray-600 mt-1">Résidence Les Jardins</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Téléverser un document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Téléverser un document</DialogTitle>
                  <DialogDescription>Ajoutez un nouveau document à cette étape du projet</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="docName">Nom du document</Label>
                    <Input
                      id="docName"
                      placeholder="Ex: Plan de façade"
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="docType">Type de document</Label>
                    <Select
                      value={uploadForm.type}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plan">Plan architectural</SelectItem>
                        <SelectItem value="coupe">Coupe</SelectItem>
                        <SelectItem value="facade">Façade</SelectItem>
                        <SelectItem value="detail">Détail technique</SelectItem>
                        <SelectItem value="rapport">Rapport</SelectItem>
                        <SelectItem value="calcul">Note de calcul</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="docDescription">Description (optionnel)</Label>
                    <Textarea
                      id="docDescription"
                      placeholder="Description du document..."
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    />
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Glissez-déposez votre fichier ici ou cliquez pour parcourir</p>
                    <p className="text-xs text-gray-400 mt-1">Formats supportés: PDF, DWG, JPG, PNG (max 10MB)</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleUpload} className="flex-1">
                      Téléverser
                    </Button>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager cette étape
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Partager l'étape "{phase.name}"</DialogTitle>
                  <DialogDescription>Invitez des collaborateurs à accéder à cette étape du projet</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      placeholder="Ex: Jean Dupont"
                      value={shareForm.fullName}
                      onChange={(e) => setShareForm({ ...shareForm, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean.dupont@example.com"
                      value={shareForm.email}
                      onChange={(e) => setShareForm({ ...shareForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="permission">Permissions</Label>
                    <Select
                      value={shareForm.permission}
                      onValueChange={(value) => setShareForm({ ...shareForm, permission: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Lecture seule</SelectItem>
                        <SelectItem value="comment">Commentaires</SelectItem>
                        <SelectItem value="edit">Modification</SelectItem>
                        <SelectItem value="admin">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleShare} className="flex-1">
                      Partager
                    </Button>
                    <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Phase Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informations générales</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-transparent"
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Sauvegarder" : "Modifier"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" defaultValue={phase.description} className="min-h-[100px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input id="startDate" type="date" defaultValue={phase.startDate} />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input id="endDate" type="date" defaultValue={phase.endDate} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700">{phase.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Date de début</p>
                          <p className="font-medium">{new Date(phase.startDate).toLocaleDateString("fr-FR")}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Date de fin</p>
                          <p className="font-medium">{new Date(phase.endDate).toLocaleDateString("fr-FR")}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Documents ({documents.length})</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadDialogOpen(true)}
                    className="bg-transparent"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleDocumentClick(doc.id)}
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                            <span>Modifié le {new Date(doc.lastModified).toLocaleDateString("fr-FR")}</span>
                          </div>
                          {doc.validator && <p className="text-xs text-green-600 mt-1">Validé par {doc.validator}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span>{doc.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>{doc.views}</span>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(doc.status)}
                            <span>{getStatusText(doc.status)}</span>
                          </div>
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/drive/${doc.id}/preview`)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" disabled>
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progression</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Avancement global</span>
                    <span className="text-sm font-medium">{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Documents validés</p>
                    <p className="text-xl font-bold text-green-600">{phase.validatedDocs}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total documents</p>
                    <p className="text-xl font-bold">{phase.totalDocs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contributeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phase.contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{contributor.name}</p>
                        <p className="text-xs text-gray-500">{contributor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier une réunion
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  Générer un rapport
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Clock className="h-4 w-4 mr-2" />
                  Modifier les échéances
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
