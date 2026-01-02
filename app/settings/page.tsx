"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Bell, Shield, Users, Trash2, Plus, Edit, Eye, EyeOff } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@architech.com",
    role: "Architecte",
    company: "Architech",
    phone: "+33 1 23 45 67 89",
  })

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Résidence Les Jardins",
      role: "Architecte principal",
      permissions: ["read", "write", "admin"],
      joinedAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Bureaux Tech Center",
      role: "Architecte",
      permissions: ["read", "write"],
      joinedAt: "2024-01-10",
    },
    {
      id: 3,
      name: "Villa Moderne",
      role: "Collaborateur",
      permissions: ["read"],
      joinedAt: "2024-01-15",
    },
  ])

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    deadline: true,
    document: true,
    meeting: true,
    annotation: false,
    validation: true,
  })

  const getPermissionBadge = (permissions: string[]) => {
    if (permissions.includes("admin")) {
      return <Badge className="bg-sand-500 text-white rounded-md">Administrateur</Badge>
    } else if (permissions.includes("write")) {
      return <Badge className="border border-sand-200 bg-sand-50 text-sand-700 rounded-md">Écriture</Badge>
    } else {
      return <Badge variant="secondary" className="border border-sand-200 bg-sand-50 text-sand-600 rounded-md">Lecture seule</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 border-b-2 border-sand-200 pb-6">
          <h1 className="font-caveat text-5xl md:text-6xl font-bold text-black mb-2">Paramètres</h1>
          <p className="text-sand-600 font-light">Gérez votre profil et vos préférences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Users className="h-4 w-4 mr-2" />
              Projets
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>Mettez à jour vos informations de profil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">Rôle</Label>
                        <Select value={profile.role} onValueChange={(value) => setProfile({ ...profile, role: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Architecte">Architecte</SelectItem>
                            <SelectItem value="Collaborateur">Collaborateur</SelectItem>
                            <SelectItem value="Bureau d'étude">Bureau d'étude</SelectItem>
                            <SelectItem value="Client">Client</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="company">Entreprise</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500">Sauvegarder les modifications</Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Photo de profil</CardTitle>
                    <CardDescription>Changez votre photo de profil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                        <AvatarFallback className="text-2xl">
                          {profile.firstName[0]}
                          {profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full bg-transparent rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500">
                        Changer la photo
                      </Button>
                      <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50 rounded-lg">
                        Supprimer la photo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Projets actifs</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Documents uploadés</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Membre depuis</span>
                      <span className="font-medium">Jan 2024</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mes projets</CardTitle>
                    <CardDescription>Gérez vos accès et permissions sur les projets</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500">
                        <Plus className="h-4 w-4 mr-2" />
                        Rejoindre un projet
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg border-2 border-sand-200">
                      <DialogHeader>
                        <DialogTitle className="font-black tracking-tighter text-black">Rejoindre un projet</DialogTitle>
                        <div className="w-12 h-0.5 bg-sand-500 mb-3"></div>
                        <DialogDescription className="text-sand-600 font-light">Entrez le code d'invitation pour rejoindre un projet</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="inviteCode" className="text-xs font-medium text-sand-700 uppercase tracking-wide">Code d'invitation</Label>
                          <Input id="inviteCode" placeholder="ABC123DEF" className="rounded-lg border-2 border-sand-200 focus:border-sand-500 text-sm" />
                        </div>
                        <Button className="w-full bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500">Rejoindre le projet</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{project.role}</span>
                          <span>•</span>
                          <span>Rejoint le {new Date(project.joinedAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getPermissionBadge(project.permissions)}
                        <Button variant="outline" size="sm" className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de notification</CardTitle>
                  <CardDescription>Choisissez comment recevoir vos notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notifications par email</Label>
                      <p className="text-sm text-gray-500">Recevez les notifications importantes par email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Notifications push</Label>
                      <p className="text-sm text-gray-500">Notifications en temps réel dans le navigateur</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Types de notifications</CardTitle>
                  <CardDescription>Personnalisez les types de notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="deadline-notifications">Échéances</Label>
                      <p className="text-sm text-gray-500">Rappels pour les dates limites</p>
                    </div>
                    <Switch
                      id="deadline-notifications"
                      checked={notifications.deadline}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, deadline: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="document-notifications">Nouveaux documents</Label>
                      <p className="text-sm text-gray-500">Alertes lors de l'ajout de documents</p>
                    </div>
                    <Switch
                      id="document-notifications"
                      checked={notifications.document}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, document: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="meeting-notifications">Réunions</Label>
                      <p className="text-sm text-gray-500">Rappels de réunions et événements</p>
                    </div>
                    <Switch
                      id="meeting-notifications"
                      checked={notifications.meeting}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, meeting: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="validation-notifications">Validations</Label>
                      <p className="text-sm text-gray-500">Demandes de validation de documents</p>
                    </div>
                    <Switch
                      id="validation-notifications"
                      checked={notifications.validation}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, validation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="annotation-notifications">Annotations</Label>
                      <p className="text-sm text-gray-500">Nouvelles annotations sur documents</p>
                    </div>
                    <Switch
                      id="annotation-notifications"
                      checked={notifications.annotation}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, annotation: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Button className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500">Sauvegarder les préférences</Button>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Changer le mot de passe</CardTitle>
                  <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input id="currentPassword" type={showPassword ? "text" : "password"} className="pr-10" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>

                  <Button className="bg-sand-500 text-white hover:bg-sand-600 rounded-lg border-2 border-sand-500">Changer le mot de passe</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>Gérez la sécurité de votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Authentification à deux facteurs</Label>
                      <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500">
                      Activer
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sessions actives</Label>
                      <p className="text-sm text-sand-600 font-light">Gérez vos sessions de connexion</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500">
                      Voir les sessions
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Télécharger mes données</Label>
                      <p className="text-sm text-sand-600 font-light">Exportez toutes vos données</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg border-2 border-sand-200 hover:bg-sand-500 hover:text-white hover:border-sand-500">
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-red-600">Zone de danger</CardTitle>
                  <CardDescription>Actions irréversibles sur votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-900">Supprimer le compte</h4>
                      <p className="text-sm text-red-700">
                        Supprimez définitivement votre compte et toutes vos données
                      </p>
                    </div>
                    <Button variant="destructive">Supprimer le compte</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
