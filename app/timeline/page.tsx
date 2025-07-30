"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Calendar,
  FileText,
  Lock,
  Edit,
  Save,
  X,
  Share2,
  ExternalLink,
  Building2,
  ChevronDown,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function TimelinePage() {
  const router = useRouter()
  const [editingPhase, setEditingPhase] = useState<number | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState<number | null>(null)
  const [shareForm, setShareForm] = useState({
    fullName: "",
    email: "",
    permission: "read",
  })
  const [selectedProject, setSelectedProject] = useState("residence-jardins")

  const projects = [
    {
      id: "residence-jardins",
      name: "Résidence Les Jardins",
      status: "En cours",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "centre-commercial",
      name: "Centre Commercial Atlantis",
      status: "En révision",
      color: "bg-yellow-100 text-yellow-800",
    },
    { id: "bureaux-tech", name: "Bureaux Tech Park", status: "Terminé", color: "bg-blue-100 text-blue-800" },
    { id: "villa-moderne", name: "Villa Moderne", status: "En cours", color: "bg-green-100 text-green-800" },
  ]

  const [phases, setPhases] = useState([
    {
      id: 1,
      name: "Esquisse",
      status: "completed",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      progress: 100,
      documents: 5,
      validatedDocs: 5,
      locked: true,
    },
    {
      id: 2,
      name: "APS (Avant-Projet Sommaire)",
      status: "completed",
      startDate: "2024-02-16",
      endDate: "2024-03-20",
      progress: 100,
      documents: 8,
      validatedDocs: 8,
      locked: true,
    },
    {
      id: 3,
      name: "APD (Avant-Projet Détaillé)",
      status: "in-progress",
      startDate: "2024-03-21",
      endDate: "2024-04-25",
      progress: 65,
      documents: 12,
      validatedDocs: 8,
      locked: false,
    },
    {
      id: 4,
      name: "Permis de Construire",
      status: "pending",
      startDate: "2024-04-26",
      endDate: "2024-06-15",
      progress: 0,
      documents: 0,
      validatedDocs: 0,
      locked: true,
    },
    {
      id: 5,
      name: "EXE (Projet d'Exécution)",
      status: "pending",
      startDate: "2024-06-16",
      endDate: "2024-08-30",
      progress: 0,
      documents: 0,
      validatedDocs: 0,
      locked: true,
    },
  ])

  const currentProject = projects.find((p) => p.id === selectedProject)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "blocked":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bloquée</Badge>
      default:
        return <Badge variant="secondary">Non commencée</Badge>
    }
  }

  const validatePhase = (phaseId: number) => {
    setPhases(
      phases.map((phase) =>
        phase.id === phaseId
          ? { ...phase, status: "completed", progress: 100, validatedDocs: phase.documents }
          : phase.id === phaseId + 1
            ? { ...phase, locked: false }
            : phase,
      ),
    )
  }

  const savePhaseEdit = (phaseId: number, updates: any) => {
    setPhases(phases.map((phase) => (phase.id === phaseId ? { ...phase, ...updates } : phase)))
    setEditingPhase(null)
  }

  const handlePhaseClick = (phaseId: number) => {
    router.push(`/timeline/${phaseId}`)
  }

  const handleShare = (phaseId: number) => {
    console.log("Partage de l'étape:", phaseId, shareForm)
    setShareDialogOpen(null)
    setShareForm({ fullName: "", email: "", permission: "read" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Timeline Documentaire</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Suivi des phases du projet architectural</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une étape
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle étape</DialogTitle>
                    <DialogDescription>Créez une nouvelle phase dans votre timeline de projet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phaseName">Nom de la phase</Label>
                      <Input id="phaseName" placeholder="Ex: Études techniques" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <Button className="w-full">Ajouter la phase</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="w-full sm:w-auto">Charger un modèle</Button>
            </div>
          </div>

          {/* Project Selector */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Building2 className="h-4 w-4" />
                <span>Projet actuel :</span>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-80 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{currentProject?.name}</div>
                      <div className="text-xs text-gray-500">Timeline documentaire</div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </SelectTrigger>
                <SelectContent className="w-80">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="p-3">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{project.name}</div>
                          <div className="text-xs text-gray-500">Timeline documentaire</div>
                        </div>
                        <Badge className={`${project.color} text-xs flex-shrink-0`}>{project.status}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Timeline Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vue d'ensemble du projet</CardTitle>
            <CardDescription>Progression globale : 53% • 3/5 phases terminées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <Progress value={53} className="h-3" />
              </div>
              <span className="text-sm font-medium">53%</span>
            </div>

            {/* Timeline visualization */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="relative flex items-start">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(phase.status)} relative z-10`}></div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-gray-600">{phase.name}</h3>
                        <span className="text-xs text-gray-400">
                          {phase.startDate} → {phase.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phases Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {phases.map((phase) => (
            <Card
              key={phase.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                phase.status === "in-progress" ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handlePhaseClick(phase.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    {phase.name}
                    <ExternalLink className="h-4 w-4 ml-2 text-gray-400" />
                  </CardTitle>
                  {phase.locked && <Lock className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(phase.status)}
                  <div className="flex space-x-1">
                    <Dialog
                      open={shareDialogOpen === phase.id}
                      onOpenChange={(open) => setShareDialogOpen(open ? phase.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShareDialogOpen(phase.id)
                          }}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                          <DialogTitle>Partager l'étape "{phase.name}"</DialogTitle>
                          <DialogDescription>
                            Invitez des collaborateurs à accéder à cette étape du projet
                          </DialogDescription>
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
                            <Button onClick={() => handleShare(phase.id)} className="flex-1">
                              Partager
                            </Button>
                            <Button variant="outline" onClick={() => setShareDialogOpen(null)}>
                              Annuler
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {editingPhase === phase.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            savePhaseEdit(phase.id, {})
                          }}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingPhase(null)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingPhase(phase.id)
                        }}
                        disabled={phase.locked}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {editingPhase === phase.id ? (
                  <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <Label htmlFor={`start-${phase.id}`}>Date de début</Label>
                      <Input id={`start-${phase.id}`} type="date" defaultValue={phase.startDate} className="text-sm" />
                    </div>
                    <div>
                      <Label htmlFor={`end-${phase.id}`}>Date de fin</Label>
                      <Input id={`end-${phase.id}`} type="date" defaultValue={phase.endDate} className="text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Début</p>
                      <p className="font-medium">{new Date(phase.startDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fin</p>
                      <p className="font-medium">{new Date(phase.endDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progression</span>
                    <span className="text-sm font-medium">{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>
                      {phase.validatedDocs}/{phase.documents} validés
                    </span>
                  </div>
                  {phase.status === "in-progress" && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        validatePhase(phase.id)
                      }}
                      disabled={phase.validatedDocs < phase.documents}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valider
                    </Button>
                  )}
                </div>

                {phase.status === "in-progress" && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <Clock className="h-4 w-4" />
                      <span>Phase en cours</span>
                    </div>
                  </div>
                )}

                {phase.locked && phase.status === "pending" && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Lock className="h-4 w-4" />
                      <span>Verrouillée - Terminer la phase précédente</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Statistics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents totaux</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">21 validés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps restant</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127j</div>
              <p className="text-xs text-muted-foreground">Jusqu'à la livraison</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prochaine échéance</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3j</div>
              <p className="text-xs text-muted-foreground">Validation APD</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
