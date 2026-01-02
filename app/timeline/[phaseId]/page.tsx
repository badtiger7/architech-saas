"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePhase } from "@/hooks/use-phase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
  Share2,
  Eye,
  Download,
  MessageSquare,
  Edit,
  Save,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { getStatusClasses, formatDateForDisplay } from "@/lib/utils"

export default function PhaseDetailPage({ params }: { params: Promise<{ phaseId: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Next.js 15: Les params sont maintenant des Promise
  const [phaseId, setPhaseId] = useState<string>("")
  const projectId = searchParams.get('projectId')
  const { phase, documents, loading, updatePhase, addDocument } = usePhase(phaseId)
  
  // Récupérer le phaseId depuis les params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setPhaseId(resolvedParams.phaseId)
    }
    getParams()
  }, [params])

  // Synchroniser le formulaire quand la phase change
  useEffect(() => {
    if (phase) {
      setEditForm({
        startDate: phase.startDate || "",
        endDate: phase.endDate || "",
        description: phase.description || "",
      })
    }
  }, [phase])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    startDate: "",
    endDate: "",
    description: "",
  })
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "",
    description: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [shareForm, setShareForm] = useState({
    fullName: "",
    email: "",
    permission: "read",
  })

  // Loading state - attendre que phaseId soit disponible
  if (!phaseId || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Chargement de la phase...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!phase) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Phase non trouvée</p>
            <Button 
              onClick={() => projectId ? router.push(`/timeline?project=${projectId}`) : router.back()} 
              className="mt-4"
            >
              Retour
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const classes = getStatusClasses(status as any)
    return classes.badge
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "in-review":
        return <Clock className="h-4 w-4 text-warning" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-danger" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const handleSaveEdit = async () => {
    if (!phase) {
      console.error('Aucune phase à sauvegarder')
      return
    }

    try {
      // Maintenant on peut mettre à jour startDate ET endDate
      const updatedData: any = {}
      
      // Inclure startDate si elle a changé
      if (editForm.startDate !== phase.startDate) {
        updatedData.startDate = editForm.startDate || null
      }
      
      // Inclure endDate si elle a changé
      if (editForm.endDate !== phase.endDate) {
        updatedData.endDate = editForm.endDate || null
      }
      
      // Inclure description si elle a changé
      if (editForm.description !== phase.description) {
        updatedData.description = editForm.description || null
      }
      
      // Si aucun changement, ne rien faire
      if (Object.keys(updatedData).length === 0) {
        setIsEditing(false)
        return
      }

      // Appeler l'API pour mettre à jour la phase
      const response = await updatePhase(updatedData)
      
      if (response?.success) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
    }
  }

  const handleUploadDocument = async () => {
    if (!uploadForm.name.trim() || !selectedFile) {
      alert("❌ Veuillez remplir tous les champs et sélectionner un fichier")
      return
    }

    try {
      // Mapper le type de document vers les catégories de la base de données
      const categoryMap: Record<string, 'plan' | 'specification' | 'photo' | 'report' | 'other'> = {
        'Plan architectural': 'plan',
        'Façade': 'plan',
        'Coupe': 'plan',
        'Détail technique': 'specification',
        'Rapport': 'report',
      }
      const category = categoryMap[uploadForm.type] || 'other'

      // Créer un FormData pour l'upload
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('phaseId', phaseId)
      formData.append('title', uploadForm.name)
      formData.append('category', category)

      // Appeler l'API d'upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // Recharger les documents via le hook
        await addDocument({
          name: uploadForm.name,
          type: uploadForm.type || "Document",
          status: "pending",
          size: "0 MB",
          lastModified: new Date().toISOString().split('T')[0],
          comments: 0,
          views: 0,
        })

        // Réinitialiser le formulaire
        setUploadForm({ name: "", type: "", description: "" })
        setSelectedFile(null)
        setUploadDialogOpen(false)

        alert("✅ Document uploadé avec succès !")
      } else {
        alert(`❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error)
      alert("❌ Erreur lors de l'upload du fichier")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b-2 border-sand-200">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => projectId ? router.push(`/timeline?project=${projectId}`) : router.back()}
                className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la timeline
              </Button>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-black">{phase.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={`${getStatusColor(phase.status)} rounded-md`}>{phase.status}</Badge>
                  <span className="text-sm text-sand-600 font-light">•</span>
                  <span className="text-sm text-sand-600 font-light">Phase {phase.orderIndex + 1}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (isEditing) {
                    handleSaveEdit()
                  } else {
                    // Initialiser le formulaire avec les valeurs actuelles
                    setEditForm({
                      startDate: phase.startDate || "",
                      endDate: phase.endDate || "",
                      description: phase.description || "",
                    })
                    setIsEditing(true)
                  }
                }}
                className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Phase Info */}
            <Card className="border border-sand-200">
              <CardHeader>
                <CardTitle className="font-black tracking-tighter text-black">Informations de la phase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Description</Label>
                      <Textarea 
                        id="description" 
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[100px] rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                        placeholder="Décrivez cette phase du projet..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Date de début</Label>
                        <Input 
                          id="startDate" 
                          type="date" 
                          value={editForm.startDate}
                          onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                          className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Date de fin</Label>
                        <Input 
                          id="endDate" 
                          type="date" 
                          value={editForm.endDate}
                          onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                          className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-black font-light">{phase.description || "Aucune description disponible"}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-sand-400" />
                        <div>
                          <p className="text-xs text-black/60 font-light uppercase tracking-wide">Date de début</p>
                          <p className="font-medium text-black">
                            {formatDateForDisplay(phase.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-sand-400" />
                        <div>
                          <p className="text-xs text-black/60 font-light uppercase tracking-wide">Date de fin</p>
                          <p className="font-medium text-black">
                            {formatDateForDisplay(phase.endDate || null)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="border border-sand-200">
              <CardHeader>
                <CardTitle className="font-black tracking-tighter text-black">Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black">Avancement global</span>
                    <span className="text-sm text-sand-600 font-light">{phase.progressRatio}%</span>
                  </div>
                  <Progress value={phase.progressRatio} className="w-full h-1.5 bg-sand-100 [&>div]:bg-sand-500" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-sand-50 border border-sand-200 rounded-lg">
                      <div className="font-black text-lg text-black">{documents.filter(d => d.status === 'validated').length}</div>
                      <div className="text-sand-600 font-light">Documents validés</div>
                    </div>
                    <div className="text-center p-3 bg-sand-50 border border-sand-200 rounded-lg">
                      <div className="font-black text-lg text-black">{documents.length}</div>
                      <div className="text-sand-600 font-light">Total documents</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border border-sand-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-black tracking-tighter text-black">Documents</CardTitle>
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500">
                        <Upload className="h-4 w-4 mr-2" />
                        Ajouter un document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg border-2 border-sand-200">
                      <DialogHeader>
                        <DialogTitle className="font-black tracking-tighter text-black">Ajouter un document</DialogTitle>
                        <div className="w-12 h-0.5 bg-sand-500 mb-3"></div>
                        <DialogDescription className="text-sand-600 font-light">
                          Téléchargez un nouveau document pour cette phase.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="docName" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Nom du document</Label>
                          <Input
                            id="docName"
                            value={uploadForm.name}
                            onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                            placeholder="Ex: Plan de masse"
                            className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="docType" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Type de document</Label>
                          <Select
                            value={uploadForm.type}
                            onValueChange={(value) => setUploadForm({ ...uploadForm, type: value })}
                          >
                            <SelectTrigger className="rounded-lg border-2 border-sand-200 focus:border-sand-500">
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-2 border-sand-200">
                              <SelectItem value="Plan architectural" className="rounded-lg hover:bg-sand-500 hover:text-white">Plan architectural</SelectItem>
                              <SelectItem value="Façade" className="rounded-lg hover:bg-sand-500 hover:text-white">Façade</SelectItem>
                              <SelectItem value="Coupe" className="rounded-lg hover:bg-sand-500 hover:text-white">Coupe</SelectItem>
                              <SelectItem value="Détail technique" className="rounded-lg hover:bg-sand-500 hover:text-white">Détail technique</SelectItem>
                              <SelectItem value="Rapport" className="rounded-lg hover:bg-sand-500 hover:text-white">Rapport</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="docDescription" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Description</Label>
                          <Textarea
                            id="docDescription"
                            value={uploadForm.description}
                            onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                            placeholder="Description du document"
                            className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm"
                          />
                        </div>
                        
                        {/* Zone de téléversement de fichier */}
                        <div>
                          <Label className="text-xs font-medium text-sand-700 uppercase tracking-wide">Fichier</Label>
                          <div className="border-2 border-dashed border-sand-200 rounded-lg p-6 text-center hover:border-sand-400 transition-colors bg-sand-50/50">
                            <input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              accept=".pdf,.dwg,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setSelectedFile(file)
                                  // Auto-remplir le nom si il est vide
                                  if (!uploadForm.name) {
                                    setUploadForm(prev => ({ 
                                      ...prev, 
                                      name: file.name.replace(/\.[^/.]+$/, "") // Enlever l'extension
                                    }))
                                  }
                                }
                              }}
                            />
                            <label 
                              htmlFor="file-upload" 
                              className="cursor-pointer flex flex-col items-center space-y-2"
                            >
                              <Upload className="h-8 w-8 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-600">
                                  Glissez-déposez votre fichier ici ou <span className="text-primary underline">cliquez pour parcourir</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Formats supportés: PDF, DWG, JPG, PNG, DOC (max 10MB)
                                </p>
                              </div>
                                                         </label>
                             {selectedFile && (
                               <div className="mt-2 p-2 bg-muted rounded text-sm">
                                 <div className="flex items-center justify-between">
                                   <span>📄 {selectedFile.name}</span>
                                   <Button 
                                     variant="ghost" 
                                     size="sm"
                                     onClick={() => setSelectedFile(null)}
                                   >
                                     ✕
                                   </Button>
                                 </div>
                                 <div className="text-xs text-muted-foreground mt-1">
                                   {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                        <div className="flex justify-end space-x-2 pt-4 border-t border-sand-200">
                          <Button variant="outline" onClick={() => setUploadDialogOpen(false)} className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500">
                            Annuler
                          </Button>
                          <Button onClick={handleUploadDocument} className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500">
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-sand-200 rounded-lg hover:bg-sand-50 hover:border-sand-300 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-sand-400" />
                        <div>
                          <h4 className="font-medium text-black">{doc.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-sand-600 font-light">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>Modifié le {doc.lastModified}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(doc.status)} rounded-md`}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1">{doc.status}</span>
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-sand-600 font-light">
                          <Eye className="h-4 w-4" />
                          <span>{doc.views}</span>
                          <MessageSquare className="h-4 w-4 ml-2" />
                          <span>{doc.comments}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/download/${doc.id}`)
                              const result = await response.json()
                              
                              if (result.success && result.data.downloadUrl) {
                                // Ouvrir l'URL de téléchargement dans un nouvel onglet
                                window.open(result.data.downloadUrl, '_blank')
                              } else {
                                alert(`❌ Erreur: ${result.error || 'Impossible de télécharger le fichier'}`)
                              }
                            } catch (error) {
                              console.error('❌ Erreur téléchargement:', error)
                              alert("❌ Erreur lors du téléchargement")
                            }
                          }}
                          className="rounded-lg hover:bg-sand-500 hover:text-white"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun document pour cette phase</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border border-sand-200">
              <CardHeader>
                <CardTitle className="flex items-center font-black tracking-tighter text-black">
                  <Users className="h-5 w-5 mr-2 text-sand-400" />
                  Équipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Mock contributors since contributors is optional */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sand-500 rounded-full flex items-center justify-center text-white text-sm font-black">
                      MD
                    </div>
                    <div>
                      <p className="font-medium text-sm text-black">Marie Dubois</p>
                      <p className="text-xs text-sand-600 font-light">Architecte</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sand-500 rounded-full flex items-center justify-center text-white text-sm font-black">
                      JM
                    </div>
                    <div>
                      <p className="font-medium text-sm text-black">Jean Martin</p>
                      <p className="text-xs text-sand-600 font-light">Ingénieur</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border border-sand-200">
              <CardHeader>
                <CardTitle className="font-black tracking-tighter text-black">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 text-sm h-9">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager la phase
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 text-sm h-9">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger tout
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500 text-sm h-9">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Commentaires
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
