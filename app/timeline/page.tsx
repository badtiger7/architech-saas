"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  Share2,
  Users,
  Camera,
  Edit3,
  Trash2,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { getStatusClasses, getProjectStatusClasses, formatDateForDisplay } from "@/lib/utils"
import { useProjects } from "@/hooks/use-projects"
import { useApi, type Project, type Phase } from "@/lib/api/client"
import { toast } from "sonner"

export default function TimelinePage() {
  const router = useRouter()
  const [editingPhase, setEditingPhase] = useState<number | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState<number | null>(null)
  const [shareForm, setShareForm] = useState({
    fullName: "",
    email: "",
    permission: "read",
  })
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [phases, setPhases] = useState<Phase[]>([])
  const [loadingPhases, setLoadingPhases] = useState(false)
  const [addPhaseDialogOpen, setAddPhaseDialogOpen] = useState(false)
  const [newPhaseForm, setNewPhaseForm] = useState({
    name: "",
    startDate: "",
  })

  // API hooks
  const { projects, loading: loadingProjects, deleteProject } = useProjects("y1dz7q6fj91e3cf0i0p7t67d") // Real org ID
  const api = useApi()
  const searchParams = useSearchParams()

  // Project thumbnail state and functionality
  const [thumbnailSignedUrls, setThumbnailSignedUrls] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Charger les URLs signées pour les thumbnails
  useEffect(() => {
    const loadThumbnailUrls = async () => {
      for (const project of projects) {
        if ((project as any).thumbnailUrl) {
          try {
            const response = await fetch(`/api/projects/${project.id}/thumbnail/url`)
            const result = await response.json()
            
            if (result.success && result.data.signedUrl) {
              setThumbnailSignedUrls(prev => ({
                ...prev,
                [project.id]: result.data.signedUrl
              }))
            }
          } catch (error) {
            console.error(`Erreur chargement thumbnail pour ${project.id}:`, error)
          }
        }
      }
    }
    
    loadThumbnailUrls()
  }, [projects])

  // Function to handle thumbnail upload
  const handleThumbnailChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedProject) return

    try {
      // Créer un FormData pour l'upload
      const formData = new FormData()
      formData.append('thumbnail', file)

      // Appeler l'API d'upload
      const response = await fetch(`/api/projects/${selectedProject}/thumbnail`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // Recharger la page pour afficher la nouvelle thumbnail
        window.location.reload()
      } else {
        alert(`❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Erreur upload thumbnail:', error)
      alert("❌ Erreur lors de l'upload de la photo")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Fonction pour supprimer le projet
  const handleDeleteProject = async () => {
    if (!selectedProject) {
      alert("Aucun projet sélectionné")
      return
    }

    const currentProject = projects.find(p => p.id === selectedProject)
    if (!currentProject) return

    console.log("🔴 Tentative de suppression du projet:", currentProject.name, "ID:", selectedProject)

    if (!confirm(`Êtes-vous sûr de vouloir supprimer le projet "${currentProject.name}" ? Cette action est irréversible et supprimera toutes les phases associées.`)) {
      console.log("🔴 Suppression annulée par l'utilisateur")
      return
    }

    try {
      console.log("🔴 Appel de deleteProject avec ID:", selectedProject)
      const result = await deleteProject(selectedProject)
      
      console.log("🔴 Résultat de deleteProject:", result)
      
      if (result) {
        console.log("✅ Projet supprimé avec succès, redirection vers dashboard")
        // Rediriger vers le dashboard après suppression avec refresh
        window.location.href = '/dashboard'
      } else {
        console.error("❌ deleteProject a retourné false")
        alert("❌ Erreur lors de la suppression du projet")
      }
    } catch (error) {
      console.error("❌ Erreur suppression projet:", error)
      alert("❌ Erreur lors de la suppression du projet")
    }
  }

  // Load phases when project changes
  // Set first project as selected by default when projects load, or from URL parameter
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      const projectFromUrl = searchParams.get('project')
      if (projectFromUrl && projects.find(p => p.id === projectFromUrl)) {
        // Select project from URL if it exists
        setSelectedProject(projectFromUrl)
      } else {
        // Default to first project if none selected
        setSelectedProject(projects[0].id)
      }
    }
  }, [projects, searchParams]) // Retiré selectedProject des dépendances !

  const loadPhases = useCallback(async () => {
    if (!selectedProject) return
    setLoadingPhases(true)
    try {
      const response = await api.phases.list(selectedProject)
      if (response.success && response.data) {
        setPhases(response.data)
      } else {
        toast.error('Erreur lors du chargement des phases')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    } finally {
      setLoadingPhases(false)
    }
  }, [selectedProject])

  // Charger les phases quand le projet sélectionné change
  useEffect(() => {
    if (selectedProject) {
      loadPhases()
    }
  }, [selectedProject, loadPhases])

  const currentProject = projects.find((p) => p.id === selectedProject)

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId)
  }

  const getStatusColor = (status: string) => {
    const classes = getStatusClasses(status as any)
    switch (status) {
      case "completed":
        return "bg-success"
      case "in-progress":
        return "bg-warning"
      case "blocked":
        return "bg-danger"
      default:
        return "bg-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    const classes = getStatusClasses(status as any)
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground hover:bg-success/90">Terminée</Badge>
      case "in-progress":
        return <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">En cours</Badge>
      case "blocked":
        return <Badge className="bg-danger text-danger-foreground hover:bg-danger/90">Bloquée</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">Non commencée</Badge>
    }
  }

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShareDialogOpen(null)
    setShareForm({ fullName: "", email: "", permission: "read" })
  }

  const updatePhaseStatus = async (phaseId: string, newStatus: Phase['status']) => {
    if (!selectedProject) return

    try {
      const response = await api.phases.update(selectedProject, phaseId, { status: newStatus })
      if (response.success && response.data) {
        setPhases(prev => 
          prev.map(phase => 
            phase.id === phaseId ? { ...phase, status: newStatus } : phase
          )
        )
        toast.success('Phase mise à jour')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    }
  }

  const addPhase = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProject || !newPhaseForm.name.trim()) {
      return
    }

    try {
      const nextOrderIndex = phases.length
      
      const response = await api.phases.create(selectedProject, {
        name: newPhaseForm.name,
        orderIndex: nextOrderIndex,
        startDate: newPhaseForm.startDate || undefined,
      })

      if (response.success && response.data) {
        setPhases(prev => [...prev, response.data!])
        setAddPhaseDialogOpen(false)
        setNewPhaseForm({ name: "", startDate: "" })
        toast.success('Phase ajoutée avec succès')
      } else {
        toast.error('Erreur lors de la création de la phase: ' + (response.error || 'Erreur inconnue'))
      }
    } catch (error) {
      toast.error('Erreur de connexion: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    }
  }

  if (loadingProjects) {
  return (
      <div className="min-h-screen bg-background">
      <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des projets...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Project Selection Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div 
                  className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer bg-muted flex items-center justify-center"
                  onClick={triggerFileInput}
                >
                  {thumbnailSignedUrls[selectedProject] ? (
                    <img 
                      src={thumbnailSignedUrls[selectedProject]} 
                      alt="Project thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="flex-1">
                <Select value={selectedProject} onValueChange={handleProjectChange}>
                  <SelectTrigger className="w-full md:w-80 bg-background border-border">
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id} className="p-3 hover:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-2 h-2 rounded-full flex-shrink-0 bg-primary"></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate text-secondary">{project.name}</div>
                            <div className="text-xs text-tertiary">Timeline documentaire</div>
              </div>
                          <Badge className={`text-xs flex-shrink-0 ${getProjectStatusClasses(project.status).badge}`}>
                            {project.status}
                          </Badge>
            </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentProject && (
              <div className="flex items-center space-x-2">

                <Dialog>
                      <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Share2 className="h-4 w-4" />
                      <span>Partager</span>
                        </Button>
                      </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                      <DialogTitle>Partager le projet</DialogTitle>
                      <DialogDescription>
                        Inviter quelqu'un à collaborer sur {currentProject.name}
                          </DialogDescription>
                        </DialogHeader>
                    <form onSubmit={handleShareSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nom complet</Label>
                            <Input
                              id="fullName"
                              value={shareForm.fullName}
                          onChange={(e) => setShareForm(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Jean Dupont"
                            />
                          </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={shareForm.email}
                          onChange={(e) => setShareForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="jean@example.com"
                            />
                          </div>
                      <div className="space-y-2">
                        <Label htmlFor="permission">Permission</Label>
                        <Select value={shareForm.permission} onValueChange={(value) => setShareForm(prev => ({ ...prev, permission: value }))}>
                          <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                          <SelectContent>
                                <SelectItem value="read">Lecture seule</SelectItem>
                            <SelectItem value="write">Lecture et écriture</SelectItem>
                            <SelectItem value="admin">Administrateur</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full">
                          Envoyer l'invitation
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Configuration</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDeleteProject}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Supprimer</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="container mx-auto px-4 py-8">
        {!selectedProject ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {projects.length === 0 ? 'Aucun projet disponible' : 'Sélectionnez un projet pour voir sa timeline'}
            </div>
          </div>
        ) : loadingPhases ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des phases...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                                 <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-bold text-secondary">Timeline du Projet</h2>
                   <Dialog open={addPhaseDialogOpen} onOpenChange={setAddPhaseDialogOpen}>
                     <DialogTrigger asChild>
                       <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                         <Plus className="h-4 w-4 mr-2" />
                         Ajouter une phase
                            </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-md">
                       <DialogHeader>
                         <DialogTitle>Ajouter une nouvelle phase</DialogTitle>
                         <DialogDescription>
                           Créer une nouvelle phase pour le projet {currentProject?.name}
                         </DialogDescription>
                       </DialogHeader>
                       <form onSubmit={addPhase} className="space-y-4">
                         <div className="space-y-2">
                           <Label htmlFor="phaseName">Nom de la phase</Label>
                           <Input
                             id="phaseName"
                             value={newPhaseForm.name}
                             onChange={(e) => setNewPhaseForm(prev => ({ ...prev, name: e.target.value }))}
                             placeholder="Ex: Études techniques"
                             required
                           />
                         </div>
                         <div className="space-y-2">
                           <Label htmlFor="phaseStartDate">Date de début (optionnel)</Label>
                           <Input
                             id="phaseStartDate"
                             type="date"
                             value={newPhaseForm.startDate}
                             onChange={(e) => setNewPhaseForm(prev => ({ ...prev, startDate: e.target.value }))}
                           />
                         </div>
                         <DialogFooter>
                            <Button 
                             type="button" 
                              variant="outline" 
                             onClick={() => setAddPhaseDialogOpen(false)}
                            >
                              Annuler
                            </Button>
                           <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                             Ajouter la phase
                           </Button>
                         </DialogFooter>
                       </form>
                      </DialogContent>
                    </Dialog>
                 </div>

                {phases.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-secondary mb-2">Aucune phase</h3>
                      <p className="text-muted-foreground mb-4">
                        Ce projet n'a pas encore de phases définies.
                      </p>
                                             <Dialog open={addPhaseDialogOpen} onOpenChange={setAddPhaseDialogOpen}>
                         <DialogTrigger asChild>
                           <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                             <Plus className="h-4 w-4 mr-2" />
                             Créer la première phase
                           </Button>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-md">
                           <DialogHeader>
                             <DialogTitle>Ajouter une nouvelle phase</DialogTitle>
                             <DialogDescription>
                               Créer la première phase pour le projet {currentProject?.name}
                             </DialogDescription>
                           </DialogHeader>
                           <form onSubmit={addPhase} className="space-y-4">
                             <div className="space-y-2">
                               <Label htmlFor="phaseName">Nom de la phase</Label>
                               <Input
                                 id="phaseName"
                                 value={newPhaseForm.name}
                                 onChange={(e) => setNewPhaseForm(prev => ({ ...prev, name: e.target.value }))}
                                 placeholder="Ex: Esquisse"
                                 required
                               />
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor="phaseStartDate">Date de début (optionnel)</Label>
                               <Input
                                 id="phaseStartDate"
                                 type="date"
                                 value={newPhaseForm.startDate}
                                 onChange={(e) => setNewPhaseForm(prev => ({ ...prev, startDate: e.target.value }))}
                               />
                             </div>
                             <DialogFooter>
                        <Button
                                 type="button" 
                          variant="outline"
                                 onClick={() => setAddPhaseDialogOpen(false)}
                               >
                                 Annuler
                        </Button>
                               <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                 Créer la phase
                        </Button>
                             </DialogFooter>
                           </form>
                         </DialogContent>
                       </Dialog>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {phases.map((phase, index) => (
                      <Card 
                        key={phase.id} 
                        className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                          phase.status === 'in-progress' ? 'ring-2 ring-primary ring-opacity-50' : ''
                        }`}
                        onClick={() => {
                          const url = `/timeline/${phase.id}?projectId=${selectedProject}`
                          router.push(url)
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            {/* Timeline connector */}
                            <div className="flex flex-col items-center">
                              <div className={`w-4 h-4 rounded-full border-2 border-background ${getStatusColor(phase.status)}`}></div>
                              {index < phases.length - 1 && (
                                <div className="w-0.5 h-16 bg-border mt-2"></div>
                    )}
                  </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-secondary">{phase.name}</h3>
                                <div className="flex items-center space-x-2">
                                  {getStatusBadge(phase.status)}
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                    </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                                  <p className="text-sm text-muted-foreground">Progression</p>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={phase.progressRatio} className="flex-1" />
                                    <span className="text-sm font-medium">{phase.progressRatio}%</span>
                    </div>
                  </div>
                    <div>
                                  <p className="text-sm text-muted-foreground">Début</p>
                                  <p className="text-sm font-medium">
                                    {formatDateForDisplay(phase.startDate)}
                                  </p>
                    </div>
                    <div>
                                  <p className="text-sm text-muted-foreground">Ordre</p>
                                  <p className="text-sm font-medium">Phase {phase.orderIndex + 1}</p>
                    </div>
                  </div>

                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <FileText className="h-4 w-4" />
                                  <span>0 documents</span>
                  </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>0 collaborateurs</span>
                </div>
                  <div className="flex items-center space-x-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>0 commentaires</span>
                                </div>
                  </div>
                </div>
                    </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              {currentProject && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations Projet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium text-secondary">{currentProject.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <Badge className={getProjectStatusClasses(currentProject.status).badge}>
                        {currentProject.status}
                      </Badge>
                  </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Créé le</p>
                      <p className="text-sm">
                        {new Date(currentProject.createdAt).toLocaleDateString('fr-FR')}
                      </p>
        </div>
            </CardContent>
          </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions Rapides</CardTitle>
            </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Ajouter un document
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Inviter un collaborateur
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planifier une réunion
                  </Button>
            </CardContent>
          </Card>
        </div>
          </div>
        )}
      </div>
    </div>
  )
}
