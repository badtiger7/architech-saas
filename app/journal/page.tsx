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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const { tasks: dbTasks, loading, updateTask, createTask, deleteTask } = useTasks(emptyOptions)
  
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
      projectId: task.projectId, // Garder l'ID du projet pour l'édition
      assigneeUserId: task.assigneeUserId || "", // Garder l'ID de l'assigné pour l'édition
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

  // États pour le formulaire d'édition de tâche
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTaskForm, setEditTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeUserId: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    estimatedHours: 0,
    status: "todo" as "todo" | "in-progress" | "review" | "done",
  })

  // Fonction pour fermer proprement le dialogue d'édition
  const closeEditDialog = () => {
    console.log("🔴 closeEditDialog called")
    console.log("Before: isEditTaskDialogOpen =", isEditTaskDialogOpen, "editingTaskId =", editingTaskId)
    setIsEditTaskDialogOpen(false)
    setEditingTaskId(null)
    setEditTaskForm({
      title: "",
      description: "",
      projectId: "",
      assigneeUserId: "",
      priority: "medium",
      dueDate: "",
      estimatedHours: 0,
      status: "todo",
    })
    console.log("After: isEditTaskDialogOpen should be false, editingTaskId should be null")
  }

  const columns = [
    { id: "todo", title: "À faire", count: tasks.filter((t) => t.status === "todo").length },
    {
      id: "in-progress",
      title: "En cours",
      count: tasks.filter((t) => t.status === "in-progress").length,
    },
    {
      id: "review",
      title: "En révision",
      count: tasks.filter((t) => t.status === "review").length,
    },
    { id: "done", title: "Terminé", count: tasks.filter((t) => t.status === "done").length },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="px-2 py-1 border-2 border-black text-black text-xs font-medium uppercase tracking-wide">Haute</span>
      case "medium":
        return <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium uppercase tracking-wide">Moyenne</span>
      case "low":
        return <span className="px-2 py-1 border-2 border-black/10 text-black/60 text-xs font-medium uppercase tracking-wide">Basse</span>
      default:
        return <span className="px-2 py-1 border-2 border-black/10 text-black/60 text-xs font-medium uppercase tracking-wide">-</span>
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

  // Supprimer une tâche
  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.")) {
      return
    }

    try {
      const result = await deleteTask(taskId)
      if (!result.success) {
        alert(`❌ Erreur lors de la suppression : ${result.error}`)
      }
      // La suppression de l'interface se fait automatiquement via useTasks
    } catch (error) {
      console.error("Erreur suppression tâche:", error)
      alert("❌ Erreur lors de la suppression de la tâche")
    }
  }

  // Ouvrir le dialogue d'édition avec les données de la tâche
  const handleEditTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("🟢 handleEditTask called with taskId:", taskId)
    
    // Trouver la tâche dans la liste
    const taskToEdit = tasks.find(t => t.id === taskId)
    if (!taskToEdit) {
      alert("Tâche non trouvée")
      return
    }
    
    console.log("Task found:", taskToEdit.title)
    
    // Remplir le formulaire avec les données existantes
    setEditTaskForm({
      title: taskToEdit.title,
      description: taskToEdit.description,
      projectId: taskToEdit.projectId, // Utiliser l'ID du projet directement
      assigneeUserId: taskToEdit.assigneeUserId || "", // Utiliser l'ID de l'assigné directement
      priority: taskToEdit.priority,
      dueDate: taskToEdit.dueDate,
      estimatedHours: taskToEdit.estimatedHours,
      status: taskToEdit.status,
    })
    
    setEditingTaskId(taskId)
    setIsEditTaskDialogOpen(true)
    console.log("🟢 Dialog opened - isEditTaskDialogOpen =", true, "editingTaskId =", taskId)
  }

  // Sauvegarder les modifications de la tâche
  const handleSaveTaskEdit = async () => {
    console.log("🟡 handleSaveTaskEdit called for taskId:", editingTaskId)
    if (!editingTaskId) return
    
    // Validation
    if (!editTaskForm.title.trim()) {
      alert("Le titre de la tâche est obligatoire")
      return
    }
    
    if (!editTaskForm.projectId) {
      alert("Veuillez sélectionner un projet")
      return
    }

    try {
      console.log("🟡 Calling updateTask API...")
      const result = await updateTask(editingTaskId, {
        title: editTaskForm.title,
        description: editTaskForm.description || undefined,
        status: editTaskForm.status,
        priority: editTaskForm.priority,
        assigneeUserId: editTaskForm.assigneeUserId || undefined,
        dueDate: editTaskForm.dueDate || undefined,
        estimatedHours: editTaskForm.estimatedHours,
        tags: [], // TODO: Gérer les tags
      })

      console.log("🟡 updateTask result:", result)
      if (result.success) {
        console.log("🟡 Success! Calling closeEditDialog...")
        closeEditDialog()
        // La mise à jour de l'interface se fait automatiquement via useTasks
      } else {
        alert(`❌ Erreur lors de la modification : ${result.error}`)
      }
    } catch (error) {
      console.error("Erreur modification tâche:", error)
      alert("❌ Erreur lors de la modification de la tâche")
    }
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
        // La tâche apparaît automatiquement via useTasks
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
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-black border-r-black/20 border-b-black/20 border-l-black/20 mx-auto mb-4"></div>
            <p className="text-black/60 font-light">Chargement des tâches...</p>
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

      <main className="relative max-w-7xl mx-auto px-4 md:px-12 lg:px-16 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-12 space-y-4 sm:space-y-0 border-b-2 border-black/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 text-black">
              JOURNAL
              <br />
              DE CHANTIER
            </h1>
            <div className="w-16 md:w-24 h-1 bg-black mb-4"></div>
            <p className="text-base md:text-lg text-black/60 font-light">Gestion des tâches et suivi des projets</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-black text-white hover:bg-black/90 rounded-none border-2 border-black font-medium tracking-wide">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle tâche
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-none border-2 border-black">
                <DialogHeader>
                  <DialogTitle className="font-black tracking-tighter text-black">Créer une nouvelle tâche</DialogTitle>
                  <div className="w-12 h-1 bg-black mb-4"></div>
                  <DialogDescription className="text-black/60 font-light">Ajoutez une nouvelle tâche à votre projet</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="taskTitle" className="text-sm font-medium text-black uppercase tracking-wide">Titre de la tâche *</Label>
                    <Input 
                      id="taskTitle" 
                      placeholder="Titre de la tâche..." 
                      value={newTaskForm.title}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))}
                      className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                    />
                  </div>

                  <div>
                    <Label htmlFor="taskDescription" className="text-sm font-medium text-black uppercase tracking-wide">Description</Label>
                    <Textarea 
                      id="taskDescription" 
                      placeholder="Description détaillée..." 
                      rows={3}
                      value={newTaskForm.description}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
                      className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taskProject">Projet *</Label>
                      <Select 
                        value={newTaskForm.projectId} 
                        onValueChange={(value) => setNewTaskForm(prev => ({ ...prev, projectId: value }))}
                      >
                        <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                          <SelectValue placeholder="Sélectionner un projet" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-black">
                          {projects.map(project => (
                            <SelectItem key={project.id} value={project.id} className="rounded-none hover:bg-black hover:text-white">
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
                        <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                          <SelectValue placeholder="Non assigné" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-black">
                          <SelectItem value="unassigned" className="rounded-none hover:bg-black hover:text-white">Non assigné</SelectItem>
                          <SelectItem value="user-test" className="rounded-none hover:bg-black hover:text-white">Utilisateur Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="taskPriority" className="text-sm font-medium text-black uppercase tracking-wide">Priorité</Label>
                      <Select 
                        value={newTaskForm.priority} 
                        onValueChange={(value: "low" | "medium" | "high") => setNewTaskForm(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                          <SelectValue placeholder="Priorité" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-black">
                          <SelectItem value="high" className="rounded-none hover:bg-black hover:text-white">Haute</SelectItem>
                          <SelectItem value="medium" className="rounded-none hover:bg-black hover:text-white">Moyenne</SelectItem>
                          <SelectItem value="low" className="rounded-none hover:bg-black hover:text-white">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taskDueDate" className="text-sm font-medium text-black uppercase tracking-wide">Échéance</Label>
                      <Input 
                        id="taskDueDate" 
                        type="date"
                        value={newTaskForm.dueDate}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taskHours" className="text-sm font-medium text-black uppercase tracking-wide">Heures estimées</Label>
                      <Input 
                        id="taskHours" 
                        type="number" 
                        placeholder="8"
                        value={newTaskForm.estimatedHours}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                        className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-black text-white hover:bg-black/90 rounded-none border-2 border-black font-medium tracking-wide" 
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
              className="w-full sm:w-auto rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all font-medium tracking-wide"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Édition de tâche - Modal personnalisé sans Radix UI */}
        {isEditTaskDialogOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={(e) => {
              console.log("🔵 Modal background clicked")
              if (e.target === e.currentTarget) {
                closeEditDialog()
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                console.log("🔵 Escape pressed")
                closeEditDialog()
              }
            }}
            tabIndex={0}
          >
            {/* Modal content */}
            <div 
              className="bg-white border-2 border-black p-6 md:p-8 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-2">Modifier la tâche</h2>
                <div className="w-12 h-1 bg-black mb-4"></div>
                <p className="text-sm text-black/60 font-light">Modifiez les informations de la tâche</p>
              </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label htmlFor="editTaskTitle" className="text-sm font-medium text-black uppercase tracking-wide">Titre de la tâche *</Label>
                <Input 
                  id="editTaskTitle" 
                  placeholder="Titre de la tâche..." 
                  value={editTaskForm.title}
                  onChange={(e) => setEditTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                />
              </div>

              <div>
                <Label htmlFor="editTaskDescription" className="text-sm font-medium text-black uppercase tracking-wide">Description</Label>
                <Textarea 
                  id="editTaskDescription" 
                  placeholder="Description détaillée..." 
                  rows={3}
                  value={editTaskForm.description}
                  onChange={(e) => setEditTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editTaskProject">Projet *</Label>
                  <Select 
                    value={editTaskForm.projectId} 
                    onValueChange={(value) => setEditTaskForm(prev => ({ ...prev, projectId: value }))}
                  >
                    <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-black">
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id} className="rounded-none hover:bg-black hover:text-white">
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editTaskAssignee" className="text-sm font-medium text-black uppercase tracking-wide">Assigné à</Label>
                  <Select 
                    value={editTaskForm.assigneeUserId || "unassigned"} 
                    onValueChange={(value) => setEditTaskForm(prev => ({ 
                      ...prev, 
                      assigneeUserId: value === "unassigned" ? "" : value 
                    }))}
                  >
                    <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                      <SelectValue placeholder="Non assigné" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-black">
                      <SelectItem value="unassigned" className="rounded-none hover:bg-black hover:text-white">Non assigné</SelectItem>
                      <SelectItem value="user-test" className="rounded-none hover:bg-black hover:text-white">Utilisateur Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="editTaskStatus" className="text-sm font-medium text-black uppercase tracking-wide">Statut</Label>
                  <Select 
                    value={editTaskForm.status} 
                    onValueChange={(value: "todo" | "in-progress" | "review" | "done") => setEditTaskForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-black">
                      <SelectItem value="todo" className="rounded-none hover:bg-black hover:text-white">À faire</SelectItem>
                      <SelectItem value="in-progress" className="rounded-none hover:bg-black hover:text-white">En cours</SelectItem>
                      <SelectItem value="review" className="rounded-none hover:bg-black hover:text-white">En révision</SelectItem>
                      <SelectItem value="done" className="rounded-none hover:bg-black hover:text-white">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editTaskPriority" className="text-sm font-medium text-black uppercase tracking-wide">Priorité</Label>
                  <Select 
                    value={editTaskForm.priority} 
                    onValueChange={(value: "low" | "medium" | "high") => setEditTaskForm(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-black">
                      <SelectItem value="high" className="rounded-none hover:bg-black hover:text-white">Haute</SelectItem>
                      <SelectItem value="medium" className="rounded-none hover:bg-black hover:text-white">Moyenne</SelectItem>
                      <SelectItem value="low" className="rounded-none hover:bg-black hover:text-white">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editTaskDueDate" className="text-sm font-medium text-black uppercase tracking-wide">Échéance</Label>
                  <Input 
                    id="editTaskDueDate" 
                    type="date"
                    value={editTaskForm.dueDate}
                    onChange={(e) => setEditTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                  />
                </div>
                <div>
                  <Label htmlFor="editTaskHours" className="text-sm font-medium text-black uppercase tracking-wide">Heures estimées</Label>
                  <Input 
                    id="editTaskHours" 
                    type="number" 
                    placeholder="8"
                    value={editTaskForm.estimatedHours}
                    onChange={(e) => setEditTaskForm(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                    className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-black/10">
                <Button 
                  variant="outline" 
                  onClick={closeEditDialog}
                  className="rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveTaskEdit}
                  disabled={!editTaskForm.title.trim() || !editTaskForm.projectId}
                  className="bg-black text-white hover:bg-black/90 rounded-none border-2 border-black font-medium tracking-wide disabled:opacity-50"
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 md:mb-12 p-6 border-2 border-black/10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 h-4 w-4" />
                <Input 
                  placeholder="Rechercher des tâches..." 
                  className="pl-10 w-full sm:w-64 rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-48 rounded-none border-2 border-black/10 focus:border-black">
                  <SelectValue placeholder="Tous les projets" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-black">
                  <SelectItem value="all" className="rounded-none hover:bg-black hover:text-white">Tous les projets</SelectItem>
                  {Array.from(new Set(tasks.map(t => t.project))).sort().map(project => (
                    <SelectItem key={project} value={project} className="rounded-none hover:bg-black hover:text-white">
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger className="w-full sm:w-48 rounded-none border-2 border-black/10 focus:border-black">
                  <SelectValue placeholder="Toutes les personnes" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-black">
                  <SelectItem value="all" className="rounded-none hover:bg-black hover:text-white">Toutes les personnes</SelectItem>
                  {Array.from(new Set(tasks.map(t => t.assignee.name).filter(name => name !== "Non assigné"))).sort().map(assignee => (
                    <SelectItem key={assignee} value={assignee} className="rounded-none hover:bg-black hover:text-white">
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-black/60 font-light">
              <span>{filteredTasks.length} tâches</span>
              <span>•</span>
              <span>{filteredTasks.filter((t) => t.status === "done").length} terminées</span>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 mb-8 md:mb-12">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col bg-white">
              {/* Column Header */}
              <div className="p-4 md:p-6 border-b-2 border-black/10 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-black text-base md:text-lg tracking-tighter uppercase">{column.title}</h3>
                  <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium">
                    {column.count}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div
                className="p-3 sm:p-4 md:p-6 min-h-[400px] sm:min-h-[600px] space-y-3 bg-white"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border-2 border-black/10 hover:border-black/20 transition-all cursor-pointer group"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={(e) => handleTaskClick(task.id, e)}
                  >
                    <div className="p-4 md:p-5">
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(task.priority)}
                          {isOverdue(task.dueDate) && task.status !== "done" && (
                            <span className="px-2 py-1 border-2 border-black text-black text-xs font-medium uppercase tracking-wide">
                              En retard
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-none border-2 border-transparent hover:border-black/20 h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4 text-black/60" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-none border-2 border-black">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/journal/${task.id}`)
                                }}
                                className="rounded-none hover:bg-black hover:text-white"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => handleEditTask(task.id, e)}
                                className="rounded-none hover:bg-black hover:text-white"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-black rounded-none hover:bg-black hover:text-white"
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
                      <h4 className="font-black text-black mb-2 line-clamp-2 text-base">{task.title}</h4>
                      <p className="text-sm text-black/60 mb-3 line-clamp-2 font-light">{task.description}</p>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 border-2 border-black/10 text-black/60 text-xs font-medium uppercase tracking-wide">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Project */}
                      <div className="text-xs text-black/50 mb-3 font-light">
                        <span className="font-medium">{task.project}</span>
                      </div>

                      {/* Task Meta */}
                      <div className="flex items-center justify-between text-xs text-black/50 mb-3 font-light">
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
                        <div className={`text-xs font-light ${isOverdue(task.dueDate) && task.status !== "done" ? "text-black font-medium" : "text-black/60"}`}>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                        </div>

                        {/* Assignee */}
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6 border-2 border-black/10 rounded-none">
                            <AvatarFallback className="text-xs bg-black text-white rounded-none font-black">
                              {task.assignee.avatar}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Completion indicator for done tasks */}
                      {task.status === "done" && task.completedAt && (
                        <div className="mt-3 pt-3 border-t border-black/10">
                          <div className="flex items-center space-x-2 text-xs text-black/60 font-light">
                            <CheckCircle className="h-3 w-3" />
                            <span>Terminé le {new Date(task.completedAt).toLocaleDateString("fr-FR")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Task Button */}
                <Button
                  variant="ghost"
                  className="w-full border-2 border-dashed border-black/20 hover:border-black hover:bg-black hover:text-white transition-all h-12 rounded-none font-medium tracking-wide"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-medium text-black/60 uppercase tracking-wide">Tâches totales</span>
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-black/40 group-hover:text-black transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-black tracking-tighter">{tasks.length}</div>
            <p className="text-xs text-black/50 font-light mt-2">
              {tasks.filter((t) => t.status === "done").length} terminées
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-medium text-black/60 uppercase tracking-wide">En cours</span>
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-black/40 group-hover:text-black transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-black tracking-tighter">{tasks.filter((t) => t.status === "in-progress").length}</div>
            <p className="text-xs text-black/50 font-light mt-2">
              {tasks.filter((t) => t.status === "review").length} en révision
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-medium text-black/60 uppercase tracking-wide">En retard</span>
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-black/40 group-hover:text-black transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-black tracking-tighter">
              {tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "done").length}
            </div>
            <p className="text-xs text-black/50 font-light mt-2">Nécessitent attention</p>
          </div>

          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-medium text-black/60 uppercase tracking-wide">Heures estimées</span>
              <Users className="h-4 w-4 md:h-5 md:w-5 text-black/40 group-hover:text-black transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-black tracking-tighter">
              {tasks.filter((t) => t.status !== "done").reduce((acc, task) => acc + task.estimatedHours, 0)}h
            </div>
            <p className="text-xs text-black/50 font-light mt-2">Travail restant</p>
          </div>
        </div>
      </main>
    </div>
  )
}
