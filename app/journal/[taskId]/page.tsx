"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Flag,
  User,
  Edit,
  Trash2,
  MessageSquare,
  Paperclip,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useApi } from "@/lib/api/client"
import { useProjects } from "@/hooks/use-projects"

interface TaskDetailPageProps {
  params: Promise<{ taskId: string }>
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter()
  const api = useApi()
  const [taskId, setTaskId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // États pour le formulaire d'édition
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeUserId: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    estimatedHours: 0,
    status: "todo" as "todo" | "in-progress" | "review" | "done",
  })

  const organizationId = "y1dz7q6fj91e3cf0i0p7t67d"
  const { projects } = useProjects(organizationId)

  // Unwrap params (Next.js 15) and fetch task
  useEffect(() => {
    params.then(async (p) => {
      setTaskId(p.taskId)
      await fetchTask(p.taskId)
    })
  }, [params])

  const fetchTask = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.tasks.get(id)
      if (response.success && response.data) {
        setTask(response.data)
      } else {
        setError(response.error || "Tâche non trouvée")
      }
    } catch (err) {
      setError("Erreur lors du chargement de la tâche")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    if (!task) return
    
    setEditForm({
      title: task.title,
      description: task.description || "",
      projectId: task.projectId,
      assigneeUserId: task.assigneeUserId || "",
      priority: task.priority,
      dueDate: task.dueDate || "",
      estimatedHours: task.estimatedHours || 0,
      status: task.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!taskId) return
    
    if (!editForm.title.trim()) {
      alert("Le titre est obligatoire")
      return
    }

    if (!editForm.projectId) {
      alert("Veuillez sélectionner un projet")
      return
    }

    try {
      const response = await api.tasks.update(taskId, {
        title: editForm.title,
        description: editForm.description || undefined,
        status: editForm.status,
        priority: editForm.priority,
        assigneeUserId: editForm.assigneeUserId || undefined,
        dueDate: editForm.dueDate || undefined,
        estimatedHours: editForm.estimatedHours,
        tags: task.tags || [],
      })

      if (response.success) {
        setIsEditDialogOpen(false)
        await fetchTask(taskId) // Recharger les données
        alert("✅ Tâche modifiée avec succès !")
      } else {
        alert(`❌ Erreur : ${response.error}`)
      }
    } catch (err) {
      alert("❌ Erreur lors de la modification")
    }
  }

  const handleDelete = async () => {
    if (!taskId) return
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      return
    }

    try {
      const response = await api.tasks.delete(taskId)
      if (response.success) {
        alert("✅ Tâche supprimée")
        router.push("/journal")
      } else {
        alert(`❌ Erreur : ${response.error}`)
      }
    } catch (err) {
      alert("❌ Erreur lors de la suppression")
    }
  }

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "À faire"
      case "in-progress":
        return "En cours"
      case "review":
        return "En révision"
      case "done":
        return "Terminé"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Tâche non trouvée"}</p>
            <Button onClick={() => router.push("/journal")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au journal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/journal")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au journal
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
                </Badge>
                <Badge variant="outline">{getStatusLabel(task.status)}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <p className="text-sm text-gray-500">
                Créée le {new Date(task.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </CardContent>
            </Card>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Commentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm">Aucun commentaire pour le moment</p>
                {/* TODO: Add comment form and list */}
              </CardContent>
            </Card>

            {/* Attachments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Paperclip className="h-5 w-5 mr-2" />
                  Pièces jointes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm">Aucune pièce jointe</p>
                {/* TODO: Add attachment upload and list */}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Projet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{task.projectName || task.project || "Non défini"}</p>
              </CardContent>
            </Card>

            {/* Assignee */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assigné à</CardTitle>
              </CardHeader>
              <CardContent>
                {task.assignee ? (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {task.assignee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{task.assignee.name}</p>
                      <p className="text-xs text-gray-500">{task.assignee.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Non assigné</p>
                )}
              </CardContent>
            </Card>

            {/* Due Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Échéance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(task.dueDate).toLocaleDateString("fr-FR")}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estimated Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Temps estimé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock className="h-4 w-4" />
                  <span>{task.estimatedHours} heures</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog d'édition */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la tâche</DialogTitle>
              <DialogDescription>Modifiez les informations de la tâche</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Titre de la tâche *</Label>
                <Input 
                  id="editTitle" 
                  placeholder="Titre de la tâche..." 
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea 
                  id="editDescription" 
                  placeholder="Description détaillée..." 
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editProject">Projet *</Label>
                  <Select 
                    value={editForm.projectId} 
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, projectId: value }))}
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
                  <Label htmlFor="editAssignee">Assigné à</Label>
                  <Select 
                    value={editForm.assigneeUserId || "unassigned"} 
                    onValueChange={(value) => setEditForm(prev => ({ 
                      ...prev, 
                      assigneeUserId: value === "unassigned" ? "" : value 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Non assigné" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Non assigné</SelectItem>
                      <SelectItem value="user-test">Utilisateur Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="editStatus">Statut</Label>
                  <Select 
                    value={editForm.status} 
                    onValueChange={(value: "todo" | "in-progress" | "review" | "done") => setEditForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">À faire</SelectItem>
                      <SelectItem value="in-progress">En cours</SelectItem>
                      <SelectItem value="review">En révision</SelectItem>
                      <SelectItem value="done">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editPriority">Priorité</Label>
                  <Select 
                    value={editForm.priority} 
                    onValueChange={(value: "low" | "medium" | "high") => setEditForm(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editDueDate">Échéance</Label>
                  <Input 
                    id="editDueDate" 
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editHours">Heures estimées</Label>
                  <Input 
                    id="editHours" 
                    type="number" 
                    placeholder="8"
                    value={editForm.estimatedHours}
                    onChange={(e) => setEditForm(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  disabled={!editForm.title.trim() || !editForm.projectId}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
