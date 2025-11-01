"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, FileText, Users, Clock, AlertCircle, TrendingUp, Plus, Eye, Camera, Edit3 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useState, useRef, useMemo } from "react"
import { useProjects } from "@/hooks/use-projects"
import { Label } from "@/components/ui/label"


export default function DashboardPage() {

    const [projectThumbnails, setProjectThumbnails] = useState<{[key: number]: string}>({
      1: "/placeholder.jpg", // Default placeholder
      2: "/placeholder.jpg",
      3: "/placeholder.jpg"
    })

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
      const handleThumbnailChange = (projectId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            setProjectThumbnails(prev => ({
              ...prev,
              [projectId]: result
            }))
          }
          reader.readAsDataURL(file)
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
        team: [
          { name: "Équipe", role: "Architecte", initials: "EQ" }
        ],
      }))
    }, [dbProjects])

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de vos projets architecturaux</p>
          </div>
          <Button onClick={() => setIsNewProjectDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau projet
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">{projects.length > 0 ? "+1 ce mois" : "0 projet"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentDocuments.length}</div>
              <p className="text-xs text-muted-foreground">+12 cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collaborateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Équipe active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Échéances</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Cette semaine</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Projets en cours</CardTitle>
                <CardDescription>Suivi de l'avancement de vos projets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    {/* Hidden file input for each project */}
                    <input
                      type="file"
                      ref={(el) => fileInputRefs.current[project.id] = el}
                      onChange={(e) => handleThumbnailChange(project.id, e)}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />

                    <div className="flex items-start space-x-4 mb-3">
                      {/* Project Thumbnail */}
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                          {projectThumbnails[project.id] ? (
                            <img 
                              src={projectThumbnails[project.id]} 
                              alt={`Miniature ${project.name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-400" />
                          )}
                          
                          {/* Edit overlay on hover */}
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => triggerFileInput(project.id)}
                          >
                            <Edit3 className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        
                        {/* Edit button always visible on mobile */}
                        <button
                          onClick={() => triggerFileInput(project.id)}
                          className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 shadow-lg md:hidden"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Project Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <p className="text-sm text-gray-600">{project.client}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={project.status === "En cours" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                            <Link href={`/timeline?project=${project.projectId}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rest of the existing project card content */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Phase actuelle</p>
                        <p className="font-medium">{project.currentPhase}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date de début</p>
                        <p className="font-medium">{project.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Commencé il y a</p>      
                        <p className="font-medium">{calculateProjectDuration(project.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Équipe</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.team.map((member, index) => (
                            <div 
                              key={index} 
                              className="group relative flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-blue-600 text-white">{member.initials}</AvatarFallback>
                              </Avatar>
                              <div className="text-xs">
                                <p className="font-medium text-gray-900">{member.name}</p>
                                <p className="text-gray-600">{member.role}</p>
                              </div>
                              
                              {/* Tooltip on hover */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                {member.name} - {member.role}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progression</span>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents récents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentDocuments.map((doc, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <FileText className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.project}</p>
                      <p className="text-xs text-gray-400">
                        {doc.uploadedBy} • {doc.time}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/drive">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Voir tous les documents
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications récentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notif, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {notif.type === "deadline" && <Clock className="h-4 w-4 text-orange-500 mt-1" />}
                    {notif.type === "document" && <FileText className="h-4 w-4 text-blue-500 mt-1" />}
                    {notif.type === "validation" && <AlertCircle className="h-4 w-4 text-red-500 mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-gray-400">{notif.time}</p>
                    </div>
                  </div>
                ))}
                <Link href="/notifications">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Voir toutes les notifications
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/timeline">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Voir la timeline
                  </Button>
                </Link>
                <Link href="/drive">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Gérer les documents
                  </Button>
                </Link>
                <Link href="/journal">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Journal de chantier
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog pour créer un nouveau projet */}
        {isNewProjectDialogOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeNewProjectDialog()
              }
            }}
          >
            {/* Modal content */}
            <div 
              className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Créer un nouveau projet</h2>
                <p className="text-sm text-gray-500">Ajoutez un nouveau projet à votre portefeuille</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Nom du projet *</Label>
                  <input 
                    id="projectName" 
                    type="text"
                    placeholder="Ex: Résidence Les Jardins..." 
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="clientName">Client</Label>
                  <input 
                    id="clientName" 
                    type="text"
                    placeholder="Ex: SCI Les Jardins..." 
                    value={newProjectForm.clientName}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Date de début</Label>
                  <input 
                    id="startDate" 
                    type="date"
                    value={newProjectForm.startDate}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={closeNewProjectDialog}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={!newProjectForm.name.trim()}
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
