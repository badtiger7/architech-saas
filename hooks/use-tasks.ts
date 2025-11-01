import { useState, useEffect, useCallback } from 'react'
import { useApi } from '@/lib/api/client'
import type { TaskData, CreateTaskData, UpdateTaskData } from '@/lib/api/client'

interface UseTasksOptions {
  projectId?: string
  status?: string
  assigneeUserId?: string
}

export function useTasks(options: UseTasksOptions = {}) {
  const api = useApi()
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Destructure options to stabilize dependencies
  const { projectId, status, assigneeUserId } = options

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.tasks.list({ projectId, status, assigneeUserId })
      if (response.success && response.data) {
        setTasks(response.data)
      } else {
        setError(response.error || 'Erreur lors du chargement des tâches')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }, [api.tasks, projectId, status, assigneeUserId])

  // Create a new task
  const createTask = async (data: CreateTaskData) => {
    try {
      setError(null)
      const response = await api.tasks.create(data)
      
      if (response.success && response.data) {
        // Refresh to get complete data with joins
        await fetchTasks()
        
        return { success: true, data: response.data }
      } else {
        setError(response.error || 'Erreur lors de la création de la tâche')
        return { success: false, error: response.error }
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(error)
      return { success: false, error }
    }
  }

  // Update a task
  const updateTask = async (taskId: string, data: UpdateTaskData) => {
    try {
      setError(null)
      const response = await api.tasks.update(taskId, data)
      
      if (response.success && response.data) {
        // Refresh to get complete data with joins
        await fetchTasks()
        
        return { success: true, data: response.data }
      } else {
        setError(response.error || 'Erreur lors de la mise à jour de la tâche')
        return { success: false, error: response.error }
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      setError(error)
      return { success: false, error }
    }
  }

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      setError(null)
      const response = await api.tasks.delete(taskId)
      
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId))
        return { success: true }
      } else {
        setError(response.error || 'Erreur lors de la suppression de la tâche')
        return { success: false, error: response.error }
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      setError(error)
      return { success: false, error }
    }
  }

  // Load tasks when options change
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Helper to get tasks by status for Kanban
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  // Statistics
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
    getTasksByStatus,
    stats,
  }
} 