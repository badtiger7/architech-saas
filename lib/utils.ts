import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Architech Status Colors Utilities
export const statusColors = {
  completed: "bg-success text-success-foreground",
  "in-progress": "bg-warning text-warning-foreground", 
  pending: "bg-muted text-muted-foreground",
  blocked: "bg-danger text-danger-foreground",
  validated: "bg-success text-success-foreground",
  "in-review": "bg-warning text-warning-foreground",
  rejected: "bg-danger text-danger-foreground",
  active: "bg-primary text-primary-foreground",
  default: "bg-muted text-muted-foreground"
} as const

export const statusBorderColors = {
  completed: "border-success",
  "in-progress": "border-warning",
  pending: "border-muted-foreground",
  blocked: "border-danger", 
  validated: "border-success",
  "in-review": "border-warning",
  rejected: "border-danger",
  active: "border-primary",
  default: "border-muted-foreground"
} as const

export const statusBgColors = {
  completed: "bg-success/10",
  "in-progress": "bg-warning/10",
  pending: "bg-muted",
  blocked: "bg-danger/10",
  validated: "bg-success/10", 
  "in-review": "bg-warning/10",
  rejected: "bg-danger/10",
  active: "bg-primary/10",
  default: "bg-muted"
} as const

export type StatusType = keyof typeof statusColors

export function getStatusClasses(status: StatusType) {
  return {
    badge: statusColors[status] || statusColors.default,
    border: statusBorderColors[status] || statusBorderColors.default,
    background: statusBgColors[status] || statusBgColors.default
  }
}

export function getProjectStatusClasses(status: string) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-') as StatusType
  return getStatusClasses(normalizedStatus)
}
