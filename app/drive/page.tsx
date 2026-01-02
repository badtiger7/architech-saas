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

      <main className="relative w-full px-6 md:px-12 lg:px-24 xl:px-32 2xl:px-40 py-6 md:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:space-y-5 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 border-b border-black/10 pb-4 md:pb-5">
            <div>
              <h1 className="font-caveat text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-black mb-2">
                Drive collaboratif
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-sand-500 text-white hover:bg-sand-600 border-2 border-sand-500 rounded-lg text-sm h-9 px-4" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Téléverser
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl border-2 border-black">
                  <DialogHeader>
                    <DialogTitle className="font-black tracking-tighter text-black">Téléverser des documents</DialogTitle>
                    <div className="w-12 h-1 bg-sand-500 mb-4"></div>
                    <DialogDescription className="text-sand-600 font-light">Ajoutez de nouveaux documents à votre projet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-black/20 p-8 text-center">
                      <Upload className="h-12 w-12 text-black/40 mx-auto mb-4" />
                      <p className="text-sand-600 font-light">Glissez-déposez vos fichiers ici ou</p>
                      <Button variant="outline" className="mt-2 rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all" disabled>
                        Parcourir les fichiers
                      </Button>
                    </div>
                    <Select>
                      <SelectTrigger className="rounded-lg border-2 border-black/10 focus:border-black">
                        <SelectValue placeholder="Sélectionner un dossier" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-2 border-black">
                        <SelectItem value="plans" className="rounded-lg hover:bg-black hover:text-white">Plans</SelectItem>
                        <SelectItem value="documents" className="rounded-lg hover:bg-black hover:text-white">Documents</SelectItem>
                        <SelectItem value="3d" className="rounded-lg hover:bg-black hover:text-white">Modèles 3D</SelectItem>
                        <SelectItem value="photos" className="rounded-lg hover:bg-black hover:text-white">Photos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all text-sm h-9 px-4">
                    <Share className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-lg border-2 border-black">
                  <DialogHeader>
                    <DialogTitle className="font-black tracking-tighter text-black">Partager le projet</DialogTitle>
                    <div className="w-12 h-1 bg-sand-500 mb-4"></div>
                    <DialogDescription className="text-sand-600 font-light">Invitez des collaborateurs à accéder à ce projet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-black uppercase tracking-wide">Nom complet</Label>
                      <Input id="fullName" placeholder="Nom et prénom" className="rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-black uppercase tracking-wide">Email</Label>
                      <Input id="email" type="email" placeholder="email@exemple.com" className="rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permissions" className="text-sm font-medium text-black uppercase tracking-wide">Permissions</Label>
                      <Select>
                        <SelectTrigger className="rounded-lg border-2 border-black/10 focus:border-black">
                          <SelectValue placeholder="Sélectionner les permissions" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-2 border-black">
                          <SelectItem value="read" className="rounded-lg hover:bg-black hover:text-white">Lecture seule</SelectItem>
                          <SelectItem value="comment" className="rounded-lg hover:bg-black hover:text-white">Commentaires</SelectItem>
                          <SelectItem value="upload" className="rounded-lg hover:bg-black hover:text-white">Téléversement</SelectItem>
                          <SelectItem value="edit" className="rounded-lg hover:bg-black hover:text-white">Édition complète</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t border-black/10">
                      <Button variant="outline" onClick={() => setShareDialogOpen(false)} className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all">
                        Annuler
                      </Button>
                      <Button onClick={() => setShareDialogOpen(false)} className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500 font-medium tracking-wide">
                        Envoyer l'invitation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Project Selector */}
          <div className="bg-white border border-sand-200 p-4 md:p-5 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-sand-700 uppercase tracking-wide">
                <HardDrive className="h-4 w-4" />
                <span>Projet :</span>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-80 lg:w-96 h-auto bg-white border-2 border-sand-200 hover:border-sand-300 transition-all rounded-lg p-3 [&>svg]:text-sand-600">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-2 h-2 bg-sand-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm md:text-base text-black truncate">{currentProject?.name}</div>
                      <div className="text-xs text-sand-600 font-light">{currentProject?.docs} documents</div>
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="w-80 lg:w-96 rounded-lg border-2 border-sand-200">
                  {projects.map((project) => {
                    const isActive = project.id === selectedProject
                    return (
                      <SelectItem 
                        key={project.id} 
                        value={project.id} 
                        className={`p-3 rounded-lg ${
                          isActive 
                            ? "bg-sand-500 text-white border-2 border-sand-500 hover:!bg-sand-500 hover:!text-white focus:!bg-sand-500 focus:!text-white" 
                            : "hover:bg-sand-500 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            isActive ? "bg-white" : "bg-sand-500"
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm truncate ${
                              isActive ? "text-white" : "text-black"
                            }`}>{project.name}</div>
                            <div className={`text-xs font-light ${
                              isActive ? "text-white/90" : "text-sand-600"
                            }`}>{project.docs} documents</div>
                          </div>
                          <span className={`px-2 py-1 border text-xs font-medium uppercase tracking-wide flex-shrink-0 rounded-md ${
                            isActive 
                              ? "border-white/30 bg-white/20 text-white" 
                              : "border-sand-200 bg-sand-50 text-sand-700"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-2 bg-white">
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-black tracking-tighter text-black mb-3">Dossiers</h3>
              <div className="w-12 h-1 bg-sand-500 mb-5"></div>
            </div>
            <div className="space-y-2 mb-6 md:mb-8">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between p-3 border-2 transition-all rounded-lg ${
                    selectedFolder === folder.id 
                      ? "border-sand-500 bg-sand-500 text-white" 
                      : "border-black/10 hover:border-sand-200 bg-white text-black"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm font-medium">{folder.name}</span>
                  </div>
                  <span className="text-xs px-2 py-1 border-2 border-current font-medium rounded-md">
                    {folder.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tighter text-black mb-3">Actions rapides</h3>
              <div className="w-12 h-1 bg-sand-500 mb-5"></div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all h-9 text-sm font-medium" disabled>
                  <Share className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all h-9 text-sm font-medium" disabled>
                  <Eye className="h-4 w-4 mr-2" />
                  Liens publics
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 transition-all h-9 text-sm font-medium" disabled>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Annotations
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-10 bg-white">
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 md:mb-8 space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-72 lg:w-80">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 h-4 w-4" />
                  <Input placeholder="Rechercher..." className="pl-10 h-10 md:h-11 rounded-lg border-2 border-black/10 focus:border-black transition-all bg-white text-black font-light text-sm" disabled />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-40 lg:w-48 h-10 md:h-11 rounded-lg border-2 border-black/10 focus:border-black text-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-2 border-black">
                    <SelectItem value="all" className="rounded-lg hover:bg-black hover:text-white">Tous les types</SelectItem>
                    <SelectItem value="pdf" className="rounded-lg hover:bg-black hover:text-white">PDF</SelectItem>
                    <SelectItem value="dwg" className="rounded-lg hover:bg-black hover:text-white">DWG</SelectItem>
                    <SelectItem value="images" className="rounded-lg hover:bg-black hover:text-white">Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                  className={`h-10 w-10 rounded-lg border-2 transition-all ${
                    viewMode === "grid" 
                      ? "bg-sand-500 text-white border-sand-500" 
                      : "border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  className={`h-10 w-10 rounded-lg border-2 transition-all ${
                    viewMode === "list" 
                      ? "bg-sand-500 text-white border-sand-500" 
                      : "border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Documents Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                {filteredDocuments.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="bg-white border border-black/5 hover:border-sand-300 transition-all duration-300 p-0 group cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md"
                    onClick={() => handleFileClick(doc.id)}
                  >
                    {/* Image Preview Section */}
                    <div
                      className="aspect-[4/3] bg-gradient-to-br from-sand-50 to-sand-100 border-b border-sand-200 relative overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileClick(doc.id)
                      }}
                    >
                      <img
                        src={doc.thumbnail || "/placeholder.svg"}
                        alt={doc.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-lg border border-sand-200 bg-white/90 backdrop-blur-sm hover:bg-sand-500 hover:text-white hover:border-sand-500 h-9 w-9 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-lg border-2 border-sand-200">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePreview(doc.id); }} className="rounded-lg hover:bg-sand-500 hover:text-white">
                              <Eye className="mr-2 h-4 w-4" />
                              Aperçu
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAnnotate(doc.id); }} className="rounded-lg hover:bg-sand-500 hover:text-white">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Annoter
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled className="rounded-lg">
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled className="rounded-lg">
                              <Share className="mr-2 h-4 w-4" />
                              Partager
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 md:p-6 space-y-3">
                      {/* Title */}
                      <div>
                        <h3
                          className="font-semibold text-lg md:text-xl truncate cursor-pointer text-black group-hover:text-sand-700 transition-colors leading-tight"
                          title={doc.name}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileClick(doc.id)
                          }}
                        >
                          {doc.name}
                        </h3>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-sand-200">
                        <span className="text-sm text-sand-600 font-light">{doc.size}</span>
                        <div className="flex items-center gap-2">
                          {doc.annotations > 0 && (
                            <span className="px-2.5 py-1 bg-sand-50 border border-sand-200 text-sand-700 text-xs font-medium rounded-md">
                              {doc.annotations} annotations
                            </span>
                          )}
                          {doc.shared && (
                            <span className="px-2.5 py-1 bg-sand-50 border border-sand-200 text-sand-700 text-xs font-medium rounded-md">
                              Partagé
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer with user and date */}
                      <div className="flex items-center justify-between pt-3 border-t border-sand-200">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-sand-200 rounded-full">
                            <AvatarFallback className="text-xs bg-sand-500 text-white rounded-full font-black">
                              {doc.uploadedBy
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm text-black font-medium leading-none">{doc.uploadedBy}</span>
                            <span className="text-xs text-sand-600 font-light mt-0.5">{formatDate(doc.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-sand-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2 border-sand-200 bg-sand-50">
                      <tr className="text-left">
                        <th className="p-4 md:p-5 font-black text-sand-700 uppercase tracking-wide text-sm">Nom</th>
                        <th className="p-4 md:p-5 font-black text-sand-700 uppercase tracking-wide text-sm">Type</th>
                        <th className="p-4 md:p-5 font-black text-sand-700 uppercase tracking-wide text-sm">Taille</th>
                        <th className="p-4 md:p-5 font-black text-sand-700 uppercase tracking-wide text-sm">Uploadé par</th>
                        <th className="p-4 md:p-5 font-black text-sand-700 uppercase tracking-wide text-sm">Date</th>
                        <th className="p-4 md:p-5 font-black text-sand-700 uppercase tracking-wide text-sm">Statut</th>
                        <th className="p-4 md:p-5 font-black text-sand-700 uppercase tracking-wide text-sm"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b border-sand-200 hover:bg-sand-50 transition-colors">
                          <td className="p-4 md:p-5">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(doc.type)}
                              <span
                                className="font-medium text-sm cursor-pointer hover:text-sand-700 transition-colors text-black"
                                onClick={() => handleFileClick(doc.id)}
                              >
                                {doc.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 md:p-5">
                            <span className="px-2.5 py-1 border border-sand-200 bg-sand-50 text-sand-700 text-xs font-medium uppercase rounded-md">
                              {doc.type}
                            </span>
                          </td>
                          <td className="p-4 md:p-5 text-sand-600 font-light text-sm">{doc.size}</td>
                          <td className="p-4 md:p-5">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-7 h-7 border border-sand-200 rounded-full">
                                <AvatarFallback className="text-xs bg-sand-500 text-white rounded-full font-black">
                                  {doc.uploadedBy
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-black font-light">{doc.uploadedBy}</span>
                            </div>
                          </td>
                          <td className="p-4 md:p-5 text-sand-600 text-sm font-light">{formatDate(doc.uploadedAt)}</td>
                          <td className="p-4 md:p-5">
                            <div className="flex items-center space-x-2">
                              {doc.annotations > 0 && (
                                <span className="px-2.5 py-1 bg-sand-50 border border-sand-200 text-sand-700 text-xs font-medium rounded-md">
                                  {doc.annotations} annotations
                                </span>
                              )}
                              {doc.shared && (
                                <span className="px-2.5 py-1 bg-sand-50 border border-sand-200 text-sand-700 text-xs font-medium rounded-md">
                                  Partagé
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 md:p-5">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-lg border border-transparent hover:border-sand-200 hover:bg-sand-50 h-9 w-9 p-0">
                                  <MoreVertical className="h-4 w-4 text-sand-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-lg border-2 border-sand-200">
                                <DropdownMenuItem onClick={() => handlePreview(doc.id)} className="rounded-lg hover:bg-sand-500 hover:text-white">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Aperçu
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAnnotate(doc.id)} className="rounded-lg hover:bg-sand-500 hover:text-white">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Annoter
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled className="rounded-lg">
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled className="rounded-lg">
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
