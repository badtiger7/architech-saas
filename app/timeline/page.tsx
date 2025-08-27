"use client"

import { useState, useRef } from "react"
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
  Camera,
  Edit3,
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

  // Project thumbnail state and functionality
  const [projectThumbnails, setProjectThumbnails] = useState<{[key: string]: string}>({
    "residence-jardins": "/placeholder.jpg",
    "centre-commercial": "/placeholder.jpg", 
    "bureaux-tech": "/placeholder.jpg",
    "villa-moderne": "/placeholder.jpg"
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Function to handle thumbnail upload
  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedProject) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProjectThumbnails(prev => ({
          ...prev,
          [selectedProject]: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

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
        return "bg-green-600"
      case "in-progress":
        return "bg-yellow-600"
      case "blocked":
        return "bg-red-600"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 text-white hover:bg-green-700">Terminée</Badge>
      case "in-progress":
        return <Badge className="text-white hover:opacity-90" style={{ backgroundColor: '#D4AF37' }}>En cours</Badge>
      case "blocked":
        return <Badge className="bg-red-600 text-white hover:bg-red-700">Bloquée</Badge>
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Non commencée</Badge>
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
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#8B4513' }}>Timeline Documentaire</h1>
              <p className="mt-1 text-sm sm:text-base" style={{ color: '#A0522D' }}>Suivi des phases du projet architectural</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto border-2 hover:shadow-md transition-all"
                    style={{ 
                      borderColor: '#D4AF37', 
                      color: '#8B4513',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une étape
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle style={{ color: '#8B4513' }}>Ajouter une nouvelle étape</DialogTitle>
                    <DialogDescription style={{ color: '#A0522D' }}>Créez une nouvelle phase dans votre timeline de projet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phaseName" style={{ color: '#8B4513' }}>Nom de la phase</Label>
                      <Input 
                        id="phaseName" 
                        placeholder="Ex: Études techniques" 
                        className="border-2 focus:border-opacity-80"
                        style={{ borderColor: '#D4AF37' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate" style={{ color: '#8B4513' }}>Date de début</Label>
                        <Input 
                          id="startDate" 
                          type="date" 
                          className="border-2 focus:border-opacity-80"
                          style={{ borderColor: '#D4AF37' }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate" style={{ color: '#8B4513' }}>Date de fin</Label>
                        <Input 
                          id="endDate" 
                          type="date" 
                          className="border-2 focus:border-opacity-80"
                          style={{ borderColor: '#D4AF37' }}
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#D4AF37' }}
                    >
                      Ajouter la phase
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                className="w-full sm:w-auto text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#D4AF37' }}
              >
                Charger un modèle
              </Button>
            </div>
          </div>

          {/* Project Selector */}
          <div className="bg-white rounded-lg shadow-sm border-2 p-4" style={{ borderColor: '#D4AF37' }}>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#8B4513' }}>
                <Building2 className="h-4 w-4" />
                <span>Projet actuel :</span>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger 
                  className="w-full sm:w-80 border-2 hover:shadow-sm transition-all"
                  style={{ 
                    backgroundColor: '#FFF8DC', 
                    borderColor: '#D4AF37' 
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                    <div className="flex-1 text-left">
                      <div className="font-medium" style={{ color: '#8B4513' }}>{currentProject?.name}</div>
                      <div className="text-xs" style={{ color: '#A0522D' }}>Timeline documentaire</div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" style={{ color: '#A0522D' }} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2" style={{ borderColor: '#D4AF37' }}>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="p-3 hover:bg-opacity-50" style={{ backgroundColor: 'transparent' }}>
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#D4AF37' }}></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate" style={{ color: '#8B4513' }}>{project.name}</div>
                          <div className="text-xs" style={{ color: '#A0522D' }}>Timeline documentaire</div>
                        </div>
                        <Badge 
                          className="text-xs flex-shrink-0 text-white"
                          style={{ backgroundColor: '#D4AF37' }}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Timeline Overview */}
        <Card className="mb-8 bg-white shadow-sm border-2" style={{ borderColor: '#D4AF37' }}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleThumbnailChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              {/* Project Thumbnail */}
              <div className="relative group">
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center" style={{ backgroundColor: '#FFF8DC', borderColor: '#D4AF37' }}>
                  {projectThumbnails[selectedProject] ? (
                    <img 
                      src={projectThumbnails[selectedProject]} 
                      alt={`Miniature ${currentProject?.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6" style={{ color: '#D4AF37' }} />
                  )}
                  
                  {/* Edit overlay on hover */}
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    <Edit3 className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Edit button always visible on mobile */}
                <button
                  onClick={triggerFileInput}
                  className="absolute -bottom-1 -right-1 text-white rounded-full p-1 shadow-lg md:hidden"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
              
              <div>
                <CardTitle style={{ color: '#8B4513' }}>Vue d'ensemble du projet</CardTitle>
                <CardDescription style={{ color: '#A0522D' }}>Progression globale : 53% • 3/5 phases terminées</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <Progress value={53} className="h-3" />
              </div>
              <span className="text-sm font-medium" style={{ color: '#8B4513' }}>53%</span>
            </div>

            {/* Timeline visualization */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#D4AF37' }}></div>
              <div className="space-y-6">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="relative flex items-start">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(phase.status)} relative z-10`}></div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm" style={{ color: '#8B4513' }}>{phase.name}</h3>
                        <span className="text-xs" style={{ color: '#A0522D' }}>
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
              className={`relative cursor-pointer transition-all hover:shadow-lg bg-white border-2 ${
                phase.status === "in-progress" ? "ring-2" : ""
              }`}
              style={{ 
                borderColor: '#D4AF37',
                ...(phase.status === "in-progress" ? { 
                  '--tw-ring-color': '#D4AF37',
                  '--tw-ring-opacity': '0.5' 
                } : {})
              }}
              onClick={() => handlePhaseClick(phase.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center" style={{ color: '#8B4513' }}>
                    {phase.name}
                    <ExternalLink className="h-4 w-4 ml-2" style={{ color: '#A0522D' }} />
                  </CardTitle>
                  {phase.locked && <Lock className="h-4 w-4" style={{ color: '#A0522D' }} />}
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
                          className="border-2 hover:shadow-sm"
                          style={{ 
                            borderColor: '#D4AF37',
                            color: '#8B4513',
                            backgroundColor: '#FFFFFF'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setShareDialogOpen(phase.id)
                          }}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-white" onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                          <DialogTitle style={{ color: '#8B4513' }}>Partager l'étape "{phase.name}"</DialogTitle>
                          <DialogDescription style={{ color: '#A0522D' }}>
                            Invitez des collaborateurs à accéder à cette étape du projet
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="fullName" style={{ color: '#8B4513' }}>Nom complet</Label>
                            <Input
                              id="fullName"
                              placeholder="Ex: Jean Dupont"
                              value={shareForm.fullName}
                              onChange={(e) => setShareForm({ ...shareForm, fullName: e.target.value })}
                              className="border-2"
                              style={{ borderColor: '#D4AF37' }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" style={{ color: '#8B4513' }}>Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="jean.dupont@example.com"
                              value={shareForm.email}
                              onChange={(e) => setShareForm({ ...shareForm, email: e.target.value })}
                              className="border-2"
                              style={{ borderColor: '#D4AF37' }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="permission" style={{ color: '#8B4513' }}>Permissions</Label>
                            <Select
                              value={shareForm.permission}
                              onValueChange={(value) => setShareForm({ ...shareForm, permission: value })}
                            >
                              <SelectTrigger className="border-2" style={{ borderColor: '#D4AF37' }}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="read">Lecture seule</SelectItem>
                                <SelectItem value="comment">Commentaires</SelectItem>
                                <SelectItem value="edit">Modification</SelectItem>
                                <SelectItem value="admin">Administration</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleShare(phase.id)} 
                              className="flex-1 text-white hover:opacity-90"
                              style={{ backgroundColor: '#D4AF37' }}
                            >
                              Partager
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShareDialogOpen(null)}
                              className="border-2"
                              style={{ 
                                borderColor: '#D4AF37',
                                color: '#8B4513'
                              }}
                            >
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
                          className="border-2 hover:shadow-sm"
                          style={{ 
                            borderColor: '#D4AF37',
                            color: '#8B4513',
                            backgroundColor: '#FFFFFF'
                          }}
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
                          className="border-2 hover:shadow-sm"
                          style={{ 
                            borderColor: '#D4AF37',
                            color: '#8B4513',
                            backgroundColor: '#FFFFFF'
                          }}
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
                        className="border-2 hover:shadow-sm"
                        style={{ 
                          borderColor: '#D4AF37',
                          color: '#8B4513',
                          backgroundColor: '#FFFFFF'
                        }}
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
                      <Label htmlFor={`start-${phase.id}`} style={{ color: '#8B4513' }}>Date de début</Label>
                      <Input 
                        id={`start-${phase.id}`} 
                        type="date" 
                        defaultValue={phase.startDate} 
                        className="text-sm border-2" 
                        style={{ borderColor: '#D4AF37' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`end-${phase.id}`} style={{ color: '#8B4513' }}>Date de fin</Label>
                      <Input 
                        id={`end-${phase.id}`} 
                        type="date" 
                        defaultValue={phase.endDate} 
                        className="text-sm border-2" 
                        style={{ borderColor: '#D4AF37' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p style={{ color: '#A0522D' }}>Début</p>
                      <p className="font-medium" style={{ color: '#8B4513' }}>{new Date(phase.startDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <p style={{ color: '#A0522D' }}>Fin</p>
                      <p className="font-medium" style={{ color: '#8B4513' }}>{new Date(phase.endDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: '#A0522D' }}>Progression</span>
                    <span className="text-sm font-medium" style={{ color: '#8B4513' }}>{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" style={{ color: '#A0522D' }} />
                    <span style={{ color: '#8B4513' }}>
                      {phase.validatedDocs}/{phase.documents} validés
                    </span>
                  </div>
                  {phase.status === "in-progress" && (
                    <Button
                      size="sm"
                      className="text-white hover:opacity-90"
                      style={{ backgroundColor: '#D4AF37' }}
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
                  <div className="pt-2 border-t" style={{ borderColor: '#D4AF37' }}>
                    <div className="flex items-center space-x-2 text-sm" style={{ color: '#D4AF37' }}>
                      <Clock className="h-4 w-4" />
                      <span>Phase en cours</span>
                    </div>
                  </div>
                )}

                {phase.locked && phase.status === "pending" && (
                  <div className="pt-2 border-t" style={{ borderColor: '#D4AF37' }}>
                    <div className="flex items-center space-x-2 text-sm" style={{ color: '#A0522D' }}>
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
          <Card className="bg-white border-2 shadow-sm" style={{ borderColor: '#D4AF37' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#8B4513' }}>Documents totaux</CardTitle>
              <FileText className="h-4 w-4" style={{ color: '#D4AF37' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#8B4513' }}>25</div>
              <p className="text-xs" style={{ color: '#A0522D' }}>21 validés</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 shadow-sm" style={{ borderColor: '#D4AF37' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#8B4513' }}>Temps restant</CardTitle>
              <Calendar className="h-4 w-4" style={{ color: '#D4AF37' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#8B4513' }}>127j</div>
              <p className="text-xs" style={{ color: '#A0522D' }}>Jusqu'à la livraison</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 shadow-sm" style={{ borderColor: '#D4AF37' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#8B4513' }}>Prochaine échéance</CardTitle>
              <AlertCircle className="h-4 w-4" style={{ color: '#D4AF37' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#8B4513' }}>3j</div>
              <p className="text-xs" style={{ color: '#A0522D' }}>Validation APD</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
