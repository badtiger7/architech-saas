"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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

interface TaskDetailPageProps {
  params: Promise<{ taskId: string }>
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter()
  const [taskId, setTaskId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Unwrap params (Next.js 15)
  useEffect(() => {
    params.then((p) => {
      setTaskId(p.taskId)
      setLoading(false)
    })
  }, [params])

  // Mock task data - in real app, fetch based on taskId
  const task = {
    id: taskId,
    title: "Corriger les plans de façade",
    description:
      "Ajuster les cotes des fenêtres selon les remarques du client. Il faut revoir l'ensemble des ouvertures de la façade sud et s'assurer que les dimensions respectent les normes en vigueur.",
    status: "in-progress",
    priority: "high",
    assignee: { name: "Jean Dupont", avatar: "JD", email: "jean.dupont@architech.com" },
    project: "Résidence Les Jardins",
    dueDate: "2024-01-20",
    createdAt: "2024-01-15",
    estimatedHours: 8,
    tags: ["Plans", "Façade"],
    comments: [],
    attachments: [],
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
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
            {task.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
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
                  Commentaires ({task.comments.length})
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
                  Pièces jointes ({task.attachments.length})
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
                <p className="font-medium">{task.project}</p>
              </CardContent>
            </Card>

            {/* Assignee */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assigné à</CardTitle>
              </CardHeader>
              <CardContent>
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
      </main>
    </div>
  )
}
