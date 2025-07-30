"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  History,
  Download,
  Eye,
  Search,
  Filter,
  Archive,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  ExternalLink,
  Building2,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function ArchivePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const projects = [
    {
      id: "jardins",
      name: "Résidence Les Jardins",
      description: "Projet résidentiel de 45 logements avec espaces verts",
      status: "En cours",
      startDate: "2023-06-01",
      endDate: "2024-08-30",
      progress: 75,
      totalDocuments: 127,
      totalVersions: 342,
      lastActivity: "2024-01-15T10:30:00",
      team: ["Jean Dupont", "Marie Leroy", "Paul Leroy"],
      client: "Immobilière des Jardins",
      location: "Lyon, France",
    },
    {
      id: "tech-center",
      name: "Bureaux Tech Center",
      description: "Complexe de bureaux moderne de 8000m² avec parking",
      status: "Terminé",
      startDate: "2023-09-15",
      endDate: "2024-01-20",
      progress: 100,
      totalDocuments: 89,
      totalVersions: 198,
      lastActivity: "2024-01-20T16:45:00",
      team: ["Marie Leroy", "Paul Leroy"],
      client: "Tech Solutions SA",
      location: "Paris, France",
    },
    {
      id: "villa-moderne",
      name: "Villa Moderne",
      description: "Villa contemporaine de 350m² avec piscine",
      status: "En cours",
      startDate: "2024-01-10",
      endDate: "2024-06-15",
      progress: 45,
      totalDocuments: 56,
      totalVersions: 134,
      lastActivity: "2024-01-13T09:45:00",
      team: ["Jean Dupont", "Paul Leroy"],
      client: "Famille Martin",
      location: "Nice, France",
    },
    {
      id: "centre-commercial",
      name: "Centre Commercial Horizon",
      description: "Centre commercial de 15000m² avec 80 boutiques",
      status: "En attente",
      startDate: "2024-03-01",
      endDate: "2025-12-31",
      progress: 15,
      totalDocuments: 23,
      totalVersions: 45,
      lastActivity: "2024-01-10T14:20:00",
      team: ["Marie Leroy", "Jean Dupont"],
      client: "Retail Group",
      location: "Marseille, France",
    },
  ]

  const activities = [
    {
      id: 1,
      action: "Téléchargement",
      document: "Plans Facade v2.3",
      user: "Marie Leroy",
      time: "Il y a 2h",
      project: "Résidence Les Jardins",
    },
    {
      id: 2,
      action: "Consultation",
      document: "Rapport Structure v1.5",
      user: "Jean Dupont",
      time: "Il y a 3h",
      project: "Bureaux Tech Center",
    },
    {
      id: 3,
      action: "Validation",
      document: "Plan Masse v3.0",
      user: "Paul Leroy",
      time: "Il y a 5h",
      project: "Villa Moderne",
    },
    {
      id: 4,
      action: "Upload",
      document: "Plans Facade v2.3",
      user: "Jean Dupont",
      time: "Hier",
      project: "Résidence Les Jardins",
    },
    {
      id: 5,
      action: "Archivage",
      document: "Dossier APD complet",
      user: "Marie Leroy",
      time: "Il y a 2 jours",
      project: "Bureaux Tech Center",
    },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "Terminé":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>
      case "En attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "Suspendu":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-yellow-500"
    return "bg-red-500"
  }

  const totalStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "En cours").length,
    completedProjects: projects.filter((p) => p.status === "Terminé").length,
    totalDocuments: projects.reduce((sum, p) => sum + p.totalDocuments, 0),
    totalVersions: projects.reduce((sum, p) => sum + p.totalVersions, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Archivage & Historique</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Gestion des projets et historique des documents</p>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Projets totaux</p>
                  <p className="text-lg font-semibold">{totalStats.totalProjects}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En cours</p>
                  <p className="text-lg font-semibold">{totalStats.activeProjects}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terminés</p>
                  <p className="text-lg font-semibold">{totalStats.completedProjects}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-lg font-semibold">{totalStats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Versions</p>
                  <p className="text-lg font-semibold">{totalStats.totalVersions}</p>
                </div>
                <History className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Liste des projets */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <CardTitle className="text-lg sm:text-xl">Projets archivés</CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher..."
                        className="pl-10 w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Suspendu">Suspendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:border-blue-300 hover:shadow-md group"
                    onClick={() => router.push(`/archive/${project.id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-lg group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h3>
                          <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{project.client}</span>
                          <span>•</span>
                          <span>{project.location}</span>
                          <span>•</span>
                          <span>{project.totalDocuments} documents</span>
                          <span>•</span>
                          <span>{project.totalVersions} versions</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(project.status)}
                        <div className="text-xs text-gray-500">{project.progress}% terminé</div>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {project.team.length} contributeur{project.team.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs">Dernière activité: {formatDate(project.lastActivity)}</div>
                    </div>
                  </div>
                ))}

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Aucun projet trouvé</p>
                    <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec activité récente */}
          <div className="space-y-6 lg:order-last order-first">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
                <CardDescription>Dernières actions sur les documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.action === "Téléchargement" && <Download className="h-4 w-4 text-blue-500" />}
                      {activity.action === "Consultation" && <Eye className="h-4 w-4 text-green-500" />}
                      {activity.action === "Validation" && <CheckCircle className="h-4 w-4 text-purple-500" />}
                      {activity.action === "Upload" && <FileText className="h-4 w-4 text-orange-500" />}
                      {activity.action === "Archivage" && <Archive className="h-4 w-4 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.document}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-xs">
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{activity.project}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver automatiquement
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter l'historique
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Clock className="h-4 w-4 mr-2" />
                  Planifier archivage
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
