"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Clock,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Settings,
  Trash2,
  BookMarkedIcon as MarkAsRead,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "deadline",
      title: "Échéance APD - Résidence Les Jardins",
      message: "La phase APD se termine dans 3 jours. Assurez-vous que tous les documents sont validés.",
      time: "Il y a 1h",
      read: false,
      urgent: true,
      project: "Résidence Les Jardins",
    },
    {
      id: 2,
      type: "document",
      title: "Nouveau document ajouté",
      message: "Marie Leroy a ajouté 'Rapport Structure.pdf' au projet Bureaux Tech Center",
      time: "Il y a 2h",
      read: false,
      urgent: false,
      project: "Bureaux Tech Center",
    },
    {
      id: 3,
      type: "validation",
      title: "Validation requise",
      message: "Les plans de façade nécessitent votre validation pour passer à l'étape suivante",
      time: "Il y a 3h",
      read: false,
      urgent: true,
      project: "Villa Moderne",
    },
    {
      id: 4,
      type: "meeting",
      title: "Rappel de réunion",
      message: "Réunion de chantier prévue demain à 14h00 sur le site des Jardins",
      time: "Il y a 4h",
      read: true,
      urgent: false,
      project: "Résidence Les Jardins",
    },
    {
      id: 5,
      type: "annotation",
      title: "Nouvelle annotation",
      message: "Paul Leroy a ajouté une annotation sur le plan de masse",
      time: "Hier",
      read: true,
      urgent: false,
      project: "Villa Moderne",
    },
    {
      id: 6,
      type: "document",
      title: "Document mis à jour",
      message: "Version 2.3 des plans de façade disponible",
      time: "Hier",
      read: true,
      urgent: false,
      project: "Résidence Les Jardins",
    },
  ])

  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    deadline: true,
    document: true,
    meeting: true,
    annotation: false,
    validation: true,
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "meeting":
        return <Users className="h-5 w-5 text-green-500" />
      case "validation":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "annotation":
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const urgentNotifications = notifications.filter((n) => n.urgent && !n.read)
  const regularNotifications = notifications.filter((n) => !n.urgent)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-caveat text-5xl md:text-6xl font-bold text-gray-900">Centre de Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0
                ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
                : "Toutes les notifications sont lues"}
            </p>
          </div>
          <div className="flex space-x-3">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <MarkAsRead className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
            <TabsTrigger value="urgent">Urgentes ({urgentNotifications.length})</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Préférences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                  <p className="text-gray-500 text-center">
                    Vous êtes à jour ! Les nouvelles notifications apparaîtront ici.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${!notification.read ? "ring-2 ring-blue-500 bg-blue-50/30" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                              {notification.urgent && (
                                <Badge variant="destructive" className="text-xs">
                                  Urgent
                                </Badge>
                              )}
                              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{notification.time}</span>
                              <span>•</span>
                              <span>{notification.project}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="urgent" className="space-y-4">
            {urgentNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification urgente</h3>
                  <p className="text-gray-500 text-center">
                    Parfait ! Vous n'avez aucune notification urgente en attente.
                  </p>
                </CardContent>
              </Card>
            ) : (
              urgentNotifications.map((notification) => (
                <Card key={notification.id} className="ring-2 ring-red-500 bg-red-50/30">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{notification.time}</span>
                              <span>•</span>
                              <span>{notification.project}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de notification</CardTitle>
                  <CardDescription>Choisissez comment vous souhaitez recevoir les notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notifications par email</Label>
                      <p className="text-sm text-gray-500">Recevez les notifications importantes par email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.email}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Notifications push</Label>
                      <p className="text-sm text-gray-500">Notifications en temps réel dans le navigateur</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={preferences.push}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, push: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Types de notifications</CardTitle>
                  <CardDescription>
                    Personnalisez les types de notifications que vous souhaitez recevoir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="deadline-notifications">Échéances</Label>
                      <p className="text-sm text-gray-500">Rappels pour les dates limites importantes</p>
                    </div>
                    <Switch
                      id="deadline-notifications"
                      checked={preferences.deadline}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, deadline: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="document-notifications">Nouveaux documents</Label>
                      <p className="text-sm text-gray-500">Alertes lors de l'ajout de nouveaux documents</p>
                    </div>
                    <Switch
                      id="document-notifications"
                      checked={preferences.document}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, document: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="meeting-notifications">Réunions</Label>
                      <p className="text-sm text-gray-500">Rappels de réunions et événements</p>
                    </div>
                    <Switch
                      id="meeting-notifications"
                      checked={preferences.meeting}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, meeting: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="validation-notifications">Validations</Label>
                      <p className="text-sm text-gray-500">Demandes de validation de documents</p>
                    </div>
                    <Switch
                      id="validation-notifications"
                      checked={preferences.validation}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, validation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="annotation-notifications">Annotations</Label>
                      <p className="text-sm text-gray-500">Nouvelles annotations sur les documents</p>
                    </div>
                    <Switch
                      id="annotation-notifications"
                      checked={preferences.annotation}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, annotation: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Button>Sauvegarder les préférences</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
