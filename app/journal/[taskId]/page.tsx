"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Flag,
  MessageSquare,
  Edit,
  Save,
  X,
  Download,
  Eye,
  Plus,
  Building,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  // Mock task data - in real app, fetch based on taskId
  const [task, setTask] = useState({
    id: Number.parseInt(params.taskId),
    title: "Corriger les plans de façade",
    description:
      "Ajuster les cotes des fenêtres selon les remarques du client. Il faut revoir l'ensemble des ouvertures de la façade sud et s'assurer que les dimensions respectent les normes en vigueur.",
    status: "todo",
    priority: "high",
    assignee: { name: "Jean Dupont", avatar: "JD", company: "Architech" },
    project: "Résidence Les Jardins",
    dueDate: "2024-01-20",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    tags: ["Plans", "Façade"],
    comments: [
      {
        id: 1,
        author: { name: "Marie Leroy", avatar: "ML" },
        content: "Les cotes des fenêtres du RDC ne correspondent pas aux spécifications du client.",
        createdAt: "2024-01-16T10:30:00",
      },
      {
        id: 2,
        author: { name: "Jean Dupont", avatar: "JD" },
        content: "J'ai pris note, je vais corriger cela aujourd'hui.",
        createdAt: "2024-01-16T14:15:00",
      },
      {
        id: 3,
        author: { name: "Paul Martin", avatar: "PM" },
        content: "N'oubliez pas de vérifier aussi les linteaux.",
        createdAt: "2024-01-16T16:45:00",
      },
    ],
    attachments: [
      {
        id: 1,
        name: "Plan_Facade_Sud_v2.dwg",
        size: "2.4 MB",
        type: "dwg",
        uploadedBy: "Jean Dupont",
        uploadedAt: "2024-01-15T09:00:00",
      },
      {
        id: 2,
        name: "Remarques_Client.pdf",
        size: "856 KB",
        type: "pdf",
        uploadedBy: "Marie Leroy",
        uploadedAt: "2024-01-16T08:30:00",
      },
    ],
    estimatedHours: 8,
    actualHours: 3,
    watchers: [
      { name: "Marie Leroy", avatar: "ML" },
      { name: "Paul Martin", avatar: "PM" },
      { name: "Sophie Durand", avatar: "SD" },
    ],
  })

  const [newComment, setNewComment] = useState("")
  const [editedTask, setEditedTask] = useState(task)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "text-gray-600 bg-gray-100"
      case "in-progress":
        return "text-blue-600 bg-blue-100"
      case "review":
        return "text-yellow-600 bg-yellow-100"
      case "done":
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

  const handleSave = () => {
    setTask(editedTask)
    setIsEditing(false)
    // In real app, save to backend
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: task.comments.length + 1,
        author: { name: "Utilisateur Actuel", avatar: "UA" },
        content: newComment,
        createdAt: new Date().toISOString(),
      }
      setTask({ ...task, comments: [...task.comments, comment] })
      setNewComment("")
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄"
      case "dwg":
        return "📐"
      case "jpg":
      case "png":
        return "🖼️"
      default:
        return "📎"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Détail de la tâche</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">#{task.id}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editedTask.title}
                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                        className="text-xl font-semibold mb-2"
                      />
                    ) : (
                      <CardTitle className="text-xl">{task.title}</CardTitle>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge className={`${getPriorityColor(task.priority)}`}>
                      <Flag className="h-3 w-3 mr-1" />
                      {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
                    </Badge>
                    <Badge className={`${getStatusColor(task.status)}`}>{getStatusLabel(task.status)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                      rows={4}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Projet</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{task.project}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Assigné à</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {task.assignee.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-600">{task.assignee.name}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Échéance</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedTask.dueDate}
                        onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{new Date(task.dueDate).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Temps estimé</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedTask.estimatedHours}
                        onChange={(e) =>
                          setEditedTask({ ...editedTask, estimatedHours: Number.parseInt(e.target.value) })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{task.estimatedHours}h</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Temps passé</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{task.actualHours}h</span>
                    </div>
                  </div>
                </div>

                {task.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pièces jointes ({task.attachments.length})</CardTitle>
                  <Button size="sm" disabled>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getFileIcon(attachment.type)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{attachment.name}</p>
                          <p className="text-sm text-gray-500">
                            {attachment.size} • Ajouté par {attachment.uploadedBy} •{" "}
                            {new Date(attachment.uploadedAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" disabled>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commentaires ({task.comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {comment.author.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString("fr-FR")} à{" "}
                          {new Date(comment.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">UA</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Ajouter un commentaire..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Commenter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statut et Priorité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  {isEditing ? (
                    <Select
                      value={editedTask.status}
                      onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">À faire</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="review">En révision</SelectItem>
                        <SelectItem value="done">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${getStatusColor(task.status)} mt-1`}>{getStatusLabel(task.status)}</Badge>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Priorité</Label>
                  {isEditing ? (
                    <Select
                      value={editedTask.priority}
                      onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="low">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${getPriorityColor(task.priority)} mt-1`}>
                      <Flag className="h-3 w-3 mr-1" />
                      {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Watchers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Observateurs ({task.watchers.length})</CardTitle>
                  <Button size="sm" variant="outline" disabled>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.watchers.map((watcher, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">{watcher.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-gray-900">{watcher.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Créée le</Label>
                  <p className="text-gray-600 mt-1">{new Date(task.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Dernière modification</Label>
                  <p className="text-gray-600 mt-1">{new Date(task.updatedAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Progression</Label>
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {task.actualHours}h / {task.estimatedHours}h
                      </span>
                      <span>{Math.round((task.actualHours / task.estimatedHours) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
