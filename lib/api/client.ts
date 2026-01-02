import { z } from 'zod'
import { useMemo } from 'react'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Types for API responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

// Organization schemas
export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1),
})

export type Organization = z.infer<typeof OrganizationSchema>
export type CreateOrganizationData = z.infer<typeof CreateOrganizationSchema>

// Project schemas
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  clientName: z.string(),
  status: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  thumbnailUrl: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  clientName: z.string().min(1),
  organizationId: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type Project = z.infer<typeof ProjectSchema>
export type CreateProjectData = z.infer<typeof CreateProjectSchema>

// Phase schemas
export const PhaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['pending', 'in-progress', 'completed', 'blocked']),
  startDate: z.string().nullable(),
  progressRatio: z.number(),
  orderIndex: z.number(),
})

export const CreatePhaseSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().optional(),
  orderIndex: z.number().min(0),
})

export const UpdatePhaseSchema = z.object({
  name: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'blocked']).optional(),
  startDate: z.string().optional(),
  progressRatio: z.number().min(0).max(100).optional(),
})

export type Phase = z.infer<typeof PhaseSchema>
export type CreatePhaseData = z.infer<typeof CreatePhaseSchema>
export type UpdatePhaseData = z.infer<typeof UpdatePhaseSchema>

// Task schemas
export const TaskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeUserId: z.string().nullable(),
  dueDate: z.string().nullable(),
  estimatedHours: z.number(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Joined data from API
  projectName: z.string().nullable(),
  assignee: z.object({
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
    company: z.string(),
  }).nullable(),
})

export const CreateTaskSchema = z.object({
  projectId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assigneeUserId: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  tags: z.array(z.string()).optional(),
})

export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assigneeUserId: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  tags: z.array(z.string()).optional(),
})

export type TaskData = z.infer<typeof TaskSchema>
export type CreateTaskData = z.infer<typeof CreateTaskSchema>
export type UpdateTaskData = z.infer<typeof UpdateTaskSchema>

// Generic API client
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}/api${endpoint}`
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
          details: data.details,
        }
      }

      return data
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Organization endpoints
  async getOrganizations(): Promise<ApiResponse<Organization[]>> {
    return this.request('/organizations')
  }

  async createOrganization(data: CreateOrganizationData): Promise<ApiResponse<Organization>> {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Project endpoints
  async getProjects(organizationId: string): Promise<ApiResponse<Project[]>> {
    return this.request(`/projects?organizationId=${organizationId}`)
  }

  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.request(`/projects/${id}`)
  }

  async updateProject(
    id: string,
    data: Partial<CreateProjectData>
  ): Promise<ApiResponse<Project>> {
    return this.request(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Phase endpoints
  async getPhases(projectId: string): Promise<ApiResponse<Phase[]>> {
    return this.request(`/projects/${projectId}/phases`)
  }

  async createPhase(projectId: string, data: CreatePhaseData): Promise<ApiResponse<Phase>> {
    return this.request(`/projects/${projectId}/phases`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePhase(
    projectId: string, 
    phaseId: string, 
    data: UpdatePhaseData
  ): Promise<ApiResponse<Phase>> {
    return this.request(`/projects/${projectId}/phases/${phaseId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deletePhase(projectId: string, phaseId: string): Promise<ApiResponse<void>> {
    return this.request(`/projects/${projectId}/phases/${phaseId}`, {
      method: 'DELETE',
    })
  }

  // Task endpoints
  async getTasks(params?: { projectId?: string; status?: string; assigneeUserId?: string }): Promise<ApiResponse<TaskData[]>> {
    const searchParams = new URLSearchParams()
    if (params?.projectId) searchParams.append('projectId', params.projectId)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.assigneeUserId) searchParams.append('assigneeUserId', params.assigneeUserId)
    
    const queryString = searchParams.toString()
    return this.request(`/tasks${queryString ? `?${queryString}` : ''}`)
  }

  async createTask(data: CreateTaskData): Promise<ApiResponse<TaskData>> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTask(taskId: string): Promise<ApiResponse<TaskData>> {
    return this.request(`/tasks/${taskId}`)
  }

  async updateTask(taskId: string, data: UpdateTaskData): Promise<ApiResponse<TaskData>> {
    return this.request(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(taskId: string): Promise<ApiResponse<void>> {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// React hooks for API calls
export const useApi = () => {
  return useMemo(() => ({
    organizations: {
      list: () => apiClient.getOrganizations(),
      create: (data: CreateOrganizationData) => apiClient.createOrganization(data),
    },
    projects: {
      list: (organizationId: string) => apiClient.getProjects(organizationId),
      create: (data: CreateProjectData) => apiClient.createProject(data),
      get: (id: string) => apiClient.getProject(id),
      update: (id: string, data: Partial<CreateProjectData>) =>
        apiClient.updateProject(id, data),
      delete: (id: string) => apiClient.deleteProject(id),
    },
    phases: {
      list: (projectId: string) => apiClient.getPhases(projectId),
      create: (projectId: string, data: CreatePhaseData) => 
        apiClient.createPhase(projectId, data),
      update: (projectId: string, phaseId: string, data: UpdatePhaseData) => 
        apiClient.updatePhase(projectId, phaseId, data),
      delete: (projectId: string, phaseId: string) => 
        apiClient.deletePhase(projectId, phaseId),
    },
    tasks: {
      list: (params?: { projectId?: string; status?: string; assigneeUserId?: string }) => 
        apiClient.getTasks(params),
      create: (data: CreateTaskData) => 
        apiClient.createTask(data),
      get: (taskId: string) => 
        apiClient.getTask(taskId),
      update: (taskId: string, data: UpdateTaskData) => 
        apiClient.updateTask(taskId, data),
      delete: (taskId: string) => 
        apiClient.deleteTask(taskId),
    },
  }), [])
} 