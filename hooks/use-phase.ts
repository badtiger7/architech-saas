'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/lib/api/client'

export interface PhaseDocument {
  id: string
  name: string
  type: string
  status: 'validated' | 'in-review' | 'pending' | 'rejected'
  size: string
  lastModified: string
  validator?: string | null
  comments: number
  views: number
  url?: string
}

export interface PhaseContributor {
  id: string
  name: string
  role: string
  avatar?: string
}

export interface PhaseDetails {
  id: string
  projectId: string
  name: string
  status: string
  startDate: string | null
  progressRatio: number
  orderIndex: number
  description?: string
  endDate?: string | null
  documents?: PhaseDocument[]
  contributors?: PhaseContributor[]
  validatedDocs?: number
  totalDocs?: number
}

export function usePhase(phaseId: string) {
  const [phase, setPhase] = useState<PhaseDetails | null>(null)
  const [documents, setDocuments] = useState<PhaseDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const api = useApi()

  // Fetch phase details
  const fetchPhase = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to find the phase by searching all projects
      // In a real app, you'd have a direct GET /api/phases/[id] endpoint
      // For now, we'll search through projects to find our phase
      
      try {
        // Get all projects and their phases to find our phase
        const projectsResponse = await fetch('/api/projects?organizationId=y1dz7q6fj91e3cf0i0p7t67d')
        const projectsData = await projectsResponse.json()
        
        let foundPhase = null
        let projectId = null
        
        if (projectsData.success && projectsData.data) {
          // Search through all projects to find the phase
          for (const project of projectsData.data) {
            const phasesResponse = await fetch(`/api/projects/${project.id}/phases`)
            const phasesData = await phasesResponse.json()
            
            if (phasesData.success && phasesData.data) {
              const phase = phasesData.data.find((p: any) => p.id === phaseId)
              if (phase) {
                foundPhase = phase
                projectId = project.id
                break
              }
            }
          }
        }
        
        if (!foundPhase) {
          throw new Error('Phase not found')
        }
        
                 // Create phase object with real data from API
         const realPhase: PhaseDetails = {
           id: foundPhase.id,
           projectId: projectId!, // This is the REAL project ID from the API
           name: foundPhase.name,
           status: foundPhase.status,
           startDate: foundPhase.startDate,
           progressRatio: foundPhase.progressRatio,
           orderIndex: foundPhase.orderIndex,
           description: foundPhase.description || `Description détaillée pour la phase ${foundPhase.name}.`, // ✅ Utilise la vraie description de l'API
           endDate: foundPhase.endDate // ✅ Maintenant on utilise la vraie valeur de l'API
         }
         

        
        setPhase(realPhase)
        
        // ✅ Charger les VRAIS documents depuis la base de données
        try {
          const docsResponse = await fetch(`/api/projects/${projectId}/phases/${phaseId}/documents`)
          const docsData = await docsResponse.json()
          
          if (docsData.success && docsData.data) {
            // Convertir les documents de la BDD au format PhaseDocument
            const realDocuments: PhaseDocument[] = docsData.data.map((doc: any) => ({
              id: doc.id,
              name: doc.title,
              type: doc.category === 'plan' ? 'Plan architectural' : 
                    doc.category === 'specification' ? 'Spécification' :
                    doc.category === 'photo' ? 'Photo' :
                    doc.category === 'report' ? 'Rapport' : 'Autre',
              status: 'pending' as const, // TODO: ajouter un vrai statut dans la BDD
              size: doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB` : '0 MB',
              lastModified: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('fr-FR') : '-',
              comments: 0, // TODO: compter les vrais commentaires
              views: 0, // TODO: compter les vraies vues
            }))
            
            setDocuments(realDocuments)
          } else {
            // Pas de documents pour cette phase
            setDocuments([])
          }
        } catch (docError) {
          console.error('Erreur chargement documents:', docError)
          setDocuments([])
        }
        
      } catch (apiError) {

        
        // Fallback to mock data if API fails
        const fallbackPhase: PhaseDetails = {
          id: phaseId,
          projectId: 'unknown',
          name: `Phase ${phaseId.slice(0, 8)}...`,
          status: 'pending',
          startDate: null,
          progressRatio: 0,
          orderIndex: 0,
          description: `Phase avec ID ${phaseId}`,
          endDate: null
        }
        
        setPhase(fallbackPhase)
        setDocuments([])
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la phase')
    } finally {
      setLoading(false)
    }
  }

  // Update phase
  const updatePhase = async (updates: any) => {
    if (!phase) {
      return { success: false, error: 'Aucune phase disponible' }
    }

    try {
      setError(null)
      
      // Call the real API to update the phase
      const response = await api.phases.update(phase.projectId, phase.id, updates)
      
      if (response.success) {
        // Update local state with the REAL response data from API
        if (response.data) {
          setPhase(prev => prev ? {
            ...prev,
            ...response.data, // Utiliser les vraies données de l'API
          } : null)
        } else {
          // Fallback si pas de data dans la réponse
          setPhase(prev => prev ? { ...prev, ...updates } : null)
        }
        
        // Recharger les données pour être sûr
        setTimeout(() => {
          fetchPhase()
        }, 100)
        
        return { success: true }
      } else {
        setError(response.error || 'Erreur lors de la mise à jour')
        return { success: false, error: response.error }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
      return { success: false, error: err instanceof Error ? err.message : 'Erreur' }
    }
  }

  // Add document - recharge les documents après l'ajout
  const addDocument = async (document: Omit<PhaseDocument, 'id'>) => {
    try {
      setError(null)
      
      // Recharger tous les documents depuis la BDD
      await fetchPhase()
      
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du document')
      return { success: false, error: err instanceof Error ? err.message : 'Erreur' }
    }
  }

  useEffect(() => {
    if (phaseId && phaseId.trim() !== '') {
      fetchPhase()
    }
  }, [phaseId])

  return {
    phase,
    documents,
    loading,
    error,
    updatePhase,
    addDocument,
    refetch: fetchPhase
  }
} 