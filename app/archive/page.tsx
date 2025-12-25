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
        return <span className="px-3 py-1 bg-black text-white text-xs font-medium uppercase tracking-wide">En cours</span>
      case "Terminé":
        return <span className="px-3 py-1 border-2 border-black/20 text-black text-xs font-medium uppercase tracking-wide">Terminé</span>
      case "En attente":
        return <span className="px-3 py-1 border-2 border-black/10 text-black/60 text-xs font-medium uppercase tracking-wide">En attente</span>
      case "Suspendu":
        return <span className="px-3 py-1 border-2 border-black text-black text-xs font-medium uppercase tracking-wide">Suspendu</span>
      default:
        return <span className="px-3 py-1 border-2 border-black/10 text-black/60 text-xs font-medium uppercase tracking-wide">{status}</span>
    }
  }

  const getProgressColor = (progress: number) => {
    return "bg-black"
  }

  const totalStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "En cours").length,
    completedProjects: projects.filter((p) => p.status === "Terminé").length,
    totalDocuments: projects.reduce((sum, p) => sum + p.totalDocuments, 0),
    totalVersions: projects.reduce((sum, p) => sum + p.totalVersions, 0),
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
              ARCHIVAGE
              <br />
              & HISTORIQUE
            </h1>
            <div className="w-16 md:w-24 h-1 bg-black mb-4"></div>
            <p className="text-base md:text-lg text-black/60 font-light">Gestion des projets et historique des documents</p>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-black/10 mb-8 md:mb-12">
          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-black/60 uppercase tracking-wide mb-1">Projets totaux</p>
                <p className="text-2xl md:text-3xl font-black text-black tracking-tighter">{totalStats.totalProjects}</p>
              </div>
              <Building2 className="h-6 w-6 md:h-8 md:w-8 text-black/40 group-hover:text-black transition-colors" />
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-black/60 uppercase tracking-wide mb-1">En cours</p>
                <p className="text-2xl md:text-3xl font-black text-black tracking-tighter">{totalStats.activeProjects}</p>
              </div>
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-black/40 group-hover:text-black transition-colors" />
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-black/60 uppercase tracking-wide mb-1">Terminés</p>
                <p className="text-2xl md:text-3xl font-black text-black tracking-tighter">{totalStats.completedProjects}</p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-black/40 group-hover:text-black transition-colors" />
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-black/60 uppercase tracking-wide mb-1">Documents</p>
                <p className="text-2xl md:text-3xl font-black text-black tracking-tighter">{totalStats.totalDocuments}</p>
              </div>
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-black/40 group-hover:text-black transition-colors" />
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 border-2 border-transparent hover:border-black/10 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-black/60 uppercase tracking-wide mb-1">Versions</p>
                <p className="text-2xl md:text-3xl font-black text-black tracking-tighter">{totalStats.totalVersions}</p>
              </div>
              <History className="h-6 w-6 md:h-8 md:w-8 text-black/40 group-hover:text-black transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-black/10">
          {/* Liste des projets */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8">
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-2">Projets archivés</h2>
                  <div className="w-12 md:w-16 h-1 bg-black"></div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 h-4 w-4" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-10 w-full sm:w-64 rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 rounded-none border-2 border-black/10 focus:border-black">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-black">
                      <SelectItem value="all" className="rounded-none hover:bg-black hover:text-white">Tous les statuts</SelectItem>
                      <SelectItem value="En cours" className="rounded-none hover:bg-black hover:text-white">En cours</SelectItem>
                      <SelectItem value="Terminé" className="rounded-none hover:bg-black hover:text-white">Terminé</SelectItem>
                      <SelectItem value="En attente" className="rounded-none hover:bg-black hover:text-white">En attente</SelectItem>
                      <SelectItem value="Suspendu" className="rounded-none hover:bg-black hover:text-white">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="border-2 border-black/10 p-4 md:p-6 hover:border-black/20 cursor-pointer transition-all group"
                  onClick={() => router.push(`/archive/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-black text-lg md:text-xl text-black tracking-tighter group-hover:text-black transition-colors">
                          {project.name}
                        </h3>
                        <ExternalLink className="h-4 w-4 text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-black/60 mb-3 font-light">{project.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-black/50 font-light">
                        <span>{project.client}</span>
                        <span>•</span>
                        <span>{project.location}</span>
                        <span>•</span>
                        <span>{project.totalDocuments} documents</span>
                        <span>•</span>
                        <span>{project.totalVersions} versions</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      {getStatusBadge(project.status)}
                      <div className="text-xs text-black/50 font-light">{project.progress}% terminé</div>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="w-full bg-black/10 h-1">
                      <div
                        className={`h-1 transition-all duration-300 ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-black/50 font-light gap-2">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
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
                <div className="text-center py-12 md:py-16 border-2 border-black/10 p-8">
                  <Building2 className="h-16 w-16 text-black/40 mx-auto mb-4" />
                  <p className="text-black font-medium text-lg mb-2">Aucun projet trouvé</p>
                  <p className="text-black/50 font-light">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar avec activité récente */}
          <div className="bg-white p-6 md:p-8 space-y-8 lg:order-last order-first">
            <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black mb-4">Activité récente</h3>
              <div className="w-12 md:w-16 h-1 bg-black mb-6"></div>
              <p className="text-sm text-black/60 font-light mb-6">Dernières actions sur les documents</p>
              <div className="space-y-4 md:space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-black/10 last:border-0">
                    <div className="flex-shrink-0 mt-1">
                      {activity.action === "Téléchargement" && <Download className="h-4 w-4 text-black/60" />}
                      {activity.action === "Consultation" && <Eye className="h-4 w-4 text-black/60" />}
                      {activity.action === "Validation" && <CheckCircle className="h-4 w-4 text-black/60" />}
                      {activity.action === "Upload" && <FileText className="h-4 w-4 text-black/60" />}
                      {activity.action === "Archivage" && <Archive className="h-4 w-4 text-black/60" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black mb-1">{activity.action}</p>
                      <p className="text-sm text-black/60 truncate font-light">{activity.document}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Avatar className="w-5 h-5 border-2 border-black/10 rounded-none">
                          <AvatarFallback className="text-xs bg-black text-white rounded-none font-black">
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-black/50 font-light">{activity.user}</span>
                        <span className="text-xs text-black/30">•</span>
                        <span className="text-xs text-black/50 font-light">{activity.time}</span>
                      </div>
                      <p className="text-xs text-black/40 font-light mt-1">{activity.project}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black mb-4">Actions rapides</h3>
              <div className="w-12 md:w-16 h-1 bg-black mb-6"></div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all font-medium tracking-wide" disabled>
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver automatiquement
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all font-medium tracking-wide" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter l'historique
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all font-medium tracking-wide" disabled>
                  <Clock className="h-4 w-4 mr-2" />
                  Planifier archivage
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
