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
      docs: 47,
    },
    {
      id: "centre-commercial",
      name: "Centre Commercial Atlantis",
      status: "En révision",
      docs: 32,
    },
    { id: "bureaux-tech", name: "Bureaux Tech Park", status: "Terminé", docs: 89 },
    { id: "villa-moderne", name: "Villa Moderne", status: "En cours", docs: 23 },
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
        return <FileText className="h-5 w-5 text-black/60" />
      case "dwg":
        return <File className="h-5 w-5 text-black/60" />
      case "jpg":
      case "png":
        return <ImageIcon className="h-5 w-5 text-black/60" />
      default:
        return <File className="h-5 w-5 text-black/40" />
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
        <div className="flex flex-col space-y-6 mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 border-b-2 border-black/10 pb-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 text-black">
                DRIVE
                <br />
                COLLABORATIF
              </h1>
              <div className="w-16 md:w-24 h-1 bg-black mb-4"></div>
              <p className="text-base md:text-lg text-black/60 font-light">Gestion centralisée des documents de projet</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-black text-white hover:bg-black/90 rounded-none border-2 border-black font-medium tracking-wide" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Téléverser
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-none border-2 border-black">
                  <DialogHeader>
                    <DialogTitle className="font-black tracking-tighter text-black">Téléverser des documents</DialogTitle>
                    <div className="w-12 h-1 bg-black mb-4"></div>
                    <DialogDescription className="text-black/60 font-light">Ajoutez de nouveaux documents à votre projet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-black/20 p-8 text-center">
                      <Upload className="h-12 w-12 text-black/40 mx-auto mb-4" />
                      <p className="text-black/60 font-light">Glissez-déposez vos fichiers ici ou</p>
                      <Button variant="outline" className="mt-2 rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all" disabled>
                        Parcourir les fichiers
                      </Button>
                    </div>
                    <Select>
                      <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                        <SelectValue placeholder="Sélectionner un dossier" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-black">
                        <SelectItem value="plans" className="rounded-none hover:bg-black hover:text-white">Plans</SelectItem>
                        <SelectItem value="documents" className="rounded-none hover:bg-black hover:text-white">Documents</SelectItem>
                        <SelectItem value="3d" className="rounded-none hover:bg-black hover:text-white">Modèles 3D</SelectItem>
                        <SelectItem value="photos" className="rounded-none hover:bg-black hover:text-white">Photos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all font-medium tracking-wide">
                    <Share className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-none border-2 border-black">
                  <DialogHeader>
                    <DialogTitle className="font-black tracking-tighter text-black">Partager le projet</DialogTitle>
                    <div className="w-12 h-1 bg-black mb-4"></div>
                    <DialogDescription className="text-black/60 font-light">Invitez des collaborateurs à accéder à ce projet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-black uppercase tracking-wide">Nom complet</Label>
                      <Input id="fullName" placeholder="Nom et prénom" className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-black uppercase tracking-wide">Email</Label>
                      <Input id="email" type="email" placeholder="email@exemple.com" className="rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permissions" className="text-sm font-medium text-black uppercase tracking-wide">Permissions</Label>
                      <Select>
                        <SelectTrigger className="rounded-none border-2 border-black/10 focus:border-black">
                          <SelectValue placeholder="Sélectionner les permissions" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-black">
                          <SelectItem value="read" className="rounded-none hover:bg-black hover:text-white">Lecture seule</SelectItem>
                          <SelectItem value="comment" className="rounded-none hover:bg-black hover:text-white">Commentaires</SelectItem>
                          <SelectItem value="upload" className="rounded-none hover:bg-black hover:text-white">Téléversement</SelectItem>
                          <SelectItem value="edit" className="rounded-none hover:bg-black hover:text-white">Édition complète</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t border-black/10">
                      <Button variant="outline" onClick={() => setShareDialogOpen(false)} className="rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all">
                        Annuler
                      </Button>
                      <Button onClick={() => setShareDialogOpen(false)} className="bg-black text-white hover:bg-black/90 rounded-none border-2 border-black font-medium tracking-wide">
                        Envoyer l'invitation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Project Selector */}
          <div className="bg-white border-2 border-black/10 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-black uppercase tracking-wide">
                <HardDrive className="h-4 w-4" />
                <span>Projet actuel :</span>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-80 bg-white border-2 border-black/10 hover:border-black/20 transition-all rounded-none">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-black"></div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-black">{currentProject?.name}</div>
                      <div className="text-xs text-black/50 font-light">{currentProject?.docs} documents</div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-black/40" />
                </SelectTrigger>
                <SelectContent className="w-80 rounded-none border-2 border-black">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="p-3 rounded-none hover:bg-black hover:text-white">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-2 h-2 bg-black flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-black truncate">{project.name}</div>
                          <div className="text-xs text-black/50 font-light">{project.docs} documents</div>
                        </div>
                        <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium uppercase tracking-wide flex-shrink-0">
                          {project.status}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-black/10">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black mb-4">Dossiers</h3>
              <div className="w-12 md:w-16 h-1 bg-black mb-6"></div>
            </div>
            <div className="space-y-2 mb-8">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between p-3 border-2 transition-all ${
                    selectedFolder === folder.id 
                      ? "border-black bg-black text-white" 
                      : "border-black/10 hover:border-black/20 bg-white text-black"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm font-medium">{folder.name}</span>
                  </div>
                  <span className="text-xs px-2 py-1 border-2 border-current font-medium">
                    {folder.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black mb-4">Actions rapides</h3>
              <div className="w-12 md:w-16 h-1 bg-black mb-6"></div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all" disabled>
                  <Share className="h-4 w-4 mr-2" />
                  Partager par étape
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all" disabled>
                  <Eye className="h-4 w-4 mr-2" />
                  Liens publics
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black transition-all" disabled>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Annotations récentes
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-white p-6 md:p-8">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 h-4 w-4" />
                  <Input placeholder="Rechercher des documents..." className="pl-10 rounded-none border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light" disabled />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-40 rounded-none border-2 border-black/10 focus:border-black">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-black">
                    <SelectItem value="all" className="rounded-none hover:bg-black hover:text-white">Tous les types</SelectItem>
                    <SelectItem value="pdf" className="rounded-none hover:bg-black hover:text-white">PDF</SelectItem>
                    <SelectItem value="dwg" className="rounded-none hover:bg-black hover:text-white">DWG</SelectItem>
                    <SelectItem value="images" className="rounded-none hover:bg-black hover:text-white">Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-black text-white border-black rounded-none" : "rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black"}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-black text-white border-black rounded-none" : "rounded-none border-2 border-black/20 hover:bg-black hover:text-white hover:border-black"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Documents Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white border-2 border-transparent hover:border-black/10 transition-all p-4 group">
                    <div
                      className="aspect-square bg-black/5 border-2 border-black/10 mb-3 flex items-center justify-center cursor-pointer hover:border-black transition-all"
                      onClick={() => handleFileClick(doc.id)}
                    >
                      <img
                        src={doc.thumbnail || "/placeholder.svg"}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3
                          className="font-medium text-sm truncate flex-1 cursor-pointer hover:text-black transition-colors text-black"
                          title={doc.name}
                          onClick={() => handleFileClick(doc.id)}
                        >
                          {doc.name}
                        </h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="rounded-none border-2 border-transparent hover:border-black/20 h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4 text-black/60" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-none border-2 border-black">
                            <DropdownMenuItem onClick={() => handlePreview(doc.id)} className="rounded-none hover:bg-black hover:text-white">
                              <Eye className="mr-2 h-4 w-4" />
                              Aperçu
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAnnotate(doc.id)} className="rounded-none hover:bg-black hover:text-white">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Annoter
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled className="rounded-none">
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled className="rounded-none">
                              <Share className="mr-2 h-4 w-4" />
                              Partager
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between text-xs text-black/60 font-light">
                        <span>{doc.size}</span>
                        <div className="flex items-center space-x-2">
                          {doc.annotations > 0 && (
                            <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium">
                              {doc.annotations} annotations
                            </span>
                          )}
                          {doc.shared && (
                            <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium">
                              Partagé
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Avatar className="w-5 h-5 border-2 border-black/10 rounded-none">
                          <AvatarFallback className="text-xs bg-black text-white rounded-none font-black">
                            {doc.uploadedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-black/60 font-light">{doc.uploadedBy}</span>
                      </div>

                      <p className="text-xs text-black/40 font-light">{formatDate(doc.uploadedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2 border-black/10 bg-white">
                      <tr className="text-left">
                        <th className="p-4 font-black text-black uppercase tracking-wide text-sm">Nom</th>
                        <th className="p-4 font-black text-black uppercase tracking-wide text-sm">Type</th>
                        <th className="p-4 font-black text-black uppercase tracking-wide text-sm">Taille</th>
                        <th className="p-4 font-black text-black uppercase tracking-wide text-sm">Uploadé par</th>
                        <th className="p-4 font-black text-black uppercase tracking-wide text-sm">Date</th>
                        <th className="p-4 font-black text-black uppercase tracking-wide text-sm">Statut</th>
                        <th className="p-4 font-black text-black uppercase tracking-wide text-sm"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b border-black/10 hover:bg-black/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(doc.type)}
                              <span
                                className="font-medium cursor-pointer hover:text-black transition-colors text-black"
                                onClick={() => handleFileClick(doc.id)}
                              >
                                {doc.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium uppercase">
                              {doc.type}
                            </span>
                          </td>
                          <td className="p-4 text-black/60 font-light">{doc.size}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6 border-2 border-black/10 rounded-none">
                                <AvatarFallback className="text-xs bg-black text-white rounded-none font-black">
                                  {doc.uploadedBy
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-black font-light">{doc.uploadedBy}</span>
                            </div>
                          </td>
                          <td className="p-4 text-black/60 text-sm font-light">{formatDate(doc.uploadedAt)}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {doc.annotations > 0 && (
                                <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium">
                                  {doc.annotations} annotations
                                </span>
                              )}
                              {doc.shared && (
                                <span className="px-2 py-1 border-2 border-black/20 text-black text-xs font-medium">
                                  Partagé
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-none border-2 border-transparent hover:border-black/20 h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4 text-black/60" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-none border-2 border-black">
                                <DropdownMenuItem onClick={() => handlePreview(doc.id)} className="rounded-none hover:bg-black hover:text-white">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Aperçu
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAnnotate(doc.id)} className="rounded-none hover:bg-black hover:text-white">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Annoter
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled className="rounded-none">
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled className="rounded-none">
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
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
