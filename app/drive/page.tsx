"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Label } from "@/components/ui/label"
import {
  FileText,
  ImageIcon,
  File,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Download,
  Share,
  MessageSquare,
  Eye,
  Grid,
  List,
  Folder,
  ChevronDown,
  HardDrive,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function DrivePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [selectedProject, setSelectedProject] = useState("residence-jardins")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const projects = [
    {
      id: "residence-jardins",
      name: "Résidence Les Jardins",
      status: "En cours",
      color: "bg-green-100 text-green-800",
      docs: 47,
    },
    {
      id: "centre-commercial",
      name: "Centre Commercial Atlantis",
      status: "En révision",
      color: "bg-yellow-100 text-yellow-800",
      docs: 32,
    },
    { id: "bureaux-tech", name: "Bureaux Tech Park", status: "Terminé", color: "bg-blue-100 text-blue-800", docs: 89 },
    { id: "villa-moderne", name: "Villa Moderne", status: "En cours", color: "bg-green-100 text-green-800", docs: 23 },
  ]

  const folders = [
    { id: "all", name: "Tous les documents", count: 47 },
    { id: "plans", name: "Plans", count: 15 },
    { id: "documents", name: "Documents", count: 12 },
    { id: "3d", name: "Modèles 3D", count: 8 },
    { id: "photos", name: "Photos", count: 12 },
  ]

  const documents = [
    {
      id: 1,
      name: "Plans Facade - v2.3.dwg",
      type: "dwg",
      size: "2.4 MB",
      uploadedBy: "Jean Dupont",
      uploadedAt: "2024-01-15T10:30:00",
      folder: "plans",
      annotations: 3,
      shared: true,
      thumbnail: "/placeholder.svg?height=100&width=100&text=DWG",
    },
    {
      id: 2,
      name: "Rapport Structure.pdf",
      type: "pdf",
      size: "1.8 MB",
      uploadedBy: "Marie Leroy",
      uploadedAt: "2024-01-14T14:20:00",
      folder: "documents",
      annotations: 1,
      shared: false,
      thumbnail: "/placeholder.svg?height=100&width=100&text=PDF",
    },
    {
      id: 3,
      name: "Perspectives 3D.zip",
      type: "zip",
      size: "15.2 MB",
      uploadedBy: "Paul Leroy",
      uploadedAt: "2024-01-13T09:15:00",
      folder: "3d",
      annotations: 0,
      shared: true,
      thumbnail: "/placeholder.svg?height=100&width=100&text=ZIP",
    },
    {
      id: 4,
      name: "Photo chantier 001.jpg",
      type: "jpg",
      size: "3.1 MB",
      uploadedBy: "Jean Dupont",
      uploadedAt: "2024-01-12T16:45:00",
      folder: "photos",
      annotations: 2,
      shared: false,
      thumbnail: "/placeholder.svg?height=100&width=100&text=JPG",
    },
    {
      id: 5,
      name: "Calculs béton.xlsx",
      type: "xlsx",
      size: "890 KB",
      uploadedBy: "Marie Leroy",
      uploadedAt: "2024-01-11T11:30:00",
      folder: "documents",
      annotations: 0,
      shared: true,
      thumbnail: "/placeholder.svg?height=100&width=100&text=XLS",
    },
    {
      id: 6,
      name: "Plan masse.dwg",
      type: "dwg",
      size: "1.9 MB",
      uploadedBy: "Paul Leroy",
      uploadedAt: "2024-01-10T13:20:00",
      folder: "plans",
      annotations: 5,
      shared: true,
      thumbnail: "/placeholder.svg?height=100&width=100&text=DWG",
    },
  ]

  const filteredDocuments =
    selectedFolder === "all" ? documents : documents.filter((doc) => doc.folder === selectedFolder)

  const currentProject = projects.find((p) => p.id === selectedProject)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "dwg":
        return <File className="h-5 w-5 text-blue-500" />
      case "jpg":
      case "png":
        return <ImageIcon className="h-5 w-5 text-green-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleFileClick = (fileId: number) => {
    router.push(`/drive/${fileId}`)
  }

  const handlePreview = (fileId: number) => {
    router.push(`/drive/${fileId}/preview`)
  }

  const handleAnnotate = (fileId: number) => {
    router.push(`/drive/${fileId}/annotate`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Drive Collaboratif</h1>
              <p className="text-gray-600 mt-1">Gestion centralisée des documents de projet</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Téléverser
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Téléverser des documents</DialogTitle>
                    <DialogDescription>Ajoutez de nouveaux documents à votre projet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Glissez-déposez vos fichiers ici ou</p>
                      <Button variant="outline" className="mt-2 bg-transparent" disabled>
                        Parcourir les fichiers
                      </Button>
                    </div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un dossier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plans">Plans</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="3d">Modèles 3D</SelectItem>
                        <SelectItem value="photos">Photos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    <Share className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Partager le projet</DialogTitle>
                    <DialogDescription>Invitez des collaborateurs à accéder à ce projet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input id="fullName" placeholder="Nom et prénom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@exemple.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permissions">Permissions</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner les permissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Lecture seule</SelectItem>
                          <SelectItem value="comment">Commentaires</SelectItem>
                          <SelectItem value="upload">Téléversement</SelectItem>
                          <SelectItem value="edit">Édition complète</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={() => setShareDialogOpen(false)}>Envoyer l'invitation</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Project Selector */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <HardDrive className="h-4 w-4" />
                <span>Projet actuel :</span>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-80 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{currentProject?.name}</div>
                      <div className="text-xs text-gray-500">{currentProject?.docs} documents</div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </SelectTrigger>
                <SelectContent className="w-80">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="p-3">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{project.name}</div>
                          <div className="text-xs text-gray-500">{project.docs} documents</div>
                        </div>
                        <Badge className={`${project.color} text-xs flex-shrink-0`}>{project.status}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dossiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-gray-100 ${
                      selectedFolder === folder.id ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Folder className="h-4 w-4" />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {folder.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Share className="h-4 w-4 mr-2" />
                  Partager par étape
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Eye className="h-4 w-4 mr-2" />
                  Liens publics
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Annotations récentes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher des documents..." className="pl-10" disabled />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="dwg">DWG</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Documents Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div
                        className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center cursor-pointer"
                        onClick={() => handleFileClick(doc.id)}
                      >
                        <img
                          src={doc.thumbnail || "/placeholder.svg"}
                          alt={doc.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3
                            className="font-medium text-sm truncate flex-1 cursor-pointer hover:text-blue-600"
                            title={doc.name}
                            onClick={() => handleFileClick(doc.id)}
                          >
                            {doc.name}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handlePreview(doc.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Aperçu
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAnnotate(doc.id)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Annoter
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled>
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled>
                                <Share className="mr-2 h-4 w-4" />
                                Partager
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{doc.size}</span>
                          <div className="flex items-center space-x-2">
                            {doc.annotations > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {doc.annotations} annotations
                              </Badge>
                            )}
                            {doc.shared && (
                              <Badge variant="outline" className="text-xs">
                                Partagé
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs">
                              {doc.uploadedBy
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">{doc.uploadedBy}</span>
                        </div>

                        <p className="text-xs text-gray-400">{formatDate(doc.uploadedAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4 font-medium">Nom</th>
                          <th className="p-4 font-medium">Type</th>
                          <th className="p-4 font-medium">Taille</th>
                          <th className="p-4 font-medium">Uploadé par</th>
                          <th className="p-4 font-medium">Date</th>
                          <th className="p-4 font-medium">Statut</th>
                          <th className="p-4 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc) => (
                          <tr key={doc.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                {getFileIcon(doc.type)}
                                <span
                                  className="font-medium cursor-pointer hover:text-blue-600"
                                  onClick={() => handleFileClick(doc.id)}
                                >
                                  {doc.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="uppercase">
                                {doc.type}
                              </Badge>
                            </td>
                            <td className="p-4 text-gray-600">{doc.size}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {doc.uploadedBy
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{doc.uploadedBy}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-600 text-sm">{formatDate(doc.uploadedAt)}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {doc.annotations > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {doc.annotations} annotations
                                  </Badge>
                                )}
                                {doc.shared && (
                                  <Badge variant="outline" className="text-xs">
                                    Partagé
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handlePreview(doc.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Aperçu
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAnnotate(doc.id)}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Annoter
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled>
                                    <Download className="mr-2 h-4 w-4" />
                                    Télécharger
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled>
                                    <Share className="mr-2 h-4 w-4" />
                                    Partager
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
