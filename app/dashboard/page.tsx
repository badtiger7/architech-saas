"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, FileText, Users, Clock, AlertCircle, TrendingUp, Plus, Eye, Camera, Edit3 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useState, useRef, useMemo, useEffect } from "react"
import { useProjects } from "@/hooks/use-projects"
import { Label } from "@/components/ui/label"


export default function DashboardPage() {
      // Function to trigger file input
      const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

      // États pour le formulaire de nouveau projet
      const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false)
      const [newProjectForm, setNewProjectForm] = useState({
        name: "",
        clientName: "",
        startDate: new Date().toISOString().split('T')[0],
      })

      // Function to handle thumbnail upload
      const handleThumbnailChange = async (projectRealId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
          // Créer un FormData pour l'upload
          const formData = new FormData()
          formData.append('thumbnail', file)

          // Appeler l'API d'upload
          const response = await fetch(`/api/projects/${projectRealId}/thumbnail`, {
            method: 'POST',
            body: formData,
          })

          const result = await response.json()

          if (result.success) {
            // Recharger les projets pour afficher la nouvelle thumbnail
            window.location.reload()
          } else {
            alert(`❌ Erreur: ${result.error}`)
          }
        } catch (error) {
          console.error('❌ Erreur upload thumbnail:', error)
          alert("❌ Erreur lors de l'upload de la photo")
        }
      }

      const triggerFileInput = (projectId: number) => {
        fileInputRefs.current[projectId]?.click();
      }

      const calculateProjectDuration = (startDate: string) => {
        const today = new Date()
      const start = new Date(startDate)
      const diffTime = Math.abs(today.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 30) {
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}`
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} mois`
      } else {
        const years = Math.floor(diffDays / 365)
        const remainingMonths = Math.floor((diffDays % 365) / 30)
        return `${years} an${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` et ${remainingMonths} mois` : ''}`
      }
    }
    
    // Récupérer les projets dynamiquement
    const organizationId = "y1dz7q6fj91e3cf0i0p7t67d"
    const { projects: dbProjects, createProject } = useProjects(organizationId)
    
    // State pour stocker les URLs signées des thumbnails
    const [thumbnailSignedUrls, setThumbnailSignedUrls] = useState<Record<string, string>>({})
    
    // Fonction pour fermer le dialogue
    const closeNewProjectDialog = () => {
      setIsNewProjectDialogOpen(false)
      setNewProjectForm({
        name: "",
        clientName: "",
        startDate: new Date().toISOString().split('T')[0],
      })
    }

     // Fonction pour créer un nouveau projet
     const handleCreateProject = async () => {
       if (!newProjectForm.name.trim()) {
         alert("Le nom du projet est obligatoire")
         return
       }

       const projectData = {
         name: newProjectForm.name.trim(),
         clientName: newProjectForm.clientName.trim() || "Client",
         organizationId: organizationId,
         startDate: newProjectForm.startDate,
       }

       console.log("🟢 Création projet avec les données:", projectData)

       try {
         const result = await createProject(projectData)

         console.log("🟡 Résultat de createProject:", result)

         if (result) {
           console.log("✅ Projet créé avec succès:", result)
           closeNewProjectDialog()
         } else {
           console.error("❌ La création a échoué")
           alert("❌ Erreur lors de la création du projet")
         }
       } catch (error) {
         console.error("❌ Erreur création projet:", error)
         alert("❌ Erreur lors de la création du projet")
       }
     }

    // Charger les URLs signées pour les thumbnails
    useEffect(() => {
      const loadThumbnailUrls = async () => {
        for (const project of dbProjects) {
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
    }, [dbProjects])

    // Formater les projets pour l'affichage
    const projects = useMemo(() => {
      return dbProjects.map((project, index) => ({
        id: index + 1,
        projectId: project.id,
        name: project.name,
        client: project.clientName || "Client",
        progress: 65, // TODO: Calculer depuis les phases
        status: "En cours",
        currentPhase: "APD", // TODO: Récupérer depuis les phases
        startDate: project.startDate || new Date().toISOString().split('T')[0],
        thumbnail: thumbnailSignedUrls[project.id] || null,
        team: [
          { name: "Équipe", role: "Architecte", initials: "EQ" }
        ],
      }))
    }, [dbProjects, thumbnailSignedUrls])

  const recentDocuments = [
    { name: "Plans Facade - v2.3.dwg", project: "Résidence Les Jardins", uploadedBy: "Jean Dupont", time: "Il y a 2h" },
    { name: "Rapport Structure.pdf", project: "Bureaux Tech Center", uploadedBy: "Marie Leroy", time: "Il y a 4h" },
    { name: "Perspectives 3D.zip", project: "Villa Moderne", uploadedBy: "Paul Leroy", time: "Hier" },
  ]

  const notifications = [
    { type: "deadline", message: "Échéance APD - Résidence Les Jardins dans 3 jours", time: "Il y a 1h" },
    { type: "document", message: "Nouveau document ajouté par Marie Leroy", time: "Il y a 2h" },
    { type: "validation", message: "Validation requise pour les plans de façade", time: "Il y a 3h" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border-l-2 border-t-2 border-black/5"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] border-r-2 border-b-2 border-black/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
      </div>

      <Navbar />

      <main className="relative w-full px-6 md:px-12 lg:px-24 xl:px-32 2xl:px-40 py-6 md:py-8 lg:py-10">
        {/* Header - Compact */}
        <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-black/10 pb-4 md:pb-5">
          <div>
            <h1 className="font-caveat text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-black mb-2">
              Tableau de bord
            </h1>
          </div>
          <Button 
            onClick={() => setIsNewProjectDialogOpen(true)}
            className="bg-sand-500 text-white hover:bg-sand-600 border-2 border-sand-500 rounded-lg text-sm font-medium tracking-wide px-5 h-9 transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau projet
          </Button>
        </div>

        {/* Stats Cards - Modern Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="bg-white p-6 md:p-7 border border-black/5 hover:border-sand-200 transition-all group rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-medium text-sand-700 uppercase tracking-wide">Projets actifs</span>
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-sand-400 group-hover:text-sand-600 transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-black tracking-tighter">{projects.length}</div>
            <p className="text-xs text-black/50 font-light mt-2">{projects.length > 0 ? "+1 ce mois" : "0 projet"}</p>
          </div>

          <div className="bg-white p-6 md:p-7 border border-black/5 hover:border-black/10 transition-all group rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-medium text-black/60 uppercase tracking-wide">Documents</span>
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-black/40 group-hover:text-black transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-black tracking-tighter">{recentDocuments.length}</div>
            <p className="text-xs text-black/50 font-light mt-2">+12 cette semaine</p>
          </div>

          <div className="bg-white p-6 md:p-7 border border-black/5 hover:border-black/10 transition-all group rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-medium text-black/60 uppercase tracking-wide">Collaborateurs</span>
              <Users className="h-4 w-4 md:h-5 md:w-5 text-black/40 group-hover:text-black transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-black tracking-tighter">8</div>
            <p className="text-xs text-black/50 font-light mt-2">Équipe active</p>
          </div>

          <div className="bg-white p-6 md:p-7 border border-black/5 hover:border-black/10 transition-all group rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-medium text-black/60 uppercase tracking-wide">Échéances</span>
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-black/40 group-hover:text-black transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-black tracking-tighter">2</div>
            <p className="text-xs text-black/50 font-light mt-2">Cette semaine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
          {/* Projects Overview - Left Column */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-xl">
            <div className="mb-6 md:mb-8">
              <h2 className="font-caveat text-3xl md:text-4xl font-bold text-black mb-2">Projets en cours</h2>
              <div className="w-16 md:w-24 h-1 bg-sand-500 mb-4"></div>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              {projects.map((project) => (
                <div key={project.id} className="border border-black/5 p-6 md:p-8 hover:border-black/20 transition-all duration-200 rounded-xl group">
                  {/* Hidden file input for each project */}
                  <input
                    type="file"
                    ref={(el) => { fileInputRefs.current[project.id] = el }}
                    onChange={(e) => handleThumbnailChange(project.projectId, e)}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                    {/* Project Thumbnail */}
                    <div className="relative thumbnail-group">
                      <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden bg-white border border-black/10 flex items-center justify-center rounded-lg">
                        {project.thumbnail ? (
                          <img 
                            src={project.thumbnail} 
                            alt={`Miniature ${project.name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 md:w-10 md:h-10 text-black/40" />
                        )}
                      </div>
                      
                      {/* Edit overlay on hover */}
                      <div 
                        className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg thumbnail-overlay"
                        onClick={() => triggerFileInput(project.id)}
                      >
                        <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      
                      {/* Edit button always visible on mobile */}
                      <button
                        onClick={() => triggerFileInput(project.id)}
                        className="absolute -bottom-1 -right-1 bg-black text-white rounded-lg p-2 shadow-lg md:hidden border border-black"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black mb-1">{project.name}</h3>
                          <p className="text-sm md:text-base text-black/60 font-light">{project.client}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1.5 border border-black/10 bg-black/5 text-black text-xs md:text-sm font-medium uppercase tracking-wide rounded-md">
                            {project.status}
                          </div>
                          <Link href={`/timeline?project=${project.projectId}`}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="rounded-lg border border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm h-9 px-4"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Project Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 pb-6 border-b border-black/5">
                        <div>
                          <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Phase actuelle</p>
                          <p className="text-sm md:text-base font-medium text-black">{project.currentPhase}</p>
                        </div>
                        <div>
                          <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Date de début</p>
                          <p className="text-sm md:text-base font-medium text-black">{project.startDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Commencé il y a</p>      
                          <p className="text-sm md:text-base font-medium text-black">{calculateProjectDuration(project.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-black/50 font-light uppercase tracking-wide mb-1">Équipe</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {project.team.map((member, index) => (
                              <div 
                                key={index} 
                                className="flex items-center space-x-2 border border-black/10 px-2.5 py-1.5 hover:bg-black hover:text-white hover:border-black transition-all duration-200 cursor-pointer group rounded-md"
                              >
                                <Avatar className="w-5 h-5 md:w-6 md:h-6 border border-black/10 group-hover:border-white rounded-full">
                                  <AvatarFallback className="text-xs bg-black text-white rounded-full">{member.initials}</AvatarFallback>
                                </Avatar>
                                <div className="text-xs">
                                  <p className="font-medium">{member.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-black/60 font-light uppercase tracking-wide">Progression</span>
                          <span className="text-sm md:text-base font-black text-black">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-black/5 w-full rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-black transition-all duration-300 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4 bg-white p-6 md:p-8 space-y-8 rounded-xl">
            {/* Recent Documents */}
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tighter text-black mb-4">
                Documents récents
              </h3>
              <div className="space-y-5">
                {recentDocuments.map((doc, index) => (
                  <div key={index} className="border-l border-black/10 pl-4 hover:border-black/30 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 md:h-5 md:w-5 text-black/40 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium text-black mb-1">{doc.name}</p>
                        <p className="text-xs text-black/60 font-light">{doc.project}</p>
                        <p className="text-xs text-black/40 font-light mt-1">
                          {doc.uploadedBy} • {doc.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/drive">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-lg border border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm h-9"
                  >
                    Voir tous les documents
                  </Button>
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tighter text-black mb-4">
                Notifications récentes
              </h3>
              <div className="space-y-5">
                {notifications.map((notif, index) => (
                  <div key={index} className="border-l border-black/10 pl-4 hover:border-black/30 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      {notif.type === "deadline" && <Clock className="h-4 w-4 md:h-5 md:w-5 text-black/40 mt-1" />}
                      {notif.type === "document" && <FileText className="h-4 w-4 md:h-5 md:w-5 text-black/40 mt-1" />}
                      {notif.type === "validation" && <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-black/40 mt-1" />}
                      <div className="flex-1">
                        <p className="text-sm md:text-base text-black mb-1">{notif.message}</p>
                        <p className="text-xs text-black/40 font-light">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/notifications">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-lg border border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm h-9"
                  >
                    Voir toutes les notifications
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tighter text-black mb-4">
                Actions rapides
              </h3>
              <div className="space-y-2">
                <Link href="/timeline">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start rounded-lg border border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm h-9 px-4"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Voir la timeline
                  </Button>
                </Link>
                <Link href="/drive">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start rounded-lg border border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm h-9 px-4"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Gérer les documents
                  </Button>
                </Link>
                <Link href="/journal">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start rounded-lg border border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm h-9 px-4"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Journal de chantier
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog pour créer un nouveau projet - Nike Style */}
        {isNewProjectDialogOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeNewProjectDialog()
              }
            }}
          >
            {/* Modal content */}
            <div 
              className="bg-white border border-black/10 shadow-xl p-8 md:p-12 max-w-lg w-full mx-4 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-2">Créer un nouveau projet</h2>
                <p className="text-sm md:text-base text-black/60 font-light mt-2">Ajoutez un nouveau projet à votre portefeuille</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="projectName" className="text-sm font-medium text-black uppercase tracking-wide mb-2 block">
                    Nom du projet *
                  </Label>
                  <input 
                    id="projectName" 
                    type="text"
                    placeholder="Ex: Résidence Les Jardins..." 
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-black/10 focus:border-black transition-all rounded-lg bg-white text-black font-light placeholder:text-black/30 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="clientName" className="text-sm font-medium text-black uppercase tracking-wide mb-2 block">
                    Client
                  </Label>
                  <input 
                    id="clientName" 
                    type="text"
                    placeholder="Ex: SCI Les Jardins..." 
                    value={newProjectForm.clientName}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-black/10 focus:border-black transition-all rounded-lg bg-white text-black font-light placeholder:text-black/30 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium text-black uppercase tracking-wide mb-2 block">
                    Date de début
                  </Label>
                  <input 
                    id="startDate" 
                    type="date"
                    value={newProjectForm.startDate}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-black/10 focus:border-black transition-all rounded-lg bg-white text-black font-light text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-black/10">
                  <Button 
                    variant="outline" 
                    onClick={closeNewProjectDialog}
                    className="rounded-lg border border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-200 px-5"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={!newProjectForm.name.trim()}
                    className="bg-black text-white hover:bg-black/80 rounded-lg border border-black/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-5 hover:scale-[1.02]"
                  >
                    Créer le projet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
