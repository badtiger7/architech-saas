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
  const { projects, loading: loadingProjects } = useProjects("y1dz7q6fj91e3cf0i0p7t67d")
  const api = useApi()
  const searchParams = useSearchParams()

  // Project thumbnail state and functionality
  const [projectThumbnails, setProjectThumbnails] = useState<{[key: string]: string}>({})
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

  // Load phases when project changes
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      const projectFromUrl = searchParams.get('project')
      if (projectFromUrl && projects.find(p => p.id === projectFromUrl)) {
        setSelectedProject(projectFromUrl)
      } else {
        setSelectedProject(projects[0].id)
      }
    }
  }, [projects, searchParams])

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

  useEffect(() => {
    if (selectedProject) {
      loadPhases()
    }
  }, [selectedProject, loadPhases])

  const currentProject = projects.find((p) => p.id === selectedProject)

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-3 py-1 border-2 border-black/20 text-black text-xs font-medium uppercase tracking-wide">Terminée</span>
      case "in-progress":
        return <span className="px-3 py-1 bg-black text-white text-xs font-medium uppercase tracking-wide">En cours</span>
      case "blocked":
        return <span className="px-3 py-1 border-2 border-black text-black text-xs font-medium uppercase tracking-wide">Bloquée</span>
      default:
        return <span className="px-3 py-1 border-2 border-black/10 text-black/60 text-xs font-medium uppercase tracking-wide">Non commencée</span>
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
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-black border-r-black/20 border-b-black/20 border-l-black/20 mx-auto mb-4"></div>
            <p className="text-black/60 font-light">Chargement des projets...</p>
          </div>
        </div>
      </div>
    )
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
      
      {/* Project Selection Header */}
      <div className="border-b-2 border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div 
                  className="w-16 h-16 border-2 border-black/10 overflow-hidden cursor-pointer bg-white flex items-center justify-center hover:border-black transition-all"
                  onClick={triggerFileInput}
                >
                  {projectThumbnails[selectedProject] ? (
                    <img 
                      src={projectThumbnails[selectedProject]} 
                      alt="Project thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-black/40" />
                  )}
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
                  <SelectTrigger className="w-full md:w-80 bg-white border-2 border-black/10 rounded-lg hover:border-black/20 transition-all">
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-2 border-black">
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id} className="p-3 hover:bg-black hover:text-white rounded-lg">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-2 h-2 bg-black flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate text-black">{project.name}</div>
                            <div className="text-xs text-black/50 font-light">Timeline documentaire</div>
                          </div>
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
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 rounded-lg border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all">
                      <Share2 className="h-4 w-4" />
                      <span>Partager</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-lg border-2 border-black">
                    <DialogHeader>
                      <DialogTitle className="font-black tracking-tighter text-black">Partager le projet</DialogTitle>
                      <div className="w-12 h-1 bg-black mb-4"></div>
                      <DialogDescription className="text-black/60 font-light">
                        Inviter quelqu'un à collaborer sur {currentProject.name}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleShareSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium text-black uppercase tracking-wide">Nom complet</Label>
                        <Input
                          id="fullName"
                          value={shareForm.fullName}
                          onChange={(e) => setShareForm(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Jean Dupont"
                          className="rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-black uppercase tracking-wide">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shareForm.email}
                          onChange={(e) => setShareForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="jean@example.com"
                          className="rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="permission" className="text-sm font-medium text-black uppercase tracking-wide">Permission</Label>
                        <Select value={shareForm.permission} onValueChange={(value) => setShareForm(prev => ({ ...prev, permission: value }))}>
                          <SelectTrigger className="rounded-lg border-2 border-black/10 focus:border-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-2 border-black">
                            <SelectItem value="read" className="rounded-lg hover:bg-black hover:text-white">Lecture seule</SelectItem>
                            <SelectItem value="write" className="rounded-lg hover:bg-black hover:text-white">Lecture et écriture</SelectItem>
                            <SelectItem value="admin" className="rounded-lg hover:bg-black hover:text-white">Administrateur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full bg-black text-white hover:bg-black/90 rounded-lg border-2 border-black font-medium tracking-wide">
                          Envoyer l'invitation
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 rounded-lg border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all">
                  <Settings className="h-4 w-4" />
                  <span>Configuration</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-12 lg:px-16 py-8">
        {!selectedProject ? (
          <div className="text-center py-12">
            <div className="text-black/60 font-light">
              {projects.length === 0 ? 'Aucun projet disponible' : 'Sélectionnez un projet pour voir sa timeline'}
            </div>
          </div>
        ) : loadingPhases ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-black border-r-black/20 border-b-black/20 border-l-black/20 mx-auto mb-4"></div>
              <p className="text-black/60 font-light">Chargement des phases...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-black/10">
            {/* Timeline */}
            <div className="lg:col-span-3 bg-white p-6 md:p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-caveat text-4xl md:text-5xl font-bold text-black mb-2">Timeline du Projet</h2>
                    <div className="w-16 md:w-24 h-1 bg-sand-500"></div>
                  </div>
                  <Dialog open={addPhaseDialogOpen} onOpenChange={setAddPhaseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-sand-500 text-white hover:bg-sand-600 border-2 border-sand-500 rounded-lg font-medium tracking-wide">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter phase
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-lg border-2 border-black">
                      <DialogHeader>
                        <DialogTitle className="font-black tracking-tighter text-black">Ajouter une nouvelle phase</DialogTitle>
                        <div className="w-12 h-1 bg-black mb-4"></div>
                        <DialogDescription className="text-black/60 font-light">
                          Créer une nouvelle phase pour le projet {currentProject?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={addPhase} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phaseName" className="text-sm font-medium text-black uppercase tracking-wide">Nom de la phase</Label>
                          <Input
                            id="phaseName"
                            value={newPhaseForm.name}
                            onChange={(e) => setNewPhaseForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ex: Études techniques"
                            required
                            className="rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phaseStartDate" className="text-sm font-medium text-black uppercase tracking-wide">Date de début (optionnel)</Label>
                          <Input
                            id="phaseStartDate"
                            type="date"
                            value={newPhaseForm.startDate}
                            onChange={(e) => setNewPhaseForm(prev => ({ ...prev, startDate: e.target.value }))}
                            className="rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setAddPhaseDialogOpen(false)}
                            className="rounded-lg border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all"
                          >
                            Annuler
                          </Button>
                          <Button type="submit" className="bg-black text-white hover:bg-black/90 rounded-lg border-2 border-black font-medium tracking-wide">
                            Ajouter la phase
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {phases.length === 0 ? (
                  <div className="border-2 border-black/10 p-8 text-center rounded-xl">
                    <Calendar className="h-12 w-12 text-black/40 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-black mb-2">Aucune phase</h3>
                    <p className="text-black/60 font-light mb-4">
                      Ce projet n'a pas encore de phases définies.
                    </p>
                    <Dialog open={addPhaseDialogOpen} onOpenChange={setAddPhaseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-black text-white hover:bg-black/90 rounded-lg border-2 border-black font-medium tracking-wide">
                          <Plus className="h-4 w-4 mr-2" />
                          Créer la première phase
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-xl border-2 border-black">
                        <DialogHeader>
                          <DialogTitle className="font-black tracking-tighter text-black">Ajouter une nouvelle phase</DialogTitle>
                          <div className="w-12 h-1 bg-black mb-4"></div>
                          <DialogDescription className="text-black/60 font-light">
                            Créer la première phase pour le projet {currentProject?.name}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={addPhase} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phaseName" className="text-sm font-medium text-black uppercase tracking-wide">Nom de la phase</Label>
                            <Input
                              id="phaseName"
                              value={newPhaseForm.name}
                              onChange={(e) => setNewPhaseForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Ex: Esquisse"
                              required
                              className="rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phaseStartDate" className="text-sm font-medium text-black uppercase tracking-wide">Date de début (optionnel)</Label>
                            <Input
                              id="phaseStartDate"
                              type="date"
                              value={newPhaseForm.startDate}
                              onChange={(e) => setNewPhaseForm(prev => ({ ...prev, startDate: e.target.value }))}
                              className="rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              type="button" 
                              variant="outline"
                              onClick={() => setAddPhaseDialogOpen(false)}
                              className="rounded-lg border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all"
                            >
                              Annuler
                            </Button>
                            <Button type="submit" className="bg-black text-white hover:bg-black/90 rounded-lg border-2 border-black font-medium tracking-wide">
                              Créer la phase
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {phases.map((phase, index) => (
                      <div 
                        key={phase.id} 
                        className="border-2 border-black/10 p-6 md:p-8 hover:border-black/20 transition-all cursor-pointer rounded-xl"
                        onClick={() => {
                          const url = `/timeline/${phase.id}?projectId=${selectedProject}`
                          router.push(url)
                        }}
                      >
                        <div className="flex items-start space-x-6">
                          {/* Timeline connector */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-4 h-4 border-2 ${
                              phase.status === 'completed' ? 'bg-black border-black' :
                              phase.status === 'in-progress' ? 'border-black bg-black' :
                              phase.status === 'blocked' ? 'border-black bg-white' :
                              'border-black/20 bg-white'
                            }`}></div>
                            {index < phases.length - 1 && (
                              <div className="w-0.5 h-20 bg-black/10 mt-2"></div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black">{phase.name}</h3>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(phase.status)}
                                <ChevronRight className="h-5 w-5 text-black/40" />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-black/10">
                              <div>
                                <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Progression</p>
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 h-1 bg-black/10">
                                    <div className="h-full bg-black" style={{ width: `${phase.progressRatio}%` }}></div>
                                  </div>
                                  <span className="text-sm font-black text-black">{phase.progressRatio}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Début</p>
                                <p className="text-sm font-medium text-black">
                                  {formatDateForDisplay(phase.startDate)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Ordre</p>
                                <p className="text-sm font-medium text-black">Phase {phase.orderIndex + 1}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-black/60 font-light">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>0 documents</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>0 collaborateurs</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>0 commentaires</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="bg-white p-6 md:p-8 lg:p-12 space-y-8">
              {/* Project Info */}
              {currentProject && (
                <div>
                  <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black mb-4">Informations Projet</h3>
                  <div className="w-12 md:w-16 h-1 bg-black mb-6"></div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Client</p>
                      <p className="font-medium text-black">{currentProject.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Statut</p>
                      <div className="px-3 py-1 border-2 border-black/20 text-black text-xs font-medium uppercase tracking-wide inline-block">
                        {currentProject.status}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Créé le</p>
                      <p className="text-sm font-medium text-black">
                        {new Date(currentProject.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black mb-4">Actions Rapides</h3>
                <div className="w-12 md:w-16 h-1 bg-black mb-6"></div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all">
                    <FileText className="h-4 w-4 mr-2" />
                    Ajouter un document
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all">
                    <Users className="h-4 w-4 mr-2" />
                    Inviter un collaborateur
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planifier une réunion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
