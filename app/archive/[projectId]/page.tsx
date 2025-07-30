"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  History,
  Download,
  Eye,
  MoreVertical,
  Search,
  Filter,
  RotateCcw,
  Archive,
  CheckCircle,
  ArrowLeft,
  Folder,
  File,
  Calendar,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function ProjectArchivePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Données simulées pour le projet
  const projectData = {
    jardins: {
      name: "Résidence Les Jardins",
      description: "Projet résidentiel de 45 logements",
      startDate: "2023-06-01",
      status: "En cours",
      totalDocuments: 127,
      totalVersions: 342,
    },
    "tech-center": {
      name: "Bureaux Tech Center",
      description: "Complexe de bureaux de 8000m²",
      startDate: "2023-09-15",
      status: "Terminé",
      totalDocuments: 89,
      totalVersions: 198,
    },
    "villa-moderne": {
      name: "Villa Moderne",
      description: "Villa contemporaine de 350m²",
      startDate: "2024-01-10",
      status: "En cours",
      totalDocuments: 56,
      totalVersions: 134,
    },
  }

  const project = projectData[projectId as keyof typeof projectData]

  const documents = [
    {
      id: 1,
      name: "Plans Facade",
      type: "dwg",
      folder: "Plans Architecturaux",
      currentVersion: "v2.3",
      totalVersions: 4,
      lastModified: "2024-01-15T10:30:00",
      size: "2.4 MB",
      author: "Jean Dupont",
      status: "current",
      versions: [
        {
          version: "v2.3",
          date: "2024-01-15T10:30:00",
          author: "Jean Dupont",
          status: "current",
          changes: "Correction des cotes de fenêtres",
          size: "2.4 MB",
        },
        {
          version: "v2.2",
          date: "2024-01-12T14:20:00",
          author: "Marie Leroy",
          status: "archived",
          changes: "Ajout des détails de balcons",
          size: "2.3 MB",
        },
        {
          version: "v2.1",
          date: "2024-01-10T09:15:00",
          author: "Jean Dupont",
          status: "archived",
          changes: "Mise à jour des matériaux",
          size: "2.2 MB",
        },
        {
          version: "v2.0",
          date: "2024-01-08T16:45:00",
          author: "Paul Leroy",
          status: "validated",
          changes: "Version validée pour APD",
          size: "2.1 MB",
        },
      ],
    },
    {
      id: 2,
      name: "Rapport Structure",
      type: "pdf",
      folder: "Études Techniques",
      currentVersion: "v1.5",
      totalVersions: 3,
      lastModified: "2024-01-14T11:20:00",
      size: "1.8 MB",
      author: "Marie Leroy",
      status: "current",
      versions: [
        {
          version: "v1.5",
          date: "2024-01-14T11:20:00",
          author: "Marie Leroy",
          status: "current",
          changes: "Calculs finalisés",
          size: "1.8 MB",
        },
        {
          version: "v1.4",
          date: "2024-01-12T15:30:00",
          author: "Marie Leroy",
          status: "archived",
          changes: "Révision des charges",
          size: "1.7 MB",
        },
        {
          version: "v1.3",
          date: "2024-01-10T10:15:00",
          author: "Paul Leroy",
          status: "archived",
          changes: "Ajout des détails fondations",
          size: "1.6 MB",
        },
      ],
    },
    {
      id: 3,
      name: "Plan Masse",
      type: "dwg",
      folder: "Plans Architecturaux",
      currentVersion: "v3.1",
      totalVersions: 3,
      lastModified: "2024-01-13T09:45:00",
      size: "1.9 MB",
      author: "Paul Leroy",
      status: "current",
      versions: [
        {
          version: "v3.1",
          date: "2024-01-13T09:45:00",
          author: "Paul Leroy",
          status: "current",
          changes: "Ajustement implantation",
          size: "1.9 MB",
        },
        {
          version: "v3.0",
          date: "2024-01-11T14:20:00",
          author: "Jean Dupont",
          status: "validated",
          changes: "Version validée client",
          size: "1.8 MB",
        },
        {
          version: "v2.9",
          date: "2024-01-09T16:30:00",
          author: "Paul Leroy",
          status: "archived",
          changes: "Modification accès",
          size: "1.7 MB",
        },
      ],
    },
    {
      id: 4,
      name: "Détails Constructifs",
      type: "dwg",
      folder: "Détails Techniques",
      currentVersion: "v1.2",
      totalVersions: 2,
      lastModified: "2024-01-11T16:15:00",
      size: "3.1 MB",
      author: "Jean Dupont",
      status: "current",
      versions: [
        {
          version: "v1.2",
          date: "2024-01-11T16:15:00",
          author: "Jean Dupont",
          status: "current",
          changes: "Ajout détails étanchéité",
          size: "3.1 MB",
        },
        {
          version: "v1.1",
          date: "2024-01-09T10:30:00",
          author: "Jean Dupont",
          status: "archived",
          changes: "Version initiale",
          size: "2.8 MB",
        },
      ],
    },
    {
      id: 5,
      name: "Cahier des Charges",
      type: "pdf",
      folder: "Documents Administratifs",
      currentVersion: "v2.0",
      totalVersions: 2,
      lastModified: "2024-01-08T14:30:00",
      size: "856 KB",
      author: "Marie Leroy",
      status: "validated",
      versions: [
        {
          version: "v2.0",
          date: "2024-01-08T14:30:00",
          author: "Marie Leroy",
          status: "validated",
          changes: "Version finale validée",
          size: "856 KB",
        },
        {
          version: "v1.0",
          date: "2024-01-05T09:00:00",
          author: "Paul Leroy",
          status: "archived",
          changes: "Version initiale",
          size: "742 KB",
        },
      ],
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.folder.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesFilter
  })

  // Grouper les documents par dossier
  const documentsByFolder = filteredDocuments.reduce(
    (acc, doc) => {
      if (!acc[doc.folder]) {
        acc[doc.folder] = []
      }
      acc[doc.folder].push(doc)
      return acc
    },
    {} as Record<string, typeof documents>,
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return <Badge className="bg-blue-100 text-blue-800">Actuelle</Badge>
      case "validated":
        return <Badge className="bg-green-100 text-green-800">Validée</Badge>
      case "archived":
        return <Badge variant="secondary">Archivée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "dwg":
        return <File className="h-5 w-5 text-blue-500" />
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Projet non trouvé</h1>
            <Button onClick={() => router.push("/archive")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux archives
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/archive")} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Démarré le {formatDate(project.startDate)}</span>
          </div>
        </div>

        {/* Statistiques du projet */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Statut</p>
                  <p className="text-lg font-semibold">{project.status}</p>
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
                  <p className="text-lg font-semibold">{project.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Versions totales</p>
                  <p className="text-lg font-semibold">{project.totalVersions}</p>
                </div>
                <History className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dossiers</p>
                  <p className="text-lg font-semibold">{Object.keys(documentsByFolder).length}</p>
                </div>
                <Folder className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <CardTitle className="text-lg sm:text-xl">Documents du projet</CardTitle>
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
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="dwg">Fichiers DWG</SelectItem>
                    <SelectItem value="pdf">Fichiers PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Documents groupés par dossier */}
            <div className="space-y-6">
              {Object.entries(documentsByFolder).map(([folderName, folderDocs]) => (
                <div key={folderName} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Folder className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{folderName}</h3>
                    <Badge variant="outline">
                      {folderDocs.length} document{folderDocs.length > 1 ? "s" : ""}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {folderDocs.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                            {getFileIcon(doc.type)}
                            <div className="flex-1">
                              <h4 className="font-medium text-lg">{doc.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span>Version actuelle: {doc.currentVersion}</span>
                                <span>•</span>
                                <span>
                                  {doc.totalVersions} version{doc.totalVersions > 1 ? "s" : ""}
                                </span>
                                <span>•</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                                  <History className="h-4 w-4 mr-1" />
                                  Historique
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Historique des versions - {doc.name}</DialogTitle>
                                  <DialogDescription>
                                    Consultez et gérez les différentes versions du document
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                  {doc.versions.map((version, index) => (
                                    <div
                                      key={version.version}
                                      className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                      <div className="flex items-center space-x-4">
                                        <div className="flex flex-col items-center">
                                          <div
                                            className={`w-3 h-3 rounded-full ${
                                              version.status === "current"
                                                ? "bg-blue-500"
                                                : version.status === "validated"
                                                  ? "bg-green-500"
                                                  : "bg-gray-300"
                                            }`}
                                          ></div>
                                          {index < doc.versions.length - 1 && (
                                            <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-medium">{version.version}</span>
                                            {getStatusBadge(version.status)}
                                          </div>
                                          <p className="text-sm text-gray-600 mb-1">{version.changes}</p>
                                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>{version.author}</span>
                                            <span>•</span>
                                            <span>{formatDate(version.date)}</span>
                                            <span>•</span>
                                            <span>{version.size}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" disabled>
                                          <Eye className="h-4 w-4 mr-1" />
                                          Aperçu
                                        </Button>
                                        <Button variant="outline" size="sm" disabled>
                                          <Download className="h-4 w-4 mr-1" />
                                          Télécharger
                                        </Button>
                                        {version.status !== "current" && (
                                          <Button variant="outline" size="sm" disabled>
                                            <RotateCcw className="h-4 w-4 mr-1" />
                                            Restaurer
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem disabled>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Aperçu
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archiver version
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Dernière modification: {formatDate(doc.lastModified)} par {doc.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(documentsByFolder).length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucun document trouvé</p>
                <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
