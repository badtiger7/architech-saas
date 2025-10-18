"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Calendar,
  Users,
  FileText,
  Download,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Search,
  Clock,
  Flag,
  MessageSquare,
  Paperclip,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useTasks } from "@/hooks/use-tasks"
import { useProjects } from "@/hooks/use-projects"
import { useMemo } from "react"

export default function JournalPage() {
  const router = useRouter()
  
  // Hooks pour la connexion à la base de données
  const emptyOptions = useMemo(() => ({}), [])
  const { tasks: dbTasks, loading, updateTask, createTask } = useTasks(emptyOptions)
  
  // TODO: Récupérer l'organizationId depuis le contexte utilisateur/session
  // Pour l'instant, on utilise l'ID hardcodé de l'organisation de test
  const organizationId = "y1dz7q6fj91e3cf0i0p7t67d"
  const { projects } = useProjects(organizationId)
  
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  
  // Convertir les tâches de la base de données au format attendu par l'UI
  const tasks = useMemo(() => {
    return dbTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      assignee: task.assignee ? {
        name: task.assignee.name,
        avatar: task.assignee.avatar,
        company: task.assignee.company
      } : { name: "Non assigné", avatar: "?", company: "" },
      project: task.projectName || "Projet non défini",
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      createdAt: task.createdAt,
      // S'assurer que tags est toujours un tableau
      tags: Array.isArray(task.tags) ? task.tags : [],
      comments: 0, // TODO: Implémenter les commentaires
      attachments: 0, // TODO: Implémenter les pièces jointes
      estimatedHours: task.estimatedHours || 0,
      completedAt: task.status === 'done' ? task.updatedAt : undefined
    }))
  }, [dbTasks])
  
  // Ancienne structure hardcodée (à supprimer ou commenter)
  /*
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Corriger les plans de façade",
      description: "Ajuster les cotes des fenêtres selon les remarques du client",
      status: "todo",
      priority: "high",
      assignee: { name: "Jean Dupont", avatar: "JD", company: "Architech" },
      project: "Résidence Les Jardins",
      dueDate: "2024-01-20",
      createdAt: "2024-01-15",
      tags: ["Plans", "Façade"],
      comments: 3,
      attachments: 2,
      estimatedHours: 8,
    },
    {
      id: 2,
      title: "Validation calculs structure",
      description: "Vérifier les calculs de charge pour la nouvelle configuration",
      status: "in-progress",
      priority: "high",
      assignee: { name: "Marie Leroy", avatar: "ML", company: "Bureau Leroy" },
      project: "Résidence Les Jardins",
      dueDate: "2024-01-18",
      createdAt: "2024-01-12",
      tags: ["Structure", "Calculs"],
      comments: 1,
      attachments: 5,
      estimatedHours: 12,
    },
    {
      id: 3,
      title: "Commander matériaux façade",
      description: "Passer commande des matériaux validés pour la façade",
      status: "todo",
      priority: "medium",
      assignee: { name: "Paul Martin", avatar: "PM", company: "Martin BTP" },
      project: "Résidence Les Jardins",
      dueDate: "2024-01-22",
      createdAt: "2024-01-14",
      tags: ["Matériaux", "Commande"],
      comments: 0,
      attachments: 1,
      estimatedHours: 4,
    },
    {
      id: 4,
      title: "Finaliser plans techniques",
      description: "Compléter les plans de réseaux et fluides",
      status: "in-progress",
      priority: "medium",
      assignee: { name: "Luc Moreau", avatar: "LM", company: "Moreau Fluides" },
      project: "Bureaux Tech Center",
      dueDate: "2024-01-25",
      createdAt: "2024-01-10",
      tags: ["Fluides", "Techniques"],
      comments: 2,
      attachments: 3,
      estimatedHours: 16,
    },
    {
      id: 5,
      title: "Préparer dossier permis",
      description: "Rassembler tous les documents pour le dépôt de permis",
      status: "todo",
      priority: "low",
      assignee: { name: "Jean Dupont", avatar: "JD", company: "Architech" },
      project: "Bureaux Tech Center",
      dueDate: "2024-01-30",
      createdAt: "2024-01-13",
      tags: ["Permis", "Administratif"],
      comments: 0,
      attachments: 0,
      estimatedHours: 6,
    },
    {
      id: 6,
      title: "Réception chantier phase 1",
      description: "Contrôle qualité et réception des travaux de gros œuvre",
      status: "done",
      priority: "high",
      assignee: { name: "Sophie Durand", avatar: "SD", company: "SCI Les Jardins" },
      project: "Résidence Les Jardins",
      dueDate: "2024-01-15",
      createdAt: "2024-01-08",
      tags: ["Réception", "Contrôle"],
      comments: 5,
      attachments: 8,
      estimatedHours: 4,
      completedAt: "2024-01-15",
    },
    {
      id: 7,
      title: "Mise à jour maquette 3D",
      description: "Intégrer les dernières modifications dans la maquette BIM",
      status: "review",
      priority: "medium",
      assignee: { name: "Claire Petit", avatar: "CP", company: "Architech" },
      project: "Villa Moderne",
      dueDate: "2024-01-19",
      createdAt: "2024-01-11",
      tags: ["BIM", "3D"],
      comments: 1,
      attachments: 2,
      estimatedHours: 10,
    },
  ])
  */

  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedAssignee, setSelectedAssignee] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // États pour le formulaire de nouvelle tâche
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeUserId: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    estimatedHours: 0,
    status: "todo" as "todo" | "in-progress" | "review" | "done",
  })

  const columns = [
    { id: "todo", title: "À faire", color: "bg-gray-100", count: tasks.filter((t) => t.status === "todo").length },
    {
      id: "in-progress",
      title: "En cours",
      color: "bg-blue-50",
      count: tasks.filter((t) => t.status === "in-progress").length,
    },
    {
      id: "review",
      title: "En révision",
      color: "bg-yellow-50",
      count: tasks.filter((t) => t.status === "review").length,
    },
    { id: "done", title: "Terminé", color: "bg-green-50", count: tasks.filter((t) => t.status === "done").length },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Flag className="h-3 w-3" />
      case "medium":
        return <Flag className="h-3 w-3" />
      case "low":
        return <Flag className="h-3 w-3" />
      default:
        return null
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const filteredTasks = tasks.filter((task) => {
    // Filtre par projet
    if (selectedProject !== "all" && task.project !== selectedProject) return false
    
    // Filtre par assigné
    if (selectedAssignee !== "all" && task.assignee.name !== selectedAssignee) return false
    
    // Filtre par recherche de texte
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = task.title?.toLowerCase().includes(query)
      const matchesDescription = task.description?.toLowerCase().includes(query)
      const matchesProject = task.project?.toLowerCase().includes(query)
      const matchesAssignee = task.assignee?.name?.toLowerCase().includes(query)
      const matchesTags = task.tags?.some(tag => tag.toLowerCase().includes(query))
      
      if (!matchesTitle && !matchesDescription && !matchesProject && !matchesAssignee && !matchesTags) {
        return false
      }
    }
    
    return true
  })

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedTask) {
      // Appeler l'API pour persister le changement dans la base de données
      await updateTask(draggedTask, { status: newStatus as any })
      setDraggedTask(null)
    }
  }

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons
    if ((e.target as HTMLElement).closest("button")) {
      return
    }
    router.push(`/journal/${taskId}`)
  }

  // TODO: Implémenter la suppression de tâche
  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      // const { deleteTask } = useTasks() sera nécessaire
      // await deleteTask(taskId)
      alert("Fonctionnalité de suppression à implémenter")
    }
  }

  // TODO: Implémenter la modification de tâche
  const handleEditTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    alert(`Édition de la tâche ${taskId} - À implémenter`)
  }

  // TODO: Implémenter l'export des tâches
  const handleExport = () => {
    alert("Fonctionnalité d'export à implémenter (CSV, PDF, Excel)")
  }

  // Gérer la création d'une nouvelle tâche
  const handleCreateTask = async () => {
    // Validation
    if (!newTaskForm.title.trim()) {
      alert("Le titre de la tâche est obligatoire")
      return
    }
    
    if (!newTaskForm.projectId) {
      alert("Veuillez sélectionner un projet")
      return
    }

    try {
      const result = await createTask({
        projectId: newTaskForm.projectId,
        title: newTaskForm.title,
        description: newTaskForm.description || undefined,
        status: newTaskForm.status,
        priority: newTaskForm.priority,
        assigneeUserId: newTaskForm.assigneeUserId || undefined,
        dueDate: newTaskForm.dueDate || undefined,
        estimatedHours: newTaskForm.estimatedHours,
        tags: [],
      })

      if (result.success) {
        // Réinitialiser le formulaire
        setNewTaskForm({
          title: "",
          description: "",
          projectId: "",
          assigneeUserId: "",
          priority: "medium",
          dueDate: "",
          estimatedHours: 0,
          status: "todo",
        })
        setIsNewTaskDialogOpen(false)
        // Afficher un message de succès (optionnel avec react-toastify plus tard)
        alert("✅ Tâche créée avec succès !")
      } else {
        alert(`❌ Erreur lors de la création : ${result.error}`)
      }
    } catch (error) {
      console.error("Erreur création tâche:", error)
      alert("❌ Erreur lors de la création de la tâche")
    }
  }

  // Ouvrir le dialogue avec un statut prédéfini (depuis une colonne)
  const openTaskDialog = (status: string) => {
    setNewTaskForm(prev => ({ ...prev, status: status as any }))
    setIsNewTaskDialogOpen(true)
  }
  
  // Afficher un loader pendant le chargement
  if (loading && dbTasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des tâches...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Journal de Chantier</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Gestion des tâches et suivi des projets</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle tâche
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle tâche</DialogTitle>
                  <DialogDescription>Ajoutez une nouvelle tâche à votre projet</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="taskTitle">Titre de la tâche *</Label>
                    <Input 
                      id="taskTitle" 
                      placeholder="Titre de la tâche..." 
                      value={newTaskForm.title}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="taskDescription">Description</Label>
                    <Textarea 
                      id="taskDescription" 
                      placeholder="Description détaillée..." 
                      rows={3}
                      value={newTaskForm.description}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taskProject">Projet *</Label>
                      <Select 
                        value={newTaskForm.projectId} 
                        onValueChange={(value) => setNewTaskForm(prev => ({ ...prev, projectId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un projet" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taskAssignee">Assigné à</Label>
                      <Select 
                        value={newTaskForm.assigneeUserId || "unassigned"} 
                        onValueChange={(value) => setNewTaskForm(prev => ({ 
                          ...prev, 
                          assigneeUserId: value === "unassigned" ? "" : value 
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Non assigné" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Non assigné</SelectItem>
                          {/* TODO: Remplacer par une vraie API users - Pour l'instant on utilise l'ID de test */}
                          <SelectItem value="user-test">Utilisateur Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="taskPriority">Priorité</Label>
                      <Select 
                        value={newTaskForm.priority} 
                        onValueChange={(value: "low" | "medium" | "high") => setNewTaskForm(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Priorité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="low">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taskDueDate">Échéance</Label>
                      <Input 
                        id="taskDueDate" 
                        type="date"
                        value={newTaskForm.dueDate}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taskHours">Heures estimées</Label>
                      <Input 
                        id="taskHours" 
                        type="number" 
                        placeholder="8"
                        value={newTaskForm.estimatedHours}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleCreateTask}
                    disabled={!newTaskForm.title.trim() || !newTaskForm.projectId}
                  >
                    Créer la tâche
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto bg-transparent"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-white rounded-lg border space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Rechercher des tâches..." 
                  className="pl-10 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tous les projets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les projets</SelectItem>
                  {/* Générer dynamiquement la liste des projets uniques depuis les tâches */}
                  {Array.from(new Set(tasks.map(t => t.project))).sort().map(project => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Toutes les personnes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les personnes</SelectItem>
                  {/* Générer dynamiquement la liste des assignés uniques depuis les tâches */}
                  {Array.from(new Set(tasks.map(t => t.assignee.name).filter(name => name !== "Non assigné"))).sort().map(assignee => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{filteredTasks.length} tâches</span>
              <span>•</span>
              <span>{filteredTasks.filter((t) => t.status === "done").length} terminées</span>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`${column.color} rounded-t-lg p-3 sm:p-4 border-b`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {column.count}
                  </Badge>
                </div>
              </div>

              {/* Column Content */}
              <div
                className={`${column.color} rounded-b-lg p-3 sm:p-4 min-h-[400px] sm:min-h-[600px] space-y-3`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {getTasksByStatus(column.id).map((task) => (
                  <Card
                    key={task.id}
                    className="bg-white hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-blue-500"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={(e) => handleTaskClick(task.id, e)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                            <span className="ml-1 capitalize">{task.priority}</span>
                          </Badge>
                          {isOverdue(task.dueDate) && task.status !== "done" && (
                            <Badge variant="destructive" className="text-xs">
                              En retard
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/journal/${task.id}`)
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleEditTask(task.id, e)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={(e) => handleDeleteTask(task.id, e)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Task Title & Description */}
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Project */}
                      <div className="text-xs text-gray-500 mb-3">
                        <span className="font-medium">{task.project}</span>
                      </div>

                      {/* Task Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-3">
                          {task.comments > 0 && (
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{task.comments}</span>
                            </div>
                          )}
                          {task.attachments > 0 && (
                            <div className="flex items-center space-x-1">
                              <Paperclip className="h-3 w-3" />
                              <span>{task.attachments}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`text-xs ${isOverdue(task.dueDate) && task.status !== "done" ? "text-red-600 font-medium" : "text-gray-500"}`}
                        >
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                        </div>

                        {/* Assignee */}
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {task.assignee.avatar}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Completion indicator for done tasks */}
                      {task.status === "done" && task.completedAt && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center space-x-2 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span>Terminé le {new Date(task.completedAt).toLocaleDateString("fr-FR")}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Add Task Button */}
                <Button
                  variant="ghost"
                  className="w-full border-2 border-dashed border-gray-300 bg-white/50 hover:bg-white/80 h-12"
                  onClick={() => openTaskDialog(column.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une tâche
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tâches totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {tasks.filter((t) => t.status === "done").length} terminées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "in-progress").length}</div>
              <p className="text-xs text-muted-foreground">
                {tasks.filter((t) => t.status === "review").length} en révision
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En retard</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "done").length}
              </div>
              <p className="text-xs text-muted-foreground">Nécessitent attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heures estimées</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter((t) => t.status !== "done").reduce((acc, task) => acc + task.estimatedHours, 0)}h
              </div>
              <p className="text-xs text-muted-foreground">Travail restant</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
