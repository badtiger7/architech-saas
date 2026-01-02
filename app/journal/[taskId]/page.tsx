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
        return "text-sand-800 bg-sand-100 border border-sand-300"
      case "medium":
        return "text-sand-700 bg-sand-50 border border-sand-200"
      case "low":
        return "text-sand-600 bg-sand-50 border border-sand-200"
      default:
        return "text-sand-600 bg-sand-50 border border-sand-200"
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
                <Badge className={`text-xs rounded-md ${getPriorityColor(task.priority)}`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
                </Badge>
                <Badge variant="outline" className="border border-sand-200 bg-sand-50 text-sand-700 rounded-md">{getStatusLabel(task.status)}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-black mb-2">{task.title}</h1>
              <p className="text-sm text-sand-600 font-light">
                Créée le {new Date(task.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit} className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg border-2 border-red-200" onClick={handleDelete}>
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
              <Card className="border border-sand-200">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="border border-sand-200 bg-sand-50 text-sand-700 rounded-md">
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
                    <Avatar className="h-10 w-10 border border-sand-200">
                      <AvatarFallback className="bg-sand-500 text-white rounded-full">
                        {task.assignee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-black">{task.assignee.name}</p>
                      <p className="text-xs text-sand-600 font-light">{task.assignee.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sand-600 text-sm font-light">Non assigné</p>
                )}
              </CardContent>
            </Card>

            {/* Due Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Échéance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-black">
                  <Calendar className="h-4 w-4 text-sand-400" />
                  <span className="font-light">{new Date(task.dueDate).toLocaleDateString("fr-FR")}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estimated Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Temps estimé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-black">
                  <Clock className="h-4 w-4 text-sand-400" />
                  <span className="font-light">{task.estimatedHours} heures</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog d'édition */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl rounded-lg border-2 border-sand-200">
            <DialogHeader>
              <DialogTitle className="font-black tracking-tighter text-black">Modifier la tâche</DialogTitle>
              <div className="w-12 h-0.5 bg-sand-500 mb-3"></div>
              <DialogDescription className="text-sand-600 font-light">Modifiez les informations de la tâche</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTitle" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Titre de la tâche *</Label>
                <Input 
                  id="editTitle" 
                  placeholder="Titre de la tâche..." 
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="editDescription" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Description</Label>
                <Textarea 
                  id="editDescription" 
                  placeholder="Description détaillée..." 
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editProject" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Projet *</Label>
                  <Select 
                    value={editForm.projectId} 
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, projectId: value }))}
                  >
                    <SelectTrigger className="rounded-lg border-2 border-sand-200 focus:border-sand-500">
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-2 border-sand-200">
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id} className="rounded-lg hover:bg-sand-500 hover:text-white">
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editAssignee" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Assigné à</Label>
                  <Select 
                    value={editForm.assigneeUserId || "unassigned"} 
                    onValueChange={(value) => setEditForm(prev => ({ 
                      ...prev, 
                      assigneeUserId: value === "unassigned" ? "" : value 
                    }))}
                  >
                    <SelectTrigger className="rounded-lg border-2 border-sand-200 focus:border-sand-500">
                      <SelectValue placeholder="Non assigné" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-2 border-sand-200">
                      <SelectItem value="unassigned" className="rounded-lg hover:bg-sand-500 hover:text-white">Non assigné</SelectItem>
                      <SelectItem value="user-test" className="rounded-lg hover:bg-sand-500 hover:text-white">Utilisateur Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="editStatus" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Statut</Label>
                  <Select 
                    value={editForm.status} 
                    onValueChange={(value: "todo" | "in-progress" | "review" | "done") => setEditForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="rounded-lg border-2 border-sand-200 focus:border-sand-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-2 border-sand-200">
                      <SelectItem value="todo" className="rounded-lg hover:bg-sand-500 hover:text-white">À faire</SelectItem>
                      <SelectItem value="in-progress" className="rounded-lg hover:bg-sand-500 hover:text-white">En cours</SelectItem>
                      <SelectItem value="review" className="rounded-lg hover:bg-sand-500 hover:text-white">En révision</SelectItem>
                      <SelectItem value="done" className="rounded-lg hover:bg-sand-500 hover:text-white">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editPriority" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Priorité</Label>
                  <Select 
                    value={editForm.priority} 
                    onValueChange={(value: "low" | "medium" | "high") => setEditForm(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="rounded-lg border-2 border-sand-200 focus:border-sand-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-2 border-sand-200">
                      <SelectItem value="high" className="rounded-lg hover:bg-sand-500 hover:text-white">Haute</SelectItem>
                      <SelectItem value="medium" className="rounded-lg hover:bg-sand-500 hover:text-white">Moyenne</SelectItem>
                      <SelectItem value="low" className="rounded-lg hover:bg-sand-500 hover:text-white">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editDueDate" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Échéance</Label>
                  <Input 
                    id="editDueDate" 
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="editHours" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Heures estimées</Label>
                  <Input 
                    id="editHours" 
                    type="number" 
                    placeholder="8"
                    value={editForm.estimatedHours}
                    onChange={(e) => setEditForm(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                    className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-sand-200">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  disabled={!editForm.title.trim() || !editForm.projectId}
                  className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500"
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
