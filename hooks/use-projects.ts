'use client'

import { useState, useEffect } from 'react'
import { useApi, type Project, type CreateProjectData } from '@/lib/api/client'
import { toast } from 'sonner'

export function useProjects(organizationId: string | null) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const api = useApi()

  // Fetch projects
  const fetchProjects = async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.projects.list(organizationId)
      
      if (response.success && response.data) {
        setProjects(response.data)
      } else {
        setError(response.error || 'Failed to fetch projects')
        toast.error('Erreur lors du chargement des projets')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // Create project
  const createProject = async (data: CreateProjectData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.projects.create(data)
      
      if (response.success && response.data) {
        setProjects(prev => [...prev, response.data!])
        toast.success('Projet créé avec succès')
        return response.data
      } else {
        setError(response.error || 'Failed to create project')
        toast.error('Erreur lors de la création du projet')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      toast.error('Erreur de connexion')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update project
  const updateProject = async (id: string, data: Partial<CreateProjectData>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.projects.update(id, data)
      
      if (response.success && response.data) {
        setProjects(prev => 
          prev.map(project => 
            project.id === id ? response.data! : project
          )
        )
        toast.success('Projet mis à jour')
        return response.data
      } else {
        setError(response.error || 'Failed to update project')
        toast.error('Erreur lors de la mise à jour')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      toast.error('Erreur de connexion')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete project
  const deleteProject = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.projects.delete(id)
      
      if (response.success) {
        setProjects(prev => prev.filter(project => project.id !== id))
        toast.success('Projet supprimé')
        return true
      } else {
        setError(response.error || 'Failed to delete project')
        toast.error('Erreur lors de la suppression')
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      toast.error('Erreur de connexion')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Fetch projects when organizationId changes
  useEffect(() => {
    fetchProjects()
  }, [organizationId])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
} 